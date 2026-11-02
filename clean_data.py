import json
import re

# Clean questions
with open('questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

def clean_text(t):
    if not t:
        return ""
    # Replace common broken encoding chars
    t = t.replace('', "'")
    t = t.replace('\u00a0', ' ')
    t = re.sub(r' +', ' ', t)
    return t.strip()

cleaned_questions = []
for i, q in enumerate(questions):
    q_text = clean_text(q['question'])
    opts = {k: clean_text(v) for k, v in q['options'].items()}
    exp = clean_text(q.get('explanation', ''))
    ans = [a.strip() for a in q['answer'] if a.strip()]
    
    cleaned_questions.append({
        'id': i + 1,
        'question': q_text,
        'options': opts,
        'answer': ans,
        'explanation': exp,
        'source': q.get('source', '')
    })

# Clean labs
with open('labs.json', 'r', encoding='utf-8') as f:
    labs = json.load(f)

cleaned_labs = []
for lab in labs:
    t_text = clean_text(lab.get('tasks_text', ''))
    s_text = clean_text(lab.get('solution_text', ''))
    tasks = [clean_text(t) for t in lab.get('tasks', [])]
    
    cleaned_labs.append({
        'id': lab['id'],
        'name': lab['name'],
        'filename': lab['filename'],
        'tasks': tasks,
        'tasks_text': t_text,
        'solution_text': s_text
    })

# Write to data.js
with open('data.js', 'w', encoding='utf-8') as f:
    f.write('// CCNA Offline Quiz & Practical Labs Data\n')
    f.write('const CCNA_QUESTIONS = ')
    json.dump(cleaned_questions, f, ensure_ascii=False)
    f.write(';\n\n')
    f.write('const CCNA_LABS = ')
    json.dump(cleaned_labs, f, ensure_ascii=False)
    f.write(';\n')

print(f"Data.js created! Cleaned {len(cleaned_questions)} questions and {len(cleaned_labs)} labs.")
