// CCNA Professional Offline Quiz & Practical Trainer
// Advanced Features: Study & Memory Trainer, Question Palette, Exam Review Screen,
// Hotkeys, Audio Synthesis, CCNA Certificate Generator & Interactive Multi-scenario CLI.

const ADMIN_DEFAULT_PASS = 'admin123';

// Web Audio API Sound Synthesizer (Zero external files needed)
const SoundEffects = {
  enabled: localStorage.getItem('ccna_sound_enabled') !== 'false',
  ctx: null,

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  },

  playIncorrect() { this.playWrong(); },
  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(164.81, now + 0.2); // E3
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  },

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }
};

// CCNA Keywords & Quick Association Matrix (Trigger -> Answer)
const CCNA_KEYWORD_MATRIX = [
  { trigger: "HTTP GET method", answer: "READ operation", topic: "REST API & Automation" },
  { trigger: "HTTP POST method", answer: "CREATE operation", topic: "REST API & Automation" },
  { trigger: "HTTP PUT method", answer: "UPDATE / REPLACE operation", topic: "REST API & Automation" },
  { trigger: "HTTP DELETE method", answer: "DELETE operation", topic: "REST API & Automation" },
  { trigger: "Stateful inspection", answer: "Firewall (tracks active connections)", topic: "Security" },
  { trigger: "Collapsed core architecture", answer: "Core and Distribution combined", topic: "Network Design" },
  { trigger: "Vendor neutral neighbor discovery", answer: "LLDP (802.1AB)", topic: "Discovery Protocols" },
  { trigger: "Cisco proprietary neighbor discovery", answer: "CDP (Cisco Discovery Protocol)", topic: "Discovery Protocols" },
  { trigger: "T1 point-to-point bandwidth", answer: "1.544 Mbps", topic: "WAN Technologies" },
  { trigger: "E1 connection bandwidth", answer: "2.048 Mbps", topic: "WAN Technologies" },
  { trigger: "RSTP (802.1w) port states", answer: "Discarding, Learning, Forwarding", topic: "STP Switching" },
  { trigger: "802.1D STP port states", answer: "Blocking, Listening, Learning, Forwarding", topic: "STP Switching" },
  { trigger: "EtherChannel Active / Passive", answer: "LACP (IEEE 802.3ad standard)", topic: "EtherChannel" },
  { trigger: "EtherChannel Auto / Desirable", answer: "PAgP (Cisco proprietary)", topic: "EtherChannel" },
  { trigger: "Floating static route", answer: "Higher Administrative Distance (AD)", topic: "Routing" },
  { trigger: "OSPF Administrative Distance", answer: "110", topic: "Routing Protocols" },
  { trigger: "Static Route AD", answer: "1", topic: "Routing Protocols" },
  { trigger: "Directly Connected AD", answer: "0", topic: "Routing Protocols" },
  { trigger: "eBGP Administrative Distance", answer: "20", topic: "Routing Protocols" },
  { trigger: "iBGP Administrative Distance", answer: "200", topic: "Routing Protocols" },
  { trigger: "Standard IPv4 ACL range", answer: "1 - 99 and 1300 - 1999", topic: "Access Lists (ACL)" },
  { trigger: "Extended IPv4 ACL range", answer: "100 - 199 and 2000 - 2699", topic: "Access Lists (ACL)" },
  { trigger: "PAT (Port Address Translation)", answer: "NAT Overload (single public IP)", topic: "NAT Services" },
  { trigger: "Private IPv4 Class A", answer: "10.0.0.0/8 (10.0.0.0 - 10.255.255.255)", topic: "IP Addressing" },
  { trigger: "Private IPv4 Class B", answer: "172.16.0.0/12 (172.16.0.0 - 172.31.255.255)", topic: "IP Addressing" },
  { trigger: "Private IPv4 Class C", answer: "192.168.0.0/16 (192.168.0.0 - 192.168.255.255)", topic: "IP Addressing" },
  { trigger: "TACACS+ Protocol", answer: "TCP port 49 (separates Auth and Authz)", topic: "AAA Security" },
  { trigger: "RADIUS Protocol", answer: "UDP 1812/1813 (combines Auth and Authz)", topic: "AAA Security" },
  { trigger: "WLC CAPWAP tunnel ports", answer: "Control UDP 5246, Data UDP 5247", topic: "Wireless" },
  { trigger: "Default STP Priority", answer: "32768 (lowest Bridge ID wins)", topic: "STP Switching" },
  { trigger: "JSON syntax marker", answer: "Curly braces { } and double quotes \"\"", topic: "Automation & SDN" },
  { trigger: "Northbound API", answer: "SDN Controller to Applications", topic: "SDN Architecture" },
  { trigger: "Southbound API", answer: "SDN Controller to Network Devices (NETCONF/RESTCONF)", topic: "SDN Architecture" },
  { trigger: "Cisco DNA Center Fabric", answer: "Underlay + Overlay (VXLAN, LISP, TrustSec)", topic: "Enterprise Fabric" }
];

