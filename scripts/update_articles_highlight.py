import os

ARTICLES_DIR = r"d:\YRJ\Blog\Articles"

HIGHLIGHT_CSS = """    <!-- Highlight.js -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/glsl.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/cpp.min.js"></script>"""

HIGHLIGHT_INIT = """<script>
    document.addEventListener('DOMContentLoaded', () => {
        const codeBlocks = document.querySelectorAll('pre');

        // Highlight.js Init
        document.querySelectorAll('pre code').forEach((block) => {
            if (!block.className.includes('language-')) {
                block.classList.add('language-python');
            }
            hljs.highlightElement(block);
        });
    });
</script>"""

def update_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "highlight.js" in content:
        print(f"Skipping {file_path}, already has highlight.js")
        return

    # Inject CSS/JS into head
    if "</head>" in content:
        content = content.replace("</head>", f"{HIGHLIGHT_CSS}\n</head>")
    
    # Inject INT into body (before closing body)
    if "</body>" in content:
        content = content.replace("</body>", f"{HIGHLIGHT_INIT}\n</body>")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {file_path}")

def main():
    for root, dirs, files in os.walk(ARTICLES_DIR):
        for file in files:
            if file == "index.html":
                update_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
