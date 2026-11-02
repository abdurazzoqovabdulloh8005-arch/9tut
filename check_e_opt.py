import json
import re

with open('questions.json', encoding='utf-8') as f:
    qs = json.load(f)

# Let's check how many questions have 'E' as answer where E is actually an option
count_e_opt = 0
for q in qs:
    ans = q['answer']
    if len(ans) > 1 and ans[-1] == 'E':
        # check if E exists in options
        has_e_opt = 'E' in q['options']
        # check if question specifies count
        q_lower = q['question'].lower()
        m_two = 'two' in q_lower or 'choose 2' in q_lower
        m_three = 'three' in q_lower or 'choose 3' in q_lower
        
        # If question says choose two, and we have 3 answers ending in E
        # That means E was definitely from Explanation!
        if m_two and len(ans) == 3:
            count_e_opt += 1

print(f"Questions with 'choose two' and 3 answers ending in E: {count_e_opt}")
