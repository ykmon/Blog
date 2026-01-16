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
        if (tags.includes(tag)) {
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
    date: string;
}

export interface Video {
    type: 'video';
    title: string;
    category: string;
    tags: string[];
    date: string;
    bvid: string;
    aid: string;
    cid: string;
}

export type ContentItem = Article | Tool | Video;

export const articles: Article[] = [
    {
        type: 'article',
        href: '/articles/ue-plugin-dev/',
        title: 'UE 插件开发笔记：深入剖析 SetSkeletalMeshSectionSettings',
        category: 'Unreal Engine',
        tags: ['UE', 'Code', 'Plugin Development'],
        description: '深入解析如何在 C++ 中正确修改 SkeletalMesh 的 Section 数据，重点讲解 UE5 引入的 UserSectionsData 陷阱。',
        date: 'Jan 14, 2026',
        readTime: '8 Min Read',
        placeholder: 'CPP'
    },
    {
        type: 'article',
        href: '/articles/inside-ue4/',
        title: 'InsideUE4 源码分析系列',
        category: 'InsideUE4',
        tags: ['UE', 'Code', 'Basic'],
        description: '深入 UE4 GamePlay 架构源码，从 Actor/Component 到 Level/World。包含2篇笔记，持续更新中。',
        date: 'Jan 4, 2026',
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
        date: 'Jan 12, 2026',
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
        date: 'Sep 15, 2021',
        readTime: '5 Min Read',
        image: '/Articles/SubstancePainter/Untitled.png'
    },
    {
        type: 'article',
        href: '/articles/games104/',
        title: 'GAMES104 游戏引擎系列',
        category: 'GAMES104',
        tags: ['Basic', 'Animation'],
        description: '从渲染实践到动画技术，深入理解现代游戏引擎架构。包含6篇笔记。',
        date: 'Jun 10, 2021',
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
        date: 'Mar 5, 2021',
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
        date: 'Jan 15, 2021',
        readTime: '15 Min Read',
        image: '/Articles/MathFoundation/Untitled 2.png'
    },
    {
        type: 'article',
        href: '/articles/lumen-rendering/',
        title: '高品质渲染解析 - Lumen',
        category: 'Unreal Engine',
        tags: ['UE', 'Basic'],
        description: 'Lumen光线追踪与Surface Cache详解，软件光追与硬件光追的区别与应用。',
        date: 'Aug 20, 2021',
        readTime: '8 Min Read',
        image: '/Articles/LumenRendering/Untitled 7.png'
    },
    {
        type: 'article',
        href: '/articles/ue-plugin-compile/',
        title: 'UE5 插件编译报错解决方案',
        category: 'Unreal Engine',
        tags: ['UE', 'Plugin Development'],
        description: '解决 "Plugin could not be compiled. Try rebuilding from source manually" 错误的完整指南。',
        date: 'Nov 10, 2021',
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
        date: 'Dec 23, 2025',
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
        date: 'Dec 22, 2022',
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
        date: 'Dec 20, 2022',
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
        date: 'Dec 15, 2022',
        readTime: '5 Min Read',
        image: '/Articles/UnrealSVN/images/Untitled_7.png'
    },
    {
        type: 'article',
        href: '/articles/shaderlab-structure/',
        title: 'ShaderLab 结构详解',
        category: 'Shader',
        tags: ['Unity', 'Code'],
        description: '通过图解方式拆解 Unity ShaderLab 的核心结构，让代码不再只是枯燥的字符。',
        date: 'Dec 10, 2022',
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
        date: 'Nov 15, 2023'
    },
    {
        type: 'tool',
        href: '/tools/add-handle-to-hda/',
        icon: '🔧',
        title: '如何为 HDA 添加 Handle',
        tags: ['Houdini', 'Code'],
        description: 'Adding custom handles to Houdini Digital Assets',
        date: 'Nov 20, 2023'
    },
    {
        type: 'tool',
        href: '/tools/quick-add-parameter/',
        icon: '⚡',
        title: '快速添加自定义 Parameter',
        tags: ['Houdini', 'Code'],
        description: 'Quickly add custom parameters scripts',
        date: 'Nov 25, 2023'
    },
    {
        type: 'tool',
        href: '/tools/batch-create-object-merge/',
        icon: '⛓️',
        title: '批量创建选中的 ObjectMerge',
        tags: ['Houdini', 'Code'],
        description: 'Batch create Object Merge nodes for selection',
        date: 'Dec 01, 2023'
    },
    {
        type: 'tool',
        href: '/tools/split-geometry-by-group/',
        icon: '✂️',
        title: '按照组拆分模型',
        tags: ['Houdini', 'Code'],
        description: 'Split geometry by groups automatically',
        date: 'Dec 05, 2023'
    },
    {
        type: 'tool',
        href: '/tools/node-input-count/',
        icon: '🔢',
        title: '节点输入数量',
        tags: ['Houdini', 'Code'],
        description: 'Managing node input connections util',
        date: 'Dec 10, 2023'
    },
];

export const videos: Video[] = [
    {
        type: 'video',
        title: '自动化布料解算 Automate Cloth Solver Pipeline',
        category: 'Procedural / CFX',
        tags: ['Houdini', 'Simulation', 'Automation'],
        date: 'Dec 10, 2024',
        bvid: 'BV14EqNYdEF4',
        aid: '113622856505513',
        cid: '27259832910'
    },
    {
        type: 'video',
        title: '程序化生成场景 PCG Landscape',
        category: 'Level Design / PCG',
        tags: ['UE', 'PCG'],
        date: 'Feb 05, 2025',
        bvid: 'BV1qfPze6ExY',
        aid: '113946639995417',
        cid: '28217575778'
    },
];
