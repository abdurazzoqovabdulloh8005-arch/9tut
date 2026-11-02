import json

with open('labs.json', encoding='utf-8') as f:
    labs = json.load(f)

for l in labs:
    t = l['tasks'][0] if l['tasks'] else l['tasks_text'][:60].replace('\n', ' ')
    print(f"Lab {l['id']}: {t[:80]}")
