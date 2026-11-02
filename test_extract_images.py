import docx
import os
import zipfile
import xml.etree.ElementTree as ET

source_dir = r'C:\Users\user\Desktop\quiz\ccna_source'
images_dir = r'C:\Users\user\Desktop\quiz\images'
os.makedirs(images_dir, exist_ok=True)

# Let's inspect how images relate to paragraphs in 1 lab.docx
docx_path = os.path.join(source_dir, '1 lab.docx')
doc = docx.Document(docx_path)

# Extract media from zip
with zipfile.ZipFile(docx_path, 'r') as z:
    for filename in z.namelist():
        if filename.startswith('word/media/'):
            basename = os.path.basename(filename)
            target = os.path.join(images_dir, f"lab1_{basename}")
            with open(target, 'wb') as f:
                f.write(z.read(filename))
            print(f"Extracted {target}, size: {os.path.getsize(target)} bytes")

# Check which paragraphs have images
for i, p in enumerate(doc.paragraphs):
    xml = p._p.xml
    if 'drawing' in xml or 'pict' in xml:
        print(f"Paragraph {i} has image! Text: {p.text}")