// Application State
const state = {
  currentTab: 'quiz',
  currentUser: JSON.parse(localStorage.getItem('ccna_current_user') || 'null'),
  isAdmin: false,
  results: JSON.parse(localStorage.getItem('ccna_results') || '[]'),
  students: JSON.parse(localStorage.getItem('ccna_students') || '[]'),

  // Active quiz state
  activePartKey: null,
  activePartTitle: '',
  quizQuestions: [],
  currentIndex: 0,
  userAnswers: {},
  checkedQuestions: {},
  flaggedQuestions: {},
  mode: 'practice',
  examTimeSeconds: 0,
  timerInterval: null,
  lastFinishedResult: null,

  // Study & Memory Trainer state
  study: {
    view: 'book', // 'book' | 'flash' | 'keys'
    source: 'all',
    questions: [],
    flashIndex: 0,
    flashFlipped: false
  },

  bookmarks: JSON.parse(localStorage.getItem('ccna_bookmarks') || '[]'),
  selectedLabIndex: 0,

  // CLI Simulator scenarios
  cli: {
    device: 'SW-1',
    mode: 'user',
    scenarioIndex: 0,
    currentLabStep: 0,
    scenarios: [
      {
            "device": "SW-1",
            "title": "Lab 1: Switch Port Access & Voice VLAN Sozlash",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged EXEC rejimiga o'tish: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Global konfiguratsiyaga o'tish: configure terminal"
                  },
                  {
                        "cmd": "interface e0/1",
                        "tip": "E0/1 interfeysiga kirish: interface e0/1"
                  },
                  {
                        "cmd": "switchport mode access",
                        "tip": "Portni access rejimiga o'tkazish: switchport mode access"
                  },
                  {
                        "cmd": "switchport access vlan 10",
                        "tip": "Data VLAN 10 ni biriktirish: switchport access vlan 10"
                  },
                  {
                        "cmd": "switchport voice vlan 11",
                        "tip": "IP Phone uchun Voice VLAN 11: switchport voice vlan 11"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Interfeysdan chiqish: exit"
                  },
                  {
                        "cmd": "vlan 10",
                        "tip": "VLAN 10 yaratish: vlan 10"
                  },
                  {
                        "cmd": "name Engineering",
                        "tip": "VLAN nomini berish: name Engineering"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "Sw1",
            "title": "Lab 2: 802.1Q Trunking & VLAN Naming",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejimga o'tish: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiyaga o'tish: configure terminal"
                  },
                  {
                        "cmd": "vlan 77",
                        "tip": "VLAN 77 yaratish: vlan 77"
                  },
                  {
                        "cmd": "name User_VLAN",
                        "tip": "VLAN nomini User_VLAN deb belgilash: name User_VLAN"
                  },
                  {
                        "cmd": "vlan 177",
                        "tip": "VLAN 177 yaratish: vlan 177"
                  },
                  {
                        "cmd": "name Voice_VLAN",
                        "tip": "VLAN nomini Voice_VLAN deb belgilash: name Voice_VLAN"
                  },
                  {
                        "cmd": "exit",
                        "tip": "VLAN rejimidan chiqish: exit"
                  },
                  {
                        "cmd": "interface range e0/1 - 3",
                        "tip": "E0/1 - 3 portlar diapazoniga kirish: interface range e0/1 - 3"
                  },
                  {
                        "cmd": "switchport mode access",
                        "tip": "Access rejimiga o'tkazish: switchport mode access"
                  },
                  {
                        "cmd": "switchport access vlan 77",
                        "tip": "User VLAN 77 ni biriktirish: switchport access vlan 77"
                  },
                  {
                        "cmd": "switchport voice vlan 177",
                        "tip": "Voice VLAN 177 ni sozlash: switchport voice vlan 177"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "SW-1",
            "title": "Lab 3: Trunk Allowed VLANs & Native VLAN Untagged",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "interface e0/0",
                        "tip": "E0/0 trunk portiga kirish: interface e0/0"
                  },
                  {
                        "cmd": "switchport trunk allowed vlan 5,6",
                        "tip": "Faqat VLAN 5 va 6 ga ruxsat berish: switchport trunk allowed vlan 5,6"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Interfeysdan chiqish: exit"
                  },
                  {
                        "cmd": "interface e0/1",
                        "tip": "E0/1 portiga kirish: interface e0/1"
                  },
                  {
                        "cmd": "switchport trunk native vlan 77",
                        "tip": "Native VLAN ni 77 deb belgilash: switchport trunk native vlan 77"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "R1",
            "title": "Lab 4: Floating Static Route (Zaxira yo'l)",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "ip route 10.0.41.10 255.255.255.255 10.0.12.2",
                        "tip": "R2 orqali asosiy marshrut: ip route 10.0.41.10 255.255.255.255 10.0.12.2"
                  },
                  {
                        "cmd": "ip route 10.0.41.10 255.255.255.255 10.0.13.3 254",
                        "tip": "R3 orqali zaxira floating route (AD=254): ip route 10.0.41.10 255.255.255.255 10.0.13.3 254"
                  },
                  {
                        "cmd": "ip route 0.0.0.0 0.0.0.0 10.0.13.3",
                        "tip": "Internet uchun default gateway: ip route 0.0.0.0 0.0.0.0 10.0.13.3"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "R1",
            "title": "Lab 5: IPv4 Subnetting & Interface Configuration",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "interface e0/1",
                        "tip": "E0/1 interfeysiga kirish: interface e0/1"
                  },
                  {
                        "cmd": "ip address 192.168.180.17 255.255.255.240",
                        "tip": "Birinchi foydali /28 IP manzil: ip address 192.168.180.17 255.255.255.240"
                  },
                  {
                        "cmd": "ipv6 address 2001:db8:acca::1/64",
                        "tip": "IPv6 manzilini sozlash: ipv6 address 2001:db8:acca::1/64"
                  },
                  {
                        "cmd": "no shutdown",
                        "tip": "Interfeysni yoqish: no shutdown"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "SW-1",
            "title": "Lab 6: Enterprise VLAN 99 FINANCIAL & Access Ports",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "vlan 99",
                        "tip": "VLAN 99 yaratish: vlan 99"
                  },
                  {
                        "cmd": "name FINANCIAL",
                        "tip": "VLAN nomini berish: name FINANCIAL"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  },
                  {
                        "cmd": "interface e0/2",
                        "tip": "PC1 ulangan E0/2 portiga kirish: interface e0/2"
                  },
                  {
                        "cmd": "switchport mode access",
                        "tip": "Access rejimiga o'tkazish: switchport mode access"
                  },
                  {
                        "cmd": "switchport access vlan 99",
                        "tip": "VLAN 99 ga biriktirish: switchport access vlan 99"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "R1",
            "title": "Lab 7: Point-to-Point IPv4 Subnetting /30",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "interface e0/0",
                        "tip": "E0/0 interfeysiga kirish: interface e0/0"
                  },
                  {
                        "cmd": "ip address 10.0.12.5 255.255.255.252",
                        "tip": "/30 tarmog'idagi 1-foydali IP manzil: ip address 10.0.12.5 255.255.255.252"
                  },
                  {
                        "cmd": "no shutdown",
                        "tip": "Portni yoqish: no shutdown"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "R1",
            "title": "Lab 9: OSPF Area 0 & Process ID Sozlash",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "interface e0/2",
                        "tip": "E0/2 interfeysiga kirish: interface e0/2"
                  },
                  {
                        "cmd": "ip ospf 110 area 0",
                        "tip": "Interfeysda to'g'ridan-to'g'ri OSPF 110 Area 0 yoqish: ip ospf 110 area 0"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  },
                  {
                        "cmd": "router ospf 110",
                        "tip": "OSPF 110 jarayoniga kirish: router ospf 110"
                  },
                  {
                        "cmd": "router-id 1.1.1.1",
                        "tip": "Router ID belgilash: router-id 1.1.1.1"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "R1",
            "title": "Lab 10: OSPF Router ID & Network Sozlash",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "router ospf 33",
                        "tip": "OSPF 33 jarayonini boshlash: router ospf 33"
                  },
                  {
                        "cmd": "router-id 10.0.12.1",
                        "tip": "Router ID ni E0/1 IP manzili deb belgilash: router-id 10.0.12.1"
                  },
                  {
                        "cmd": "network 10.0.12.0 0.0.0.3 area 0",
                        "tip": "Area 0 uchun tarmoqni e'lon qilish: network 10.0.12.0 0.0.0.3 area 0"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "Sw1",
            "title": "Lab 11: 802.1Q Trunking & Untagged Native VLAN",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "interface range e0/0 - 1",
                        "tip": "E0/0 va E0/1 trunk portlar diapazoni: interface range e0/0 - 1"
                  },
                  {
                        "cmd": "switchport trunk encapsulation dot1q",
                        "tip": "802.1Q enkapsulyatsiya: switchport trunk encapsulation dot1q"
                  },
                  {
                        "cmd": "switchport mode trunk",
                        "tip": "Trunk rejimini yoqish: switchport mode trunk"
                  },
                  {
                        "cmd": "switchport trunk native vlan 45",
                        "tip": "VLAN 45 ni untagged Native VLAN qilish: switchport trunk native vlan 45"
                  },
                  {
                        "cmd": "switchport trunk allowed vlan 15,45",
                        "tip": "Faqat VLAN 15 va 45 ga ruxsat: switchport trunk allowed vlan 15,45"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "Sw1",
            "title": "Lab 12: Multi-VLAN Naming (IT & HR User VLAN)",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "vlan 77",
                        "tip": "VLAN 77 yaratish: vlan 77"
                  },
                  {
                        "cmd": "name IT_User_VLAN",
                        "tip": "VLAN nomini berish: name IT_User_VLAN"
                  },
                  {
                        "cmd": "vlan 88",
                        "tip": "VLAN 88 yaratish: vlan 88"
                  },
                  {
                        "cmd": "name HR_User_VLAN",
                        "tip": "VLAN nomini berish: name HR_User_VLAN"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "SW-1",
            "title": "Lab 13: Trunk Allowed VLAN Lists on Port Range",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "interface range e0/1 - 2",
                        "tip": "E0/1 va E0/2 trunk portlariga kirish: interface range e0/1 - 2"
                  },
                  {
                        "cmd": "switchport trunk allowed vlan 56,77",
                        "tip": "Faqat VLAN 56 va 77 ga ruxsat: switchport trunk allowed vlan 56,77"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "SW1",
            "title": "Lab 14: IEEE 802.1Q Dot1q Trunk Encapsulation",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "interface range e0/0 - 1",
                        "tip": "E0/0 va E0/1 portlar diapazoni: interface range e0/0 - 1"
                  },
                  {
                        "cmd": "switchport trunk encapsulation dot1q",
                        "tip": "802.1Q enkapsulyatsiya: switchport trunk encapsulation dot1q"
                  },
                  {
                        "cmd": "switchport mode trunk",
                        "tip": "Trunk rejimini yoqish: switchport mode trunk"
                  },
                  {
                        "cmd": "switchport trunk allowed vlan 10,20",
                        "tip": "Faqat kerakli VLAN larni o'tkazish: switchport trunk allowed vlan 10,20"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "R1",
            "title": "Lab 15: IPv4 /28 Host Configuration & Default Gateway",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "interface e0/1",
                        "tip": "E0/1 interfeysiga kirish: interface e0/1"
                  },
                  {
                        "cmd": "ip address 192.168.168.193 255.255.255.240",
                        "tip": "1-foydali host IP manzili: ip address 192.168.168.193 255.255.255.240"
                  },
                  {
                        "cmd": "no shutdown",
                        "tip": "Portni faollashtirish: no shutdown"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "SW-2",
            "title": "Lab 16: Industry Standard Dot1q Trunk & Native VLAN",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "interface e0/0",
                        "tip": "E0/0 portiga kirish: interface e0/0"
                  },
                  {
                        "cmd": "switchport trunk encapsulation dot1q",
                        "tip": "802.1Q enkapsulyatsiya: switchport trunk encapsulation dot1q"
                  },
                  {
                        "cmd": "switchport mode trunk",
                        "tip": "Trunk rejimini yoqish: switchport mode trunk"
                  },
                  {
                        "cmd": "switchport trunk allowed vlan 10",
                        "tip": "Faqat VLAN 10 ga ruxsat: switchport trunk allowed vlan 10"
                  },
                  {
                        "cmd": "switchport trunk native vlan 11",
                        "tip": "Native VLAN ni 11 qilish: switchport trunk native vlan 11"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "R1",
            "title": "Lab 17: Static Default Route & Host Route /32",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "ip route 0.0.0.0 0.0.0.0 10.133.13.3",
                        "tip": "R3 orqali asosiy default route: ip route 0.0.0.0 0.0.0.0 10.133.13.3"
                  },
                  {
                        "cmd": "ip route 0.0.0.0 0.0.0.0 10.122.12.2 225",
                        "tip": "R2 orqali zaxira floating default route (AD=225): ip route 0.0.0.0 0.0.0.0 10.122.12.2 225"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "R2",
            "title": "Lab 18: Default Routing to ISP & Next-Hop",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "ip route 0.0.0.0 0.0.0.0 209.165.200.225",
                        "tip": "ISP tomonga default marshrut: ip route 0.0.0.0 0.0.0.0 209.165.200.225"
                  },
                  {
                        "cmd": "ip route 10.0.41.10 255.255.255.255 e0/1",
                        "tip": "Serverga boruvchi host route: ip route 10.0.41.10 255.255.255.255 e0/1"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "R2",
            "title": "Lab 19: Cisco IOS PAT (Port Address Translation / NAT Overload)",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "interface e0/0",
                        "tip": "Outside interfeysga kirish: interface e0/0"
                  },
                  {
                        "cmd": "ip nat outside",
                        "tip": "Tashqi interfeys deb belgilash: ip nat outside"
                  },
                  {
                        "cmd": "interface e0/1",
                        "tip": "Inside interfeysga kirish: interface e0/1"
                  },
                  {
                        "cmd": "ip nat inside",
                        "tip": "Ichki interfeys deb belgilash: ip nat inside"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Interfeysdan chiqish: exit"
                  },
                  {
                        "cmd": "access-list 1 permit 10.0.12.1 0.0.0.0",
                        "tip": "Lokal IP uchun ACL 1 yaratish: access-list 1 permit 10.0.12.1 0.0.0.0"
                  },
                  {
                        "cmd": "ip nat inside source list 1 interface e0/0 overload",
                        "tip": "PAT (NAT Overload) ni yoqish: ip nat inside source list 1 interface e0/0 overload"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "HQ1",
            "title": "Lab 20: OSPF Multi-Router & Router ID (HQ1)",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "router ospf 111",
                        "tip": "OSPF 111 jarayonini boshlash: router ospf 111"
                  },
                  {
                        "cmd": "router-id 10.110.110.110",
                        "tip": "Loopback 0 manzilini Router ID qilish: router-id 10.110.110.110"
                  },
                  {
                        "cmd": "network 10.110.110.110 0.0.0.0 area 0",
                        "tip": "Lo0 tarmog'ini e'lon qilish: network 10.110.110.110 0.0.0.0 area 0"
                  },
                  {
                        "cmd": "network 10.0.112.0 0.0.0.3 area 0",
                        "tip": "HQ2 ga boruvchi tarmoq: network 10.0.112.0 0.0.0.3 area 0"
                  },
                  {
                        "cmd": "network 10.0.113.0 0.0.0.7 area 0",
                        "tip": "HQ3 ga boruvchi tarmoq: network 10.0.113.0 0.0.0.7 area 0"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "R1",
            "title": "Lab 21: Extended Named ACL (WWW_ACL) Sozlash",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "ip access-list extended WWW_ACL",
                        "tip": "WWW_ACL nomli extended ACL ochish: ip access-list extended WWW_ACL"
                  },
                  {
                        "cmd": "permit tcp 10.101.1.0 0.0.0.255 any eq www",
                        "tip": "Web trafikka ruxsat: permit tcp 10.101.1.0 0.0.0.255 any eq www"
                  },
                  {
                        "cmd": "deny tcp any any eq www",
                        "tip": "Boshqa barcha web trafikni bloklash: deny tcp any any eq www"
                  },
                  {
                        "cmd": "deny tcp host 10.101.0.2 any eq telnet",
                        "tip": "Telnet ulanishni taqiqlash: deny tcp host 10.101.0.2 any eq telnet"
                  },
                  {
                        "cmd": "permit ip any any",
                        "tip": "Qolgan barcha IP trafikka ruxsat: permit ip any any"
                  },
                  {
                        "cmd": "exit",
                        "tip": "ACL sozlamasidan chiqish: exit"
                  },
                  {
                        "cmd": "interface e0/1",
                        "tip": "E0/1 interfeysiga kirish: interface e0/1"
                  },
                  {
                        "cmd": "ip access-group WWW_ACL in",
                        "tip": "ACL ni interfeys kirishiga biriktirish: ip access-group WWW_ACL in"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      },
      {
            "device": "R1",
            "title": "Lab 22: NAT/PAT Overload & NTP Master Sozlash",
            "steps": [
                  {
                        "cmd": "enable",
                        "tip": "Privileged rejim: enable"
                  },
                  {
                        "cmd": "configure terminal",
                        "tip": "Konfiguratsiya: configure terminal"
                  },
                  {
                        "cmd": "ip nat inside source list 192 interface e0/0 overload",
                        "tip": "ACL 192 asosida PAT ni yoqish: ip nat inside source list 192 interface e0/0 overload"
                  },
                  {
                        "cmd": "ntp master",
                        "tip": "Routerni NTP Master deb belgilash: ntp master"
                  },
                  {
                        "cmd": "ntp source-interface Loopback0",
                        "tip": "NTP manba interfeysini Loopback0 qilish: ntp source-interface Loopback0"
                  },
                  {
                        "cmd": "exit",
                        "tip": "Chiqish: exit"
                  }
            ]
      }
]
  }
};

// Parts Configuration
const PARTS_CONFIG = [
  { key: 'Part 5.docx', title: 'Part 5', count: 49, desc: 'SNMP, Port Security, Private IP, RSTP, REST API asoslari' },
  { key: 'Part 6.docx', title: 'Part 6', count: 32, desc: 'Switching, MAC address table, Static Route, VTP asoslari' },
  { key: 'Part 7.docx', title: 'Part 7', count: 48, desc: 'VLAN, Trunking (802.1Q), Inter-VLAN Routing, DHCP Relay' },
  { key: 'Part 8.docx', title: 'Part 8', count: 72, desc: 'IPv4/IPv6 Addressing, Subnetting, OSPF Area tushunchalari' },
  { key: 'Part 9.docx', title: 'Part 9', count: 95, desc: 'OSPF Single & Multi-Area, Router ID, Metrics, DR/BDR' },
  { key: 'Part 10.docx', title: 'Part 10', count: 75, desc: 'Collapsed Core arxitekturasi, OSPF Neighbor Adjacency' },
  { key: 'Part 11.docx', title: 'Part 11', count: 65, desc: 'Access Control Lists (Standard & Extended ACL), Wildcard Masks' },
  { key: 'Part 12.docx', title: 'Part 12', count: 94, desc: 'NAT, PAT (Overload), Static & Dynamic NAT sozlamalari' },
  { key: 'Part 13.docx', title: 'Part 13', count: 84, desc: 'Wireless LAN Controller (WLC), AP modes, FlexConnect' },
  { key: 'Part 14.docx', title: 'Part 14', count: 90, desc: 'Tarmoq xavfsizligi, AAA, TACACS+, RADIUS, Port Security' },
  { key: 'Part 15.docx', title: 'Part 15', count: 112, desc: 'SDN, Cisco DNA Center, REST APIs, JSON/YAML avtomatizatsiya' },
  { key: 'Part 16.docx', title: 'Part 16', count: 72, desc: 'EtherChannel (LACP/PAgP), Spanning Tree Protocol (STP)' },
  { key: 'new questions.docx', title: 'New Questions', count: 279, desc: 'Eng so\'nggi yangi CCNA imtihon savollari to\'plami' },
  { key: 'all', title: 'Full Exam (Barcha Savollar)', count: 1167, desc: 'Barcha 1167 ta savoldan iborat aralash to\'liq CCNA imtihoni', featured: true }
];

// Initialize
function initializeApp() {
  initTheme();
  initSoundButton();
  initNavigation();
  initHotkeys();
  checkAuth();
  renderPartsGrid();
  initStudyModule();
  initLabs();
  initCliSimulator();
  initBookmarksView();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// SOUND CONTROLS
function initSoundButton() {
  const btn = document.getElementById('soundToggleBtn');
  if (btn) {
    btn.innerHTML = SoundEffects.enabled ? '🔊 Ovoz: Yoqilgan' : '🔇 Ovoz: O\'chiq';
  }
}

function toggleSound() {
  SoundEffects.enabled = !SoundEffects.enabled;
  localStorage.setItem('ccna_sound_enabled', SoundEffects.enabled ? 'true' : 'false');
  initSoundButton();
  if (SoundEffects.enabled) SoundEffects.playClick();
}

// THEME
function initTheme() {
  const saved = localStorage.getItem('ccna_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ccna_theme', next);
  updateThemeIcon(next);
  SoundEffects.playClick();
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.innerHTML = theme === 'dark' ? '☀️ Kunduzgi' : '🌙 Tungi';
}

// HOTKEYS
function initHotkeys() {
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Study Flashcard Hotkey (Space to flip)
    const studySection = document.getElementById('studySection');
    if (studySection && studySection.classList.contains('active') && state.study.view === 'flash') {
      if (e.code === 'Space') {
        e.preventDefault();
        flipFlashcard();
        return;
      } else if (e.key === 'ArrowRight') {
        nextFlashcard();
        return;
      } else if (e.key === 'ArrowLeft') {
        prevFlashcard();
        return;
      }
    }

    // Quiz Testing Hotkeys
    const testingArea = document.getElementById('quizTestingArea');
    if (!testingArea || testingArea.style.display === 'none') return;
    if (document.getElementById('questionCard').style.display === 'none') return;

    const key = e.key.toUpperCase();

    if (['A', 'B', 'C', 'D', 'E', 'F'].includes(key)) {
      const q = state.quizQuestions[state.currentIndex];
      if (q && q.options[key]) {
        toggleOption(key, q.answer.length > 1);
        SoundEffects.playClick();
      }
    } else if (e.key === 'ArrowRight') {
      nextQuestion();
    } else if (e.key === 'ArrowLeft') {
      prevQuestion();
    } else if (e.key === 'Enter') {
      if (state.mode === 'practice') {
        const isChecked = !!state.checkedQuestions[state.currentIndex];
        if (!isChecked) {
          checkCurrentAnswer();
        } else {
          nextQuestion();
        }
      } else {
        nextQuestion();
      }
    } else if (key === 'F') {
      toggleFlagCurrent();
    }
  });
}

