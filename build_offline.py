import re

with open(r'c:\Users\user\Desktop\quiz\index.html', 'r', encoding='utf-8') as f:
    html = f.read()
with open(r'c:\Users\user\Desktop\quiz\style.css', 'r', encoding='utf-8') as f:
    css = f.read()
with open(r'c:\Users\user\Desktop\quiz\data.js', 'r', encoding='utf-8') as f:
    data = f.read()
with open(r'c:\Users\user\Desktop\quiz\app.js', 'r', encoding='utf-8') as f:
    app = f.read()

# Replace css link
html = re.sub(r'<link rel="stylesheet" href="style\.css[^"]*">', lambda m: f'<style>\n{css}\n</style>', html)

# Replace script links
html = re.sub(r'<script src="data\.js[^"]*"></script>', lambda m: f'<script>\n{data}\n</script>', html)
html = re.sub(r'<script src="app\.js[^"]*"></script>', lambda m: f'<script>\n{app}\n</script>', html)

with open(r'c:\Users\user\Desktop\quiz\CCNA_Offline_Pro.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('CCNA_Offline_Pro.html built successfully, size:', len(html))
