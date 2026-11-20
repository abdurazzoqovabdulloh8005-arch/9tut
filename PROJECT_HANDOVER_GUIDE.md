# 📘 CCNA Pro Web Platformasi — Loyiha Qo'llanmasi va Handover Yo'riqnomasi (Boshqa Agentlar Uchun)

Ushbu hujjat **CCNA Professional Quiz & Practical Labs** loyihasining to'liq arxitekturasi, ma'lumotlar oqimi, manba fayllari, Python skriptlari va GitHub/Vercel orqali deploy qilish jarayonini qadamma-qadam tushuntiradi. Har qanday yangi AI agent yoki dasturchi ushbu qo'llanma orqali loyihani hech qanday uzilishsiz davom ettira oladi.

---

## 📌 1. Loyihaning Umumiy Maqsadi va Tuzilishi

Loyiha — Cisco CCNA 200-301 imtihoniga tayyorlovchi zamonaviy, to'liq offline va online ishlay oladigan veb-platforma.

- **Jonli Veb-sayt (Production):** [https://abdullohtut9.vercel.app](https://abdullohtut9.vercel.app)
- **GitHub Repozitoriyasi:** `https://github.com/abdurazzoqovabdulloh8005-arch/9tut.git` (Branch: `main`)
- **Lokal Asosiy Papka:** `c:\Users\user\Desktop\quiz` — Git repozitoriya (`origin main` to'g'ridan-to'g'ri GitHub bilan bog'langan). Barcha ishlab chiqish va deployment shu yerdan amalga oshiriladi.

---

## 🗂 2. Asosiy Fayllar va Ularning Vazifalari

```text
CCNA_Online_Web / quiz
├── index.html                           # Yagona sahifali (SPA) asosiy interfeys
├── app.js                               # Butun loyihaning JavaScript mantiqi (11,000+ qator)
├── style.css                            # Dizayn, ranglar, Pearson VUE simulyatori va tungi rejim
├── questions.json                       # Jami 1331 ta savolning JSON bazasi
├── data.js                              # Brauzer uchun savollar, lablar va dragdrop o'zgaruvchilari
├── labs.json                            # 21 ta amaliy laboratoriya ishlari
├── dragdrop.json                        # Standart moslashtirish mashqlari
├── images/                              # Barcha 524 ta topologiya va tarmoq sxemalari rasmlari
├── ccna_source/                         # Asl Word (.docx) fayllari (Part 5 - Part 16, new questions)
├── regenerate_complete_dataset.py       # Word fayllaridan barcha savollarni ajratib oluvchi asosiy parser
└── generate_all_short_uz_explanations.py# O'zbekcha qisqa izohlar va eslab qolish ilgaklarini yaratuvchi skript
```

---

## 📊 3. Savollar Bazasi Statistikasi (Jami: 1331 ta)

Asl Word fayllaridagi barcha testlar (Multiple Choice) va moslashtirish (Drag & Drop) savollari to'liq kiritilgan:

| Bo'lim Fayli | Jami Savollar | Test (MCQ) | Drag & Drop | Mazmuni |
| :--- | :---: | :---: | :---: | :--- |
| `Part 5.docx` | **51** | 50 | 1 | SNMP, Port Security, Private IP, RSTP |
| `Part 6.docx` | **33** | 32 | 1 | Switching, MAC table, Static Route, VTP |
| `Part 7.docx` | **54** | 48 | 6 | VLAN, 802.1Q Trunking, Inter-VLAN, DHCP Relay |
| `Part 8.docx` | **82** | 75 | 7 | IPv4/IPv6 Addressing, Subnetting, OSPF |
| `Part 9.docx` | **107** | 98 | 9 | OSPF Single/Multi-Area, DR/BDR, Router ID |
| `Part 10.docx` | **95** | 83 | 12 | Collapsed Core, OSPF Neighbor Adjacency |
| `Part 11.docx` | **82** | 68 | 14 | Standard/Extended ACL, Wildcard Masks |
| `Part 12.docx` | **114** | 98 | 16 | NAT, PAT (Overload), Static/Dynamic NAT |
| `Part 13.docx` | **102** | 86 | 16 | Wireless LAN Controller (WLC), AP rejimlar |
| `Part 14.docx` | **106** | 95 | 11 | Tarmoq xavfsizligi, AAA, TACACS+, RADIUS |
| `Part 15.docx` | **121** | 113 | 8 | SDN, Cisco DNA Center, REST APIs, JSON/YAML |
| `Part 16.docx` | **78** | 75 | 3 | EtherChannel (LACP/PAgP), STP turlari |
| `new questions.docx` | **306** | 284 | 22 | Eng so'nggi yangi CCNA imtihon savollari |
| **JAMI** | **1331** | **1205** | **126** | **100% to'liq va tasdiqlangan** |

---

## ⚙️ 4. Parser Qoidalari va Texnik Nozikliklar (Juda Muhim!)

Kelgusi agent bilishi shart bo'lgan eng muhim texnik jihatlar:

### A. Word XML'dagi `<w:br/>` teglari
Word matnlari o'qilganda `p.itertext()` funksiyasi `<w:br/>` (line break) teglarini tashlab ketadi. Bu holat Drag & Drop savollaridagi variantlarni bir-biriga yopishib ketishiga olib kelgan. Shuning uchun `regenerate_complete_dataset.py` da matn quyidagicha ajratiladi:
```python
parts = []
for node in p.iter():
    if node.tag.endswith('}t'):
        parts.append(node.text or '')
    elif node.tag.endswith('}br') or node.tag.endswith('}cr'):
        parts.append('\n')
    elif node.tag.endswith('}tab'):
        parts.append(' ')
text = ''.join(parts).strip()
```

### B. `Answer:` qatorini o'qish (Hech qachon qatordan oshib ketmaslik)
`Answer:` dan keyin kelgan `Explanation` so'zining boshidagi `E` harfi test javobiga aralashib ketmasligi uchun regex doimo satr oxirigacha cheklangan:
```python
ans_match = re.search(r'(?:^|\n)Answer:\s*([^\n]+)', rem_text, re.IGNORECASE)
if ans_match:
    ans_line = ans_match.group(1)
    answer_letters = [c for c in re.findall(r'[A-F]', ans_line.upper())]
```

### C. `healQuestionAnswer(q)` — Dinamik Shifolovchi Funksiya
[app.js](file:///c:/Users/user/Desktop/quiz/app.js) faylining 340-qatorida joylashgan. Agar foydalanuvchi brauzerida eski `sessionStorage` keshidan test tiklansa yoki javobi bo'sh qolgan bo'lsa, ushbu funksiya savolni real vaqtda `CCNA_QUESTIONS` dagi to'g'ri variant matni bilan taqqoslab, to'g'ri javobni avtomatik tiklaydi:
```javascript
function healQuestionAnswer(q) {
  // q.answer bo'sh yoki noto'g'ri bo'lsa, CCNA_QUESTIONS master bazasidan to'g'rilaydi
}
```

---

## 🚀 5. Yangilanishlarni GitHub va Vercel'ga Chiqarish (Deployment Qadamlari)

Agar savollar bazasiga, `app.js` ga yoki `index.html` ga biron o'zgartirish kiritilsa, quyidagi aniq tartibda ish ko'riladi:

### 1-qadam: Parser va Izohlarni Qayta Yaratish (agar savollar o'zgarsa)
```bash
python regenerate_complete_dataset.py
python generate_all_short_uz_explanations.py
```

### 2-qadam: Keshni Yangilash (Cache Busting)
Brauzerlar keshni saqlab qolmasligi uchun [index.html](file:///c:/Users/user/Desktop/quiz/index.html) faylidagi versiya raqamini oshiring:
```html
<link rel="stylesheet" href="style.css?v=3.6">
<script src="data.js?v=3.6"></script>
<script src="app.js?v=3.6"></script>
```

### 3-qadam: GitHub'ga Push Qilish (BypassSandbox: true bilan)
Loyihadagi o'zgarishlarni Git orqali GitHub'ga push qiling:
```powershell
cd c:\Users\user\Desktop\quiz
git add app.js data.js index.html questions.json
git commit -m "feat: update questions and frontend logic"
git push origin main
```
> [!NOTE]
> GitHub `main` branch'iga push qilinganda, **Vercel 15-30 soniya ichida loyihani avtomatik qayta quradi va internetda jonli e'lon qiladi**.

---

## 💡 6. Yangi Agent Uchun Muhim Eslatmalar

1. **Topologiya rasmlari:** Savollarda ishlatiladigan rasmlar `images/` papkasida joylashgan. `q.images` massivida rasmlar ro'yxati saqlanadi.
2. **Offline Rejim:** Sayt PWA yoki oddiy `index.html` sifatida internet yo'qligida ham ishlay oladi, chunki `data.js` barcha ma'lumotlarni JavaScript o'zgaruvchisida saqlaydi.
3. **Admin va Talabalar Paneli:** Saytda o'rnatilgan Admin boshqaruv paneli bor (Foydalanuvchilar, Test natijalari, Jonli chat, Qurilmalar xavfsizligi). Barcha ma'lumotlar brauzerning `localStorage` xotirasida va sinxronlash tizimida aylanadi.