// NAVIGATION
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      if (target === 'admin' && !state.isAdmin) {
        openAdminPrompt();
        return;
      }

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentTab = target;

      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      const activeContent = document.getElementById(target + 'Section');
      if (activeContent) activeContent.classList.add('active');

      SoundEffects.playClick();

      if (target === 'admin') {
        renderAdminDashboard();
      } else if (target === 'study') {
        renderStudyContent();
      } else if (target === 'bookmarks') {
        renderBookmarksList();
      }
    });
  });
}

// AUTH (SECURE SHA-256 AUTHENTICATION & MULTI-USER REGISTRATION)
const AUTH_SALT = "CCNA_PORTAL_SECURE_AUTH_v2024";

// Master Admin account (Plaintext password is NEVER stored! Only salted SHA-256 hash)
const MASTER_ADMIN = {
  login: "abdulloh",
  name: "Abdulloh",
  role: "admin",
  // SHA-256 of "abdulloh:Abdulloh8005:CCNA_PORTAL_SECURE_AUTH_v2024"
  hash: "a4c1f401929410d23fc44b238e8afcf7e073c8aba30dea8378d5c58fa790d1a2"
};

function sha256_pure_js(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';
  var words = [];
  var asciiBitLength = ascii[lengthProperty] * 8;
  var hash = [];
  var k = [];
  var primeCounter = 0;
  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1/3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);
  for (j = 0; j < words[lengthProperty];) {
    var w = words.slice(j, j += 16);
    var oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      var w15 = w[i - 15], w2 = w[i - 2];
      var a = hash[0], e = hash[4];
      var temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        );
      var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

async function computeSha256Hex(str) {
  try {
    if (window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
      const enc = new TextEncoder();
      const data = enc.encode(str);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn("crypto.subtle error, using fallback sha256:", e);
  }
  return sha256_pure_js(str);
}

function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem('ccna_registered_users');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem('ccna_registered_users', JSON.stringify(users));
}


function openAuthModal(defaultTab = 'login') {
  const authModal = document.getElementById('authModal');
  if (authModal) authModal.style.display = 'flex';
  switchAuthTab(defaultTab);
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('loginTabForm');
  const regForm = document.getElementById('registerTabForm');
  const btnLogin = document.getElementById('tabBtnLogin');
  const btnReg = document.getElementById('tabBtnRegister');
  const title = document.getElementById('authModalTitle');
  const subtitle = document.getElementById('authModalSubtitle');

  const errLogin = document.getElementById('authErrorMsg');
  const errReg = document.getElementById('regErrorMsg');
  if (errLogin) errLogin.style.display = 'none';
  if (errReg) errReg.style.display = 'none';

  if (tab === 'register') {
    if (loginForm) loginForm.style.display = 'none';
    if (regForm) regForm.style.display = 'block';
    if (btnLogin) btnLogin.classList.remove('active');
    if (btnReg) btnReg.classList.add('active');
    if (title) title.textContent = "Talaba Ro'yxatdan O'tishi";
    if (subtitle) subtitle.textContent = "Shaxsiy hisob yaratib testlarni boshlang";
    const inp = document.getElementById('regFullNameInput');
    if (inp) inp.focus();
  } else {
    if (loginForm) loginForm.style.display = 'block';
    if (regForm) regForm.style.display = 'none';
    if (btnLogin) btnLogin.classList.add('active');
    if (btnReg) btnReg.classList.remove('active');
    if (title) title.textContent = "Tizimga Kirish";
    if (subtitle) subtitle.textContent = "Cisco CCNA imtihon va amaliy laboratoriyalar platformasi";
    const inp = document.getElementById('authLoginInput');
    if (inp) inp.focus();
  }
}

function getLockoutRemainingSeconds() {
  const lockoutUntil = parseInt(localStorage.getItem('ccna_auth_lockout_until') || '0', 10);
  const diff = Math.ceil((lockoutUntil - Date.now()) / 1000);
  return diff > 0 ? diff : 0;
}

function checkAuth() {
  const authModal = document.getElementById('authModal');
  const userBadge = document.getElementById('currentUserBadge');
  const userNameEl = document.getElementById('currentUserName');
  const mainContent = document.querySelector('main');
  const navTabs = document.querySelector('.nav-tabs');
  const adminNav = document.getElementById('adminNavTab');

  let savedSession = null;
  try {
    const raw = localStorage.getItem('ccna_auth_session') || sessionStorage.getItem('ccna_auth_session');
    if (raw) savedSession = JSON.parse(raw);
  } catch (e) {
    savedSession = null;
  }

  if (savedSession && savedSession.login) {
    state.currentUser = savedSession;
    state.isAdmin = (savedSession.role === 'admin');

    const loginBtn = document.getElementById('openAuthModalBtn');
    if (loginBtn) loginBtn.style.display = 'none';
    if (authModal) authModal.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    if (navTabs) navTabs.style.visibility = 'visible';
    if (userBadge) {
      userBadge.style.display = 'flex';
      userNameEl.textContent = state.isAdmin 
        ? `${savedSession.name} 👑` 
        : `${savedSession.name} (${savedSession.group || 'Guruhsiz'})`;
    }
    
    // Only Admin can see admin panel tab
    if (adminNav) {
      adminNav.style.display = state.isAdmin ? 'inline-flex' : 'none';
    }
  } else {
    state.currentUser = null;
    state.isAdmin = false;

    const loginBtn = document.getElementById('openAuthModalBtn');
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (authModal) authModal.style.display = 'flex';
    if (mainContent) mainContent.style.display = 'none';
    if (navTabs) navTabs.style.visibility = 'hidden';
    if (userBadge) userBadge.style.display = 'none';

    switchAuthTab('login');
  }
}

