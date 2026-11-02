with open('index.html', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'studySection' in l or 'studyTabBook' in l:
        print(f"Line {i+1}: {l.strip()}")
