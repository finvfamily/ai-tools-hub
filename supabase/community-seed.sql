-- ============================================================
-- Community Mock Data — V2EX style
-- Run AFTER community.sql
-- ============================================================

-- Mock users (auth_id = NULL for seed accounts, allowed by schema)
INSERT INTO community_users (id, username, avatar_url, bio) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'geekdong',    'https://api.dicebear.com/7.x/pixel-art/svg?seed=geekdong',    'Full-stack dev，喜欢用 AI 做没用但有趣的东西'),
  ('a1000000-0000-0000-0000-000000000002', 'promptwitch',  'https://api.dicebear.com/7.x/pixel-art/svg?seed=promptwitch',  'Prompt 工程师 / 独立开发者，在做 AI 写作工具'),
  ('a1000000-0000-0000-0000-000000000003', 'aibuilder42',  'https://api.dicebear.com/7.x/pixel-art/svg?seed=aibuilder42',  '连续创业者，这次想做 AI'),
  ('a1000000-0000-0000-0000-000000000004', 'nocodelee',    'https://api.dicebear.com/7.x/pixel-art/svg?seed=nocodelee',    'No-code 爱好者，副业做 AI 小工具'),
  ('a1000000-0000-0000-0000-000000000005', 'wanderingcat', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=wanderingcat', '设计师转 AI 方向，摸索中'),
  ('a1000000-0000-0000-0000-000000000006', 'llmhack',      'https://api.dicebear.com/7.x/pixel-art/svg?seed=llmhack',      'LLM 应用开发 / 算法，喜欢测评各种模型')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 展示台 (showcase)
-- ============================================================

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '用 Claude API 做了个中文古诗生成器，支持律诗、词牌、绝句',
  E'断断续续做了两周，终于跑通了，分享一下思路。\n\n**核心逻辑**\n\n用 Claude 的 system prompt 锁定诗歌风格和平仄规则，user prompt 里传入用户选择的意象、情绪和体裁，让模型在约束条件下生成。律诗的对仗和押韵是最难的，试了十几个 prompt 才稳定下来。\n\n```\nSystem: 你是一位精通唐诗宋词的古典文学专家。\n生成律诗时必须严格遵守：首联、颔联、颈联、尾联的格律...\n```\n\n**效果**\n\n生成质量比我预期的高很多，Claude 对汉字声调的理解比 GPT 好一截。偶尔会出现仄韵混用的问题，加了一个后处理检查层基本解决了。\n\n代码开源在 GitHub，感兴趣的可以看看。',
  (SELECT id FROM nodes WHERE slug = 'showcase'),
  'a1000000-0000-0000-0000-000000000001',
  412, 31, now() - interval '45 minutes', now() - interval '8 hours'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '用一个周末 + GPT-4o Vision 做了个菜谱识别 App，识别率还不错',
  E'起因是每次看到朋友发的菜照片就想知道怎么做，于是就做了这个。\n\n**技术栈**\n\n- Next.js 14 + TypeScript\n- GPT-4o Vision API（识别食材 + 推断菜名）\n- Claude 生成完整食谱步骤\n- Vercel 部署\n\n**踩坑记录**\n\n1. 图片压缩：直接传原图会超 token 限制，加了个客户端压缩到 800px 宽\n2. 识别准确率：家常菜准确率约 85%，创意菜（比如融合料理）会乱猜\n3. 费用：GPT-4o Vision 比预期贵，平均每次识别约 $0.02，考虑换 Claude\n\n目前是完全免费的，每天有 200 次额度限制，链接在 profile 里。',
  (SELECT id FROM nodes WHERE slug = 'showcase'),
  'a1000000-0000-0000-0000-000000000003',
  287, 19, now() - interval '2 hours', now() - interval '1 day'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '开源了一个 AI 简历优化工具，两天涨了 300 star',
  E'做了一个针对 JD（岗位描述）自动优化简历的工具，没想到反应比较好，分享一下。\n\n**核心功能**\n\n把你的简历和目标岗位的 JD 同时扔给 Claude，它会：\n1. 分析 JD 里的关键词和技能要求\n2. 对比你简历里的匹配度\n3. 给出具体的修改建议（不是笼统的「丰富项目描述」）\n4. 可选：直接帮你重写对应段落\n\n**效果反馈**\n\n有用户反馈用了之后面试通过率从 20% 提升到 40%+，我自己测试几个 case 效果还可以。但要注意：AI 会让简历「更匹配」但不会造假，建议只用于措辞优化而不是虚构经历。\n\nGitHub 链接在 bio 里，欢迎 PR。',
  (SELECT id FROM nodes WHERE slug = 'showcase'),
  'a1000000-0000-0000-0000-000000000006',
  634, 47, now() - interval '30 minutes', now() - interval '2 days'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '用 Midjourney + Runway Gen-3 做了个 30 秒短片，成本大概 $8',
  E'一直想试试 AI 做视频，这次认真做了一下，分享成本和流程。\n\n**制作流程**\n\n1. Claude 写分镜脚本（5 个场景）\n2. Midjourney 生成每个场景的关键帧（每张 $0.08，共 15 张）\n3. Runway Gen-3 Alpha 把关键帧转成 4 秒视频片段（每段约 $0.50）\n4. CapCut 剪辑 + 配乐\n\n**总成本**\n- Midjourney：约 $1.2\n- Runway：约 $5（生成了 10 个片段，用了 7 个）\n- 配乐：Suno 免费版\n\n**感受**\n\n画面质量超预期，但人物动作连贯性还是个问题，Runway 生成人物走动容易变形。适合做氛围片、产品展示，不适合对白戏剧类内容。',
  (SELECT id FROM nodes WHERE slug = 'showcase'),
  'a1000000-0000-0000-0000-000000000005',
  521, 38, now() - interval '3 hours', now() - interval '3 days'
);

