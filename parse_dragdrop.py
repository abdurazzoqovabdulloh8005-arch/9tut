import docx
import os
import re
import json

docx_path = r'C:\Users\user\Desktop\quiz\ccna_source\Drag drop.docx'
doc = docx.Document(docx_path)

exercises = []
current_ex = None

paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
full_text = "\n".join(paragraphs)

# Split by "Drag and drop"
parts = re.split(r'(?=Drag and drop)', full_text, flags=re.IGNORECASE)

for p in parts:
    p = p.strip()
    if not p.lower().startswith('drag and drop'):
        continue
    
    # Title / Question
    lines = p.split('\n')
    title = lines[0]
    
    # Extract pairs from Answer section
    ans_idx = p.find('Answer:')
    if ans_idx == -1:
        continue
    
    ans_part = p[ans_idx + len('Answer:'):].strip()
    
    # Look for patterns like "+ key: value" or "key - value" or "1 - value"
    pairs = []
    # Pattern: "+ Term: Description"
    for line in ans_part.split('\n'):
        line = line.strip()
        if not line:
            continue
        line = re.sub(r'^[+\-*•\d\.\)]\s*', '', line).strip()
        
        if ':' in line:
            k, v = line.split(':', 1)
            if k.strip() and v.strip() and len(k.strip()) < 80:
                pairs.append({'term': k.strip(), 'def': v.strip()})
        elif ' - ' in line:
            k, v = line.split(' - ', 1)
            if k.strip() and v.strip() and len(k.strip()) < 80:
                pairs.append({'term': k.strip(), 'def': v.strip()})

    if len(pairs) >= 2:
        exercises.append({
            'id': len(exercises) + 1,
            'title': title[:120],
            'pairs': pairs[:6] # up to 6 pairs per exercise
        })

print(f"Extracted {len(exercises)} Drag & Drop exercises from Drag drop.docx!")
for ex in exercises[:3]:
    print(f"Ex {ex['id']}: {ex['title']}")
    for pr in ex['pairs'][:2]:
        print(f"   [{pr['term']}] -> [{pr['def'][:40]}...]")

with open(r'C:\Users\user\Desktop\quiz\dragdrop.json', 'w', encoding='utf-8') as f:
    json.dump(exercises, f, ensure_ascii=False, indent=2)
