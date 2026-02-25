# TechArt Chronicle 彻底重构计划

> 创建日期：2026-02-25
> 状态：✅ **已完成**

---

## 📋 重构目标

将博客从"内容堆砌型"转变为"导航友好型"，让访客：
1. **3秒内理解网站定位**
2. **5秒内找到感兴趣的内容**
3. **任意页面都能快速搜索和导航**
4. **阅读体验连贯，有上下文感知**

---

## 🏗️ 新站点结构

```
/                          # 首页 - 导航中心
/about/                    # 关于我（独立页面，新建）
/articles/                 # 所有文章（带分类和标签过滤）
  ├── [独立文章...]
  └── [series]/            # 系列子目录
      ├── games101/
      ├── games104/
      └── inside-ue4/
/series/                   # 系列总览（新建）
/tools/                    # Houdini工具（保留）
/videos/                   # 视频作品（保留）
```

---

## 📦 Phase 1: 创建统一侧边栏组件

### 目标
用一个组件替代现有的 `Sidebar.astro` 和 `SubPageSidebar.astro`

### 文件变更
- **新建**: `src/components/UnifiedSidebar.astro`
- **修改**: 所有使用侧边栏的页面

### 组件设计
```astro
---
// UnifiedSidebar.astro
export interface Props {
  currentSection?: 'home' | 'articles' | 'series' | 'tools' | 'videos' | 'about';
  showSearch?: boolean;      // 是否显示搜索框
  showFilter?: boolean;      // 是否显示标签过滤
  showProfile?: boolean;     // 是否显示个人简介
}
---

默认配置:
- home:      showSearch=true, showFilter=true,  showProfile=true
- articles:  showSearch=true, showFilter=true,  showProfile=true
- series:    showSearch=false, showFilter=true,  showProfile=false
- tools:     showSearch=true, showFilter=false, showProfile=false
- videos:    showSearch=true, showFilter=false, showProfile=false
- about:     showSearch=false, showFilter=false, showProfile=false
```

### 导航结构
```
Sections:
  00 Home        → /
  01 Articles    → /articles/
  02 Series      → /series/     (新增)
  03 Tools       → /tools/
  04 Videos      → /videos/
  05 About       → /about/      (新增)
```

---

## 🏠 Phase 2: 重构首页为导航中心

### 当前问题
- 内容过多，没有重点
- 混合内容类型（文章/工具/视频）难以区分
- 没有明确的价值主张

### 新首页结构
```
┌─────────────────────────────────────────────┐
│  Header: TechArt Chronicle.                 │
│  Subtitle: 不要温和地走入那良夜。            │
├─────────────────────────────────────────────┤
│  [Hero Section - 简洁]                       │
│  欢迎语 + 一句话介绍 + 最新精选(1-2篇)        │
├─────────────────────────────────────────────┤
│  [Quick Links - 4个入口卡片]                 │
│  ┌─────────┐ ┌─────────┐                    │
│  │ Articles│ │ Series  │                    │
│  │ 技术文章 │ │ 系列笔记 │                    │
│  └─────────┘ └─────────┘                    │
│  ┌─────────┐ ┌─────────┐                    │
│  │ Tools   │ │ Videos  │                    │
│  │ 开发工具 │ │ 视频作品 │                    │
│  └─────────┘ └─────────┘                    │
├─────────────────────────────────────────────┤
│  [Featured Content - 可选]                   │
│  最新3-4篇精选文章（非全部内容）              │
├─────────────────────────────────────────────┤
│  [About Teaser]                              │
│  简短介绍 + 链接到 /about/                   │
└─────────────────────────────────────────────┘
```

### 文件变更
- **修改**: `src/pages/index.astro`

---

## 📚 Phase 3: 创建 /series/ 系列总览页

### 目标
集中展示所有系列文章，让访客一目了然