-- ============================================================
-- 创意工坊 (creative)
-- ============================================================

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '如果给你无限 API 额度，你会做什么？',
  E'今天发散一下思维，纯聊想法。\n\n我自己最想做的是一个「AI 读书伴侣」：把你读的书实时喂给 LLM，它会在你读到某个概念时自动联想到其他书里的相关内容，形成一张知识网络。现在 context window 不够大，有了无限额度就没有这个约束了。\n\n你们呢？',
  (SELECT id FROM nodes WHERE slug = 'creative'),
  'a1000000-0000-0000-0000-000000000004',
  356, 28, now() - interval '1 hour', now() - interval '6 hours'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '想做一个「AI 日记本」，每天根据你写的内容生成洞察，可行吗？',
  E'产品构想：用户每天写日记，AI 在背后做以下事情：\n\n1. **情绪追踪**：识别情绪变化趋势，生成周报\n2. **模式发现**：发现你反复提到的困扰、目标\n3. **主动提问**：读到某段内容时主动问「你当时的感受是什么？」\n4. **年度总结**：年底自动生成一份有深度的年度回顾\n\n**我的顾虑**\n\n- 隐私问题：日记内容非常私密，用户愿意上传吗？本地部署可行性？\n- 变现：订阅制还是一次性买断？$5/月 有没有人付？\n- 差异化：Day One、Notion AI 已经在做类似的事\n\n有没有做过类似产品的朋友，聊聊坑在哪？',
  (SELECT id FROM nodes WHERE slug = 'creative'),
  'a1000000-0000-0000-0000-000000000005',
  298, 22, now() - interval '4 hours', now() - interval '12 hours'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '能不能用 LLM 替代传统爬虫做数据提取？实测结果分享',
  E'最近在做一个竞品监控工具，尝试了用 LLM 直接从原始 HTML 提取结构化数据，分享一下结论。\n\n**测试方案**\n\n传统方案：写 CSS selector + 定期维护\nLLM 方案：把 HTML 扔给 Claude，让它返回 JSON\n\n**结论**\n\n✅ LLM 方案的优势：\n- 不需要维护 selector，页面改版后自动适应\n- 对非结构化文本（如用户评论情感分析）效果好\n- 开发速度快 10 倍\n\n❌ LLM 方案的劣势：\n- 成本：处理一个页面约 $0.01–0.05，大规模爬取不现实\n- 速度：比传统爬虫慢 5–10 倍\n- 稳定性：偶尔返回格式不对，需要重试逻辑\n\n**我的结论**：小规模、低频率的数据提取用 LLM 很香；大规模爬取还是用传统方案 + LLM 做后处理。',
  (SELECT id FROM nodes WHERE slug = 'creative'),
  'a1000000-0000-0000-0000-000000000002',
  445, 34, now() - interval '2 hours', now() - interval '1 day'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  'AI 帮我规划了一个月健身计划，执行一个月后的真实反馈',
  E'之前试过让 Claude 充当私教给我制定健身计划，执行了一个月，来汇报一下。\n\n**我的情况**：男，久坐办公室，每周可以健身 3 次，目标是增肌减脂，没有受伤史。\n\n**Claude 给的计划亮点**：\n- 区分了训练日和恢复日，不会每天都练\n- 根据我说的「不喜欢跑步」换成了游泳和跳绳\n- 每周有一次 deload（减量）周\n- 饮食建议是「高蛋白、不用精确计算卡路里」，适合懒人\n\n**一个月成果**：体重 -1.5kg，体脂肉眼可见下降，力量有提升。\n\n唯一问题是 AI 不会实时看你的动作纠正姿势，这块还是需要线下解决。总体来说比我自己乱练效果好很多。',
  (SELECT id FROM nodes WHERE slug = 'creative'),
  'a1000000-0000-0000-0000-000000000001',
  189, 15, now() - interval '6 hours', now() - interval '2 days'
);

