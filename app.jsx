const { useState } = React;


const Crown = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12l3-7 5 5 4-7 4 7 5-5 3 7v7H2v-7z" /></svg>);
const Swords = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5" /><path d="M10 6L3 13l5 5 7-7" /></svg>);
const Coins = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /></svg>);
const Wheat = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 22 16 8" /><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94z" /><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94z" /></svg>);
const Shield = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
const Scroll = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" /><path d="M19 17V5a2 2 0 0 0-2-2H4" /></svg>);
const Calendar = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);
const Award = ({ className }) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>);

const DYNASTY_DATA = {
  'Chalukya': { male: ['Pulakeshin', 'Vikramaditya', 'Vinayaditya'], female: ['Akkadevi', 'Jakalladevi'], varna: 'kshatriya' },
  'Pallava': { male: ['Simhavishnu', 'Mahendravarman', 'Narasimhavarman'], female: ['Rangapataka', 'Charudevi'], varna: 'kshatriya' },
  'Rashtrakuta': { male: ['Dantidurga', 'Krishna', 'Dhruva'], female: ['Chandrobebba', 'Abbalabbe'], varna: 'kshatriya' },
  'Pratihara': { male: ['Nagabhata', 'Vatsaraja', 'Mihira Bhoja'], female: ['Nirmaladevi', 'Kanchana'], varna: 'kshatriya' },
  'Pala': { male: ['Gopala', 'Dharmapala', 'Devapala'], female: ['Deddadevi', 'Bhagyadevi'], varna: 'brahmin' }, // Buddhist/Scholarly focus
  'Chola': { male: ['Vijayalaya', 'Aditya', 'Rajaraja'], female: ['Kundavai', 'Sembiyan'], varna: 'kshatriya' },
  'Pandya': { male: ['Kadungon', 'Arikesari', 'Varaguna'], female: ['Meenakshi', 'Mangayarkkarasi'], varna: 'kshatriya' },
  'Chera': { male: ['Kulasekhara', 'Sthanu Ravi', 'Godha Varma'], female: ['Phullanubhuti'], varna: 'vaishya' }, // Maritime Trade focus
  'Kashmir': { male: ['Lalitaditya', 'Avantivarman', 'Sankaravarman'], female: ['Didda', 'Sugandha'], varna: 'brahmin' },
  'Chandela': { male: ['Nannuka', 'Dhanga', 'Vidyadhara'], female: ['Durgavati'], varna: 'kshatriya' },
  'Paramara': { male: ['Upendra', 'Bhoja', 'Sindhuraja'], female: ['Mrinalvati'], varna: 'kshatriya' }
};

const VARNAS = [
  { id: 'brahmin', name: 'Brahmin (Vipra)', icon: '🕉️', bonus: 'Culture & Wisdom', desc: 'Masters of lore: +20% Culture and +2 Stability each turn.' },
  { id: 'kshatriya', name: 'Kshatriya (Rājanya)', icon: '⚔️', bonus: 'Might & Conquest', desc: 'Masters of war: +200 Military Strength and +10% Battle Power.' },
  { id: 'vaishya', name: 'Vaishya (Vāṇijya)', icon: '💰', bonus: 'Wealth & Prosperity', desc: 'Masters of coin: +20% Gold income and -20 Gold to construction.' }
];

const DYNASTY_NAMES = Object.keys(DYNASTY_DATA);
const TRAITS = [
  { id: 'strategist', name: 'Yuddhanipuṇa', desc: 'Skilled in War: +15% Battle Power' },
  { id: 'administrator', name: 'Rājanīticatura', desc: 'Political Expert: +10% Gold/Food Income' },
  { id: 'diplomat', name: 'Dūtanipuṇa', desc: 'Diplomatic Expert: -20% Diplomacy Cost' },
  { id: 'ambitious', name: 'Mahotsāha', desc: 'Great Energy: +5 Prestige/mo, -5 Stability/mo' },
  { id: 'patron', name: 'Vidyāvinodī', desc: 'Knowledge Patron: +2 Culture/mo' },
  { id: 'ruthless', name: 'Ugra', desc: 'Fierce: +20% Battle Lethality, -10 All Relations' },
  { id: 'pious', name: 'Dhārmika', desc: 'Righteous: +10 Max Stability' },
  { id: 'cunning', name: 'Māyāvin', desc: 'Cunning: +5% Maneuver in Battle' },
];
const EVENTS = [
  {
    id: 'monsoon', title: 'Monsoon Failure', description: 'The monsoon rains have failed. Crops wither and people grow restless.', choices: [
      { text: 'Open royal granaries (-50 food, +10 stability)', effect: { food: -50, stability: 10, prestige: 5 } },
      { text: 'Impose emergency taxes (+30 gold, -15 stability)', effect: { gold: 30, stability: -15 } },
      { text: 'Organize prayer ceremonies (-10 gold, +5 stability, +3 culture)', effect: { gold: -10, stability: 5, culture: 3 } },
    ]
  },
  {
    id: 'temple', title: 'Temple Construction Proposal', description: 'Priests petition for funds to construct a magnificent temple to glorify your dynasty.', choices: [
      { text: 'Fund grand temple (-100 gold, +15 culture, +10 prestige)', effect: { gold: -100, culture: 15, prestige: 10, stability: 5 } },
      { text: 'Build modest shrine (-30 gold, +5 culture)', effect: { gold: -30, culture: 5, prestige: 2 } },
      { text: 'Decline politely (-5 stability)', effect: { stability: -5 } },
    ]
  },
  {
    id: 'merchant', title: 'Merchant Guild Request', description: 'A powerful guild seeks royal charter for exclusive trading rights along the coast.', choices: [
      { text: 'Grant charter (+50 gold, -5 stability)', effect: { gold: 50, stability: -5 } },
      { text: 'Negotiate terms (+30 gold, +5 stability)', effect: { gold: 30, stability: 5 } },
      { text: 'Reject, support local traders (+10 stability, +3 prestige)', effect: { stability: 10, prestige: 3 } },
    ]
  },
  {
    id: 'insult', title: 'Diplomatic Insult', description: 'A rival ruler has publicly questioned your lineage and right to rule.', choices: [
      { text: 'Demand formal apology (+10 prestige, risk war)', effect: { prestige: 10, war_chance: 0.4 } },
      { text: 'Challenge to single combat (duel!)', effect: { duel: true } },
      { text: 'Ignore the slight (-10 prestige, +5 stability)', effect: { prestige: -10, stability: 5 } },
    ]
  },
  {
    id: 'plague', title: 'Plague Outbreak', description: 'A terrible plague spreads through your realm. Physicians seek guidance.', choices: [
      { text: 'Quarantine affected areas (-20 food, +5 stability)', effect: { food: -20, stability: 5 } },
      { text: 'Provide medical aid (-40 gold, +8 prestige)', effect: { gold: -40, prestige: 8 } },
      { text: 'Pray for divine intervention (-5 gold, -15 stability)', effect: { gold: -5, stability: -15 } },
    ]
  },
  {
    id: 'succession', title: 'Succession Dispute', description: 'Multiple claimants vie for succession. The court is divided.', choices: [
      { text: 'Support eldest child (+5 stability, +5 prestige)', effect: { stability: 5, prestige: 5 } },
      { text: 'Support most capable (-5 stability, +10 culture)', effect: { stability: -5, culture: 10 } },
      { text: 'Hold public contest (-10 stability, +10 prestige)', effect: { stability: -10, prestige: 10 } },
    ]
  },
  {
    id: 'traders', title: 'Foreign Traders Arrive', description: 'Merchants from distant lands seek to establish trade relations.', choices: [
      { text: 'Welcome them (+40 gold, +5 culture)', effect: { gold: 40, culture: 5 } },
      { text: 'Impose heavy tariffs (+60 gold)', effect: { gold: 60 } },
      { text: 'Send them away (+5 stability)', effect: { stability: 5 } },
    ]
  },
  {
    id: 'intrigue', title: 'Court Intrigue', description: 'Your spymaster uncovered a plot. Several courtiers are implicated.', choices: [
      { text: 'Execute conspirators (-15 stability, +10 prestige)', effect: { stability: -15, prestige: 10 } },
      { text: 'Exile quietly (+5 stability)', effect: { stability: 5, prestige: -3 } },
      { text: 'Forgive but watch closely (-5 stability)', effect: { stability: -5 } },
    ]
  },
  {
    id: 'harvest', title: 'Bumper Harvest', description: 'The gods have blessed your realm with an exceptional harvest!', choices: [
      { text: 'Store surplus (+80 food, +5 stability)', effect: { food: 80, stability: 5 } },
      { text: 'Export for profit (+50 gold)', effect: { gold: 50 } },
      { text: 'Distribute to poor (+15 stability, +5 prestige)', effect: { stability: 15, prestige: 5 } },
    ]
  },
  {
    id: 'scholar', title: 'Scholarly Achievement', description: 'A renowned scholar at your court completed a celebrated masterwork.', choices: [
      { text: 'Patronize further research (-30 gold, +15 culture)', effect: { gold: -30, culture: 15, prestige: 8 } },
      { text: 'Celebrate modestly (+5 culture, +3 prestige)', effect: { culture: 5, prestige: 3 } },
      { text: 'Claim credit (+10 prestige, -5 stability)', effect: { prestige: 10, stability: -5 } },
    ]
  },
];

const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[rnd(0, arr.length - 1)];
const rndName = (dynasty) => {
  const data = DYNASTY_DATA[dynasty] || DYNASTY_DATA['Chalukya'];
  const gender = Math.random() > 0.15 ? 'male' : 'female';
  return pick(data[gender]);
};

