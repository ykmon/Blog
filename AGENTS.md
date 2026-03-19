# AGENTS.md — TechArt Chronicle 代码规范

AI 编码代理在本仓库工作时的规范指南。

---

## 项目概览

- **框架**: Astro 4.16 + Tailwind CSS 3.4 + TypeScript (strict)
- **输出**: 静态站点 (SSG)，部署于 Vercel
- **内容**: 技术美术博客 (UE、Houdini、Shader、游戏开发)
- **网站**: https://www.ykmon.top
- **搜索**: Fuse.js 客户端模糊搜索

---

## 常用命令

```bash
npm run dev      # 开发服务器
npm run build    # 构建生产版本 (CI 验证)
npm run preview  # 预览构建结果
npm ci           # 安装依赖
```

---

## 目录结构

```
src/
├── content/           # Markdown 内容 (articles/, tools/)
│   └── config.ts      # Zod schema 定义
├── pages/             # 路由页面 (文件系统路由)
│   ├── index.astro    # 首页 - 导航中心
│   ├── about.astro    # 关于页
│   ├── articles/      # 文章页 (独立 + 系列子目录 games101/, games104/, inside-ue4/)
│   ├── series/        # 系列总览
│   ├── tools/         # 工具页 ([...slug].astro 动态路由)
│   └── videos/        # 视频页
├── layouts/           # 布局模板
│   ├── BaseLayout.astro     # 基础布局 (SEO/OG/KaTeX/blur-load/MobileNav)
│   ├── ArticleLayout.astro  # 文章布局 (面包屑/侧边栏/相关文章)
│   └── ToolLayout.astro     # 工具布局
├── components/        # 可复用组件
│   ├── UnifiedSidebar.astro # 统一侧边栏 (替代旧 Sidebar + SubPageSidebar)
│   ├── MobileNav.astro      # 移动端导航抽屉 (<lg 断点)
│   ├── Header.astro         # 页头
│   ├── Footer.astro         # 页脚
│   ├── ArticleCard.astro    # 文章卡片
│   ├── SearchBox.astro      # 搜索框
│   ├── TagFilter.astro      # 标签过滤器
│   ├── Breadcrumb.astro     # 面包屑导航
│   ├── RelatedArticles.astro # 相关文章推荐
│   └── MusicPlayer.astro    # 音乐播放器
├── data/              # 静态数据
│   ├── content.ts     # tagCategories, tools[], videos[], 类型定义 (Article/Tool/Video)
│   └── series.ts      # seriesList[] (GAMES101/GAMES104/InsideUE4), Series/SeriesArticle 类型
├── scripts/           # 客户端脚本
│   ├── filter-controller.ts  # FilterController 单例 (Fuse.js 搜索 + 标签过滤)
│   └── init-filter.ts        # 页面级初始化 (绑定 SearchBox/TagFilter, View Transitions 支持)
├── utils/             # 工具函数
│   └── date.ts        # formatDateEN(), formatDateCN(), parseISODate()
└── styles/            # 全局样式
    ├── global.css     # 自定义 CSS 类 + Shiki/KaTeX 样式
    └── fonts.css      # 自托管字体 (@font-face + unicode-range 按需加载)
```

---

## 代码风格

### 命名约定

| 类型 | 约定 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `ArticleCard.astro` |
| 页面/内容 | kebab-case | `lumen-rendering.astro` |
| 接口 | PascalCase | `interface Article` |
| 函数/变量 | camelCase | `formatDateEN` |
| CSS 类 | kebab-case | `.retro-card` |
| 常量 | UPPER_SNAKE | `MONTH_NAMES_EN` |

### Astro 组件模板

```astro
---
// ComponentName.astro - 简短描述
import Dependency from './Dependency.astro';

export interface Props {
  required: string;
  optional?: boolean;
}

const { required, optional = false } = Astro.props;
---

<div class="component">{required}</div>

<style>
  .component { /* 私有样式 */ }
</style>
```

### TypeScript

- 启用 `strict` + `strictNullChecks`
- 禁止 `any`、`@ts-ignore`、`@ts-expect-error`
- 使用 Zod schema 验证内容数据

### Tailwind 自定义配置

**颜色**:
```
paper:  '#F5F5F7'              /* 背景 */
ink:    '#1a1a1a'              /* 文字 */
forest: '#2d4a3e'              /* 强调色 */
ochre:  '#8a6240'              /* 链接/高亮 */
glass:  'rgba(255,255,255,0.5)' /* 玻璃效果 */
```

**字体**:
```
serif: ['Playfair Display', 'serif']   /* 标题 */
body:  ['Noto Serif SC', 'serif']      /* 正文 */
```

**阴影**:
```
retro: '8px 8px 0px 0px rgba(45, 74, 62, 0.15)'
card:  '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)'
```

---

## 内容 Schema

### articles (src/content/config.ts)

```typescript
{
  title: string;          // 必填
  description: string;    // 必填
  category: string;       // 必填
  href: string?;          // 自定义链接 (覆盖默认 /articles/<slug>/)
  date: string?;          // ISO 格式 YYYY-MM-DD
  tags: string[]?;        // 从 tagCategories 选择
  readTime: string?;      // 如 "10 Min Read"
  image: string?;         // 封面图路径
  imageAlt: string?;      // 图片 alt 文字
  placeholder: string?;   // 无图片时的占位文字
  listed: boolean?;       // false 则从列表中隐藏
}
```

### tools (src/content/config.ts)

```typescript
{
  title: string;          // 必填
  description: string;    // 必填
  category: string;       // 默认 "Houdini / Tool"
  tags: string[]?;
  image: string?;
  imageAlt: string?;
}
```

---

## 内容创建

### 新建文章

