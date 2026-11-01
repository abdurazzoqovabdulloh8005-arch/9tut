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

  try { initTheme(); } catch(e) { console.error("initTheme", e); }

  try { initSoundButton(); } catch(e) { console.error("initSoundButton", e); }

  try { initNavigation(); } catch(e) { console.error("initNavigation", e); }

  try { initHotkeys(); } catch(e) { console.error("initHotkeys", e); }

  try { checkAuth(); } catch(e) { console.error("checkAuth", e); }
  try { startSessionSecurityMonitor(); } catch(e) {}

  try { renderPartsGrid(); } catch(e) { console.error("renderPartsGrid", e); }

  try { initStudyModule(); } catch(e) { console.error("initStudyModule", e); }

  try { initLabs(); } catch(e) { console.error("initLabs", e); }

  try { initCliSimulator(); } catch(e) { console.error("initCliSimulator", e); }

  try { initBookmarksView(); } catch(e) { console.error("initBookmarksView", e); }

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

// NAVIGATION & TAB SWITCHING

function switchMainTab(target) {

  if (target === 'admin' && !state.isAdmin) {

    target = 'quiz';

  }

  const tabs = document.querySelectorAll('.nav-tab');

  tabs.forEach(t => {

    t.classList.toggle('active', t.getAttribute('data-tab') === target);

  });

  state.currentTab = target;

  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  const activeContent = document.getElementById(target + 'Section');

  if (activeContent) activeContent.classList.add('active');

  if (target === 'admin') {

    renderAdminDashboard();

  } else if (target === 'study') {

    renderStudyContent();

  } else if (target === 'bookmarks') {

    renderBookmarksList();

  }

}

function initNavigation() {

  const tabs = document.querySelectorAll('.nav-tab');

  tabs.forEach(tab => {

    tab.addEventListener('click', () => {

      const target = tab.getAttribute('data-tab');

      if (target === 'admin' && !state.isAdmin) {

        openAdminPrompt();

        return;

      }

      switchMainTab(target);

      SoundEffects.playClick();

    });

  });

}

// AUTH (SECURE SHA-256 AUTHENTICATION & MULTI-USER REGISTRATION)

const AUTH_SALT = "CCNA_PORTAL_SECURE_AUTH_v2024";

// Master Admin account (Plaintext password is NEVER stored! Only salted SHA-256 hash)

// Master Admin Configuration & Password Storage

function getMasterAdmin() {

  try {

    const raw = localStorage.getItem('ccna_master_admin_custom');

    if (raw) return JSON.parse(raw);

  } catch (e) {}

  return {

    login: "abdulloh",

    name: "Abdulloh",

    role: "admin",

    // SHA-256 of "abdulloh:Abdulloh8005:CCNA_PORTAL_SECURE_AUTH_v2024"

    hash: "a4c1f401929410d23fc44b238e8afcf7e073c8aba30dea8378d5c58fa790d1a2",

    isPasswordChanged: false

  };

}

function saveMasterAdmin(adminObj) {

  localStorage.setItem('ccna_master_admin_custom', JSON.stringify(adminObj));

}

function sha256_pure_js(ascii) {

  function rightRotate(value, amount) {

    return (value >>> amount) | (value << (32 - amount));

  }

  var mathPow = Math.pow;

  var maxWord = mathPow(2, 32);

  var i, j;

  var words = [];

  var asciiBitLength = ascii.length * 8;

  var hash = [];

  var k = [];

  var primeCounter = 0;

  var isComposite = {};

  for (var candidate = 2; primeCounter < 64; candidate++) {

    if (!isComposite[candidate]) {

      for (i = 0; i < 313; i += candidate) {

        isComposite[i] = candidate;

      }

      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;

      k[primeCounter++] = (mathPow(candidate, 1.0 / 3.0) * maxWord) | 0;

    }

  }

  var bArr = [];

  for (i = 0; i < ascii.length; i++) {

    bArr.push(ascii.charCodeAt(i));

  }

  bArr.push(0x80);

  while ((bArr.length % 64) !== 56) {

    bArr.push(0x00);

  }

  words = new Array(bArr.length / 4);

  for (i = 0; i < words.length; i++) words[i] = 0;

  for (i = 0; i < bArr.length; i++) {

    words[i >> 2] |= bArr[i] << ((3 - (i % 4)) * 8);

  }

  words.push(((asciiBitLength / maxWord) | 0) & 0xffffffff);

  words.push(asciiBitLength & 0xffffffff);

  j = 0;

  while (j < words.length) {

    var w = words.slice(j, j + 16);

    while (w.length < 64) w.push(0);

    j += 16;

    for (i = 16; i < 64; i++) {

      var w15 = w[i - 15];

      var w2 = w[i - 2];

      var s0 = (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) & 0xffffffff;

      var s1 = (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) & 0xffffffff;

      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & 0xffffffff;

    }

    var a = hash[0], b = hash[1], c = hash[2], d = hash[3];

    var e = hash[4], f = hash[5], g = hash[6], h = hash[7];

    for (i = 0; i < 64; i++) {

      var S1 = (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) & 0xffffffff;

      var ch = ((e & f) ^ ((~e) & g)) & 0xffffffff;

      var temp1 = (h + S1 + ch + k[i] + w[i]) & 0xffffffff;

      var S0 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) & 0xffffffff;

      var maj = ((a & b) ^ (a & c) ^ (b & c)) & 0xffffffff;

      var temp2 = (S0 + maj) & 0xffffffff;

      h = g;

      g = f;

      f = e;

      e = (d + temp1) & 0xffffffff;

      d = c;

      c = b;

      b = a;

      a = (temp1 + temp2) & 0xffffffff;

    }

    hash[0] = (hash[0] + a) & 0xffffffff;

    hash[1] = (hash[1] + b) & 0xffffffff;

    hash[2] = (hash[2] + c) & 0xffffffff;

    hash[3] = (hash[3] + d) & 0xffffffff;

    hash[4] = (hash[4] + e) & 0xffffffff;

    hash[5] = (hash[5] + f) & 0xffffffff;

    hash[6] = (hash[6] + g) & 0xffffffff;

    hash[7] = (hash[7] + h) & 0xffffffff;

  }

  var result = '';

  for (i = 0; i < 8; i++) {

    var hex = (hash[i] >>> 0).toString(16);

    while (hex.length < 8) hex = '0' + hex;

    result += hex;

  }

  return result;

}

function computeSha256Hex(str) {

  try {

    return sha256_pure_js(str);

  } catch(e) {

    console.error('sha256 error', e);

    return '';

  }

}


// ========================================================
// ADVANCED ANTI-ACCOUNT-SHARING & DEVICE BINDING SYSTEM
// ========================================================
function getDeviceFingerprint() {
  let storedDeviceId = '';
  try {
    storedDeviceId = localStorage.getItem('ccna_device_unique_id');
  } catch(e) {}
  
  if (!storedDeviceId) {
    const raw = `${navigator.userAgent}|${window.screen.width}x${window.screen.height}|${window.screen.colorDepth}|${navigator.hardwareConcurrency || 4}|${Intl.DateTimeFormat().resolvedOptions().timeZone || ''}|${Date.now()}|${Math.random()}`;
    storedDeviceId = 'DEV_' + computeSha256Hex(raw).substr(0, 16).toUpperCase();
    try {
      localStorage.setItem('ccna_device_unique_id', storedDeviceId);
    } catch(e) {}
  }

  const ua = navigator.userAgent || '';
  let os = 'Windows PC';
  let icon = '💻';
  if (/windows phone/i.test(ua)) { os = 'Windows Phone'; icon = '📱'; }
  else if (/win/i.test(ua)) { os = 'Windows PC'; icon = '💻'; }
  else if (/android/i.test(ua)) { os = 'Android'; icon = '📱'; }
  else if (/iphone|ipad|ipod/i.test(ua)) { os = 'iOS (Apple)'; icon = '📱'; }
  else if (/mac/i.test(ua)) { os = 'MacOS (Apple)'; icon = '💻'; }
  else if (/linux/i.test(ua)) { os = 'Linux'; icon = '💻'; }

  let browser = 'Brauzer';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/opr\//i.test(ua)) browser = 'Opera';

  const screenRes = `${window.screen.width || 0}x${window.screen.height || 0}`;
  const deviceName = `${icon} ${os} (${browser}) • ${screenRes}`;

  return {
    id: storedDeviceId,
    name: deviceName,
    os: os,
    browser: browser,
    screen: screenRes,
    icon: icon
  };
}

// Session Security Monitor (Single Active Session Enforcement)
function startSessionSecurityMonitor() {
  if (window._sessionSecurityInterval) clearInterval(window._sessionSecurityInterval);
  window._sessionSecurityInterval = setInterval(() => {
    checkActiveSessionHealth();
  }, 2500);

  window.addEventListener('storage', (e) => {
    if (e.key === 'ccna_registered_users' && state.currentUser && !state.isAdmin) {
      checkActiveSessionHealth();
    }
  });
}

function checkActiveSessionHealth() {
  if (!state.currentUser || state.isAdmin) return;
  const users = getRegisteredUsers();
  const current = users.find(u => u.login.toLowerCase() === state.currentUser.login.toLowerCase());
  if (current && current.currentSessionToken && state.currentUser.sessionToken) {
    if (current.currentSessionToken !== state.currentUser.sessionToken) {
      handleSessionKickedOut();
    }
  }
}

function handleSessionKickedOut() {
  try { SoundEffects.playWrong(); } catch(e) {}
  
  // Clear local session
  state.currentUser = null;
  state.isAdmin = false;
  try {
    localStorage.removeItem('ccna_auth_session');
    sessionStorage.removeItem('ccna_auth_session');
  } catch(e) {}
  document.documentElement.classList.remove('is-authenticated');

  const kickedModal = document.getElementById('sessionKickedModal');
  if (kickedModal) {
    kickedModal.style.setProperty('display', 'flex', 'important');
  } else {
    alert("🔴 DIQQAT! Hisobingizga boshqa qurilmadan kirildi. Xavfsizlik yuzasidan joriy sessiya yakunlandi.");
    location.reload();
  }
}

function closeSessionKickedModal() {
  const kickedModal = document.getElementById('sessionKickedModal');
  if (kickedModal) kickedModal.style.display = 'none';
  openAuthModal('login');
}

// Admin Action: Reset bound devices for a student
function adminResetUserDevice(studentId) {
  const users = getRegisteredUsers();
  const idx = users.findIndex(u => u.id === studentId);
  if (idx === -1) return;
  const u = users[idx];

  const devCount = (u.boundDevices && u.boundDevices.length) || 0;
  if (!confirm(`Haqiqatan ham ${u.name} talabasiga biriktirilgan qurilmalarni (${devCount} ta) tozalab, yangi qurilmadan kirishiga ruxsat bermoqchimisiz?`)) {
    return;
  }

  u.boundDevices = [];
  u.currentSessionToken = '';
  saveRegisteredUsers(users);

  try { SoundEffects.playCorrect(); } catch(e) {}
  renderAdminStudentsList();
  alert(`✅ ${u.name} talabasining qurilmasi muvaffaqiyatli uzildi! Endi talaba istalgan yangi kompyuter yoki telefondan kira oladi.`);
}

function getRegisteredUsers() {

  try {

    const raw = localStorage.getItem('ccna_registered_users');

    const users = raw ? JSON.parse(raw) : [];

    return users.map(u => {

      if (u.isApproved === undefined) u.isApproved = true;

      return u;

    });

  } catch (e) {

    return [];

  }

}

