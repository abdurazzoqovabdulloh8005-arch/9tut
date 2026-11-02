import re

sample = "A. access-list 101 permit tcp 10.1.1.0 0.0.0.255 172.16.1.0 0.0.0.255 eq ssh B. access-list 101 permit tcp 10.1.1.0 0.0.0.255 172.16.1.0 0.0.0.255 eq scp C. access-list 101 permit tcp 10.1.1.0 0.0.0.255 172.16.1.0 0.0.0.255 eq telnet D. access-list 101 permit tcp 10.1.1.0 0.0.0.255 172.16.1.0 0.0.0.255 eq https Answer: A"

def parse_options_smart(text):
    # Cut at Answer
    ans_idx = text.find('Answer:')
    if ans_idx != -1:
        text = text[:ans_idx]
    
    # Match letters
    parts = re.split(r'(?:^|\s+)([A-F][\.\)])\s+', text.strip())
    # parts: [before, 'A.', textA, 'B.', textB, ...]
    opts = {}
    i = 1
    while i < len(parts) - 1:
        letter = parts[i][0]
        val = parts[i+1].strip()
        opts[letter] = val
        i += 2
    return opts

print(parse_options_smart(sample))