### 页面结构
```
┌─────────────────────────────────────────────┐
│  Header: Series                              │
├─────────────────────────────────────────────┤
│  [系列卡片 - 每个系列一个]                    │
│  ┌─────────────────────────────────────────┐│
│  │ GAMES101 - 图形学入门                    ││
│  │ 7 讲 | 光栅化、光线追踪、动画            ││
│  │ [进入系列 →]                             ││
│  │ 目录: L02, L03, L05-06, L07-09, ...     ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ GAMES104 - 游戏引擎架构                  ││
│  │ 6 讲 | 引擎架构、渲染、物理              ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ InsideUE4 - 源码分析                     ││
│  │ 10 章 | 架构、控制器、GameMode           ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

### 文件变更
- **新建**: `src/pages/series/index.astro`
- **新建**: `src/data/series.ts` (系列元数据)

### 系列数据结构
```typescript
// src/data/series.ts
export interface Series {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: string;
  tags: string[];
  articles: {
    slug: string;
    title: string;
    chapter?: string;  // 章节编号
  }[];
}
```

---

## 📝 Phase 4: 重构 /articles/ 文章列表页

### 改进点
1. 添加分类标签（独立文章 vs 系列文章）
2. 优化卡片展示
3. 使用 UnifiedSidebar

### 文件变更
- **修改**: `src/pages/articles/index.astro`

---

## 📖 Phase 5: 优化文章详情页

### 新增功能
1. **面包屑导航**
   ```
   Home > Articles > GAMES101笔记
   ```

2. **系列导航** (如果是系列文章)
   ```
   上一篇: L05-06 ← 系列索引 → 下一篇: L13-14
   ```

3. **相关文章推荐** (基于标签)
   ```
   相关文章:
   - Unity Shader 结构
   - 数学基础
   ```

### 文件变更
- **修改**: `src/layouts/ArticleLayout.astro`
- **新建**: `src/components/Breadcrumb.astro`
- **新建**: `src/components/SeriesNav.astro`
- **新建**: `src/components/RelatedArticles.astro`

---

## 👤 Phase 6: 创建 /about/ 独立页面

### 内容结构
```
- 头像 + 姓名 + 职位
- 个人简介（详细版）
- 技术栈 / 专业领域
- 联系方式（Bilibili, GitHub, Email）
- 项目经历（可选）
```

### 文件变更
- **新建**: `src/pages/about.astro`
- **新建**: `src/content/about.md` (可选，使用内容集合)

---

## 📱 Phase 7: 统一移动端导航

### 改进点
1. MobileNav 添加新的导航项
2. 确保所有页面移动端都有搜索和过滤
3. 优化移动端首页体验

### 文件变更
- **修改**: `src/components/MobileNav.astro`

---

## 🎨 Phase 8: 设计优化

### 改进点
1. 统一卡片样式
2. 优化颜色层级
3. 添加空状态提示
4. 优化加载动画

### 文件变更
- **修改**: `src/styles/global.css`

---

## ✅ Phase 9: 测试和验证

### 测试清单
- [ ] 所有页面构建成功 (npm run build)
- [ ] 所有链接有效
- [ ] 移动端显示正常
- [ ] 搜索功能正常
- [ ] 标签过滤功能正常
- [ ] 系列导航正常
- [ ] 面包屑导航正常
- [ ] 相关文章推荐正常

---

## 📊 预期成果

### 改进前
```
访客进入首页 → 看到大量内容 → 不知道从哪里开始 → 随机点击 → 可能离开
```

### 改进后
```
访客进入首页 → 看到清晰的入口 → 选择感兴趣的分类 → 浏览内容 → 发现更多
```

### 具体指标
- 首页内容量: 减少 50%
- 导航点击深度: 减少至 2-3 层
- 页面间跳转: 增加 30% (通过相关推荐)
- 搜索使用率: 预计提升 (所有页面都有搜索)

---

## ⏱️ 预计工作量

| Phase | 任务 | 预计时间 |
|-------|------|----------|
| 1 | 统一侧边栏 | 30分钟 |
| 2 | 首页重构 | 1小时 |
| 3 | 系列总览页 | 1小时 |
| 4 | 文章列表页 | 30分钟 |
| 5 | 文章详情页优化 | 1.5小时 |
| 6 | About页面 | 30分钟 |
| 7 | 移动端导航 | 30分钟 |
| 8 | 设计优化 | 1小时 |
| 9 | 测试验证 | 1小时 |
| **总计** | | **约 7-8 小时** |

---

## 🚀 实施顺序

```
Phase 1 (统一侧边栏)
    ↓
Phase 2 (首页重构) + Phase 6 (About页面) [可并行]
    ↓
Phase 3 (系列总览)
    ↓
Phase 4 (文章列表) + Phase 5 (文章详情) [可并行]
    ↓
Phase 7 (移动端)
    ↓
Phase 8 (设计优化)
    ↓
Phase 9 (测试)
```

---

## ❓ 待确认事项

1. **首页精选文章数量**: 建议 2-3 篇，是否同意？
2. **系列页是否展示文章目录**: 建议展开显示，是否同意？
3. **About页面内容**: 需要你提供详细简介内容
4. **是否保留音乐播放器**: 当前有 MusicPlayer 组件

---

**确认后我将开始实施。请回复：**
- ✅ 计划通过，开始实施
- 🔄 需要修改 (请说明)
- ❓ 有疑问 (请提问)
