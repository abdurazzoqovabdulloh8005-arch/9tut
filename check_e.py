import json

with open('questions.json', encoding='utf-8') as f:
    qs = json.load(f)

count = 0
for q in qs:
    ans = q['answer']
    if len(ans) > 1 and ans[-1] == 'E':
        has_exp = bool(q.get('explanation'))
        print(f"Ans: {ans} | HasExp: {has_exp} | Q: {q['question'][:55]}")
        count += 1
        if count >= 20:
            break
