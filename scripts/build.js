const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BLOG_ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(BLOG_ROOT, 'index.html');
const ARTICLES_PATH = path.join(BLOG_ROOT, 'Articles', 'index.html');
const VIDEOS_PATH = path.join(BLOG_ROOT, 'Videos', 'index.html');
const TOOLS_PATH = path.join(BLOG_ROOT, 'Tools', 'index.html');

console.log('Starting build process...');

function extractItems(filePath, selector, typeInfo) {
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return [];
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);
    const items = [];

    $(selector).each((i, el) => {
        const $el = $(el);
        const date = $el.attr('data-date');

        if (!date) return;

        const item = {
            type: typeInfo.type,
            date: date,
            dateDisplay: new Date(date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
            year: date.split('-')[0], // Extract year
            rawDate: new Date(date)
        };

        if (typeInfo.type === 'Article') {
            item.title = $el.find('h2').text().trim();
            item.desc = $el.find('p').first().text().trim();
            item.link = './Articles/' + $el.attr('href').replace(/^\.\//, '');
            item.tags = $el.find('.text-ochre.uppercase').text().trim();
            item.readTime = $el.find('.italic').last().text().trim();
            // Get Image src
            const imgSrc = $el.find('img').attr('src');
            if (imgSrc) {
                // Fix image path relative to root
                // Original: ./GroomParameters/images/Untitled.png
                // Target: ./Articles/GroomParameters/images/Untitled.png
                item.image = './Articles/' + imgSrc.replace(/^\.\//, '');
            }
        } else if (typeInfo.type === 'Video') {
            item.title = $el.find('h3').text().trim();
            item.category = $el.find('.uppercase').text().trim();
            item.iframeSrc = $el.find('iframe').attr('src');
        } else if (typeInfo.type === 'Tool') {
            item.title = $el.find('h3').text().trim();
            item.desc = $el.find('p').text().trim();
            item.link = './Tools/' + $el.attr('href');
            item.icon = $el.find('.text-ochre.text-2xl').text().trim();
        }

        items.push(item);
    });

    return items;
}

// 1. Extract All Items
const articles = extractItems(ARTICLES_PATH, '[data-type="Article"]', { type: 'Article' });
const videos = extractItems(VIDEOS_PATH, '[data-type="Video"]', { type: 'Video' });
const tools = extractItems(TOOLS_PATH, '[data-type="Tool"]', { type: 'Tool' });

console.log(`Found: ${articles.length} Articles, ${videos.length} Videos, ${tools.length} Tools`);

// 2. Sort and filter
const allItems = [...articles, ...videos, ...tools];
allItems.sort((a, b) => b.rawDate - a.rawDate);
const latestItems = allItems.slice(0, 10); // Top 10

// 3. Generate HTML
let timelineHtml = '';

latestItems.forEach(item => {
    // Generate HTML based on type
    if (item.type === 'Article') {
        timelineHtml += `
            <!-- Entry: Article -->
            <article class="relative mb-20 md:grid md:grid-cols-12 gap-8 items-start blur-load group scroll-mt-24">
                <div class="hidden lg:block absolute left-8 top-0 -translate-x-[calc(50%+1px)] bg-paper py-1 text-xs font-bold text-ochre border border-gray-300 z-10 w-fit px-2">
                    ${item.dateDisplay}
                </div>
                <div class="md:col-span-12 lg:col-span-12">
                    <div class="flex flex-col mb-4">
                        <span class="text-ochre font-bold text-xs tracking-wider uppercase mb-2">No. --- — ${item.tags}</span>
                        <a href="${item.link}" class="block">
                            <h2 class="font-serif text-3xl md:text-5xl font-bold leading-tight text-ink group-hover:text-forest transition-colors cursor-pointer">
                                ${item.title}
                            </h2>
                        </a>
                    </div>
                    <div class="grid md:grid-cols-2 gap-8 relative z-20">
                        <div class="font-body text-gray-700 leading-relaxed text-lg text-justify">
                            <a href="${item.link}" class="block hover:text-ink transition-colors">
                                <p class="drop-cap">${item.desc}</p>
                            </a>
                        </div>
                        <div class="relative pt-2">
                             ${item.image ? `
                            <a href="${item.link}" class="block aspect-[4/3] bg-gray-200 overflow-hidden rounded-sm shadow-md">
                                <img src="${item.image}" class="object-cover w-full h-full hover:scale-105 transition-transform duration-700 grayscale-[0.2]" alt="${item.title}">
                            </a>` : ''}
                            <div class="mt-4 flex justify-between items-center border-t border-gray-300 pt-3">
                                <span class="text-xs text-gray-500 uppercase tracking-widest">${item.readTime}</span>
                                <a href="${item.link}" class="text-sm text-ochre italic font-serif hover:underline">Read Full Article ⟶</a>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
            <hr class="border-gray-200 mb-20 w-1/2 mx-auto">
        `;
    } else if (item.type === 'Video') {
        timelineHtml += `
             <!-- Entry: Video -->
            <article class="relative mb-20 blur-load scroll-mt-24">
                <div class="hidden lg:block absolute left-8 top-0 -translate-x-[calc(50%+1px)] bg-paper py-1 text-xs font-bold text-ochre border border-gray-300 z-10 w-fit px-2">
                    ${item.dateDisplay}
                </div>
                <div class="max-w-4xl mx-auto">
                    <div class="bg-white p-3 retro-frame transform hover:-translate-y-1 transition-transform duration-500">
                        <div class="aspect-video bg-gray-800 relative overflow-hidden group">
                           <iframe src="${item.iframeSrc}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="w-full h-full absolute inset-0"></iframe>
                        </div>
                        <div class="p-6 flex justify-between items-end">
                            <div>
                                <h3 class="font-serif text-2xl font-bold italic mb-1">${item.title}</h3>
                                <p class="text-xs text-gray-500 uppercase tracking-widest">${item.category}</p>
                            </div>
                            <div class="text-ochre">◎ Bilibili</div>
                        </div>
                    </div>
                </div>
            </article>
            <hr class="border-gray-200 mb-20 w-1/2 mx-auto">
        `;
    } else if (item.type === 'Tool') {
        // Need a design for Tool entry in Timeline. I'll make it smaller or distinct.
        timelineHtml += `
            <!-- Entry: Tool -->
             <article class="relative mb-20 md:grid md:grid-cols-12 gap-8 items-center blur-load group scroll-mt-24">
                <div class="hidden lg:block absolute left-8 top-0 -translate-x-[calc(50%+1px)] bg-paper py-1 text-xs font-bold text-ochre border border-gray-300 z-10 w-fit px-2">
                    ${item.dateDisplay}
                </div>
                <div class="col-span-12 max-w-3xl mx-auto w-full">
                    <a href="${item.link}" class="block bg-white border border-gray-200 p-8 hover:border-ochre transition-all hover:shadow-lg group-hover:-translate-y-1">
                        <div class="flex items-start gap-6">
                            <div class="text-4xl text-ochre">${item.icon}</div>
                            <div>
                                <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">New Tool Released</div>
                                <h3 class="font-serif text-2xl font-bold text-ink mb-2 group-hover:text-ochre transition-colors">${item.title}</h3>
                                <p class="text-gray-600 italic font-serif">${item.desc}</p>
                            </div>
                        </div>
                    </a>
                </div>
            </article>
            <hr class="border-gray-200 mb-20 w-1/2 mx-auto">
        `;
    }
});

// 4. Inject
let indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');
const startMarker = '<!-- TIMELINE_START -->';
const endMarker = '<!-- TIMELINE_END -->';

const startIndex = indexHtml.indexOf(startMarker);
const endIndex = indexHtml.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newHtml = indexHtml.substring(0, startIndex + startMarker.length) +
        '\n' + timelineHtml + '\n' +
        indexHtml.substring(endIndex);
    fs.writeFileSync(INDEX_PATH, newHtml, 'utf8');
    console.log('Homepage updated successfully!');
} else {
    console.error('Markers not found in index.html');
}
