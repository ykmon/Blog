const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../Articles');
const DEST_PAGES_DIR = path.join(__dirname, '../src/pages/articles');
const DEST_PUBLIC_IMG_DIR = path.join(__dirname, '../public/Articles');

// 确保目标目录存在
if (!fs.existsSync(DEST_PAGES_DIR)) fs.mkdirSync(DEST_PAGES_DIR, { recursive: true });
if (!fs.existsSync(DEST_PUBLIC_IMG_DIR)) fs.mkdirSync(DEST_PUBLIC_IMG_DIR, { recursive: true });

function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            if (element.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
                fs.copyFileSync(path.join(from, element), path.join(to, element));
            }
        }
    });
}

function processDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // 递归处理子目录
            processDirectory(fullPath);
        } else if (item === 'index.html') {
            // 找到文章入口
            processArticle(currentPath);
        }
    }
}

function processArticle(articleDir) {
    const htmlContent = fs.readFileSync(path.join(articleDir, 'index.html'), 'utf-8');

    // 计算相对路径 slug
    const relativePath = path.relative(SOURCE_DIR, articleDir);
    const pathParts = relativePath.split(path.sep);

    // 忽略根目录的 index.html (列表页, depth=0)
    if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === '')) return;

    const category = pathParts[0];

    // Mapping for category names to be URL friendly and consistent
    // Also maps root-level folders to their filename
    const categoryMap = {
        'InsideUE4': 'inside-ue4',
        'GAMES101': 'games101',
        'GAMES104': 'games104',
        'Houdini': 'houdini',
        'Maya': 'maya',
        'UEPythonBinding': 'ue-python-binding',
        'UEPluginDev': 'ue-plugin-dev',
        'UEPluginCompile': 'ue-plugin-compile',
        'MIT18.06': 'mit18-06',
        'UnrealSVN': 'unreal-svn',
        'UnityShaderStructures': 'unity-shader-structures',
        'ShaderLabStructure': 'shader-lab-structure',
        'SubstancePainter': 'substance-painter',
        'GroomParameters': 'groom-parameters',
        'LumenRendering': 'lumen-rendering',
        'MathFoundation': 'math-foundation'
    };

    const mappedCategory = categoryMap[category] || category.toLowerCase();

    // Attempt to extract slug from remaining parts
    let slug = pathParts.slice(1).join('/').toLowerCase();

    let isRootArticle = false;

    // If slug is empty, it means the article is the category folder itself (depth=1)
    if (!slug) {
        isRootArticle = true;
        slug = mappedCategory; // Use the mapped name as filename
    }

    console.log(`Processing: ${pathParts.join('/')} -> ${isRootArticle ? 'Root: ' + slug : mappedCategory + '/' + slug}`);

    // 1. 提取文章内容 <article>...</article>
    // 先提取 content，再从 content 提取 title，避免匹配到 Site Header
    const articleMatch = htmlContent.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (!articleMatch) {
        console.warn(`No <article> tag found in ${articleDir}`);
        return;
    }
    let content = articleMatch[1];

    // 2. 提取标题
    const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/s);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

    // 3. 提取描述
    let description = '';
    const descMatch = content.match(/<div class="text-sm text-gray-500 font-serif italic mb-8">(.*?)<\/div>/s);
    if (descMatch) {
        description = descMatch[1].trim();
    }

    // 移除 h1 标题 (因为 Layout 中会再次渲染)
    content = content.replace(/<h1[^>]*>.*?<\/h1>/s, '');
    // 移除描述 div
    content = content.replace(/<div class="text-sm text-gray-500 font-serif italic mb-8">.*?<\/div>/s, '');
    // 移除顶部的 "Category / Slug" 面包屑 span
    content = content.replace(/<span class="text-ochre[^>]*>.*?<\/span>/s, '');
    // 移除 MathJax script
    content = content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");

    // 4. 处理图片
    let publicImgDir;
    let imgPathPrefix;

    if (isRootArticle) {
        // Root articles: src/pages/articles/ue-python-binding.astro
        // Images: public/Articles/ue-python-binding/
        publicImgDir = path.join(DEST_PUBLIC_IMG_DIR, slug);
        imgPathPrefix = `/Articles/${slug}/`.replace(/\\/g, '/');
    } else {
        // Nested articles: src/pages/articles/games101/l02.astro
        // Images: public/Articles/games101/l02/
        publicImgDir = path.join(DEST_PUBLIC_IMG_DIR, mappedCategory, slug);
        imgPathPrefix = `/Articles/${mappedCategory}/${slug}/`.replace(/\\/g, '/');
    }

    copyFolderSync(articleDir, publicImgDir);

    // 替换内容中的图片路径
    content = content.replace(/src="([^"]+)"/g, (match, src) => {
        if (src.startsWith('http')) return match;
        const filename = path.basename(src);
        return `src="${imgPathPrefix}${filename}"`;
    });

    // 5. 生成 Astro 文件
    let astroFilePath;
    let layoutPath;

    if (isRootArticle) {
        // Output: src/pages/articles/ue-python-binding.astro
        astroFilePath = path.join(DEST_PAGES_DIR, `${slug}.astro`);

        // Depth relative to src/pages/articles/ is 0 (it's inside it).
        // File: src/pages/articles/foo.astro
        // ../ -> src/pages
        // ../../ -> src
        // ../../layouts/ArticleLayout.astro
        layoutPath = '../../layouts/ArticleLayout.astro';
    } else {
        // Output: src/pages/articles/games101/l02.astro
        const astroDir = path.join(DEST_PAGES_DIR, mappedCategory);
        if (!fs.existsSync(astroDir)) fs.mkdirSync(astroDir, { recursive: true });

        astroFilePath = path.join(astroDir, `${path.basename(slug)}.astro`);

        // pathParts like [games101, l02] mean we are 2 levels deep inside 'Articles' source.
        // But Astro structure is src/pages/articles/games101/l02.astro
        // ../ -> games101
        // ../../ -> articles
        // ../../../ -> pages
        // ../../../layouts/ArticleLayout.astro (Wait? layouts is at src/layouts)
        // src/pages/articles/games101/l02.astro
        // ../ games101 (NO, ../ is parent dir of l02.astro, which IS games101 dir contents looking at peer dir?)
        // Let's count from file:
        // Dir: src/pages/articles/games101/
        // ../ -> src/pages/articles
        // ../../ -> src/pages
        // ../../../ -> src/
        // ../../../layouts/ArticleLayout.astro -> src/layouts/ArticleLayout.astro.
        // Correct.
        // depth=2 (games101, l02) -> 3 dots.
        const depth = pathParts.length;
        layoutPath = '../'.repeat(depth + 1) + 'layouts/ArticleLayout.astro';
    }

    // 清理 content 里的空行
    content = content.replace(/^\s*[\r\n]/gm, '');

    // Critical fix: Escape backslashes for JS string interpolation
    const escapedContent = content
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');

    const finalAstroContent = `---
import ArticleLayout from '${layoutPath}';

const content = \`${escapedContent}\`;
---

<ArticleLayout 
  title="${title.replace(/"/g, '\\"')}" 
  category="${isRootArticle ? 'TechArt' : mappedCategory}"
  description="${description.replace(/"/g, '\\"')}"
>
  <div set:html={content} />
</ArticleLayout>
`;

    fs.writeFileSync(astroFilePath, finalAstroContent);
    console.log(`Generated: ${astroFilePath}`);
}

console.log('Starting migration...');
processDirectory(SOURCE_DIR);
console.log('Migration complete.');
