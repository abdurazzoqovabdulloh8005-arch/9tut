import json

with open('data.js', encoding='utf-8') as f:
    text = f.read()

json_str = text[text.find('['):text.find(';\n\nconst CCNA_LABS')]
qs = json.loads(json_str)

for idx in [5, 25, 75, 150, 300, 600]:
    q = qs[idx]
    print(f"ID {q['id']}: {q['question'][:60]} | Ans: {q['answer']}")
    print("Options:", q['options'])
    print("-" * 50)
