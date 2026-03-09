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
  'Chalukya': {
    male: ['Pulakeshin', 'Vikramaditya', 'Vinayaditya', 'Vijayaditya', 'Somesvara', 'Tailapa'],
    female: ['Akkadevi', 'Jakalladevi', 'Kumkumadevi', 'Lokamahadevi']
  },
  'Pallava': {
    male: ['Simhavishnu', 'Mahendravarman', 'Narasimhavarman', 'Paramesvaravarman', 'Nandivarman', 'Dantivarman'],
    female: ['Rangapataka', 'Rajasimha-Mahadevi', 'Charudevi']
  },
  'Rashtrakuta': {
    male: ['Dantidurga', 'Krishna', 'Dhruva', 'Govinda', 'Amoghavarsha', 'Indra', 'Khoṭṭiga'],
    female: ['Chandrobebba', 'Revakanimmadi', 'Abbalabbe']
  },
  'Pratihara': {
    male: ['Nagabhata', 'Vatsaraja', 'Mihira Bhoja', 'Mahendrapala', 'Mahipala', 'Rajapala'],
    female: ['Nirmaladevi', 'Mahalakshmi', 'Kanchana']
  },
  'Pala': {
    male: ['Gopala', 'Dharmapala', 'Devapala', 'Narayanapala', 'Mahipala', 'Nayapala'],
    female: ['Deddadevi', 'Rannadevi', 'Bhagyadevi']
  },
  'Chola': {
    male: ['Vijayalaya', 'Aditya', 'Parantaka', 'Gandaraditya', 'Sundara', 'Rajaraja', 'Rajendra'],
    female: ['Kundavai', 'Sembiyan Mahadevi', 'Vanavan Mahadevi', 'Viramahadevi']
  },
  'Pandya': {
    male: ['Kadungon', 'Arikesari', 'Maravarman', 'Varaguna', 'Srimara', 'Jatila'],
    female: ['Meenakshi', 'Mangayarkkarasi', 'Sembiyan']
  },
  'Chera': {
    male: ['Kulasekhara', 'Rajasekhara', 'Sthanu Ravi', 'Rama Varma', 'Godha Varma'],
    female: ['Phullanubhuti', 'Kottai']
  },
  'Kashmir': {
    male: ['Lalitaditya', 'Jayapida', 'Avantivarman', 'Sankaravarman', 'Unmattavanti'],
    female: ['Didda', 'Sugandha', 'Kota Rani']
  },
  'Chandela': {
    male: ['Nannuka', 'Jeja', 'Dhanga', 'Ganda', 'Vidyadhara', 'Vijayapala'],
    female: ['Durgavati', 'Satyavati']
  },
  'Paramara': {
    male: ['Upendra', 'Siyaka', 'Munja', 'Bhoja', 'Sindhuraja', 'Udayaditya'],
    female: ['Mrinalvati', 'Malayamati']
  }
};

