import json
import re
import os

with open('questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

print(f"Total questions loaded: {len(questions)}")

# Load labs and dragdrop to ensure they stay intact
with open('labs.json', 'r', encoding='utf-8') as f:
    labs = json.load(f)

with open('dragdrop.json', 'r', encoding='utf-8') as f:
    dragdrop = json.load(f)

def clean_text(s):
    if not s:
        return ""
    return re.sub(r'[\xa0\ufffd\r]', ' ', s).strip()

def format_short_explanation(q, index):
    # Case 1: Drag & Drop
    if q.get('isDragDrop') or 'pairs' in q:
        pairs = q.get('pairs', [])
        lines = [f"• <b>{clean_text(p.get('term',''))}</b> ➔ {clean_text(p.get('def',''))}" for p in pairs]
        pairs_html = "<br>".join(lines)
        return (
            f"<b>Javob: To'g'ri moslashtirish:</b><br>{pairs_html}<br><br>"
            f"🔑 <b>Ilgak:</b> CCNA imtihonida ushbu tushunchalar o'rtasidagi asosiy bog'liqlikni eslab qoling."
        )

    # Case 2: Multiple Choice
    ans = q.get('answer', [])
    if isinstance(ans, str):
        ans = [ans]
    ans_letters = [a.strip() for a in ans if a and a.strip()]
    ans_str = ", ".join(ans_letters)

    opts = q.get('options', {})
    opt_texts = [clean_text(opts.get(l, '')) for l in ans_letters if opts.get(l)]
    opt_summary = " / ".join(opt_texts)
    if len(opt_summary) > 130:
        opt_summary = opt_summary[:127] + "..."

    q_text = clean_text(q.get('question', ''))
    q_lower = q_text.lower()
    exp_en = clean_text(q.get('explanation', ''))
    exp_lower = exp_en.lower()

    reason = ""
    hook = ""

    # Comprehensive Rule Engine
    # 1. Routing / OSPF / EIGRP / BGP / Static
    if "floating static" in exp_lower or ("so that ospf routing is used when ospf is up" in q_lower):
        reason = f"{opt_summary}. Bu floating static route: AD 125 > 110 (OSPF), shuning uchun OSPF ishlaganda OSPF yo'li tanlanadi, OSPF tushganda static route ishga tushadi."
        hook = "Zaxira yo'l (Floating Static) = AD qiymati OSPF (110) dan katta qilib belgilanadi."
    elif "rapid pvst+" in q_lower and "loop-free" in q_lower:
        reason = f"{opt_summary}. Rapid PVST+ har bir alohida VLAN uchun mustaqil spanning-tree instance yaratadi va tarmoqni zudlik bilan loop'siz holatga keltiradi."
        hook = "Rapid PVST+ = Har bir VLAN uchun alohida Spanning-Tree instansi."
    elif "lowest bridge priority" in exp_lower or ("root bridge" in q_lower and "priority" in exp_lower):
        reason = f"{opt_summary}. Spanning Tree protokolida eng past (eng kichik) Bridge Priority qiymatiga ega bo'lgan kommutator ushbu VLAN uchun Root Bridge etib saylanadi."
        hook = "Eng kichik Priority = Root Bridge (Asosiy kommutator)."
    elif "wlc management connection type is vulnerable to man-in-the-middle" in q_lower:
        reason = f"{opt_summary}. Telnet ma'lumotlar va parollarni ochiq matn (clear text) holida uzatadi, shuning uchun oraliq hujumlariga (MitM) juda zaif. WLC da sukut bo'yicha o'chirilgan bo'ladi."
        hook = "Shifrlanmagan ochiq aloqa = Telnet (Xavfsiz muqobili = SSH)."
    elif "which command configures ospf on the point-to-point link" in q_lower:
        reason = f"{opt_summary}. OSPF konfiguratsiyasida 'network' buyrug'i qaysi interfeyslar OSPF ga qo'shilishi va qaysi Area tarkibiga kirishini belgilaydi."
        hook = "OSPF ga interfeysni qo'shish = network <IP> <Wildcard> area <ID>."
    elif "differentiates the concept of authentication from authorization and accounting" in q_lower:
        reason = f"{opt_summary}. Authentication (autentifikatsiya) aynan shaxsni tasdiqlash (identity verification) vazifasini bajaradi. Authorization ruxsatlarni, Accounting esa amallarni ro'yxatga oladi."
        hook = "Authentication = Shaxsni tasdiqlash. Authorization = Ruxsat. Accounting = Audit va hisob."
    elif "duplex" in opt_summary.lower() or "collisions" in exp_lower:
        reason = f"{opt_summary}. Interfeysda kolliziyalar (collisions) ko'payib, uzatish sekinlashishi ko'pincha portlarning duplex sozlamalari mos kelmasligi (Duplex Mismatch) tufayli yuzaga keladi."
        hook = "Kolliziya va uzatish sekinligi = Duplex nomuvofiqligi."
    elif "sales-1" in exp_lower or "sales-1" in q_lower:
        reason = f"{opt_summary}. Switch Sales-1 ning manba MAC manzilini oldindan o'zining MAC jadvaliga yozib olgan, shuning uchun freymni barcha portlarga sochmasdan (flood qilmasdan) faqat kerakli portga yo'naltiradi."
        hook = "MAC jadvalida mavjud manzil = Faqat kerakli portga yuboriladi (Unicast forwarding)."
    elif "wireless controllers in an enterprise network" in q_lower:
        reason = f"{opt_summary}. Simsiz kontroller (WLC) korxona tarmog'idagi yuzlab Access Point (AP) larni bitta nuqtadan markazlashgan holda boshqarish va xavfsizlikni ta'minlash vazifasini bajaradi."
        hook = "WLC asosiy vazifasi = AP larni markazlashgan boshqaruvi."
    elif "lacp" in opt_summary.lower() or ("aggregate" in q_lower and "active mode" in q_lower):
        reason = f"{opt_summary}. IEEE 802.3ad LACP ochiq standarti bo'lib, har ikki tomonda 'active' rejimi portlarni avtomatik tarzda bitta mantiqiy EtherChannel kanaliga birlashtirish imkonini beradi."
        hook = "Active / Passive rejimlari = LACP (Desirable / Auto esa Cisco PAgP)."
    elif "id badge" in q_lower and "one person" in q_lower:
        reason = f"{opt_summary}. Bitta ruxsatnoma orqali bir necha kishining ergashib kirishi (tailgating) binoga jismoniy kirishni nazorat qilish (physical access control) talablarini buzadi."
        hook = "Bino eshigidan ruxsatsiz o'tish = Jismoniy xavfsizlik (Physical access control)."
    elif "servers connect to the network in a virtual environment" in q_lower:
        reason = f"{opt_summary}. Virtual muhitda serverlar (VM lar) gipervizor ichidagi dasturiy virtual switch (vSwitch) orqali tashqi jismoniy tarmoqqa ulanadi."
        hook = "Virtual serverlar = Gipervizordagi dasturiy switch orqali ulanadi."
    elif "private ipv4 addressing appropriate" in q_lower:
        reason = f"{opt_summary}. Xususiy (RFC 1918 Private IP) manzillar faqat ichki lokal tarmoq uchun ajratilgan bo'lib, global internetda marshrutlanmaydi."
        hook = "Private IP = Ichki (lokal) tarmoq uchun."
    elif "which standard http header tells a server which media type is expected by the client" in q_lower:
        reason = f"{opt_summary}. REST API so'rovlarida mijoz qaysi ma'lumot formatini (masalan application/json) kutayotganini serverga bildirish uchun 'Accept' sarlavhasi (header) ishlatiladi."
        hook = "Mijoz kutayotgan format = Accept header (Yuborilayotgan format esa Content-Type)."
    elif "two qos tools are used to guarantee minimum bandwidth" in q_lower:
        reason = f"{opt_summary}. CBWFQ (Class-Based Weighted Fair Queueing) va RSVP trafigi uchun tarmoqda kafolatlangan minimal o'tkazuvchanlik (guaranteed bandwidth) ajratish imkonini beradi."
        hook = "Kafolatlangan o'tkazuvchanlik = CBWFQ va RSVP."
    elif "longest prefix" in exp_lower or ("longest prefix" in q_lower):
        reason = f"{opt_summary}. Marshrutlashda doimo eng aniq va eng uzun prefiksga ega marshrut (Longest Prefix Match) eng birinchi navbatda tanlanadi."
        hook = "Marshrut tanlash qoidasi = Eng uzun prefiks (Longest Prefix Match) birinchi o'rinda turadi."
    elif "administrative distance" in exp_lower or ("administrative distance" in q_lower):
        reason = f"{opt_summary}. Turli marshrutlash protokollari bitta manzilga yo'l taklif qilganda, doimo eng kichik Ma'muriy Masofaga (Administrative Distance - AD) ega protokoli tanlanadi."
        hook = "AD qoidasi = Eng kichik AD eng ishonchli marshrut hisoblanadi (Static=1, OSPF=110, RIP=120)."
    elif "portfast" in q_lower or "portfast" in exp_lower:
        reason = f"{opt_summary}. PortFast funksiyasi so'nggi qurilmalar (PC, printer) ulangan portlarni STP ning Listening va Learning holatlarini chetlab o'tib, darhol Forwarding holatiga o'tkazadi."
        hook = "PortFast = Listening va Learning bosqichlarini chetlab o'tib, darhol Forwarding ga o'tish."
    elif "bpdu guard" in q_lower or "bpduguard" in q_lower:
        reason = f"{opt_summary}. BPDU Guard faollashtirilgan portga kutilmagan BPDU paketi kelsa, halqa (loop) xavfining oldini olish uchun port darhol 'err-disabled' holatiga tushadi."
        hook = "BPDU Guard = Ruxsatsiz BPDU kelsa, portni err-disabled qiladi."
    elif "vtp" in q_lower and ("server" in q_lower or "client" in q_lower or "transparent" in q_lower):
        reason = f"{opt_summary}. VTP Transparent rejimida kommutator o'zining lokal VLAN ma'lumotlar bazasini o'zgartirmaydi, lekin boshqa VTP xabarlarini tranzit orqali keyingi switchlarga uzatadi."
        hook = "VTP Transparent = O'zi o'zgarmaydi, xabarlarni boshqalarga o'tkazadi."
    elif "native vlan" in q_lower:
        reason = f"{opt_summary}. 802.1Q trunk liniyasida teglanmagan (untagged) barcha trafik Native VLAN ga tegishli bo'ladi. Har ikki tomonda Native VLAN bir xil bo'lishi shart."
        hook = "Native VLAN = 802.1Q da teglanmagan trafik (ikkala tomonda bir xil bo'lishi shart)."
    elif "rest api" in q_lower or "http method" in q_lower:
        if "post" in opt_summary.lower():
            reason = f"{opt_summary}. HTTP POST metodi serverda yangi resurs yaratish (Create) uchun ishlatiladi."
            hook = "POST = Yangi resurs yaratish."
        elif "get" in opt_summary.lower():
            reason = f"{opt_summary}. HTTP GET metodi serverdagi mavjud ma'lumotlarni o'qish (Read) uchun ishlatiladi."
            hook = "GET = Ma'lumotlarni o'qish / olish."
        elif "put" in opt_summary.lower():
            reason = f"{opt_summary}. HTTP PUT metodi mavjud resursni to'liq yangilash (Update/Replace) uchun ishlatiladi."
            hook = "PUT = Mavjud resursni yangilash."
        elif "delete" in opt_summary.lower():
            reason = f"{opt_summary}. HTTP DELETE metodi serverdagi belgilangan resursni o'chirish uchun xizmat qiladi."
            hook = "DELETE = Resursni o'chirish."
        elif "patch" in opt_summary.lower():
            reason = f"{opt_summary}. HTTP PATCH metodi resursning faqat ma'lum bir qismini qisman o'zgartirish (Partial update) uchun ishlatiladi."
            hook = "PATCH = Qisman yangilash."
        else:
            reason = f"{opt_summary}. REST API HTTP protokoli standart metodlari va JSON formati yordamida tarmoqni dasturiy boshqarish imkonini beradi."
            hook = "REST API = HTTP metodlari (GET, POST, PUT, DELETE) va JSON formati."
    elif "tacacs+" in q_lower or "radius" in q_lower:
        if "tacacs+" in opt_summary.lower():
            reason = f"{opt_summary}. TACACS+ Cisco mulki bo'lib, TCP 49 portidan foydalanadi va butun paketni (shu jumladan buyruqlarni) to'liq shifrlaydi hamda AAA ni alohida ajratadi."
            hook = "TACACS+ = TCP 49, paketni to'liq shifrlaydi, AAA mustaqil ajratilgan."
        else:
            reason = f"{opt_summary}. RADIUS ochiq standart bo'lib, UDP 1812/1813 portlarida ishlaydi va faqat foydalanuvchi parolini shifrlaydi."
            hook = "RADIUS = UDP 1812/1813, faqat parolni shifrlaydi."
    elif "dhcp snooping" in q_lower:
        reason = f"{opt_summary}. DHCP Snooping xavfsizlik funksiyasi soxta (rogue) DHCP serverlar oldini oladi va faqat ishonchli (trusted) portlardan DHCP takliflarini qabul qiladi."
        hook = "DHCP Snooping = Soxta DHCP serverlardan himoya (Trusted vs Untrusted portlar)."
    elif "dynamic arp inspection" in q_lower or "dai" in q_lower:
        reason = f"{opt_summary}. Dynamic ARP Inspection (DAI) kommutatorda ARP poisoning va MITM hujumlarining oldini olish uchun DHCP snooping bazasiga qarab ARP so'rovlarini tekshiradi."
        hook = "DAI = ARP Poisoning hujumidan himoya."
    elif "snmp" in q_lower:
        if "v3" in opt_summary.lower() or "v3" in q_lower:
            reason = f"{opt_summary}. SNMPv3 protokoli foydalanuvchi autentifikatsiyasi (auth) va ma'lumotlarni shifrlash (priv) orqali yuqori darajadagi xavfsizlikni ta'minlaydi."
            hook = "SNMPv3 = Autentifikatsiya va shifrlash (authPriv) mavjud yagona SNMP versiyasi."
        else:
            reason = f"{opt_summary}. SNMP tarmoq qurilmalarini monitoring qilish va ularning ko'rsatkichlarini MIB/OID orqali yig'ish uchun xizmat qiladi."
            hook = "SNMP = Tarmoq monitoringi va boshqaruvi."
    elif "json" in q_lower:
        reason = f"{opt_summary}. JSON formatida ma'lumotlar figurali qavslar ichidagi 'kalit': 'qiymat' (key-value) juftliklari va kvadrat qavslar ichidagi massivlar orqali ifodalanadi."
        hook = "JSON = {{}} obyekt, [] massiv, kalit: qiymat juftliklari."
    elif "ansible" in q_lower or "puppet" in q_lower or "chef" in q_lower:
        if "ansible" in opt_summary.lower():
            reason = f"{opt_summary}. Ansible agent talab qilmaydi (agentless), qurilmalarga to'g'ridan-to'g'ri SSH orqali ulanadi va YAML formatidagi Playbook lardan foydalanadi."
            hook = "Ansible = Agentless (agentsiz) va SSH orqali ishlaydi."
        elif "puppet" in opt_summary.lower():
            reason = f"{opt_summary}. Puppet mijoz-server (agent-based) arxitekturasida ishlaydi va konfiguratsiyalarni boshqarish uchun manifestlardan foydalanadi."
            hook = "Puppet = Agent-based (agent o'rnatilishi shart)."
        elif "chef" in opt_summary.lower():
            reason = f"{opt_summary}. Chef agent-based tizim bo'lib, sozlamalarni Ruby tilida yozilgan 'Cookbook' va 'Recipe'lar orqali amalga oshiradi."
            hook = "Chef = Ruby retseptlari (Recipes/Cookbooks) va agent-based."
    elif "dna center" in q_lower or "catalyst center" in q_lower:
        reason = f"{opt_summary}. Cisco DNA Center (hozirgi Catalyst Center) butun korxona tarmog'ini markazlashgan boshqaruv, avtomatlashtirish, xavfsizlik siyosatlari va monitoring bilan ta'minlovchi SDN kontrollerdir."
        hook = "Cisco DNA Center = Markazlashgan korporativ tarmoq kontrolleri (Enterprise SDN)."
    elif "ipv6" in q_lower:
        if "link-local" in opt_summary.lower() or "fe80" in opt_summary.lower():
            reason = f"{opt_summary}. IPv6 Link-Local manzillari doimo 'fe80::/10' prefiksi bilan boshlanadi va faqat bitta mahalliy tarmoq segmenti ichida muloqot qilish uchun ishlatiladi."
            hook = "IPv6 Link-Local = fe80::/10 prefiksi."
        elif "eui-64" in opt_summary.lower() or "eui-64" in q_lower:
            reason = f"{opt_summary}. EUI-64 mexanizmida qurilmaning 48-bitli MAC manzili o'rtasiga 'FFFE' qo'shiladi va 7-biti teskarisiga o'girilib, 64-bitli interfeys identifikatori hosil qilinadi."
            hook = "EUI-64 = MAC manzil o'rtasiga FFFE qo'shish + 7-bitni invertatsiya qilish."
        elif "multicast" in opt_summary.lower() or "ff00" in opt_summary.lower():
            reason = f"{opt_summary}. IPv6 da Broadcast yo'q, uning o'rniga Multicast ishlatiladi va barcha IPv6 Multicast manzillari 'ff00::/8' prefiksi bilan boshlanadi."
            hook = "IPv6 Multicast = ff00::/8 (IPv6 da Broadcast mavjud emas)."
        else:
            reason = f"{opt_summary}. IPv6 128-bitli manzil tizimi bo'lib, tarmoq miqyosini kengaytirish va xavfsiz marshrutlashni ta'minlash uchun xizmat qiladi."
            hook = "IPv6 = 128-bitli manzil, 16-lik sanoq tizimi."
    elif "ntp" in q_lower:
        reason = f"{opt_summary}. NTP (Network Time Protocol) barcha tarmoq qurilmalari soatini aniq sinxronlashtirish uchun xizmat qiladi. Stratum 1 eng aniq birlamchi vaqt manbaiga to'g'ridan-to'g'ri ulangan bo'ladi."
        hook = "NTP = Vaqtni sinxronlash (Stratum soni qancha kichik bo'lsa, shuncha aniq)."
    elif "syslog" in q_lower:
        reason = f"{opt_summary}. Syslog tizim hodisalarini 0 (favqulodda - Emergency) dan 7 (nosozliklarni aniqlash - Debug) gacha bo'lgan og'irlik darajalari bo'yicha markaziy serverga yozib boradi."
        hook = "Syslog darajalari = 0 (Eng og'ir - Emergency) dan 7 (Debugging) gacha."

    # General explanation synthesis from English explanation if specific pattern didn't catch
    if not reason:
        if exp_en:
            # Clean English explanation and take the first punchy statement
            sentences = [s.strip() for s in exp_en.split('.') if len(s.strip()) > 15]
            core_sentence = sentences[0] if sentences else ""
            core_sentence = re.sub(r'[\xa0\ufffd\r\n]', ' ', core_sentence)
            if len(core_sentence) > 140:
                core_sentence = core_sentence[:137] + "..."
            
            # Smart networking glossary replacement for the core sentence
            uz_core = core_sentence
            glossary = [
                (r'\bswitch\b', 'kommutator (switch)'),
                (r'\bswitches\b', 'kommutatorlar (switchlar)'),
                (r'\brouter\b', 'router'),
                (r'\brouters\b', 'routerlar'),
                (r'\brouting table\b', 'marshrutlash jadvali (routing table)'),
                (r'\bdefault gateway\b', 'asosiy shlyuz (default gateway)'),
                (r'\bbroadcast domain\b', 'eshittirish domeni (broadcast domain)'),
                (r'\bcollision domain\b', 'to\'qnashuv domeni (collision domain)'),
                (r'\binterface\b', 'interfeys'),
                (r'\binterfaces\b', 'interfeyslar'),
                (r'\bpacket\b', 'paket'),
                (r'\bpackets\b', 'paketlar'),
                (r'\bframe\b', 'freym (kadr)'),
                (r'\bframes\b', 'freymlar (kadrlar)'),
                (r'\bis used to\b', 'vazifasini bajaradi va quyidagicha ishlaydi:'),
                (r'\ballows\b', 'imkonini beradi:'),
                (r'\bprovides\b', 'ta\'minlaydi:'),
                (r'\brequires\b', 'talab qiladi:'),
                (r'\bconfigured\b', 'sozlangan')
            ]
            for pat, rep in glossary:
                uz_core = re.sub(pat, rep, uz_core, flags=re.IGNORECASE)

            reason = f"{opt_summary}. Ushbu yechimning asosiy sababi: {uz_core}."
            hook = f"Cisco CCNA imtihoni uchun [{ans_str}] varianti va uning mazmunini eslab qoling."
        else:
            reason = f"{opt_summary}. Cisco CCNA standarti va amaliy tarmoq talablariga ko'ra eng to'g'ri va xavfsiz javob hisoblanadi."
            hook = f"To'g'ri javob: [{ans_str}] — {opt_summary[:60]}"

    out = f"<b>Javob: {ans_str}</b> — {reason}"
    if hook:
        out += f"<br><br>🔑 <b>Ilgak:</b> {hook}"
    return out

# Process all questions
count = 0
for idx, q in enumerate(questions):
    q['explanation_uz'] = format_short_explanation(q, idx)
    count += 1

print(f"Generated concise Uzbek explanations for all {count} questions!")

# Save to questions.json
with open('questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

# Save to data.js
with open('data.js', 'w', encoding='utf-8') as f:
    f.write('// CCNA Offline Quiz & Practical Labs Data\n')
    f.write('const CCNA_QUESTIONS = ')
    json.dump(questions, f, ensure_ascii=False)
    f.write(';\n\n')
    f.write('const CCNA_LABS = ')
    json.dump(labs, f, ensure_ascii=False)
    f.write(';\n\n')
    f.write('const CCNA_DRAGDROP = ')
    json.dump(dragdrop, f, ensure_ascii=False)
    f.write(';\n')

print("Successfully updated questions.json and data.js!")
