import os

ARTICLES_DIR = r"d:\YRJ\Blog\Articles"

def fix_links():
    # We walk through the Articles directory
    for root, dirs, files in os.walk(ARTICLES_DIR):
        for file in files:
            if file == "index.html":
                file_path = os.path.join(root, file)
                
                # Check depth to determine correct relative path
                # Articles/index.html -> depth 0 relative to Articles dir
                # Articles/SubDir/index.html -> depth 1 relative to Articles dir
                
                rel_path = os.path.relpath(root, ARTICLES_DIR)
                
                if rel_path == ".":
                    # This is Articles/index.html
                    # existing: ../Tools/index.html (Correct)
                    # We can enforce it anyway
                    target_link = "../Tools/index.html"
                else:
                    # This is Articles/SubDir/index.html
                    # We need ../../Tools/index.html
                    target_link = "../../Tools/index.html"

                # Read content
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                # Fix specific known bad links
                # The bad link observed was "../Houdini/Tools/index.html" or similar variations
                # We want to replace ANY link that looks like it's pointing to Tools with the correct relative path
                # But we should be careful not to break other links.
                
                # Strategy: Search for the Sidebar Tools link specifically.
                # It usually looks like: <a href="..." class="block text-ink hover:text-ochre transition-colors">Tools</a>
                
                # Let's try to find the line with ">Tools</a>" and fix the href in that line?
                # Or just replace the specific bad string we identified: "../Houdini/Tools/index.html"
                
                # In GroomParameters/index.html it was: href="../Houdini/Tools/index.html"
                # Let's replace that specific bad one first.
                
                new_content = content.replace('href="../Houdini/Tools/index.html"', f'href="{target_link}"')
                
                # Also, maybe there are other bad patterns? The user said "sidebar Tool buttons are 404".
                # If the user copied the sidebar from somewhere else, it might have other wrong links.
                
                # Let's also enforce the standard one if it was just copied from Articles/index.html
                # In Articles/index.html it is "../Tools/index.html"
                # If we copied that to Depth-2, it would be wrong (it would stay ../Tools/index.html which is only Depth-1 up)
                # So for Depth-2 files, if we see "../Tools/index.html", we should change it to "../../Tools/index.html"
                
                if rel_path != ".":
                     new_content = new_content.replace('href="../Tools/index.html"', f'href="{target_link}"')

                if new_content != content:
                    print(f"Fixing {file_path}...")
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

if __name__ == "__main__":
    fix_links()