-- ============================================================
-- 工具讨论 (tools)
-- ============================================================

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '用了三个月 Cursor，说说真实感受（不是广告）',
  E'从去年开始用 Cursor，现在是主力编辑器了，说说优缺点。\n\n**真正好用的地方**\n\n- `Cmd+K` 内联编辑：选中代码直接说「重构这个函数」，比 Copilot 的 inline chat 流畅很多\n- Composer（多文件编辑）：说「在这个 API route 里加上错误处理，同时更新对应的类型定义」，它会同时改多个文件\n- `.cursorrules` 文件：把项目规范写进去，AI 会自动遵守\n\n**没那么好用的地方**\n\n- Tab 补全有时太激进，经常补出一大段我不需要的代码\n- 对非主流框架（比如 SolidJS）的理解比 Next.js 差很多\n- 每个月 $20，用量大的话会超额\n\n**结论**：写新项目首选 Cursor，维护老项目（特别是没有好文档的）还是得靠自己。',
  (SELECT id FROM nodes WHERE slug = 'tools'),
  'a1000000-0000-0000-0000-000000000003',
  687, 52, now() - interval '20 minutes', now() - interval '4 hours'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  'Claude 3.5 Sonnet vs GPT-4o 代码能力横评，测了 20 个真实任务',
  E'用了两周时间，拿手头的真实项目做了对比测试，不是 benchmark，是实际干活的感受。\n\n**测试维度**\n- 写新代码（10 个任务）\n- Debug（5 个任务）  \n- 代码审查（5 个任务）\n\n**结论速览**\n\n| 维度 | Claude 3.5 Sonnet | GPT-4o |\n|------|-----------------|--------|\n| 写新代码 | ✅ 更好 | 🟡 稍弱 |\n| Debug | ✅ 明显更好 | ❌ 容易绕弯路 |\n| 代码审查 | ✅ 更细致 | 🟡 偏表面 |\n| 遵循指令 | ✅ 更准确 | 🟡 偶尔跑偏 |\n| 速度 | 🟡 稍慢 | ✅ 更快 |\n\n**我的建议**：写代码用 Claude，需要快速迭代原型用 GPT-4o。两个都开着轮换用是目前最优解。',
  (SELECT id FROM nodes WHERE slug = 'tools'),
  'a1000000-0000-0000-0000-000000000006',
  824, 61, now() - interval '1 hour', now() - interval '1 day'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  'Perplexity 用了两个月，真的能取代 Google 吗？',
  E'结论先放这里：**能取代 70% 的 Google 使用场景，但不是全部。**\n\n**Perplexity 明显更好的场景**\n- 技术问题（「Next.js 15 里怎么用 cookies」）\n- 综合性问题（「2024 年最好的 RAG 方案是什么」）\n- 需要对比的问题（「Supabase vs PlanetScale」）\n\n**Google 还是更好的场景**\n- 找具体网站（「xxx 公司官网」）\n- 本地信息（「附近餐厅」）\n- 图片搜索\n- 实时热点（Perplexity 有延迟）\n- SEO 优化内容（Google 反而更准确地找到「人写的内容」）\n\n**费用**：Pro 版 $20/月，我觉得值，相当于省了大量筛选网页的时间。',
  (SELECT id FROM nodes WHERE slug = 'tools'),
  'a1000000-0000-0000-0000-000000000004',
  398, 29, now() - interval '3 hours', now() - interval '2 days'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  'AI 图像生成工具横评，预算 $20/月，哪个最值？',
  E'最近帮公司选 AI 图像工具，做了一轮调研，分享给有类似需求的朋友。\n\n**候选工具**：Midjourney、DALL-E 3（ChatGPT Plus）、Stable Diffusion（本地）、Ideogram、Flux\n\n**$20/月 预算下的结论**\n\n**Midjourney Basic（$10/月）**：图像质量最稳定，出图风格一致，适合做品牌视觉\n\n**ChatGPT Plus（$20/月，含 DALL-E 3）**：对文字理解最准，能生成含文字的图像，适合做 infographic\n\n**Ideogram（免费版够用）**：文字渲染是所有工具里最好的，做海报、封面首选\n\n**我的推荐**：如果只能选一个，选 Midjourney；如果要做含文字的设计，Ideogram 免费版足够。本地跑 Stable Diffusion 学习成本高，不推荐新手。',
  (SELECT id FROM nodes WHERE slug = 'tools'),
  'a1000000-0000-0000-0000-000000000005',
  512, 41, now() - interval '5 hours', now() - interval '3 days'
);

