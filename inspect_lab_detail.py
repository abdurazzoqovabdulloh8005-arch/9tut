import json

with open('labs.json', encoding='utf-8') as f:
    labs = json.load(f)

for l in labs[:5]:
    print('='*50)
    print(f"LAB {l['id']}: {l['name']}")
    print("TASKS:")
    print(l['tasks_text'][:400])
    print("SOLUTION:")
    print(l['solution_text'][:500])
