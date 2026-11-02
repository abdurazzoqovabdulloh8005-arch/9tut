import json

with open('questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

with open('labs.json', 'r', encoding='utf-8') as f:
    labs = json.load(f)

cleaned_questions = []
fixed_e_count = 0

for i, q in enumerate(questions):
    # Take original text directly without ANY string replacement!
    q_text = str(q['question']).strip()
    opts = {k: str(v).strip() for k, v in q['options'].items()}
    exp = str(q.get('explanation', '')).strip()
    ans = [str(a).strip() for a in q['answer'] if str(a).strip()]
    
    # Fix false trailing 'E' coming from "Explanation"
    if exp and len(ans) > 1 and ans[-1] == 'E':
        ans = ans[:-1]
        fixed_e_count += 1
    elif exp and ans == ['E', 'E']:
        ans = ['E']
        fixed_e_count += 1
    
    cleaned_questions.append({
        'id': i + 1,
        'question': q_text,
        'options': opts,
        'answer': ans,
        'explanation': exp,
        'source': q.get('source', '')
    })

cleaned_labs = []
for lab in labs:
    cleaned_labs.append({
        'id': lab['id'],
        'name': lab['name'],
        'filename': lab['filename'],
        'tasks': [str(t).strip() for t in lab.get('tasks', [])],
        'tasks_text': str(lab.get('tasks_text', '')).strip(),
        'solution_text': str(lab.get('solution_text', '')).strip()
    })

# Export to data.js cleanly
with open('data.js', 'w', encoding='utf-8') as f:
    f.write('// CCNA Offline Quiz & Practical Labs Data\n')
    f.write('const CCNA_QUESTIONS = ')
    json.dump(cleaned_questions, f, ensure_ascii=False)
    f.write(';\n\n')
    f.write('const CCNA_LABS = ')
    json.dump(cleaned_labs, f, ensure_ascii=False)
    f.write(';\n')

print(f"data.js regenerated cleanly! Questions: {len(cleaned_questions)}, Fixed E: {fixed_e_count}")