-- ============================================================
-- 教程分享 (tutorial)
-- ============================================================

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  'System Prompt 进阶：让 Claude 更「听话」的 8 个技巧',
  E'写了很久 Prompt，总结了一些让 Claude 稳定输出的技巧，整理成文章分享。\n\n**1. 先定角色，再定约束**\n不要直接写限制，先说「你是一个...」再说「你需要...」，模型更容易进入状态。\n\n**2. 用 XML 标签组织信息**\nClaude 对 XML 标签的解析非常好，复杂输入用 `<context>` `<task>` `<format>` 分区块。\n\n**3. 给出反例**\n比正面例子更有效。「不要输出 markdown」不如「输出时不要这样：**粗体**，而是直接写文字」。\n\n**4. 要求逐步思考**\n在 prompt 末尾加「先列出你的思考步骤，再给出最终答案」，复杂任务准确率提升明显。\n\n**5. 指定输出格式**\n直接给一个 JSON schema 示例，比描述格式要求准确 10 倍。\n\n**6. 设置置信度阈值**\n「如果你对某个信息不确定，请明确说出来而不是猜测」。\n\n**7. 迭代而不是一次性完成**\n复杂任务拆成多轮对话，每轮专注一件事，比单个巨型 prompt 效果好。\n\n**8. Temperature 要根据任务调整**\n创意任务用 0.7–0.9，需要精确输出（代码、数据）用 0–0.3。',
  (SELECT id FROM nodes WHERE slug = 'tutorial'),
  'a1000000-0000-0000-0000-000000000002',
  923, 78, now() - interval '40 minutes', now() - interval '5 hours'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '零基础用 Cursor 做了个独立产品并上线，从 0 到 1 全记录',
  E'我是设计师背景，JavaScript 会一点点，用 Cursor 花了三周做了个小产品，记录一下整个过程。\n\n**产品是什么**\n一个帮 Figma 设计师自动生成组件说明文档的工具，输入 Figma 文件链接，输出 Markdown 文档。\n\n**技术选型（全靠 Claude 推荐）**\n- Next.js 14 App Router\n- Figma API\n- Claude API（用来理解设计稿并生成描述）\n- Vercel 部署\n\n**开发过程里学到的**\n\n1. **从最简单的功能开始**：我先让 Cursor 做了一个能跑通的最小版本，再逐步加功能\n2. **错误信息直接粘给 AI**：遇到报错直接 Cmd+K 把错误粘进去，不用自己看\n3. **不要一次改太多**：每次只让 AI 改一个功能，改完测试，再改下一个\n4. **`.cursorrules` 很重要**：把你的代码风格、组件库写进去，AI 生成的代码会更一致\n\n**上线后**：目前每天有 20–30 个活跃用户，没花一分钱推广。',
  (SELECT id FROM nodes WHERE slug = 'tutorial'),
  'a1000000-0000-0000-0000-000000000005',
  756, 63, now() - interval '2 hours', now() - interval '1 day'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  'RAG 实战：给自己的 Obsidian 笔记库加上 AI 问答（附完整代码）',
  E'我有大约 2000 篇 Obsidian 笔记，一直想让 AI 能基于我自己的知识库回答问题，这周终于做出来了。\n\n**技术方案**\n\n```\nObsidian MD 文件 → 分块 → Embedding → 存入 pgvector → 查询时做相似度搜索 → 送给 Claude 生成回答\n```\n\n**选型**\n- Embedding 模型：`text-embedding-3-small`（OpenAI，便宜且够用）\n- 向量数据库：Supabase pgvector（省去单独部署 Pinecone）\n- 问答模型：Claude 3.5 Haiku（速度快、便宜）\n- 前端：简单的 Next.js 页面\n\n**分块策略**（这个最关键）\n\n不要按固定字数分，要按「自然段落 + 标题层级」分。我用的是 `langchain` 的 `MarkdownTextSplitter`，效果比固定字数好很多。\n\n**成本**：2000 篇笔记全量 Embedding 花了约 $0.3，之后每次查询约 $0.002。\n\n代码在文末，欢迎 fork。',
  (SELECT id FROM nodes WHERE slug = 'tutorial'),
  'a1000000-0000-0000-0000-000000000006',
  1043, 89, now() - interval '1 hour', now() - interval '2 days'
);

