/**
 * 批量将现有 HTML 文章转换为 Astro 页面
 * 运行方式: node scripts/migrate-articles.js
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 文章映射配置
const articleConfigs = [
    { oldPath: 'Articles/MIT18.06', newSlug: 'mit18-06', category: 'Linear Algebra' },
    { oldPath: 'Articles/UEPythonBinding', newSlug: 'ue-python-binding', category: 'Unreal Engine / Python' },
    { oldPath: 'Articles/UEPluginDev', newSlug: 'ue-plugin-dev', category: 'Unreal Engine / Plugin Dev' },
    { oldPath: 'Articles/UEPluginCompile', newSlug: 'ue-plugin-compile', category: 'Unreal Engine / Plugin' },
    { oldPath: 'Articles/UnityShaderStructures', newSlug: 'unity-shader-structures', category: 'Unity Shader' },
    { oldPath: 'Articles/ShaderLabStructure', newSlug: 'shaderlab-structure', category: 'Shader' },
    { oldPath: 'Articles/UnrealSVN', newSlug: 'unreal-svn', category: 'DevOps' },
    { oldPath: 'Articles/GroomParameters', newSlug: 'groom-parameters', category: 'Unreal Engine' },
    { oldPath: 'Articles/LumenRendering', newSlug: 'lumen-rendering', category: 'Unreal Engine' },
    { oldPath: 'Articles/MathFoundation', newSlug: 'math-foundation', category: 'Unity Shader' },
    { oldPath: 'Articles/SubstancePainter', newSlug: 'substance-painter', category: '3D Art' },
    // 系列文章
    { oldPath: 'Articles/GAMES101', newSlug: 'games101', category: 'GAMES101', isSeries: true },
    { oldPath: 'Articles/GAMES104', newSlug: 'games104', category: 'GAMES104', isSeries: true },
    { oldPath: 'Articles/InsideUE4', newSlug: 'inside-ue4', category: 'InsideUE4', isSeries: true },
];

function extractArticleContent(htmlPath) {
    const htmlFile = path.join(htmlPath, 'index.html');
    if (!fs.existsSync(htmlFile)) {
        console.log(`  跳过: ${htmlFile} 不存在`);
        return null;
    }

    const html = fs.readFileSync(htmlFile, 'utf-8');
    const $ = cheerio.load(html);

    // 提取标题
    const title = $('article h1').first().text().trim() || $('title').text().replace(' - TechArt Chronicle', '').trim();

    // 提取文章内容 (prose 区域内的内容，排除 h1)
    const article = $('article.prose');
    article.find('h1').first().remove(); // 移除标题，因为会在模板中显示
    article.find('span.text-ochre').first().remove(); // 移除分类标签
    article.find('div.text-sm.text-gray-500').first().remove(); // 移除日期

    // 获取纯 HTML 内容
    let content = article.html() || '';

    // 修复图片路径
    content = content.replace(/src="\.\.\/\.\.\//g, 'src="/');
    content = content.replace(/src="\.\.\//g, 'src="/Articles/');
    content = content.replace(/src="\.\/images\//g, `src="/Articles/${path.basename(htmlPath)}/images/`);
    content = content.replace(/src="images\//g, `src="/Articles/${path.basename(htmlPath)}/images/`);

    return { title, content };
}

function generateAstroFile(config) {
    const htmlPath = path.join(__dirname, '..', config.oldPath);
    const result = extractArticleContent(htmlPath);

    if (!result) return;

    const { title, content } = result;

    const astroContent = `---
// ${config.newSlug}.astro - 自动从 HTML 迁移
import ArticleLayout from '../../layouts/ArticleLayout.astro';
---

<ArticleLayout 
  title="${title.replace(/"/g, '\\"')}" 
  category="${config.category}"
>
${content}
</ArticleLayout>
`;

    const outputPath = path.join(__dirname, '..', 'src', 'pages', 'articles', `${config.newSlug}.astro`);

    // 确保目录存在
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, astroContent);
    console.log(`✅ 已生成: ${config.newSlug}.astro`);
}

// 主函数
console.log('开始迁移文章...\n');

articleConfigs.forEach(config => {
    if (!config.isSeries) {
        generateAstroFile(config);
    } else {
        console.log(`📁 系列文章 ${config.oldPath} 需要单独处理`);
    }
});

console.log('\n迁移完成！');
