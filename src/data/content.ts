export { allTags, getTagCategory, tagCategories } from './tags';

export interface Article {
    type: 'article';
    href: string;
    title: string;
    category: string;
    tags: string[];
    description: string;
    /** ISO 格式日期 YYYY-MM-DD */
    date: string;
    readTime?: string;
    image?: string;
    imageAlt?: string;
    placeholder?: string;
}

export interface Tool {
    type: 'tool';
    href: string;
    icon: string;
    title: string;
    tags: string[];
    description: string;
    /** ISO 格式日期 YYYY-MM-DD */
    date: string;
}

export interface Video {
    type: 'video';
    title: string;
    category: string;
    tags: string[];
    /** ISO 格式日期 YYYY-MM-DD */
    date: string;
    bvid: string;
    aid: string;
    cid: string;
}

export type ContentItem = Article | Tool | Video;

export const videos: Video[] = [
    {
        type: 'video',
        title: '自动化布料解算 Automate Cloth Solver Pipeline',
        category: 'Procedural / CFX',
        tags: ['Houdini', 'Simulation', 'Automation'],
        date: '2024-12-10',
        bvid: 'BV14EqNYdEF4',
        aid: '113622856505513',
        cid: '27259832910'
    },
    {
        type: 'video',
        title: '程序化生成场景 PCG Landscape',
        category: 'Level Design / PCG',
        tags: ['UE', 'PCG'],
        date: '2025-02-05',
        bvid: 'BV1qfPze6ExY',
        aid: '113946639995417',
        cid: '28217575778'
    },
];
