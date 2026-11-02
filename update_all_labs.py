import json
import re

CLI_SCENARIOS = [
  {
    "device": "SW-1",
    "title": "Lab 1: Switch Port Access & Voice VLAN Sozlash",
    "steps": [
      { "cmd": "enable", "tip": "Privileged EXEC rejimiga o'tish: enable" },
      { "cmd": "configure terminal", "tip": "Global konfiguratsiyaga o'tish: configure terminal" },
      { "cmd": "interface e0/1", "tip": "E0/1 interfeysiga kirish: interface e0/1" },
      { "cmd": "switchport mode access", "tip": "Portni access rejimiga o'tkazish: switchport mode access" },
      { "cmd": "switchport access vlan 10", "tip": "Data VLAN 10 ni biriktirish: switchport access vlan 10" },
      { "cmd": "switchport voice vlan 11", "tip": "IP Phone uchun Voice VLAN 11: switchport voice vlan 11" },
      { "cmd": "exit", "tip": "Interfeysdan chiqish: exit" },
      { "cmd": "vlan 10", "tip": "VLAN 10 yaratish: vlan 10" },
      { "cmd": "name Engineering", "tip": "VLAN nomini berish: name Engineering" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "Sw1",
    "title": "Lab 2: 802.1Q Trunking & VLAN Naming",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejimga o'tish: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiyaga o'tish: configure terminal" },
      { "cmd": "vlan 77", "tip": "VLAN 77 yaratish: vlan 77" },
      { "cmd": "name User_VLAN", "tip": "VLAN nomini User_VLAN deb belgilash: name User_VLAN" },
      { "cmd": "vlan 177", "tip": "VLAN 177 yaratish: vlan 177" },
      { "cmd": "name Voice_VLAN", "tip": "VLAN nomini Voice_VLAN deb belgilash: name Voice_VLAN" },
      { "cmd": "exit", "tip": "VLAN rejimidan chiqish: exit" },
      { "cmd": "interface range e0/1 - 3", "tip": "E0/1 - 3 portlar diapazoniga kirish: interface range e0/1 - 3" },
      { "cmd": "switchport mode access", "tip": "Access rejimiga o'tkazish: switchport mode access" },
      { "cmd": "switchport access vlan 77", "tip": "User VLAN 77 ni biriktirish: switchport access vlan 77" },
      { "cmd": "switchport voice vlan 177", "tip": "Voice VLAN 177 ni sozlash: switchport voice vlan 177" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "SW-1",
    "title": "Lab 3: Trunk Allowed VLANs & Native VLAN Untagged",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "interface e0/0", "tip": "E0/0 trunk portiga kirish: interface e0/0" },
      { "cmd": "switchport trunk allowed vlan 5,6", "tip": "Faqat VLAN 5 va 6 ga ruxsat berish: switchport trunk allowed vlan 5,6" },
      { "cmd": "exit", "tip": "Interfeysdan chiqish: exit" },
      { "cmd": "interface e0/1", "tip": "E0/1 portiga kirish: interface e0/1" },
      { "cmd": "switchport trunk native vlan 77", "tip": "Native VLAN ni 77 deb belgilash: switchport trunk native vlan 77" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "R1",
    "title": "Lab 4: Floating Static Route (Zaxira yo'l)",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "ip route 10.0.41.10 255.255.255.255 10.0.12.2", "tip": "R2 orqali asosiy marshrut: ip route 10.0.41.10 255.255.255.255 10.0.12.2" },
      { "cmd": "ip route 10.0.41.10 255.255.255.255 10.0.13.3 254", "tip": "R3 orqali zaxira floating route (AD=254): ip route 10.0.41.10 255.255.255.255 10.0.13.3 254" },
      { "cmd": "ip route 0.0.0.0 0.0.0.0 10.0.13.3", "tip": "Internet uchun default gateway: ip route 0.0.0.0 0.0.0.0 10.0.13.3" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "R1",
    "title": "Lab 5: IPv4 Subnetting & Interface Configuration",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "interface e0/1", "tip": "E0/1 interfeysiga kirish: interface e0/1" },
      { "cmd": "ip address 192.168.180.17 255.255.255.240", "tip": "Birinchi foydali /28 IP manzil: ip address 192.168.180.17 255.255.255.240" },
      { "cmd": "ipv6 address 2001:db8:acca::1/64", "tip": "IPv6 manzilini sozlash: ipv6 address 2001:db8:acca::1/64" },
      { "cmd": "no shutdown", "tip": "Interfeysni yoqish: no shutdown" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "SW-1",
    "title": "Lab 6: Enterprise VLAN 99 FINANCIAL & Access Ports",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "vlan 99", "tip": "VLAN 99 yaratish: vlan 99" },
      { "cmd": "name FINANCIAL", "tip": "VLAN nomini berish: name FINANCIAL" },
      { "cmd": "exit", "tip": "Chiqish: exit" },
      { "cmd": "interface e0/2", "tip": "PC1 ulangan E0/2 portiga kirish: interface e0/2" },
      { "cmd": "switchport mode access", "tip": "Access rejimiga o'tkazish: switchport mode access" },
      { "cmd": "switchport access vlan 99", "tip": "VLAN 99 ga biriktirish: switchport access vlan 99" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "R1",
    "title": "Lab 7: Point-to-Point IPv4 Subnetting /30",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "interface e0/0", "tip": "E0/0 interfeysiga kirish: interface e0/0" },
      { "cmd": "ip address 10.0.12.5 255.255.255.252", "tip": "/30 tarmog'idagi 1-foydali IP manzil: ip address 10.0.12.5 255.255.255.252" },
      { "cmd": "no shutdown", "tip": "Portni yoqish: no shutdown" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "R1",
    "title": "Lab 9: OSPF Area 0 & Process ID Sozlash",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "interface e0/2", "tip": "E0/2 interfeysiga kirish: interface e0/2" },
      { "cmd": "ip ospf 110 area 0", "tip": "Interfeysda to'g'ridan-to'g'ri OSPF 110 Area 0 yoqish: ip ospf 110 area 0" },
      { "cmd": "exit", "tip": "Chiqish: exit" },
      { "cmd": "router ospf 110", "tip": "OSPF 110 jarayoniga kirish: router ospf 110" },
      { "cmd": "router-id 1.1.1.1", "tip": "Router ID belgilash: router-id 1.1.1.1" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "R1",
    "title": "Lab 10: OSPF Router ID & Network Sozlash",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "router ospf 33", "tip": "OSPF 33 jarayonini boshlash: router ospf 33" },
      { "cmd": "router-id 10.0.12.1", "tip": "Router ID ni E0/1 IP manzili deb belgilash: router-id 10.0.12.1" },
      { "cmd": "network 10.0.12.0 0.0.0.3 area 0", "tip": "Area 0 uchun tarmoqni e'lon qilish: network 10.0.12.0 0.0.0.3 area 0" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "Sw1",
    "title": "Lab 11: 802.1Q Trunking & Untagged Native VLAN",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "interface range e0/0 - 1", "tip": "E0/0 va E0/1 trunk portlar diapazoni: interface range e0/0 - 1" },
      { "cmd": "switchport trunk encapsulation dot1q", "tip": "802.1Q enkapsulyatsiya: switchport trunk encapsulation dot1q" },
      { "cmd": "switchport mode trunk", "tip": "Trunk rejimini yoqish: switchport mode trunk" },
      { "cmd": "switchport trunk native vlan 45", "tip": "VLAN 45 ni untagged Native VLAN qilish: switchport trunk native vlan 45" },
      { "cmd": "switchport trunk allowed vlan 15,45", "tip": "Faqat VLAN 15 va 45 ga ruxsat: switchport trunk allowed vlan 15,45" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "Sw1",
    "title": "Lab 12: Multi-VLAN Naming (IT & HR User VLAN)",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "vlan 77", "tip": "VLAN 77 yaratish: vlan 77" },
      { "cmd": "name IT_User_VLAN", "tip": "VLAN nomini berish: name IT_User_VLAN" },
      { "cmd": "vlan 88", "tip": "VLAN 88 yaratish: vlan 88" },
      { "cmd": "name HR_User_VLAN", "tip": "VLAN nomini berish: name HR_User_VLAN" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "SW-1",
    "title": "Lab 13: Trunk Allowed VLAN Lists on Port Range",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "interface range e0/1 - 2", "tip": "E0/1 va E0/2 trunk portlariga kirish: interface range e0/1 - 2" },
      { "cmd": "switchport trunk allowed vlan 56,77", "tip": "Faqat VLAN 56 va 77 ga ruxsat: switchport trunk allowed vlan 56,77" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "SW1",
    "title": "Lab 14: IEEE 802.1Q Dot1q Trunk Encapsulation",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "interface range e0/0 - 1", "tip": "E0/0 va E0/1 portlar diapazoni: interface range e0/0 - 1" },
      { "cmd": "switchport trunk encapsulation dot1q", "tip": "802.1Q enkapsulyatsiya: switchport trunk encapsulation dot1q" },
      { "cmd": "switchport mode trunk", "tip": "Trunk rejimini yoqish: switchport mode trunk" },
      { "cmd": "switchport trunk allowed vlan 10,20", "tip": "Faqat kerakli VLAN larni o'tkazish: switchport trunk allowed vlan 10,20" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "R1",
    "title": "Lab 15: IPv4 /28 Host Configuration & Default Gateway",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "interface e0/1", "tip": "E0/1 interfeysiga kirish: interface e0/1" },
      { "cmd": "ip address 192.168.168.193 255.255.255.240", "tip": "1-foydali host IP manzili: ip address 192.168.168.193 255.255.255.240" },
      { "cmd": "no shutdown", "tip": "Portni faollashtirish: no shutdown" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "SW-2",
    "title": "Lab 16: Industry Standard Dot1q Trunk & Native VLAN",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "interface e0/0", "tip": "E0/0 portiga kirish: interface e0/0" },
      { "cmd": "switchport trunk encapsulation dot1q", "tip": "802.1Q enkapsulyatsiya: switchport trunk encapsulation dot1q" },
      { "cmd": "switchport mode trunk", "tip": "Trunk rejimini yoqish: switchport mode trunk" },
      { "cmd": "switchport trunk allowed vlan 10", "tip": "Faqat VLAN 10 ga ruxsat: switchport trunk allowed vlan 10" },
      { "cmd": "switchport trunk native vlan 11", "tip": "Native VLAN ni 11 qilish: switchport trunk native vlan 11" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "R1",
    "title": "Lab 17: Static Default Route & Host Route /32",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "ip route 0.0.0.0 0.0.0.0 10.133.13.3", "tip": "R3 orqali asosiy default route: ip route 0.0.0.0 0.0.0.0 10.133.13.3" },
      { "cmd": "ip route 0.0.0.0 0.0.0.0 10.122.12.2 225", "tip": "R2 orqali zaxira floating default route (AD=225): ip route 0.0.0.0 0.0.0.0 10.122.12.2 225" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "R2",
    "title": "Lab 18: Default Routing to ISP & Next-Hop",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "ip route 0.0.0.0 0.0.0.0 209.165.200.225", "tip": "ISP tomonga default marshrut: ip route 0.0.0.0 0.0.0.0 209.165.200.225" },
      { "cmd": "ip route 10.0.41.10 255.255.255.255 e0/1", "tip": "Serverga boruvchi host route: ip route 10.0.41.10 255.255.255.255 e0/1" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "R2",
    "title": "Lab 19: Cisco IOS PAT (Port Address Translation / NAT Overload)",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "interface e0/0", "tip": "Outside interfeysga kirish: interface e0/0" },
      { "cmd": "ip nat outside", "tip": "Tashqi interfeys deb belgilash: ip nat outside" },
      { "cmd": "interface e0/1", "tip": "Inside interfeysga kirish: interface e0/1" },
      { "cmd": "ip nat inside", "tip": "Ichki interfeys deb belgilash: ip nat inside" },
      { "cmd": "exit", "tip": "Interfeysdan chiqish: exit" },
      { "cmd": "access-list 1 permit 10.0.12.1 0.0.0.0", "tip": "Lokal IP uchun ACL 1 yaratish: access-list 1 permit 10.0.12.1 0.0.0.0" },
      { "cmd": "ip nat inside source list 1 interface e0/0 overload", "tip": "PAT (NAT Overload) ni yoqish: ip nat inside source list 1 interface e0/0 overload" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "HQ1",
    "title": "Lab 20: OSPF Multi-Router & Router ID (HQ1)",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "router ospf 111", "tip": "OSPF 111 jarayonini boshlash: router ospf 111" },
      { "cmd": "router-id 10.110.110.110", "tip": "Loopback 0 manzilini Router ID qilish: router-id 10.110.110.110" },
      { "cmd": "network 10.110.110.110 0.0.0.0 area 0", "tip": "Lo0 tarmog'ini e'lon qilish: network 10.110.110.110 0.0.0.0 area 0" },
      { "cmd": "network 10.0.112.0 0.0.0.3 area 0", "tip": "HQ2 ga boruvchi tarmoq: network 10.0.112.0 0.0.0.3 area 0" },
      { "cmd": "network 10.0.113.0 0.0.0.7 area 0", "tip": "HQ3 ga boruvchi tarmoq: network 10.0.113.0 0.0.0.7 area 0" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "R1",
    "title": "Lab 21: Extended Named ACL (WWW_ACL) Sozlash",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "ip access-list extended WWW_ACL", "tip": "WWW_ACL nomli extended ACL ochish: ip access-list extended WWW_ACL" },
      { "cmd": "permit tcp 10.101.1.0 0.0.0.255 any eq www", "tip": "Web trafikka ruxsat: permit tcp 10.101.1.0 0.0.0.255 any eq www" },
      { "cmd": "deny tcp any any eq www", "tip": "Boshqa barcha web trafikni bloklash: deny tcp any any eq www" },
      { "cmd": "deny tcp host 10.101.0.2 any eq telnet", "tip": "Telnet ulanishni taqiqlash: deny tcp host 10.101.0.2 any eq telnet" },
      { "cmd": "permit ip any any", "tip": "Qolgan barcha IP trafikka ruxsat: permit ip any any" },
      { "cmd": "exit", "tip": "ACL sozlamasidan chiqish: exit" },
      { "cmd": "interface e0/1", "tip": "E0/1 interfeysiga kirish: interface e0/1" },
      { "cmd": "ip access-group WWW_ACL in", "tip": "ACL ni interfeys kirishiga biriktirish: ip access-group WWW_ACL in" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  },
  {
    "device": "R1",
    "title": "Lab 22: NAT/PAT Overload & NTP Master Sozlash",
    "steps": [
      { "cmd": "enable", "tip": "Privileged rejim: enable" },
      { "cmd": "configure terminal", "tip": "Konfiguratsiya: configure terminal" },
      { "cmd": "ip nat inside source list 192 interface e0/0 overload", "tip": "ACL 192 asosida PAT ni yoqish: ip nat inside source list 192 interface e0/0 overload" },
      { "cmd": "ntp master", "tip": "Routerni NTP Master deb belgilash: ntp master" },
      { "cmd": "ntp source-interface Loopback0", "tip": "NTP manba interfeysini Loopback0 qilish: ntp source-interface Loopback0" },
      { "cmd": "exit", "tip": "Chiqish: exit" }
    ]
  }
]

# 1. Update app.js
print("[1/3] Updating app.js...")
with open(r'c:\Users\user\Desktop\quiz\app.js', 'r', encoding='utf-8') as f:
    app_text = f.read()

# Replace scenarios in state.cli
scenarios_json = json.dumps(CLI_SCENARIOS, indent=6)

# Locate scenarios: [ ... ] inside state.cli
state_cli_pattern = re.compile(r'cli:\s*\{[^}]*?scenarios:\s*\[[\s\S]*?\n\s*\]\s*\}', re.M)
new_cli_block = f"""cli: {{
    device: 'SW-1',
    mode: 'user',
    scenarioIndex: 0,
    currentLabStep: 0,
    scenarios: {scenarios_json}
  }}"""

app_text = state_cli_pattern.sub(lambda m: new_cli_block, app_text, count=1)

# Now update CLI simulator functions in app.js:
new_cli_functions = """// CLI SIMULATOR
function initCliSimulator() {
  const input = document.getElementById('cliInput');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      input.value = '';
      executeCliCommand(val);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleCliTabCompletion(input);
    }
  });

  populateCliScenarioSelect();
  switchCliScenario();
}

function populateCliScenarioSelect() {
  const select = document.getElementById('cliScenarioSelect');
  if (!select) return;
  select.innerHTML = '';
  state.cli.scenarios.forEach((sc, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = sc.title;
    select.appendChild(opt);
  });
}

function switchCliScenario() {
  const select = document.getElementById('cliScenarioSelect');
  const index = select ? parseInt(select.value, 10) : 0;
  state.cli.scenarioIndex = index;
  state.cli.currentLabStep = 0;
  state.cli.mode = 'user';

  const scenario = state.cli.scenarios[index] || state.cli.scenarios[0];
  state.cli.device = scenario.device;

  updateCliPrompt();
  renderCliGoal();

  const hist = document.getElementById('cliHistory');
  if (hist) {
    hist.innerHTML = `
      <div class="terminal-line info">Cisco IOS Software (${scenario.device}).</div>
      <div class="terminal-line info">Mavzu: ${scenario.title}</div>
      <div class="terminal-line info">Mashg'ulotni boshlash uchun yuqoridagi vazifa bo'yicha buyruq kiriting.</div>
    `;
  }
}

function handleCliTabCompletion(inputEl) {
  const current = inputEl.value.toLowerCase().trim();
  if (!current) return;

  const validCommands = [
    'enable', 'disable', 'configure terminal', 'conf t', 'interface', 'int', 'interface range',
    'switchport mode access', 'switchport access vlan', 'switchport voice vlan',
    'switchport trunk encapsulation dot1q', 'switchport mode trunk',
    'switchport trunk allowed vlan', 'switchport trunk native vlan',
    'vlan', 'name', 'exit', 'end', 'router ospf', 'router-id', 'network',
    'ip route', 'ip address', 'ipv6 address', 'no shutdown', 'no shut',
    'access-list', 'ip access-list extended', 'permit tcp', 'deny tcp', 'permit ip', 'ip access-group',
    'ip nat inside', 'ip nat outside', 'ip nat inside source list',
    'ntp master', 'ntp source-interface', 'ip ospf',
    'show ip interface brief', 'show vlan brief', 'show ip route', 'show run', 'clear'
  ];

  const match = validCommands.find(c => c.startsWith(current));
  if (match) {
    inputEl.value = match;
    SoundEffects.playClick();
  }
}

function updateCliPrompt() {
  const promptEl = document.getElementById('cliPrompt');
  if (!promptEl) return;

  const d = state.cli.device;
  let p = `${d}>`;
  if (state.cli.mode === 'priv') p = `${d}#`;
  else if (state.cli.mode === 'config') p = `${d}(config)#`;
  else if (state.cli.mode === 'config-if') p = `${d}(config-if)#`;
  else if (state.cli.mode === 'config-vlan') p = `${d}(config-vlan)#`;
  else if (state.cli.mode === 'config-router') p = `${d}(config-router)#`;
  else if (state.cli.mode === 'config-ext-nacl') p = `${d}(config-ext-nacl)#`;

  promptEl.textContent = p;
}

function renderCliGoal() {
  const goalCard = document.getElementById('cliGoalCard');
  if (!goalCard) return;

  const scenario = state.cli.scenarios[state.cli.scenarioIndex];
  const step = scenario.steps[state.cli.currentLabStep];

  if (!step) {
    goalCard.innerHTML = `
      <div style="color:var(--success); font-weight:700; font-size:1.15rem;">
        🎉 Barakalla! Ushbu laboratoriya topshirig'i to'liq va muvaffaqiyatli bajarildi!
      </div>
      <button class="btn-primary" style="margin-top:10px;" onclick="resetCliSimulator()">Qayta boshlash 🔄</button>
    `;
    return;
  }

  goalCard.innerHTML = `
    <div style="font-size:0.95rem; margin-bottom:6px;"><b>Mavzu:</b> ${scenario.title}</div>
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div>
        <span style="background:var(--primary); color:white; padding:3px 10px; border-radius:12px; font-size:0.82rem; font-weight:700;">
          Qadam ${state.cli.currentLabStep + 1} / ${scenario.steps.length}
        </span>
        <span style="margin-left:8px; font-weight:600;">${step.tip}</span>
      </div>
      <button class="btn-secondary" style="padding:4px 10px; font-size:0.8rem;" onclick="showCliHint()">💡 Buyruqni ko'rsatish</button>
    </div>
  `;
}

function showCliHint() {
  const scenario = state.cli.scenarios[state.cli.scenarioIndex];
  const step = scenario.steps[state.cli.currentLabStep];
  if (step) alert(`To'g'ri buyruq:\n\n${step.cmd}`);
}

function resetCliSimulator() {
  state.cli.currentLabStep = 0;
  state.cli.mode = 'user';
  updateCliPrompt();
  renderCliGoal();
  addCliHistory("Simulyator qayta yuklandi. 'enable' buyrug'i bilan boshlang.", 'info');
}

function executeCliCommand(rawCmd) {
  if (!rawCmd) return;
  const promptText = document.getElementById('cliPrompt').textContent;
  addCliHistory(`${promptText} ${rawCmd}`, 'command');

  const cmd = rawCmd.toLowerCase().trim().replace(/\\s+/g, ' ');

  // Mode transitions
  if (cmd === 'enable' || cmd === 'en') {
    state.cli.mode = 'priv';
    updateCliPrompt();
  } else if (cmd === 'disable') {
    state.cli.mode = 'user';
    updateCliPrompt();
  } else if (cmd === 'configure terminal' || cmd === 'conf t') {
    if (state.cli.mode === 'priv') {
      state.cli.mode = 'config';
      updateCliPrompt();
      addCliHistory("Enter configuration commands, one per line. End with CNTL/Z.", 'output');
    } else {
      addCliHistory("% Type 'enable' first to enter privileged mode.", 'error');
    }
  } else if (cmd.startsWith('interface ') || cmd.startsWith('int ')) {
    if (state.cli.mode.startsWith('config')) {
      state.cli.mode = 'config-if';
      updateCliPrompt();
    }
  } else if (cmd.startsWith('vlan ')) {
    if (state.cli.mode.startsWith('config')) {
      state.cli.mode = 'config-vlan';
      updateCliPrompt();
    }
  } else if (cmd.startsWith('router ospf ') || cmd.startsWith('router ')) {
    if (state.cli.mode.startsWith('config')) {
      state.cli.mode = 'config-router';
      updateCliPrompt();
    }
  } else if (cmd.startsWith('ip access-list ')) {
    if (state.cli.mode.startsWith('config')) {
      state.cli.mode = 'config-ext-nacl';
      updateCliPrompt();
    }
  } else if (cmd === 'exit') {
    if (state.cli.mode.startsWith('config-')) {
      state.cli.mode = 'config';
    } else if (state.cli.mode === 'config') {
      state.cli.mode = 'priv';
    } else if (state.cli.mode === 'priv') {
      state.cli.mode = 'user';
    }
    updateCliPrompt();
  } else if (cmd === 'end') {
    state.cli.mode = 'priv';
    updateCliPrompt();
  } else if (cmd === 'clear' || cmd === 'cls') {
    document.getElementById('cliHistory').innerHTML = '';
    return;
  } else if (cmd === '?' || cmd === 'help') {
    addCliHistory("Mavjud buyruqlar: enable, disable, configure terminal, interface, vlan, router ospf, ip route, switchport, exit, end, clear. [Tab: Avto-to'ldirish]", 'info');
  }

  // Check goal step with smart normalization
  const scenario = state.cli.scenarios[state.cli.scenarioIndex];
  const currentStep = scenario.steps[state.cli.currentLabStep];
  if (currentStep) {
    const exp = currentStep.cmd.toLowerCase().trim().replace(/\\s+/g, ' ');
    
    const normalizeCmd = (s) => s
      .replace(/^conf\\s+t\\b/, 'configure terminal')
      .replace(/^int\\s+range\\b/, 'interface range')
      .replace(/^int\\s+/, 'interface ')
      .replace(/^sh\\s+/, 'show ')
      .replace(/\\bno\\s+shut\\b/, 'no shutdown')
      .replace(/^en\\b/, 'enable');

    const isMatch = (cmd === exp) || (normalizeCmd(cmd) === normalizeCmd(exp));

    if (isMatch) {
      SoundEffects.playCorrect();
      addCliHistory(`[Bajarildi ✅] ${currentStep.tip}`, 'success');
      state.cli.currentLabStep++;
      renderCliGoal();
    }
  }

  const body = document.getElementById('cliBody');
  if (body) body.scrollTop = body.scrollHeight;
}
"""

# Replace in app.js from "// CLI SIMULATOR" to "function addCliHistory"
cli_section_pattern = re.compile(r'// CLI SIMULATOR[\s\S]*?(?=function addCliHistory)', re.M)
app_text = cli_section_pattern.sub(lambda m: new_cli_functions, app_text, count=1)

# Also update openLabInSimulator
open_lab_pattern = re.compile(r'function openLabInSimulator\(\)\s*\{[\s\S]*?\}', re.M)
new_open_lab = """function openLabInSimulator(labIndex) {
  const targetIdx = (typeof labIndex !== 'undefined' && labIndex !== null) ? labIndex : (state.selectedLabIndex || 0);
  const cliTab = document.querySelector('.nav-tab[data-tab="cli"]');
  if (cliTab) cliTab.click();
  
  const select = document.getElementById('cliScenarioSelect');
  if (select && targetIdx >= 0 && targetIdx < state.cli.scenarios.length) {
    select.value = targetIdx;
    switchCliScenario();
  }
}"""
app_text = open_lab_pattern.sub(lambda m: new_open_lab, app_text, count=1)

with open(r'c:\Users\user\Desktop\quiz\app.js', 'w', encoding='utf-8') as f:
    f.write(app_text)

print("app.js updated successfully with all 21 CLI scenarios!")

# 2. Update index.html to include all 21 options in cliScenarioSelect
print("[2/3] Updating index.html...")
with open(r'c:\Users\user\Desktop\quiz\index.html', 'r', encoding='utf-8') as f:
    html_text = f.read()

options_html = ""
for idx, sc in enumerate(CLI_SCENARIOS):
    options_html += f'            <option value="{idx}">{sc["title"]}</option>\n'

select_pattern = re.compile(r'<select id="cliScenarioSelect"[^>]*>[\s\S]*?</select>', re.M)
new_select_html = f"""<select id="cliScenarioSelect" class="form-control" style="width:auto; max-width:100%; padding:6px 12px;" onchange="switchCliScenario()">
{options_html}          </select>"""

html_text = select_pattern.sub(lambda m: new_select_html, html_text, count=1)

with open(r'c:\Users\user\Desktop\quiz\index.html', 'w', encoding='utf-8') as f:
    f.write(html_text)

print("index.html updated successfully with all 21 options in dropdown!")
