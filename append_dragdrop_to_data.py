import json

with open('data.js', 'r', encoding='utf-8') as f:
    content = f.read()

with open('dragdrop.json', 'r', encoding='utf-8') as f:
    dragdrop = json.load(f)

# Append CCNA_DRAGDROP to data.js
if 'const CCNA_DRAGDROP =' not in content:
    with open('data.js', 'a', encoding='utf-8') as f:
        f.write('\nconst CCNA_DRAGDROP = ')
        json.dump(dragdrop, f, ensure_ascii=False)
        f.write(';\n')
    print(f"Appended {len(dragdrop)} Drag & Drop exercises to data.js!")
else:
    print("CCNA_DRAGDROP already exists in data.js")
