import os
import re

TOOLS_DIR = r"d:\YRJ\Blog\Tools"
FILES_TO_UPDATE = [
    "AddHandleToHDA.html",
    "BatchCreateObjectMerge.html",
    "NodeInputCount.html",
    "QuickAddParameter.html",
    "SplitGeometryByGroup.html",
    "SwitchToOutputGroup.html"
]

# The JS Script containing Copy + Folding logic
# Note: Using template string literals in JS (backticks), so we need to be careful with Python strings.
COPY_SCRIPT = """
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const codeBlocks = document.querySelectorAll('pre');

        // Highlight.js Init
        document.querySelectorAll('pre code').forEach((block) => {
            if (!block.className.includes('language-')) {
                block.classList.add('language-python');
            }
            hljs.highlightElement(block);
        });
        
        codeBlocks.forEach(pre => {
            // 1. Setup Wrapper
            // Create container for relative positioning
            const wrapper = document.createElement('div');
            wrapper.className = 'relative group mb-6'; 
            // Insert wrapper before pre and move pre inside
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            
            // 2. Copy Button Setup
            const copyBtn = document.createElement('button');
            copyBtn.className = 'absolute top-2 right-2 p-2 bg-paper/10 hover:bg-ochre text-ochre hover:text-white rounded transition-colors opacity-0 group-hover:opacity-100 border border-ochre/20 z-20';
            copyBtn.title = 'Copy Code';
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
            
            copyBtn.addEventListener('click', async () => {
                const code = pre.querySelector('code')?.innerText || pre.innerText;
                try {
                    await navigator.clipboard.writeText(code);
                    const originalHTML = copyBtn.innerHTML;
                    copyBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d4a3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `;
                    setTimeout(() => {
                        copyBtn.innerHTML = originalHTML;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy!', err);
                }
            });
            wrapper.appendChild(copyBtn);

            // 3. Folding Logic
            // We use a small timeout to ensure layout is calculated, though DOMContentLoaded is usually enough.
            setTimeout(() => {
                const MAX_HEIGHT = 400; // px
                if (pre.scrollHeight > MAX_HEIGHT) {
                    
                    // Apply initial collapsed state
                    pre.style.maxHeight = MAX_HEIGHT + 'px';
                    pre.style.overflow = 'hidden';
                    pre.style.transition = 'max-height 0.4s ease-out';
                    
                    // Gradient Overlay
                    const overlay = document.createElement('div');
                    overlay.className = 'absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#282c34] to-transparent pointer-events-none transition-opacity duration-300 z-10 rounded-b-md';
                    wrapper.appendChild(overlay);

                    // Toggle Button Container
                    const btnContainer = document.createElement('div');
                    btnContainer.className = 'absolute bottom-4 left-1/2 -translate-x-1/2 z-20';
                    
                    const toggleBtn = document.createElement('button');
                    toggleBtn.className = 'bg-ochre text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg hover:bg-white hover:text-forest transition-colors flex items-center gap-1 border border-ochre';
                    toggleBtn.innerHTML = '<span>Show More</span><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>';
                    
                    btnContainer.appendChild(toggleBtn);
                    wrapper.appendChild(btnContainer);

                    let isExpanded = false;
                    toggleBtn.addEventListener('click', () => {
                        isExpanded = !isExpanded;
                        if (isExpanded) {
                            pre.style.maxHeight = pre.scrollHeight + 'px'; // Animate to full height
                            overlay.classList.add('opacity-0');
                            toggleBtn.innerHTML = '<span>Show Less</span><svg class="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>';
                        } else {
                            pre.style.maxHeight = MAX_HEIGHT + 'px';
                            overlay.classList.remove('opacity-0');
                            toggleBtn.innerHTML = '<span>Show More</span><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>';
                            // Optional: Scroll back up slightly if the user is way down
                            wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    });
                }
            }, 0);
        });
    });
</script>
"""

