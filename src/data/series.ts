// src/data/series.ts - 系列文章元数据

export interface SeriesArticle {
  slug: string;
  title: string;
  chapter?: string;
  date: string;
}

export interface Series {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  category: string;
  tags: string[];
  articles: SeriesArticle[];
}

export const seriesList: Series[] = [
  {
    id: 'games101',
    title: 'GAMES101 - 现代计算机图形学入门',
    titleEn: 'GAMES101 - Modern Computer Graphics',
    description: '闫令琪老师的图形学入门课程笔记，涵盖光栅化、几何、光线追踪、动画等核心概念。',
    category: 'Computer Graphics',
    tags: ['Basic', 'Code'],
    articles: [
      { slug: 'games101/l02', title: 'L02 - Review of Linear Algebra', chapter: 'L02', date: '2024-01-15' },
      { slug: 'games101/l03', title: 'L03 - Transformation', chapter: 'L03', date: '2024-01-20' },
      { slug: 'games101/l05-06', title: 'L05-06 - Rasterization', chapter: 'L05-06', date: '2024-02-01' },
      { slug: 'games101/l07-09', title: 'L07-09 - Shading', chapter: 'L07-09', date: '2024-02-15' },
      { slug: 'games101/l13-14', title: 'L13-14 - Ray Tracing', chapter: 'L13-14', date: '2024-03-01' },
      { slug: 'games101/l14-16', title: 'L14-16 - Light & Materials', chapter: 'L14-16', date: '2024-03-15' },
      { slug: 'games101/l17', title: 'L17 - Animation', chapter: 'L17', date: '2024-03-20' },
    ]
  },
  {
    id: 'games104',
    title: 'GAMES104 - 游戏引擎架构',
    titleEn: 'GAMES104 - Game Engine Architecture',
    description: '游戏引擎从零开始的构建之旅，涵盖引擎架构、渲染、物理、动画、工具链等模块。',
    category: 'Game Engine',
    tags: ['Code', 'Basic'],
    articles: [
      { slug: 'games104/l04', title: 'L04 - Engine Architecture', chapter: 'L04', date: '2024-04-01' },
      { slug: 'games104/l05', title: 'L05 - Rendering', chapter: 'L05', date: '2024-04-10' },
      { slug: 'games104/l06-1', title: 'L06-1 - Rendering Pipeline', chapter: 'L06-1', date: '2024-04-15' },
      { slug: 'games104/l06-2', title: 'L06-2 - Advanced Rendering', chapter: 'L06-2', date: '2024-04-20' },
      { slug: 'games104/l07', title: 'L07 - Physics', chapter: 'L07', date: '2024-04-25' },
      { slug: 'games104/l08', title: 'L08 - Animation', chapter: 'L08', date: '2024-05-01' },
    ]
  },
  {
    id: 'inside-ue4',
    title: 'InsideUE4 - UE4 源码分析',
    titleEn: 'InsideUE4 - UE4 Source Code Analysis',
    description: '深入 UE4 引擎源码，理解其架构设计、对象系统、控制器、GameMode 等核心机制。',
    category: 'Unreal Engine',
    tags: ['UE', 'Code'],
    articles: [
      { slug: 'inside-ue4/chapter01-actorcomponent', title: 'Ch01 - Actor & Component', chapter: 'Ch01', date: '2026-01-04' },
      { slug: 'inside-ue4/chapter02-levelworld', title: 'Ch02 - Level & World', chapter: 'Ch02', date: '2026-01-04' },
      { slug: 'inside-ue4/chapter03-worldcontext', title: 'Ch03 - World Context', chapter: 'Ch03', date: '2026-01-07' },
      { slug: 'inside-ue4/chapter04-pawn', title: 'Ch04 - Pawn', chapter: 'Ch04', date: '2026-01-07' },
      { slug: 'inside-ue4/chapter05-controller', title: 'Ch05 - Controller', chapter: 'Ch05', date: '2026-01-04' },
      { slug: 'inside-ue4/chapter06-player-ai-controller', title: 'Ch06 - Player & AI Controller', chapter: 'Ch06', date: '2026-01-04' },
      { slug: 'inside-ue4/chapter07-gamemode-gamestate', title: 'Ch07 - GameMode & GameState', chapter: 'Ch07', date: '2026-01-04' },
      { slug: 'inside-ue4/chapter08-player', title: 'Ch08 - Player', chapter: 'Ch08', date: '2026-01-04' },
      { slug: 'inside-ue4/chapter09-gameinstance', title: 'Ch09 - GameInstance', chapter: 'Ch09', date: '2026-01-04' },
      { slug: 'inside-ue4/chapter10-summary', title: 'Ch10 - Summary', chapter: 'Ch10', date: '2026-01-04' },
    ]
  }
];

// 根据 ID 获取系列
export function getSeriesById(id: string): Series | undefined {
  return seriesList.find(s => s.id === id);
}

// 获取系列文章数量
export function getSeriesArticleCount(id: string): number {
  const series = getSeriesById(id);
  return series ? series.articles.length : 0;
}
