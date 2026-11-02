import docx
import re
import json
import os

def read_docx_text(path):
    try:
        doc = docx.Document(path)
        text = []
        for para in doc.paragraphs:
            if para.text.strip():
                text.append(para.text.strip())
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    if cell.text.strip():
                        text.append(cell.text.strip())
        return '\n'.join(text)
    except Exception as e:
        return ''

ccna_dir = r'C:\Users\user\Desktop\CCNA'

labs = []
lab_files = sorted([f for f in os.listdir(ccna_dir) if re.match(r'\d+ lab\.docx', f)], 
                   key=lambda x: int(x.split()[0]))

for fname in lab_files:
    fpath = os.path.join(ccna_dir, fname)
    text = read_docx_text(fpath)
    
    tasks_match = re.search(r'Tasks?\s*\n(.*?)(?=Topology|Solution|Pin|$)', text, re.DOTALL)
    tasks_text = tasks_match.group(1).strip() if tasks_match else ''
    
    solution_match = re.search(r'Solution\s*\n(.*?)$', text, re.DOTALL)
    solution_text = solution_match.group(1).strip() if solution_match else ''
    
    lab_num = int(fname.split()[0])
    
    # Parse individual tasks
    task_list = re.findall(r'\d+\.\s+(.+?)(?=\d+\.|$)', tasks_text, re.DOTALL)
    task_list = [t.strip() for t in task_list if t.strip()]
    
    labs.append({
        'id': lab_num,
        'name': 'Lab ' + str(lab_num),
        'filename': fname,
        'tasks': task_list,
        'tasks_text': tasks_text[:2000],
        'solution_text': solution_text[:3000],
        'full_text': text[:5000]
    })

print('Found ' + str(len(labs)) + ' labs')

with open(r'C:\Users\user\Desktop\quiz\labs.json', 'w', encoding='utf-8') as f:
    json.dump(labs, f, ensure_ascii=False, indent=2)
print('Saved labs.json')
print(json.dumps(labs[0], indent=2, ensure_ascii=False)[:1000])
