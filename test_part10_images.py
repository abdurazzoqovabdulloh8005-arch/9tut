import zipfile
import xml.etree.ElementTree as ET

docx_path = r'C:\Users\user\Desktop\quiz\ccna_source\Part 10.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    rels_xml = z.read('word/_rels/document.xml.rels')
    doc_xml = z.read('word/document.xml')

rels_root = ET.fromstring(rels_xml)
rel_map = {}
for rel in rels_root:
    rid = rel.attrib.get('Id')
    target = rel.attrib.get('Target')
    rel_map[rid] = target

doc_root = ET.fromstring(doc_xml)

current_question = ""
q_count = 0
found_images = 0

for p in doc_root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
    text = "".join(p.itertext()).strip()
    if text.startswith('Question'):
        current_question = text
        q_count += 1
    
    blips = p.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
    if blips:
        for b in blips:
            embed_id = b.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
            target = rel_map.get(embed_id, '')
            found_images += 1
            if found_images <= 10:
                print(f"[{current_question[:25]}] -> Image: {target}")

print(f"Total questions: {q_count}, Total images linked to questions: {found_images}")