-- ============================================================
-- 问与答 (ask)
-- ============================================================

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  'Next.js + Supabase RLS，用户只能读写自己的数据，这样设计对吗？',
  E'刚开始学 Supabase，RLS 这块有点懵，想确认一下我的理解对不对。\n\n**我的场景**：用户登录后只能看到自己的数据，不能看到别人的。\n\n**我写的 RLS policy**：\n```sql\nCREATE POLICY "users can only see own data"\nON posts\nFOR SELECT\nUSING (auth.uid() = user_id);\n```\n\n**问题**：\n1. 这个 policy 是在数据库层生效，还是需要在代码里也加过滤？\n2. 如果我用 `service_role` key（admin client）操作数据，RLS 还会生效吗？\n3. 有没有推荐的 Supabase + Next.js App Router 的鉴权最佳实践文章？\n\n感谢。',
  (SELECT id FROM nodes WHERE slug = 'ask'),
  'a1000000-0000-0000-0000-000000000005',
  334, 12, now() - interval '1 hour', now() - interval '3 hours'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  'Claude API context window 用完了会怎样？截断还是报错？',
  E'在做一个长对话应用，想了解一下 context window 超限的行为。\n\n场景是这样的：用户可能和 AI 聊很久，历史消息越来越长，超过 200k token 之后会发生什么？\n\n1. API 直接返回错误吗？\n2. 还是 Claude 自动截断早期消息？\n3. 有没有推荐的滑动窗口策略？目前我的思路是保留最近 N 条消息 + 用摘要压缩早期内容，这个方向对吗？\n\n谢谢。',
  (SELECT id FROM nodes WHERE slug = 'ask'),
  'a1000000-0000-0000-0000-000000000004',
  267, 8, now() - interval '30 minutes', now() - interval '5 hours'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '想转 AI 应用开发方向，有前端基础，应该从哪里入手？',
  E'背景：工作了 3 年的前端，React / TypeScript 熟练，后端基本不会。最近很想做 AI 应用但不知道从哪里开始系统学。\n\n几个具体问题：\n\n1. **需要学 Python 吗**？还是 JS 生态（LangChain.js、Vercel AI SDK）就够用了？\n\n2. **先学 API 调用还是先了解模型原理**？感觉原理很深，不知道要学多深才算够。\n\n3. **有什么推荐的实战项目**？想找一个能把前端技能 + AI 结合起来的练手项目。\n\n4. **Vercel AI SDK 值得学吗**？还是直接用 Anthropic / OpenAI SDK 更通用？\n\n希望走过这条路的朋友指点一下，感谢。',
  (SELECT id FROM nodes WHERE slug = 'ask'),
  'a1000000-0000-0000-0000-000000000001',
  589, 26, now() - interval '2 hours', now() - interval '1 day'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  'Vercel 部署 Next.js 免费版够用吗？什么时候需要升级？',
  E'最近要把自己做的 AI 工具部署到 Vercel，研究了一下定价，有点搞不清楚。\n\n**免费版（Hobby）限制**\n- 100GB 带宽/月\n- Serverless Function 执行时间 10s\n- 没有商业使用限制（据说）\n\n**我的顾虑**\n- AI API 调用可能比较慢，10s 够吗？\n- 如果做 streaming 响应，超时策略是什么？\n- 有没有遇到过免费版撑不住的情况？\n\n另外，国内用户访问 Vercel 速度怎么样？需要单独套 CDN 吗？',
  (SELECT id FROM nodes WHERE slug = 'ask'),
  'a1000000-0000-0000-0000-000000000003',
  421, 17, now() - interval '4 hours', now() - interval '2 days'
);

