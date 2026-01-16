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

## 注意事项

- **日期**: `'Jan 14, 2026'` 格式
- **路径**: href 以 `/` 开头结尾，如 `/articles/xxx/`
- **图片**: `/Articles/...`（对应 public/）
- **标签**: 必须从 tagCategories 选取
- **代码高亮**: highlight.js (Python/C++/GLSL)

---
*更新: 2026-01-16 14:10*
