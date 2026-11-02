import os
import re
import json
import zipfile
import xml.etree.ElementTree as ET

source_dir = r'C:\Users\user\Desktop\quiz\ccna_source'
output_images_dir = r'C:\Users\user\Desktop\quiz\images'
os.makedirs(output_images_dir, exist_ok=True)

# 1. PARSE LABS AND EXTRACT TOPOLOGY IMAGES
print("--- Extracting Labs & Topology Images ---")
labs = []
lab_files = sorted([f for f in os.listdir(source_dir) if re.match(r'\d+ lab\.docx', f)],
                   key=lambda x: int(x.split()[0]))

for fname in lab_files:
    fpath = os.path.join(source_dir, fname)
    lab_num = int(fname.split()[0])
    
    # Extract images from zip
    topology_img = None
    with zipfile.ZipFile(fpath, 'r') as z:
        media_files = [f for f in z.namelist() if f.startswith('word/media/')]
        for mf in media_files:
            bname = os.path.basename(mf)
            out_name = f"lab_{lab_num}_{bname}"
            out_path = os.path.join(output_images_dir, out_name)
            with open(out_path, 'wb') as out_f:
                out_f.write(z.read(mf))
            if not topology_img:
                topology_img = f"images/{out_name}"
    
    # Read text
    import docx
    doc = docx.Document(fpath)
    text_paras = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    full_text = "\n".join(text_paras)
    
    tasks_match = re.search(r'Tasks?\s*\n(.*?)(?=Topology|Solution|Pin|$)', full_text, re.DOTALL)
    tasks_text = tasks_match.group(1).strip() if tasks_match else full_text[:400]
    
    solution_match = re.search(r'Solution\s*\n(.*?)$', full_text, re.DOTALL)
    solution_text = solution_match.group(1).strip() if solution_match else ""
    
    task_list = re.findall(r'\d+\.\s+(.+?)(?=\d+\.|$)', tasks_text, re.DOTALL)
    task_list = [t.strip() for t in task_list if t.strip()]
    
    labs.append({
        'id': lab_num,
        'name': f"Lab {lab_num}",
        'filename': fname,
        'tasks': task_list,
        'tasks_text': tasks_text,
        'solution_text': solution_text,
        'topology_image': topology_img
    })
    print(f"Lab {lab_num}: Image={topology_img}, Tasks={len(task_list)}")

# Save updated labs.json
with open(r'C:\Users\user\Desktop\quiz\labs.json', 'w', encoding='utf-8') as f:
    json.dump(labs, f, ensure_ascii=False, indent=2)

print(f"\nSaved {len(labs)} labs with topology images.")
