import os
import re
import json
import zipfile
import xml.etree.ElementTree as ET

source_dir = r'C:\Users\user\Desktop\quiz\ccna_source'
output_images_dir = r'C:\Users\user\Desktop\quiz\images'
os.makedirs(output_images_dir, exist_ok=True)

all_part_files = [
    'Part 5.docx', 'Part 6.docx', 'Part 7.docx', 'Part 8.docx', 'Part 9.docx',
    'Part 10.docx', 'Part 11.docx', 'Part 12.docx', 'Part 13.docx', 'Part 14.docx',
    'Part 15.docx', 'Part 16.docx', 'new questions.docx'
]

def parse_docx_with_images(filename):
    filepath = os.path.join(source_dir, filename)
    if not os.path.exists(filepath):
        return []

    prefix = filename.replace(' ', '_').replace('.docx', '').lower()

    rel_map = {}
    with zipfile.ZipFile(filepath, 'r') as z:
        for zinfo in z.infolist():
            if zinfo.filename.startswith('word/media/'):
                bname = os.path.basename(zinfo.filename)
                out_name = f"{prefix}_{bname}"
                out_path = os.path.join(output_images_dir, out_name)
                with open(out_path, 'wb') as f:
                    f.write(z.read(zinfo.filename))
        
        try:
            rels_xml = z.read('word/_rels/document.xml.rels')
            rels_root = ET.fromstring(rels_xml)
            for rel in rels_root:
                rid = rel.attrib.get('Id')
                target = rel.attrib.get('Target')
                if target and 'media' in target:
                    bname = os.path.basename(target)
                    rel_map[rid] = f"images/{prefix}_{bname}"
        except Exception:
            pass

        doc_xml = z.read('word/document.xml')

    doc_root = ET.fromstring(doc_xml)

    items = []
    for p in doc_root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        text = "".join(p.itertext()).strip()
        blips = p.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
        imgs = []
        for b in blips:
            eid = b.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
            if eid in rel_map:
                imgs.append(rel_map[eid])
        items.append({'text': text, 'images': imgs})

    questions = []
    current_q = None

    for item in items:
        t = item['text']
        imgs = item['images']

        q_match = re.match(r'^Question\s+(\d+)', t, re.IGNORECASE)
        if q_match:
            if current_q:
                questions.append(current_q)
            current_q = {
                'q_num': int(q_match.group(1)),
                'raw_lines': [t],
                'images': list(imgs),
                'source': filename
            }
        else:
            if current_q:
                if t:
                    current_q['raw_lines'].append(t)
                if imgs:
                    current_q['images'].extend(imgs)

    if current_q:
        questions.append(current_q)

    parsed = []
    for q in questions:
        raw_text = "\n".join(q['raw_lines'])
        
        opts_start_match = re.search(r'\n([A-F][\.\)])\s+', raw_text)
        if not opts_start_match:
            continue

        start_pos = opts_start_match.start()
        q_part = raw_text[:start_pos].strip()
        q_part = re.sub(r'^Question\s+\d+\s*\n?', '', q_part, flags=re.IGNORECASE).strip()

        rest_part = raw_text[start_pos:]

        opts = {}
        for letter in ['A', 'B', 'C', 'D', 'E', 'F']:
            opt_m = re.search(rf'\n{letter}[\.\)]\s*(.+?)(?=\n[A-F][\.\)]|\nAnswer|\nExplanation|$)', rest_part, re.DOTALL)
            if opt_m:
                opts[letter] = opt_m.group(1).strip().replace('\n', ' ')

        # If options not found by newline, try inline
        if len(opts) < 2:
            parts = re.split(r'\n?([A-F][\.\)])\s+', rest_part.split('Answer:')[0])
            i = 1
            while i < len(parts) - 1:
                l = parts[i][0]
                opts[l] = parts[i+1].strip().replace('\n', ' ')
                i += 2

        if len(opts) < 2:
            continue

        ans_m = re.search(r'Answer[:\s\u00a0]+([A-F](?:[ \t,]+[A-F])*)', rest_part)
        if not ans_m:
            ans_m = re.search(r'Answer[:\s\u00a0]+([^\n\r]+)', rest_part)
            if ans_m:
                letters = re.findall(r'[A-F]', ans_m.group(1).split('Explanation')[0])
            else:
                letters = []
        else:
            letters = re.findall(r'[A-F]', ans_m.group(1))

        if not letters:
            continue

        exp_m = re.search(r'Explanation\s*\n?(.*?)$', rest_part, re.DOTALL)
        exp_text = exp_m.group(1).strip() if exp_m else ""
        exp_text = re.split(r'Question\s+\d+', exp_text)[0].strip()

        if exp_text and len(letters) > 1 and letters[-1] == 'E':
            letters = letters[:-1]
        elif exp_text and letters == ['E', 'E']:
            letters = ['E']

        q_images = list(dict.fromkeys(q['images']))

        parsed.append({
            'question': q_part,
            'options': opts,
            'answer': letters,
            'explanation': exp_text[:3000],
            'source': filename,
            'images': q_images,
            'image': q_images[0] if q_images else None
        })

    return parsed

all_extracted_questions = []
for fname in all_part_files:
    qs = parse_docx_with_images(fname)
    img_count = sum(1 for q in qs if q.get('image'))
    print(f"  {fname}: {len(qs)} questions, {img_count} with diagrams.")
    all_extracted_questions.extend(qs)

print(f"\nTOTAL EXTRACTED: {len(all_extracted_questions)} questions.")
total_with_images = sum(1 for q in all_extracted_questions if q.get('image'))
print(f"TOTAL WITH TOPOLOGIES/DIAGRAMS: {total_with_images} questions!")

for i, q in enumerate(all_extracted_questions):
    q['id'] = i + 1

with open(r'C:\Users\user\Desktop\quiz\questions.json', 'w', encoding='utf-8') as f:
    json.dump(all_extracted_questions, f, ensure_ascii=False, indent=2)

with open(r'C:\Users\user\Desktop\quiz\labs.json', 'r', encoding='utf-8') as f:
    labs = json.load(f)

with open(r'C:\Users\user\Desktop\quiz\data.js', 'w', encoding='utf-8') as f:
    f.write('// CCNA Offline Quiz, Topologies & Practical Labs Data\n')
    f.write('const CCNA_QUESTIONS = ')
    json.dump(all_extracted_questions, f, ensure_ascii=False)
    f.write(';\n\n')
    f.write('const CCNA_LABS = ')
    json.dump(labs, f, ensure_ascii=False)
    f.write(';\n')

print("Successfully regenerated data.js with clean options and embedded topologies!")