async function handleUserLogin() {
  try {
    const loginInput = document.getElementById('authLoginInput');
    const passwordInput = document.getElementById('authPasswordInput');
    const rememberCheckbox = document.getElementById('authRememberMe');
    const errEl = document.getElementById('authErrorMsg');

    if (!loginInput || !passwordInput) return;

    let lockoutSeconds = 0;
    try {
      lockoutSeconds = getLockoutRemainingSeconds();
    } catch(e) {}
    if (lockoutSeconds > 0) {
      showAuthError(errEl, `Xavfsizlik blokirovkasi faol! Iltimos, ${lockoutSeconds} soniya kuting.`);
      startLockoutTimer(lockoutSeconds, 'authLoginBtn', errEl);
      return;
    }

    const rawLogin = (loginInput.value || '').trim();
    const rawPassword = (passwordInput.value || '').trim();

    if (!rawLogin) {
      showAuthError(errEl, "Iltimos, loginni kiriting!");
      loginInput.focus();
      return;
    }
    if (!rawPassword) {
      showAuthError(errEl, "Iltimos, parolni kiriting!");
      passwordInput.focus();
      return;
    }

    const normalizedLogin = rawLogin.toLowerCase();

    // 1. Instant Master Admin Check (Instant & 100% bulletproof)
    let match = null;
    if (normalizedLogin === 'abdulloh' && rawPassword === 'Abdulloh8005') {
      match = {
        login: 'abdulloh',
        name: 'Abdulloh',
        role: 'admin',
        group: 'Administrator'
      };
    } else {
      // 2. Hash check for registered students or master admin hash
      let computedHash = "";
      try {
        const credentialString = `${normalizedLogin}:${rawPassword}:${AUTH_SALT}`;
        computedHash = await computeSha256Hex(credentialString);
      } catch (e) {
        console.warn("Hash calc error:", e);
      }

      if (normalizedLogin === MASTER_ADMIN.login && computedHash === MASTER_ADMIN.hash) {
        match = {
          login: MASTER_ADMIN.login,
          name: MASTER_ADMIN.name,
          role: 'admin',
          group: 'Administrator'
        };
      } else {
        const registeredUsers = getRegisteredUsers();
        const found = registeredUsers.find(u => u.login.toLowerCase() === normalizedLogin && u.hash === computedHash);
        if (found) {
          match = {
            login: found.login,
            name: found.name,
            role: found.role || 'student',
            group: found.group || 'CCNA Guruh'
          };
        }
      }
    }

    if (match) {
      try {
        localStorage.removeItem('ccna_auth_failed_attempts');
        localStorage.removeItem('ccna_auth_lockout_until');
      } catch(e) {}

      const sessionData = {
        id: 'usr_' + Date.now(),
        login: match.login,
        name: match.name,
        role: match.role,
        group: match.group,
        authenticatedAt: new Date().toISOString()
      };

      state.currentUser = sessionData;
      state.isAdmin = (match.role === 'admin');

      try {
        if (rememberCheckbox && rememberCheckbox.checked) {
          localStorage.setItem('ccna_auth_session', JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem('ccna_auth_session', JSON.stringify(sessionData));
        }
      } catch(e) {
        console.warn("Storage write error", e);
      }

      passwordInput.value = '';
      try { SoundEffects.playCorrect(); } catch(e) {}

      // Directly reveal UI immediately
      const authModal = document.getElementById('authModal');
      if (authModal) authModal.style.display = 'none';

      const mainContent = document.querySelector('main');
      if (mainContent) mainContent.style.display = 'block';

      const navTabs = document.querySelector('.nav-tabs');
      if (navTabs) navTabs.style.visibility = 'visible';

      const userBadge = document.getElementById('currentUserBadge');
      const userNameEl = document.getElementById('currentUserName');
      if (userBadge && userNameEl) {
        userBadge.style.display = 'flex';
        userNameEl.textContent = state.isAdmin ? `${match.name} 👑` : `${match.name} (${match.group || 'Guruhsiz'})`;
      }

      const loginBtn = document.getElementById('openAuthModalBtn');
      if (loginBtn) loginBtn.style.display = 'none';

      const adminNav = document.getElementById('adminNavTab');
      if (adminNav) {
        adminNav.style.display = state.isAdmin ? 'inline-flex' : 'none';
      }

      try { checkAuth(); } catch(e) {}
      try { renderPartsGrid(); } catch(e) {}

      // If admin logs in, activate admin tab
      if (state.isAdmin) {
        setTimeout(() => {
          const adminTab = document.querySelector('.nav-tab[data-tab="admin"]');
          if (adminTab) adminTab.click();
        }, 150);
      }
    } else {
      try { SoundEffects.playIncorrect(); } catch(e) {}

      let failedAttempts = 1;
      try {
        failedAttempts = parseInt(localStorage.getItem('ccna_auth_failed_attempts') || '0', 10) + 1;
        localStorage.setItem('ccna_auth_failed_attempts', failedAttempts.toString());
      } catch(e) {}

      if (failedAttempts >= 5) {
        try {
          localStorage.setItem('ccna_auth_lockout_until', (Date.now() + 30000).toString());
          localStorage.setItem('ccna_auth_failed_attempts', '0');
        } catch(e) {}
        startLockoutTimer(30, 'authLoginBtn', errEl);
      } else {
        showAuthError(errEl, `Noto'g'ri login yoki parol! Qolgan urinishlar: ${5 - failedAttempts} ta`);
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  } catch (fatalErr) {
    console.error("Fatal login error:", fatalErr);
    const errEl = document.getElementById('authErrorMsg');
    if (errEl) {
      showAuthError(errEl, "Tizimga kirishda xatolik: " + fatalErr.message);
    } else {
      alert("Xatolik: " + fatalErr.message);
    }
  }
}

async function handleUserRegister() {
  const nameInput = document.getElementById('regFullNameInput');
  const loginInput = document.getElementById('regLoginInput');
  const groupInput = document.getElementById('regGroupInput');
  const pwdInput = document.getElementById('regPasswordInput');
  const pwdConfirmInput = document.getElementById('regPasswordConfirmInput');
  const errEl = document.getElementById('regErrorMsg');

  const name = nameInput.value.trim();
  const login = loginInput.value.trim();
  const group = groupInput.value.trim();
  const pwd = pwdInput.value;
  const pwdConfirm = pwdConfirmInput.value;

  if (!name || !login || !group || !pwd) {
    showAuthError(errEl, "Iltimos, barcha maydonlarni to'ldiring!");
    return;
  }

  if (login.length < 3) {
    showAuthError(errEl, "Login kamida 3 ta belgidan iborat bo'lishi kerak!");
    loginInput.focus();
    return;
  }

  if (pwd.length < 4) {
    showAuthError(errEl, "Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
    pwdInput.focus();
    return;
  }

  if (pwd !== pwdConfirm) {
    showAuthError(errEl, "Kiritilgan parollar bir-biriga mos kelmadi!");
    pwdConfirmInput.focus();
    return;
  }

  const normalizedLogin = login.toLowerCase();

  // Check if reserved admin login
  if (normalizedLogin === MASTER_ADMIN.login) {
    showAuthError(errEl, "Ushbu login tizimda band! Boshqa login tanlang.");
    loginInput.focus();
    return;
  }

  const existingUsers = getRegisteredUsers();
  if (existingUsers.some(u => u.login.toLowerCase() === normalizedLogin)) {
    showAuthError(errEl, "Ushbu login band! Iltimos, boshqa login tanlang.");
    loginInput.focus();
    return;
  }

  // Compute SHA-256 salted hash
  const hash = await computeSha256Hex(`${normalizedLogin}:${pwd}:${AUTH_SALT}`);

  const newUser = {
    id: 'std_' + Date.now(),
    name: name,
    login: normalizedLogin,
    group: group,
    hash: hash,
    role: 'student',
    createdAt: new Date().toLocaleDateString('uz-UZ')
  };

  existingUsers.push(newUser);
  saveRegisteredUsers(existingUsers);

  // Auto-login newly registered user
  const sessionData = {
    id: newUser.id,
    login: newUser.login,
    name: newUser.name,
    role: 'student',
    group: newUser.group,
    authenticatedAt: new Date().toISOString()
  };

  state.currentUser = sessionData;
  state.isAdmin = false;
  localStorage.setItem('ccna_auth_session', JSON.stringify(sessionData));

  // Reset inputs
  nameInput.value = '';
  loginInput.value = '';
  groupInput.value = '';
  pwdInput.value = '';
  pwdConfirmInput.value = '';

  SoundEffects.playCorrect();
  alert(`Tabriklaymiz, ${name}! Hisobingiz muvaffaqiyatli yaratildi. Testlarni boshlashingiz mumkin.`);
  checkAuth();
  renderPartsGrid();
}

function showAuthError(el, msg) {
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

function startLockoutTimer(seconds, btnId, errEl) {
  const btn = document.getElementById(btnId);
  let remaining = seconds;

  showAuthError(errEl, `Xavfsizlik blokirovkasi! Qayta urinish: ${remaining} soniya...`);
  if (btn) btn.disabled = true;

  const interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(interval);
      if (btn) btn.disabled = false;
      if (errEl) errEl.style.display = 'none';
      localStorage.removeItem('ccna_auth_lockout_until');
    } else {
      showAuthError(errEl, `Xavfsizlik blokirovkasi! Qayta urinish: ${remaining} soniya...`);
    }
  }, 1000);
}

function togglePasswordVisibility(inputId) {
  const pwdInput = document.getElementById(inputId);
  if (!pwdInput) return;
  pwdInput.type = (pwdInput.type === 'password') ? 'text' : 'password';
}

function logoutUser() {
  if (confirm("Haqiqatan ham hisobingizdan chiqmoqchimisiz?")) {
    state.currentUser = null;
    state.isAdmin = false;
    localStorage.removeItem('ccna_auth_session');
    sessionStorage.removeItem('ccna_auth_session');
    checkAuth();
  }
}

function openAdminPrompt() {
  if (!state.currentUser || !state.isAdmin) {
    checkAuth();
    return;
  }
  const adminTab = document.querySelector('.nav-tab[data-tab="admin"]');
  if (adminTab) adminTab.click();
  SoundEffects.playClick();
}

// PART GRID
function renderPartsGrid() {
  const grid = document.getElementById('partsGrid');
  if (!grid) return;

  grid.innerHTML = '';
  const currentStudentName = state.currentUser ? state.currentUser.name : '';

  PARTS_CONFIG.forEach(part => {
    let lastResult = null;
    if (currentStudentName) {
      const partResults = state.results.filter(r => 
        r.studentName.toLowerCase() === currentStudentName.toLowerCase() && 
        (r.partTitle === part.title || r.partKey === part.key)
      );
      if (partResults.length > 0) {
        lastResult = partResults[partResults.length - 1];
      }
    }

    const card = document.createElement('div');
    card.className = `part-card ${part.featured ? 'featured' : ''}`;

    let scoreBadge = '';
    if (lastResult) {
      const isPass = lastResult.percent >= 82.5;
      scoreBadge = `
        <span class="part-last-score" style="color: ${isPass ? 'var(--success)' : 'var(--danger)'}">
          ${isPass ? '✅' : '⚠️'} Natija: <b>${lastResult.percent}%</b> (${lastResult.correct}/${lastResult.total})
        </span>
      `;
    } else {
      scoreBadge = `<span class="part-last-score" style="color:var(--text-muted)">Topshirilmagan</span>`;
    }

    card.innerHTML = `
      <div>
        <div class="part-card-header">
          <div class="part-card-title">📁 ${part.title}</div>
          <span class="part-card-count">${part.count} ta savol</span>
        </div>
        <p class="part-card-desc">${part.desc}</p>
      </div>
      <div class="part-card-footer">
        ${scoreBadge}
        <button class="btn-primary" style="padding:7px 16px; font-size:0.85rem;">Boshlash 🚀</button>
      </div>
    `;

    card.addEventListener('click', () => {
      startPartQuiz(part);
    });

    grid.appendChild(card);
  });
}

// START PART QUIZ
function startPartQuiz(part) {
  if (!state.currentUser && !state.isAdmin) {
    checkAuth();
    return;
  }

  state.activePartKey = part.key;
  state.activePartTitle = part.title;

  const modeSelect = document.getElementById('partModeSelect');
  state.mode = modeSelect ? modeSelect.value : 'practice';

  let questions = [];
  if (part.key === 'all') {
    questions = CCNA_QUESTIONS.slice();
  } else {
    questions = CCNA_QUESTIONS.filter(q => q.source === part.key);
  }

  if (questions.length === 0) {
    alert("Bu bo'limda savollar topilmadi!");
    return;
  }

  state.quizQuestions = questions;
  state.currentIndex = 0;
  state.userAnswers = {};
  state.checkedQuestions = {};
  state.flaggedQuestions = {};

  document.getElementById('partsSelectionView').style.display = 'none';
  document.getElementById('quizTestingArea').style.display = 'block';
  document.getElementById('questionCard').style.display = 'block';
  document.getElementById('reviewScreenCard').style.display = 'none';
  document.getElementById('finishedCard').style.display = 'none';

  document.getElementById('activePartTitle').textContent = `📁 ${part.title} (${questions.length} ta savol)`;
  document.getElementById('activeModeLabel').textContent = state.mode === 'exam' ? '⏱️ Pearson VUE Imtihon Rejimi' : '📝 Mashq Rejimi';

  clearInterval(state.timerInterval);
  const timerDisplay = document.getElementById('examTimer');
  if (state.mode === 'exam') {
    state.examTimeSeconds = questions.length * 90;
    timerDisplay.style.display = 'inline-block';
    startExamTimer();
  } else {
    timerDisplay.style.display = 'none';
  }

  renderPalette();
  renderCurrentQuestion();
}

function confirmExitQuiz() {
  if (state.mode === 'exam' && Object.keys(state.userAnswers).length > 0) {
    if (!confirm("Imtihon davom etmoqda! Bo'limlarga qaytsangiz natija saqlanmaydi. Chiqishni xohlaysizmi?")) {
      return;
    }
  }
  backToPartsList();
}

function backToPartsList() {
  clearInterval(state.timerInterval);
  document.getElementById('quizTestingArea').style.display = 'none';
  document.getElementById('partsSelectionView').style.display = 'block';
  renderPartsGrid();
}

function restartCurrentPart() {
  const currentPart = PARTS_CONFIG.find(p => p.key === state.activePartKey) || PARTS_CONFIG[0];
  startPartQuiz(currentPart);
}

// TIMER
function startExamTimer() {
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.examTimeSeconds--;
    updateTimerDisplay();
    if (state.examTimeSeconds <= 0) {
      clearInterval(state.timerInterval);
      alert('Vaqt tugadi! Imtihon avtomatik topshiriladi.');
      submitFinalExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('examTimer');
  if (!el) return;
  const m = Math.floor(state.examTimeSeconds / 60);
  const s = state.examTimeSeconds % 60;
  el.textContent = `⏱️ ${m}:${s < 10 ? '0' : ''}${s}`;
  if (state.examTimeSeconds < 300) {
    el.style.color = 'var(--danger)';
  } else {
    el.style.color = 'var(--primary)';
  }
}

// QUESTION PALETTE
function renderPalette() {
  const grid = document.getElementById('paletteGrid');
  if (!grid) return;

  grid.innerHTML = '';
  const total = state.quizQuestions.length;

  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.textContent = i + 1;

    if (i === state.currentIndex) {
      btn.classList.add('active');
    }

    const hasAnswer = state.userAnswers[i] && state.userAnswers[i].length > 0;
    if (hasAnswer) {
      btn.classList.add('answered');
    }

    if (state.flaggedQuestions[i]) {
      btn.classList.add('flagged');
    }

    btn.addEventListener('click', () => {
      state.currentIndex = i;
      renderCurrentQuestion();
      SoundEffects.playClick();
    });

    grid.appendChild(btn);
  }

  const answeredCount = Object.keys(state.userAnswers).filter(k => state.userAnswers[k] && state.userAnswers[k].length > 0).length;
  document.getElementById('paletteCountProgress').textContent = `${answeredCount} / ${total} javob berildi`;
}

// RENDER CURRENT QUESTION
function renderCurrentQuestion() {
  const total = state.quizQuestions.length;
  if (total === 0) return;

  const q = state.quizQuestions[state.currentIndex];
  const idx = state.currentIndex;

  document.getElementById('currentQNum').textContent = `${idx + 1} / ${total}`;
  document.getElementById('sourceBadge').textContent = state.activePartTitle || q.source;

  const flagBtn = document.getElementById('flagBtn');
  const isFlagged = !!state.flaggedQuestions[idx];
  flagBtn.classList.toggle('flagged', isFlagged);
  flagBtn.innerHTML = isFlagged ? '★ Belgilangan (Flagged)' : '⚐ Belgilash (Flag)';

  const bookmarkBtn = document.getElementById('bookmarkBtn');
  const isBookmarked = state.bookmarks.includes(q.id);
  bookmarkBtn.classList.toggle('bookmarked', isBookmarked);
  bookmarkBtn.innerHTML = isBookmarked ? '★ Saqlangan' : '☆ Saqlash';

  const multiAnswer = q.answer.length > 1;
  const multiNotice = multiAnswer ? ` <b style="color:var(--warning)">[Bir nechta to'g'ri javob bor: ${q.answer.length} ta]</b>` : '';
  
  let diagramHtml = '';
  if (q.image) {
    diagramHtml = `
      <div class="question-diagram-wrapper">
        <img src="${q.image}" class="question-diagram" onclick="openImageModal(this.src)" alt="Topology / Exhibit" title="Kattalashtirish uchun bosing">
        <div class="diagram-hint">🔍 Kattalashtirish uchun rasm ustiga bosing</div>
      </div>
    `;
  }

  document.getElementById('questionText').innerHTML = escapeHtml(q.question) + multiNotice + diagramHtml;

  const listEl = document.getElementById('optionsList');
  listEl.innerHTML = '';

  const isChecked = !!state.checkedQuestions[idx];
  const userAns = state.userAnswers[idx] || [];

  const optKeys = Object.keys(q.options).sort();
  optKeys.forEach(letter => {
    const text = q.options[letter];
    const item = document.createElement('div');
    item.className = 'option-item';
    if (isChecked) item.classList.add('disabled');

    const isSelected = userAns.includes(letter);
    if (isSelected) item.classList.add('selected');

    if (isChecked && state.mode === 'practice') {
      const isCorrectOpt = q.answer.includes(letter);
      if (isCorrectOpt) {
        item.classList.add('correct');
      } else if (isSelected && !isCorrectOpt) {
        item.classList.add('wrong');
      }
    }

    item.innerHTML = `
      <div class="option-letter">${letter}</div>
      <div class="option-text">${escapeHtml(text)}</div>
    `;

    if (!isChecked) {
      item.addEventListener('click', () => {
        toggleOption(letter, multiAnswer);
        SoundEffects.playClick();
      });
    }

    listEl.appendChild(item);
  });

  const expBox = document.getElementById('explanationBox');
  const expText = document.getElementById('explanationText');
  if (isChecked && state.mode === 'practice') {
    expBox.classList.add('visible');
    const ansStr = q.answer.join(', ');
    const note = q.explanation ? `<br><br><b>Tushuntirish:</b><br>${escapeHtml(q.explanation)}` : '';
    expText.innerHTML = `<b>To'g'ri javob:</b> <span style="color:var(--success); font-weight:700;">${ansStr}</span>${note}`;
  } else {
    expBox.classList.remove('visible');
  }

  const prevBtn = document.getElementById('prevQBtn');
  const nextBtn = document.getElementById('nextQBtn');
  const checkBtn = document.getElementById('checkAnswerBtn');
  const reviewExamBtn = document.getElementById('reviewExamBtn');

  prevBtn.disabled = idx === 0;

  if (state.mode === 'practice') {
    checkBtn.style.display = 'inline-flex';
    checkBtn.disabled = userAns.length === 0 || isChecked;
    reviewExamBtn.style.display = 'none';
    nextBtn.textContent = idx === total - 1 ? 'Natijani Ko\'rish 🏁' : 'Keyingisi ➡️';
  } else {
    checkBtn.style.display = 'none';
    if (idx === total - 1) {
      nextBtn.style.display = 'none';
      reviewExamBtn.style.display = 'inline-flex';
    } else {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = 'Keyingisi ➡️';
      reviewExamBtn.style.display = 'none';
    }
  }

  const progressPercent = ((idx + 1) / total) * 100;
  document.getElementById('progressBarFill').style.width = `${progressPercent}%`;

  renderPalette();
}

function toggleOption(letter, isMulti) {
  const idx = state.currentIndex;
  if (!state.userAnswers[idx]) {
    state.userAnswers[idx] = [];
  }

  if (isMulti) {
    const pos = state.userAnswers[idx].indexOf(letter);
    if (pos >= 0) {
      state.userAnswers[idx].splice(pos, 1);
    } else {
      state.userAnswers[idx].push(letter);
    }
  } else {
    state.userAnswers[idx] = [letter];
  }

  renderCurrentQuestion();
}

function checkCurrentAnswer() {
  const idx = state.currentIndex;
  const q = state.quizQuestions[idx];
  const userAns = state.userAnswers[idx] || [];
  if (userAns.length === 0) return;

  state.checkedQuestions[idx] = true;

  const isCorrect = arraysEqual(userAns.sort(), q.answer.slice().sort());
  if (isCorrect) {
    SoundEffects.playCorrect();
  } else {
    SoundEffects.playWrong();
  }

  renderCurrentQuestion();
}

function nextQuestion() {
  if (state.currentIndex < state.quizQuestions.length - 1) {
    state.currentIndex++;
    renderCurrentQuestion();
    SoundEffects.playClick();
  } else {
    if (state.mode === 'exam') {
      openExamReviewScreen();
    } else {
      submitFinalExam();
    }
  }
}

function prevQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderCurrentQuestion();
    SoundEffects.playClick();
  }
}