const REGIONS = [
  { id: 'gandhara', name: 'Gāndhāra', x: 100, y: 120, neighbors: ['purushapura', 'takshashila', 'sindh'] },
  { id: 'purushapura', name: 'Purushapura', x: 80, y: 150, neighbors: ['gandhara', 'takshashila'] },
  { id: 'takshashila', name: 'Takṣaśilā', x: 150, y: 100, neighbors: ['gandhara', 'punjab', 'shrinagara'] },
  { id: 'shrinagara', name: 'Śrīnagara', x: 200, y: 70, neighbors: ['takshashila', 'punjab', 'tibet'] },
  { id: 'punjab', name: 'Pañcanada', x: 220, y: 160, neighbors: ['takshashila', 'shrinagara', 'indraprastha', 'anahillapataka', 'sindh'] },
  { id: 'multan', name: 'Multān', x: 120, y: 200, neighbors: ['punjab', 'sindh', 'anahillapataka'] },
  { id: 'sindh', name: 'Sindhu', x: 100, y: 280, neighbors: ['gandhara', 'multan', 'anahillapataka'] },
  { id: 'indraprastha', name: 'Indraprastha', x: 300, y: 140, neighbors: ['punjab', 'mathura', 'sthanvishvara'] },
  { id: 'sthanvishvara', name: 'Sthānvīśvara', x: 260, y: 120, neighbors: ['indraprastha', 'punjab', 'kanyakubja'] },
  { id: 'mathura', name: 'Mathurā', x: 320, y: 180, neighbors: ['indraprastha', 'kanyakubja', 'ujjayini'] },
  { id: 'kanyakubja', name: 'Kanyākubja', x: 380, y: 160, neighbors: ['sthanvishvara', 'mathura', 'ayodhya', 'kathmandap'] },
  { id: 'ayodhya', name: 'Ayodhyā', x: 450, y: 150, neighbors: ['kanyakubja', 'prayagraj', 'shravasti'] },
  { id: 'shravasti', name: 'Śrāvastī', x: 480, y: 120, neighbors: ['ayodhya', 'kathmandap'] },
  { id: 'kathmandap', name: 'Kāṣṭhamaṇḍapa', x: 480, y: 80, neighbors: ['kanyakubja', 'shravasti', 'tibet', 'vaishali'] },
  { id: 'vaishali', name: 'Vaiśālī', x: 540, y: 130, neighbors: ['kathmandap', 'rajagriha', 'pataliputra'] },
  { id: 'prayagraj', name: 'Prayāgrāj', x: 430, y: 220, neighbors: ['ayodhya', 'kashi', 'vidisha'] },
  { id: 'kashi', name: 'Kāśī', x: 480, y: 210, neighbors: ['prayagraj', 'rajagriha', 'gaya'] },
  { id: 'pataliputra', name: 'Pāṭaliputra', x: 550, y: 180, neighbors: ['vaishali', 'rajagriha', 'gaudapura'] },
  { id: 'gaya', name: 'Gayā', x: 530, y: 230, neighbors: ['kashi', 'rajagriha', 'paundra'] },
  { id: 'rajagriha', name: 'Rājagṛha', x: 500, y: 250, neighbors: ['kashi', 'pataliputra', 'gaya', 'tosali'] },
  { id: 'gaudapura', name: 'Gauḍapura', x: 620, y: 200, neighbors: ['pataliputra', 'vanga', 'paundra', 'kamarupa'] },
  { id: 'paundra', name: 'Pauṇḍra', x: 580, y: 250, neighbors: ['gaya', 'gaudapura', 'vanga', 'tosali'] },
  { id: 'vanga', name: 'Vaṅga', x: 650, y: 250, neighbors: ['gaudapura', 'paundra', 'pragjyotisha'] },
  { id: 'pragjyotisha', name: 'Prāgjyotiṣa', x: 720, y: 220, neighbors: ['vanga', 'kamarupa'] },
  { id: 'kamarupa', name: 'Kāmarūpa', x: 750, y: 180, neighbors: ['pragjyotisha', 'gaudapura', 'tibet'] },
  { id: 'tibet', name: 'Triviṣṭapa', x: 550, y: 50, neighbors: ['shrinagara', 'kathmandap', 'kamarupa'] },
  { id: 'ujjayini', name: 'Ujjayinī', x: 280, y: 320, neighbors: ['mathura', 'dhara', 'vidisha', 'anahillapataka'] },
  { id: 'dhara', name: 'Dhārā', x: 240, y: 350, neighbors: ['ujjayini', 'anahillapataka', 'maharashtra'] },
  { id: 'vidisha', name: 'Vidiśā', x: 350, y: 300, neighbors: ['ujjayini', 'prayagraj', 'tripuri'] },
  { id: 'tripuri', name: 'Tripurī', x: 420, y: 280, neighbors: ['vidisha', 'khajuraho', 'tosali'] },
  { id: 'khajuraho', name: 'Khajurāho', x: 400, y: 240, neighbors: ['tripuri', 'prayagraj'] },
  { id: 'anahillapataka', name: 'Anahillapāṭaka', x: 180, y: 260, neighbors: ['sindh', 'multan', 'punjab', 'valabhi', 'ujjayini', 'dhara'] },
  { id: 'valabhi', name: 'Valabhī', x: 140, y: 320, neighbors: ['anahillapataka', 'somnath', 'dvaraka'] },
  { id: 'dvaraka', name: 'Dvārakā', x: 50, y: 350, neighbors: ['valabhi', 'somnath'] },
  { id: 'somnath', name: 'Somnāth', x: 100, y: 400, neighbors: ['dvaraka', 'valabhi', 'anarta'] },
  { id: 'anarta', name: 'Ānarta', x: 180, y: 350, neighbors: ['valabhi', 'somnath', 'ujjayini'] },
  { id: 'maharashtra', name: 'Mahārāṣṭra', x: 250, y: 450, neighbors: ['dhara', 'pratishthana', 'nasikya'] },
  { id: 'pratishthana', name: 'Pratiṣṭhāna', x: 300, y: 480, neighbors: ['maharashtra', 'manyakheta', 'tagara'] },
  { id: 'manyakheta', name: ' Mānyakheṭa', x: 320, y: 550, neighbors: ['pratishthana', 'vatapi', 'amaravati'] },
  { id: 'vatapi', name: 'Vātāpi', x: 280, y: 600, neighbors: ['manyakheta', 'banavasi', 'nasikya'] },
  { id: 'nasikya', name: 'Nāsikya', x: 220, y: 500, neighbors: ['maharashtra', 'vatapi'] },
  { id: 'tagara', name: 'Tagara', x: 350, y: 500, neighbors: ['pratishthana', 'amaravati'] },
  { id: 'amaravati', name: 'Amarāvatī', x: 450, y: 520, neighbors: ['manyakheta', 'tosali', 'kanchipuram', 'tagara'] },
  { id: 'tosali', name: 'Tosalī', x: 500, y: 350, neighbors: ['rajagriha', 'paundra', 'tripuri', 'amaravati'] },
  { id: 'banavasi', name: 'Banavāsī', x: 300, y: 680, neighbors: ['vatapi', 'mahodoyapuram', 'tanjavur'] },
  { id: 'kanchipuram', name: 'Kāñcīpuram', x: 420, y: 650, neighbors: ['tanjavur', 'amaravati'] },
  { id: 'tanjavur', name: 'Tañjāvūr', x: 380, y: 720, neighbors: ['kanchipuram', 'madurai', 'banavasi'] },
  { id: 'madurai', name: 'Madurai', x: 350, y: 830, neighbors: ['tanjavur', 'mahodoyapuram', 'lanka'] },
  { id: 'mahodoyapuram', name: 'Mahodayapuram', x: 280, y: 800, neighbors: ['banavasi', 'madurai'] },
  { id: 'lanka', name: 'Laṅkā', x: 450, y: 900, neighbors: ['madurai', 'anuradhapura'] },
  { id: 'anuradhapura', name: 'Anurādhapura', x: 420, y: 880, neighbors: ['lanka'] },
];

const DYNASTY_REGIONS = {
  'Chalukya': 'vatapi', 'Pallava': 'kanchipuram', 'Rashtrakuta': 'manyakheta', 'Pratihara': 'kanyakubja',
  'Pala': 'pataliputra', 'Chola': 'tanjavur', 'Pandya': 'madurai', 'Chera': 'mahodoyapuram',
  'Kashmir': 'shrinagara', 'Chandela': 'khajuraho', 'Paramara': 'dhara'
};

const makeChar = (dynasty, isSelf, rIdx = 0) => {
  const dData = DYNASTY_DATA[dynasty] || { male: ['Ruler'], female: [] };
  const names = [...dData.male, ...dData.female];
  const name = names[rIdx % names.length];
  return {
    name,
    traits: isSelf ? [pick(TRAITS), pick(TRAITS)] : [pick(TRAITS)],
    xp: 0,
    level: 1,
    perks: [],
    tenure: 0,
    maxTenure: rnd(15, 30),
    rIdx
  };
};

const makeFaction = (index, isPlayer = false, customData = null) => {
  const dName = customData ? customData.name : DYNASTY_NAMES[index];
  const dVarna = customData ? customData.varna : (DYNASTY_DATA[dName]?.varna || 'kshatriya');
  const dRulerName = customData ? customData.rulerName : null;
  
  const faction = {
    id: index, name: dName,
    varna: dVarna,
    rulerIndex: 0,
    ruler: makeChar(dName, isPlayer, 0),
    gold: rnd(150, 300), food: rnd(150, 400),
    regionIds: [], manpower: 1000, stability: rnd(60, 80),
    militaryStrength: 2000, relations: {}, atWar: [], isPlayer
  };

  if (dRulerName) faction.ruler.name = dRulerName;
  return faction;
};

const PERKS = [
  { id: 'statecraft', name: 'Arthaśāstra Mastery', desc: 'Cheaper development (-20 Gold) and +10% Gold income.', icon: '💰' },
  { id: 'warfare', name: 'Dhanurveda Wisdom', desc: '+20% Battle Modifier and +100 Military Strength/turn.', icon: '⚔️' },
  { id: 'dharma', name: 'Dharmic Order', desc: '+5 Stability per turn and reduced revolt risk.', icon: '⚖️' }
];

const calcLegacy = (p, culture, prestige, years) =>
  p ? Math.floor((p.regionIds?.length || 0) * 100 + (p.gold || 0) * 0.5 + culture * 10 + prestige * 5 + years * 2) : 0;

