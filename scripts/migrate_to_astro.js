const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});

const SOURCE_DIR = path.join(__dirname, '../Articles');
const TARGET_CONTENT_DIR = path.join(__dirname, '../astro_migration/src/content/articles');
const TARGET_PUBLIC_IMG_DIR = path.join(__dirname, '../astro_migration/public/images');

// Ensure target directories exist
if (!fs.existsSync(TARGET_CONTENT_DIR)) fs.mkdirSync(TARGET_CONTENT_DIR, { recursive: true });
if (!fs.existsSync(TARGET_PUBLIC_IMG_DIR)) fs.mkdirSync(TARGET_PUBLIC_IMG_DIR, { recursive: true });

function migrateArticle(dirName) {
    if (dirName === 'UnrealSVN') return; // Previously migrated manually

    const articlePath = path.join(SOURCE_DIR, dirName);
    const htmlPath = path.join(articlePath, 'index.html');

    if (!fs.existsSync(htmlPath)) return;

    console.log(`Migrating: ${dirName}...`);

    const html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);

    // Extract Metadata
    const title = $('h1').first().text().trim();
    const category = $('.text-ochre.font-bold.uppercase').first().text().split('/')[1]?.trim() || 'Tech';
    const rawDate = $('.italic').first().text(); // "Dec 23, 2025 • 10 Min Read"

    // Parse Date
    let pubDate = new Date().toISOString().split('T')[0];
    let readTime = '5 Min Read';
    try {
        // Simple heuristic for date parsing from string like "Dec 23, 2025 • 10 Min Read"
        // Actually the home page has data-date attributes, but individual pages don't always have meta tags
        // Let's look for the date string in the subtitle text
        // Or we can try to find it in the sidebar or just use current date if fail
        // The Articles/index.html has the mapping of dates! 
        // But for now let's try to extract from the text content which usually looks like: "Dec 10, 2022 • 4 Min Read"
        // It's usually in a specific div

        // Let's try to find text matching date pattern
        const metaText = $('body').text().match(/([A-Z][a-z]{2} \d{1,2}, \d{4})/);
        if (metaText) {
            pubDate = new Date(metaText[0]).toISOString().split('T')[0];
        }

        const readTimeMatch = $('body').text().match(/(\d+ Min Read)/);
        if (readTimeMatch) {
            readTime = readTimeMatch[0];
        }

    } catch (e) {
        console.warn(`Date parse warning for ${dirName}: ${e.message}`);
    }

    // Extract Description
    let description = $('.lead').text().trim();
    if (!description) {
        description = $('p').first().text().trim().substring(0, 150) + '...';
    }

    // Extract Content
    // Assuming content is in <article> or .prose
    let $content = $('.prose');
    if ($content.length === 0) $content = $('article');

    // Check if empty (e.g. redirect page)
    if ($content.length === 0) {
        console.warn(`Skipping ${dirName}: No content found (might be a redirect).`);
        return;
    }

    // Remove title and lead from content to avoid duplication
    $content.find('h1').remove();
    $content.find('.lead').remove();
    $content.find('.text-ochre').remove(); // Remove category tag inside article
    $content.find('.border-t').last().remove(); // Remove footer navigation
    $content.find('div.bg-gray-200.p-6').remove(); // Remove references box if needed, or keep it? 
    // Actually keep references, they are useful.

    // Fix Images
    // Move images and update src
    const slug = dirName.toLowerCase();
    const targetImgDir = path.join(TARGET_PUBLIC_IMG_DIR, dirName); // Keep CamelCase for folder to match resource? Or slug?
    // Let's use dirName for image folder to avoid collision
    if (!fs.existsSync(targetImgDir)) fs.mkdirSync(targetImgDir, { recursive: true });

    let heroImage = '';

    $content.find('img').each((i, el) => {
        const src = $(el).attr('src');
        if (src && !src.startsWith('http')) {
            // src is likely "images/cover.png"
            const imgFileName = path.basename(src);
            const sourceImgPath = path.join(articlePath, path.dirname(src), imgFileName);

            if (fs.existsSync(sourceImgPath)) {
                const destImgPath = path.join(targetImgDir, imgFileName);
                fs.copyFileSync(sourceImgPath, destImgPath);

                // Update src to absolute path
                const newSrc = `/images/${dirName}/${imgFileName}`;
                $(el).attr('src', newSrc);

                if (i === 0) heroImage = newSrc; // First image as hero
            }
        }
    });

    // Convert to Markdown
    let htmlContent = $content.html() || '';
    if (!htmlContent.trim()) {
        console.warn(`Skipping ${dirName}: Content is empty.`);
        return;
    }
    let markdown = turndownService.turndown(htmlContent);

    // Fix some turndown artifacts
    markdown = markdown.replace(/\\_/g, '_');

    // FIX LATEX: Unescape backslashes and standardize delimiters
    // 1. Unescape double backslashes (\\ -> \)
    markdown = markdown.replace(/\\\\/g, '\\');
    // 2. Convert \( ... \) to $ ... $
    markdown = markdown.split('\\(').join('$').split('\\)').join('$');
    // 3. Convert \[ ... \] to $$ ... $$
    markdown = markdown.split('\\[').join('$$').split('\\]').join('$$');

    // Generate MD File
    const mdContent = `---
title: '${title.replace(/'/g, "''")}'
description: '${description.replace(/'/g, "''")}'
pubDate: '${pubDate}'
category: '${category}'
readTime: '${readTime}'
heroImage: '${heroImage}'
---

${markdown}
`;

    const mdFilename = `${dirName.replace(/ /g, '-').toLowerCase()}.md`;
    fs.writeFileSync(path.join(TARGET_CONTENT_DIR, mdFilename), mdContent);
    console.log(`Saved: ${mdFilename}`);
}

// Run migration
fs.readdirSync(SOURCE_DIR).forEach(file => {
    const filePath = path.join(SOURCE_DIR, file);
    if (fs.statSync(filePath).isDirectory()) {
        migrateArticle(file);
    }
});