-- ============================================================
-- 招募合作 (recruit)
-- ============================================================

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '寻找联合创始人：AI 写作助手已有 MVP，找产品 / 运营方向',
  E'**项目背景**\n\n做了一个面向自媒体作者的 AI 写作助手，核心功能是「保持你的写作风格」——不是让 AI 替你写，而是让 AI 帮你把粗糙的草稿润色成你自己的风格。\n\nMVP 上线 3 周，目前有 200+ 注册用户，每日活跃约 40 人，付费转化率 8%（$9/月）。\n\n**我是谁**\n\n全栈工程师，4 年经验，独自做了这个产品。技术上没问题，但在用户增长、内容营销这块完全是盲区。\n\n**寻找的人**\n\n- 有自媒体或内容营销背景\n- 对 AI 产品感兴趣，愿意长期投入\n- 不需要全职，每周 10h+ 即可\n- 股权 20–30%（根据投入协商）\n\n感兴趣的发邮件，profile 里有联系方式。',
  (SELECT id FROM nodes WHERE slug = 'recruit'),
  'a1000000-0000-0000-0000-000000000002',
  478, 19, now() - interval '2 hours', now() - interval '6 hours'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '招 Next.js 全栈，一起做 AI SaaS 出海，equity + 兼职',
  E'**关于项目**\n\n做一个面向海外中小企业的 AI 客服工具（SaaS），用户可以把自己的文档、FAQ 上传，系统自动训练一个定制的客服 bot，嵌入到他们的网站。\n\n目前已有：\n- 产品设计稿（完整）\n- 种子用户 10 家（都是朋友的公司，愿意付费测试）\n- 基础技术架构设计\n\n还缺：**一个能动手写代码的全栈工程师**。\n\n**技术要求**\n- Next.js / TypeScript 熟练\n- 了解 Supabase 或 PostgreSQL\n- 能独立完成功能开发，不需要手把手\n\n**合作方式**\n- 兼职，每周 15–20h\n- equity 15–25%\n- 产品盈利后转为工资 + equity\n\n有意向的 DM 我。',
  (SELECT id FROM nodes WHERE slug = 'recruit'),
  'a1000000-0000-0000-0000-000000000003',
  312, 11, now() - interval '5 hours', now() - interval '1 day'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '想做 AI 出海工具，我出渠道和客户，寻找技术合伙人',
  E'**我的背景**\n\n做跨境电商 5 年，手上有稳定的东南亚买家渠道（主要是泰国、马来西亚的中小商家）。这批客户有明确的 AI 工具需求：自动翻译商品描述、多语言客服、社媒内容生成。\n\n**问题**\n\n我不会写代码，找过外包但沟通成本太高，想找一个能长期合作的技术伙伴。\n\n**合作模式**\n\n- 我负责：销售、客户维护、产品需求\n- 你负责：开发、维护\n- 收入五五分\n\n**理想的合作伙伴**\n\n- 有 AI 应用开发经验（API 调用、简单的 RAG 都行）\n- 能接受海外用户（英语不要求很好，有工具辅助）\n- 不追求快速暴富，愿意稳步做\n\n认真的请加我微信，备注「AI 合作」。',
  (SELECT id FROM nodes WHERE slug = 'recruit'),
  'a1000000-0000-0000-0000-000000000004',
  267, 9, now() - interval '8 hours', now() - interval '2 days'
);

-- ============================================================
-- 随便聊聊 (general)
-- ============================================================

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  '你们是怎么跟上 AI 圈信息节奏的？分享一下你的信息源',
  E'感觉 AI 领域更新太快了，每天都有新模型、新工具出来，根本看不完。分享一下大家的信息筛选策略？\n\n我自己现在的渠道：\n- **Twitter / X**：跟了几个靠谱的研究员和开发者（但噪音也很多）\n- **Hacker News**：每天看 Show HN 里的 AI 项目\n- **Newsletter**：TLDR AI、Latent Space、The Batch\n- **YouTube**：Andrej Karpathy（虽然更新慢但质量高）\n\n感觉自己还是在追着信息跑，没有真正消化。有没有更好的方式？',
  (SELECT id FROM nodes WHERE slug = 'general'),
  'a1000000-0000-0000-0000-000000000001',
  502, 37, now() - interval '30 minutes', now() - interval '4 hours'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  'AI 真的会取代程序员吗？说说你们的判断',
  E'这个话题聊烂了，但我还是想听听做 AI 应用开发的朋友的真实看法。\n\n我的判断（可能有偏差）：\n\n**会被替代的**：写样板代码（boilerplate）、简单的 CRUD、基础的 bug 修复。这些现在 Cursor 已经做得很好了。\n\n**不容易被替代的**：系统设计、复杂 debug（尤其是分布式系统）、理解业务逻辑、跨团队沟通。AI 在这些方面还差很远。\n\n**我更担心的**：不是程序员被取代，而是「会用 AI 的程序员」和「不会用 AI 的程序员」之间的效率差距越来越大，导致需要的程序员数量减少。\n\n大家怎么看？有没有已经感受到冲击的？',
  (SELECT id FROM nodes WHERE slug = 'general'),
  'a1000000-0000-0000-0000-000000000006',
  871, 64, now() - interval '1 hour', now() - interval '1 day'
);