# The HTML Template (Top part)
TEMPLATE_TOP = """<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>__TITLE__ - TechArt Chronicle</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet">
    
    <!-- Highlight.js -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js"></script>

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        paper: '#F5F5F7',
                        ink: '#1a1a1a',
                        forest: '#2d4a3e',
                        ochre: '#8a6240',
                    },
                    fontFamily: {
                        serif: ['Playfair Display', 'serif'],
                        body: ['Noto Serif SC', 'serif'],
                    },
                    typography: (theme) => ({
                        DEFAULT: {
                            css: {
                                color: theme('colors.ink'),
                                '--tw-prose-headings': theme('colors.ink'),
                                fontFamily: theme('fontFamily.body'),
                                h1: { fontFamily: theme('fontFamily.serif') },
                                strong: { color: theme('colors.ochre') },
                                pre: {
                                    backgroundColor: '#282c34',
                                    color: '#abb2bf',
                                    borderRadius: '0.375rem',
                                    marginTop: '0 !important',
                                    marginBottom: '0 !important',
                                },
                            },
                        },
                    }),
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #F5F5F7;
            color: #1a1a1a;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E");
        }

        .sidebar-sticky {
            position: sticky;
            top: 2rem;
        }
    </style>
</head>

<body class="antialiased min-h-screen font-body">

    <!-- Header -->
    <header class="py-12 md:py-16 text-center border-b border-gray-300 relative bg-paper z-10">
        <div class="container mx-auto px-6">
            <a href="../../index.html" class="inline-block">
                <div class="text-xs font-bold tracking-[0.3em] uppercase text-ochre mb-2 font-serif">TechArt Chronicle
                </div>
                <h1 class="font-serif text-3xl md:text-5xl font-bold tracking-tight text-ink">Library</h1>
            </a>
        </div>
    </header>

    <div class="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">

            <!-- SIDEBAR -->
            <aside class="hidden lg:block lg:col-span-3 relative">
                <div class="sidebar-sticky space-y-12">
                    <!-- Navigation -->
                    <nav class="space-y-4">
                        <a href="../../index.html" class="block text-ink hover:text-ochre transition-colors group">
                            <span class="text-xs font-bold text-gray-400 mr-2 group-hover:text-ochre">←</span> Back to
                            Home
                        </a>
                        <div class="h-px bg-gray-300 my-4"></div>
                        <h4 class="font-serif text-lg pb-2 mb-2 italic text-gray-400">Sections</h4>
                        <a href="../Articles/index.html"
                            class="block text-ink hover:text-ochre transition-colors">Articles</a>
                        <a href="../Videos/index.html"
                            class="block text-ink hover:text-ochre transition-colors">Videos</a>
                        <a href="index.html" class="block text-ochre font-bold transition-colors">Tools</a>
                    </nav>
                </div>
            </aside>

            <!-- MAIN CONTENT -->
            <main class="lg:col-span-8 lg:col-start-5 relative">
                <article class="prose prose-lg prose-slate max-w-none mb-12">
                    <span class="text-ochre font-bold text-xs tracking-wider uppercase mb-2 block">Houdini / Tool</span>
"""

# The HTML Template (Bottom part)
TEMPLATE_BOTTOM = """
                </article>

                <div
                    class="mt-20 border-t border-gray-300 pt-8 flex justify-between items-center text-sm font-serif italic text-gray-500">
                    <a href="index.html" class="text-ochre hover:underline">← Back to Tools</a>
                    <a href="#" class="text-ochre hover:underline">Back to Top ↑</a>
                </div>
            </main>
        </div>
    </div>

    <footer class="bg-ink text-paper py-12 mt-20 border-t-8 border-forest">
        <div class="container mx-auto px-6 text-center">
            <div class="font-serif italic text-2xl mb-4 opacity-90">TechArt Chronicle.</div>
            <div class="text-xs text-gray-600 font-serif italic">
                &copy; 2025 Designed with Digital & Organic.
            </div>
        </div>
    </footer>
    
    __SCRIPT__
</body>

</html>
"""

def extract_content(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract Title (simplistic regex)
    title_match = re.search(r'<h1>(.*?)</h1>', content, re.DOTALL)
    title = title_match.group(1).strip() if title_match else "Untitled Tool"
    
    if '<h1>' in content:
        parts = content.split('</h1>', 1)
        header_part = parts[0] # contains <h1>Title
        body_part = parts[1] # contains contents... </div> </body>
        
        # reconstruct H1
        extracted_html = f"<h1>{title}</h1>\n"
        
        # clean body_part
        # remove closing </body> and </html>
        body_part = body_part.replace('</body>', '').replace('</html>', '')
        
        # remove the last </div> which closes .container
        # finding the last occurrence of </div>
        last_div_index = body_part.rfind('</div>')
        if last_div_index != -1:
            body_part = body_part[:last_div_index]
            
        extracted_html += body_part.strip()
    else:
        # Fallback
        extracted_html = f"<h1>{title}</h1><p>Content parsing failed.</p>"

    return title, extracted_html

def main():
    for file_name in FILES_TO_UPDATE:
        path = os.path.join(TOOLS_DIR, file_name)
        if not os.path.exists(path):
            print(f"Skipping {file_name}, not found.")
            continue
            
        print(f"Processing {file_name}...")
        try:
            title, content_html = extract_content(path)
            
            # Construct new HTML using replace
            new_html = TEMPLATE_TOP.replace('__TITLE__', title) + content_html + TEMPLATE_BOTTOM.replace('__SCRIPT__', COPY_SCRIPT)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_html)
                
            print(f"Updated {file_name}")
        except Exception as e:
            print(f"Error processing {file_name}: {e}")

if __name__ == "__main__":
    main()
