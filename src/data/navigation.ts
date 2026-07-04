export type SectionId = 'home' | 'articles' | 'series' | 'tools' | 'videos' | 'gallery' | 'about';

export interface NavItem {
  id: SectionId;
  num: string;
  label: string;
  labelEn: string;
  href: string;
  description: string;
}

export const navItems: NavItem[] = [
  {
    id: 'home',
    num: '00',
    label: '首页',
    labelEn: 'Home',
    href: '/',
    description: '站点总览与最新内容入口。',
  },
  {
    id: 'articles',
    num: '01',
    label: '文章列表',
    labelEn: 'Articles',
    href: '/articles/',
    description: '按标签、精选与时间线浏览文章。',
  },
  {
    id: 'series',
    num: '02',
    label: '系列笔记',
    labelEn: 'Series',
    href: '/series/',
    description: '按学习路线组织的系列内容。',
  },
  {
    id: 'tools',
    num: '03',
    label: '工具库',
    labelEn: 'Tools',
    href: '/tools/',
    description: 'Houdini 与流程自动化工具集合。',
  },
  {
    id: 'videos',
    num: '04',
    label: '视频教程',
    labelEn: 'Videos',
    href: '/videos/',
    description: '可视化技术演示与流程验证。',
  },
  {
    id: 'gallery',
    num: '05',
    label: '相册',
    labelEn: 'Gallery',
    href: '/gallery/',
    description: '风景、扫街与日常观察的影像记录。',
  },
  {
    id: 'about',
    num: '06',
    label: '关于',
    labelEn: 'About',
    href: '/about/',
    description: '作者背景、方向与技术栈。',
  },
];

export function getNavItemById(sectionId: SectionId): NavItem {
  return navItems.find((item) => item.id === sectionId) ?? navItems[0];
}
