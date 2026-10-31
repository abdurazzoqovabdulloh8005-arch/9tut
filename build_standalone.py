import os
import base64
import mimetypes
import json
import re
import zipfile
import shutil

QUIZ_DIR = r'c:\Users\user\Desktop\quiz'
DESKTOP_DIR = r'c:\Users\user\Desktop'
IMG_DIR = os.path.join(QUIZ_DIR, 'images')

print("=== CCNA STANDALONE APP COMPILER ===")

# 1. Read source files
print("[1/5] Reading source files...")
with open(os.path.join(QUIZ_DIR, 'index.html'), 'r', encoding='utf-8') as f:
    html = f.read()

with open(os.path.join(QUIZ_DIR, 'style.css'), 'r', encoding='utf-8') as f:
    css = f.read()

with open(os.path.join(QUIZ_DIR, 'data.js'), 'r', encoding='utf-8') as f:
    data_js = f.read()

with open(os.path.join(QUIZ_DIR, 'app.js'), 'r', encoding='utf-8') as f:
    app_js = f.read()

# 2. Extract and encode all referenced images
print("[2/5] Scanning and base64-encoding all topology diagrams & lab images...")
referenced_images = set(re.findall(r'images/[a-zA-Z0-9_\-\.]+', data_js))
print(f"Found {len(referenced_images)} unique images referenced in CCNA data.")

assets = {}
encoded_count = 0
for rel_path in sorted(referenced_images):
    filename = os.path.basename(rel_path)
    full_path = os.path.join(IMG_DIR, filename)
    if os.path.isfile(full_path):
        mime, _ = mimetypes.guess_type(filename)
        if not mime:
            if filename.lower().endswith('.png'): mime = 'image/png'
            elif filename.lower().endswith(('.jpg', '.jpeg')): mime = 'image/jpeg'
            elif filename.lower().endswith('.gif'): mime = 'image/gif'
            else: mime = 'application/octet-stream'
        with open(full_path, 'rb') as f:
            b64 = base64.b64encode(f.read()).decode('ascii')
        assets[rel_path] = f"data:{mime};base64,{b64}"
        encoded_count += 1

print(f"Successfully encoded {encoded_count} images into memory.")

# 3. Create SVG App Icon
app_icon_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0076ce"/>
      <stop offset="100%" stop-color="#0a2540"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bg)"/>
  <circle cx="256" cy="180" r="48" fill="none" stroke="#00d4ff" stroke-width="24"/>
  <circle cx="140" cy="340" r="38" fill="none" stroke="#00d4ff" stroke-width="20"/>
  <circle cx="372" cy="340" r="38" fill="none" stroke="#00d4ff" stroke-width="20"/>
  <line x1="218" y1="216" x2="170" y2="304" stroke="#ffffff" stroke-width="16" stroke-linecap="round"/>
  <line x1="294" y1="216" x2="342" y2="304" stroke="#ffffff" stroke-width="16" stroke-linecap="round"/>
  <line x1="178" y1="340" x2="334" y2="340" stroke="#00d4ff" stroke-width="16" stroke-linecap="round" stroke-dasharray="16 16"/>
  <text x="256" y="450" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">CCNA PRO</text>
</svg>"""
icon_b64 = base64.b64encode(app_icon_svg.encode('utf-8')).decode('ascii')
icon_data_uri = f"data:image/svg+xml;base64,{icon_b64}"

# 4. Construct standalone HTML
print("[3/5] Building monolithic single-file bundle...")

# Replace stylesheet link with inline CSS
css_inlined = '\n  <link rel="icon" type="image/svg+xml" href="' + icon_data_uri + '">\n'
css_inlined += '  <link rel="apple-touch-icon" href="' + icon_data_uri + '">\n'
css_inlined += '  <style>\n' + css + '\n  </style>\n'

standalone_html = html.replace('<link rel="stylesheet" href="style.css">', css_inlined)

# Asset injector & resolution script
assets_json_str = json.dumps(assets)
asset_resolver_js = """
<script>
// CCNA EMBEDDED TOPOLOGIES & DIAGRAMS (Base64 Asset Store)
window.EMBEDDED_ASSETS = """ + assets_json_str + """;

// Resolve question and lab images from embedded assets
(function() {
  var assets = window.EMBEDDED_ASSETS || {};
  if (typeof CCNA_QUESTIONS !== 'undefined') {
    for (var i = 0; i < CCNA_QUESTIONS.length; i++) {
      var q = CCNA_QUESTIONS[i];
      if (q && q.image && assets[q.image]) {
        q.image = assets[q.image];
      }
      if (q && q.options) {
        for (var k in q.options) {
          if (q.options[k] && assets[q.options[k]]) {
            q.options[k] = assets[q.options[k]];
          }
        }
      }
    }
  }
  if (typeof CCNA_LABS !== 'undefined') {
    for (var j = 0; j < CCNA_LABS.length; j++) {
      var lab = CCNA_LABS[j];
      if (lab && lab.topology_image && assets[lab.topology_image]) {
        lab.topology_image = assets[lab.topology_image];
      }
    }
  }
})();
</script>
"""

# Bundle scripts
scripts_bundle = "<script>\n" + data_js + "\n</script>\n" + asset_resolver_js + "\n<script>\n" + app_js + "\n</script>"

# Replace script tags in html
# Look for <script src="data.js"></script> and <script src="app.js"></script>
scripts_pattern = re.compile(r'<script\s+src="data\.js">\s*</script>\s*<script\s+src="app\.js">\s*</script>', re.I)
if scripts_pattern.search(standalone_html):
    standalone_html = scripts_pattern.sub(lambda m: scripts_bundle, standalone_html, count=1)
else:
    print("Warning: exact script tags not matched, replacing individually...")
    standalone_html = standalone_html.replace('<script src="data.js"></script>', "<script>\n" + data_js + "\n</script>\n" + asset_resolver_js)
    standalone_html = standalone_html.replace('<script src="app.js"></script>', "<script>\n" + app_js + "\n</script>")

# 5. Save the standalone file
print("[4/5] Writing standalone HTML file...")
out_quiz_file = os.path.join(QUIZ_DIR, 'CCNA_Offline_Pro.html')

with open(out_quiz_file, 'w', encoding='utf-8') as f:
    f.write(standalone_html)

size_mb = os.path.getsize(out_quiz_file) / (1024 * 1024)
print(f"Generated standalone file: {out_quiz_file} ({size_mb:.2f} MB)")

# 6. Create ZIP bundle for easy sharing via Telegram / WhatsApp / Email
print("[5/5] Creating shareable ZIP archive...")
zip_file = os.path.join(QUIZ_DIR, 'CCNA_Offline_Pro.zip')
with zipfile.ZipFile(zip_file, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
    zf.write(out_quiz_file, arcname='CCNA_Offline_Pro.html')

zip_size_mb = os.path.getsize(zip_file) / (1024 * 1024)
print(f"Generated ZIP package: {zip_file} ({zip_size_mb:.2f} MB)")

print("=== ALL DONE! CCNA STANDALONE APP READY! ===")
