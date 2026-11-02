import docx
import zipfile
import os

source_dir = r'C:\Users\user\Desktop\quiz\ccna_source'

# Check 1 lab.docx
print("=== Checking 1 lab.docx ===")
doc = docx.Document(os.path.join(source_dir, '1 lab.docx'))
print("Paragraphs:", len(doc.paragraphs))
for p in doc.paragraphs[:15]:
    if p.text.strip():
        print("  P:", p.text.strip()[:60])

# Check images in 1 lab.docx
with zipfile.ZipFile(os.path.join(source_dir, '1 lab.docx'), 'r') as z:
    media = [f for f in z.namelist() if f.startswith('word/media/')]
    print("Media count in 1 lab.docx:", len(media))
    for m in media:
        print("  Image:", m)

# Check images in Part 10.docx
print("\n=== Checking Part 10.docx ===")
with zipfile.ZipFile(os.path.join(source_dir, 'Part 10.docx'), 'r') as z:
    media = [f for f in z.namelist() if f.startswith('word/media/')]
    print("Media count in Part 10.docx:", len(media))
    for m in media[:5]:
        print("  Image:", m)