INSERT INTO topics (title, content, node_id, user_id, view_count, like_count, last_reply_at, created_at) VALUES (
  'Claude 还是 GPT，日常开发你更依赖哪个？',
  E'不想引战，就是好奇大家的真实使用习惯。\n\n我自己的情况：\n\n**Claude 用得更多的场景**\n- 写代码 / debug（更准确，不废话）\n- 分析文档、总结长文（context window 更大）\n- 需要严格遵循格式的任务\n\n**GPT 用得更多的场景**\n- 头脑风暴（感觉创意更发散）\n- 用 DALL-E 生成图\n- 需要联网搜索的时候（虽然 Perplexity 更好）\n\n总体来说 Claude 占我 70% 的 AI 使用量，GPT 30%。\n\n你们呢？',
  (SELECT id FROM nodes WHERE slug = 'general'),
  'a1000000-0000-0000-0000-000000000002',
  634, 48, now() - interval '2 hours', now() - interval '2 days'
);

-- ============================================================
-- 热门帖子的回复
-- ============================================================

-- 回复：Cursor 三个月感受
INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = '用了三个月 Cursor，说说真实感受（不是广告）' LIMIT 1),
  'a1000000-0000-0000-0000-000000000006',
  E'Composer 确实是杀手锏功能，我用它重构了一个老项目，把 class 组件全换成 hooks，跨了十几个文件，基本一次成。\n\n但你说的 Tab 补全太激进这个问题我也有，有时候按 Tab 接受了一大段代码，结果根本不是自己想要的。现在我改成了用 `Cmd+K` 更多，Tab 补全降低依赖。',
  8, now() - interval '3 hours'
);

INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = '用了三个月 Cursor，说说真实感受（不是广告）' LIMIT 1),
  'a1000000-0000-0000-0000-000000000004',
  E'我从 VS Code + Copilot 换到 Cursor 大概一个月了。Copilot 的补全在 Cursor 里也能用，但 Cursor 自己的模型在 Composer 里确实比 Copilot Chat 强不少。\n\n一个小技巧：`.cursorrules` 里加上「当我说''优化''时，只重构逻辑不改变 API 接口」这类约定，可以减少 AI 乱改的情况。',
  5, now() - interval '2 hours'
);

INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = '用了三个月 Cursor，说说真实感受（不是广告）' LIMIT 1),
  'a1000000-0000-0000-0000-000000000001',
  E'$20/月 对我来说还是有点贵，毕竟 Claude API 直接调也就这个价。Cursor 的附加值主要是 IDE 集成和 Composer 的多文件能力，这个确实是 API 替代不了的。',
  3, now() - interval '1 hour'
);

-- 回复：Claude vs GPT 横评
INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = 'Claude 3.5 Sonnet vs GPT-4o 代码能力横评，测了 20 个真实任务' LIMIT 1),
  'a1000000-0000-0000-0000-000000000002',
  E'Debug 这块 +1，Claude 遇到复杂 bug 会先理解整体逻辑再定位问题，GPT-4o 经常直接猜一个「可能是这里」然后改错地方，来回几轮很浪费时间。',
  12, now() - interval '5 hours'
);

INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = 'Claude 3.5 Sonnet vs GPT-4o 代码能力横评，测了 20 个真实任务' LIMIT 1),
  'a1000000-0000-0000-0000-000000000005',
  E'速度差这块补充一下：GPT-4o 的 streaming 首 token 延迟比 Claude 低很多，如果做用户对话类产品，响应感知上 GPT 更快。纯批处理任务的话差别不大。',
  7, now() - interval '3 hours'
);

