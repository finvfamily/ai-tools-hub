# 做了个 AI 工具导航站，顺手加了个类 V2EX 的讨论社区，完全开源

---

**节点：** 分享创造

---

最近做了一个 AI 工具聚合导航站，主要面向海外用户，同时开源出来，给想做独立产品的朋友一个参考。

先放链接：

- 🌐 Demo：https://ai-tools-hub-xi.vercel.app
- 📦 GitHub：https://github.com/finvfamily/ai-tools-hub

---

## 做这个的起因

自己平时要调研 AI 工具，发现 futurepedia 之类的导航站信息太杂、更新不及时，而且大多数是英文站，作为开发者用起来不够顺手。

于是想自己做一个，同时也当作一个「完整产品的模板」开源出来——很多人想做独立产品但不知道从何下手，希望这个项目能提供一个可以直接参考的真实案例。

---

## 功能

**工具导航部分**
- 按分类浏览（写作、图像、代码、视频等 10 个分类）
- 支持社区提交工具，人工审核后上线
- 每个工具有截图、标签、定价、官网直链
- 自动通过 Microlink API 抓取网站截图

**社区部分（这次新加的）**
- 类 V2EX 的讨论版，7 个节点（展示台、创意工坊、工具讨论等）
- GitHub OAuth 登录，一键注册
- 支持 Markdown 编辑器发帖（@uiw/react-md-editor）
- 帖子按最后活跃时间排序，回复会「顶」帖子
- 个人主页可编辑 bio

---

## 技术栈

```
前端：Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
动效：Motion (Framer Motion v12)
数据库：Supabase (PostgreSQL + Row Level Security)
认证：Supabase Auth（管理员 email/password + 社区 GitHub OAuth）
截图：Microlink API
部署：Vercel
```

整体走的是「尽量少的技术债」思路——没有自建后端，全部用 Supabase + Vercel 的 Serverless，个人开发者免费额度内基本够跑。

---

## 视觉风格

深色背景 + 渐变光晕 + 玻璃卡片，参考了一些海外 AI 产品的设计语言。

动效用了 Motion，主要是卡片 hover 的微交互和列表的 stagger 入场，不是为了炫技，是为了让页面有点「活」的感觉。

---

## 自部署很简单

```bash
git clone https://github.com/finvfamily/ai-tools-hub
cd ai-tools-hub
npm install

# 配置 .env.local（Supabase URL/Key 就够跑起来）
cp .env.example .env.local

# 在 Supabase SQL Editor 跑两个文件
# supabase/schema.sql
# supabase/community.sql

npm run dev
```

README 里有完整的自部署指南和环境变量说明。

---

## 后续计划

- [ ] 工具详情页 SEO 优化（OG 图、sitemap 已做）
- [ ] Google AdSense 接入（广告位已预留）
- [ ] 社区帖子点赞、收藏功能
- [ ] 开源一批「AI 工具示例」放在独立 repo，用来启发大家把 idea 落地

---

## 一点想法

做这个项目的初衷不只是「做一个导航站」，而是想证明**一个人在业余时间用现代工具栈可以做出多完整的东西**。

从立项到现在大概两周，数据库设计、前端、部署、OAuth、社区功能都有，代码量不算少，但每一块都能在 GitHub 上找到对应的实现。

如果你正在学 Next.js + Supabase，或者想做一个类似的导航/社区产品，欢迎直接 fork 当脚手架用。有问题可以在这里回复，或者开 issue。

---

*附：如果你在用 AI 做有意思的东西，也欢迎来站里的社区聊聊：https://ai-tools-hub-xi.vercel.app/community*
