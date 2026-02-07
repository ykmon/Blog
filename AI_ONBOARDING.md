# 项目入职文档（AI 快速上手）

> **目标**：让新会话中的 AI 在最短时间理解项目结构、内容来源、开发方式与更新约定。
>
> **⚠️ 长期约定**：从此以后，任何影响"结构 / 流程 / 规范 / 依赖 / 部署"的重要更新，都必须同步追加到本文件第 7 节「重要更新日志」，不得覆盖历史记录。

---

## 1. 项目概览

| 字段 | 值 |
|------|------|
| 项目名 | `techart-chronicle` |
| 类型 | 基于 Astro 的技术美术博客站点 |
| 核心主题 | Unreal Engine / Houdini / Shader / 自动化管线 / 技术美术学习笔记 |
| 内容形态 | 文章（articles）+ 工具页（tools）+ 视频（videos）统一时间线展示 |
| 部署 | Vercel（见 `vercel.json`） |

---

## 2. 技术栈与运行方式

| 技术 | 版本 / 说明 |
|------|-------------|
| 框架 | `astro` ^4.16.0 |
| 样式 | `tailwindcss` ^3.4.0 |
| 搜索 | `fuse.js` ^7.1.0（客户端模糊搜索） |
| 其他依赖 | `@astrojs/tailwind`、`@astrojs/sitemap`、`@tailwindcss/typography` |

**常用命令：**

```bash
npm run dev      # 本地开发
npm run build    # 生产构建
npm run preview  # 构建后预览
```

---

## 3. 关键目录（优先阅读）

```
I:\Blog\
├── src/
│   ├── data/
│   │   └── content.ts          ★ 核心内容数据源（articles/tools/videos + 标签体系）
│   ├── pages/
│   │   ├── index.astro         ★ 首页时间线主渲染逻辑（文章/工具/视频混排）
│   │   ├── articles/           文章页面（每篇一个 .astro）
│   │   │   ├── games101/       GAMES101 系列子目录
│   │   │   ├── games104/       GAMES104 系列子目录
│   │   │   └── inside-ue4/     InsideUE4 系列子目录
│   │   ├── tools/              工具页面
│   │   └── videos/             视频页面
│   ├── layouts/
│   │   ├── BaseLayout.astro    全局布局
│   │   └── ArticleLayout.astro 文章页布局
│   ├── components/             导航、侧栏、卡片、搜索框、播放器等组件
│   │   ├── Header.astro
│   │   ├── Sidebar.astro
│   │   ├── SubPageSidebar.astro
│   │   ├── MobileNav.astro
│   │   ├── ArticleCard.astro
│   │   ├── TagFilter.astro
│   │   ├── SearchBox.astro
│   │   ├── MusicPlayer.astro
│   │   └── Footer.astro
│   ├── scripts/
│   │   ├── init-filter.ts      标签筛选初始化
│   │   └── filter-controller.ts 筛选控制器
│   ├── styles/
│   │   └── global.css          全局样式
│   └── utils/
│       └── date.ts             日期格式化工具
├── public/                     静态资源（图片、robots.txt 等）
├── Tools/                      Houdini Python 脚本原始文件（.md + .html）
├── Resource/                   其他资源
├── package.json
├── tsconfig.json
├── tailwind.config.mjs
├── vercel.json
└── README.md                   项目简介（偏对外）
```

---

## 4. 数据与内容约定

所有内容统一在 `src/data/content.ts` 维护索引数据。

### 4.1 标签分类体系

```ts
tagCategories = {
    tools:       ['UE', 'Unity', 'Houdini', 'Maya', 'Others DCC'],
    languages:   ['Code'],
    domains:     ['PCG', 'Animation', 'Automation', 'Simulation'],
    foundations: ['Basic'],
    practices:   ['Plugin Development', 'DevOps']
}
```

### 4.2 内容类型 Schema

| 类型 | 关键字段 |
|------|----------|
| `Article` | `href`, `title`, `category`, `tags`, `description`, `date`(ISO), `readTime`, `image?`, `placeholder?` |
| `Tool` | `href`, `icon`, `title`, `tags`, `description`, `date`(ISO) |
| `Video` | `title`, `category`, `tags`, `date`(ISO), `bvid`, `aid`, `cid` |

- 日期字段统一 ISO 格式：`YYYY-MM-DD`
- 首页按日期**倒序**聚合渲染（articles + tools + videos 混排时间线）

---

## 5. 新增内容的标准流程

1. 在对应目录新增页面（如 `src/pages/articles/xxx.astro` 或 `src/pages/tools/xxx.astro`）
2. 在 `src/data/content.ts` 增加对应条目（确保 `href`、`tags`、`date` 正确）
3. 本地运行 `npm run dev` 检查展示
4. 构建验证 `npm run build`
5. 若为"重要更新"，**必须**同步记录到本文档第 7 节

---

## 6. AI 协作约定（给后续新会话）

### 6.1 新会话启动顺序

1. **首先**读取本文件 `AI_ONBOARDING.md`
2. 然后读取 `src/data/content.ts`（了解当前内容全貌）
3. 按需读取 `src/pages/index.astro`、`package.json` 等

### 6.2 改动原则

| 优先级 | 原则 |
|--------|------|
| 🔴 最高 | 数据源一致性（content.ts 与页面文件必须对应） |
| 🟠 高 | 路由可达性（href 指向的页面必须存在） |
| 🟡 中 | 样式一致性（复用现有 Tailwind class 与设计语言） |

### 6.3 注意事项

- 改文案 / 新增内容时，**优先复用现有字段结构**，不随意扩展 schema
- 若涉及结构变更（如新增 content type），**先更新本文件"重要更新日志"再实施代码改动**
- 不要修改 git config
- 不要主动 commit，除非用户明确要求

---

## 7. 重要更新日志（必须持续补充）

> **规则**：从此以后，任何影响"结构 / 流程 / 规范 / 依赖 / 部署"的更新，都在此追加一条记录。
> **绝对不要覆盖历史记录**，只在末尾追加。

### 记录模板

```
### YYYY-MM-DD — 简短标题
- **类型**：`结构` | `流程` | `依赖` | `构建` | `部署` | `规范`
- **变更摘要**：一句话说明改了什么
- **影响范围**：列出文件或模块路径
- **对后续 AI 的要求**：后续会话需要特别注意的点
```

### 日志

### 2025-07-11 — 建立 AI 入职文档

- **类型**：`规范`
- **变更摘要**：创建 `AI_ONBOARDING.md`，建立 AI 会话上下文基线与持续更新机制
- **影响范围**：`AI_ONBOARDING.md`（新增）
- **对后续 AI 的要求**：每次新会话优先读取本文件；任何重要变更必须追加日志

---

## 8. 维护原则

- 本文件是 **"AI 会话上下文基线"**
- 新会话开始时，**优先读取本文件**，再进入代码细节
- 发现本文档与实际代码不一致时：**先修正文档，再进行功能迭代**
- 本文件由人类和 AI 共同维护，保持简洁、准确、可执行
