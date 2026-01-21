# TechArt Chronicle 入职配置

> Astro 4.16.x + Tailwind CSS 3.4 | 静态站点 | 部署于 Vercel | 复古书卷风格

## 核心架构

```
src/
├── data/content.ts      # 📌 所有内容定义于此（Article/Tool/Video）
├── layouts/BaseLayout.astro, ArticleLayout.astro
├── components/Header, Sidebar, Footer, ArticleCard, SearchBox, TagFilter
├── pages/index.astro, articles/, tools/, videos/
└── styles/global.css
public/Articles/         # 静态资源
```

## 内容模型（content.ts）

```typescript
// 三种类型：Article | Tool | Video
interface Article {
  type: 'article'; href: string; title: string;
  category: string; tags: string[]; description: string;
  date: string; readTime?: string; image?: string;
}
// Tool: type, href, icon, title, tags, description, date
// Video: type, title, category, tags, date, bvid, aid, cid
```

**标签分类**：
- `tools`: UE, Unity, Houdini, Maya, Others DCC
- `languages`: Code
- `domains`: PCG, Animation, Automation, Simulation
- `foundations`: Basic
- `practices`: Plugin Development, DevOps

## 设计系统

| 颜色 | 值 | 用途 |
|------|-----|------|
| `paper` | #F5F5F7 | 背景 |
| `ink` | #1a1a1a | 正文 |
| `forest` | #2d4a3e | 标题 |
| `ochre` | #8a6240 | 强调/链接 |
| `glass` | rgba(255,255,255,0.5) | 毛玻璃效果 |

**字体**: `font-serif`(Playfair Display) / `font-body`(Noto Serif SC)

**样式类**: `.drop-cap` `.blur-load` `.retro-frame` `.retro-card`

## 常用命令

```bash
npm run dev      # http://localhost:4321
npm run build    # 生成 dist/
```

## 添加新内容

1. **编辑** `src/data/content.ts` 添加条目
2. **创建** `src/pages/articles/*.astro` 页面
3. **资源** 放入 `public/Articles/{名称}/`

```astro
---
import ArticleLayout from '../../layouts/ArticleLayout.astro';
---
<ArticleLayout title="标题" category="分类" date="日期">
  <!-- 内容 -->
</ArticleLayout>
```

## 搜索与过滤

- **全局搜索**：SearchBox 组件（Fuse.js 模糊搜索）
  - 搜索范围：标题、描述、分类、标签
  - URL 参数：`?q=关键词`
- **标签过滤**：TagFilter 组件（OR 模式）
  - URL 参数：`?tags=UE,Houdini`
- 可同时使用，结果取交集

## 移动端适配

- **MobileNav 组件**：`src/components/MobileNav.astro`
  - 浮动汉堡按钮（右下角，`lg:hidden`）
  - 抽屉式侧边栏（从右侧滑入）
  - 包含搜索、导航、标签过滤
  - 点击遮罩或 ESC 关闭
  - 断点：`< 1024px` 显示


## 背景音乐播放器

- **MusicPlayer 组件**：`src/components/MusicPlayer.astro`
  - 浮动按钮（右下角，MobileNav 上方）
  - 网易云音乐外链嵌入
  - 全局布局集成 (`BaseLayout`)
  - 状态持久化 (localStorage)

## 注意事项

- **日期**: `'Jan 14, 2026'` 格式
- **路径**: href 以 `/` 开头结尾，如 `/articles/xxx/`
- **图片**: `/Articles/...`（对应 public/）
- **标签**: 必须从 tagCategories 选取
- **代码高亮**: highlight.js (Python/C++/GLSL)

## 博客转换提示词（MD → Astro）

将 Markdown 文章（如 `Articles/*.md`）转换为 Astro 博客页面时，遵循以下规范：

### 1. 文件结构

```astro
---
import ArticleLayout from '../../layouts/ArticleLayout.astro';
---
<ArticleLayout title="文章标题" category="分类" date="Jan 21, 2026">
  <!-- 正文内容 -->
</ArticleLayout>
```

### 2. 内容转换规则

| 原始 Markdown | 转换为 |
|---------------|--------|
| `# 标题` | `<h1>` 或省略（ArticleLayout 自带） |
| `## 二级标题` | `<h2 class="mt-12 mb-6 text-2xl text-forest">` |
| `### 三级标题` | `<h3 class="mt-8 mb-4 text-xl text-forest/80">` |
| `> 引用` | `<blockquote class="border-l-4 border-ochre pl-4 italic my-6">` |
| `` `代码` `` | `<code class="bg-paper/50 px-1.5 py-0.5 rounded text-ochre">` |
| 代码块 | `<pre><code class="language-xxx">` |
| 表格 | `<table class="w-full text-sm my-6">` |
| 列表 | `<ul class="list-disc list-inside space-y-2 my-4">` |
| 图片 | `<img src="/Articles/..." alt="..." class="rounded-lg shadow-md my-6">` |

### 3. 书卷风格类（必用）

- **首字下沉**: 文章首段加 `class="drop-cap"`
- **卡片容器**: `<div class="retro-card p-6 my-8">`
- **强调框**: `<div class="bg-forest/5 border border-forest/20 rounded-lg p-4 my-6">`
- **提示框**: 使用 ochre 边框 + 浅背景

### 4. 代码高亮

```html
<pre><code class="language-python">
# Python 代码示例
</code></pre>
```

支持语言：`python`, `cpp`, `glsl`, `javascript`, `typescript`, `bash`

### 5. 内容注册

转换完成后，在 `src/data/content.ts` 添加条目：

```typescript
{
  type: 'article',
  href: '/articles/文章路径/',
  title: '文章标题',
  category: 'Houdini',  // 或 UE, Unity, Animation 等
  tags: ['Houdini', 'Automation'],  // 从 tagCategories 选取
  description: '一句话描述',
  date: 'Jan 21, 2026',
  readTime: '10 min',
  image: '/Articles/xxx/cover.jpg'  // 可选
}
```

### 6. 色彩语义

| 元素 | 颜色 |
|------|------|
| 标题/导航 | `text-forest` |
| 链接/强调 | `text-ochre` |
| 代码/路径 | `text-ochre` + `bg-paper/50` |
| 正文 | `text-ink` |
| 次要信息 | `text-ink/60` |

### 7. 转换检查清单

- [ ] 首段使用 `drop-cap`
- [ ] 标题层级正确（h2 > h3 > h4）
- [ ] 代码块指定语言
- [ ] 表格使用 Tailwind 样式
- [ ] 图片路径正确（`/Articles/...`）
- [ ] content.ts 已注册

---
*更新: 2026-01-21 15:12*