-- 回复：RAG 实战
INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = 'RAG 实战：给自己的 Obsidian 笔记库加上 AI 问答（附完整代码）' LIMIT 1),
  'a1000000-0000-0000-0000-000000000004',
  E'请问分块策略这里，对于有大量内链（`[[wiki links]]`）的 Obsidian 笔记，你是怎么处理的？直接保留还是去掉？我担心内链文字会干扰 embedding 的质量。',
  6, now() - interval '4 hours'
);

INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = 'RAG 实战：给自己的 Obsidian 笔记库加上 AI 问答（附完整代码）' LIMIT 1),
  'a1000000-0000-0000-0000-000000000006',
  E'我用的是把内链替换成纯文字（把 `[[Note Title]]` 换成 `Note Title`），然后把被引用的笔记片段也加进 chunk 的 metadata 里。查询时会额外拉取关联笔记的摘要，效果比忽略内链好很多。',
  9, now() - interval '2 hours'
);

-- 回复：AI 取代程序员
INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = 'AI 真的会取代程序员吗？说说你们的判断' LIMIT 1),
  'a1000000-0000-0000-0000-000000000001',
  E'我更倾向于「AI 会取代部分工作内容，而不是整个职位」。就像 Excel 没有取代财务人员，但确实让一个财务能做过去三个人的工作量。\n\n对我自己影响最大的是：以前需要一周的功能现在两天能做完，所以接了更多项目。总收入提高了，但焦虑也提高了（笑）。',
  18, now() - interval '3 hours'
);

INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = 'AI 真的会取代程序员吗？说说你们的判断' LIMIT 1),
  'a1000000-0000-0000-0000-000000000005',
  E'作为设计师说一句：AI 对设计的冲击感觉比对开发更大。生成图像、做 UI 稿这些工作，AI 已经能做到「够用」的程度了。我现在的价值更多在于判断「哪个方向对」而不是「执行」。\n\n程序员可能也会走类似的路——从「写代码」变成「判断和架构」。',
  14, now() - interval '1 hour'
);

-- 回复：转 AI 开发
INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = '想转 AI 应用开发方向，有前端基础，应该从哪里入手？' LIMIT 1),
  'a1000000-0000-0000-0000-000000000006',
  E'有前端基础直接上手做项目就行，不需要先学原理。推荐路线：\n\n1. 用 `Vercel AI SDK` 做一个最简单的 chat 界面（一天搞定）\n2. 加上 streaming 响应\n3. 加上对话历史管理\n4. 接入 RAG（用 Supabase pgvector）\n\n做完这四步你就已经能做 80% 的 AI 应用了。Python 不用学，JS 生态现在已经很完整了。',
  21, now() - interval '1 hour'
);

INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = '想转 AI 应用开发方向，有前端基础，应该从哪里入手？' LIMIT 1),
  'a1000000-0000-0000-0000-000000000002',
  E'Vercel AI SDK 值得学，它把 OpenAI / Anthropic / Google 的接口统一了，以后换模型不用大改代码。但底层的 Anthropic SDK 也要懂，遇到 SDK 不支持的参数（比如 extended thinking）就需要直接用原生 API。',
  11, now() - interval '30 minutes'
);

-- 回复：信息源
INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = '你们是怎么跟上 AI 圈信息节奏的？分享一下你的信息源' LIMIT 1),
  'a1000000-0000-0000-0000-000000000003',
  E'我现在减少了「追新」，改成「深挖」。每个月只选 1–2 个工具认真用满一个月，比浅尝 10 个工具学到的多。\n\nNewsletter 推荐 Simon Willison 的博客，他每天写当天看到的 AI 新东西，过滤了很多噪音。',
  16, now() - interval '2 hours'
);

INSERT INTO replies (topic_id, user_id, content, like_count, created_at) VALUES (
  (SELECT id FROM topics WHERE title = '你们是怎么跟上 AI 圈信息节奏的？分享一下你的信息源' LIMIT 1),
  'a1000000-0000-0000-0000-000000000004',
  E'我用 Readwise Reader 把各种 newsletter 和 RSS 统一管理，每天早上花 20 分钟快速过一遍，用 AI 摘要功能先判断值不值得细读。\n\n信息焦虑这件事我觉得没办法完全解决，接受「我会错过很多东西」之后反而轻松多了。',
  13, now() - interval '1 hour'
);
