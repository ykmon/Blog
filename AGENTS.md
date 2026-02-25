# AGENTS.md — TechArt Chronicle 代码规范

AI 编码代理在本仓库工作时的规范指南。

---

## 项目概览

- **框架**: Astro 4.16 + Tailwind CSS 3.4 + TypeScript (strict)
- **输出**: 静态站点 (SSG)，部署于 Vercel
- **内容**: 技术美术博客 (UE、Houdini、Shader、游戏开发)
- **网站**: https://www.ykmon.top

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
├── content/        # Markdown 内容 (articles/, tools/)
│   └── config.ts   # Zod schema 定义
├── pages/          # 路由页面 (文件系统路由)
├── layouts/        # 布局模板 (BaseLayout, ArticleLayout, ToolLayout)
├── components/     # 可复用组件
├── data/           # 静态数据 (tools[], videos[], tagCategories)
├── utils/          # 工具函数 (date.ts)
├── scripts/        # 客户端脚本 (filter-controller.ts)
└── styles/         # 全局样式 (global.css)
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

### Tailwind 自定义颜色

```css
paper: '#F5F5F7'   /* 背景 */
ink: '#1a1a1a'     /* 文字 */
forest: '#2d4a3e'  /* 强调色 */
ochre: '#8a6240'   /* 链接/高亮 */
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
if (!entry) throw new Error('Missing article: <slug>');
const { Content } = await entry.render();
---

<ArticleLayout title={entry.data.title} category={entry.data.category}>
  <Content />
</ArticleLayout>
```

### 新建工具

1. 创建 `src/content/tools/<slug>.md`
2. 在 `src/data/content.ts` 的 `tools[]` 数组添加元数据

**工具使用动态路由，无需创建单独页面文件。**

### 可用标签

从 `tagCategories` 选择: UE, Unity, Houdini, Maya, Code, PCG, Animation, Automation, Simulation, Basic

---

## 页面模式

### 静态页面
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Title">...</BaseLayout>
```

### 动态路由
```astro
---
export async function getStaticPaths() {
  const items = await getCollection('articles');
  return items.map(item => ({
    params: { slug: item.slug },
    props: { item },
  }));
}
const { item } = Astro.props;
---
```

---

## 错误处理

```astro
<!-- 内容不存在 -->
const entry = await getEntryBySlug('articles', slug);
if (!entry) throw new Error(`Missing article: ${slug}`);
```

```typescript
// 客户端脚本
try {
  await loadScript(url);
} catch (e) {
  console.warn('Load failed:', e);
}

// 可选链
const text = element?.textContent?.trim() || '';
```

---

## 样式规范

### 自定义 CSS 类 (global.css)

- `.blur-load` — 元素进入视口时从模糊变清晰
- `.retro-card` — 复古卡片 (hover 上移 + 阴影)
- `.series-badge` — 系列文章标记
- `.drop-cap` — 首字下沉
- `.sidebar-sticky` — 侧边栏吸顶

### 样式优先级

1. Tailwind 工具类 (优先)
2. 自定义 CSS 类
3. 组件内 `<style>` (最后手段)

---

## 性能优化

- 图片: `loading="lazy" decoding="async"`
- 代码高亮: Shiki (构建时，零运行时)
- KaTeX: 按需异步加载

---

## Git 与部署

- **主分支**: `main`
- **CI**: 推送时运行 `npm run build`
- **部署**: Vercel 自动部署

---

**最后更新**: 2025-02-24