function MandalaOfKings() {
  const [screen, setScreen] = useState('menu');
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(600);
  const [factions, setFactions] = useState([]);
  const [player, setPlayer] = useState(null);
  const [culture, setCulture] = useState(10);
  const [prestige, setPrestige] = useState(20);
  const [difficulty, setDifficulty] = useState('normal'); // 'easy', 'normal', 'difficult'

  // --- Progression & Succession States ---
  const [perkPrompt, setPerkPrompt] = useState(false);
  const [successionData, setSuccessionData] = useState(null);

  // --- Auto-Save System ---
  const performSave = () => {
    if (player) {
      const gameState = { month, year, factions, player, culture, prestige, log, difficulty };
      localStorage.setItem('mandala_save', JSON.stringify(gameState));
    }
  };

  React.useEffect(() => {
    if (screen === 'playing') performSave();
  }, [month, year, factions, player, culture, prestige, screen, difficulty]);

  const loadSave = () => {
    const saved = localStorage.getItem('mandala_save');
    if (saved) {
      const s = JSON.parse(saved);
      setMonth(s.month); setYear(s.year);
      setFactions(s.factions); setPlayer(s.player);
      setCulture(s.culture); setPrestige(s.prestige);
      setLog(s.log); setScreen('playing');
      if (s.difficulty) setDifficulty(s.difficulty);
    }
  };

  const clearSave = () => localStorage.removeItem('mandala_save');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;
  
  const [event, setEvent] = useState(null);
  const [log, setLog] = useState([]);
  const [action, setAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [activeHelp, setActiveHelp] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [savedState, setSavedState] = useState(null);
  const [victoryType, setVictoryType] = useState(null);
  const [victoryPrompt, setVictoryPrompt] = useState(false);
  const [turnSummary, setTurnSummary] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [confirmingTurn, setConfirmingTurn] = useState(false);

  const notify = (msg, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const addLog = (msg) => setLog(p => [msg, ...p].slice(0, 10));

  const startGame = (pIdx = -1, customData = null) => {
    let newFactions = [];
    let playerFaction = null;

    if (customData) {
      playerFaction = makeFaction(0, true, customData);
      playerFaction.regionIds = [customData.capitalId];
      newFactions.push(playerFaction);
      DYNASTY_NAMES.forEach((name, i) => {
        const ai = makeFaction(i + 1);
        ai.regionIds = [DYNASTY_REGIONS[name]];
        newFactions.push(ai);
      });
    } else {
      const pIndex = pIdx === -1 ? rnd(0, DYNASTY_NAMES.length - 1) : pIdx;
      DYNASTY_NAMES.forEach((name, i) => {
        const isP = i === pIndex;
        const faction = makeFaction(i, isP);
        faction.regionIds = [DYNASTY_REGIONS[name]];
        newFactions.push(faction);
        if (isP) playerFaction = faction;
      });
    }

    setFactions(newFactions); setPlayer(playerFaction);
    setScreen('playing'); setMonth(1); setYear(600);
    setCulture(difficulty === 'easy' ? 20 : 10);
    setPrestige(difficulty === 'easy' ? 30 : 20);
    setLog([`The chronicles of ${playerFaction.name} begin.`]);
    setEvent(null); setAction(null); setTargetId(null); setVictoryPrompt(false);
    clearSave();
  };

  const handleEvent = (choice) => {
    if (!event || !player) return;
    const e = choice.effect;
    let p = { ...player };
    if (e.gold) p.gold += e.gold;
    if (e.food) p.food += e.food;
    if (e.manpower) p.manpower = Math.max(0, p.manpower + e.manpower);
    if (e.stability) p.stability = Math.max(0, Math.min(100, p.stability + e.stability));
    if (e.prestige) setPrestige(v => v + e.prestige);
    if (e.culture) setCulture(v => v + e.culture);
    
    if (e.war_chance && Math.random() < e.war_chance) {
      const potentialEnemies = factions.filter(f => !f.isPlayer && f.regionIds.length > 0 && (p.relations[f.id] || 0) < 80);
      if (potentialEnemies.length) {
        const enemy = potentialEnemies.reduce((prev, curr) => (p.relations[prev.id] || 0) < (p.relations[curr.id] || 0) ? prev : curr);
        p.atWar = [...p.atWar, enemy.id]; 
        notify(`⚔️ Aggression: ${enemy.name} has declared war!`, 'error');
      }
    }
    if (e.duel) {
      if (Math.random() > 0.45) { setPrestige(v => v + 50); notify('🏆 Duel Victory!', 'success'); }
      else { p.stability -= 15; notify('💔 Duel Defeat', 'error'); }
    }
    setPlayer(p); setEvent(null);
    addLog(`📜 ${choice.text}`);
  };

  const executeAction = () => {
    if (!action || !player) return;
    const p = { ...player };
    const hasPerk = (pid) => p.ruler.perks.includes(pid);
    const hasTrait = (tid) => p.ruler.traits.some(t => t.id === tid);
    
    let msg = '';
    const costMult = p.varna === 'vaishya' ? 0.6 : (hasPerk('statecraft') ? 0.75 : 1);

    if (action === 'develop') {
      const cost = Math.floor(50 * costMult);
      if (p.gold < cost) return notify('💰 Treasury empty!', 'error');
      p.gold -= cost; p.food += 100; p.manpower += 200;
      setCulture(v => v + 5);
      msg = `🛠️ Development: Invested ${cost} gold in infrastructure.`;
    } else if (action === 'recruit') {
      const cost = hasPerk('warfare') ? 60 : 80;
      if (p.gold < cost || p.manpower < 250) return notify('🚫 Insufficient resources!', 'error');
      p.gold -= cost; p.manpower -= 250; p.militaryStrength += 600;
      msg = `⚔️ Recruitment: Raised 600 soldiers.`;
    } else if (action === 'diplomacy' && targetId) {
      const cost = hasTrait('diplomat') ? 25 : 40;
      if (p.gold < cost) return notify('💰 Need gold for envoys!', 'error');
      p.gold -= cost; p.relations[targetId] = Math.min(100, (p.relations[targetId] || 0) + 20);
      msg = `🤝 Diplomacy: Envoys reached the court of ${factions.find(f => f.id === targetId).name}.`;
    } else if (action === 'war' && targetId) {
      p.atWar.push(targetId); p.relations[targetId] = -100;
      msg = `⚔️ Declaration: War declared on ${factions.find(f => f.id === targetId).name}!`;
    } else if (action === 'peace' && targetId) {
      if (p.gold < 150) return notify('💰 Tribute required!', 'error');
      p.gold -= 150; p.atWar = p.atWar.filter(id => id !== targetId);
      msg = `🕊️ Peace: Treaty signed with ${factions.find(f => f.id === targetId).name}.`;
    }

    p.ruler.xp += 40; setPlayer(p); setAction(null); setTargetId(null);
    if (msg) { addLog(msg); notify(msg, 'success'); }
  };

  const nextTurn = () => {
    if (!player) return;
    const nm = month === 12 ? 1 : month + 1;
    const ny = month === 12 ? year + 1 : year;
    setMonth(nm); setYear(ny);

    let turnLogs = [];
    const localAddLog = (msg) => {
      turnLogs.push(msg);
      setLog(p => [msg, ...p].slice(0, 10));
    };

    const p = { ...player };
    const hasTrait = (tid) => p.ruler.traits.some(t => t.id === tid);
    const hasPerk = (pid) => p.ruler.perks.includes(pid);

    // --- Progression & Succession ---
    if (nm === 1) { // Annual checks
      p.ruler.tenure += 1;
      p.ruler.xp += 50; // XP for ruling
    }

    // Level Up Check
    const xpNeeded = p.ruler.level * 200;
    if (p.ruler.xp >= xpNeeded) {
      p.ruler.level += 1;
      p.ruler.xp -= xpNeeded;
      setPerkPrompt(true);
      notify(`📜 Enlightenment: ${p.ruler.name} has reached Level ${p.ruler.level}!`, 'success');
    }

    // Succession Check
    if (p.ruler.tenure >= p.ruler.maxTenure) {
      const old = { ...p.ruler };
      const dynasty = p.name;
      const nextRIdx = (p.rulerIndex || 0) + 1;
      const newRuler = makeChar(dynasty, true, nextRIdx);
      newRuler.level = Math.max(1, Math.floor(old.level / 2));
      p.ruler = newRuler;
      p.rulerIndex = nextRIdx;
      p.stability = Math.max(20, p.stability - 25);
      setSuccessionData({ old, new: newRuler, score: calcLegacy(p, culture, prestige, old.tenure) });
      localAddLog(`👑 Chronological Shift: ${old.name} has passed. Long live ${newRuler.name}!`);
    }

    let goldIncome = p.regionIds.length * 20 + rnd(-10, 20);
    let foodIncome = p.regionIds.length * 15 + rnd(-5, 15);
    let manpowerGrowth = Math.floor(p.regionIds.length * 5 * (p.stability / 100));

    // Traits & Perks
    if (hasTrait('administrator') || hasPerk('statecraft')) { goldIncome = Math.floor(goldIncome * 1.15); foodIncome = Math.floor(foodIncome * 1.15); }
    if (hasTrait('ambitious')) { setPrestige(v => v + 5); p.stability = Math.max(0, p.stability - 5); localAddLog('⭐ Mahotsāha: +5 Prestige, -5 Stability'); }
    if (hasTrait('patron')) { setCulture(v => v + 2); localAddLog('📜 Vidyāvinodī: +2 Culture'); }
    if (hasTrait('pious')) p.stability = Math.min(100, p.stability + 2);
    if (hasPerk('dharma')) p.stability = Math.min(100, p.stability + 5);

    // DIFFICULTY INCOME SCALING
    if (difficulty === 'easy') { goldIncome = Math.floor(goldIncome * 1.2); foodIncome = Math.floor(foodIncome * 1.2); }
    else if (difficulty === 'difficult') { goldIncome = Math.floor(goldIncome * 0.85); foodIncome = Math.floor(goldIncome * 0.85); }

    // DIPLOMATIC BENEFITS (Trade & Stability)
    const others = factions.filter(f => !f.isPlayer && f.regionIds.length > 0);
    const allies = others.filter(f => (p.relations[f.id] || 0) > 60);
    const tradeBonus = allies.length * 15;
    if (tradeBonus > 0) {
      goldIncome += tradeBonus;
      localAddLog(`💰 Silk Road: +${tradeBonus} gold from peaceful trade`);
    }
    if (p.atWar.length === 0) {
      p.stability = Math.min(100, p.stability + 2);
    }

    // LOW STABILITY PENALTIES
    if (p.stability < 50) {
      goldIncome = Math.floor(goldIncome * 0.8);
      foodIncome = Math.floor(foodIncome * 0.8);
      if (p.stability < 30) {
        // Rebellion chance: 15% per turn at <30 stability
        if (Math.random() < 0.15 && p.regionIds.length > 1) {
          const lose = pick(p.regionIds);
          p.regionIds = p.regionIds.filter(rid => rid !== lose);
          const rName = REGIONS.find(r => r.id === lose).name;
          notify(`🔥 Rebellion: Low stability has led to a revolt in ${rName}!`, 'error');
          localAddLog(`🔥 Revolt! Lost ${rName} due to low stability`);
          // Region is seized by a random neighbor if possible
          const potentialSeizers = factions.filter(f => !f.isPlayer && f.regionIds.length > 0 && REGIONS.find(r => r.id === lose).neighbors.some(nb => f.regionIds.includes(nb)));
          if (potentialSeizers.length) pick(potentialSeizers).regionIds.push(lose);
        }
      }
    }

    // VARNA BONUSES
    if (p.varna === 'brahmin') { setCulture(v => v + 5); p.stability = Math.min(100, p.stability + 2); localAddLog('🕉️ Vidhwat: +5 Culture, +2 Stability'); }
    if (p.varna === 'kshatriya') { p.militaryStrength += 200; localAddLog('⚔️ Rājanya: +200 Military Strength'); }
    if (p.varna === 'vaishya') { goldIncome = Math.floor(goldIncome * 1.2); localAddLog('💰 Vanij: +20% Gold Income'); }

    p.gold += goldIncome;
    p.food += foodIncome;
    p.manpower += manpowerGrowth;
    p.food -= p.manpower / 50;

    let updatedFactions = fs.map(f => {
      if (f.id === p.id) return p;
      if (!p.atWar.includes(f.id)) return f;

      let pMod = 1 + Math.random() * 0.5;
      if (p.varna === 'kshatriya') pMod += 0.1; // Varna Battle Bonus
      if (hasTrait('strategist')) pMod += 0.15;
      if (hasTrait('ruthless')) pMod += 0.2;
      if (hasPerk('warfare')) pMod += 0.25;

      const pp = p.militaryStrength * pMod;
      const ep = f.militaryStrength * (1 + Math.random() * 0.5);
      const enemy = { ...f };

      if (pp > ep * 1.3) {
        const targetRegions = enemy.regionIds.filter(erid => REGIONS.find(r => r.id === erid).neighbors.some(nb => p.regionIds.includes(nb)));
        if (targetRegions.length) {
          const gain = pick(targetRegions);
          p.regionIds.push(gain);
          enemy.regionIds = enemy.regionIds.filter(id => id !== gain);
          p.militaryStrength -= rnd(100, 300); enemy.militaryStrength -= rnd(200, 500);
          setPrestige(v => v + 15);
          localAddLog(`⚔️ Victory vs ${enemy.name}! Captured ${REGIONS.find(r => r.id === gain).name}`);
        }
      } else if (ep > pp * 1.3) {
        const targetRegions = p.regionIds.filter(prid => REGIONS.find(r => r.id === prid).neighbors.some(nb => enemy.regionIds.includes(nb)));
        if (targetRegions.length) {
          const lose = pick(targetRegions);
          enemy.regionIds.push(lose);
          p.regionIds = p.regionIds.filter(id => id !== lose);
          p.militaryStrength -= rnd(300, 600); enemy.militaryStrength -= rnd(100, 300);
          setPrestige(v => Math.max(0, v - 15));
          localAddLog(`💔 Defeat vs ${enemy.name}! Lost ${REGIONS.find(r => r.id === lose).name}`);
        }
      }
      return enemy;
    });

    setFactions(updatedFactions); setPlayer(p);
    setTurnSummary([`💰 Income: +${goldIncome}G, +${foodIncome}F`, `👥 Manpower: +${manpowerGrowth}`, `👑 Ruler: ${p.ruler.name}`]);

    const alive = updatedFactions.filter(f => !f.isPlayer && f.regionIds.length > 0);
    if (alive.length === 0) { setVictoryType('conquest'); setScreen('victory'); }
    else if (culture >= 2000) { setVictoryType('cultural'); setScreen('victory'); }
    else if (prestige >= 2500) { setVictoryType('prestige'); setScreen('victory'); }
    else if (p.regionIds.length <= 0) { setScreen('ended'); }
    
    if (Math.random() < 0.7) setEvent(pick(EVENTS));
  };

  /* ─── MENU ─────────────────────────────────────────────────────────── */
  if (screen === 'menu') {
    const bg = 'radial-gradient(circle at center, #581c87 0%, #1e1b4b 100%)';
    return (
      <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '1rem' : '2rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '42rem', width: '100%', textAlign: 'center' }}>
          <div style={{ marginBottom: isMobile ? '1.5rem' : '2.5rem' }}>
            <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', background: 'linear-gradient(to right, #fef3c7, #fbbf24, #fef3c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem', filter: 'drop-shadow(0 0 15px rgba(217,119,6,0.3))' }}>
              Mandala of Kings
            </h1>
            <p style={{ fontSize: isMobile ? '1rem' : '1.5rem', letterSpacing: '0.3em', opacity: 0.9, color: '#fbbf24', fontWeight: '500' }}>भारतवर्ष • BHĀRATAVARṢA</p>
            <p style={{ color: 'rgba(254,243,199,0.6)', marginTop: '0.5rem', fontSize: isMobile ? '0.8rem' : '1.1rem', letterSpacing: '0.1em' }}>600 – 1000 CE</p>
          </div>

          <div style={{ 
            background: 'rgba(0,0,0,0.4)', 
            backdropFilter: 'blur(16px)', 
            border: '1px solid rgba(217,119,6,0.3)', 
            borderRadius: '1.5rem', 
            padding: isMobile ? '1.5rem' : '2.5rem', 
            marginBottom: isMobile ? '2rem' : '3rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(to right, transparent, #fbbf24, transparent)' }} />
            <p style={{ fontSize: isMobile ? '0.9rem' : '1.15rem', lineHeight: '1.8', marginBottom: '2rem', color: '#fef3c7' }}>
              Assume the mantle of a medieval Indian sovereign. Navigate the shifting tides of war, weave intricate diplomatic webs, and foster a cultural renaissance to establish a legacy that echoes through eternity.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1rem' : '1.5rem', textAlign: 'left' }}>
              {[
                ['👑', 'Universal Sovereignty', 'Command dynasties across generations.'],
                ['⚔️', 'Grand Strategy', 'Forge alliances or conquer the Mandala.'],
                ['💰', 'Statecraft', 'Balance resources and public stability.'],
                ['📜', 'Royal Chronicles', 'Shape history through dynamic events.']
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '0.9rem' }}>{title}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {/* Difficulty Selector */}
            <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '1rem', border: '1px solid rgba(217,119,6,0.3)', backdropFilter: 'blur(8px)', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { id: 'easy', label: 'Bhūpati', desc: 'Easy' },
                { id: 'normal', label: 'Rāja', desc: 'Normal' },
                { id: 'difficult', label: 'Mahārāja', desc: 'Hard' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  style={{
                    padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.25rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: difficulty === d.id ? 'linear-gradient(135deg, #d97706, #fbbf24)' : 'transparent',
                    color: difficulty === d.id ? '#451a03' : '#fbbf24',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: isMobile ? '70px' : '80px'
                  }}
                >
                  <span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>{d.label}</span>
                  <span style={{ fontSize: isMobile ? '0.5rem' : '0.55rem', opacity: 0.8 }}>{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {localStorage.getItem('mandala_save') && (
              <button onClick={loadSave} style={{ 
                padding: isMobile ? '0.8rem 1.5rem' : '1.1rem 2.8rem', 
                fontSize: isMobile ? '0.9rem' : '1.1rem', 
                fontWeight: 'bold', 
                background: 'linear-gradient(135deg, #059669, #10b981)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '0.8rem', 
                cursor: 'pointer', 
                boxShadow: '0 10px 20px rgba(16,185,129,0.3)',
                transition: 'all 0.2s',
                letterSpacing: '0.05em'
              }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                CONTINUE
              </button>
            )}
            <button onClick={() => startGame()} style={{ 
              padding: isMobile ? '0.8rem 1.5rem' : '1.1rem 2.8rem', 
              fontSize: isMobile ? '0.9rem' : '1.1rem', 
              fontWeight: 'bold', 
              background: 'linear-gradient(135deg, #7c4dff, #9333ea)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.8rem', 
              cursor: 'pointer', 
              boxShadow: '0 10px 20px rgba(124,77,255,0.3)',
              transition: 'all 0.2s',
              letterSpacing: '0.05em'
            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              QUICK PLAY
            </button>
            <button onClick={() => setScreen('selection')} style={{ 
              padding: isMobile ? '0.8rem 1.5rem' : '1.1rem 2.8rem', 
              fontSize: isMobile ? '0.9rem' : '1.1rem', 
              fontWeight: 'bold', 
              background: 'linear-gradient(135deg, #d97706, #fbbf24)', 
              color: '#451a03', 
              border: 'none', 
              borderRadius: '0.8rem', 
              cursor: 'pointer', 
              boxShadow: '0 10px 20px rgba(217,119,6,0.3)',
              transition: 'all 0.2s',
              letterSpacing: '0.05em'
            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              FOUND DYNASTY
            </button>
            <button onClick={() => setScreen('howtoplay')} style={{ 
              padding: isMobile ? '0.8rem 1.5rem' : '1.1rem 2.8rem', 
              fontSize: isMobile ? '0.9rem' : '1.1rem', 
              fontWeight: 'bold', 
              background: 'rgba(255,255,255,0.05)', 
              color: '#fbbf24', 
              border: '1px solid rgba(217,119,6,0.5)', 
              borderRadius: '0.8rem', 
              cursor: 'pointer', 
              transition: 'all 0.2s',
              letterSpacing: '0.05em'
            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              HOW TO PLAY
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── SELECTION ────────────────────────────────────────────────────── */
  if (screen === 'selection') {
    const bg = 'radial-gradient(circle at center, #1e1b4b 0%, #0c0a09 100%)';
    return (
      <div style={{ minHeight: '100vh', background: bg, padding: isMobile ? '2rem 1rem' : '4rem 2rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '4rem' }}>
            <h1 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', marginBottom: '1rem', color: '#fbbf24' }}>Select Your Sacred Lineage</h1>
            <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: 'rgba(254,243,199,0.7)', fontStyle: 'italic', marginBottom: '2rem' }}>Which dynasty shall carry your name into the annals of Bhāratavarṣa?</p>
            
            {/* Difficulty Selector */}
            <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '1rem', border: '1px solid rgba(217,119,6,0.3)', backdropFilter: 'blur(8px)', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { id: 'easy', label: 'Bhūpati', desc: 'Easy' },
                { id: 'normal', label: 'Rāja', desc: 'Normal' },
                { id: 'difficult', label: 'Mahārāja', desc: 'Hard' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  style={{
                    padding: isMobile ? '0.4rem 0.8rem' : '0.6rem 1.5rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: difficulty === d.id ? 'linear-gradient(135deg, #d97706, #fbbf24)' : 'transparent',
                    color: difficulty === d.id ? '#451a03' : '#fbbf24',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: isMobile ? '70px' : 'auto'
                  }}
                >
                  <span style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>{d.label}</span>
                  <span style={{ fontSize: isMobile ? '0.5rem' : '0.6rem', opacity: 0.8 }}>{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '280px' : '320px'}, 1fr))`, gap: isMobile ? '1rem' : '2rem', marginBottom: '4rem' }}>
            {/* Custom Dynasty Card */}
            <div 
              onClick={() => setScreen('custom_setup')}
              style={{
                background: 'rgba(251,191,36,0.05)',
                backdropFilter: 'blur(15px)',
                border: '2px dashed rgba(251,191,36,0.5)',
                borderRadius: '1.25rem',
                padding: '2rem',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(251,191,36,0.1)'; e.currentTarget.style.borderColor = '#fbbf24'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(251,191,36,0.05)'; e.currentTarget.style.borderColor = 'rgba(251,191,36,0.5)'; }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
              <h3 style={{ fontSize: '1.5rem', color: '#fbbf24', fontWeight: 'bold' }}>Forge Custom Lineage</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(254,243,199,0.6)', marginTop: '0.5rem' }}>Define your own name, varna, and capital.</p>
            </div>

            {DYNASTY_NAMES.map((name, idx) => {
              const data = DYNASTY_DATA[name];
              const dv = VARNAS.find(v => v.id === data.varna) || VARNAS[1];
              return (
                <div key={name}
                  onClick={() => startGame(idx)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(217,119,6,0.2)',
                    borderRadius: '1.25rem',
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.transform = 'translateY(-8px)'; 
                    e.currentTarget.style.borderColor = '#fbbf24'; 
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(217,119,6,0.1)';
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.transform = 'translateY(0)'; 
                    e.currentTarget.style.borderColor = 'rgba(217,119,6,0.2)'; 
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', fontSize: '2rem', opacity: 0.1 }}>{dv.icon}</div>
                  <h3 style={{ fontSize: '1.75rem', color: '#fbbf24', marginBottom: '1rem', fontFamily: 'Georgia,serif' }}>{name}</h3>
                  <div style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: '0.5rem', fontWeight: 'bold' }}>{dv.name}</div>
                  <div style={{ fontSize: '0.95rem', color: 'rgba(254,243,199,0.7)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {data.male.slice(0, 2).join(', ')}...
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ background: 'rgba(217,119,6,0.1)', color: '#fbbf24', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 'bold' }}>HISTORICAL</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setScreen('menu')} style={{ background: 'transparent', border: 'none', color: '#fbbf24', textDecoration: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '600', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = 0.8} onMouseLeave={(e) => e.currentTarget.style.opacity = 1}>
              ← Return to Imperial Court
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── CUSTOM DYNASTY SETUP ────────────────────────────────────────── */
  if (screen === 'custom_setup') {
    const [cName, setCName] = useState('New');
    const [cRuler, setCRuler] = useState('Ruler');
    const [cVarna, setCVarna] = useState('kshatriya');
    const [cCapital, setCCapital] = useState('indraprastha');

    const cardStyle = {
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(251,191,36,0.3)',
      borderRadius: '1.5rem',
      padding: isMobile ? '1.5rem' : '2.5rem',
      boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
    };

    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at center, #4c1d95 0%, #0c0a09 100%)', padding: '2rem 1rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontFamily: 'Georgia,serif', color: '#fbbf24', marginBottom: '2rem' }}>Forge Your Sacred Lineage</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Identity Card */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>IDENTITY (अस्मिता)</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div>
                   <label style={{ fontSize: '0.75rem', color: 'rgba(254,243,199,0.5)', display: 'block', marginBottom: '0.4rem' }}>DYNASTY NAME</label>
                   <input value={cName} onChange={e => setCName(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(251,191,36,0.3)', padding: '0.8rem', color: '#fff', borderRadius: '0.6rem', fontSize: '1rem' }} />
                 </div>
                 <div>
                   <label style={{ fontSize: '0.75rem', color: 'rgba(254,243,199,0.5)', display: 'block', marginBottom: '0.4rem' }}>STARTING RULER</label>
                   <input value={cRuler} onChange={e => setCRuler(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(251,191,36,0.3)', padding: '0.8rem', color: '#fff', borderRadius: '0.6rem', fontSize: '1rem' }} />
                 </div>
              </div>
            </div>

            {/* Varna Card */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>VARNA PHILOSOPHY (वर्ण)</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                {VARNAS.map(v => (
                  <div 
                    key={v.id}
                    onClick={() => setCVarna(v.id)}
                    style={{ 
                      padding: '1rem', 
                      background: cVarna === v.id ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.02)', 
                      border: `1px solid ${cVarna === v.id ? '#fbbf24' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{v.icon} {v.name}</span>
                      <span style={{ fontSize: '0.7rem', background: '#fbbf24', color: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>BONUS</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capital Selection */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '1rem' }}>CAPITAL CITY (राजधानी)</h2>
              <select value={cCapital} onChange={e => setCCapital(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(251,191,36,0.3)', padding: '0.8rem', borderRadius: '0.6rem', fontSize: '1rem' }}>
                {REGIONS.map(r => (
                   <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={() => setScreen('selection')} style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.5)', borderRadius: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>BACK</button>
              <button 
                onClick={() => startGame(-1, { name: cName, rulerName: cRuler, varna: cVarna, capitalId: cCapital })}
                style={{ flex: 2, padding: '1rem', background: 'linear-gradient(to right, #d97706, #fbbf24)', color: '#451a03', border: 'none', borderRadius: '1rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                BEGIN REIGN →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── HOW TO PLAY ───────────────────────────────────────────────────── */
  if (screen === 'howtoplay') {
    const sectionStyle = {
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(217,119,6,0.3)',
      borderRadius: '1rem',
      padding: isMobile ? '1rem' : '1.5rem',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.8)',
      transition: 'transform 0.3s ease, border-color 0.3s ease'
    };

    const S = ({ title, icon, children }) => (
      <div style={sectionStyle}>
        <h2 style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: isMobile ? '1.1rem' : '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Georgia,serif' }}>
          <span style={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }}>{icon}</span> {title}
        </h2>
        {children}
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at center, #581c87 0%, #1e1b4b 100%)', padding: isMobile ? '2rem 1rem' : '3rem 1rem', color: '#fef3c7', fontFamily: 'sans-serif', overflowY: 'auto' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '2.5rem' : '3.5rem' }}>
            <h1 style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', background: 'linear-gradient(to right, #fef3c7, #fbbf24, #fef3c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>Arthashastra</h1>
            <p style={{ color: '#d97706', fontSize: isMobile ? '1rem' : '1.2rem', letterSpacing: '0.1em', fontWeight: '600' }}>THE ART OF RULING • राजधर्म</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <S title="Objective" icon="🎯">
              <p style={{ lineHeight: '1.8', color: 'rgba(254,243,199,0.9)', fontSize: isMobile ? '0.9rem' : '1.05rem' }}>
                Forge a legacy that echoes through the centuries. Lead your dynasty of Bhāratavarṣa to supremacy before the year <strong>1000 CE</strong>.
              </p>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(217,119,6,0.1)', borderRadius: '0.5rem', borderLeft: '4px solid #d97706', fontSize: '0.85rem' }}>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Legacy Score:</span> 🏰 Realms × 100 + 💰 Gold × 0.5 + 📜 Culture × 10 + ⭐ Prestige × 5 + ⏳ Years × 2
              </div>
            </S>

            <S title="Artha: Resources" icon="💰">
              <p style={{ fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.25rem', opacity: 0.9 }}>Gold, Food, and Manpower are the lifeblood of your dynasty. Gold funds expansions, Food sustains your population, and Manpower fuels your armies.</p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(217,119,6,0.1)', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fbbf24' }}>GOLD</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Infrastructure & Units</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(74,222,128,0.1)', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#4ade80' }}>FOOD</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Growth & Survival</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(248,113,113,0.1)', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#f87171' }}>MANPOWER</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Army Potential</div>
                </div>
              </div>
            </S>

            <S title="Dharma: Statecraft" icon="⚖️">
              <p style={{ fontSize: '0.95rem', lineHeight: '1.7', opacity: 0.9 }}>Stability represents domestic harmony. Peace provides a natural bonus, while wars and events can drain it. Low stability risks revolts and economic failure.</p>
            </S>

            <S title="Military Command" icon="⚔️">
              <p style={{ fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1rem', opacity: 0.9 }}>Battles depend on Military Strength and Strategic Modifiers. Engage rivals only when your borders touch.</p>
              <div style={{ background: 'linear-gradient(to bottom, rgba(127,29,29,0.4), rgba(69,10,10,0.4))', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#fca5a5' }}>Superiority (&gt;30%)</span>
                  <span style={{ fontWeight: 'bold' }}>Victory</span>
                </div>
                <div style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#94a3b8' }}>Parity</span>
                  <span style={{ fontWeight: 'bold' }}>Stalemate</span>
                </div>
                <div style={{ fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#f87171' }}>Inferiority (&lt;-30%)</span>
                  <span style={{ fontWeight: 'bold' }}>Defeat</span>
                </div>
              </div>
            </S>

            <S title="Victory Paths" icon="🏆">
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { t: 'The Conqueror', s: 'Military Dominance', d: 'Annihilate every rival dynasty.', c: '#ef4444' },
                  { t: 'The Enlightened', s: 'Cultural Apex', d: 'Ascend to 2000 Culture.', c: '#818cf8' },
                  { t: 'The Chakravartin', s: 'Legendary Prestige', d: 'Amass 2500 Prestige.', c: '#fbbf24' }
                ].map(v => (
                  <div key={v.t} style={{ padding: '1rem', border: `1px solid ${v.c}44`, borderRadius: '0.75rem', background: `${v.c}11` }}>
                    <div style={{ color: v.c, fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem' }}>{v.t}</div>
                    <div style={{ fontSize: '0.8rem', color: '#fef3c7', opacity: 0.8, marginBottom: '0.5rem' }}>{v.s}</div>
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{v.d}</div>
                  </div>
                ))}
              </div>
            </S>
          </div>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', justifyContent: 'center', marginTop: '3rem', paddingBottom: '4rem' }}>
            <button onClick={() => setScreen('menu')} style={{ padding: '0.8rem 2rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', color: '#fbbf24', border: '1px solid rgba(217,119,6,0.5)', borderRadius: '0.75rem', cursor: 'pointer', fontSize: isMobile ? '0.9rem' : '1rem' }}>← COURT MENU</button>
            <button onClick={() => startGame()} style={{ padding: '0.8rem 2.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#451a03', border: 'none', borderRadius: '0.75rem', cursor: 'pointer', fontSize: isMobile ? '0.9rem' : '1rem' }}>FOUND DYNASTY →</button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── END SCREENS ───────────────────────────────────────────────────── */
  if (screen === 'victory' || screen === 'ended') {
    const score = calcLegacy(player, culture, prestige, year - 600);
    const bg = 'radial-gradient(circle at center, #581c87 0%, #1e1b4b 100%)';
    const TITLES = {
      military: { t: 'Military Dominance', s: 'Chakravartin — Universal Ruler' },
      conquest: { t: 'Total Conquest', s: 'Samrāṭ — Emperor of All' },
      cultural: { t: 'Cultural Apex', s: 'Kavi Chakravarti — Emperor of Arts' },
      prestige: { t: 'Legendary Prestige', s: 'Mahārājādhirāja — King of Kings' },
    };
    const vt = victoryType ? TITLES[victoryType] : null;
    return (
      <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '1.5rem' : '2.5rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '40rem', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: isMobile ? '4rem' : '6rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(217,119,6,0.4))' }}>{screen === 'victory' ? '🏆' : '📜'}</div>
          <h1 style={{ fontSize: isMobile ? '2rem' : '3.5rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fef3c7, #fbbf24, #fef3c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {screen === 'victory' ? vt?.t : "Dynasty's End"}
          </h1>
          {vt && <p style={{ color: '#fbbf24', fontSize: isMobile ? '1.1rem' : '1.5rem', fontStyle: 'italic', marginBottom: '2.5rem', opacity: 0.9 }}>{vt.s}</p>}
          
          <div style={{ 
            background: 'rgba(0,0,0,0.4)', 
            backdropFilter: 'blur(16px)', 
            border: '2px solid rgba(217,119,6,0.3)', 
            borderRadius: '1.5rem', 
            padding: isMobile ? '1.5rem' : '2.5rem', 
            marginBottom: '3rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
          }}>
            <div style={{ color: '#fbbf24', fontSize: '0.9rem', letterSpacing: '0.2em', fontWeight: 'bold', marginBottom: '0.5rem' }}>FINAL LEGACY</div>
            <div style={{ fontSize: isMobile ? '3rem' : '5rem', fontWeight: 'bold', marginBottom: '2rem', lineHeight: '1' }}>{score.toLocaleString()}</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              {[
                ['Territories', player?.regionIds.length || 0, '🏛️'],
                ['Years Ruled', year - 600, '📅'],
                ['Culture', culture, '📚'],
                ['Prestige', prestige, '⭐']
              ].map(([l, v, i]) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.03)', padding: isMobile ? '0.8rem' : '1.25rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{i}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(254,243,199,0.5)', fontWeight: 'bold', letterSpacing: '0.05em' }}>{String(l).toUpperCase()}</div>
                  <div style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 'bold', color: '#fff' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={() => setScreen('menu')} style={{ 
            padding: isMobile ? '1rem 2rem' : '1.25rem 3.5rem', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #d97706, #fbbf24)', 
            color: '#451a03', 
            border: 'none', 
            borderRadius: '1rem', 
            cursor: 'pointer', 
            fontSize: isMobile ? '0.9rem' : '1.1rem',
            boxShadow: '0 10px 30px rgba(217,119,6,0.3)',
            transition: 'transform 0.2s',
            letterSpacing: '0.05em'
          }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
             ESTABLISH NEW LINEAGE
          </button>
        </div>
      </div>
    );
  }

  /* ─── MAIN GAME ─────────────────────────────────────────────────────── */
  if (screen === 'playing') {
    const others = factions.filter(f => !f.isPlayer && f.regionIds.length > 0);
    const score = calcLegacy(player, culture, prestige, year - 600);
    const bg = 'radial-gradient(circle at center, #581c87 0%, #1e1b4b 100%)';
    const cardStyle = {
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(217,119,6,0.3)',
      borderRadius: '1rem',
      padding: '1.25rem',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)'
    };

    // Calculate borders for text-based display
    const myRegions = REGIONS.filter(r => player?.regionIds?.includes(r.id));
    const enemyRegions = others.flatMap(f => REGIONS.filter(r => f.regionIds.includes(r.id)).map(r => ({ ...r, owner: f.name })));
    const frontiers = enemyRegions.filter(er =>
      myRegions.some(mr => mr.neighbors.includes(er.id))
    );

    const InfoIcon = ({ content, side = 'left' }) => {
      const handleShow = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setActiveHelp({ content, top: rect.top, left: rect.left, side });
      };

      return (
        <div style={{ position: 'relative', display: 'inline-block', marginLeft: '0.4rem', pointerEvents: 'auto' }}>
          <div 
            onMouseEnter={handleShow}
            onMouseLeave={() => setActiveHelp(null)}
            onClick={(e) => { e.stopPropagation(); handleShow(e); }}
            style={{ 
              width: '1rem', height: '1rem', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.5)', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '0.65rem', color: '#fbbf24', cursor: 'pointer', fontWeight: 'bold' 
            }}
          >
            i
          </div>
        </div>
      );
    };

    return (
      <div style={{ minHeight: '100vh', background: bg, padding: isMobile ? '0.75rem' : '1.5rem', color: '#fef3c7', fontFamily: 'sans-serif', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Header Dashboard */}
          <div style={{ ...cardStyle, background: 'rgba(88,28,135,0.2)', borderColor: 'rgba(217,119,6,0.5)', marginBottom: '1rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', position: 'relative', gap: '1rem' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, #d97706, #fbbf24, #d97706)' }} />
            <div>
              <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.25rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', background: 'linear-gradient(to right, #fef3c7, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{player?.name} Dynasty</h1>
              <div style={{ display: 'flex', gap: isMobile ? '0.75rem' : '1.5rem', color: '#fbbf24', fontSize: isMobile ? '0.75rem' : '0.95rem', marginTop: '0.4rem', fontWeight: '600', letterSpacing: '0.05em', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ opacity: 0.8 }}>👑</span> {player?.ruler.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ opacity: 0.9, color: '#fbbf24', fontSize: '0.8rem', fontWeight: '900' }}>LVL {player?.ruler.level}</span>
                  <div style={{ width: '60px', height: '6px', background: 'rgba(0,0,0,0.4)', borderRadius: '3px', overflow: 'hidden', border: '1px solid rgba(251,191,36,0.2)' }}>
                    <div style={{ height: '100%', background: 'linear-gradient(to right, #d97706, #fbbf24)', width: `${(player?.ruler.xp / (player?.ruler.level * 200)) * 100}%`, transition: 'width 0.5s ease' }} />
                  </div>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ opacity: 0.8 }}>📅</span> {month}/{year} CE</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ opacity: 0.8 }}>🏛️</span> {player?.regionIds.length} Realms</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {player?.ruler.perks.map(pid => {
                    const pk = PERKS.find(p => p.id === pid);
                    return (
                      <div key={pid} style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', color: '#fbbf24', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        <span>{pk?.icon}</span>
                        <span>{pk?.name.toUpperCase()}</span>
                      </div>
                    );
                })}
              </div>
            </div>
            <div style={{ textAlign: isMobile ? 'left' : 'right', display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'stretch' : 'flex-end', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                  <div style={{ fontSize: '0.6rem', color: '#fbbf24', letterSpacing: '0.1em', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'flex-end', gap: '0.3rem' }}>
                    LEGACY SCORE <InfoIcon content="Your final score is calculated based on realms controlled, resources, culture, and prestige." side="right" />
                  </div>
                  <div style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>{score}</div>
                </div>
                <button onClick={() => setShowExitConfirm(true)} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '0.5rem', color: '#fca5a5', fontSize: '0.7rem', padding: '0.4rem 0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>EXIT</button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 340px', gap: '1.25rem' }}>
            {/* Left Column: Management & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
               {/* Resources Strip Header */}
              <div style={{ marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.8 }}>
                  🏦 STATE TREASURY <InfoIcon content="Your primary state assets. Gold fuels war, Food sustains manpower, and Military Strength represents your standing army." />
                </h2>
              </div>
              
              {/* Resources Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {[
                  { label: 'Gold', val: Math.floor(player?.gold || 0), col: '#fbbf24', icon: '💰', sub: `+${(player?.regionIds.length || 0) * 20}` },
                  { label: 'Food', val: Math.floor(player?.food || 0), col: '#4ade80', icon: '🌾', sub: `+${(player?.regionIds.length || 0) * 15}` },
                  { label: 'Manpower', val: Math.floor(player?.manpower || 0), col: '#f87171', icon: '👥', sub: 'Pool' },
                  { label: 'Military', val: player?.militaryStrength || 0, col: '#fb923c', icon: '⚔️', sub: 'Strength' },
                ].map(r => (
                  <div key={r.label} style={{ ...cardStyle, background: 'rgba(255,255,255,0.03)', textAlign: 'left', padding: isMobile ? '0.75rem' : '1rem', border: `1px solid ${r.col}22`, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-5px', fontSize: '2.5rem', opacity: 0.05, transform: 'rotate(15deg)' }}>{r.icon}</div>
                    <div style={{ fontSize: '0.65rem', color: r.col, fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{r.label.toUpperCase()}</div>
                    <div style={{ fontSize: isMobile ? '1.25rem' : '1.75rem', fontWeight: 'bold', color: '#fff' }}>{r.val.toLocaleString()}</div>
                    <div style={{ fontSize: '0.65rem', color: `${r.col}aa`, fontWeight: '600' }}>{r.sub}</div>
                  </div>
                ))}
              </div>

              {/* Actions & Domain Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
                {/* Royal Actions Card */}
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>📜</span> Royal Actions <InfoIcon content="Issue royal decrees to develop your land, raise armies, or conduct diplomacy with foreign powers." />
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '1.25rem' }}>
                    {['develop', 'recruit', 'diplomacy', 'war', 'peace'].map(a => (
                      <button key={a} onClick={() => setAction(a)} style={{
                        padding: '0.75rem 0.4rem',
                        background: action === a ? 'linear-gradient(135deg, #d97706, #fbbf24)' : 'rgba(255,255,255,0.05)',
                        color: action === a ? '#451a03' : '#fbbf24',
                        border: action === a ? 'none' : '1px solid rgba(217,119,6,0.3)',
                        borderRadius: '0.6rem',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        transition: 'all 0.2s',
                        boxShadow: action === a ? '0 4px 12px rgba(217,119,6,0.3)' : 'none'
                      }}>
                        {a}
                      </button>
                    ))}
                  </div>

                  {action ? (
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(217,119,6,0.2)', animation: 'fadeIn 0.3s ease' }}>
                      <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#fef3c7' }}>
                        {action === 'develop' && '🛠️ Invest 50 gold into infrastructure to boost food and manpower.'}
                        {action === 'recruit' && '⚔️ Spend 80 gold and 200 manpower to levy 500 elite soldiers.'}
                        {(action === 'diplomacy' || action === 'war' || action === 'peace') && (
                          <div style={{ marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginBottom: '0.4rem', fontWeight: 'bold' }}>Target Dynasty</div>
                            <select onChange={(e) => setTargetId(parseInt(e.target.value))} value={targetId || ''} style={{ width: '100%', background: '#1e1b4b', color: 'white', border: '1px solid rgba(217,119,6,0.4)', borderRadius: '0.5rem', padding: '0.6rem', fontSize: '0.85rem' }}>
                              <option value="">Select Target...</option>
                              {others
                                .filter(f => {
                                  if (action === 'war') return player.regionIds.some(rid => REGIONS.find(r => r.id === rid)?.neighbors.some(nb => f.regionIds.includes(nb)));
                                  if (action === 'peace') return player.atWar.includes(f.id);
                                  return true;
                                })
                                .map(f => (
                                  <option key={f.id} value={f.id}>{f.name} (Rel: {player?.relations[f.id] || 0})</option>
                                ))}
                            </select>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(254,243,199,0.5)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                              {action === 'war' && '⚠️ Only neighboring dynasties can be targeted for conquest.'}
                              {action === 'peace' && '🕊️ Select a faction to offer terms of surrender or compromise.'}
                              {action === 'diplomacy' && '🤝 Send envoys to improve relations with non-hostile kingdoms.'}
                            </div>
                          </div>
                        )}
                      </div>
                      <button onClick={executeAction} style={{ width: '100%', padding: '0.8rem', background: 'linear-gradient(to right, #fbbf24, #d97706)', color: '#451a03', fontWeight: 'bold', border: 'none', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(217,119,6,0.2)', transition: 'transform 0.1s' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        Confirm Command
                      </button>
                    </div>
                  ) : (
                    <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(254,243,199,0.3)', fontSize: '0.85rem', border: '1px dashed rgba(217,119,6,0.2)', borderRadius: '0.8rem' }}>
                      Select an action to begin
                    </div>
                  )}
                </div>

                {/* Domain & Stability Card */}
                <div style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🕌</span> Your Mandala <InfoIcon content="The internal stability of your kingdom affects resource generation. Low stability can lead to revolts." />
                    </h2>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.65rem', color: '#a78bfa', fontWeight: 'bold' }}>STABILITY</div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#a78bfa' }}>{player?.stability}%</div>
                    </div>
                  </div>
                  
                  <div style={{ background: 'rgba(0,0,0,0.4)', height: '6px', borderRadius: '999px', marginBottom: '1.25rem', border: '1px solid rgba(167,139,250,0.2)' }}>
                    <div style={{ background: 'linear-gradient(to right, #7c3aed, #a78bfa)', height: '100%', borderRadius: '999px', width: `${player?.stability}%`, transition: 'width 0.8s ease-out' }} />
                  </div>

                  <div style={{ maxHeight: '10rem', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {myRegions.map(r => (
                      <div key={r.id} style={{ padding: '0.4rem 0.8rem', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '600' }}>
                        {r.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chronicles & Frontiers Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
                {/* Chronicles */}
                <div style={{ ...cardStyle, background: 'rgba(0,0,0,0.2)' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24', borderBottom: '1px solid rgba(217,119,6,0.2)', paddingBottom: '0.75rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📜</span> The Chronicles <InfoIcon content="A historical log of all key events and diplomatic shifts in your reign." />
                  </h2>
                  <div style={{ maxHeight: '12rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {log.map((l, i) => (
                      <div key={i} style={{ 
                        fontSize: '0.8rem', 
                        color: i === 0 ? '#fbbf24' : 'rgba(254,243,199,0.7)', 
                        marginBottom: '0.6rem', 
                        padding: '0.5rem', 
                        background: i === 0 ? 'rgba(217,119,6,0.05)' : 'transparent',
                        borderRadius: '0.4rem',
                        borderLeft: i === 0 ? '3px solid #d97706' : '1px solid transparent'
                      }}>
                        {l}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conflict Zones */}
                <div style={{ ...cardStyle, background: 'rgba(127,29,29,0.05)', borderColor: 'rgba(248,113,113,0.3)' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fca5a5', borderBottom: '1px solid rgba(248,113,113,0.2)', paddingBottom: '0.75rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>⚔️</span> Conflict Borders <InfoIcon content="Regions belonging to rival dynasties that directly border your own lands." />
                  </h2>
                  <div style={{ maxHeight: '12rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {frontiers.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {frontiers.map(r => (
                          <div key={r.id} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            padding: '0.75rem', 
                            background: 'rgba(0,0,0,0.3)', 
                            border: '1px solid rgba(248,113,113,0.2)', 
                            borderRadius: '0.6rem'
                          }}>
                            <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fef3c7' }}>{r.name}</div>
                              <div style={{ fontSize: '0.7rem', color: '#fca5a5' }}>Held by {r.owner}</div>
                            </div>
                            <div style={{ fontSize: '1rem', alignSelf: 'center' }}>🎯</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'rgba(254,243,199,0.3)', fontSize: '0.8rem', marginTop: '3rem' }}>No direct paths for conquest currently.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Rivals & Progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Victory Progress */}
              <div style={cardStyle}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif', marginBottom: '1.25rem', borderBottom: '1px solid rgba(217,119,6,0.2)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  🏆 Victory Progress <InfoIcon content="Total victory can be achieved through Cultural enlightenment, Political Prestige, or Military Hegemony (conquest)." side="right" />
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { label: 'Culture 📜', val: culture, max: 2000, col: '#818cf8', sub: 'Enlightenment Path' },
                    { label: 'Prestige ⭐', val: prestige, max: 2500, col: '#fbbf24', sub: 'Legendary Path' }
                  ].map(r => (
                    <div key={r.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: '0.8rem', color: '#fef3c7', fontWeight: '600' }}>{r.label}</div>
                        <div style={{ fontSize: '0.7rem', color: `${r.col}cc`, fontWeight: 'bold' }}>{r.val} / {r.max}</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.5)', height: '10px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.05)', padding: '2px' }}>
                        <div style={{ background: `linear-gradient(to right, ${r.col}, #fff)`, height: '100%', borderRadius: '999px', width: `${Math.min(100, (r.val / r.max) * 100)}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 10px ${r.col}44` }} />
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(254,243,199,0.4)', marginTop: '0.4rem', fontStyle: 'italic' }}>{r.sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(217,119,6,0.05)', borderRadius: '0.8rem', border: '1px dashed rgba(217,119,6,0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(254,243,199,0.7)', textAlign: 'center', lineHeight: '1.5' }}>
                    Control all 🏛️ <strong>{REGIONS.length}</strong> regions to claim <strong>Military Hegemony</strong>.
                  </div>
                </div>
              </div>

              {/* Rivals List */}
              <div style={cardStyle}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif', marginBottom: '1.25rem', borderBottom: '1px solid rgba(217,119,6,0.2)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  👑 Rival Mandalas <InfoIcon content="Other powerful dynasties in Bharat. Keep an eye on their military strength and your relations with them." side="right" />
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '30rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {others.map(f => (
                    <div key={f.id} style={{ 
                      background: 'rgba(0,0,0,0.3)', 
                      padding: '1rem', 
                      borderRadius: '0.8rem', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'border-color 0.2s'
                    }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(217,119,6,0.3)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                        <span style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '0.9rem' }}>{f.name}</span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 'bold',
                          color: player?.atWar.includes(f.id) ? '#f87171' : (player?.relations[f.id] || 0) > 0 ? '#4ade80' : '#94a3b8',
                          background: player?.atWar.includes(f.id) ? 'rgba(248,113,113,0.1)' : 'rgba(0,0,0,0.2)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.4rem'
                        }}>
                          {player?.atWar.includes(f.id) ? '⚔️ AT WAR' : `REL: ${player?.relations[f.id] || 0}`}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(254,243,199,0.5)' }}>🏛️ {f.regionIds.length} Regions</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(254,243,199,0.5)', textAlign: 'right' }}>⚔️ {f.militaryStrength.toLocaleString()} Power</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Circular Next Turn Button (Fixed Right) */}
          <div style={{ 
            position: 'fixed', 
            bottom: isMobile ? '1.5rem' : '2.5rem', 
            right: isMobile ? '1.5rem' : '2.5rem', 
            zIndex: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            pointerEvents: 'none'
          }}>
            <button 
              onClick={() => {
                if (event) return;
                if (confirmingTurn) {
                  nextTurn();
                  setConfirmingTurn(false);
                } else {
                  setConfirmingTurn(true);
                }
              }}
              disabled={!!event}
              style={{
                pointerEvents: 'auto',
                width: confirmingTurn ? (isMobile ? '180px' : '220px') : (isMobile ? '60px' : '80px'),
                height: isMobile ? '60px' : '80px',
                borderRadius: confirmingTurn ? '40px' : '50%',
                background: event ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #d97706, #fbbf24)',
                color: event ? 'rgba(255,255,255,0.3)' : '#451a03',
                border: 'none',
                cursor: event ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: event ? 'none' : '0 10px 40px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.2)',
                transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                overflow: 'hidden',
                padding: confirmingTurn ? '0 1.5rem' : '0',
                position: 'relative'
              }}
              onMouseEnter={(e) => { if(!event && !confirmingTurn) e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { 
                if(!event && !confirmingTurn) e.currentTarget.style.transform = 'scale(1)';
                if(confirmingTurn) setConfirmingTurn(false);
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                opacity: 1,
                transition: 'opacity 0.3s'
              }}>
                <span style={{ fontSize: isMobile ? '1.5rem' : '1.8rem', flexShrink: 0 }}>
                  {event ? '📜' : (confirmingTurn ? '✔️' : '⏳')}
                </span>
                {confirmingTurn && (
                  <span style={{ 
                    fontWeight: '900', 
                    fontSize: isMobile ? '0.75rem' : '0.9rem', 
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.05em'
                  }}>
                    {event ? 'RESOLVE FATE' : 'CONFIRM TURN'}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Event Overlay */}
          {event && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
              <div style={{ ...cardStyle, maxWidth: '36rem', width: '100%', padding: '2.5rem', textAlign: 'center', border: '2px solid rgba(168,85,247,0.5)', background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '1rem', fontFamily: 'Georgia,serif' }}>{event.title}</h2>
                
                {/* Mini Treasury for Decision Insight */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '1rem', border: '1px solid rgba(251,191,36,0.1)', flexWrap: 'wrap' }}>
                  {[
                    { icon: '💰', val: player?.gold || 0, col: '#fbbf24' },
                    { icon: '🌾', val: player?.food || 0, col: '#4ade80' },
                    { icon: '👥', val: player?.manpower || 0, col: '#f87171' },
                    { icon: '⚔️', val: player?.militaryStrength || 0, col: '#fb923c' }
                  ].map(r => (
                    <div key={r.icon} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                      <span>{r.icon}</span>
                      <span style={{ color: r.col, fontWeight: 'bold' }}>{Math.floor(r.val).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <p style={{ color: '#ddd6fe', marginBottom: '2.5rem', lineHeight: '1.8', fontSize: '1.1rem', fontStyle: 'italic' }}>"{event.description}"</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {event.choices.map((c, i) => (
                    <button key={i} onClick={() => handleEvent(c)} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '0.8rem', color: '#e9d5ff', cursor: 'pointer', textAlign: 'center', fontSize: '1rem', transition: 'all 0.2s', fontWeight: '600' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      {c.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Turn Report Overlay */}
          {turnSummary && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150, padding: '1rem' }}>
              <div style={{ ...cardStyle, maxWidth: '30rem', width: '100%', padding: '2rem', background: 'linear-gradient(135deg, #1e1b4b, #1e3a8a)', border: '1px solid #60a5fa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif' }}>Turn {month}/{year} Report</h2>
                  <div style={{ fontSize: '1.5rem' }}>📜</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                  {turnSummary.map((line, i) => (
                    <div key={i} style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.6rem', borderLeft: `4px solid ${line.includes('Victory') ? '#4ade80' : line.includes('Defeat') ? '#ef4444' : '#60a5fa'}`, color: '#fef3c7', fontSize: '0.95rem', lineHeight: '1.4' }}>
                      {line}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setTurnSummary(null)}
                  style={{ width: '100%', padding: '1rem', background: 'linear-gradient(to right, #2563eb, #3b82f6)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 15px rgba(37,99,235,0.3)' }}
                >
                  DISMISS REPORT
                </button>
              </div>
            </div>
          )}

          {/* Perk Unlock Overlay */}
          {perkPrompt && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
              <div style={{ ...cardStyle, maxWidth: '40rem', width: '100%', padding: isMobile ? '1.5rem' : '3rem', textAlign: 'center', border: '2px solid #fbbf24', background: 'radial-gradient(circle at top, #4c1d95, #1e1b4b)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                <h2 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.5rem', fontFamily: 'Georgia,serif' }}>Enlightened Wisdom</h2>
                <p style={{ color: '#ddd6fe', marginBottom: '2.5rem', fontSize: '1.1rem' }}>{player?.ruler.name} has ascended. Select a permanent focus for your reign.</p>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem' }}>
                  {PERKS.map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => {
                        const nextP = { ...player };
                        nextP.ruler.perks = [...nextP.ruler.perks, p.id];
                        setPlayer(nextP);
                        setPerkPrompt(false);
                      }}
                      style={{ padding: '1.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '1rem', color: 'white', cursor: 'pointer', transition: 'all 0.3s' }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{p.icon}</div>
                      <div style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '1rem', marginBottom: '0.5rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: '1.4' }}>{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Succession Overlay */}
          {successionData && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '2rem' }}>
              <div style={{ ...cardStyle, maxWidth: '32rem', width: '100%', padding: '3rem', textAlign: 'center', border: '1px solid #fbbf24', background: 'linear-gradient(180deg, #1e1b4b 0%, #000 100%)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🪔</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '1rem', fontFamily: 'Georgia,serif' }}>Generational Passing</h2>
                <p style={{ color: '#fef3c7', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                  The reign of <strong>{successionData.old.name}</strong> has ended after {successionData.old.tenure} years. 
                  Final Legacy: <strong>{successionData.score}</strong>.
                </p>
                <div style={{ background: 'rgba(251,191,36,0.1)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2.5rem', border: '1px dashed #fbbf24' }}>
                  <div style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>THE HEIR ASCENDS</div>
                  <div style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>{successionData.new.name}</div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(254,243,199,0.7)', marginTop: '0.2rem' }}>Level {successionData.new.level} dynastic successor</div>
                </div>
                <button 
                  onClick={() => setSuccessionData(null)}
                  style={{ width: '100%', padding: '1.25rem', background: 'linear-gradient(to right, #d97706, #fbbf24)', color: '#451a03', fontWeight: 'bold', border: 'none', borderRadius: '0.8rem', cursor: 'pointer', fontSize: '1.1rem' }}
                >
                  LONG LIVE THE KING →
                </button>
              </div>
            </div>
          )}
          {showExitConfirm && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
              <div style={{ ...cardStyle, maxWidth: '28rem', width: '100%', padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(239,68,68,0.5)' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏘️</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem', fontFamily: 'Georgia,serif' }}>Seal Your Legacy?</h2>
                <p style={{ color: '#cbd5e1', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: '1.6' }}>The Mandala of Power never rests. Will you save your progress or let history forget your reign?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button
                    onClick={() => { performSave(); setScreen('menu'); setShowExitConfirm(false); }}
                    style={{ width: '100%', padding: '1rem', background: 'linear-gradient(to right, #059669, #10b981)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '0.8rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
                  >
                    💾 SAVE & RETURN TO COURT
                  </button>
                  <button
                    onClick={() => { setScreen('menu'); setShowExitConfirm(false); clearSave(); }}
                    style={{ width: '100%', padding: '1rem', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.8rem', cursor: 'pointer' }}
                  >
                    🗑️ ABANDON PROGRESS
                  </button>
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    style={{ width: '100%', padding: '1rem', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.8rem', cursor: 'pointer' }}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Global Info Tooltip Overlay */}
          {activeHelp && (
            <div 
              onClick={() => setActiveHelp(null)}
              style={{ position: 'fixed', inset: 0, zIndex: 1000000, cursor: 'pointer' }}
            >
              <div style={{ 
                position: 'fixed', 
                top: activeHelp.top + 25, 
                left: Math.min(window.innerWidth - (isMobile ? 220 : 280), Math.max(10, activeHelp.side === 'left' ? activeHelp.left : activeHelp.left - (isMobile ? 180 : 240))), 
                width: isMobile ? '12.5rem' : '16rem', 
                background: 'rgba(30,27,75,0.98)', 
                border: '1px solid #fbbf24', 
                padding: '1rem', 
                borderRadius: '0.8rem', 
                fontSize: '0.8rem', 
                color: '#fef3c7', 
                boxShadow: '0 12px 40px rgba(0,0,0,0.8)', 
                backdropFilter: 'blur(16px)', 
                textAlign: 'left',
                lineHeight: '1.5',
                pointerEvents: 'none'
              }}>
                 {activeHelp.content}
                 {isMobile && <div style={{ marginTop: '0.8rem', fontSize: '0.65rem', color: '#fbbf24', opacity: 0.7, textAlign: 'center', fontStyle: 'italic' }}>Tap anywhere to dismiss</div>}
              </div>
            </div>
          )}
        </div>

        {/* Global Notifications Overlay */}
        <div style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px' }}>
          {notifications.map(n => (
            <div key={n.id} style={{
              padding: '1rem',
              background: n.type === 'error' ? 'rgba(127,29,29,0.9)' : n.type === 'success' ? 'rgba(6,95,70,0.9)' : n.type === 'warning' ? 'rgba(180,83,9,0.9)' : 'rgba(30,58,138,0.9)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${n.type === 'error' ? '#f87171' : n.type === 'success' ? '#34d399' : n.type === 'warning' ? '#fbbf24' : '#60a5fa'}`,
              borderRadius: '0.75rem',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: '600',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              animation: 'fadeInRight 0.3s ease-out'
            }}>
              {n.msg}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// Mount app
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(MandalaOfKings));
