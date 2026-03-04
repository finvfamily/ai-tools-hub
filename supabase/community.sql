-- ============================================================
-- AI Tools Hub - Community Schema
-- Run this in Supabase SQL Editor after schema.sql
-- ============================================================

-- Community users (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS community_users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id     uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username    text UNIQUE NOT NULL,
  avatar_url  text,
  bio         text,
  github_url  text,
  post_count  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Nodes (discussion categories)
CREATE TABLE IF NOT EXISTS nodes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text,
  icon        text,
  topic_count int DEFAULT 0,
  sort_order  int DEFAULT 0
);

-- Topics (posts)
CREATE TABLE IF NOT EXISTS topics (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  content       text NOT NULL,
  node_id       uuid REFERENCES nodes(id) ON DELETE SET NULL,
  user_id       uuid REFERENCES community_users(id) ON DELETE CASCADE,
  view_count    int DEFAULT 0,
  reply_count   int DEFAULT 0,
  like_count    int DEFAULT 0,
  last_reply_at timestamptz DEFAULT now(),
  created_at    timestamptz DEFAULT now()
);

-- Replies
CREATE TABLE IF NOT EXISTS replies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id   uuid REFERENCES topics(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES community_users(id) ON DELETE CASCADE,
  content    text NOT NULL,
  like_count int DEFAULT 0,
  floor      int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Likes (topics + replies)
CREATE TABLE IF NOT EXISTS likes (
  user_id     uuid REFERENCES community_users(id) ON DELETE CASCADE,
  target_id   uuid NOT NULL,
  target_type text CHECK (target_type IN ('topic', 'reply')),
  created_at  timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, target_id)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_topics_node_id       ON topics(node_id);
CREATE INDEX IF NOT EXISTS idx_topics_user_id       ON topics(user_id);
CREATE INDEX IF NOT EXISTS idx_topics_last_reply_at ON topics(last_reply_at DESC);
CREATE INDEX IF NOT EXISTS idx_topics_like_count    ON topics(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_replies_topic_id     ON replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_replies_floor        ON replies(topic_id, floor);

-- ============================================================
-- Auto increment reply floor per topic
-- ============================================================
CREATE OR REPLACE FUNCTION set_reply_floor()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(floor), 0) + 1
    INTO NEW.floor
    FROM replies WHERE topic_id = NEW.topic_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS replies_set_floor   ON replies;
DROP TRIGGER IF EXISTS topics_reply_count  ON replies;
DROP TRIGGER IF EXISTS nodes_topic_count   ON topics;
DROP TRIGGER IF EXISTS users_post_count    ON topics;

CREATE TRIGGER replies_set_floor
  BEFORE INSERT ON replies
  FOR EACH ROW EXECUTE FUNCTION set_reply_floor();

-- Auto update topic reply_count + last_reply_at
CREATE OR REPLACE FUNCTION update_topic_on_reply()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE topics
    SET reply_count   = reply_count + 1,
        last_reply_at = now()
    WHERE id = NEW.topic_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER topics_reply_count
  AFTER INSERT ON replies
  FOR EACH ROW EXECUTE FUNCTION update_topic_on_reply();

-- Auto update node topic_count
CREATE OR REPLACE FUNCTION update_node_topic_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE nodes SET topic_count = topic_count + 1 WHERE id = NEW.node_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE nodes SET topic_count = topic_count - 1 WHERE id = OLD.node_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER nodes_topic_count
  AFTER INSERT OR DELETE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_node_topic_count();

-- Auto update user post_count
CREATE OR REPLACE FUNCTION update_user_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_users SET post_count = post_count + 1 WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_users SET post_count = post_count - 1 WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_post_count
  AFTER INSERT OR DELETE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_user_post_count();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE community_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics          ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies         ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes           ENABLE ROW LEVEL SECURITY;

-- community_users
CREATE POLICY "public read users"     ON community_users FOR SELECT USING (true);
CREATE POLICY "insert own user"       ON community_users FOR INSERT WITH CHECK (auth.uid() = auth_id);
CREATE POLICY "update own user"       ON community_users FOR UPDATE USING (auth.uid() = auth_id);

-- nodes
CREATE POLICY "public read nodes"     ON nodes FOR SELECT USING (true);

-- topics
CREATE POLICY "public read topics"    ON topics FOR SELECT USING (true);
CREATE POLICY "auth insert topic"     ON topics FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT auth_id FROM community_users WHERE id = user_id)
);
CREATE POLICY "owner delete topic"    ON topics FOR DELETE USING (
  auth.uid() IN (SELECT auth_id FROM community_users WHERE id = user_id)
);

-- replies
CREATE POLICY "public read replies"   ON replies FOR SELECT USING (true);
CREATE POLICY "auth insert reply"     ON replies FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT auth_id FROM community_users WHERE id = user_id)
);
CREATE POLICY "owner delete reply"    ON replies FOR DELETE USING (
  auth.uid() IN (SELECT auth_id FROM community_users WHERE id = user_id)
);

-- likes
CREATE POLICY "public read likes"     ON likes FOR SELECT USING (true);
CREATE POLICY "auth insert like"      ON likes FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT auth_id FROM community_users WHERE id = user_id)
);
CREATE POLICY "auth delete like"      ON likes FOR DELETE USING (
  auth.uid() IN (SELECT auth_id FROM community_users WHERE id = user_id)
);

-- ============================================================
-- Seed: Initial Nodes
-- ============================================================
INSERT INTO nodes (name, slug, description, icon, sort_order) VALUES
  ('展示台',   'showcase',  '展示你用 AI 做的项目、作品和创意成果', '🎨', 1),
  ('创意工坊', 'creative',  '分享 AI idea、脑洞和有趣的实验',       '💡', 2),
  ('工具讨论', 'tools',     '某个 AI 工具的使用心得和技巧交流',     '🛠️', 3),
  ('教程分享', 'tutorial',  '手把手教程、Prompt 技巧和工作流分享',  '📖', 4),
  ('问与答',   'ask',       '遇到问题？在这里向社区寻求帮助',       '🙋', 5),
  ('招募合作', 'recruit',   '寻找 AI 项目合伙人、协作者',           '🤝', 6),
  ('随便聊聊', 'general',   '和志同道合的人聊聊 AI 相关的一切',     '💬', 7)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- RPCs
-- ============================================================
CREATE OR REPLACE FUNCTION increment_topic_views(topic_id uuid)
RETURNS void AS $$
  UPDATE topics SET view_count = view_count + 1 WHERE id = topic_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_like_count(row_id uuid, row_table text)
RETURNS void AS $$
BEGIN
  IF row_table = 'topics' THEN
    UPDATE topics SET like_count = like_count + 1 WHERE id = row_id;
  ELSIF row_table = 'replies' THEN
    UPDATE replies SET like_count = like_count + 1 WHERE id = row_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_like_count(row_id uuid, row_table text)
RETURNS void AS $$
BEGIN
  IF row_table = 'topics' THEN
    UPDATE topics SET like_count = GREATEST(like_count - 1, 0) WHERE id = row_id;
  ELSIF row_table = 'replies' THEN
    UPDATE replies SET like_count = GREATEST(like_count - 1, 0) WHERE id = row_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