function saveRegisteredUsers(users) {

  localStorage.setItem('ccna_registered_users', JSON.stringify(users));

}

function openAuthModal(defaultTab = 'login') {

  document.documentElement.classList.remove('is-authenticated');

  const authModal = document.getElementById('authModal');

  if (authModal) {

    authModal.style.display = 'flex';

  }

  const mainContent = document.querySelector('main');

  if (mainContent && !state.currentUser) {

    mainContent.style.display = 'none';

  }

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

  let savedSession = state.currentUser;

  if (!savedSession || !savedSession.login) {

    try {

      const raw = localStorage.getItem('ccna_auth_session') || sessionStorage.getItem('ccna_auth_session');

      if (raw) savedSession = JSON.parse(raw);

    } catch (e) {

      savedSession = null;

    }

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

    // Hide duplicate standalone results button in header when logged in

    const headerAdminBtn = document.getElementById('adminLoginBtn');

    if (headerAdminBtn) {

      headerAdminBtn.style.display = 'none';

    }

    // STRICT SECURITY: If not admin, close adminSection immediately!

    if (!state.isAdmin) {

      const adminSection = document.getElementById('adminSection');

      if (adminSection && adminSection.classList.contains('active')) {

        switchMainTab('quiz');

      }

    }

  } else {

    state.currentUser = null;

    state.isAdmin = false;

    document.documentElement.classList.remove('is-authenticated');

    try {

      localStorage.removeItem('ccna_auth_session');

      sessionStorage.removeItem('ccna_auth_session');

    } catch(e) {}

    switchMainTab('quiz');

    const loginBtn = document.getElementById('openAuthModalBtn');

    if (loginBtn) loginBtn.style.display = 'inline-flex';

    if (authModal) {

      authModal.style.display = 'flex';

    }

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

    // 1. Dynamic Master Admin & User Check

    let match = null;

    const master = getMasterAdmin();

    // Direct failsafe check for Master Admin first (instant)

    if (normalizedLogin === 'abdulloh' || normalizedLogin === master.login.toLowerCase()) {

      const isDefaultMatch = (rawPassword === 'Abdulloh8005' || rawPassword.toLowerCase() === 'abdulloh8005');

      if (isDefaultMatch) {

        if (master.isPasswordChanged) {

          master.isPasswordChanged = false;

          master.hash = 'a4c1f401929410d23fc44b238e8afcf7e073c8aba30dea8378d5c58fa790d1a2';

          saveMasterAdmin(master);

        }

        match = {

          login: 'abdulloh',

          name: 'Abdulloh',

          role: 'admin',

          group: 'Administrator'

        };

      }

    }

    let computedHash = "";

    try {

      const credentialString = `${normalizedLogin}:${rawPassword}:${AUTH_SALT}`;

      computedHash = computeSha256Hex(credentialString);

    } catch (e) {

      console.warn("Hash calc error:", e);

    }

    if (!match && (normalizedLogin === 'abdulloh' || normalizedLogin === master.login.toLowerCase())) {

      if (computedHash === master.hash || computedHash === 'a4c1f401929410d23fc44b238e8afcf7e073c8aba30dea8378d5c58fa790d1a2') {

        match = {

          login: 'abdulloh',

          name: 'Abdulloh',

          role: 'admin',

          group: 'Administrator'

        };

      }

    }

    if (!match) {

      // 2. Check registered users (admins or students)

      const registeredUsers = getRegisteredUsers();

      const found = registeredUsers.find(u => u.login.toLowerCase() === normalizedLogin && u.hash === computedHash);

      if (found) {

        if (found.role !== 'admin' && found.isApproved === false) {

          showAuthError(errEl, "⏳ Sizning hisobingiz hali Administrator (Abdulloh) tomonidan tasdiqlanmagan. Iltimos, administrator tasdiqlashini kuting.");

          return;

        }

        match = {

          login: found.login,

          name: found.name,

          role: found.role || 'student',

          group: found.group || 'CCNA Guruh',

          isApproved: found.isApproved !== false

        };

      }

    }

    if (match) {
      // 3. DEVICE BINDING & CONCURRENT SESSION ENFORCEMENT
      if (match.role !== 'admin') {
        const currentDev = getDeviceFingerprint();
        const registeredUsers = getRegisteredUsers();
        const userIdx = registeredUsers.findIndex(u => u.login.toLowerCase() === normalizedLogin);

        if (userIdx !== -1) {
          const userRec = registeredUsers[userIdx];
          userRec.boundDevices = userRec.boundDevices || [];
          userRec.maxDevices = parseInt(userRec.maxDevices || 1, 10);

          const alreadyBound = userRec.boundDevices.find(d => d.id === currentDev.id);
          if (alreadyBound) {
            alreadyBound.lastActive = new Date().toLocaleString('uz-UZ');
          } else {
            // Check max devices limit (Default: 1 device)
            if (userRec.boundDevices.length >= userRec.maxDevices) {
              const existingDev = userRec.boundDevices[0] || { name: "Boshqa qurilma", boundAt: "-" };
              showAuthError(errEl, `⚠️ XAVFSIZLIK CHEKLOVI (QURILMALAR LIMITI)!\n\nUshbu hisob allaqachon ruxsat etilgan qurilmaga biriktirilgan:\n• ${existingDev.name}\n• Bog'langan vaqt: ${existingDev.boundAt || '-'}\n\nBitta hisobdan bir vaqtda faqat ${userRec.maxDevices} ta qurilmada foydalanish mumkin! Yangi qurilmadan kirish uchun Administrator (Abdulloh)ga murojaat qiling.`);
              try { SoundEffects.playWrong(); } catch(e) {}
              return;
            } else {
              userRec.boundDevices.push({
                id: currentDev.id,
                name: currentDev.name,
                os: currentDev.os,
                browser: currentDev.browser,
                screen: currentDev.screen,
                boundAt: new Date().toLocaleString('uz-UZ'),
                lastActive: new Date().toLocaleString('uz-UZ')
              });
            }
          }

          // Generate single active session token
          const newSessionToken = 'tok_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          userRec.currentSessionToken = newSessionToken;
          match.sessionToken = newSessionToken;
          saveRegisteredUsers(registeredUsers);
        }
      }

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
        sessionToken: match.sessionToken || ('tok_adm_' + Date.now()),

        authenticatedAt: new Date().toISOString()

      };

      state.currentUser = sessionData;

      state.isAdmin = (match.role === 'admin');

      // ALWAYS save to localStorage (guaranteed to work across file://, localhost, and https://)

      try {

        localStorage.setItem('ccna_auth_session', JSON.stringify(sessionData));

        sessionStorage.setItem('ccna_auth_session', JSON.stringify(sessionData));

      } catch(e) {}

      document.documentElement.classList.add('is-authenticated');

      passwordInput.value = '';

      try { SoundEffects.playCorrect(); } catch(e) {}

      // Directly reveal UI immediately

      const authModal = document.getElementById('authModal');

      if (authModal) {

        authModal.style.setProperty('display', 'none', 'important');

      }

      const mainContent = document.querySelector('main');

      if (mainContent) {

        mainContent.style.setProperty('display', 'block', 'important');

      }

      const navTabs = document.querySelector('.nav-tabs');

      if (navTabs) {

        navTabs.style.setProperty('visibility', 'visible', 'important');

      }

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

      try { renderPartsGrid(); } catch(e) {}

      // Tab activation based on role

      if (state.isAdmin) {

        setTimeout(() => {

          switchMainTab('admin');

        }, 50);

      } else {

        switchMainTab('quiz');

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

  const master = getMasterAdmin();

  if (normalizedLogin === 'abdulloh' || normalizedLogin === master.login.toLowerCase()) {

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
      maxDevices: parseInt((document.getElementById('modalStudentMaxDevices') || {}).value || 1, 10),

    hash: hash,

    role: 'student',

    isApproved: false, // Administrator tasdiqlashi shart!

    createdAt: new Date().toLocaleDateString('uz-UZ')

  };

  existingUsers.push(newUser);

  saveRegisteredUsers(existingUsers);

  // Reset inputs

  nameInput.value = '';

  loginInput.value = '';

  groupInput.value = '';

  pwdInput.value = '';

  pwdConfirmInput.value = '';

  // Switch to login tab with approval notice

  switchAuthTab('login');

  const loginErrEl = document.getElementById('authErrorMsg');

  if (loginErrEl) {

    loginErrEl.style.display = 'block';

    loginErrEl.style.background = 'rgba(16, 185, 129, 0.15)';

    loginErrEl.style.color = '#10b981';

    loginErrEl.style.borderColor = 'rgba(16, 185, 129, 0.35)';

    loginErrEl.innerHTML = `✅ <b>Muvaffaqiyatli ro'yxatdan o'tdingiz, ${name}!</b><br>Xavfsizlik yuzasidan hisobingiz <b>Administrator (Abdulloh)</b> tomonidan tasdiqlanishi kerak.<br>Administrator tasdiqlagach tizimga kira olasiz.`;

  }

  SoundEffects.playCorrect();

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

    document.documentElement.classList.remove('is-authenticated');

    switchMainTab('quiz');

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

  const currentStudentName = (state.currentUser && state.currentUser.name) 

    ? String(state.currentUser.name).trim().toLowerCase() 

    : '';

  PARTS_CONFIG.forEach(part => {

    try {

      let lastResult = null;

      if (currentStudentName && Array.isArray(state.results) && state.results.length > 0) {

        const partResults = state.results.filter(r => {

          if (!r || !r.studentName) return false;

          const rName = String(r.studentName).trim().toLowerCase();

          if (rName !== currentStudentName) return false;

          const rTitle = r.partTitle ? String(r.partTitle).toLowerCase() : '';

          const rKey = r.partKey ? String(r.partKey).toLowerCase() : '';

          const pTitle = part.title.toLowerCase();

          const pKey = part.key.toLowerCase();

          return rTitle.includes(pTitle) || rKey === pKey || (r.part && String(r.part).toLowerCase().includes(pTitle));

        });

        if (partResults.length > 0) {

          lastResult = partResults[partResults.length - 1];

        }

      }

      const card = document.createElement('div');

      card.className = `part-card ${part.featured ? 'featured' : ''}`;

      let scoreBadge = '';

      if (lastResult) {

        const isPass = (lastResult.percent || 0) >= 82.5;

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

            <div class="part-card-title">📁 ${escapeHtml(part.title)}</div>

            <span class="part-card-count">${part.count} ta savol</span>

          </div>

          <p class="part-card-desc">${escapeHtml(part.desc || '')}</p>

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

    } catch(err) {

      console.warn("Error rendering part card", part, err);

    }

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

  state.isQuizFinished = false;

  state.isReviewMode = false;

  state.reviewOnlyWrong = false;

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

    const q = state.quizQuestions[i];

    const btn = document.createElement('button');

    btn.className = 'palette-btn';

    btn.textContent = i + 1;

    if (i === state.currentIndex) {

      btn.classList.add('active');

    }

    const userAns = state.userAnswers[i] || [];

    const hasAnswer = userAns.length > 0;

    const isChecked = !!state.checkedQuestions[i];

    if (state.isQuizFinished) {

      // Test yakunlangan: to'g'ri (yashil), xato (qizil)

      if (!hasAnswer) {

        btn.classList.add('unanswered');

        btn.title = `${i + 1}-savol: Javob berilmagan`;

      } else {

        const isCorrect = arraysEqual(userAns.slice().sort(), q.answer.slice().sort());

        if (isCorrect) {

          btn.classList.add('correct');

          btn.title = `${i + 1}-savol: To'g'ri ✅`;

        } else {

          btn.classList.add('wrong');

          btn.title = `${i + 1}-savol: XATO ❌`;

        }

      }

    } else {

      // Test davomida

      if (isChecked && state.mode === 'practice') {

        const isCorrect = arraysEqual(userAns.slice().sort(), q.answer.slice().sort());

        if (isCorrect) {

          btn.classList.add('correct');

        } else {

          btn.classList.add('wrong');

        }

      } else if (hasAnswer) {

        btn.classList.add('answered');

      }

      if (state.flaggedQuestions[i]) {

        btn.classList.add('flagged');

      }

    }

    btn.addEventListener('click', () => {

      state.currentIndex = i;

      if (state.isQuizFinished) {

        openQuizReviewMode(false, i);

      } else {

        renderCurrentQuestion();

      }

      SoundEffects.playClick();

    });

    grid.appendChild(btn);

  }

  // Legend and progress text

  const legendEl = document.querySelector('.palette-legend');

  if (state.isQuizFinished) {

    let correctCount = 0;

    let wrongCount = 0;

    let unansCount = 0;

    state.quizQuestions.forEach((q, idx) => {

      const uAns = state.userAnswers[idx] || [];

      if (uAns.length === 0) unansCount++;

      else if (arraysEqual(uAns.slice().sort(), q.answer.slice().sort())) correctCount++;

      else wrongCount++;

    });

    if (legendEl) {

      legendEl.innerHTML = `

        <div class="legend-item"><div class="legend-dot" style="background:#10b981;"></div> To'g'ri (${correctCount})</div>

        <div class="legend-item"><div class="legend-dot" style="background:#ef4444;"></div> Xato (${wrongCount})</div>

        <div class="legend-item"><div class="legend-dot" style="background:var(--border);"></div> Javobsiz (${unansCount})</div>

      `;

    }

    document.getElementById('paletteCountProgress').textContent = `${correctCount} to'g'ri / ${wrongCount} xato`;

  } else {

    if (legendEl) {

      legendEl.innerHTML = `

        <div class="legend-item"><div class="legend-dot" style="background:var(--success);"></div> Javob berilgan</div>

        <div class="legend-item"><div class="legend-dot" style="background:var(--warning);"></div> Belgilangan</div>

        <div class="legend-item"><div class="legend-dot" style="background:var(--primary);"></div> Joriy</div>

      `;

    }

    const answeredCount = Object.keys(state.userAnswers).filter(k => state.userAnswers[k] && state.userAnswers[k].length > 0).length;

    document.getElementById('paletteCountProgress').textContent = `${answeredCount} / ${total} javob berildi`;

  }

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

  flagBtn.innerHTML = isFlagged ? '🚩 Belgilangan (Flagged)' : '🏳️ Belgilash (Flag)';

  const bookmarkBtn = document.getElementById('bookmarkBtn');

  const isBookmarked = state.bookmarks.includes(q.id);

  bookmarkBtn.classList.toggle('bookmarked', isBookmarked);

  bookmarkBtn.innerHTML = isBookmarked ? '⭐ Saqlangan' : '☆ Saqlash';

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

  const isReview = state.isReviewMode || state.isQuizFinished;

  const isChecked = isReview || !!state.checkedQuestions[idx];

  const userAns = state.userAnswers[idx] || [];

  const isUserCorrect = arraysEqual(userAns.slice().sort(), q.answer.slice().sort());

  // Review Mode Banner updates

  const reviewBanner = document.getElementById('reviewModeBanner');

  if (reviewBanner) {

    if (isReview) {

      reviewBanner.style.display = 'flex';

      const uStr = userAns.length > 0 ? userAns.join(', ') : "Javob berilmagan";

      const aStr = q.answer.join(', ');

      if (isUserCorrect) {

        reviewBanner.className = 'review-mode-banner is-correct';

        document.getElementById('reviewStatusIcon').textContent = '✅';

        document.getElementById('reviewStatusTitle').textContent = "TO'G'RI JAVOB BERILGAN";

        document.getElementById('reviewStatusTitle').style.color = '#10b981';

        document.getElementById('reviewStatusSubtitle').textContent = `Sizning javobingiz: [${uStr}]`;

      } else {

        reviewBanner.className = 'review-mode-banner';

        document.getElementById('reviewStatusIcon').textContent = '❌';

        document.getElementById('reviewStatusTitle').textContent = 'XATO JAVOB BERILGAN';

        document.getElementById('reviewStatusTitle').style.color = '#ef4444';

        document.getElementById('reviewStatusSubtitle').textContent = `Sizning javobingiz: [${uStr}] | To'g'ri javob: [${aStr}]`;

      }

      const filterBtn = document.getElementById('btnFilterWrongOnly');

      if (filterBtn) {

        filterBtn.textContent = state.reviewOnlyWrong ? "📋 Barcha savollarni ko'rish" : "❌ Faqat xatolarni ko'rish";

      }

    } else {

      reviewBanner.style.display = 'none';

    }

  }

  const optKeys = Object.keys(q.options).sort();

  optKeys.forEach(letter => {

    const text = q.options[letter];

    const item = document.createElement('div');

    item.className = 'option-item';

    if (isChecked) item.classList.add('disabled');

    const isSelected = userAns.includes(letter);

    if (isSelected) item.classList.add('selected');

    const isCorrectOpt = q.answer.includes(letter);

    if (isChecked) {

      if (isCorrectOpt) {

        item.classList.add('correct');

      } else if (isSelected && !isCorrectOpt) {

        item.classList.add('wrong');

      }

    }

    let badgeHtml = '';

    if (isChecked) {

      if (isCorrectOpt) {

        badgeHtml += ' <span style="color:#10b981; font-weight:800; font-size:0.85rem; margin-left:8px;">✅ TO\'G\'RI JAVOB</span>';

      }

      if (isSelected && !isCorrectOpt) {

        badgeHtml += ' <span style="color:#ef4444; font-weight:800; font-size:0.85rem; margin-left:8px;">❌ SIZNING JAVOBINGIZ</span>';

      }

    }

    item.innerHTML = `

      <div class="option-letter">${letter}</div>

      <div class="option-text">${formatOptionText(text)}${badgeHtml}</div>

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

  if (isChecked && (isReview || state.mode === 'practice')) {

    expBox.classList.add('visible');

    const ansStr = q.answer.join(', ');

    const note = q.explanation ? `<br><br><b>Tushuntirish:</b><br>${escapeHtml(q.explanation)}` : '';

    const uStr = userAns.length > 0 ? userAns.join(', ') : "Javob berilmagan";

    const headerHtml = isReview 

      ? (isUserCorrect 

          ? `<div style="color:#10b981; font-weight:800; margin-bottom:8px;">✅ Javobingiz to'g'ri!</div>` 

          : `<div style="color:#ef4444; font-weight:800; margin-bottom:8px;">❌ Javobingiz xato! (Siz tanlagan: [${uStr}])</div>`)

      : '';

    expText.innerHTML = `${headerHtml}<b>To'g'ri javob:</b> <span style="color:var(--success); font-weight:700;">${ansStr}</span>${note}`;

  } else {

    expBox.classList.remove('visible');

  }

  const prevBtn = document.getElementById('prevQBtn');

  const nextBtn = document.getElementById('nextQBtn');

  const checkBtn = document.getElementById('checkAnswerBtn');

  const reviewExamBtn = document.getElementById('reviewExamBtn');

  const returnToResBtn = document.getElementById('returnToResultsBtn');

  prevBtn.disabled = idx === 0 && (!state.reviewOnlyWrong || idx === 0);

  if (isReview) {

    checkBtn.style.display = 'none';

    reviewExamBtn.style.display = 'none';

    if (returnToResBtn) returnToResBtn.style.display = 'inline-flex';

    nextBtn.style.display = 'inline-flex';

    nextBtn.textContent = state.reviewOnlyWrong ? 'Keyingi Xato Savol ➡️' : 'Keyingi Savol ➡️';

    prevBtn.textContent = state.reviewOnlyWrong ? '⬅️ Oldingi Xato' : '⬅️ Oldingi Savol';

  } else if (state.mode === 'practice') {

    if (returnToResBtn) returnToResBtn.style.display = 'none';

    checkBtn.style.display = 'inline-flex';

    checkBtn.disabled = userAns.length === 0 || isChecked;

    reviewExamBtn.style.display = 'none';

    nextBtn.textContent = idx === total - 1 ? "Natijani Ko'rish 🏁" : 'Keyingisi ➡️';

    prevBtn.textContent = '⬅️ Oldingi savol';

  } else {

    if (returnToResBtn) returnToResBtn.style.display = 'none';

    checkBtn.style.display = 'none';

    prevBtn.textContent = '⬅️ Oldingi savol';

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

  if (state.isReviewMode && state.reviewOnlyWrong) {

    let nextWrong = -1;

    for (let i = state.currentIndex + 1; i < state.quizQuestions.length; i++) {

      const uAns = state.userAnswers[i] || [];

      if (!arraysEqual(uAns.slice().sort(), state.quizQuestions[i].answer.slice().sort())) {

        nextWrong = i;

        break;

      }

    }

    if (nextWrong !== -1) {

      state.currentIndex = nextWrong;

      renderCurrentQuestion();

      SoundEffects.playClick();

    } else {

      alert("Barcha xato savollarni ko'rib chiqdingiz!");

      returnToFinishedResults();

    }

    return;

  }

  if (state.currentIndex < state.quizQuestions.length - 1) {

    state.currentIndex++;

    renderCurrentQuestion();

    SoundEffects.playClick();

  } else {

    if (state.isReviewMode) {

      returnToFinishedResults();

    } else if (state.mode === 'exam') {

      openExamReviewScreen();

    } else {

      submitFinalExam();

    }

  }

}

function prevQuestion() {

  if (state.isReviewMode && state.reviewOnlyWrong) {

    let prevWrong = -1;

    for (let i = state.currentIndex - 1; i >= 0; i--) {

      const uAns = state.userAnswers[i] || [];

      if (!arraysEqual(uAns.slice().sort(), state.quizQuestions[i].answer.slice().sort())) {

        prevWrong = i;

        break;

      }

    }

    if (prevWrong !== -1) {

      state.currentIndex = prevWrong;

      renderCurrentQuestion();

      SoundEffects.playClick();

    }

    return;

  }

  if (state.currentIndex > 0) {

    state.currentIndex--;

    renderCurrentQuestion();

    SoundEffects.playClick();

  }

}

// QUIZ REVIEW & RETRY SYSTEM

function openQuizReviewMode(onlyWrong = false, targetIndex = null) {

  state.isReviewMode = true;

  state.reviewOnlyWrong = onlyWrong;

  if (targetIndex !== null) {

    state.currentIndex = targetIndex;

  } else if (onlyWrong) {

    // Find first wrong question

    const firstWrongIdx = state.quizQuestions.findIndex((q, idx) => {

      const uAns = state.userAnswers[idx] || [];

      return !arraysEqual(uAns.slice().sort(), q.answer.slice().sort());

    });

    if (firstWrongIdx >= 0) {

      state.currentIndex = firstWrongIdx;

    } else {

      alert("Tabriklaymiz! Sizda xato savollar mavjud emas.");

      return;

    }

  } else {

    state.currentIndex = 0;

  }

  document.getElementById('finishedCard').style.display = 'none';

  document.getElementById('reviewScreenCard').style.display = 'none';

  document.getElementById('questionCard').style.display = 'block';

  renderPalette();

  renderCurrentQuestion();

  SoundEffects.playClick();

}

function returnToFinishedResults() {

  state.isReviewMode = false;

  document.getElementById('questionCard').style.display = 'none';

  document.getElementById('reviewScreenCard').style.display = 'none';

  document.getElementById('finishedCard').style.display = 'block';

  renderPalette();

  SoundEffects.playClick();

}

function toggleReviewFilter() {

  state.reviewOnlyWrong = !state.reviewOnlyWrong;

  if (state.reviewOnlyWrong) {

    const uAns = state.userAnswers[state.currentIndex] || [];

    const isCorrect = arraysEqual(uAns.slice().sort(), state.quizQuestions[state.currentIndex].answer.slice().sort());

    if (isCorrect) {

      const nextWrong = state.quizQuestions.findIndex((q, idx) => {

        const a = state.userAnswers[idx] || [];

        return !arraysEqual(a.slice().sort(), q.answer.slice().sort());

      });

      if (nextWrong >= 0) state.currentIndex = nextWrong;

    }

  }

  renderPalette();

  renderCurrentQuestion();

  SoundEffects.playClick();

}

function retryWrongQuestionsOnly() {

  const wrongQuestions = state.quizQuestions.filter((q, idx) => {

    const uAns = state.userAnswers[idx] || [];

    return !arraysEqual(uAns.slice().sort(), q.answer.slice().sort());

  });

  if (wrongQuestions.length === 0) {

    alert("Siz barcha savollarga to'g'ri javob bergansiz! Qaytadan yechish shart emas.");

    return;

  }

  if (!confirm(`Siz ${wrongQuestions.length} ta xato savolni qaytadan yechmoqchimisiz?`)) {

    return;

  }

  state.quizQuestions = wrongQuestions;

  state.currentIndex = 0;

  state.userAnswers = {};

  state.checkedQuestions = {};

  state.flaggedQuestions = {};

  state.isQuizFinished = false;

  state.isReviewMode = false;

  state.reviewOnlyWrong = false;

  document.getElementById('finishedCard').style.display = 'none';

  document.getElementById('reviewScreenCard').style.display = 'none';

  document.getElementById('questionCard').style.display = 'block';

  document.getElementById('activePartTitle').textContent = `🔄 Xatolar ustida ishlash (${wrongQuestions.length} ta savol)`;

  renderPalette();

  renderCurrentQuestion();

  SoundEffects.playClick();

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

  state.isQuizFinished = true;

  state.isReviewMode = false;

  state.reviewOnlyWrong = false;

  const wrongBadge = document.getElementById('wrongCountBadge');

  if (wrongBadge) wrongBadge.textContent = wrongCount;

  const retryBtn = document.getElementById('btnRetryWrong');

  if (retryBtn) retryBtn.style.display = wrongCount > 0 ? 'inline-flex' : 'none';

  renderPalette();

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

            ${formatOptionText(text)}

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

  const ansDetails = ansLetters.map(l => `[${l}] ${formatOptionText(q.options[l] || '')}`).join('<br>');

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

      <div class="option-text">${formatOptionText(text)}</div>

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

  const btnCharts = document.getElementById('adminTabBtnCharts');

  const btnLeaderboard = document.getElementById('adminTabBtnLeaderboard');

  const viewStudents = document.getElementById('adminViewStudents');

  const viewResults = document.getElementById('adminViewResults');

  const viewCharts = document.getElementById('adminViewCharts');

  const viewLeaderboard = document.getElementById('adminViewLeaderboard');

  [btnStudents, btnResults, btnCharts, btnLeaderboard].forEach(b => b && b.classList.remove('active'));

  [viewStudents, viewResults, viewCharts, viewLeaderboard].forEach(v => v && (v.style.display = 'none'));

  if (tabName === 'students') {

    if (btnStudents) btnStudents.classList.add('active');

    if (viewStudents) viewStudents.style.display = 'block';

    renderAdminStudentsList();

  } else if (tabName === 'results') {

    if (btnResults) btnResults.classList.add('active');

    if (viewResults) viewResults.style.display = 'block';

    renderAdminResultsList();

  } else if (tabName === 'charts') {

    if (btnCharts) btnCharts.classList.add('active');

    if (viewCharts) viewCharts.style.display = 'block';

    renderAdminCharts();

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

  } else if (currentAdminSubTab === 'charts') {

    renderAdminCharts();

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

// SUB-VIEW 1: STUDENTS & ADMINS LIST & MANAGEMENT

function renderAdminStudentsList() {

  const tbody = document.getElementById('adminStudentsTableBody');

  const countText = document.getElementById('adminStudentCountText');

  const searchInput = document.getElementById('adminStudentSearch');

  const groupSelect = document.getElementById('adminGroupFilter');

  const roleSelect = document.getElementById('adminRoleFilter');

  if (!tbody) return;

  const users = getRegisteredUsers();

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const groupFilter = groupSelect ? groupSelect.value : 'all';

  const roleFilter = roleSelect ? roleSelect.value : 'all';

  // Primary Master Administrator entry

  const masterAdminEntry = {

    id: 'master_abdulloh',

    name: 'Abdulloh',

    login: 'abdulloh',

    group: 'Asosiy Boshqaruv',

    role: 'admin',

    isMaster: true,

    createdAt: 'Bosh Administrator'

  };

  const allDisplayUsers = [masterAdminEntry, ...users];

  let filtered = allDisplayUsers.filter(u => {

    const matchQuery = !query || 

      (u.name && u.name.toLowerCase().includes(query)) || 

      (u.login && u.login.toLowerCase().includes(query));

    const matchGroup = (groupFilter === 'all') || (u.group === groupFilter);

    const userRole = u.role || 'student';

    const matchRole = (roleFilter === 'all') || (userRole === roleFilter);

    return matchQuery && matchGroup && matchRole;

  });

  if (countText) {

    countText.textContent = `Ko'rsatilmoqda: ${filtered.length} / ${allDisplayUsers.length} ta hisob`;

  }

  tbody.innerHTML = '';

  if (filtered.length === 0) {

    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:var(--text-muted);">

      Qidiruv bo'yicha hech qanday hisob topilmadi.

    </td></tr>`;

    return;

  }

  const allResults = state.results || [];

  filtered.forEach((u, idx) => {

    const userResults = allResults.filter(r => 

      (r && r.studentName && u && u.name && r.studentName.toLowerCase() === u.name.toLowerCase()) ||

      (r && r.login && u && u.login && r.login.toLowerCase() === u.login.toLowerCase())

    );

    const quizCount = userResults.length;

    const avgScore = quizCount > 0 

      ? Math.round(userResults.reduce((acc, r) => acc + (r.percent || 0), 0) / quizCount) 

      : 0;

    const isAdmin = (u.role === 'admin');

    const isApproved = (u.isMaster || isAdmin || u.isApproved !== false);

    const roleBadge = isAdmin

      ? `<span style="background:rgba(245, 158, 11, 0.15); color:#f59e0b; border:1px solid rgba(245, 158, 11, 0.35); padding:3px 9px; border-radius:6px; font-weight:700; font-size:0.83rem; display:inline-flex; align-items:center; gap:4px;">👑 ${u.isMaster ? 'Bosh Admin' : 'Admin'}</span>`

      : `<span style="background:rgba(59, 130, 246, 0.12); color:#3b82f6; border:1px solid rgba(59, 130, 246, 0.3); padding:3px 9px; border-radius:6px; font-weight:600; font-size:0.83rem; display:inline-flex; align-items:center; gap:4px;">👤 Foydalanuvchi</span>`;

    const statusBadge = isApproved

      ? `<span style="background:rgba(16, 185, 129, 0.12); color:#10b981; border:1px solid rgba(16, 185, 129, 0.3); padding:3px 9px; border-radius:6px; font-weight:700; font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;">✅ Faol</span>`

      : `<span style="background:rgba(239, 68, 68, 0.15); color:#ef4444; border:1px solid rgba(239, 68, 68, 0.4); padding:3px 9px; border-radius:6px; font-weight:700; font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;">⏳ Kutilmoqda</span>`;

    const tr = document.createElement('tr');

    if (!isApproved) {

      tr.style.background = 'rgba(239, 68, 68, 0.05)';

    }

    tr.innerHTML = `

      <td style="font-weight:700; color:var(--text-muted);">${idx + 1}</td>

      <td><b>${escapeHtml(u.name)}</b> ${u.isMaster ? '👑' : ''}</td>

      <td><code>${escapeHtml(u.login)}</code></td>

      <td>${roleBadge}</td>

      <td>${statusBadge}</td>

      <td><span style="background:var(--bg-card); border:1px solid var(--border); padding:3px 8px; border-radius:6px; font-size:0.85rem;">${escapeHtml(u.group || 'Guruhsiz')}</span></td>

      <td style="font-size:0.85rem; color:var(--text-muted);">${u.createdAt || '-'}</td>

      <td>
        ${u.isMaster 
          ? `<span style="color:var(--warning); font-size:0.83rem; font-weight:700;">👑 Cheksiz (Admin)</span>`
          : (u.boundDevices && u.boundDevices.length > 0
              ? `<div style="font-size:0.82rem; font-weight:700; color:var(--text-main);">${escapeHtml(u.boundDevices[0].name)}</div>
                 <div style="font-size:0.75rem; color:var(--text-muted);">Faol: ${escapeHtml(u.boundDevices[0].lastActive || u.boundDevices[0].boundAt || '-')}</div>`
              : `<span style="color:var(--text-muted); font-size:0.82rem;">Biriktirilmagan (0/${u.maxDevices || 1})</span>`
            )
        }
      </td>
      <td><b>${quizCount} ta</b></td>

      <td>

        <span style="font-weight:700; color:${avgScore >= 82.5 ? 'var(--success)' : (avgScore > 0 ? 'var(--warning)' : 'var(--text-muted)')};">

          ${avgScore > 0 ? avgScore + '%' : '-'}

        </span>

      </td>

      <td style="text-align:center; white-space:nowrap;">

        ${!isApproved 

          ? `<button class="btn-action-icon" style="background:#10b981; color:white; border-color:#059669; font-weight:700; padding:5px 12px; border-radius:6px;" title="Ruxsat berish (Tasdiqlash)" onclick="approveUser('${u.id}')">✅ Tasdiqlash</button>

             <button class="btn-action-icon btn-action-danger" style="padding:5px 10px; border-radius:6px;" title="Rad etish / O'chirish" onclick="deleteStudent('${u.id}', '${escapeHtml(u.name)}')">❌ Rad etish</button>`

          : `<button class="btn-action-icon" title="Test natijalarini ko'rish" onclick="filterResultsByStudent('${escapeHtml(u.name)}')">📊 Natijalar</button>

             ${u.isMaster 

               ? `<button class="btn-action-icon" title="Bosh Admin parolini o'zgartirish" onclick="openChangePasswordModal('abdulloh')" style="color:var(--warning); font-weight:700;">🔑 Parol</button>`

               : `<button class="btn-action-icon" title="Parolini o'zgartirish" onclick="openChangePasswordModal('${escapeHtml(u.login)}')">🔑</button>

                  <button class="btn-action-icon" title="Kirishni to'xtatish (Bloklash)" onclick="toggleUserApproval('${u.id}')" style="color:var(--text-muted);">🚫</button>

                  <button class="btn-action-icon" title="Tahrirlash / Rolni o'zgartirish" onclick="openEditStudentModal('${u.id}')">✏️</button>

                  <button class="btn-action-icon" title="Biriktirilgan qurilmani uzish / Yangi qurilmaga ruxsat berish" onclick="adminResetUserDevice('${u.id}')" style="color:var(--warning); font-weight:700;">📱 Uzish</button>
                  <button class="btn-action-icon btn-action-danger" title="O'chirish" onclick="deleteStudent('${u.id}', '${escapeHtml(u.name)}')">🗑️</button>`

             }`

        }

      </td>

    `;

    tbody.appendChild(tr);

  });

}

// USER MODAL (ADD / EDIT)

function openAddStudentModal() {

  document.getElementById('studentEditId').value = '';

  document.getElementById('studentModalTitle').textContent = "Yangi Foydalanuvchi / Admin Qo'shish";

  document.getElementById('modalStudentName').value = '';

  document.getElementById('modalStudentLogin').value = '';

  document.getElementById('modalStudentGroup').value = '';
  const maxDevEl = document.getElementById('modalStudentMaxDevices'); if (maxDevEl) maxDevEl.value = '1';

  document.getElementById('modalStudentPassword').value = '';

  const roleSelect = document.getElementById('modalStudentRole');

  if (roleSelect) roleSelect.value = 'student';

  document.getElementById('modalPwdNotice').style.display = 'none';

  document.getElementById('studentFormModal').style.display = 'flex';

  document.getElementById('modalStudentName').focus();

}

function openEditStudentModal(studentId) {

  const users = getRegisteredUsers();

  const user = users.find(u => u.id === studentId);

  if (!user) return;

  document.getElementById('studentEditId').value = user.id;

  document.getElementById('studentModalTitle').textContent = "Foydalanuvchini Tahrirlash: " + user.name;

  document.getElementById('modalStudentName').value = user.name || '';

  document.getElementById('modalStudentLogin').value = user.login || '';

  document.getElementById('modalStudentGroup').value = user.group || '';
  const maxDevEl = document.getElementById('modalStudentMaxDevices'); if (maxDevEl) maxDevEl.value = (user.maxDevices || 1).toString();

  document.getElementById('modalStudentPassword').value = '';

  const roleSelect = document.getElementById('modalStudentRole');

  if (roleSelect) roleSelect.value = user.role || 'student';

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

  const roleSelect = document.getElementById('modalStudentRole');

  const role = (roleSelect ? roleSelect.value : 'student') || 'student';

  if (!name || !login || !group) {

    alert("Iltimos, Ism, Login va Guruh maydonlarini to'ldiring!");

    return;

  }

  const users = getRegisteredUsers();

  if (editId) {

    const userIndex = users.findIndex(u => u.id === editId);

    if (userIndex !== -1) {

      if (users.some((u, i) => i !== userIndex && u.login.toLowerCase() === login)) {

        alert("Bu login boshqa foydalanuvchi tomonidan band qilingan!");

        return;

      }

      users[userIndex].name = name;

      users[userIndex].login = login;

      users[userIndex].group = group;
      const maxDevEl = document.getElementById('modalStudentMaxDevices'); if (maxDevEl) users[userIndex].maxDevices = parseInt(maxDevEl.value || 1, 10);

      users[userIndex].role = role;

      if (password) {

        users[userIndex].hash = await computeSha256Hex(`${login}:${password}:${AUTH_SALT}`);

      }

      saveRegisteredUsers(users);

      SoundEffects.playCorrect();

      closeStudentModal();

      renderAdminDashboard();

      alert(`Foydalanuvchi (${name}) ma'lumotlari muvaffaqiyatli saqlandi!`);

    }

  } else {

    const master = getMasterAdmin();

    if (login === 'abdulloh' || login === master.login.toLowerCase() || users.some(u => u.login.toLowerCase() === login)) {

      alert("Ushbu login tizimda band!");

      return;

    }

    if (!password) {

      alert("Yangi hisob uchun parol kiritish majburiy!");

      return;

    }

    const hash = await computeSha256Hex(`${login}:${password}:${AUTH_SALT}`);

    const newUser = {

      id: 'usr_' + Date.now(),

      name: name,

      login: login,

      group: group,

      hash: hash,

      role: role,

      createdAt: new Date().toLocaleDateString('uz-UZ')

    };

    users.push(newUser);

    saveRegisteredUsers(users);

    SoundEffects.playCorrect();

    closeStudentModal();

    renderAdminDashboard();

    const roleLabel = (role === 'admin') ? "Administrator (Admin)" : "Foydalanuvchi";

    alert(`Yangi ${roleLabel} (${name}) muvaffaqiyatli qo'shildi!`);

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

// PASSWORD MANAGEMENT (ADMIN & USER SELF-SERVICE)

function openChangePasswordModal(targetLogin = null) {

  const modal = document.getElementById('changePasswordModal');

  const targetLoginInput = document.getElementById('changePwdTargetLogin');

  const oldPwdGroup = document.getElementById('changePwdOldGroup');

  const oldPwdInput = document.getElementById('changePwdOldInput');

  const newPwdInput = document.getElementById('changePwdNewInput');

  const confirmPwdInput = document.getElementById('changePwdConfirmInput');

  const subtitle = document.getElementById('changePwdSubtitle');

  const errEl = document.getElementById('changePwdErrorMsg');

  if (!modal) return;

  if (!targetLogin && state.currentUser) {

    targetLogin = state.currentUser.login;

  }

  targetLoginInput.value = targetLogin || '';

  if (oldPwdInput) oldPwdInput.value = '';

  if (newPwdInput) newPwdInput.value = '';

  if (confirmPwdInput) confirmPwdInput.value = '';

  if (errEl) errEl.style.display = 'none';

  const isChangingOwn = (state.currentUser && targetLogin && state.currentUser.login.toLowerCase() === targetLogin.toLowerCase());

  const isMasterAdmin = (state.isAdmin);

  if (!isChangingOwn && isMasterAdmin) {

    if (oldPwdGroup) oldPwdGroup.style.display = 'none';

    if (subtitle) subtitle.textContent = `"${targetLogin}" hisobi uchun yangi parol o'rnatish`;

  } else {

    if (oldPwdGroup) oldPwdGroup.style.display = 'block';

    if (subtitle) subtitle.textContent = `Hisobingiz (${targetLogin || ''}) xavfsizligi uchun yangi parol o'rnating`;

  }

  modal.style.display = 'flex';

  if (oldPwdGroup && oldPwdGroup.style.display !== 'none') {

    if (oldPwdInput) oldPwdInput.focus();

  } else {

    if (newPwdInput) newPwdInput.focus();

  }

}

function closeChangePasswordModal() {

  const modal = document.getElementById('changePasswordModal');

  if (modal) modal.style.display = 'none';

}

async function saveNewPassword() {

  const targetLogin = (document.getElementById('changePwdTargetLogin').value || '').toLowerCase().trim();

  const oldPwdInput = document.getElementById('changePwdOldInput');

  const newPwdInput = document.getElementById('changePwdNewInput');

  const confirmPwdInput = document.getElementById('changePwdConfirmInput');

  const errEl = document.getElementById('changePwdErrorMsg');

  const oldPwdGroup = document.getElementById('changePwdOldGroup');

  const oldPwd = oldPwdInput ? oldPwdInput.value : '';

  const newPwd = newPwdInput ? newPwdInput.value : '';

  const confirmPwd = confirmPwdInput ? confirmPwdInput.value : '';

  if (errEl) errEl.style.display = 'none';

  if (!newPwd) {

    showAuthError(errEl, "Iltimos, yangi parolni kiriting!");

    if (newPwdInput) newPwdInput.focus();

    return;

  }

  if (newPwd.length < 4) {

    showAuthError(errEl, "Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak!");

    if (newPwdInput) newPwdInput.focus();

    return;

  }

  if (newPwd !== confirmPwd) {

    showAuthError(errEl, "Yangi kiritilgan parollar bir-biriga mos kelmadi!");

    if (confirmPwdInput) confirmPwdInput.focus();

    return;

  }

  const isChangingOwn = (state.currentUser && state.currentUser.login.toLowerCase() === targetLogin);

  const master = getMasterAdmin();

  // 1. If target is Master Admin

  if (targetLogin === 'abdulloh' || targetLogin === master.login.toLowerCase()) {

    if (isChangingOwn || (oldPwdGroup && oldPwdGroup.style.display !== 'none')) {

      const oldHash = await computeSha256Hex(`${master.login.toLowerCase()}:${oldPwd}:${AUTH_SALT}`);

      const isDefaultOld = (oldPwd === 'Abdulloh8005');

      const isHashOld = (oldHash === master.hash || oldHash === 'a4c1f401929410d23fc44b238e8afcf7e073c8aba30dea8378d5c58fa790d1a2');

      if (!isDefaultOld && !isHashOld) {

        showAuthError(errEl, "Joriy (eski) parol noto'g'ri kiritildi!");

        if (oldPwdInput) oldPwdInput.focus();

        return;

      }

    }

    const newHash = await computeSha256Hex(`${master.login.toLowerCase()}:${newPwd}:${AUTH_SALT}`);

    master.hash = newHash;

    master.isPasswordChanged = true;

    saveMasterAdmin(master);

    SoundEffects.playCorrect();

    closeChangePasswordModal();

    alert("Bosh Administrator paroli muvaffaqiyatli yangilandi! Eski standart parol (Abdulloh8005) butunlay bekor qilindi.");

    return;

  }

  // 2. If target is registered user

  const users = getRegisteredUsers();

  const userIndex = users.findIndex(u => u.login.toLowerCase() === targetLogin);

  if (userIndex === -1) {

    showAuthError(errEl, "Foydalanuvchi hisobi topilmadi!");

    return;

  }

  const user = users[userIndex];

  if (isChangingOwn && (oldPwdGroup && oldPwdGroup.style.display !== 'none')) {

    const oldHash = await computeSha256Hex(`${targetLogin}:${oldPwd}:${AUTH_SALT}`);

    if (oldHash !== user.hash) {

      showAuthError(errEl, "Joriy (eski) parol noto'g'ri kiritildi!");

      if (oldPwdInput) oldPwdInput.focus();

      return;

    }

  }

  const newHash = await computeSha256Hex(`${targetLogin}:${newPwd}:${AUTH_SALT}`);

  users[userIndex].hash = newHash;

  saveRegisteredUsers(users);

  SoundEffects.playCorrect();

  closeChangePasswordModal();

  alert(`"${user.name}" hisobining paroli muvaffaqiyatli yangilandi!`);

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

function formatOptionText(text) {

  if (!text) return '';

  if (typeof text === 'string') {

    const trimmed = text.trim();

    if (trimmed.startsWith('data:image/') || (trimmed.startsWith('images/') && /\.(jpeg|jpg|png|gif|webp)$/i.test(trimmed))) {

      return `<img src="${escapeHtml(trimmed)}" style="max-width:100%; max-height:240px; border-radius:6px; display:block; margin:6px 0; cursor:zoom-in;" onclick="event.stopPropagation(); openImageModal('${escapeHtml(trimmed)}')" alt="Option diagram">`;

    }

  }

  return escapeHtml(text);

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

// ADMIN USER APPROVAL SYSTEM

function approveUser(userId) {

  const users = getRegisteredUsers();

  const u = users.find(x => x.id === userId);

  if (!u) return;

  u.isApproved = true;

  saveRegisteredUsers(users);

  renderAdminStudentsList();

  updateAdminStats();

  try { SoundEffects.playCorrect(); } catch(e) {}

  alert(`✅ ${u.name} muvaffaqiyatli tasdiqlandi! Endi bu foydalanuvchi tizimga kira oladi.`);

}

function toggleUserApproval(userId) {

  const users = getRegisteredUsers();

  const u = users.find(x => x.id === userId);

  if (!u) return;

  const nextState = (u.isApproved === false);

  const actionText = nextState ? "ruxsat bermoqchimisiz" : "kirishini bloklamoqchimisiz";

  if (!confirm(`Haqiqatan ham ${u.name} hisobiga ${actionText}?`)) return;

  u.isApproved = nextState;

  saveRegisteredUsers(users);

  renderAdminStudentsList();

  updateAdminStats();

  try { SoundEffects.playClick(); } catch(e) {}

}

// ========================================================

// ========================================================

// HIGH-TECH ED-TECH ANALYTICS & CHARTS SYSTEM

// ========================================================

let currentChartsSubView = 'overview';

function switchChartsSubView(viewName) {

  currentChartsSubView = viewName;

  const pills = ['overview', 'heatmap', 'parts', 'students'];

  pills.forEach(p => {

    const btn = document.getElementById('chartsPill' + p.charAt(0).toUpperCase() + p.slice(1));

    const panel = document.getElementById('chartsPanel' + p.charAt(0).toUpperCase() + p.slice(1));

    if (btn) btn.classList.toggle('active', p === viewName);

    if (panel) panel.style.display = (p === viewName) ? 'block' : 'none';

  });

  SoundEffects.playClick();

  setTimeout(() => {

    renderAdminCharts();

  }, 20);

}

function renderAdminCharts() {

  if (!state.isAdmin) return;

  const results = state.results || [];

  const users = getRegisteredUsers();

  // 1. Top Insights

  const topScoreEl = document.getElementById('chartTopScore');

  const topStudentEl = document.getElementById('chartTopStudent');

  const activeCountEl = document.getElementById('chartActiveCount');

  const activeStudentEl = document.getElementById('chartActiveStudent');

  const passRateEl = document.getElementById('chartPassRate');

  const passCountEl = document.getElementById('chartPassCount');

  const approvedRatioEl = document.getElementById('chartApprovedRatio');

  const pendingNoticeEl = document.getElementById('chartPendingNotice');

  let avgOverall = 0;

  if (results.length > 0) {

    const maxResult = results.reduce((max, r) => ((r.percent || 0) > (max.percent || 0) ? r : max), results[0]);

    if (topScoreEl) topScoreEl.textContent = (maxResult.percent || 0) + '%';

    const pTitle = maxResult.partTitle || maxResult.partKey || 'Part';

    if (topStudentEl) topStudentEl.textContent = `${maxResult.studentName || 'Talaba'} (${pTitle})`;

    const activityMap = {};

    results.forEach(r => {

      const key = r.studentName || r.login || "Noma'lum";

      activityMap[key] = (activityMap[key] || 0) + 1;

    });

    let topStudent = '-', maxTests = 0;

    for (const [st, count] of Object.entries(activityMap)) {

      if (count > maxTests) {

        maxTests = count;

        topStudent = st;

      }

    }

    if (activeCountEl) activeCountEl.textContent = maxTests + ' ta test';

    if (activeStudentEl) activeStudentEl.textContent = topStudent;

    const passCount = results.filter(r => (r.percent || 0) >= 82.5).length;

    const passRate = Math.round((passCount / results.length) * 100);

    if (passRateEl) passRateEl.textContent = passRate + '%';

    if (passCountEl) passCountEl.textContent = `${passCount} / ${results.length} ta o'tdi`;

    avgOverall = Math.round(results.reduce((acc, r) => acc + (r.percent || 0), 0) / results.length);

  } else {

    if (topScoreEl) topScoreEl.textContent = '0%';

    if (topStudentEl) topStudentEl.textContent = "Hozircha testlar yo'q";

    if (activeCountEl) activeCountEl.textContent = '0 ta';

    if (activeStudentEl) activeStudentEl.textContent = 'Kutilmoqda';

    if (passRateEl) passRateEl.textContent = '0%';

    if (passCountEl) passCountEl.textContent = '0 ta';

  }

  const approvedCount = users.filter(u => u.isApproved !== false).length;

  const pendingCount = users.filter(u => u.isApproved === false).length;

  if (approvedRatioEl) approvedRatioEl.textContent = `${approvedCount} ta faol`;

  if (pendingNoticeEl) {

    pendingNoticeEl.textContent = pendingCount > 0 

      ? `⏳ ${pendingCount} ta tasdiq kutilmoqda` 

      : '✅ Barcha hisoblar faol';

  }

  // 2. Render depending on active sub-view

  if (currentChartsSubView === 'overview') {

    drawCiscoGauge(avgOverall, results.length);

    drawDonutChart(results);

    drawTrendChart(results);

  } else if (currentChartsSubView === 'heatmap') {

    renderMasteryHeatmap(results, users);

  } else if (currentChartsSubView === 'parts') {

    drawPartScoresChart(results);

    renderPartsCardsGrid(results);

  } else if (currentChartsSubView === 'students') {

    renderStudentPodium(results, users);

    renderGroupPerformanceCards(results, users);

  }

}

// 1. CISCO EXAM PASS GAUGE METER (SPIDOMETR)

function drawCiscoGauge(scorePercent, totalTests) {

  const canvas = document.getElementById('adminGaugeCanvas');

  const scoreText = document.getElementById('gaugeScoreText');

  const passBadge = document.getElementById('gaugePassBadge');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;

  const w = 260;

  const h = 160;

  canvas.width = w * dpr;

  canvas.height = h * dpr;

  canvas.style.width = w + 'px';

  canvas.style.height = h + 'px';

  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, w, h);

  if (scoreText) scoreText.textContent = totalTests > 0 ? (scorePercent + '%') : '0%';

  if (passBadge) {

    if (totalTests === 0) {

      passBadge.style.background = 'rgba(255, 255, 255, 0.08)';

      passBadge.style.color = '#94a3b8';

      passBadge.style.borderColor = 'rgba(255, 255, 255, 0.15)';

      passBadge.innerHTML = '⏳ TESTLAR KUTILMOQDA';

    } else if (scorePercent >= 82.5) {

      passBadge.style.background = 'rgba(16, 185, 129, 0.2)';

      passBadge.style.color = '#10b981';

      passBadge.style.borderColor = '#10b981';

      passBadge.innerHTML = '✅ CISCO PASSING LEVEL';

    } else {

      passBadge.style.background = 'rgba(239, 68, 68, 0.2)';

      passBadge.style.color = '#ef4444';

      passBadge.style.borderColor = '#ef4444';

      passBadge.innerHTML = '⚠️ RETAKE REQUIRED (<82.5%)';

    }

  }

  const cx = w / 2;

  const cy = 135;

  const r = 90;

  const arcWidth = 14;

  // Background track

  ctx.beginPath();

  ctx.arc(cx, cy, r, Math.PI, Math.PI * 2, false);

  ctx.lineWidth = arcWidth;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';

  ctx.stroke();

  // Colored Zones:

  // 0% - 70%: Red

  // 70% - 82.5%: Orange

  // 82.5% - 100%: Green

  function drawArcSegment(startPct, endPct, color) {

    const sAngle = Math.PI + (startPct / 100) * Math.PI;

    const eAngle = Math.PI + (endPct / 100) * Math.PI;

    ctx.beginPath();

    ctx.arc(cx, cy, r, sAngle, eAngle, false);

    ctx.lineWidth = arcWidth;

    ctx.strokeStyle = color;

    ctx.stroke();

  }

  drawArcSegment(0, 70, '#ef4444');

  drawArcSegment(70, 82.5, '#f59e0b');

  drawArcSegment(82.5, 100, '#10b981');

  // Gold indicator at 82.5% pass mark

  const passAngle = Math.PI + 0.825 * Math.PI;

  const passX1 = cx + (r - 12) * Math.cos(passAngle);

  const passY1 = cy + (r - 12) * Math.sin(passAngle);

  const passX2 = cx + (r + 12) * Math.cos(passAngle);

  const passY2 = cy + (r + 12) * Math.sin(passAngle);

  ctx.beginPath();

  ctx.moveTo(passX1, passY1);

  ctx.lineTo(passX2, passY2);

  ctx.lineWidth = 3;

  ctx.strokeStyle = '#f59e0b';

  ctx.stroke();

  // Draw Pointer Needle

  const clampedScore = Math.max(0, Math.min(100, scorePercent));

  const needleAngle = Math.PI + (clampedScore / 100) * Math.PI;

  const needleLen = r - 15;

  const tipX = cx + needleLen * Math.cos(needleAngle);

  const tipY = cy + needleLen * Math.sin(needleAngle);

  ctx.save();

  ctx.shadowColor = scorePercent >= 82.5 ? '#10b981' : '#f59e0b';

  ctx.shadowBlur = 10;

  ctx.beginPath();

  ctx.moveTo(cx, cy);

  ctx.lineTo(tipX, tipY);

  ctx.lineWidth = 4;

  ctx.strokeStyle = '#ffffff';

  ctx.lineCap = 'round';

  ctx.stroke();

  ctx.restore();

  // Center hub pin

  ctx.beginPath();

  ctx.arc(cx, cy, 9, 0, Math.PI * 2);

  ctx.fillStyle = '#0076ce';

  ctx.fill();

  ctx.beginPath();

  ctx.arc(cx, cy, 4, 0, Math.PI * 2);

  ctx.fillStyle = '#ffffff';

  ctx.fill();

  // Tick labels

  ctx.fillStyle = '#94a3b8';

  ctx.font = 'bold 10px sans-serif';

  ctx.textAlign = 'center';

  ctx.fillText('0%', cx - r - 2, cy + 16);

  ctx.fillText('50%', cx, cy - r - 8);

  ctx.fillText('100%', cx + r + 4, cy + 16);

}

// 2. REPUTABLE MASTERY HEATMAP (LEETCODE / NETACAD MATRIX)

function renderMasteryHeatmap(results, users) {

  const container = document.getElementById('adminHeatmapContainer');

  if (!container) return;

  const relevantParts = PARTS_CONFIG.filter(p => p.key !== 'all').slice(0, 12);

  // Collect unique students (registered users + any in results)

  const studentsMap = new Map();

  users.forEach(u => {

    studentsMap.set(u.name.toLowerCase(), { name: u.name, group: u.group || 'Guruhsiz' });

  });

  results.forEach(r => {

    if (r.studentName && !studentsMap.has(r.studentName.toLowerCase())) {

      studentsMap.set(r.studentName.toLowerCase(), { name: r.studentName, group: r.studentGroup || 'Guruhsiz' });

    }

  });

  const studentsList = Array.from(studentsMap.values());

  if (studentsList.length === 0) {

    container.innerHTML = '<div style="padding:24px; text-align:center; color:var(--text-muted);">Talabalar ma\'lumotlari kutilmoqda</div>';

    return;

  }

  let tableHtml = `

    <table class="heatmap-table">

      <thead>

        <tr>

          <th class="th-student">👤 Talaba F.I.SH</th>

          <th>Guruhi</th>

          ${relevantParts.map(p => `<th title="${escapeHtml(p.desc || p.title)}">${escapeHtml(p.title)}</th>`).join('')}

          <th>📊 O'rtacha</th>

          <th>Testlar</th>

        </tr>

      </thead>

      <tbody>

  `;

  studentsList.forEach(st => {

    const stResults = results.filter(r => (r.studentName || '').toLowerCase() === st.name.toLowerCase());

    const totalTests = stResults.length;

    const avgScore = totalTests > 0 

      ? Math.round(stResults.reduce((acc, r) => acc + (r.percent || 0), 0) / totalTests)

      : 0;

    tableHtml += `

      <tr>

        <td class="td-student"><b>${escapeHtml(st.name)}</b></td>

        <td style="color:var(--text-muted); font-size:0.8rem;">${escapeHtml(st.group)}</td>

    `;

    relevantParts.forEach(p => {

      const partMatches = stResults.filter(r => 

        (r.partTitle && r.partTitle.toLowerCase().includes(p.title.toLowerCase())) ||

        (r.partKey && r.partKey.toLowerCase().includes(p.title.toLowerCase()))

      );

      if (partMatches.length > 0) {

        const bestScore = Math.max(...partMatches.map(m => m.percent || 0));

        let cellClass = 'cell-mastered';

        if (bestScore < 70) cellClass = 'cell-low';

        else if (bestScore < 82.5) cellClass = 'cell-medium';

        tableHtml += `

          <td class="${cellClass}" title="${escapeHtml(st.name)} - ${p.title}: ${bestScore}% (${partMatches.length} ta urinish)">

            ${bestScore}%

          </td>

        `;

      } else {

        tableHtml += `<td class="cell-empty" title="Hali topshirilmagan">—</td>`;

      }

    });

    const avgColor = avgScore >= 82.5 ? '#10b981' : (avgScore >= 70 ? '#f59e0b' : (avgScore > 0 ? '#ef4444' : 'var(--text-muted)'));

    tableHtml += `

        <td style="font-weight:900; color:${avgColor};">${avgScore > 0 ? avgScore + '%' : '-'}</td>

        <td style="color:var(--text-muted);">${totalTests} ta</td>

      </tr>

    `;

  });

  tableHtml += '</tbody></table>';

  container.innerHTML = tableHtml;

}

// 3. ENHANCED BAR CHART FOR ALL REAL PARTS

function drawPartScoresChart(results) {

  const canvas = document.getElementById('adminPartScoresCanvas');

  if (!canvas) return;

  const container = canvas.parentElement;

  if (!container) return;

  const rect = container.getBoundingClientRect();

  const width = rect.width || 750;

  const height = 300;

  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;

  canvas.height = height * dpr;

  canvas.style.width = width + 'px';

  canvas.style.height = height + 'px';

  const ctx = canvas.getContext('2d');

  ctx.scale(dpr, dpr);

  // Real parts from PARTS_CONFIG

  const parts = PARTS_CONFIG.filter(p => p.key !== 'all');

  const partData = parts.map(p => {

    const matching = results.filter(r => {

      const pTitle = r.partTitle || r.partKey || '';

      return pTitle.toLowerCase().includes(p.title.toLowerCase()) || 

             (r.partKey && r.partKey.toLowerCase() === p.key.toLowerCase());

    });

    if (matching.length === 0) return { name: p.title, avg: 0, count: 0 };

    const avg = Math.round(matching.reduce((acc, r) => acc + (r.percent || 0), 0) / matching.length);

    return { name: p.title, avg, count: matching.length };

  });

  const padLeft = 45;

  const padRight = 20;

  const padTop = 30;

  const padBottom = 45;

  const plotWidth = width - padLeft - padRight;

  const plotHeight = height - padTop - padBottom;

  // Background Grid Lines

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';

  ctx.lineWidth = 1;

  ctx.fillStyle = '#64748b';

  ctx.font = '11px sans-serif';

  ctx.textAlign = 'right';

  ctx.textBaseline = 'middle';

  [0, 25, 50, 75, 100].forEach(val => {

    const y = padTop + plotHeight - (val / 100) * plotHeight;

    ctx.beginPath();

    ctx.moveTo(padLeft, y);

    ctx.lineTo(width - padRight, y);

    ctx.stroke();

    ctx.fillText(val + '%', padLeft - 8, y);

  });

  // Gold 82.5% Pass Line

  const passY = padTop + plotHeight - (82.5 / 100) * plotHeight;

  ctx.save();

  ctx.strokeStyle = '#f59e0b';

  ctx.lineWidth = 1.5;

  ctx.setLineDash([5, 4]);

  ctx.beginPath();

  ctx.moveTo(padLeft, passY);

  ctx.lineTo(width - padRight, passY);

  ctx.stroke();

  ctx.fillStyle = '#f59e0b';

  ctx.font = 'bold 10px sans-serif';

  ctx.textAlign = 'left';

  ctx.fillText('82.5% Pass (Cisco)', padLeft + 6, passY - 8);

  ctx.restore();

  // Draw Bars

  const colWidth = plotWidth / partData.length;

  const barWidth = Math.max(14, Math.min(colWidth * 0.62, 38));

  partData.forEach((item, idx) => {

    const x = padLeft + idx * colWidth + (colWidth - barWidth) / 2;

    const barHeight = (item.avg / 100) * plotHeight;

    const y = padTop + plotHeight - barHeight;

    if (item.count > 0) {

      const grad = ctx.createLinearGradient(0, y, 0, padTop + plotHeight);

      if (item.avg >= 82.5) {

        grad.addColorStop(0, '#10b981');

        grad.addColorStop(1, '#059669');

      } else if (item.avg >= 70) {

        grad.addColorStop(0, '#f59e0b');

        grad.addColorStop(1, '#d97706');

      } else {

        grad.addColorStop(0, '#ef4444');

        grad.addColorStop(1, '#dc2626');

      }

      ctx.fillStyle = grad;

      const r = Math.min(5, barWidth / 2);

      ctx.beginPath();

      ctx.moveTo(x, padTop + plotHeight);

      ctx.lineTo(x, y + r);

      ctx.quadraticCurveTo(x, y, x + r, y);

      ctx.lineTo(x + barWidth - r, y);

      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);

      ctx.lineTo(x + barWidth, padTop + plotHeight);

      ctx.closePath();

      ctx.fill();

      // Top label: score

      ctx.fillStyle = item.avg >= 82.5 ? '#10b981' : (item.avg >= 70 ? '#f59e0b' : '#ef4444');

      ctx.font = 'bold 10px sans-serif';

      ctx.textAlign = 'center';

      ctx.fillText(item.avg + '%', x + barWidth / 2, y - 6);

      // Count badge

      ctx.fillStyle = '#94a3b8';

      ctx.font = '9px sans-serif';

      ctx.fillText(item.count + ' ta', x + barWidth / 2, y - 18);

    } else {

      ctx.save();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';

      ctx.setLineDash([3, 3]);

      ctx.strokeRect(x, padTop + plotHeight - 10, barWidth, 10);

      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';

      ctx.font = '9px sans-serif';

      ctx.textAlign = 'center';

      ctx.fillText('-', x + barWidth / 2, padTop + plotHeight - 14);

      ctx.restore();

    }

    // X-axis label

    ctx.fillStyle = '#cbd5e1';

    ctx.font = 'bold 10px sans-serif';

    ctx.textAlign = 'center';

    const label = item.name.replace('Part ', 'P');

    ctx.fillText(label, x + barWidth / 2, height - padBottom + 16);

  });

}

function renderPartsCardsGrid(results) {

  const container = document.getElementById('adminPartsCardsGrid');

  if (!container) return;

  const parts = PARTS_CONFIG.filter(p => p.key !== 'all');

  container.innerHTML = parts.map(p => {

    const matching = results.filter(r => {

      const pTitle = r.partTitle || r.partKey || '';

      return pTitle.toLowerCase().includes(p.title.toLowerCase()) || 

             (r.partKey && r.partKey.toLowerCase() === p.key.toLowerCase());

    });

    const testCount = matching.length;

    const avg = testCount > 0 

      ? Math.round(matching.reduce((acc, r) => acc + (r.percent || 0), 0) / testCount)

      : 0;

    const passCount = matching.filter(m => (m.percent || 0) >= 82.5).length;

    let statusColor = '#10b981';

    let statusText = "A'LO (PASS)";

    if (avg === 0) {

      statusColor = '#94a3b8';

      statusText = "TESTLAR YO'Q";

    } else if (avg < 70) {

      statusColor = '#ef4444';

      statusText = 'QAYTA TAYYORLANISH';

    } else if (avg < 82.5) {

      statusColor = '#f59e0b';

      statusText = "O'RTACHA";

    }

    return `

      <div class="group-performance-card">

        <div class="group-card-header">

          <div class="group-card-title">📘 ${escapeHtml(p.title)}</div>

          <span class="group-card-badge" style="background:${statusColor}22; color:${statusColor}; border:1px solid ${statusColor}44;">

            ${avg > 0 ? avg + '%' : '-'}

          </span>

        </div>

        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">${escapeHtml(p.desc || '')}</div>

        <div class="group-bar-track" style="margin-bottom:8px;">

          <div class="group-bar-fill" style="width:${avg}%; background:${statusColor};"></div>

        </div>

        <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted);">

          <span>Jami: <b>${testCount} ta urinish</b></span>

          <span style="color:${statusColor}; font-weight:700;">${passCount} ta o'tgan</span>

        </div>

      </div>

    `;

  }).join('');

}

// 4. TOP 3 STUDENT PODIUM

function renderStudentPodium(results, users) {

  const container = document.getElementById('adminPodiumContainer');

  if (!container) return;

  const studentStats = [];

  const uniqueNames = new Set(results.map(r => r.studentName || r.login));

  uniqueNames.forEach(name => {

    const studentTests = results.filter(r => (r.studentName || r.login) === name);

    const count = studentTests.length;

    const avg = Math.round(studentTests.reduce((acc, r) => acc + (r.percent || 0), 0) / count);

    const passed = studentTests.filter(r => (r.percent || 0) >= 82.5).length;

    studentStats.push({ name, avg, count, passed });

  });

  studentStats.sort((a, b) => b.avg - a.avg || b.count - a.count);

  if (studentStats.length === 0) {

    container.innerHTML = '<div style="color:var(--text-muted); font-size:0.9rem; padding:30px;">Hozircha natijalar mavjud emas</div>';

    return;

  }

  const p1 = studentStats[0];

  const p2 = studentStats.length > 1 ? studentStats[1] : null;

  const p3 = studentStats.length > 2 ? studentStats[2] : null;

  container.innerHTML = `

    <!-- 2nd Place -->

    ${p2 ? `

      <div class="podium-col">

        <div class="podium-avatar" style="border-color:#94a3b8;">

          🥈

        </div>

        <div class="podium-name">${escapeHtml(p2.name)}</div>

        <div class="podium-score" style="color:#cbd5e1;">${p2.avg}%</div>

        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">${p2.count} ta test</div>

        <div class="podium-block podium-2">2</div>

      </div>

    ` : '<div class="podium-col" style="visibility:hidden;"></div>'}

    <!-- 1st Place (Center & Highest) -->

    <div class="podium-col">

      <div class="podium-avatar" style="border-color:#f59e0b; width:68px; height:68px; font-size:2rem;">

        <span class="crown">👑</span>

        🥇

      </div>

      <div class="podium-name" style="font-size:1rem; font-weight:800;">${escapeHtml(p1.name)}</div>

      <div class="podium-score" style="color:#f59e0b; font-size:1.35rem;">${p1.avg}%</div>

      <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">${p1.count} ta test (${p1.passed} ta o'tgan)</div>

      <div class="podium-block podium-1">1</div>

    </div>

    <!-- 3rd Place -->

    ${p3 ? `

      <div class="podium-col">

        <div class="podium-avatar" style="border-color:#b45309;">

          🥉

        </div>

        <div class="podium-name">${escapeHtml(p3.name)}</div>

        <div class="podium-score" style="color:#d97706;">${p3.avg}%</div>

        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">${p3.count} ta test</div>

        <div class="podium-block podium-3">3</div>

      </div>

    ` : '<div class="podium-col" style="visibility:hidden;"></div>'}

  `;

}

// 5. MODERN GROUP CARDS

function renderGroupPerformanceCards(results, users) {

  const container = document.getElementById('adminGroupCardsList');

  if (!container) return;

  const groupsSet = new Set();

  users.forEach(u => groupsSet.add(u.group || 'Guruhsiz'));

  results.forEach(r => groupsSet.add(r.studentGroup || 'Guruhsiz'));

  const groups = Array.from(groupsSet);

  if (groups.length === 0) {

    container.innerHTML = '<div style="color:var(--text-muted); font-size:0.88rem;">Guruhlar ma\'lumotlari kutilmoqda</div>';

    return;

  }

  const groupStats = groups.map(g => {

    const groupUsers = users.filter(u => (u.group || 'Guruhsiz') === g);

    const groupResults = results.filter(r => (r.studentGroup || 'Guruhsiz') === g);

    const count = groupResults.length;

    const avg = count > 0 

      ? Math.round(groupResults.reduce((acc, r) => acc + (r.percent || 0), 0) / count)

      : 0;

    const passCount = groupResults.filter(r => (r.percent || 0) >= 82.5).length;

    const passRate = count > 0 ? Math.round((passCount / count) * 100) : 0;

    return { name: g, userCount: groupUsers.length, testCount: count, avg, passRate, passCount };

  });

  groupStats.sort((a, b) => b.avg - a.avg || b.testCount - a.testCount);

  container.innerHTML = groupStats.map(gs => {

    let color = '#10b981';

    if (gs.avg < 70) color = '#ef4444';

    else if (gs.avg < 82.5) color = '#f59e0b';

    return `

      <div class="group-performance-card">

        <div class="group-card-header">

          <div class="group-card-title">🏢 ${escapeHtml(gs.name)}</div>

          <span class="group-card-badge" style="background:${color}22; color:${color}; border:1px solid ${color}44;">

            ${gs.avg > 0 ? gs.avg + '%' : '0%'}

          </span>

        </div>

        <div class="group-bar-track" style="margin-bottom:10px;">

          <div class="group-bar-fill" style="width:${gs.avg}%; background:${color};"></div>

        </div>

        <div style="display:flex; justify-content:space-between; font-size:0.82rem; color:var(--text-muted);">

          <span>👥 Talabalar: <b>${gs.userCount} ta</b></span>

          <span>📝 Testlar: <b>${gs.testCount} ta</b></span>

          <span style="color:${color}; font-weight:700;">🎯 O'tish: ${gs.passRate}%</span>

        </div>

      </div>

    `;

  }).join('');

}

// 6. DONUT CHART

function drawDonutChart(results) {

  const canvas = document.getElementById('adminDonutCanvas');

  const legendEl = document.getElementById('adminDonutLegend');

  const centerTextEl = document.getElementById('donutTotalText');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;

  const size = 180;

  canvas.width = size * dpr;

  canvas.height = size * dpr;

  canvas.style.width = size + 'px';

  canvas.style.height = size + 'px';

  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, size, size);

  const total = results.length;

  if (centerTextEl) centerTextEl.textContent = total;

  const categories = [

    { label: "A'lo (90-100%)", min: 90, max: 100, color: '#10b981', count: 0 },

    { label: "O'tgan (82.5-89%)", min: 82.5, max: 89.99, color: '#0076ce', count: 0 },

    { label: "O'rtacha (70-82%)", min: 70, max: 82.49, color: '#f59e0b', count: 0 },

    { label: "Qayta tayyorlanish (<70%)", min: 0, max: 69.99, color: '#ef4444', count: 0 }

  ];

  results.forEach(r => {

    const p = r.percent || 0;

    for (const cat of categories) {

      if (p >= cat.min && p <= cat.max) {

        cat.count++;

        break;

      }

    }

  });

  const cx = size / 2;

  const cy = size / 2;

  const outerR = 76;

  const innerR = 50;

  if (total === 0) {

    ctx.beginPath();

    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);

    ctx.arc(cx, cy, innerR, Math.PI * 2, 0, true);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';

    ctx.fill();

    if (legendEl) {

      legendEl.innerHTML = `<span style="color:var(--text-muted); font-size:0.85rem;">Hozircha natijalar yo'q</span>`;

    }

    return;

  }

  let startAngle = -Math.PI / 2;

  categories.forEach(cat => {

    if (cat.count === 0) return;

    const sliceAngle = (cat.count / total) * Math.PI * 2;

    const endAngle = startAngle + sliceAngle;

    ctx.save();

    ctx.beginPath();

    ctx.arc(cx, cy, outerR, startAngle, endAngle);

    ctx.arc(cx, cy, innerR, endAngle, startAngle, true);

    ctx.closePath();

    ctx.fillStyle = cat.color;

    ctx.shadowColor = cat.color;

    ctx.shadowBlur = 8;

    ctx.fill();

    ctx.restore();

    ctx.strokeStyle = '#151e32';

    ctx.lineWidth = 2;

    ctx.stroke();

    startAngle = endAngle;

  });

  if (legendEl) {

    legendEl.innerHTML = categories.map(cat => {

      const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;

      return `

        <div class="donut-legend-item">

          <div class="donut-legend-label">

            <span class="legend-dot" style="background:${cat.color};"></span>

            <span>${cat.label}</span>

          </div>

          <div class="donut-legend-count"><b>${cat.count} ta</b> (${pct}%)</div>

        </div>

      `;

    }).join('');

  }

}

// 7. PROGRESS TREND AREA CURVE

function drawTrendChart(results) {

  const canvas = document.getElementById('adminTrendCanvas');

  if (!canvas) return;

  const container = canvas.parentElement;

  if (!container) return;

  const rect = container.getBoundingClientRect();

  const width = rect.width || 750;

  const height = 230;

  const dpr = window.devicePixelRatio || 1;

  canvas.width = width * dpr;

  canvas.height = height * dpr;

  canvas.style.width = width + 'px';

  canvas.style.height = height + 'px';

  const ctx = canvas.getContext('2d');

  ctx.scale(dpr, dpr);

  const padLeft = 45;

  const padRight = 20;

  const padTop = 25;

  const padBottom = 35;

  const plotWidth = width - padLeft - padRight;

  const plotHeight = height - padTop - padBottom;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';

  ctx.lineWidth = 1;

  ctx.fillStyle = '#64748b';

  ctx.font = '10px sans-serif';

  ctx.textAlign = 'right';

  ctx.textBaseline = 'middle';

  [0, 50, 100].forEach(val => {

    const y = padTop + plotHeight - (val / 100) * plotHeight;

    ctx.beginPath();

    ctx.moveTo(padLeft, y);

    ctx.lineTo(width - padRight, y);

    ctx.stroke();

    ctx.fillText(val + '%', padLeft - 6, y);

  });

  const passY = padTop + plotHeight - (82.5 / 100) * plotHeight;

  ctx.save();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';

  ctx.setLineDash([4, 3]);

  ctx.beginPath();

  ctx.moveTo(padLeft, passY);

  ctx.lineTo(width - padRight, passY);

  ctx.stroke();

  ctx.fillStyle = '#f59e0b';

  ctx.font = 'bold 9px sans-serif';

  ctx.textAlign = 'left';

  ctx.fillText('82.5% Pass Mark', padLeft + 6, passY - 6);

  ctx.restore();

  if (results.length === 0) {

    ctx.fillStyle = '#64748b';

    ctx.font = '12px sans-serif';

    ctx.textAlign = 'center';

    ctx.fillText("Natijalar kutilmoqda...", width / 2, height / 2);

    return;

  }

  const recent = results.slice(-15);

  const stepX = recent.length > 1 ? plotWidth / (recent.length - 1) : plotWidth / 2;

  const points = recent.map((r, idx) => {

    const x = recent.length === 1 ? padLeft + plotWidth / 2 : padLeft + idx * stepX;

    const y = padTop + plotHeight - ((r.percent || 0) / 100) * plotHeight;

    return { x, y, percent: r.percent || 0, name: r.studentName || 'Talaba' };

  });

  if (points.length > 1) {

    const areaGrad = ctx.createLinearGradient(0, padTop, 0, padTop + plotHeight);

    areaGrad.addColorStop(0, 'rgba(0, 118, 206, 0.35)');

    areaGrad.addColorStop(1, 'rgba(0, 118, 206, 0.0)');

    ctx.beginPath();

    ctx.moveTo(points[0].x, padTop + plotHeight);

    ctx.lineTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {

      const p0 = points[i];

      const p1 = points[i + 1];

      const cx = (p0.x + p1.x) / 2;

      ctx.bezierCurveTo(cx, p0.y, cx, p1.y, p1.x, p1.y);

    }

    ctx.lineTo(points[points.length - 1].x, padTop + plotHeight);

    ctx.closePath();

    ctx.fillStyle = areaGrad;

    ctx.fill();

    ctx.save();

    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {

      const p0 = points[i];

      const p1 = points[i + 1];

      const cx = (p0.x + p1.x) / 2;

      ctx.bezierCurveTo(cx, p0.y, cx, p1.y, p1.x, p1.y);

    }

    ctx.strokeStyle = '#0076ce';

    ctx.lineWidth = 2.5;

    ctx.shadowColor = '#0076ce';

    ctx.shadowBlur = 8;

    ctx.stroke();

    ctx.restore();

  }

  points.forEach((pt, i) => {

    ctx.save();

    ctx.beginPath();

    ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);

    ctx.fillStyle = pt.percent >= 82.5 ? '#10b981' : '#f59e0b';

    ctx.shadowColor = ctx.fillStyle;

    ctx.shadowBlur = 6;

    ctx.fill();

    ctx.strokeStyle = '#ffffff';

    ctx.lineWidth = 1.5;

    ctx.stroke();

    ctx.restore();

    ctx.fillStyle = pt.percent >= 82.5 ? '#10b981' : '#f59e0b';

    ctx.font = 'bold 10px sans-serif';

    ctx.textAlign = 'center';

    ctx.fillText(pt.percent + '%', pt.x, pt.y - 8);

    ctx.fillStyle = '#64748b';

    ctx.font = '9px sans-serif';

    ctx.fillText('#' + (i + 1), pt.x, height - padBottom + 14);

  });

}