const DYNASTY_NAMES = Object.keys(DYNASTY_DATA);
const TRAITS = [
  { id: 'strategist', name: 'Brilliant Strategist', desc: '+15% Battle Power' },
  { id: 'administrator', name: 'Wise Administrator', desc: '+10% Gold/Food Income' },
  { id: 'diplomat', name: 'Charismatic Diplomat', desc: '-20% Diplomacy Cost' },
  { id: 'ambitious', name: 'Ambitious', desc: '+5 Prestige/mo, -5 Stability/mo' },
  { id: 'patron', name: 'Scholarly Patron', desc: '+2 Culture/mo' },
  { id: 'ruthless', name: 'Ruthless', desc: '+20% Battle Lethality, -10 All Relations' },
  { id: 'pious', name: 'Pious', desc: '+10 Max Stability' },
  { id: 'cunning', name: 'Cunning', desc: '+5% Maneuver in Battle' },
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

const makeChar = (dynasty, isSelf) => ({
  name: rndName(dynasty),
  traits: isSelf ? [pick(TRAITS), pick(TRAITS)] : [pick(TRAITS)],
});

const makeFaction = (index, isPlayer = false) => {
  const dName = DYNASTY_NAMES[index];
  const t = isPlayer ? 3 : rnd(1, 4);
  return {
    id: index, name: dName,
    ruler: makeChar(dName, isPlayer),
    gold: rnd(100, 300), food: rnd(150, 400),
    territories: t, manpower: t * rnd(500, 1000), stability: rnd(40, 80),
    isPlayer, militaryStrength: t * rnd(800, 1200),
    relations: {}, atWar: [],
  };
};

const calcLegacy = (p, culture, prestige, years) =>
  Math.floor(p.territories * 100 + p.gold * 0.5 + culture * 10 + prestige * 5 + years * 2);

function MandalaOfKings() {
  const [screen, setScreen] = useState('menu');
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(600);
  const [factions, setFactions] = useState([]);
  const [player, setPlayer] = useState(null);
  const [culture, setCulture] = useState(10);
  const [prestige, setPrestige] = useState(20);

  // --- Auto-Save System ---
  const performSave = () => {
    if (player) {
      const gameState = { month, year, factions, player, culture, prestige, log };
      localStorage.setItem('mandala_save', JSON.stringify(gameState));
    }
  };

  React.useEffect(() => {
    if (screen === 'playing') performSave();
  }, [month, year, factions, player, culture, prestige, screen]);

  const loadSave = () => {
    const saved = localStorage.getItem('mandala_save');
    if (saved) {
      const s = JSON.parse(saved);
      setMonth(s.month); setYear(s.year);
      setFactions(s.factions); setPlayer(s.player);
      setCulture(s.culture); setPrestige(s.prestige);
      setLog(s.log); setScreen('playing');
    }
  };

  const clearSave = () => localStorage.removeItem('mandala_save');
  const [event, setEvent] = useState(null);
  const [log, setLog] = useState([]);
  const [action, setAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [savedState, setSavedState] = useState(null);
  const [victoryType, setVictoryType] = useState(null);
  const [victoryPrompt, setVictoryPrompt] = useState(false);
  const [turnSummary, setTurnSummary] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const addLog = (msg) => setLog(p => [msg, ...p].slice(0, 10));

  const startGame = (playerDynastyIndex = null) => {
    const n = rnd(6, 10);
    // Shuffle all available dynasty indices
    let allIndices = Array.from({ length: DYNASTY_NAMES.length }, (_, i) => i);
    for (let i = allIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
    }

    // If a dynasty was selected, ensure it's at the start and included
    let selectedIndices;
    if (playerDynastyIndex !== null) {
      const filtered = allIndices.filter(i => i !== playerDynastyIndex);
      selectedIndices = [playerDynastyIndex, ...filtered.slice(0, n - 1)];
    } else {
      selectedIndices = allIndices.slice(0, n);
    }

    const fs = selectedIndices.map((dIdx, i) => makeFaction(dIdx, i === 0));
    fs.forEach(f => fs.forEach(o => { if (f.id !== o.id) f.relations[o.id] = rnd(-50, 50); }));

    setFactions(fs);
    setPlayer(fs[0]);
    setMonth(1);
    setYear(600);
    setCulture(10);
    setPrestige(20);
    setLog(['Your reign begins. May the gods favor your dynasty.']);
    setEvent(null);
    setAction(null);
    setTargetId(null);
    setVictoryPrompt(false);
    setVictoryType(null);
    setSavedState(null);
    clearSave();
    setScreen('playing');
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
      const enemy = factions.find(f => !f.isPlayer && !f.atWar.includes(p.id) && f.territories > 0);
      if (enemy) { p.atWar = [...p.atWar, enemy.id]; enemy.atWar = [...enemy.atWar, p.id]; addLog(`⚔️ ${enemy.name} declares war!`); }
    }
    if (e.duel) {
      if (Math.random() > 0.4) { setPrestige(v => v + 20); addLog('🏆 You won the duel! +20 prestige'); }
      else { setPrestige(v => Math.max(0, v - 10)); addLog('💔 You lost the duel. -10 prestige'); }
    }
    setPlayer(p);
    setFactions(fs => fs.map(f => f.id === 0 ? p : f));
    addLog(`${event.title} resolved.`);
    setEvent(null);
  };

  const executeAction = () => {
    if (!action || !player) return;
    const hasTrait = (tid) => player.ruler.traits.some(t => t.id === tid);
    let p = { ...player };
    let fs = [...factions];
    if (action === 'develop') {
      if (p.gold < 50) { addLog('⚠️ Need 50 gold'); return; }
      p.gold -= 50; p.food += 30; p.manpower += 100;
      addLog('📈 Realm developed: +30 food, +100 manpower');
    }
    if (action === 'recruit') {
      if (p.gold < 80 || p.manpower < 200) { addLog('⚠️ Need 80 gold & 200 manpower'); return; }
      p.gold -= 80; p.manpower -= 200; p.militaryStrength += 500;
      addLog('⚔️ Army recruited: +500 military strength');
    }
    if (action === 'diplomacy') {
      const cost = hasTrait('diplomat') ? 24 : 30;
      const tgt = fs.find(f => f.id === targetId);
      if (!tgt || p.gold < cost) { addLog(`⚠️ Need ${cost} gold & a target`); return; }
      p.gold -= cost;
      p.relations[tgt.id] = Math.min(100, (p.relations[tgt.id] || 0) + 20);
      tgt.relations[p.id] = p.relations[tgt.id];
      addLog(`🤝 Relations improved with ${tgt.name}`);
    }
    if (action === 'war') {
      const tgt = fs.find(f => f.id === targetId);
      if (!tgt || p.atWar.includes(tgt.id)) { addLog('⚠️ Pick a valid target'); return; }
      p.atWar = [...p.atWar, tgt.id]; tgt.atWar = [...tgt.atWar, p.id];
      addLog(`⚔️ War declared on ${tgt.name}!`);
    }
    if (action === 'peace') {
      const tgt = fs.find(f => f.id === targetId);
      if (!tgt || !p.atWar.includes(tgt.id)) { addLog('⚠️ Not at war with that faction'); return; }
      if (p.gold < 50) { addLog('⚠️ Need 50 gold'); return; }
      p.gold -= 50;
      p.atWar = p.atWar.filter(id => id !== tgt.id);
      tgt.atWar = tgt.atWar.filter(id => id !== p.id);
      addLog(`✌️ Peace made with ${tgt.name}`);
    }
    setPlayer(p); setFactions(fs.map(f => f.id === 0 ? p : f));
    setAction(null); setTargetId(null);
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
    let goldIncome = p.territories * 20 + rnd(-10, 20);
    let foodIncome = p.territories * 15 + rnd(-5, 15);
    let manpowerGrowth = Math.floor(p.territories * 5 * (p.stability / 100));

    if (hasTrait('administrator')) { goldIncome = Math.floor(goldIncome * 1.1); foodIncome = Math.floor(foodIncome * 1.1); }
    if (hasTrait('ambitious')) { setPrestige(v => v + 5); p.stability = Math.max(0, p.stability - 5); localAddLog('⭐ Ambitious: +5 Prestige, -5 Stability'); }
    if (hasTrait('patron')) { setCulture(v => v + 2); localAddLog('📜 Patron: +2 Culture'); }
    if (hasTrait('pious')) p.stability = Math.min(100, p.stability + 2);

    p.gold += goldIncome;
    p.food += foodIncome;
    p.manpower += manpowerGrowth;
    p.food -= p.manpower / 50;

    let updatedFactions = factions.map(f => {
      if (f.id === 0) return p;
      if (!p.atWar.includes(f.id)) return f;

      let pMod = 1 + Math.random() * 0.5;
      if (hasTrait('strategist')) pMod += 0.15;
      if (hasTrait('ruthless')) pMod += 0.2;
      if (hasTrait('cunning')) pMod += 0.05;

      const pp = p.militaryStrength * pMod;
      const ep = f.militaryStrength * (1 + Math.random() * 0.5);
      const enemy = { ...f };
      if (pp > ep * 1.3) {
        const gain = rnd(1, Math.min(2, enemy.territories));
        p.territories += gain; enemy.territories -= gain;
        p.militaryStrength -= rnd(100, 300);
        enemy.militaryStrength -= rnd(200, 500);
        setPrestige(v => v + 15);
        localAddLog(`⚔️ Victory vs ${enemy.name}! +${gain} territories`);
        if (enemy.territories <= 0) { p.atWar = p.atWar.filter(id => id !== enemy.id); localAddLog(`🏆 ${enemy.name} has fallen!`); }
      } else if (ep > pp * 1.3) {
        const lose = rnd(1, Math.min(2, p.territories));
        p.territories -= lose; enemy.territories += lose;
        p.militaryStrength -= rnd(200, 500);
        enemy.militaryStrength -= rnd(100, 300);
        setPrestige(v => Math.max(0, v - 10));
        localAddLog(`💔 Defeat vs ${enemy.name}! -${lose} territories`);
      } else {
        p.militaryStrength -= rnd(50, 150);
        enemy.militaryStrength -= rnd(50, 150);
        localAddLog(`⚔️ Stalemate with ${enemy.name}`);
      }
      return enemy;
    });

    setFactions(updatedFactions); setPlayer(p);

    const summary = [
      `💰 Economy: +${goldIncome} Gold, +${foodIncome} Food`,
      `👥 Growth: +${manpowerGrowth} Manpower`,
      ...turnLogs
    ];
    setTurnSummary(summary);

    const alive = updatedFactions.filter(f => !f.isPlayer && f.territories > 0);
    if (!victoryPrompt) {
      if (p.territories >= 8) { setVictoryType('military'); setVictoryPrompt(true); return; }
      if (alive.length === 0) { setVictoryType('conquest'); setVictoryPrompt(true); return; }
      if (culture >= 100) { setVictoryType('cultural'); setVictoryPrompt(true); return; }
      if (prestige >= 150) { setVictoryType('prestige'); setVictoryPrompt(true); return; }
    }
    if (p.territories <= 0) { setScreen('ended'); return; }
    if (ny >= 1000) { setScreen('ended'); return; }
    if (Math.random() < 0.7) setEvent(pick(EVENTS));
  };

  /* ─── MENU ─────────────────────────────────────────────────────────── */
  if (screen === 'menu') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#78350f,#7f1d1d,#581c87)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '38rem', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', background: 'linear-gradient(to right,#fef3c7,#fbbf24,#fef3c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
          Mandala of Kings
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>भारतवर्ष • Bhāratavarṣa</p>
        <p style={{ color: '#fbbf24', marginBottom: '2.5rem' }}>600–1000 CE</p>
        <div style={{ background: 'rgba(0,0,0,0.35)', border: '2px solid rgba(217,119,6,0.4)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ lineHeight: '1.7', marginBottom: '1.25rem' }}>Command a dynasty in medieval India. Navigate war, diplomacy, and patronage — and build a legacy that outlasts the ages.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem', color: 'rgba(254,243,199,0.85)' }}>
            {[['👑', 'Rule through generations'], ['⚔️', 'Wage war and forge alliances'], ['💰', 'Manage gold, food & manpower'], ['📜', 'Navigate crises and events']].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><span>{icon}</span><span>{text}</span></div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {localStorage.getItem('mandala_save') && (
            <button onClick={loadSave} style={{ padding: '0.875rem 2.5rem', fontSize: '1.125rem', fontWeight: 'bold', background: 'linear-gradient(to right,#059669,#10b981)', color: 'white', border: '2px solid #34d399', borderRadius: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)' }}>
              Continue Reign
            </button>
          )}
          <button onClick={() => startGame()} style={{ padding: '0.875rem 2.5rem', fontSize: '1.125rem', fontWeight: 'bold', background: 'linear-gradient(to right,#d97706,#f59e0b)', color: 'white', border: '2px solid #fbbf24', borderRadius: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)' }}>
            Quick Play
          </button>
          <button onClick={() => setScreen('selection')} style={{ padding: '0.875rem 2.5rem', fontSize: '1.125rem', fontWeight: 'bold', background: 'linear-gradient(to right,#7c3aed,#9333ea)', color: 'white', border: '2px solid #c084fc', borderRadius: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)' }}>
            Choose Your Dynasty
          </button>
          <button onClick={() => setScreen('howtoplay')} style={{ padding: '0.875rem 1.5rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.4)', color: '#fbbf24', border: '2px solid rgba(217,119,6,0.5)', borderRadius: '0.5rem', cursor: 'pointer' }}>
            How to Play
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── SELECTION ────────────────────────────────────────────────────── */
  if (screen === 'selection') return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)', padding: '2rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', textAlign: 'center', marginBottom: '0.5rem' }}>Select Your Dynasty</h1>
        <p style={{ textAlign: 'center', color: '#fbbf24', marginBottom: '2.5rem' }}>Forge your path in Bhāratavarṣa</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {DYNASTY_NAMES.map((name, idx) => {
            const data = DYNASTY_DATA[name];
            return (
              <div key={name}
                onClick={() => startGame(idx)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px solid rgba(217,119,6,0.3)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  hover: { transform: 'translateY(-4px)', borderColor: '#fbbf24' }
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(217,119,6,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              >
                <h3 style={{ fontSize: '1.5rem', color: '#fbbf24', marginBottom: '0.75rem', fontFamily: 'Georgia,serif' }}>{name}</h3>
                <div style={{ fontSize: '0.85rem', color: 'rgba(254,243,199,0.7)', marginBottom: '1rem' }}>
                  Notable Rulers: {data.male.slice(0, 3).join(', ')}...
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <span style={{ background: 'rgba(217,119,6,0.2)', color: '#fbbf24', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Historical</span>
                  <span style={{ background: 'rgba(124,58,237,0.2)', color: '#c084fc', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Major Power</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => setScreen('menu')} style={{ background: 'none', border: 'none', color: '#fbbf24', textDecoration: 'underline', cursor: 'pointer' }}>
            Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── HOW TO PLAY ───────────────────────────────────────────────────── */
  if (screen === 'howtoplay') {
    const S = ({ title, children }) => (
      <div style={{ background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(217,119,6,0.4)', borderRadius: '0.75rem', padding: '1.25rem' }}>
        <h2 style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.75rem' }}>{title}</h2>
        {children}
      </div>
    );
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#78350f,#7f1d1d,#581c87)', padding: '2rem', color: '#fef3c7', fontFamily: 'sans-serif', overflowY: 'auto' }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', marginBottom: '0.25rem' }}>How to Play</h1>
          <p style={{ color: '#fbbf24', marginBottom: '1.5rem' }}>Master medieval Indian statecraft</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <S title="🎯 Objective">
              <p style={{ lineHeight: '1.7' }}>Build the greatest dynasty before 1000 CE. Your <strong>Legacy Score</strong> = territories×100 + gold×0.5 + culture×10 + prestige×5 + years×2. Game ends when you lose all territories or reach year 1000.</p>
            </S>
            <S title="🔄 Each Turn">
              {['Review resources, territories & military strength.', 'Execute one Royal Action.', 'Resolve any Event that appears.', 'Click End Turn — wars auto-resolve, income arrives.'].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ background: '#d97706', color: 'white', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem', flexShrink: 0 }}>{i + 1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </S>
            <S title="💰 Resources">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                {[['Gold 🟡', 'Treasury. ~+20/territory/month.'], ['Food 🌾', '+15/territory/month. Consumed by manpower.'], ['Manpower 👥', 'Grows with stability. Needed to recruit armies.'], ['Stability 🛡️', '0–100%. Higher = more manpower growth.'], ['Culture 📚', 'Earned via events. Victory at 100.'], ['Prestige ⭐', 'Earned via battles & events. Victory at 150.']].map(([l, d]) => (
                  <div key={l} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '0.375rem' }}>
                    <div style={{ fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.25rem' }}>{l}</div>
                    <div style={{ color: 'rgba(254,243,199,0.8)', fontSize: '0.8rem' }}>{d}</div>
                  </div>
                ))}
              </div>
            </S>
            <S title="⚙️ Royal Actions">
              {[['Develop Realm', '-50 gold → +30 food, +100 manpower'], ['Recruit Army', '-80 gold, -200 manpower → +500 military'], ['Improve Relations', '-30 gold → +20 relations with target'], ['Declare War', 'Begin conquest (select target)'], ['Sue for Peace', '-50 gold → end active war (select target)']].map(([n, d]) => (
                <div key={n} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
                  <strong style={{ color: '#fbbf24', minWidth: '10rem' }}>{n}:</strong>
                  <span style={{ color: 'rgba(254,243,199,0.8)' }}>{d}</span>
                </div>
              ))}
            </S>
            <S title="⚔️ Warfare">
              <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Wars resolve each turn. Strength is compared with random variance.</p>
              <div style={{ background: 'rgba(127,29,29,0.3)', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
                <div>Your power &gt;30% higher → <strong>Win</strong> 1–2 territories</div>
                <div>Roughly equal → <strong>Stalemate</strong>, both weaken</div>
                <div>Enemy &gt;30% higher → <strong>Lose</strong> 1–2 territories</div>
              </div>
            </S>
            <S title="🏆 Victory Conditions">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                {[['⚔️ Military', 'Control 8+ territories'], ['👑 Conquest', 'Defeat all rivals'], ['📚 Cultural', 'Reach 100 culture'], ['⭐ Prestige', 'Reach 150 prestige']].map(([t, d]) => (
                  <div key={t} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '0.375rem' }}>
                    <div style={{ fontWeight: 'bold', color: '#fbbf24' }}>{t}</div>
                    <div style={{ color: 'rgba(254,243,199,0.8)' }}>{d}</div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'rgba(254,243,199,0.6)' }}>When a condition triggers you can Claim Victory or Continue Playing for a higher score.</p>
            </S>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', paddingBottom: '2rem' }}>
            <button onClick={() => setScreen('menu')} style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.4)', color: '#fbbf24', border: '2px solid rgba(217,119,6,0.5)', borderRadius: '0.5rem', cursor: 'pointer' }}>← Menu</button>
            {savedState ? (
              <button onClick={() => {
                setMonth(savedState.month); setYear(savedState.year);
                setFactions(savedState.factions); setPlayer(savedState.player);
                setCulture(savedState.culture); setPrestige(savedState.prestige);
                setLog(savedState.log); setScreen('playing');
              }} style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right,#16a34a,#22c55e)', color: 'white', border: '2px solid #4ade80', borderRadius: '0.5rem', cursor: 'pointer' }}>← Return to Game</button>
            ) : (
              <button onClick={startGame} style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right,#d97706,#f59e0b)', color: 'white', border: '2px solid #fbbf24', borderRadius: '0.5rem', cursor: 'pointer' }}>Start Playing →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ─── END SCREENS ───────────────────────────────────────────────────── */
  if (screen === 'victory' || screen === 'ended') {
    const score = calcLegacy(player, culture, prestige, year - 600);
    const TITLES = {
      military: { t: 'Military Dominance', s: 'Chakravartin — Universal Ruler' },
      conquest: { t: 'Total Conquest', s: 'Samrāṭ — Emperor of All' },
      cultural: { t: 'Cultural Apex', s: 'Kavi Chakravarti — Emperor of Arts' },
      prestige: { t: 'Legendary Prestige', s: 'Mahārājādhirāja — King of Kings' },
    };
    const vt = victoryType ? TITLES[victoryType] : null;
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#78350f,#7f1d1d,#581c87)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '36rem', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '0.5rem' }}>{screen === 'victory' ? '🏆' : '📜'}</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', marginBottom: '0.5rem' }}>
            {screen === 'victory' ? vt?.t : "Dynasty's End"}
          </h1>
          {vt && <p style={{ color: '#fbbf24', fontSize: '1.25rem', fontStyle: 'italic', marginBottom: '1rem' }}>{vt.s}</p>}
          <div style={{ background: 'rgba(0,0,0,0.4)', border: '2px solid rgba(217,119,6,0.4)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ color: '#fbbf24', marginBottom: '0.25rem' }}>Legacy Score</div>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1.25rem' }}>{score}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[['Territories', player?.territories], ['Years Ruled', year - 600], ['Culture', culture], ['Prestige', prestige]].map(([l, v]) => (
                <div key={l} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '0.375rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>{l}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setScreen('menu')} style={{ padding: '0.75rem 2rem', fontWeight: 'bold', background: 'linear-gradient(to right,#d97706,#f59e0b)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}>
            New Dynasty
          </button>
        </div>
      </div>
    );
  }

  /* ─── MAIN GAME ─────────────────────────────────────────────────────── */
  const others = factions.filter(f => !f.isPlayer && f.territories > 0);
  const score = calcLegacy(player, culture, prestige, year - 600);
  const bg = 'linear-gradient(135deg,#451a03,#450a0a,#3b0764)';
  const card = { background: 'rgba(0,0,0,0.45)', border: '2px solid rgba(217,119,6,0.4)', borderRadius: '0.75rem', padding: '1rem' };

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '1rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ ...card, background: 'rgba(120,53,15,0.4)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', fontFamily: 'Georgia,serif' }}>{player?.name} Dynasty</h1>
              <div style={{ display: 'flex', gap: '1rem', color: '#fbbf24', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                <span>👑 {player?.ruler.name}</span>
                <span>📅 {month}/{year} CE</span>
                <span>🏛️ {player?.territories} territories</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <button onClick={() => setShowExitConfirm(true)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '0.25rem', color: '#fca5a5', fontSize: '0.65rem', padding: '0.2rem 0.5rem', cursor: 'pointer' }}>
                Exit Game
              </button>
              <div style={{ fontSize: '0.7rem', color: '#fbbf24', marginTop: '1.5rem' }}>LEGACY</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{score}</div>
              <button onClick={() => setShowHelp(h => !h)} style={{ marginTop: '0.25rem', padding: '0.2rem 0.5rem', background: 'rgba(88,28,135,0.5)', border: '1px solid rgba(168,85,247,0.5)', borderRadius: '0.25rem', color: '#d8b4fe', fontSize: '0.7rem', cursor: 'pointer' }}>
                {showHelp ? 'Hide Help' : '? Help'}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {player?.ruler.traits.map((t, i) => (
              <span key={i} title={t.desc} style={{ padding: '0.15rem 0.5rem', background: 'rgba(88,28,135,0.5)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '9999px', fontSize: '0.7rem', color: '#e9d5ff', cursor: 'help' }}>
                {t.name}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Help */}
        {showHelp && (
          <div style={{ ...card, background: 'rgba(88,28,135,0.25)', border: '2px solid rgba(168,85,247,0.4)', marginBottom: '1rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', color: 'rgba(233,213,255,0.85)' }}>
              <div><div style={{ color: '#d8b4fe', fontWeight: 'bold', marginBottom: '0.25rem' }}>Actions</div>Develop: 50g → food+man<br />Recruit: 80g+200men → +500mil<br />Diplomacy: 30g → +20 rel<br />War: free (pick target)</div>
              <div><div style={{ color: '#d8b4fe', fontWeight: 'bold', marginBottom: '0.25rem' }}>Income/Turn</div>Gold: ~20 × territories<br />Food: ~15 × territories<br />Manpower: stability-based</div>
              <div><div style={{ color: '#d8b4fe', fontWeight: 'bold', marginBottom: '0.25rem' }}>Victory</div>⚔️ 8+ territories<br />👑 Defeat all rivals<br />📚 100 culture<br />⭐ 150 prestige</div>
            </div>
            <button onClick={() => { setSavedState({ month, year, factions, player, culture, prestige, log }); setScreen('howtoplay'); }}
              style={{ marginTop: '0.5rem', color: '#c4b5fd', fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Full Guide →
            </button>
          </div>
        )}

        {/* Resource bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {[
            { label: 'Gold', val: Math.floor(player?.gold || 0), col: '#fbbf24', sub: `+${(player?.territories || 0) * 20}/mo` },
            { label: 'Food', val: Math.floor(player?.food || 0), col: '#4ade80', sub: `+${(player?.territories || 0) * 15}/mo` },
            { label: 'Manpower', val: Math.floor(player?.manpower || 0), col: '#f87171', sub: '' },
            { label: 'Military', val: player?.militaryStrength || 0, col: '#fb923c', sub: '' },
            { label: 'Stability', val: `${player?.stability || 0}%`, col: '#a78bfa', sub: '' },
          ].map(r => (
            <div key={r.label} style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${r.col}33`, borderRadius: '0.5rem', padding: '0.625rem' }}>
              <div style={{ fontSize: '0.7rem', color: r.col, marginBottom: '0.25rem' }}>{r.label}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{r.val}</div>
              {r.sub && <div style={{ fontSize: '0.65rem', color: `${r.col}99` }}>{r.sub}</div>}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          {[{ label: 'Culture 📚', val: culture, max: 100, col: '#818cf8' }, { label: 'Prestige ⭐', val: prestige, max: 150, col: '#fbbf24' }].map(r => (
            <div key={r.label} style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${r.col}33`, borderRadius: '0.5rem', padding: '0.625rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: r.col }}>{r.label}</span>
                <span style={{ fontSize: '0.75rem', color: `${r.col}99` }}>{r.val}/{r.max}</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.5)', height: '6px', borderRadius: '9999px' }}>
                <div style={{ background: r.col, height: '100%', borderRadius: '9999px', width: `${Math.min(100, (r.val / r.max) * 100)}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Event */}
        {event && (
          <div style={{ ...card, background: 'rgba(88,28,135,0.35)', border: '2px solid rgba(168,85,247,0.5)', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#e9d5ff', marginBottom: '0.5rem' }}>{event.title}</h2>
            <p style={{ color: '#ddd6fe', marginBottom: '1rem', lineHeight: '1.6' }}>{event.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {event.choices.map((c, i) => (
                <button key={i} onClick={() => handleEvent(c)} style={{ padding: '0.75rem', background: 'rgba(88,28,135,0.5)', border: '2px solid rgba(168,85,247,0.4)', borderRadius: '0.5rem', color: '#e9d5ff', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}>
                  {c.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions + Diplomacy */}
        {!event && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={card}>
              <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.75rem' }}>Royal Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { id: 'develop', label: 'Develop Realm', sub: '-50g → +food, +manpower', col: '#4ade80' },
                  { id: 'recruit', label: 'Recruit Army', sub: '-80g -200men → +500 mil', col: '#f87171' },
                  { id: 'diplomacy', label: 'Improve Relations', sub: '-30g → +20 relations', col: '#60a5fa' },
                  { id: 'war', label: 'Declare War', sub: 'Pick a target to conquer', col: '#fb923c' },
                  ...(player?.atWar?.length > 0 ? [{ id: 'peace', label: 'Sue for Peace', sub: '-50g → end war', col: '#a78bfa' }] : []),
                ].map(a => (
                  <button key={a.id} onClick={() => setAction(action === a.id ? null : a.id)} style={{
                    padding: '0.5rem 0.75rem', textAlign: 'left', borderRadius: '0.375rem', cursor: 'pointer',
                    background: action === a.id ? `${a.col}22` : 'rgba(0,0,0,0.3)',
                    border: `2px solid ${action === a.id ? a.col : `${a.col}44`}`,
                  }}>
                    <div style={{ fontWeight: 'bold', color: a.col, fontSize: '0.875rem' }}>{a.label}</div>
                    <div style={{ color: `${a.col}99`, fontSize: '0.75rem' }}>{a.sub}</div>
                  </button>
                ))}
              </div>
              {action && ['diplomacy', 'war', 'peace'].includes(action) && (
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginBottom: '0.25rem' }}>Select target:</div>
                  <select value={targetId || ''} onChange={e => setTargetId(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '0.375rem', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(217,119,6,0.5)', borderRadius: '0.25rem', color: '#fef3c7', fontSize: '0.875rem' }}>
                    <option value="">-- Select --</option>
                    {others.map(f => <option key={f.id} value={f.id}>{f.name} ({f.territories} ter.) mil:{f.militaryStrength}</option>)}
                  </select>
                </div>
              )}
              {action && (
                <button onClick={executeAction} style={{ marginTop: '0.75rem', width: '100%', padding: '0.5rem', fontWeight: 'bold', background: 'linear-gradient(to right,#d97706,#f59e0b)', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  Execute
                </button>
              )}
            </div>

            <div style={card}>
              <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.75rem' }}>Other Dynasties</h2>
              <div style={{ maxHeight: '14rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {others.map(f => {
                  const rel = player?.relations[f.id] || 0;
                  const atWar = player?.atWar.includes(f.id);
                  return (
                    <div key={f.id} style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: '0.375rem', padding: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{f.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(251,191,36,0.6)' }}>{f.ruler.name}</div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                          <div style={{ color: '#fbbf24' }}>{f.territories} ter.</div>
                          <div style={{ color: 'rgba(251,191,36,0.6)' }}>⚔️ {f.militaryStrength}</div>
                        </div>
                      </div>
                      {atWar ? (
                        <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'rgba(127,29,29,0.5)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '0.25rem', color: '#fca5a5' }}>⚔️ At War</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', height: '4px', borderRadius: '9999px' }}>
                            <div style={{ height: '100%', borderRadius: '9999px', background: rel > 50 ? '#22c55e' : rel > 0 ? '#eab308' : rel > -50 ? '#f97316' : '#ef4444', width: `${Math.abs(rel)}%` }} />
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#fbbf24' }}>{rel > 0 ? '+' : ''}{rel}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Chronicle */}
        <div style={{ ...card, marginBottom: '1rem' }}>
          <div style={{ fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.5rem', fontSize: '0.875rem' }}>📜 Chronicles</div>
          <div style={{ maxHeight: '8rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {log.map((l, i) => (
              <div key={i} style={{ fontSize: '0.8rem', color: 'rgba(254,243,199,0.75)', borderLeft: '2px solid rgba(217,119,6,0.3)', paddingLeft: '0.5rem' }}>{l}</div>
            ))}
          </div>
        </div>

        {/* End Turn */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={nextTurn} disabled={!!event} style={{
            padding: '0.875rem 3rem', fontSize: '1.125rem', fontWeight: 'bold', borderRadius: '0.5rem', border: 'none', cursor: event ? 'not-allowed' : 'pointer',
            background: event ? '#374151' : 'linear-gradient(to right,#d97706,#f59e0b)', color: 'white',
          }}>
            {event ? 'Resolve Event First' : 'End Turn →'}
          </button>
        </div>
      </div>

      {/* Victory Prompt */}
      {victoryPrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg,#78350f,#7f1d1d,#581c87)', border: '4px solid #d97706', borderRadius: '1rem', padding: '2rem', maxWidth: '32rem', width: '100%', textAlign: 'center', color: '#fef3c7' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>🏆</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', marginBottom: '0.5rem' }}>Victory Achieved!</h2>
            <p style={{ color: '#fbbf24', fontSize: '1.125rem', fontStyle: 'italic', marginBottom: '0.75rem' }}>
              {victoryType === 'military' ? 'Chakravartin — Universal Ruler' :
                victoryType === 'conquest' ? 'Samrāṭ — Emperor of All' :
                  victoryType === 'cultural' ? 'Kavi Chakravarti — Emperor of Arts' : 'Mahārājādhirāja — King of Kings'}
            </p>
            <p style={{ marginBottom: '1.5rem' }}>Claim your victory now, or keep expanding your legacy?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => { setVictoryPrompt(false); setScreen('victory'); }} style={{ padding: '0.75rem 1.75rem', fontWeight: 'bold', background: 'linear-gradient(to right,#d97706,#f59e0b)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}>
                Claim Victory
              </button>
              <button onClick={() => { setVictoryPrompt(false); addLog('You press on for greater glory...'); }} style={{ padding: '0.75rem 1.75rem', fontWeight: 'bold', background: 'linear-gradient(to right,#7c3aed,#8b5cf6)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}>
                Continue Playing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Turn Summary Modal */}
      {turnSummary && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', border: '2px solid #818cf8', borderRadius: '1rem', padding: '1.5rem', maxWidth: '28rem', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif' }}>Turn {month}/{year} Report</h2>
              <div style={{ fontSize: '1.5rem' }}>📜</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {turnSummary.map((line, i) => (
                <div key={i} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.5rem', borderLeft: `3px solid ${line.includes('Victory') ? '#4ade80' : line.includes('Defeat') ? '#ef4444' : '#60a5fa'}`, color: '#fef3c7', fontSize: '0.9rem' }}>
                  {line}
                </div>
              ))}
            </div>
            <button
              onClick={() => setTurnSummary(null)}
              style={{ width: '100%', padding: '0.875rem', background: 'linear-gradient(to right,#4f46e5,#6366f1)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}
            >
              Close Report
            </button>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', border: '2px solid #818cf8', borderRadius: '1rem', padding: '2rem', maxWidth: '28rem', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚪</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem', fontFamily: 'Georgia,serif' }}>Exit Your Reign?</h2>
            <p style={{ color: '#c4b5fd', marginBottom: '2rem', fontSize: '0.95rem' }}>Do you want to save your progress or walk away and abandon this dynasty?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => { performSave(); setScreen('menu'); setShowExitConfirm(false); }}
                style={{ width: '100%', padding: '0.875rem', background: 'linear-gradient(to right,#059669,#10b981)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
              >
                💾 Save & Exit
              </button>
              <button
                onClick={() => { setScreen('menu'); setShowExitConfirm(false); clearSave(); }}
                style={{ width: '100%', padding: '0.875rem', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '0.5rem', cursor: 'pointer' }}
              >
                🗑️ Abandon Reign
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                style={{ width: '100%', padding: '0.875rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', cursor: 'pointer' }}
              >
                Back to Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Mount app
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(MandalaOfKings));
