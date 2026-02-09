// 标签分类系统
export const tagCategories = {
    tools: ['UE', 'Unity', 'Houdini', 'Maya', 'Others DCC'],
    languages: ['Code'],
    domains: ['PCG', 'Animation', 'Automation', 'Simulation'],
    foundations: ['Basic'],
    practices: ['Plugin Development', 'DevOps']
} as const;

// 所有可用标签的扁平列表
export const allTags = Object.values(tagCategories).flat();

// 获取标签所属分类
export function getTagCategory(tag: string): keyof typeof tagCategories | null {
    for (const [category, tags] of Object.entries(tagCategories)) {
        if ((tags as readonly string[]).includes(tag)) {
            return category as keyof typeof tagCategories;
        }
    }
    return null;
}

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

export const tools: Tool[] = [
    {
        type: 'tool',
        href: '/tools/switch-to-output-group/',
        icon: '☊',
        title: '从 Switch 创建输出组',
        tags: ['Houdini', 'Code'],
        description: 'Quickly create output groups from switch nodes',
        date: '2023-11-15'
    },
    {
        type: 'tool',
        href: '/tools/add-handle-to-hda/',
        icon: '🔧',
        title: '如何为 HDA 添加 Handle',
        tags: ['Houdini', 'Code'],
        description: 'Adding custom handles to Houdini Digital Assets',
        date: '2023-11-20'
    },
    {
        type: 'tool',
        href: '/tools/quick-add-parameter/',
        icon: '⚡',
        title: '快速添加自定义 Parameter',
        tags: ['Houdini', 'Code'],
        description: 'Quickly add custom parameters scripts',
        date: '2023-11-25'
    },
    {
        type: 'tool',
        href: '/tools/batch-create-object-merge/',
        icon: '⛓️',
        title: '批量创建选中的 ObjectMerge',
        tags: ['Houdini', 'Code'],
        description: 'Batch create Object Merge nodes for selection',
        date: '2023-12-01'
    },
    {
        type: 'tool',
        href: '/tools/split-geometry-by-group/',
        icon: '✂️',
        title: '按照组拆分模型',
        tags: ['Houdini', 'Code'],
        description: 'Split geometry by groups automatically',
        date: '2023-12-05'
    },
    {
        type: 'tool',
        href: '/tools/node-input-count/',
        icon: '🔢',
        title: '节点输入数量',
        tags: ['Houdini', 'Code'],
        description: 'Managing node input connections util',
        date: '2023-12-10'
    },
];

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