1. 创建 `src/content/articles/<slug>.md`:
```yaml
---
title: "标题"
description: "描述"
category: "Unreal Engine"
date: "2025-02-24"
tags: [UE, Code]
readTime: "10 Min Read"
image: "/Articles/<slug>/cover.png"
---
```

2. 创建 `src/pages/articles/<slug>.astro`:
```astro
---
import { getEntryBySlug } from 'astro:content';
import ArticleLayout from '../../layouts/ArticleLayout.astro';

const entry = await getEntryBySlug('articles', '<slug>');
if (!entry) throw new Error('Missing article content: <slug>');
const { Content } = await entry.render();
---

<ArticleLayout
  title={entry.data.title}
  category={entry.data.category}
  description={entry.data.description}
  date={entry.data.date}
>
  <Content />
</ArticleLayout>
```

### 新建工具

1. 创建 `src/content/tools/<slug>.md`
2. 在 `src/data/content.ts` 的 `tools[]` 数组添加元数据

**工具使用动态路由 `[...slug].astro`，无需创建单独页面文件。**

### 可用标签

从 `src/data/content.ts` 的 `tagCategories` 选择:

| 分类 | 标签 |
|------|------|
| tools | UE, Unity, Houdini, Maya, Others DCC |
| languages | Code |
| domains | PCG, Animation, Automation, Simulation |
| foundations | Basic |
| practices | Plugin Development, DevOps, AI |

---

## 关键组件 Props

### UnifiedSidebar

```typescript
interface Props {
  currentSection?: 'home' | 'articles' | 'series' | 'tools' | 'videos' | 'about';
  showSearch?: boolean;    // 默认 true
  showProfile?: boolean;   // 默认 true
}
```

### ArticleLayout

```typescript
interface Props {
  title: string;
  category: string;
  categoryLink?: string;   // 默认 '/articles/'
  date?: string;
  description?: string;
  image?: string;
  keywords?: string;
  tags?: string[];
  slug?: string;
}
```

### BaseLayout

```typescript
interface Props {
  title: string;
  description?: string;
  canonical?: string;
  image?: string;          // 默认 '/Resource/ykmon.jpg'
  keywords?: string;
}
```

### ArticleCard

```typescript
interface Props {
  href: string;
  title: string;
  category: string;
  tags?: string[];
  description: string;
  date: string;
  readTime?: string;       // 默认 '5 Min Read'
  image?: string;
  imageAlt?: string;
  placeholder?: string;
}
```

---

## 导航结构

桌面端 (UnifiedSidebar) 和移动端 (MobileNav) 共享相同导航:

```
00 首页 Home       → /
01 文章列表 Articles → /articles/
02 系列笔记 Series  → /series/
03 工具库 Tools     → /tools/
04 视频教程 Videos  → /videos/
05 关于 About      → /about/
```

---

## 客户端架构

### FilterController (单例模式)

- 统一管理搜索 + 标签过滤状态
- 使用 Fuse.js 进行模糊搜索 (keys: title×2, tags×1.5, description×1, category×1)
- 标签过滤为 OR 模式 (任一匹配即可见)
- 搜索 + 标签为 AND 交集
- 状态同步到 URL 参数 (`?q=xxx&tags=UE,Code`)
- 支持 Astro View Transitions (astro:page-load 事件)

### DOM 约定

- `[data-tags]` — 可过滤项 (卡片元素)
- `[data-role="search-input"]` — 搜索输入框
- `[data-role="search-clear"]` — 搜索清除按钮
- `[data-role="search-status"]` — 搜索结果状态
- `.tag-btn[data-tag]` — 标签按钮
- `[data-role="filter-status"]` — 过滤状态
- `[data-role="filter-count"]` — 过滤计数
- `[data-role="clear-filters"]` — 清除所有过滤

---

## 样式规范

### 自定义 CSS 类 (global.css)

| 类名 | 用途 |
|------|------|
| `.blur-load` | 元素进入视口时从模糊变清晰 (配合 `.loaded`) |
| `.retro-card` | 复古卡片 (hover 上移 + ochre 阴影) |
| `.retro-frame` | 复古边框 (用于视频等) |
| `.series-badge` | 系列文章标记 (绝对定位左上角) |
| `.drop-cap` | 首字下沉 (Playfair Display, forest 色) |
| `.sidebar-sticky` | 侧边栏吸顶 (sticky top: 2rem) |
| `.timeline-line` | 时间线竖线 |
| `.bg-paper` | 纸张背景色 (继承纹理) |
| `body.drawer-open` | 移动端抽屉打开时锁定滚动 |

### KaTeX 样式

- `.katex` — 行内公式 (font-size: 1.05em)
- `.katex-display` — 块级公式 (居中, forest 左边框, 背景色)

### Shiki 代码块样式

- `.prose pre` — 代码块容器 (圆角, 边框, 自定义滚动条)
- `.prose pre code` — 重置 Typography 默认样式
- `.prose :not(pre) > code` — 行内代码 (灰底红字, 去反引号伪元素)

### 样式优先级

1. Tailwind 工具类 (优先)
2. 自定义 CSS 类
3. 组件内 `<style>` (最后手段)

---

## 性能优化

- 图片: `loading="lazy" decoding="async"`
- 代码高亮: Shiki (构建时，零运行时 JS)
- KaTeX: 按需异步加载 (检测页面是否含 `\(...\)` / `\[...\]` / `$$...$$`)
- 字体: 自托管 + `@font-face` unicode-range 按需加载
- blur-load: IntersectionObserver 懒加载动画 (幂等, 支持 View Transitions)

---

## Git 与部署

- **主分支**: `main`
- **CI**: 推送时运行 `npm run build`
- **部署**: Vercel 自动部署

---

**最后更新**: 2026-03-19
