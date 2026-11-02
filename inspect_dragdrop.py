import docx
import os

docx_path = r'C:\Users\user\Desktop\quiz\ccna_source\Drag drop.docx'

if os.path.exists(docx_path):
    doc = docx.Document(docx_path)
    print("Drag drop.docx paragraphs:", len(doc.paragraphs))
    for p in doc.paragraphs[:25]:
        if p.text.strip():
            print("  ", p.text.strip()[:80])
else:
    print("Drag drop.docx not found")