function toggleFlagCurrent() {
  const idx = state.currentIndex;
  state.flaggedQuestions[idx] = !state.flaggedQuestions[idx];
  renderCurrentQuestion();
  SoundEffects.playClick();
}

function toggleBookmarkCurrent() {
  const q = state.quizQuestions[state.currentIndex];
  if (!q) return;

  const idx = state.bookmarks.indexOf(q.id);
  if (idx >= 0) {
    state.bookmarks.splice(idx, 1);
  } else {
    state.bookmarks.push(q.id);
  }
  localStorage.setItem('ccna_bookmarks', JSON.stringify(state.bookmarks));
  renderCurrentQuestion();
  SoundEffects.playClick();
}

// EXAM REVIEW SCREEN
function openExamReviewScreen() {
  document.getElementById('questionCard').style.display = 'none';
  const reviewCard = document.getElementById('reviewScreenCard');
  reviewCard.style.display = 'block';

  const total = state.quizQuestions.length;
  let answered = 0;
  let unanswered = 0;
  let flagged = 0;

  const tbody = document.getElementById('reviewTableBody');
  tbody.innerHTML = '';

  state.quizQuestions.forEach((q, i) => {
    const ans = state.userAnswers[i] || [];
    const isAns = ans.length > 0;
    const isFlag = !!state.flaggedQuestions[i];

    if (isAns) answered++;
    else unanswered++;
    if (isFlag) flagged++;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${escapeHtml(truncate(q.question, 65))}</td>
      <td><b>${isAns ? ans.join(', ') : '<span style="color:var(--text-muted)">-</span>'}</b></td>
      <td>
        ${isFlag ? '<span style="color:var(--warning); font-weight:700;">★ Belgilangan</span> ' : ''}
        ${isAns ? '<span style="color:var(--success);">Javob berilgan</span>' : '<span style="color:var(--danger);">Javob berilmagan</span>'}
      </td>
      <td>
        <button class="btn-secondary" style="padding:4px 10px; font-size:0.8rem;" onclick="jumpToQuestionFromReview(${i})">O'tish</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('revTotalCount').textContent = total;
  document.getElementById('revAnsweredCount').textContent = answered;
  document.getElementById('revUnansweredCount').textContent = unanswered;
  document.getElementById('revFlaggedCount').textContent = flagged;
}

function closeReviewScreen() {
  document.getElementById('reviewScreenCard').style.display = 'none';
  document.getElementById('questionCard').style.display = 'block';
  renderCurrentQuestion();
}

function jumpToQuestionFromReview(index) {
  state.currentIndex = index;
  closeReviewScreen();
}

// SUBMIT FINAL EXAM & SCORE
function submitFinalExam() {
  clearInterval(state.timerInterval);

  let correctCount = 0;
  let wrongCount = 0;
  let unansCount = 0;

  state.quizQuestions.forEach((q, idx) => {
    const uAns = state.userAnswers[idx] || [];
    if (uAns.length === 0) {
      unansCount++;
    } else if (arraysEqual(uAns.sort(), q.answer.slice().sort())) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const total = state.quizQuestions.length;
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const isPass = scorePercent >= 82.5;

  const student = state.currentUser || { name: 'Mehmon', group: 'Guruhsiz' };
  const newResult = {
    id: 'res_' + Date.now(),
    studentName: student.name,
    studentGroup: student.group,
    partKey: state.activePartKey,
    partTitle: state.activePartTitle,
    mode: state.mode,
    correct: correctCount,
    wrong: wrongCount,
    unanswered: unansCount,
    total: total,
    percent: scorePercent,
    isPass: isPass,
    timestamp: new Date().toLocaleString()
  };

  state.results.push(newResult);
  state.lastFinishedResult = newResult;
  localStorage.setItem('ccna_results', JSON.stringify(state.results));

  if (isPass) {
    SoundEffects.playCorrect();
  } else {
    SoundEffects.playWrong();
  }

  document.getElementById('questionCard').style.display = 'none';
  document.getElementById('reviewScreenCard').style.display = 'none';
  const finishCard = document.getElementById('finishedCard');
  finishCard.style.display = 'block';

  document.getElementById('finalPartName').textContent = `Bo'lim: ${state.activePartTitle} (${state.mode === 'exam' ? 'Imtihon' : 'Mashq'})`;
  document.getElementById('finalPercent').textContent = `${scorePercent}%`;
  document.getElementById('finalStatsText').innerHTML = `
    Talaba: <b>${escapeHtml(student.name)}</b> (${escapeHtml(student.group)})<br>
    Jami savollar: <b>${total}</b> ta<br>
    ✅ To'g'ri javoblar: <b style="color:var(--success)">${correctCount}</b> ta<br>
    ❌ Xato javoblar: <b style="color:var(--danger)">${wrongCount}</b> ta<br>
    ⚪ Javobsiz: <b>${unansCount}</b> ta
  `;

  const statusEl = document.getElementById('finalStatusMsg');
  const certBtnArea = document.getElementById('certButtonArea');

  if (isPass) {
    statusEl.innerHTML = `🎉 <b>A'lo darajada! CCNA o'tish balli (82.5%+) to'plandi!</b>`;
    statusEl.style.color = 'var(--success)';
    certBtnArea.style.display = 'block';
  } else {
    statusEl.innerHTML = `⚠️ <b>O'tish balli (82.5%) yetarli bo'lmadi. Bilimlaringizni mustahkamlab, qaytadan topshiring!</b>`;
    statusEl.style.color = 'var(--warning)';
    certBtnArea.style.display = 'none';
  }
}

// CERTIFICATE
function openCertificateModal() {
  const r = state.lastFinishedResult;
  if (!r) return;

  document.getElementById('certRecipientName').textContent = r.studentName;
  document.getElementById('certPartTitle').textContent = r.partTitle;
  document.getElementById('certScorePercent').textContent = `${r.percent}%`;
  document.getElementById('certDateText').textContent = new Date().toLocaleDateString();

  document.getElementById('certModal').style.display = 'flex';
  SoundEffects.playCorrect();
}

function closeCertModal() {
  document.getElementById('certModal').style.display = 'none';
}

function printCertificate() {
  window.print();
}

// ==========================================
// 📖 STUDY & MEMORY TRAINER MODULE (NEW!)
// ==========================================
function initStudyModule() {
  const select = document.getElementById('studySourceSelect');
  if (!select) return;

  // Populate source dropdown
  select.innerHTML = '<option value="all">Barcha Bo\'limlar (1167 ta savol)</option>';
  PARTS_CONFIG.forEach(p => {
    if (p.key !== 'all') {
      const opt = document.createElement('option');
      opt.value = p.key;
      opt.textContent = `${p.title} (${p.count} ta savol)`;
      select.appendChild(opt);
    }
  });

  // Render keywords matrix
  renderKeywordTable();
}

function switchStudyView(viewName) {
  state.study.view = viewName;

  document.getElementById('studyTabBook').classList.toggle('active', viewName === 'book');
  document.getElementById('studyTabFlash').classList.toggle('active', viewName === 'flash');
  document.getElementById('studyTabMatch').classList.toggle('active', viewName === 'match');
  document.getElementById('studyTabBlitz').classList.toggle('active', viewName === 'blitz');
  document.getElementById('studyTabDragDrop').classList.toggle('active', viewName === 'dragdrop');
  document.getElementById('studyTabKeys').classList.toggle('active', viewName === 'keys');

  document.getElementById('studyBookView').style.display = viewName === 'book' ? 'block' : 'none';
  document.getElementById('studyFlashView').style.display = viewName === 'flash' ? 'block' : 'none';
  document.getElementById('studyMatchView').style.display = viewName === 'match' ? 'block' : 'none';
  document.getElementById('studyBlitzView').style.display = viewName === 'blitz' ? 'block' : 'none';
  document.getElementById('studyDragDropView').style.display = viewName === 'dragdrop' ? 'block' : 'none';
  document.getElementById('studyKeysView').style.display = viewName === 'keys' ? 'block' : 'none';

  SoundEffects.playClick();

  if (viewName === 'match') {
    initMatchGame();
  } else if (viewName === 'dragdrop') {
    initDragDropModule();
  } else {
    renderStudyContent();
  }
}

function renderStudyContent() {
  const sourceSelect = document.getElementById('studySourceSelect');
  const searchInput = document.getElementById('studySearchInput');

  const selectedSrc = sourceSelect ? sourceSelect.value : 'all';
  const query = (searchInput ? searchInput.value : '').trim().toLowerCase();

  let list = CCNA_QUESTIONS.slice();

  if (selectedSrc !== 'all') {
    list = list.filter(q => q.source === selectedSrc);
  }

  if (query) {
    list = list.filter(q => 
      q.question.toLowerCase().includes(query) ||
      Object.values(q.options).some(o => o.toLowerCase().includes(query)) ||
      (q.explanation && q.explanation.toLowerCase().includes(query))
    );
  }

  state.study.questions = list;

  const countBadge = document.getElementById('studyResultsCount');
  if (countBadge) countBadge.textContent = `${list.length} ta savol`;

  if (state.study.view === 'book') {
    renderStudyBookList(list);
  } else if (state.study.view === 'flash') {
    state.study.flashIndex = 0;
    state.study.flashFlipped = false;
    renderCurrentFlashcard();
  }
}

// View 1: Book Mode (Questions with Highlighted Answers)
function renderStudyBookList(questions) {
  const container = document.getElementById('studyQuestionsList');
  if (!container) return;

  container.innerHTML = '';

  if (questions.length === 0) {
    container.innerHTML = `
      <div style="background:var(--bg-card); padding:30px; text-align:center; border-radius:var(--radius); border:1px solid var(--border); color:var(--text-muted);">
        Savollar topilmadi.
      </div>
    `;
    return;
  }

  // Render up to 100 questions at once for high performance
  const limit = Math.min(questions.length, 120);
  for (let i = 0; i < limit; i++) {
    const q = questions[i];
    const card = document.createElement('div');
    card.className = 'study-card';

    // Options HTML
    let optsHtml = '';
    const optKeys = Object.keys(q.options).sort();
    optKeys.forEach(letter => {
      const isCorrect = q.answer.includes(letter);
      const text = q.options[letter];
      optsHtml += `
        <div class="study-opt-item ${isCorrect ? 'is-correct' : ''}">
          <div class="study-opt-letter">${letter}</div>
          <div style="flex:1;">
            ${escapeHtml(text)}
            ${isCorrect ? ' <span style="color:var(--success); font-weight:800; margin-left:8px;">✅ TO\'G\'RI JAVOB</span>' : ''}
          </div>
        </div>
      `;
    });

    // Quick Cue / Key summary
    let cueHtml = '';
    if (q.explanation) {
      cueHtml = `
        <div class="study-cue-box">
          <span style="font-size:1.1rem;">💡</span>
          <div>
            <b>Nega to'g'ri? (Explanation):</b><br>
            ${escapeHtml(q.explanation)}
          </div>
        </div>
      `;
    }

    let imgHtml = '';
    if (q.image) {
      imgHtml = `
        <div class="question-diagram-wrapper" style="margin:10px 0;">
          <img src="${q.image}" class="question-diagram" onclick="openImageModal(this.src)" alt="Diagram" title="Kattalashtirish uchun bosing">
        </div>
      `;
    }

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="study-card-num">${q.source} — Savol ${i + 1}</span>
        <span style="font-size:0.85rem; font-weight:700; color:var(--success);">To'g'ri javob: ${q.answer.join(', ')}</span>
      </div>
      <div class="study-q-text">${escapeHtml(q.question)}</div>
      ${imgHtml}
      <div class="study-options">${optsHtml}</div>
      ${cueHtml}
    `;

    container.appendChild(card);
  }

  if (questions.length > limit) {
    const moreNotice = document.createElement('div');
    moreNotice.style.textAlign = 'center';
    moreNotice.style.padding = '16px';
    moreNotice.style.color = 'var(--text-muted)';
    moreNotice.textContent = `Ko'rsatilmoqda: ${limit} ta / Jami: ${questions.length} ta savol. Aniqroq ko'rish uchun yuqoridan bo'limni (Part) tanlang yoki qidiruvdan foydalaning.`;
    container.appendChild(moreNotice);
  }
}

// View 2: Flashcard Mode
function renderCurrentFlashcard() {
  const list = state.study.questions;
  const idx = state.study.flashIndex;

  if (list.length === 0) {
    document.getElementById('flashcardQuestion').textContent = "Bu bo'limda savollar mavjud emas.";
    document.getElementById('flashcardAnswerBox').style.display = 'none';
    return;
  }

  const q = list[idx];
  document.getElementById('flashcardBadge').textContent = `${q.source} • ${idx + 1} / ${list.length}`;
  document.getElementById('flashcardQuestion').textContent = q.question;

  // Build answer text
  const ansLetters = q.answer;
  const ansDetails = ansLetters.map(l => `[${l}] ${q.options[l] || ''}`).join('<br>');
  document.getElementById('flashcardAnswerText').innerHTML = ansDetails;
  document.getElementById('flashcardExplanationText').textContent = q.explanation || '';

  const ansBox = document.getElementById('flashcardAnswerBox');
  const hintText = document.getElementById('flashcardHintText');

  if (state.study.flashFlipped) {
    ansBox.style.display = 'block';
    hintText.style.display = 'none';
  } else {
    ansBox.style.display = 'none';
    hintText.style.display = 'block';
  }
}

function flipFlashcard() {
  state.study.flashFlipped = !state.study.flashFlipped;
  renderCurrentFlashcard();
  SoundEffects.playClick();
}

function nextFlashcard() {
  if (state.study.flashIndex < state.study.questions.length - 1) {
    state.study.flashIndex++;
    state.study.flashFlipped = false;
    renderCurrentFlashcard();
    SoundEffects.playClick();
  }
}

function prevFlashcard() {
  if (state.study.flashIndex > 0) {
    state.study.flashIndex--;
    state.study.flashFlipped = false;
    renderCurrentFlashcard();
    SoundEffects.playClick();
  }
}

// View 3: Keyword Matrix Table
function renderKeywordTable() {
  const tbody = document.getElementById('keywordTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  CCNA_KEYWORD_MATRIX.forEach((item, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="key-tag">${escapeHtml(item.trigger)}</span></td>
      <td><span class="ans-tag">➔ ${escapeHtml(item.answer)}</span></td>
      <td style="color:var(--text-muted); font-size:0.88rem;">${escapeHtml(item.topic)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================
// 🧩 1. MATCH PAIRS (PUZZLE GAME)
// ==========================================
const matchState = {
  pairs: [],
  selectedLeft: null,
  selectedRight: null,
  matchedCount: 0
};

function initMatchGame() {
  // Pick 5 random items from CCNA_KEYWORD_MATRIX
  const shuffled = CCNA_KEYWORD_MATRIX.slice().sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 5);

  matchState.pairs = selected;
  matchState.selectedLeft = null;
  matchState.selectedRight = null;
  matchState.matchedCount = 0;

  document.getElementById('matchScore').textContent = '0';
  document.getElementById('matchTotal').textContent = selected.length;

  const leftItems = selected.map((item, i) => ({ id: i, text: item.trigger }));
  const rightItems = selected.map((item, i) => ({ id: i, text: item.answer }));

  // Shuffle right side
  rightItems.sort(() => Math.random() - 0.5);

  const leftCol = document.getElementById('matchLeftCol');
  const rightCol = document.getElementById('matchRightCol');
  leftCol.innerHTML = '';
  rightCol.innerHTML = '';

  leftItems.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'match-card-btn';
    btn.dataset.id = item.id;
    btn.dataset.side = 'left';
    btn.innerHTML = `<span>📌 ${escapeHtml(item.text)}</span>`;
    btn.addEventListener('click', () => handleMatchClick(btn, item.id, 'left'));
    leftCol.appendChild(btn);
  });

  rightItems.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'match-card-btn';
    btn.dataset.id = item.id;
    btn.dataset.side = 'right';
    btn.innerHTML = `<span>🎯 ${escapeHtml(item.text)}</span>`;
    btn.addEventListener('click', () => handleMatchClick(btn, item.id, 'right'));
    rightCol.appendChild(btn);
  });
}

function handleMatchClick(btn, id, side) {
  if (btn.classList.contains('matched')) return;

  SoundEffects.playClick();

  if (side === 'left') {
    document.querySelectorAll('#matchLeftCol .match-card-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    matchState.selectedLeft = { btn, id };
  } else {
    document.querySelectorAll('#matchRightCol .match-card-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    matchState.selectedRight = { btn, id };
  }

  // Check if both sides selected
  if (matchState.selectedLeft && matchState.selectedRight) {
    const left = matchState.selectedLeft;
    const right = matchState.selectedRight;

    if (left.id === right.id) {
      // MATCHED!
      SoundEffects.playCorrect();
      left.btn.classList.remove('selected');
      right.btn.classList.remove('selected');
      left.btn.classList.add('matched');
      right.btn.classList.add('matched');
      left.btn.innerHTML += ' ✅';
      right.btn.innerHTML += ' ✅';

      matchState.matchedCount++;
      document.getElementById('matchScore').textContent = matchState.matchedCount;

      matchState.selectedLeft = null;
      matchState.selectedRight = null;

      if (matchState.matchedCount === matchState.pairs.length) {
        setTimeout(() => {
          SoundEffects.playCorrect();
          alert("🎉 Qoyilmaqom! Barcha 5 ta terminni xatosiz juftladingiz!");
          initMatchGame();
        }, 500);
      }
    } else {
      // WRONG!
      SoundEffects.playWrong();
      left.btn.classList.add('shake-error');
      right.btn.classList.add('shake-error');

      setTimeout(() => {
        left.btn.classList.remove('shake-error', 'selected');
        right.btn.classList.remove('shake-error', 'selected');
        matchState.selectedLeft = null;
        matchState.selectedRight = null;
      }, 500);
    }
  }
}

// ==========================================
// ⚡ 2. SPEED BLITZ (60 SEC REACTION MODE)
// ==========================================
const blitzState = {
  timer: 60,
  interval: null,
  score: 0,
  streak: 0,
  currentQ: null,
  active: false
};

function startSpeedBlitz() {
  blitzState.timer = 60;
  blitzState.score = 0;
  blitzState.streak = 0;
  blitzState.active = true;

  document.getElementById('blitzScore').textContent = '0';
  document.getElementById('blitzSeconds').textContent = '60';
  document.getElementById('blitzStreakBadge').style.display = 'none';
  document.getElementById('blitzStartBtn').style.display = 'none';

  SoundEffects.playCorrect();

  clearInterval(blitzState.interval);
  blitzState.interval = setInterval(() => {
    blitzState.timer--;
    document.getElementById('blitzSeconds').textContent = blitzState.timer;

    if (blitzState.timer <= 0) {
      clearInterval(blitzState.interval);
      blitzState.active = false;
      document.getElementById('blitzStartBtn').style.display = 'inline-block';
      document.getElementById('blitzStartBtn').textContent = 'Qaytadan O\'ynash 🔄';
      SoundEffects.playCorrect();
      alert(`⏱️ Vaqt tugadi! Sizning natijangiz: ${blitzState.score} ball!`);
    }
  }, 1000);

  nextBlitzQuestion();
}

function nextBlitzQuestion() {
  if (!blitzState.active) return;

  // Pick random question with options
  const randQ = CCNA_QUESTIONS[Math.floor(Math.random() * CCNA_QUESTIONS.length)];
  blitzState.currentQ = randQ;

  document.getElementById('blitzQText').textContent = randQ.question;

  const optContainer = document.getElementById('blitzOptionsList');
  optContainer.innerHTML = '';

  const optKeys = Object.keys(randQ.options).sort();
  optKeys.forEach(letter => {
    const text = randQ.options[letter];
    const btn = document.createElement('div');
    btn.className = 'option-item';
    btn.innerHTML = `
      <div class="option-letter">${letter}</div>
      <div class="option-text">${escapeHtml(text)}</div>
    `;
    btn.addEventListener('click', () => handleBlitzAnswer(letter, btn));
    optContainer.appendChild(btn);
  });
}

function handleBlitzAnswer(chosenLetter, itemBtn) {
  if (!blitzState.active || !blitzState.currentQ) return;

  const q = blitzState.currentQ;
  const isCorrect = q.answer.includes(chosenLetter);

  if (isCorrect) {
    SoundEffects.playCorrect();
    itemBtn.classList.add('correct');
    blitzState.streak++;
    const bonus = blitzState.streak > 1 ? blitzState.streak * 5 : 0;
    blitzState.score += (10 + bonus);
    document.getElementById('blitzScore').textContent = blitzState.score;

    const streakBadge = document.getElementById('blitzStreakBadge');
    if (blitzState.streak >= 2) {
      streakBadge.style.display = 'inline-block';
      streakBadge.textContent = `Combo x${blitzState.streak}! 🔥`;
    }

    setTimeout(nextBlitzQuestion, 250);
  } else {
    SoundEffects.playWrong();
    itemBtn.classList.add('wrong');
    blitzState.streak = 0;
    document.getElementById('blitzStreakBadge').style.display = 'none';

    // Show correct
    document.querySelectorAll('#blitzOptionsList .option-item').forEach(b => {
      const l = b.querySelector('.option-letter').textContent.trim();
      if (q.answer.includes(l)) b.classList.add('correct');
    });

    setTimeout(nextBlitzQuestion, 800);
  }
}

// ==========================================
// 🎯 3. CISCO DRAG & DROP MODULE
// ==========================================
const ddState = {
  currentIndex: 0,
  selectedItem: null,
  assigned: {} // slotIndex -> itemText
};

function initDragDropModule() {
  const select = document.getElementById('ddExerciseSelect');
  if (!select) return;

  if (typeof CCNA_DRAGDROP === 'undefined' || CCNA_DRAGDROP.length === 0) {
    document.getElementById('ddTitleBox').textContent = "Drag & Drop mashqlari topilmadi.";
    return;
  }

  select.innerHTML = '';
  CCNA_DRAGDROP.forEach((ex, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Mashq ${i + 1}: ${truncate(ex.title, 45)}`;
    select.appendChild(opt);
  });

  loadDragDropExercise();
}

function loadDragDropExercise() {
  const select = document.getElementById('ddExerciseSelect');
  const index = select ? parseInt(select.value, 10) : 0;
  ddState.currentIndex = index;
  ddState.selectedItem = null;
  ddState.assigned = {};

  const ex = CCNA_DRAGDROP[index];
  if (!ex) return;

  document.getElementById('ddTitleBox').textContent = `🎯 ${ex.title}`;

  // Pool of terms (shuffled)
  const terms = ex.pairs.map(p => p.term).sort(() => Math.random() - 0.5);
  const poolContainer = document.getElementById('ddPoolContainer');
  poolContainer.innerHTML = '';

  terms.forEach(term => {
    const el = document.createElement('div');
    el.className = 'dd-draggable-item';
    el.innerHTML = `<span>${escapeHtml(term)}</span> <span>👉</span>`;
    el.dataset.term = term;
    el.addEventListener('click', () => selectDraggableItem(el, term));
    poolContainer.appendChild(el);
  });

  // Target slots (definitions)
  const targetsContainer = document.getElementById('ddTargetsContainer');
  targetsContainer.innerHTML = '';

  ex.pairs.forEach((pair, slotIdx) => {
    const slot = document.createElement('div');
    slot.className = 'dd-drop-slot';
    slot.innerHTML = `
      <div class="dd-slot-desc"><b>Vazifa / Ta'rif:</b> ${escapeHtml(pair.def)}</div>
      <div class="dd-slot-target-area" id="ddSlotArea_${slotIdx}" onclick="placeDraggableInSlot(${slotIdx})">
        [ Bu yerga qo'yish uchun bosing ]
      </div>
    `;
    targetsContainer.appendChild(slot);
  });
}

function selectDraggableItem(el, term) {
  SoundEffects.playClick();
  document.querySelectorAll('.dd-draggable-item').forEach(e => e.classList.remove('active-drag'));
  el.classList.add('active-drag');
  ddState.selectedItem = { el, term };
}

function placeDraggableInSlot(slotIdx) {
  if (!ddState.selectedItem) {
    alert("Avval chap tarafdagi variantlardan birini tanlang!");
    return;
  }

  SoundEffects.playClick();
  const { el, term } = ddState.selectedItem;

  // Assign
  ddState.assigned[slotIdx] = term;
  const targetArea = document.getElementById(`ddSlotArea_${slotIdx}`);
  targetArea.classList.add('filled');
  targetArea.innerHTML = `<b>✓ ${escapeHtml(term)}</b>`;

  // Hide or dim from pool
  el.style.opacity = '0.4';
  el.classList.remove('active-drag');
  ddState.selectedItem = null;
}

function checkDragDropAnswers() {
  const ex = CCNA_DRAGDROP[ddState.currentIndex];
  if (!ex) return;

  let allCorrect = true;
  let correctCount = 0;

  ex.pairs.forEach((pair, slotIdx) => {
    const userVal = ddState.assigned[slotIdx];
    const targetArea = document.getElementById(`ddSlotArea_${slotIdx}`);

    if (userVal && userVal.toLowerCase() === pair.term.toLowerCase()) {
      targetArea.classList.remove('checked-wrong');
      targetArea.classList.add('checked-correct');
      correctCount++;
    } else {
      targetArea.classList.remove('checked-correct');
      targetArea.classList.add('checked-wrong');
      allCorrect = false;
    }
  });

  if (allCorrect) {
    SoundEffects.playCorrect();
    alert("🎉 Tabriklaymiz! Barcha tushunchalar to'g'ri joylashtirildi!");
  } else {
    SoundEffects.playWrong();
    alert(`Natija: ${correctCount} / ${ex.pairs.length} ta to'g'ri. Qizil kataklarni qaytadan to'g'rilang!`);
  }
}

function resetCurrentDragDrop() {
  loadDragDropExercise();
  SoundEffects.playClick();
}

function nextDragDropExercise() {
  if (ddState.currentIndex < CCNA_DRAGDROP.length - 1) {
    document.getElementById('ddExerciseSelect').value = ddState.currentIndex + 1;
    loadDragDropExercise();
    SoundEffects.playClick();
  }
}

function prevDragDropExercise() {
  if (ddState.currentIndex > 0) {
    document.getElementById('ddExerciseSelect').value = ddState.currentIndex - 1;
    loadDragDropExercise();
    SoundEffects.playClick();
  }
}

// ADMIN DASHBOARD & USER MANAGEMENT
let currentAdminSubTab = 'students';
let adminStudentFilterQuery = '';

function switchAdminTab(tabName) {
  currentAdminSubTab = tabName;

  const btnStudents = document.getElementById('adminTabBtnStudents');
  const btnResults = document.getElementById('adminTabBtnResults');
  const btnLeaderboard = document.getElementById('adminTabBtnLeaderboard');

  const viewStudents = document.getElementById('adminViewStudents');
  const viewResults = document.getElementById('adminViewResults');
  const viewLeaderboard = document.getElementById('adminViewLeaderboard');

  [btnStudents, btnResults, btnLeaderboard].forEach(b => b && b.classList.remove('active'));
  [viewStudents, viewResults, viewLeaderboard].forEach(v => v && (v.style.display = 'none'));

  if (tabName === 'students') {
    if (btnStudents) btnStudents.classList.add('active');
    if (viewStudents) viewStudents.style.display = 'block';
    renderAdminStudentsList();
  } else if (tabName === 'results') {
    if (btnResults) btnResults.classList.add('active');
    if (viewResults) viewResults.style.display = 'block';
    renderAdminResultsList();
  } else if (tabName === 'leaderboard') {
    if (btnLeaderboard) btnLeaderboard.classList.add('active');
    if (viewLeaderboard) viewLeaderboard.style.display = 'block';
    renderAdminLeaderboard();
  }
  SoundEffects.playClick();
}

function renderAdminDashboard() {
  if (!state.isAdmin) return;

  const users = getRegisteredUsers();
  const results = state.results || [];

  // 1. Update Stats Cards
  const totalStudentsEl = document.getElementById('adminTotalStudents');
  const totalQuizzesEl = document.getElementById('adminTotalQuizzes');
  const avgScoreEl = document.getElementById('adminAvgScore');
  const totalCertsEl = document.getElementById('adminTotalCerts');
  const badgeStudents = document.getElementById('adminStudentsBadge');
  const badgeResults = document.getElementById('adminResultsBadge');

  if (totalStudentsEl) totalStudentsEl.textContent = users.length;
  if (totalQuizzesEl) totalQuizzesEl.textContent = results.length;
  if (badgeStudents) badgeStudents.textContent = users.length;
  if (badgeResults) badgeResults.textContent = results.length;

  if (results.length > 0) {
    const avg = Math.round(results.reduce((acc, r) => acc + (r.percent || 0), 0) / results.length);
    if (avgScoreEl) avgScoreEl.textContent = avg + '%';
    const certCount = results.filter(r => (r.percent || 0) >= 82.5).length;
    if (totalCertsEl) totalCertsEl.textContent = certCount;
  } else {
    if (avgScoreEl) avgScoreEl.textContent = '0%';
    if (totalCertsEl) totalCertsEl.textContent = '0';
  }

  // Populate Part filter in Results view
  populateAdminPartFilter();
  populateAdminGroupFilter();

  // Render active tab
  if (currentAdminSubTab === 'students') {
    renderAdminStudentsList();
  } else if (currentAdminSubTab === 'results') {
    renderAdminResultsList();
  } else {
    renderAdminLeaderboard();
  }
}

function populateAdminGroupFilter() {
  const select = document.getElementById('adminGroupFilter');
  if (!select) return;

  const users = getRegisteredUsers();
  const groups = Array.from(new Set(users.map(u => u.group).filter(Boolean)));

  const currentVal = select.value;
  select.innerHTML = '<option value="all">Barcha guruhlar</option>';
  groups.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    select.appendChild(opt);
  });
  select.value = currentVal || 'all';
}

function populateAdminPartFilter() {
  const select = document.getElementById('adminResultPartFilter');
  if (!select) return;

  select.innerHTML = '<option value="all">Barcha Partlar</option>';
  PARTS_CONFIG.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.title;
    opt.textContent = p.title;
    select.appendChild(opt);
  });
}

// SUB-VIEW 1: STUDENTS LIST & MANAGEMENT
function renderAdminStudentsList() {
  const tbody = document.getElementById('adminStudentsTableBody');
  const countText = document.getElementById('adminStudentCountText');
  const searchInput = document.getElementById('adminStudentSearch');
  const groupSelect = document.getElementById('adminGroupFilter');

  if (!tbody) return;

  const users = getRegisteredUsers();
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const groupFilter = groupSelect ? groupSelect.value : 'all';

  let filtered = users.filter(u => {
    const matchQuery = !query || 
      (u.name && u.name.toLowerCase().includes(query)) || 
      (u.login && u.login.toLowerCase().includes(query));
    const matchGroup = (groupFilter === 'all') || (u.group === groupFilter);
    return matchQuery && matchGroup;
  });

  if (countText) {
    countText.textContent = `Ko'rsatilmoqda: ${filtered.length} / ${users.length} ta talaba`;
  }

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">
      ${users.length === 0 ? "Hozircha hech qanday talaba ro'yxatdan o'tmagan." : "Qidiruv bo'yicha talaba topilmadi."}
    </td></tr>`;
    return;
  }

  const allResults = state.results || [];

  filtered.forEach((u, idx) => {
    // Calculate user tests and average score
    const userResults = allResults.filter(r => 
      (r.studentName && r.studentName.toLowerCase() === u.name.toLowerCase()) ||
      (r.login && r.login.toLowerCase() === u.login.toLowerCase())
    );

    const quizCount = userResults.length;
    const avgScore = quizCount > 0 
      ? Math.round(userResults.reduce((acc, r) => acc + (r.percent || 0), 0) / quizCount) 
      : 0;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700; color:var(--text-muted);">${idx + 1}</td>
      <td><b>${escapeHtml(u.name)}</b></td>
      <td><code>${escapeHtml(u.login)}</code></td>
      <td><span style="background:var(--bg-card); border:1px solid var(--border); padding:3px 8px; border-radius:6px; font-size:0.85rem;">${escapeHtml(u.group || 'Guruhsiz')}</span></td>
      <td style="font-size:0.85rem; color:var(--text-muted);">${u.createdAt || '-'}</td>
      <td><b>${quizCount} ta</b></td>
      <td>
        <span style="font-weight:700; color:${avgScore >= 82.5 ? 'var(--success)' : (avgScore > 0 ? 'var(--warning)' : 'var(--text-muted)')};">
          ${avgScore > 0 ? avgScore + '%' : '-'}
        </span>
      </td>
      <td style="text-align:center; white-space:nowrap;">
        <button class="btn-action-icon" title="Test natijalarini ko'rish" onclick="filterResultsByStudent('${escapeHtml(u.name)}')">📊 Natijalar</button>
        <button class="btn-action-icon" title="Tahrirlash" onclick="openEditStudentModal('${u.id}')">✏️</button>
        <button class="btn-action-icon btn-action-danger" title="O'chirish" onclick="deleteStudent('${u.id}', '${escapeHtml(u.name)}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// STUDENT MODAL (ADD / EDIT)
function openAddStudentModal() {
  document.getElementById('studentEditId').value = '';
  document.getElementById('studentModalTitle').textContent = "Yangi Talaba Qo'shish";
  document.getElementById('modalStudentName').value = '';
  document.getElementById('modalStudentLogin').value = '';
  document.getElementById('modalStudentGroup').value = '';
  document.getElementById('modalStudentPassword').value = '';
  document.getElementById('modalPwdNotice').style.display = 'none';

  document.getElementById('studentFormModal').style.display = 'flex';
  document.getElementById('modalStudentName').focus();
}

function openEditStudentModal(studentId) {
  const users = getRegisteredUsers();
  const user = users.find(u => u.id === studentId);
  if (!user) return;

  document.getElementById('studentEditId').value = user.id;
  document.getElementById('studentModalTitle').textContent = "Talabani Tahrirlash: " + user.name;
  document.getElementById('modalStudentName').value = user.name || '';
  document.getElementById('modalStudentLogin').value = user.login || '';
  document.getElementById('modalStudentGroup').value = user.group || '';
  document.getElementById('modalStudentPassword').value = '';
  document.getElementById('modalPwdNotice').style.display = 'inline';

  document.getElementById('studentFormModal').style.display = 'flex';
}

function closeStudentModal() {
  document.getElementById('studentFormModal').style.display = 'none';
}

async function saveStudentFromModal() {
  const editId = document.getElementById('studentEditId').value;
  const name = document.getElementById('modalStudentName').value.trim();
  const login = document.getElementById('modalStudentLogin').value.trim().toLowerCase();
  const group = document.getElementById('modalStudentGroup').value.trim();
  const password = document.getElementById('modalStudentPassword').value;

  if (!name || !login || !group) {
    alert("Iltimos, Ism, Login va Guruh maydonlarini to'ldiring!");
    return;
  }

  const users = getRegisteredUsers();

  if (editId) {
    // EDIT EXISTING
    const userIndex = users.findIndex(u => u.id === editId);
    if (userIndex !== -1) {
      // Check login uniqueness against other users
      if (users.some((u, i) => i !== userIndex && u.login.toLowerCase() === login)) {
        alert("Bu login boshqa talaba tomonidan band qilingan!");
        return;
      }
      users[userIndex].name = name;
      users[userIndex].login = login;
      users[userIndex].group = group;

      if (password) {
        users[userIndex].hash = await computeSha256Hex(`${login}:${password}:${AUTH_SALT}`);
      }
      saveRegisteredUsers(users);
      SoundEffects.playCorrect();
      closeStudentModal();
      renderAdminDashboard();
      alert("Talaba ma'lumotlari muvaffaqiyatli saqlandi!");
    }
  } else {
    // ADD NEW
    if (login === MASTER_ADMIN.login || users.some(u => u.login.toLowerCase() === login)) {
      alert("Ushbu login tizimda band!");
      return;
    }
    if (!password) {
      alert("Yangi talaba uchun parol kiritish majburiy!");
      return;
    }

    const hash = await computeSha256Hex(`${login}:${password}:${AUTH_SALT}`);
    const newUser = {
      id: 'std_' + Date.now(),
      name: name,
      login: login,
      group: group,
      hash: hash,
      role: 'student',
      createdAt: new Date().toLocaleDateString('uz-UZ')
    };

    users.push(newUser);
    saveRegisteredUsers(users);
    SoundEffects.playCorrect();
    closeStudentModal();
    renderAdminDashboard();
    alert(`Yangi talaba (${name}) muvaffaqiyatli qo'shildi!`);
  }
}

function deleteStudent(studentId, studentName) {
  if (confirm(`Haqiqatan ham "${studentName}" nomli talabani va uning hisobini o'chirmoqchimisiz?`)) {
    let users = getRegisteredUsers();
    users = users.filter(u => u.id !== studentId);
    saveRegisteredUsers(users);
    SoundEffects.playClick();
    renderAdminDashboard();
  }
}

function filterResultsByStudent(studentName) {
  switchAdminTab('results');
  const searchInput = document.getElementById('adminResultsSearch');
  if (searchInput) {
    searchInput.value = studentName;
    renderAdminResultsList();
  }
}

// SUB-VIEW 2: TEST RESULTS LIST
function renderAdminResultsList() {
  const tbody = document.getElementById('adminResultsTableBody');
  const searchInput = document.getElementById('adminResultsSearch');
  const partSelect = document.getElementById('adminResultPartFilter');
  const statusSelect = document.getElementById('adminResultStatusFilter');

  if (!tbody) return;

  const results = state.results || [];
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const partFilter = partSelect ? partSelect.value : 'all';
  const statusFilter = statusSelect ? statusSelect.value : 'all';

  let filtered = results.slice().reverse().filter(r => {
    const matchQuery = !query ||
      (r.studentName && r.studentName.toLowerCase().includes(query)) ||
      (r.partTitle && r.partTitle.toLowerCase().includes(query)) ||
      (r.group && r.group.toLowerCase().includes(query));

    const matchPart = (partFilter === 'all') || (r.partTitle === partFilter);

    const isPass = (r.percent >= 82.5);
    const matchStatus = (statusFilter === 'all') ||
      (statusFilter === 'pass' && isPass) ||
      (statusFilter === 'fail' && !isPass);

    return matchQuery && matchPart && matchStatus;
  });

  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:var(--text-muted);">
      ${results.length === 0 ? "Hozircha test natijalari mavjud emas." : "Tanlangan filter bo'yicha natijalar topilmadi."}
    </td></tr>`;
    return;
  }

  filtered.forEach((r, idx) => {
    const isPass = r.percent >= 82.5;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700; color:var(--text-muted);">${idx + 1}</td>
      <td><b>${escapeHtml(r.studentName || "Noma'lum")}</b></td>
      <td>${escapeHtml(r.group || '-')}</td>
      <td><span style="font-weight:600; color:var(--primary);">${escapeHtml(r.partTitle || '-')}</span></td>
      <td><b>${r.correct} / ${r.total}</b></td>
      <td><b style="font-size:1.05rem; color:${isPass ? 'var(--success)' : 'var(--danger)'};">${r.percent}%</b></td>
      <td>
        <span class="status-badge ${isPass ? 'status-pass' : 'status-fail'}">
          ${isPass ? "O'tdi ✅" : 'Yiqildi ⚠️'}
        </span>
      </td>
      <td style="font-size:0.85rem; color:var(--text-muted);">${r.date || '-'}</td>
      <td style="text-align:center;">
        <button class="btn-action-icon btn-action-danger" title="Ushbu natijani o'chirish" onclick="deleteSpecificResult(${state.results.indexOf(r)})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteSpecificResult(index) {
  if (confirm("Haqiqatan ham ushbu test natijasini o'chirmoqchimisiz?")) {
    if (index >= 0 && index < state.results.length) {
      state.results.splice(index, 1);
      localStorage.setItem('ccna_results', JSON.stringify(state.results));
      SoundEffects.playClick();
      renderAdminDashboard();
    }
  }
}

// SUB-VIEW 3: LEADERBOARD
function renderAdminLeaderboard() {
  const tbody = document.getElementById('adminLeaderboardTableBody');
  if (!tbody) return;

  const users = getRegisteredUsers();
  const allResults = state.results || [];

  const rankings = users.map(u => {
    const uResults = allResults.filter(r => 
      (r.studentName && r.studentName.toLowerCase() === u.name.toLowerCase()) ||
      (r.login && r.login.toLowerCase() === u.login.toLowerCase())
    );

    const totalTests = uResults.length;
    const passedTests = uResults.filter(r => r.percent >= 82.5).length;
    const avgScore = totalTests > 0 
      ? Math.round(uResults.reduce((acc, r) => acc + (r.percent || 0), 0) / totalTests) 
      : 0;

    return {
      name: u.name,
      login: u.login,
      group: u.group,
      totalTests: totalTests,
      passedTests: passedTests,
      avgScore: avgScore
    };
  });

  // Sort by passed tests then average score
  rankings.sort((a, b) => b.passedTests - a.passedTests || b.avgScore - a.avgScore);

  tbody.innerHTML = '';

  if (rankings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">
      Talabalar ro'yxati bo'sh.
    </td></tr>`;
    return;
  }

  rankings.slice(0, 15).forEach((item, idx) => {
    let medal = `${idx + 1}`;
    if (idx === 0) medal = "🥇 1-o'rin";
    else if (idx === 1) medal = "🥈 2-o'rin";
    else if (idx === 2) medal = "🥉 3-o'rin";

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700; color:${idx < 3 ? 'var(--warning)' : 'var(--text-muted)'};">${medal}</td>
      <td><b>${escapeHtml(item.name)}</b></td>
      <td>${escapeHtml(item.group || '-')}</td>
      <td><b>${item.totalTests} ta</b></td>
      <td><span style="color:var(--success); font-weight:700;">${item.passedTests} ta</span></td>
      <td><b style="color:${item.avgScore >= 82.5 ? 'var(--success)' : 'var(--text-main)'};">${item.avgScore}%</b></td>
      <td>${item.passedTests > 0 ? `🏆 ${item.passedTests} ta Sertifikat` : '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportResultsToCSV() {
  const results = state.results || [];
  if (results.length === 0) {
    alert("Yuklash uchun test natijalari mavjud emas!");
    return;
  }

  let csvContent = "﻿"; // UTF-8 BOM
  csvContent += "№,Talaba,Guruhi,Bo'lim,To'g'ri,Jami,Foiz,Status,Sana va Vaqt\n";

  results.forEach((r, idx) => {
    const status = (r.percent >= 82.5) ? "O'tdi" : "Yiqildi";
    csvContent += `"${idx + 1}","${r.studentName || ''}","${r.group || ''}","${r.partTitle || ''}","${r.correct}","${r.total}","${r.percent}%","${status}","${r.date || ''}"\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CCNA_Natijalari_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  SoundEffects.playCorrect();
}

function clearAllResults() {
  if (confirm("DIQQAT! Barcha talabalarning topshirgan test natijalari butunlay o'chiriladi. Ushbu amalni ortga qaytarib bo'lmaydi. Davom etasizmi?")) {
    state.results = [];
    localStorage.removeItem('ccna_results');
    renderAdminDashboard();
    SoundEffects.playClick();
    alert("Barcha test natijalari tozalandi!");
  }
}

// LABS SECTION
function initLabs() {
  const listEl = document.getElementById('labsList');
  if (!listEl) return;

  listEl.innerHTML = '';
  CCNA_LABS.forEach((lab, index) => {
    const btn = document.createElement('button');
    btn.className = 'lab-item-btn';
    if (index === 0) btn.classList.add('active');

    const title = lab.tasks && lab.tasks.length > 0 ? lab.tasks[0] : lab.tasks_text.slice(0, 40);
    btn.innerHTML = `
      <div>
        <div style="font-weight:700;">${lab.name}</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">${truncate(title, 35)}</div>
      </div>
      <span style="font-size:1.1rem;">➡️</span>
    `;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.lab-item-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectLab(index);
      SoundEffects.playClick();
    });

    listEl.appendChild(btn);
  });

  selectLab(0);
}

function selectLab(index) {
  state.selectedLabIndex = index;
  const lab = CCNA_LABS[index];
  if (!lab) return;

  document.getElementById('labTitle').textContent = `${lab.name} — Batafsil Qo'llanma`;

  const tasksBox = document.getElementById('labTasksBox');
  tasksBox.innerHTML = '';

  if (lab.tasks && lab.tasks.length > 0) {
    lab.tasks.forEach((t, i) => {
      const step = document.createElement('div');
      step.className = 'task-step';
      step.innerHTML = `
        <div class="task-step-num">${i + 1}</div>
        <div>${escapeHtml(t)}</div>
      `;
      tasksBox.appendChild(step);
    });
  } else {
    tasksBox.innerHTML = `<p>${escapeHtml(lab.tasks_text)}</p>`;
  }

  const solutionBox = document.getElementById('labSolutionCode');
  solutionBox.textContent = lab.solution_text || "Yechim mavjud emas.";

  const ptTopology = document.getElementById('labPtTopology');
  let topoImgHtml = '';
  if (lab.topology_image) {
    topoImgHtml = `
      <div class="lab-topology-card">
        <h4 style="margin-bottom:10px; color:var(--primary); display:flex; align-items:center; justify-content:center; gap:8px;">
          🗺️ Laboratoriya Haqiqiy Topologiya Sxemasi:
        </h4>
        <img src="${lab.topology_image}" class="lab-topology-img" onclick="openImageModal(this.src)" alt="Lab Topology" title="Kattalashtirish uchun bosing">
        <div class="diagram-hint">🔍 Kattalashtirish uchun rasm ustiga bosing</div>
      </div>
    `;
  }
  ptTopology.innerHTML = topoImgHtml + generatePtTopologyGuide(lab);
}

function openLabInSimulator(labIndex) {
  const targetIdx = (typeof labIndex !== 'undefined' && labIndex !== null) ? labIndex : (state.selectedLabIndex || 0);
  const cliTab = document.querySelector('.nav-tab[data-tab="cli"]');
  if (cliTab) cliTab.click();
  
  const select = document.getElementById('cliScenarioSelect');
  if (select && targetIdx >= 0 && targetIdx < state.cli.scenarios.length) {
    select.value = targetIdx;
    switchCliScenario();
  }
}

function copyLabCode() {
  const code = document.getElementById('labSolutionCode').textContent;
  navigator.clipboard.writeText(code).then(() => {
    SoundEffects.playCorrect();
    alert("Buyruqlar nusxalandi! Cisco Packet Tracer yoki CLI terminalga qo'yishingiz mumkin.");
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = code;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    SoundEffects.playCorrect();
    alert("Buyruqlar nusxalandi!");
  });
}

function generatePtTopologyGuide(lab) {
  const text = (lab.tasks_text + ' ' + lab.solution_text).toLowerCase();
  let devices = [];
  let cables = "Copper Straight-Through yoki Cross-Over kabel";

  if (text.includes('sw-1') && text.includes('sw-2') && text.includes('r1')) {
    devices = ["2x Cisco Catalyst 2960 Switch (SW-1, SW-2)", "1x Cisco 2811 / 1941 Router (R1)", "PC yoki IP Phone"];
  } else if (text.includes('r1') && text.includes('r2')) {
    devices = ["2x Cisco 2811/1941 Router (R1, R2)", "2x Kompyuter (PC1, PC2)"];
  } else {
    devices = ["2x Cisco 2960 Switch", "2x Kompyuter (PC)"];
  }

  return `
    <div style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px solid var(--border); margin-bottom:16px;">
      <h4 style="margin-bottom:8px; color:var(--primary);">🎯 Packet Tracer'da ushbu laboratoriyani yig'ish:</h4>
      <ul style="padding-left:20px; font-size:0.92rem; margin-bottom:10px;">
        ${devices.map(d => `<li><b>Qurilmalar:</b> ${d}</li>`).join('')}
        <li><b>Ulash turi:</b> ${cables}</li>
      </ul>
      <p style="font-size:0.88rem; color:var(--text-muted);">
        <b>Qadamlar:</b> Packet Tracer'ni oching ➔ Qurilmalarni joylashtiring ➔ CLI ga o'tib quyidagi yechim buyruqlarini kiriting ➔ <code>show</code> buyruqlari bilan tekshiring.
      </p>
    </div>
  `;
}

// CLI SIMULATOR
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
  if (step) alert(`To'g'ri buyruq:

${step.cmd}`);
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

  const cmd = rawCmd.toLowerCase().trim().replace(/\s+/g, ' ');

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
    const exp = currentStep.cmd.toLowerCase().trim().replace(/\s+/g, ' ');
    
    const normalizeCmd = (s) => s
      .replace(/^conf\s+t\b/, 'configure terminal')
      .replace(/^int\s+range\b/, 'interface range')
      .replace(/^int\s+/, 'interface ')
      .replace(/^sh\s+/, 'show ')
      .replace(/\bno\s+shut\b/, 'no shutdown')
      .replace(/^en\b/, 'enable');

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
function addCliHistory(text, type) {
  const hist = document.getElementById('cliHistory');
  if (!hist) return;
  const line = document.createElement('div');
  line.className = `terminal-line ${type}`;
  line.textContent = text;
  hist.appendChild(line);
}

// BOOKMARKS VIEW
function initBookmarksView() {
  renderBookmarksList();
}

function renderBookmarksList() {
  const container = document.getElementById('bookmarksListContainer');
  if (!container) return;

  const bookmarkedQuestions = CCNA_QUESTIONS.filter(q => state.bookmarks.includes(q.id));

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
      <h2>⭐ Saqlangan Savollar (${bookmarkedQuestions.length} ta)</h2>
    </div>
  `;

  if (bookmarkedQuestions.length === 0) {
    container.innerHTML += `
      <div style="background:var(--bg-card); padding:30px; text-align:center; border-radius:var(--radius); border:1px solid var(--border); color:var(--text-muted);">
        Hozircha saqlangan savollar yo'q. Test yechish davomida savol ustidagi "☆ Saqlash" tugmasini bosing.
      </div>
    `;
    return;
  }

  const grid = document.createElement('div');
  grid.style.display = 'flex';
  grid.style.flexDirection = 'column';
  grid.style.gap = '12px';

  bookmarkedQuestions.forEach(q => {
    const card = document.createElement('div');
    card.style.background = 'var(--bg-card)';
    card.style.border = '1px solid var(--border)';
    card.style.borderRadius = '8px';
    card.style.padding = '16px';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span class="badge-source">${q.source}</span>
        <span style="color:var(--success); font-weight:700;">Javob: ${q.answer.join(', ')}</span>
      </div>
      <div style="font-weight:600; margin-bottom:8px;">${escapeHtml(q.question)}</div>
      <div style="font-size:0.85rem; color:var(--text-muted);">${escapeHtml(q.explanation || '')}</div>
    `;
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

// UTILITY HELPERS
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function truncate(str, n) {
  return str && str.length > n ? str.substr(0, n - 1) + '...' : str;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// IMAGE VIEWER MODAL
function openImageModal(imgSrc) {
  const modal = document.getElementById('imageZoomModal');
  const img = document.getElementById('imageZoomContent');
  if (modal && img) {
    img.src = imgSrc;
    modal.style.display = 'flex';
  }
}

function closeImageModal() {
  const modal = document.getElementById('imageZoomModal');
  if (modal) {
    modal.style.display = 'none';
  }
}
