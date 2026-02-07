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

export const articles: Article[] = [
    {
        type: 'article',
        href: '/articles/houdini-bypass-qt-ui/',
        title: 'Houdini 中绕过 Qt UI，直接调用 Python 逻辑',
        category: 'Houdini',
        tags: ['Houdini', 'Automation', 'Code'],
        description: '在 Houdini 自动化或 Headless 环境中，如何绕过 Qt Dialog 直接执行核心 Python 业务逻辑。',
        date: '2026-01-21',
        readTime: '10 Min Read',
        placeholder: 'Houdini'
    },
    {
        type: 'article',
        href: '/articles/ue-plugin-dev/',
        title: 'UE 插件开发笔记：深入剖析 SetSkeletalMeshSectionSettings',
        category: 'Unreal Engine',
        tags: ['UE', 'Code', 'Plugin Development'],
        description: '深入解析如何在 C++ 中正确修改 SkeletalMesh 的 Section 数据，重点讲解 UE5 引入的 UserSectionsData 陷阱。',
        date: '2025-01-14',
        readTime: '8 Min Read',
        placeholder: 'CPP'
    },
    {
        type: 'article',
        href: '/articles/inside-ue4/',
        title: 'InsideUE4 源码分析系列',
        category: 'InsideUE4',
        tags: ['UE', 'Code', 'Basic'],
        description: '深入 UE4 GamePlay 架构源码，从 Actor/Component 到 Level/World。包含10篇笔记，持续更新中。',
        date: '2025-01-04',
        readTime: 'Series',
        image: '/Articles/InsideUE4/Chapter01-ActorComponent/image.png'
    },
    {
        type: 'article',
        href: '/articles/ue-python-binding/',
        title: 'UE 学习笔记：从 C++ 到 Python 的函数暴露机制',
        category: 'Unreal Engine',
        tags: ['UE', 'Code', 'Automation'],
        description: '深入理解UE反射系统如何自动生成Python绑定，以及从Native代码到Scripting的映射规则。',
        date: '2025-01-12',
        readTime: '6 Min Read',
        placeholder: 'UE5'
    },
    {
        type: 'article',
        href: '/articles/substance-painter/',
        title: 'Substance Painter 小技巧',
        category: '3D Art',
        tags: ['Others DCC'],
        description: '材质制作、UV处理、贴花融合等实用技巧汇总。',
        date: '2021-09-15',
        readTime: '5 Min Read',
        image: '/Articles/substance-painter/Untitled.png'
    },
    {
        type: 'article',
        href: '/articles/games104/',
        title: 'GAMES104 游戏引擎系列',
        category: 'GAMES104',
        tags: ['Basic', 'Animation'],
        description: '从渲染实践到动画技术，深入理解现代游戏引擎架构。包含6篇笔记。',
        date: '2021-06-10',
        readTime: 'Series',
        image: '/Articles/GAMES104/L04/Untitled.png'
    },
    {
        type: 'article',
        href: '/articles/games101/',
        title: 'GAMES101 图形学入门系列',
        category: 'GAMES101',
        tags: ['Basic'],
        description: '从线性代数到光线追踪，系统学习计算机图形学基础知识。包含7篇笔记。',
        date: '2021-03-05',
        readTime: 'Series',
        image: '/Articles/GAMES101/L02/Untitled.png'
    },
    {
        type: 'article',
        href: '/articles/math-foundation/',
        title: '数学基础',
        category: 'Unity Shader',
        tags: ['Basic', 'Code'],
        description: '坐标系、矢量、矩阵、变换与坐标空间。从模型空间到屏幕空间的完整变换流程。',
        date: '2021-01-15',
        readTime: '15 Min Read',
        image: '/Articles/math-foundation/Untitled 2.png'
    },
    {
        type: 'article',
        href: '/articles/lumen-rendering/',
        title: '高品质渲染解析 - Lumen',
        category: 'Unreal Engine',
        tags: ['UE', 'Basic'],
        description: 'Lumen光线追踪与Surface Cache详解，软件光追与硬件光追的区别与应用。',
        date: '2021-08-20',
        readTime: '8 Min Read',
        image: '/Articles/lumen-rendering/Untitled 7.png'
    },
    {
        type: 'article',
        href: '/articles/ue-plugin-compile/',
        title: 'UE5 插件编译报错解决方案',
        category: 'Unreal Engine',
        tags: ['UE', 'Plugin Development'],
        description: '解决 "Plugin could not be compiled. Try rebuilding from source manually" 错误的完整指南。',
        date: '2021-11-10',
        readTime: '3 Min Read',
        placeholder: 'UE5'
    },
    {
        type: 'article',
        href: '/articles/mit18-06/',
        title: 'MIT 18.06 线性代数笔记 - 第一讲',
        category: 'Linear Algebra',
        tags: ['Basic'],
        description: '方程组的几何解释：从 Row Picture 到 Column Picture。了解矩阵乘法的本质。',
        date: '2025-12-23',
        readTime: '10 Min Read',
        image: '/Articles/MIT18.06/images/row_picture.png'
    },
    {
        type: 'article',
        href: '/articles/unity-shader-structures/',
        title: 'Unity Shader 结构体类型',
        category: 'Unity Shader',
        tags: ['Unity', 'Code'],
        description: '详细解释 a2v, v2f 等常用结构体的定义与作用，包括 appdata_base, appdata_tan, appdata_full 等内置结构。',
        date: '2022-12-22',
        readTime: '3 Min Read',
        image: '/Articles/UnityShaderStructures/images/cover.png'
    },
    {
        type: 'article',
        href: '/articles/groom-parameters/',
        title: 'Groom 物理参数详解',
        category: 'Unreal Engine',
        tags: ['UE', 'Simulation'],
        description: '深入拆解 Solver Settings 中的弯曲约束与拉伸约束，掌握数字毛发的物理模拟艺术。',
        date: '2022-12-20',
        readTime: '3 Min Read',
        image: '/Articles/GroomParameters/images/Untitled.png'
    },
    {
        type: 'article',
        href: '/articles/unreal-svn/',
        title: 'Unreal SVN 仓库搭建指北',
        category: 'DevOps',
        tags: ['UE', 'DevOps'],
        description: '从 TortoiseSVN 安装到 UE 源码控制配置，为团队协作构建稳固的版本控制基石。',
        date: '2022-12-15',
        readTime: '5 Min Read',
        image: '/Articles/unreal-svn/Untitled_7.png'
    },
    {
        type: 'article',
        href: '/articles/shader-lab-structure/',
        title: 'ShaderLab 结构详解',
        category: 'Shader',
        tags: ['Unity', 'Code'],
        description: '通过图解方式拆解 Unity ShaderLab 的核心结构，让代码不再只是枯燥的字符。',
        date: '2022-12-10',
        readTime: '4 Min Read',
        image: '/Articles/ShaderLabStructure/images/cover.webp'
    },
];

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
