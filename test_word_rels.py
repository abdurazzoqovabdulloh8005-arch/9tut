import zipfile
import xml.etree.ElementTree as ET

docx_path = r'C:\Users\user\Desktop\quiz\ccna_source\1 lab.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    rels_xml = z.read('word/_rels/document.xml.rels')
    doc_xml = z.read('word/document.xml')

# Parse relationships
rels_root = ET.fromstring(rels_xml)
rel_map = {}
for rel in rels_root:
    rid = rel.attrib.get('Id')
    target = rel.attrib.get('Target')
    rel_map[rid] = target

print("Relationships:")
for k, v in rel_map.items():
    if 'media' in v:
        print(f"  {k} -> {v}")

# Parse document paragraphs
doc_root = ET.fromstring(doc_xml)
namespaces = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
}

for i, p in enumerate(doc_root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p')):
    text = "".join(p.itertext()).strip()
    blips = p.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
    if blips:
        for b in blips:
            embed_id = b.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
            target = rel_map.get(embed_id, '')
            print(f"P#{i} with text '{text[:40]}' HAS IMAGE: embed={embed_id} target={target}")
