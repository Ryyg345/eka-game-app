import { VARNAS, TRAITS, PERKS } from './src/data/mechanics.js';
import { REGIONS, DYNASTY_REGIONS } from './src/data/regions.js';
import { DYNASTY_DATA, DYNASTY_NAMES } from './src/data/dynasties.js?v=fixed';
import { EVENTS } from './src/data/events.js';
import { rnd, pick, rndName, calcLegacy } from './src/data/utils.js';
import { makeChar, makeFaction } from './src/engine/factories.js';
import { calculateBattle, resolveConquest } from './src/engine/combat.js';
import { calculateIncome, calculateGrowth } from './src/engine/economy.js';
import { calculateActionCost, applyChoiceEffect } from './src/engine/actions.js';

const { useState, useEffect, useRef } = React;

/* ─── COMMON UI COMPONENTS ────────────────────────────────────────── */

const InfoIcon = ({ content, side = 'left', setActiveHelp }) => {
  const handleShow = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveHelp({ content, top: rect.top, left: rect.left, side });
  };
  return (
    <div style={{ position: 'relative', display: 'inline-block', marginLeft: '0.4rem', pointerEvents: 'auto' }}>
      <div onMouseEnter={handleShow} onMouseLeave={() => setActiveHelp(null)} onClick={(e) => { e.stopPropagation(); handleShow(e); }}
        style={{ width: '1rem', height: '1rem', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#fbbf24', cursor: 'pointer', fontWeight: 'bold' }}>
        i
      </div>
    </div>
  );
};

const NotificationSystem = ({ notifications }) => (
  <div style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px' }}>
    {notifications.map(n => (
      <div key={n.id} style={{ padding: '0.75rem 1rem', background: n.type === 'error' ? 'rgba(127,29,29,0.95)' : n.type === 'success' ? 'rgba(6,95,70,0.95)' : n.type === 'warning' ? 'rgba(180,83,9,0.95)' : 'rgba(30,58,138,0.95)', backdropFilter: 'blur(8px)', border: `1px solid ${n.type === 'error' ? '#f87171' : n.type === 'success' ? '#34d399' : n.type === 'warning' ? '#fbbf24' : '#60a5fa'}`, borderRadius: '0.75rem', color: '#fff', fontSize: '0.85rem', fontWeight: '600', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', animation: 'fadeInRight 0.3s ease-out', lineHeight: '1.4' }}>
        {n.msg}
      </div>
    ))}
  </div>
);

const TooltipOverlay = ({ activeHelp, isMobile, setActiveHelp }) => {
  if (!activeHelp) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, pointerEvents: isMobile ? 'auto' : 'none' }} onClick={() => isMobile && setActiveHelp(null)}>
      <div style={{ position: 'fixed', top: activeHelp.top + 25, left: Math.min(window.innerWidth - (isMobile ? 220 : 280), Math.max(10, activeHelp.side === 'left' ? activeHelp.left : activeHelp.left - (isMobile ? 180 : 240))), width: isMobile ? '12.5rem' : '16rem', background: 'rgba(30,27,75,0.98)', border: '1px solid #fbbf24', padding: '1rem', borderRadius: '0.8rem', fontSize: '0.8rem', color: '#fef3c7', boxShadow: '0 12px 40px rgba(0,0,0,0.8)', backdropFilter: 'blur(16px)', textAlign: 'left', lineHeight: '1.5', pointerEvents: 'none' }}>
         {activeHelp.content}
         {isMobile && <div style={{ marginTop: '0.8rem', fontSize: '0.65rem', color: '#fbbf24', opacity: 0.7, textAlign: 'center', fontStyle: 'italic' }}>Tap anywhere to dismiss</div>}
      </div>
    </div>
  );
};

/* ─── DASHBOARD SUB-COMPONENTS ─────────────────────────────────────── */

const ResourcesStrip = ({ player, isMobile }) => {
  const cardStyle = { background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)' };
  const regions = player?.regionIds.length || 0;
  const resources = [
    { label: 'Gold', val: Math.floor(player?.gold || 0), col: '#fbbf24', icon: '💰', sub: `+${regions * 20}/turn` },
    { label: 'Food', val: Math.floor(player?.food || 0), col: '#4ade80', icon: '🌾', sub: `+${regions * 15}/turn` },
    { label: 'Manpower', val: Math.floor(player?.manpower || 0), col: '#f87171', icon: '👥', sub: 'Recruit Pool' },
    { label: 'Military', val: player?.militaryStrength || 0, col: '#fb923c', icon: '⚔️', sub: 'Battle Strength' }
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '0.75rem' }}>
      {resources.map(r => (
        <div key={r.label} style={{ ...cardStyle, background: 'rgba(255,255,255,0.03)', textAlign: 'left', padding: isMobile ? '0.75rem' : '1rem', border: `1px solid ${r.col}22`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-5px', fontSize: '2.5rem', opacity: 0.05, transform: 'rotate(15deg)' }}>{r.icon}</div>
          <div style={{ fontSize: '0.65rem', color: r.col, fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{r.label.toUpperCase()}</div>
          <div style={{ fontSize: isMobile ? '1.25rem' : '1.75rem', fontWeight: 'bold', color: '#fff' }}>{r.val.toLocaleString()}</div>
          <div style={{ fontSize: '0.65rem', color: `${r.col}aa`, fontWeight: '600' }}>{r.sub}</div>
        </div>
      ))}
    </div>
  );
};

const ActionsPanel = ({ action, setAction, targetId, setTargetId, others, regions, executeAction, player, setActiveHelp, canUndo, undoAction }) => {
  const cardStyle = { background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)' };

  const getCost = (a) => {
    if (!player) return 0;
    return calculateActionCost(a, player, {
      traits: player.ruler?.traits?.map(t => t.id) || [],
      perks: player.ruler?.perks || []
    });
  };

  const actionDefs = [
    { id: 'develop', label: 'Develop', icon: '🛠️' },
    { id: 'recruit', label: 'Recruit', icon: '🏹' },
    { id: 'diplomacy', label: 'Diplomacy', icon: '🤝' },
    { id: 'war', label: 'War', icon: '⚔️' },
    { id: 'peace', label: 'Peace', icon: '🕊️' }
  ];

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.2rem' }}>📜</span> Royal Actions <InfoIcon content="Issue royal decrees to develop your land, raise armies, or conduct diplomacy. Press keys 1–5 to select actions." setActiveHelp={setActiveHelp} />
      </h2>
      <div style={{ fontSize: '0.6rem', color: 'rgba(254,243,199,0.4)', marginBottom: '1rem', letterSpacing: '0.05em' }}>KEYS 1–5 TO SELECT • ESC TO CANCEL</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {actionDefs.map(({ id: a, label, icon }) => {
          const cost = getCost(a);
          const costLabel = cost > 0 ? `${cost}G` : 'Free';
          const cantAfford = cost > 0 && player && player.gold < cost;
          const isSelected = action === a;
          return (
            <button key={a} onClick={() => setAction(a)} style={{
              padding: '0.5rem 0.2rem',
              background: isSelected ? 'linear-gradient(135deg, #d97706, #fbbf24)' : cantAfford ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.05)',
              color: isSelected ? '#451a03' : cantAfford ? 'rgba(254,243,199,0.3)' : '#fbbf24',
              border: isSelected ? 'none' : cantAfford ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(217,119,6,0.3)',
              borderRadius: '0.6rem',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
              boxShadow: isSelected ? '0 4px 12px rgba(217,119,6,0.3)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              <span style={{ fontSize: '0.85rem' }}>{icon}</span>
              <span>{label}</span>
              <span style={{ fontSize: '0.55rem', opacity: 0.8, color: isSelected ? '#451a03' : cantAfford ? 'rgba(254,243,199,0.2)' : '#fbbf2499' }}>{costLabel}</span>
            </button>
          );
        })}
      </div>

      {action ? (
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(217,119,6,0.2)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#fef3c7' }}>
            {action === 'develop' && '🛠️ Invest gold into infrastructure to boost food and manpower pools.'}
            {action === 'recruit' && '🏹 Spend gold and manpower to levy elite soldiers into your forces.'}
            {(action === 'diplomacy' || action === 'war' || action === 'peace') && (
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginBottom: '0.4rem', fontWeight: 'bold' }}>Target Dynasty</div>
                <select onChange={(e) => setTargetId(parseInt(e.target.value))} value={targetId || ''} style={{ width: '100%', background: '#1e1b4b', color: 'white', border: '1px solid rgba(217,119,6,0.4)', borderRadius: '0.5rem', padding: '0.6rem', fontSize: '0.85rem' }}>
                  <option value="">Select Target...</option>
                  {others.filter(f => {
                    if (action === 'war') return player.regionIds.some(rid => regions.find(r => r.id === rid)?.neighbors.some(nb => f.regionIds.includes(nb)));
                    if (action === 'peace') return player.atWar.includes(f.id);
                    return true;
                  }).map(f => {
                    const rel = player?.relations[f.id] || 0;
                    const relLabel = rel <= -60 ? 'Hostile' : rel <= -20 ? 'Tense' : rel <= 20 ? 'Neutral' : rel <= 60 ? 'Friendly' : 'Allied';
                    return (
                      <option key={f.id} value={f.id}>{f.name} — {relLabel} ({rel})</option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
          <button onClick={executeAction} style={{ width: '100%', padding: '0.8rem', background: 'linear-gradient(to right, #fbbf24, #d97706)', color: '#451a03', fontWeight: 'bold', border: 'none', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(217,119,6,0.2)' }}>
            ✔ Confirm Command
          </button>
        </div>
      ) : (
        <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(254,243,199,0.3)', fontSize: '0.85rem', border: '1px dashed rgba(217,119,6,0.2)', borderRadius: '0.8rem', flexDirection: 'column', gap: '0.3rem' }}>
          <span>Select an action above</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>or press 1–5</span>
        </div>
      )}

      {canUndo && (
        <button onClick={undoAction} style={{ width: '100%', padding: '0.55rem', background: 'transparent', color: 'rgba(254,243,199,0.55)', fontWeight: '600', border: '1px dashed rgba(254,243,199,0.2)', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '0.78rem', marginTop: '0.6rem', transition: 'all 0.2s' }}>
          ↩ Undo Last Action
        </button>
      )}
    </div>
  );
};

/* ─── OVERLAY COMPONENTS ─────────────────────────────────────────── */

const EventOverlay = ({ event, player, handleEvent }) => {
  if (!event) return null;
  const cardStyle = { background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
      <div style={{ ...cardStyle, maxWidth: '36rem', width: '100%', padding: '2.5rem', textAlign: 'center', border: '2px solid rgba(168,85,247,0.5)', background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '1rem', fontFamily: 'Georgia,serif' }}>{event.title}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '1rem', border: '1px solid rgba(251,191,36,0.1)', flexWrap: 'wrap' }}>
          {[ { icon: '💰', val: player?.gold || 0, col: '#fbbf24' }, { icon: '🌾', val: player?.food || 0, col: '#4ade80' }, { icon: '👥', val: player?.manpower || 0, col: '#f87171' }, { icon: '⚔️', val: player?.militaryStrength || 0, col: '#fb923c' } ].map(r => (
            <div key={r.icon} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}><span>{r.icon}</span><span style={{ color: r.col, fontWeight: 'bold' }}>{Math.floor(r.val).toLocaleString()}</span></div>
          ))}
        </div>
        <p style={{ color: '#ddd6fe', marginBottom: '2.5rem', lineHeight: '1.8', fontSize: '1.1rem', fontStyle: 'italic' }}>"{event.desc}"</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {event.choices.map((c, i) => (
            <button key={i} onClick={() => handleEvent(c)} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '0.8rem', color: '#e9d5ff', cursor: 'pointer', textAlign: 'center', fontSize: '1rem', transition: 'all 0.2s', fontWeight: '600' }}>{c.text}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const TurnReport = ({ turnSummary, month, year, setTurnSummary }) => {
  if (!turnSummary) return null;
  const cardStyle = { background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '1rem', padding: '2rem', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150, padding: '1rem' }}>
      <div style={{ ...cardStyle, maxWidth: '30rem', width: '100%', background: 'linear-gradient(135deg, #1e1b4b, #1e3a8a)', border: '1px solid #60a5fa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif' }}>Turn {month}/{year} Report</h2>
          <div style={{ fontSize: '1.5rem' }}>📜</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
          {turnSummary.map((line, i) => (
            <div key={i} style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.6rem', borderLeft: `4px solid ${line.includes('Victory') || line.includes('Annexed') ? '#4ade80' : line.includes('Defeat') ? '#ef4444' : line.includes('Skirmish') ? '#fb923c' : '#60a5fa'}`, color: '#fef3c7', fontSize: '0.9rem', lineHeight: '1.4' }}>{line}</div>
          ))}
        </div>
        <button onClick={() => setTurnSummary(null)} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(to right, #2563eb, #3b82f6)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '1rem' }}>DISMISS REPORT</button>
      </div>
    </div>
  );
};

const SuccessionOverlay = ({ data, setSuccessionData }) => {
    if (!data) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '2rem' }}>
            <div style={{ maxWidth: '32rem', width: '100%', textAlign: 'center', border: '1px solid #fbbf24', background: 'linear-gradient(180deg, #1e1b4b 0%, #000 100%)', padding: '3rem', borderRadius: '1.5rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🪔</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '1rem', fontFamily: 'Georgia,serif' }}>Generational Passing</h2>
                <p style={{ color: '#fef3c7', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>The reign of <strong>{data.old.name}</strong> has ended after {data.old.tenure} years. Final Legacy: <strong>{data.score}</strong>.</p>
                <div style={{ background: 'rgba(251,191,36,0.1)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2.5rem', border: '1px dashed #fbbf24' }}>
                    <div style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>THE HEIR ASCENDS</div>
                    <div style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>{data.new.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(254,243,199,0.7)', marginTop: '0.2rem' }}>Level {data.new.level} dynastic successor</div>
                </div>
                <button onClick={() => setSuccessionData(null)} style={{ width: '100%', padding: '1.25rem', background: 'linear-gradient(to right, #d97706, #fbbf24)', color: '#451a03', fontWeight: 'bold', border: 'none', borderRadius: '0.8rem', cursor: 'pointer', fontSize: '1.1rem' }}>LONG LIVE THE KING →</button>
            </div>
        </div>
    );
};

/* ─── MAIN GAME DASHBOARD ────────────────────────────────────────── */

const GameDashboard = (props) => {
  const {
    isMobile, isTablet, player, factions, month, year, culture, prestige, score, log,
    action, setAction, targetId, setTargetId, executeAction,
    nextTurn, confirmingTurn, setConfirmingTurn,
    event, handleEvent,
    turnSummary, setTurnSummary,
    perkPrompt, setPlayer, setPerkPrompt,
    successionData, setSuccessionData,
    setShowExitConfirm, showExitConfirm,
    performSave, clearSave, setScreen,
    setActiveHelp, activeHelp, notifications,
    warConfirm, setWarConfirm, executeWarAction,
    canUndo, undoAction,
    abandonConfirm, setAbandonConfirm,
    showTutorial, setShowTutorial, tutorialStep, setTutorialStep
  } = props;

  const [showHelpModal, setShowHelpModal] = useState(false);

  const cardStyle = { background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)' };
  const others = factions.filter(f => !f.isPlayer && f.regionIds.length > 0);
  const myRegions = REGIONS.filter(r => player?.regionIds?.includes(r.id));
  const enemyRegions = others.flatMap(f => REGIONS.filter(r => f.regionIds.includes(r.id)).map(r => ({ ...r, owner: f.name })));
  const frontiers = enemyRegions.filter(er => myRegions.some(mr => mr.neighbors.includes(er.id)));
  const bg = 'radial-gradient(circle at center, #581c87 0%, #1e1b4b 100%)';
  const yearsLeft = (player?.ruler?.maxTenure || 30) - (player?.ruler?.tenure || 0);
  const playerVarna = VARNAS.find(v => v.id === player?.varna);

  const getRelStatus = (rel) => {
    if (rel <= -60) return { label: 'Hostile', col: '#f87171' };
    if (rel <= -20) return { label: 'Tense', col: '#fb923c' };
    if (rel <= 20)  return { label: 'Neutral', col: '#94a3b8' };
    if (rel <= 60)  return { label: 'Friendly', col: '#4ade80' };
    return { label: 'Allied', col: '#34d399' };
  };

  const legacyFormula = player
    ? `Territories×100 + Gold×0.5 + Culture×10 + Prestige×5 + Years×2\n= ${player.regionIds.length}×100 + ${Math.floor(player.gold||0)}×0.5 + ${culture}×10 + ${prestige}×5`
    : 'Territories, Gold, Culture, Prestige, and Years ruled.';

  const tutorialContent = [
    { icon: '👑', text: "Welcome to Mandala of Kings! Your Legacy Score (top-right) measures your dynasty's greatness — built through Territories, Gold, Culture, and Prestige." },
    { icon: '📜', text: "Royal Actions (left panel) let you Develop infrastructure, Recruit armies, and conduct Diplomacy. Each button shows the Gold cost. Press keys 1–5 to select an action quickly." },
    { icon: '⏳', text: "Click the golden button (bottom-right) to Advance the Turn — income arrives, battles resolve, and events may unfold. Press Enter to confirm. Press Esc to cancel actions." }
  ];

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: isMobile ? '0.75rem' : '1.5rem', color: '#fef3c7', fontFamily: 'sans-serif', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ ...cardStyle, background: 'rgba(88,28,135,0.2)', borderColor: 'rgba(217,119,6,0.5)', marginBottom: '1rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', position: 'relative', gap: '1rem' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, #d97706, #fbbf24, #d97706)' }} />
          <div>
            <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.25rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', background: 'linear-gradient(to right, #fef3c7, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{player?.name} Dynasty</h1>
            <div style={{ display: 'flex', gap: isMobile ? '0.75rem' : '1.5rem', color: '#fbbf24', fontSize: isMobile ? '0.75rem' : '0.95rem', marginTop: '0.4rem', fontWeight: '600', letterSpacing: '0.05em', flexWrap: 'wrap', alignItems: 'center' }}>
              <span>👑 {player?.ruler.name}</span>
              <span>📅 {month}/{year} CE</span>
              <span>🏛️ {player?.regionIds.length} Realms</span>
              {yearsLeft <= 5 && yearsLeft > 0 && (
                <span style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', borderRadius: '4px', padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  ⚠️ Succession in {yearsLeft}yr
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {player?.ruler.perks.map(pid => {
                const pk = PERKS.find(p => p.id === pid);
                return pk ? (
                  <div key={pid} style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', color: '#fbbf24', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: '900' }}>
                    {pk.icon} {pk.name.toUpperCase()}
                  </div>
                ) : null;
              })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <div style={{ fontSize: '0.6rem', color: '#fbbf24', letterSpacing: '0.1em', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'flex-end', gap: '0.3rem' }}>
                LEGACY SCORE <InfoIcon content={legacyFormula} side="right" setActiveHelp={setActiveHelp} />
              </div>
              <div style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>{score.toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowHelpModal(true)} style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '0.5rem', color: '#fbbf24', fontSize: '0.75rem', padding: '0.4rem 0.6rem', cursor: 'pointer' }}>?</button>
              <button onClick={() => setShowExitConfirm(true)} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '0.5rem', color: '#fca5a5', fontSize: '0.7rem', padding: '0.4rem 0.75rem', cursor: 'pointer' }}>EXIT</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 320px', gap: '1.25rem' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <ResourcesStrip player={player} isMobile={isMobile} />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
              <ActionsPanel
                action={action} setAction={setAction}
                targetId={targetId} setTargetId={setTargetId}
                others={others} regions={REGIONS}
                executeAction={executeAction}
                player={player}
                setActiveHelp={setActiveHelp}
                canUndo={canUndo}
                undoAction={undoAction}
              />
              {/* Your Mandala */}
              <div style={cardStyle}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <span>🕌</span> Your Mandala <InfoIcon content="The internal stability of your kingdom affects resource generation. Low stability (<50%) reduces income by 20%." setActiveHelp={setActiveHelp} />
                </h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.65rem', color: '#a78bfa', fontWeight: 'bold' }}>STABILITY</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: player?.stability >= 50 ? '#a78bfa' : '#f87171' }}>{player?.stability}%</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.4)', height: '6px', borderRadius: '999px', marginBottom: '1.25rem' }}>
                  <div style={{ background: player?.stability >= 50 ? 'linear-gradient(to right, #7c3aed, #a78bfa)' : 'linear-gradient(to right, #dc2626, #f87171)', height: '100%', borderRadius: '999px', width: `${player?.stability}%`, transition: 'width 0.8s ease-out' }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '9rem', overflowY: 'auto' }}>
                  {myRegions.map(r => (<div key={r.id} style={{ padding: '0.4rem 0.8rem', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: '0.5rem', fontSize: '0.75rem' }}>{r.name}</div>))}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
              {/* Chronicles */}
              <div style={{ ...cardStyle, background: 'rgba(0,0,0,0.2)' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📜 The Chronicles <InfoIcon content="A historical log of your reign and key events." setActiveHelp={setActiveHelp} />
                </h2>
                <div style={{ maxHeight: '12rem', overflowY: 'auto' }}>
                  {log.map((l, i) => (<div key={i} style={{ fontSize: '0.8rem', color: i === 0 ? '#fbbf24' : 'rgba(254,243,199,0.7)', marginBottom: '0.6rem', padding: '0.4rem 0.6rem', background: i === 0 ? 'rgba(217,119,6,0.05)' : 'transparent', borderRadius: '0.4rem', borderLeft: i === 0 ? '3px solid #d97706' : '1px solid transparent' }}>{l}</div>))}
                </div>
              </div>
              {/* Contested Frontiers */}
              <div style={{ ...cardStyle, background: 'rgba(127,29,29,0.05)', borderColor: 'rgba(248,113,113,0.3)' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fca5a5', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  ⚔️ Contested Frontiers <InfoIcon content="Regions belonging to rival dynasties that directly border your lands — potential conquest targets." setActiveHelp={setActiveHelp} />
                </h2>
                <div style={{ maxHeight: '12rem', overflowY: 'auto' }}>
                  {frontiers.length > 0 ? frontiers.map(r => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '0.6rem', marginBottom: '0.5rem' }}>
                      <div><div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{r.name}</div><div style={{ fontSize: '0.7rem', color: '#fca5a5' }}>Held by {r.owner}</div></div>
                      <span style={{ alignSelf: 'center' }}>🎯</span>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', color: 'rgba(254,243,199,0.3)', fontSize: '0.8rem', marginTop: '3rem' }}>No direct paths for conquest currently.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Ruler Profile */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                👤 Ruler Profile
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#fef3c7', fontSize: '0.95rem' }}>{player?.ruler?.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#a78bfa', marginTop: '0.2rem' }}>
                      Level {player?.ruler?.level} · Year {player?.ruler?.tenure}/{player?.ruler?.maxTenure} of reign
                    </div>
                    <div style={{ width: '80px', height: '4px', background: 'rgba(0,0,0,0.4)', borderRadius: '2px', marginTop: '0.4rem', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'linear-gradient(to right, #d97706, #fbbf24)', width: `${Math.min(100, ((player?.ruler?.xp || 0) / ((player?.ruler?.level || 1) * 200)) * 100)}%` }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem' }}>{playerVarna?.icon}</div>
                    <div style={{ fontSize: '0.6rem', color: '#fbbf24', fontWeight: 'bold' }}>{playerVarna?.name?.split(' ')[0]}</div>
                  </div>
                </div>
                {playerVarna && (
                  <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.7rem', color: 'rgba(254,243,199,0.75)', lineHeight: '1.4' }}>
                    {playerVarna.desc}
                  </div>
                )}
                {player?.ruler?.traits?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>TRAITS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {player.ruler.traits.map(t => (
                        <div key={t.id} style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#c4b5fd', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: '600' }}>
                          {t.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Victory Progress */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24', borderBottom: '1px solid rgba(217,119,6,0.2)', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🏆 Victory Progress <InfoIcon content="Reach Culture 2000 or Prestige 2500 for a legacy victory. Eliminate all rivals for military supremacy." side="right" setActiveHelp={setActiveHelp} />
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[{ label: 'Culture 📜', val: culture, max: 2000, col: '#818cf8' }, { label: 'Prestige ⭐', val: prestige, max: 2500, col: '#fbbf24' }].map(r => (
                  <div key={r.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#fef3c7', fontWeight: '600' }}>{r.label}</span>
                      <span style={{ color: `${r.col}cc`, fontWeight: 'bold' }}>{r.val} / {r.max}</span>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.5)', height: '8px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ background: `linear-gradient(to right, ${r.col}, #fff)`, width: `${Math.min(100, (r.val / r.max) * 100)}%`, height: '100%', transition: 'width 1s cubic-bezier(0.4,0,0.2,1)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rival Mandalas */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                👑 Rival Mandalas <InfoIcon content="Other powerful dynasties in Bharat. Relations range from Hostile (−100) to Allied (+100)." side="right" setActiveHelp={setActiveHelp} />
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '20rem', overflowY: 'auto', paddingRight: '0.25rem' }}>
                {others.map(f => {
                  const rel = player?.relations[f.id] || 0;
                  const isWar = player?.atWar.includes(f.id);
                  const { label: relLabel, col: relCol } = getRelStatus(rel);
                  return (
                    <div key={f.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '0.6rem', border: `1px solid ${isWar ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.05)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '0.85rem' }}>{f.name}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: isWar ? '#f87171' : relCol }}>
                          {isWar ? '⚔️ WAR' : `${relLabel} (${rel})`}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(254,243,199,0.5)' }}>🏛️ {f.regionIds.length} Realms</div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(254,243,199,0.5)', textAlign: 'right' }}>⚔️ {f.militaryStrength.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Next Turn Button */}
        <div style={{ position: 'fixed', bottom: isMobile ? '1.5rem' : '2.5rem', right: isMobile ? '1.5rem' : '2.5rem', zIndex: 90, pointerEvents: 'none' }}>
          <button
            onClick={() => {
              if (event) return;
              if (confirmingTurn) { nextTurn(); setConfirmingTurn(false); }
              else setConfirmingTurn(true);
            }}
            disabled={!!event}
            onMouseLeave={() => confirmingTurn && setConfirmingTurn(false)}
            style={{
              pointerEvents: 'auto',
              width: confirmingTurn ? (isMobile ? '180px' : '220px') : (isMobile ? '60px' : '80px'),
              height: isMobile ? '60px' : '80px',
              borderRadius: confirmingTurn ? '40px' : '50%',
              background: event ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #d97706, #fbbf24)',
              color: event ? 'rgba(255,255,255,0.3)' : '#451a03',
              border: 'none',
              cursor: event ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: event ? 'none' : '0 10px 40px rgba(0,0,0,0.5)',
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: isMobile ? '1.5rem' : '1.8rem' }}>{event ? '📜' : (confirmingTurn ? '✔️' : '⏳')}</span>
              {confirmingTurn && <span style={{ fontWeight: '900', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>CONFIRM TURN</span>}
            </div>
          </button>
        </div>

        <EventOverlay event={event} player={player} handleEvent={handleEvent} />
        <TurnReport turnSummary={turnSummary} month={month} year={year} setTurnSummary={setTurnSummary} />
        <SuccessionOverlay data={successionData} setSuccessionData={setSuccessionData} />

        {/* Perk Selection */}
        {perkPrompt && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div style={{ ...cardStyle, maxWidth: '40rem', width: '100%', padding: isMobile ? '1.5rem' : '3rem', textAlign: 'center', border: '2px solid #fbbf24', background: 'radial-gradient(circle at top, #4c1d95, #1e1b4b)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h2 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.5rem', fontFamily: 'Georgia,serif' }}>Enlightened Wisdom</h2>
              <p style={{ color: '#ddd6fe', marginBottom: '2.5rem', fontSize: '1.1rem' }}>{player?.ruler.name} has ascended. Choose a royal doctrine.</p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem' }}>
                {PERKS.filter(p => !player.ruler.perks.includes(p.id)).map(p => (
                  <button key={p.id} onClick={() => { const nextP = { ...player }; nextP.ruler.perks = [...nextP.ruler.perks, p.id]; setPlayer(nextP); setPerkPrompt(false); }}
                    style={{ padding: '1.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '1rem', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{p.icon}</div>
                    <div style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '1rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.3rem' }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Exit Confirmation */}
        {showExitConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
            <div style={{ ...cardStyle, maxWidth: '28rem', width: '100%', padding: '2.5rem', textAlign: 'center', border: '1px solid rgba(239,68,68,0.5)' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏘️</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem', fontFamily: 'Georgia,serif' }}>Seal Your Legacy?</h2>
              <p style={{ color: '#cbd5e1', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>The Mandala of Power never rests. Will you save your progress?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => { performSave(true); setScreen('menu'); setShowExitConfirm(false); setAbandonConfirm(false); }}
                  style={{ width: '100%', padding: '1rem', background: 'linear-gradient(to right, #059669, #10b981)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '0.8rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
                  💾 SAVE & RETURN TO COURT
                </button>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.75rem' }}>
                  {!abandonConfirm ? (
                    <button
                      onClick={() => setAbandonConfirm(true)}
                      style={{ width: '100%', padding: '0.875rem', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.8rem', cursor: 'pointer', fontWeight: '600' }}>
                      🗑️ ABANDON PROGRESS
                    </button>
                  ) : (
                    <div style={{ border: '1px solid rgba(239,68,68,0.5)', borderRadius: '0.8rem', padding: '1rem', background: 'rgba(127,29,29,0.25)' }}>
                      <p style={{ color: '#fca5a5', fontSize: '0.82rem', marginBottom: '0.75rem', lineHeight: '1.5' }}>⚠️ This permanently erases your save and cannot be undone.</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setAbandonConfirm(false)} style={{ flex: 1, padding: '0.65rem', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
                        <button onClick={() => { setScreen('menu'); setShowExitConfirm(false); setAbandonConfirm(false); clearSave(); }} style={{ flex: 1, padding: '0.65rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '0.6rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>ERASE SAVE</button>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => { setShowExitConfirm(false); setAbandonConfirm(false); }} style={{ width: '100%', padding: '0.875rem', background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.8rem', cursor: 'pointer' }}>CANCEL</button>
              </div>
            </div>
          </div>
        )}

        {/* War Declaration Confirmation */}
        {warConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '1rem' }}>
            <div style={{ ...cardStyle, maxWidth: '26rem', width: '100%', textAlign: 'center', border: '2px solid rgba(239,68,68,0.5)', background: 'linear-gradient(135deg, #1c0a00, #3b0a0a)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚔️</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#fca5a5', marginBottom: '0.5rem', fontFamily: 'Georgia,serif' }}>Declare War?</h2>
              <p style={{ color: '#fef3c7', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                You are about to declare war on <strong style={{ color: '#fbbf24' }}>{warConfirm.targetName}</strong>.<br />
                <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>Peace costs 150G to restore.</span>
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.8rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#fbbf24', fontWeight: 'bold', marginBottom: '0.3rem' }}>YOUR STRENGTH</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: warConfirm.playerStrength >= warConfirm.enemyStrength ? '#4ade80' : '#f87171' }}>{warConfirm.playerStrength.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#fca5a5', fontWeight: 'bold', marginBottom: '0.3rem' }}>ENEMY STRENGTH</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fca5a5' }}>{warConfirm.enemyStrength.toLocaleString()}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 'bold', marginBottom: '1.5rem', padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', color: warConfirm.playerStrength >= warConfirm.enemyStrength * 1.3 ? '#4ade80' : warConfirm.playerStrength >= warConfirm.enemyStrength ? '#fbbf24' : '#f87171' }}>
                {warConfirm.playerStrength >= warConfirm.enemyStrength * 1.3 ? '✅ Favorable — victory likely' : warConfirm.playerStrength >= warConfirm.enemyStrength ? '⚠️ Risky — outcome uncertain' : '🚨 Reckless — defeat likely'}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setWarConfirm(null)} style={{ flex: 1, padding: '0.875rem', background: 'transparent', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', borderRadius: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button onClick={executeWarAction} style={{ flex: 2, padding: '0.875rem', background: 'linear-gradient(to right, #dc2626, #ef4444)', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '0.8rem', cursor: 'pointer', fontSize: '0.95rem' }}>⚔️ Declare War</button>
              </div>
            </div>
          </div>
        )}

        {/* In-Game Help Modal */}
        {showHelpModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '1rem' }} onClick={() => setShowHelpModal(false)}>
            <div style={{ ...cardStyle, maxWidth: '36rem', width: '100%', padding: '2rem', border: '1px solid rgba(251,191,36,0.5)', background: 'linear-gradient(135deg, #1e1b4b, #0c0a09)', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif' }}>📖 Arthashastra</h2>
                <button onClick={() => setShowHelpModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', cursor: 'pointer' }}>✕ Close</button>
              </div>
              {[
                { icon: '🎯', title: 'Objective', body: 'Build the highest Legacy Score before 1000 CE. Score = Territories×100 + Gold×0.5 + Culture×10 + Prestige×5 + Years×2.' },
                { icon: '💰', title: 'Resources', body: 'Gold (income), Food (sustenance), Manpower (recruit pool), Military Strength (battle power). Low Stability (<50%) cuts income by 20%.' },
                { icon: '📜', title: 'Actions (keys 1–5)', body: 'Develop (1): +Food, +Manpower. Recruit (2): +Military, costs Manpower. Diplomacy (3): +Relations. War (4): Declare war on a neighbor. Peace (5): End war for 150G.' },
                { icon: '⚔️', title: 'Combat', body: 'Each turn at war, your strength vs enemy strength is compared. You need 1.3× their power to conquer a region. Defeat costs Stability and Military.' },
                { icon: '👑', title: 'Succession', body: 'Rulers reign for 15–30 years then pass to an heir. Succession costs −25 Stability. Watch for the warning badge in the header.' },
                { icon: '⌨️', title: 'Shortcuts', body: 'Keys 1–5: select action. Enter/Space: advance turn. Esc: cancel / close modal.' }
              ].map(s => (
                <div key={s.title} style={{ marginBottom: '1.25rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(217,119,6,0.15)' }}>
                  <div style={{ fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.4rem', fontSize: '0.9rem' }}>{s.icon} {s.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(254,243,199,0.8)', lineHeight: '1.6' }}>{s.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* First-Run Tutorial */}
        {showTutorial && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
            <div style={{ maxWidth: '30rem', width: '100%', background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)', border: '2px solid #fbbf24', borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{tutorialContent[tutorialStep]?.icon}</div>
              <p style={{ color: '#fef3c7', fontSize: '1rem', lineHeight: '1.75', marginBottom: '1.75rem' }}>
                {tutorialContent[tutorialStep]?.text}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {tutorialContent.map((_, i) => (
                  <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === tutorialStep ? '#fbbf24' : 'rgba(251,191,36,0.25)', transition: 'background 0.3s' }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => { localStorage.setItem('mandala_tutorial_done', '1'); setShowTutorial(false); }} style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: 'rgba(254,243,199,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.8rem', cursor: 'pointer', fontSize: '0.82rem' }}>
                  Skip
                </button>
                <button
                  onClick={() => {
                    if (tutorialStep < tutorialContent.length - 1) setTutorialStep(t => t + 1);
                    else { localStorage.setItem('mandala_tutorial_done', '1'); setShowTutorial(false); }
                  }}
                  style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(to right, #d97706, #fbbf24)', color: '#451a03', fontWeight: 'bold', border: 'none', borderRadius: '0.8rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                  {tutorialStep < tutorialContent.length - 1 ? 'Next →' : '✓ Begin Reign'}
                </button>
              </div>
            </div>
          </div>
        )}

        <TooltipOverlay activeHelp={activeHelp} isMobile={isMobile} setActiveHelp={setActiveHelp} />
        <NotificationSystem notifications={notifications} />
      </div>
    </div>
  );
};

/* ─── SCREEN COMPONENTS ─────────────────────────────────────────── */

const MainMenu = ({ isMobile, difficulty, setDifficulty, loadSave, startGame, setScreen }) => {
  const bg = 'radial-gradient(circle at center, #581c87 0%, #1e1b4b 100%)';
  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '1rem' : '2rem', color: '#fef3c7', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ maxWidth: '42rem', width: '100%' }}>
        <div style={{ marginBottom: isMobile ? '1.5rem' : '2.5rem' }}>
          <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', background: 'linear-gradient(to right, #fef3c7, #fbbf24, #fef3c7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem', filter: 'drop-shadow(0 0 15px rgba(217,119,6,0.3))' }}>
            Mandala of Kings
          </h1>
          <p style={{ fontSize: isMobile ? '1rem' : '1.5rem', letterSpacing: '0.3em', opacity: 0.9, color: '#fbbf24', fontWeight: '500' }}>भारतवर्ष • BHĀRATAVARṢA</p>
          <p style={{ color: 'rgba(254,243,199,0.6)', marginTop: '0.5rem', fontSize: isMobile ? '0.8rem' : '1.1rem', letterSpacing: '0.1em' }}>600 – 1000 CE</p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '1.5rem', padding: isMobile ? '1.5rem' : '2.5rem', marginBottom: isMobile ? '2rem' : '3rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
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
          <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '1rem', border: '1px solid rgba(217,119,6,0.3)', backdropFilter: 'blur(8px)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[{ id: 'easy', label: 'Bhūpati', desc: 'Easy' }, { id: 'normal', label: 'Rāja', desc: 'Normal' }, { id: 'difficult', label: 'Mahārāja', desc: 'Hard' }].map(d => (
              <button key={d.id} onClick={() => setDifficulty(d.id)} style={{ padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.25rem', borderRadius: '0.75rem', border: 'none', background: difficulty === d.id ? 'linear-gradient(135deg, #d97706, #fbbf24)' : 'transparent', color: difficulty === d.id ? '#451a03' : '#fbbf24', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: isMobile ? '70px' : '80px' }}>
                <span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>{d.label}</span>
                <span style={{ fontSize: isMobile ? '0.5rem' : '0.55rem', opacity: 0.8 }}>{d.desc}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {localStorage.getItem('mandala_save') && (
            <button onClick={loadSave} style={{ padding: isMobile ? '0.8rem 1.5rem' : '1.1rem 2.8rem', fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', border: 'none', borderRadius: '0.8rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(16,185,129,0.3)', transition: 'all 0.2s', letterSpacing: '0.05em' }}>CONTINUE</button>
          )}
          <button onClick={() => startGame()} style={{ padding: isMobile ? '0.8rem 1.5rem' : '1.1rem 2.8rem', fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #7c4dff, #9333ea)', color: 'white', border: 'none', borderRadius: '0.8rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(124,77,255,0.3)', transition: 'all 0.2s', letterSpacing: '0.05em' }}>QUICK PLAY</button>
          <button onClick={() => setScreen('selection')} style={{ padding: isMobile ? '0.8rem 1.5rem' : '1.1rem 2.8rem', fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#451a03', border: 'none', borderRadius: '0.8rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(217,119,6,0.3)', transition: 'all 0.2s', letterSpacing: '0.05em' }}>CUSTOM DYNASTY</button>
          <button onClick={() => setScreen('howtoplay')} style={{ padding: isMobile ? '0.8rem 1.5rem' : '1.1rem 2.8rem', fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', color: '#fbbf24', border: '1px solid rgba(217,119,6,0.5)', borderRadius: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.05em' }}>HOW TO PLAY</button>
        </div>
      </div>
    </div>
  );
};

const DynastySelection = ({ isMobile, startGame, setScreen }) => {
  const bg = 'radial-gradient(circle at center, #1e1b4b 0%, #0c0a09 100%)';
  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '4rem 2rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '3rem', fontFamily: 'Georgia,serif', color: '#fbbf24', marginBottom: '1rem' }}>Select Your Sacred Lineage</h1>
        <p style={{ textAlign: 'center', color: 'rgba(254,243,199,0.6)', marginBottom: '3rem', fontSize: '1rem' }}>Which dynasty shall carry your name into the chronicles of history?</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <div onClick={() => setScreen('custom_setup')} style={{ background: 'rgba(251,191,36,0.05)', border: '2px dashed #fbbf24', borderRadius: '1.25rem', padding: '2rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✍️</div>
            <h3 style={{ color: '#fbbf24', fontFamily: 'Georgia,serif', fontSize: '1.25rem' }}>Forge Custom Lineage</h3>
            <p style={{ color: 'rgba(254,243,199,0.6)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Create your own dynasty name, ruler, and varna.</p>
          </div>
          {DYNASTY_NAMES.map((name, idx) => (
            <div key={name} onClick={() => startGame(idx)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '1.25rem', padding: '2rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#fbbf24', fontFamily: 'Georgia,serif', marginBottom: '0.5rem' }}>{name}</h3>
              <p style={{ color: 'rgba(254,243,199,0.6)', fontSize: '0.85rem' }}>{DYNASTY_DATA[name]?.male?.slice(0, 2).join(', ') || 'Royal rulers'}...</p>
              <div style={{ marginTop: '0.75rem', display: 'inline-block', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '4px', padding: '0.15rem 0.5rem', fontSize: '0.65rem', color: '#fbbf24', fontWeight: 'bold', letterSpacing: '0.05em' }}>HISTORICAL</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => setScreen('menu')} style={{ padding: '0.8rem 2rem', background: 'rgba(255,255,255,0.05)', color: '#fbbf24', border: '1px solid rgba(217,119,6,0.4)', borderRadius: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>← Return to Imperial Court</button>
        </div>
      </div>
    </div>
  );
};

const CustomSetup = ({ isMobile, setScreen, startGame }) => {
  const [cName, setCName] = useState('New');
  const [cRuler, setCRuler] = useState('Ruler');
  const [cVarna, setCVarna] = useState('kshatriya');
  const [cCapital, setCCapital] = useState('indraprastha');
  const [errors, setErrors] = useState({});

  const handleBeginReign = () => {
    const errs = {};
    if (!cName.trim()) errs.name = 'Dynasty name is required.';
    else if (cName.trim().length > 30) errs.name = 'Maximum 30 characters.';
    if (!cRuler.trim()) errs.ruler = 'Ruler name is required.';
    else if (cRuler.trim().length > 30) errs.ruler = 'Maximum 30 characters.';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    startGame(-1, { name: cName.trim(), rulerName: cRuler.trim(), varna: cVarna, capitalId: cCapital });
  };

  const cardStyle = { background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '1.5rem', padding: isMobile ? '1.5rem' : '2.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at center, #4c1d95 0%, #0c0a09 100%)', padding: '2rem 1rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontFamily: 'Georgia,serif', color: '#fbbf24', marginBottom: '2rem' }}>Forge Your Sacred Lineage</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={cardStyle}>
            <h2 style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>IDENTITY (अस्मिता)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(254,243,199,0.5)', display: 'block', marginBottom: '0.4rem' }}>DYNASTY NAME</label>
                <input
                  value={cName}
                  onChange={e => { setCName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: null })); }}
                  maxLength={30}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: `1px solid ${errors.name ? '#f87171' : 'rgba(251,191,36,0.3)'}`, padding: '0.8rem', color: '#fff', borderRadius: '0.6rem', fontSize: '1rem', boxSizing: 'border-box' }}
                />
                {errors.name && <div style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.3rem' }}>{errors.name}</div>}
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(254,243,199,0.5)', display: 'block', marginBottom: '0.4rem' }}>STARTING RULER</label>
                <input
                  value={cRuler}
                  onChange={e => { setCRuler(e.target.value); if (errors.ruler) setErrors(p => ({ ...p, ruler: null })); }}
                  maxLength={30}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: `1px solid ${errors.ruler ? '#f87171' : 'rgba(251,191,36,0.3)'}`, padding: '0.8rem', color: '#fff', borderRadius: '0.6rem', fontSize: '1rem', boxSizing: 'border-box' }}
                />
                {errors.ruler && <div style={{ color: '#f87171', fontSize: '0.72rem', marginTop: '0.3rem' }}>{errors.ruler}</div>}
              </div>
            </div>
          </div>
          <div style={cardStyle}>
            <h2 style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>VARNA PHILOSOPHY (वर्ण)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              {VARNAS.map(v => (
                <div key={v.id} onClick={() => setCVarna(v.id)} style={{ padding: '1rem', background: cVarna === v.id ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${cVarna === v.id ? '#fbbf24' : 'rgba(255,255,255,0.1)'}`, borderRadius: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{v.icon} {v.name}</span>
                    <span style={{ fontSize: '0.7rem', background: '#fbbf24', color: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>BONUS</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={cardStyle}>
            <h2 style={{ fontSize: '0.9rem', color: '#fbbf24', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '1rem' }}>CAPITAL CITY (राजधानी)</h2>
            <select value={cCapital} onChange={e => setCCapital(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid rgba(251,191,36,0.3)', padding: '0.8rem', borderRadius: '0.6rem', fontSize: '1rem' }}>
              {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button onClick={() => setScreen('selection')} style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.5)', borderRadius: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>← BACK</button>
            <button onClick={handleBeginReign} style={{ flex: 2, padding: '1rem', background: 'linear-gradient(to right, #d97706, #fbbf24)', color: '#451a03', border: 'none', borderRadius: '1rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>BEGIN REIGN →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HowToPlay = ({ isMobile, setScreen }) => (
  <div style={{ minHeight: '100vh', background: '#1e1b4b', padding: '4rem 2rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', textAlign: 'center', color: '#fbbf24', fontFamily: 'Georgia,serif' }}>Arthashastra</h1>
      <p style={{ textAlign: 'center', color: 'rgba(254,243,199,0.6)', marginTop: '0.5rem', marginBottom: '3rem', letterSpacing: '0.15em' }}>THE ART OF RULING • राजधर्म</p>
      {[
        { icon: '🎯', title: 'Objective', body: 'Build the highest Legacy Score before the year 1000 CE. Legacy = Territories×100 + Gold×0.5 + Culture×10 + Prestige×5 + Years×2.' },
        { icon: '💰', title: 'Artha — Resources', body: 'Gold funds all actions. Food sustains your population. Manpower feeds your recruitment pool. Military Strength determines battle outcomes. Low Stability (<50%) reduces income by 20%.' },
        { icon: '📜', title: 'Royal Actions (keys 1–5)', body: 'Develop (1): invest gold for +Food and +Manpower. Recruit (2): spend gold and manpower for +Military. Diplomacy (3): improve relations. War (4): declare war on a neighboring dynasty. Peace (5): end a war for 150G.' },
        { icon: '⚔️', title: 'Combat', body: 'Each turn while at war, your Military Strength is compared to the enemy\'s. You need 1.3× their power to conquer a region. Defeat costs Stability and Military Strength.' },
        { icon: '👑', title: 'Succession', body: 'Rulers reign for 15–30 years, then an heir ascends. Succession costs −25 Stability. A badge in the header warns you when succession is near.' },
        { icon: '⌨️', title: 'Shortcuts', body: 'Keys 1–5 select actions. Enter or Space advances the turn. Esc cancels the current action or closes modals. The ? button (header) opens this guide in-game.' }
      ].map(s => (
        <div key={s.title} style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: '1rem' }}>
          <div style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{s.icon} {s.title}</div>
          <div style={{ color: 'rgba(254,243,199,0.8)', lineHeight: '1.7', fontSize: '0.95rem' }}>{s.body}</div>
        </div>
      ))}
      <button onClick={() => setScreen('menu')} style={{ width: '100%', padding: '1.5rem', background: 'linear-gradient(to right, #d97706, #fbbf24)', color: '#451a03', fontWeight: 'bold', borderRadius: '1rem', border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' }}>← RETURN TO COURT</button>
    </div>
  </div>
);

const GameOver = ({ screen, player, culture, prestige, year, isMobile, setScreen }) => {
  const score = calcLegacy(player, culture, prestige, year - 600);
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at center, #1e1b4b, #000)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: '#fef3c7', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '32rem' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{screen === 'victory' ? '🏆' : '📜'}</div>
        <h1 style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif' }}>{screen === 'victory' ? 'Victory!' : 'End of Reign'}</h1>
        <p style={{ color: 'rgba(254,243,199,0.6)', marginBottom: '1rem', fontSize: '1rem' }}>{screen === 'victory' ? 'Chakravartin — Universal Ruler' : 'Your dynasty\'s chronicles are sealed.'}</p>
        <div style={{ fontSize: '5rem', fontWeight: 'bold', color: '#fff', margin: '2rem 0', filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.4))' }}>{score.toLocaleString()}</div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(254,243,199,0.5)', marginBottom: '3rem' }}>LEGACY SCORE</div>
        <button onClick={() => setScreen('menu')} style={{ padding: '1.5rem 3rem', background: 'linear-gradient(to right, #d97706, #fbbf24)', fontWeight: 'bold', borderRadius: '1rem', border: 'none', cursor: 'pointer', color: '#451a03', fontSize: '1.1rem' }}>ESTABLISH NEW LINEAGE</button>
      </div>
    </div>
  );
};

/* ─── MAIN APPLICATION ─────────────────────────────────────────────── */

function MandalaOfKings() {
  const [screen, setScreen] = useState('menu');
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(600);
  const [factions, setFactions] = useState([]);
  const [player, setPlayer] = useState(null);
  const [culture, setCulture] = useState(10);
  const [prestige, setPrestige] = useState(20);
  const [difficulty, setDifficulty] = useState('normal');
  const [perkPrompt, setPerkPrompt] = useState(false);
  const [successionData, setSuccessionData] = useState(null);
  const [log, setLog] = useState([]);
  const [event, setEvent] = useState(null);
  const [action, setAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [activeHelp, setActiveHelp] = useState(null);
  const [victoryType, setVictoryType] = useState(null);
  const [turnSummary, setTurnSummary] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [confirmingTurn, setConfirmingTurn] = useState(false);
  // New UX state
  const [warConfirm, setWarConfirm] = useState(null);
  const [playerSnapshot, setPlayerSnapshot] = useState(null);
  const [canUndo, setCanUndo] = useState(false);
  const [abandonConfirm, setAbandonConfirm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const notify = (msg, type = 'info') => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 6000);
  };

  const performSave = (showToast = false) => {
    if (player) {
      localStorage.setItem('mandala_save', JSON.stringify({ month, year, factions, player, culture, prestige, log, difficulty }));
      if (showToast) notify('💾 Progress saved.', 'success');
    }
  };

  useEffect(() => { if (screen === 'playing') performSave(); }, [month, year, factions, player, culture, prestige, screen, difficulty, log]);

  const loadSave = () => {
    const saved = localStorage.getItem('mandala_save');
    if (saved) {
      const s = JSON.parse(saved);
      setMonth(s.month); setYear(s.year); setFactions(s.factions); setPlayer(s.player);
      setCulture(s.culture); setPrestige(s.prestige); setLog(s.log || []); setScreen('playing');
      setDifficulty(s.difficulty || 'normal');
    }
  };

  const clearSave = () => localStorage.removeItem('mandala_save');

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;

  const addLog = (msg) => setLog(p => [msg, ...p].slice(0, 15));

  const startGame = (pIdx = -1, customData = null) => {
    let newFactions = [];
    let playerFaction = null;
    if (customData) {
      playerFaction = makeFaction(0, true, customData);
      playerFaction.regionIds = [customData.capitalId];
      newFactions.push(playerFaction);
      DYNASTY_NAMES.forEach((name, i) => { const ai = makeFaction(i + 1); ai.regionIds = [DYNASTY_REGIONS[name]]; newFactions.push(ai); });
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
    REGIONS.forEach(reg => {
      if (!newFactions.some(f => f.regionIds.includes(reg.id))) {
        const neighbors = newFactions.filter(f => f.regionIds.some(rid => REGIONS.find(r => r.id === rid)?.neighbors.includes(reg.id)));
        pick(neighbors.length ? neighbors : newFactions).regionIds.push(reg.id);
      }
    });
    newFactions.forEach(f => { const c = f.regionIds.length; f.gold = c * 25; f.food = c * 30; f.manpower = c * 500; f.militaryStrength = c * 1000; });
    setFactions(newFactions);
    setPlayer(playerFaction);
    setScreen('playing');
    setMonth(1); setYear(600); setCulture(10); setPrestige(20);
    setLog([`The chronicles of ${playerFaction.name} begin.`]);
    setCanUndo(false); setPlayerSnapshot(null); setWarConfirm(null);
    clearSave();
    if (!localStorage.getItem('mandala_tutorial_done')) {
      setTutorialStep(0);
      setShowTutorial(true);
    }
  };

  const handleEvent = (choice) => {
    const { player: updatedPlayer, prestige: prestigeAdd, culture: cultureAdd, notifications: resNotifs } = applyChoiceEffect(choice, player);
    if (prestigeAdd) setPrestige(v => v + prestigeAdd);
    if (cultureAdd) setCulture(v => v + cultureAdd);
    resNotifs.forEach(n => notify(n.msg, n.type));
    setPlayer(updatedPlayer);
    setEvent(null);
    addLog(`📜 ${choice.text}`);
  };

  const executeAction = () => {
    if (!action) return;
    const p = { ...player };
    const cost = calculateActionCost(action, p, { traits: p.ruler.traits.map(t => t.id), perks: p.ruler.perks });

    if (p.gold < cost) return notify('💰 Treasury empty! Advance a turn to collect income first.', 'error');
    if (action === 'recruit' && p.manpower < 250) return notify('👥 Not enough manpower! Use Develop to grow your recruit pool.', 'error');
    if (['diplomacy', 'war', 'peace'].includes(action) && !targetId) return notify('Select a target dynasty first.', 'warning');

    if (action === 'war') {
      if (p.atWar.includes(targetId)) return notify('⚔️ Already at war with this dynasty!', 'warning');
      const target = factions.find(f => f.id === targetId);
      setWarConfirm({ targetId, targetName: target.name, playerStrength: p.militaryStrength, enemyStrength: target.militaryStrength });
      return;
    }

    // Save full snapshot for undo
    const snapshot = { player: JSON.parse(JSON.stringify(player)), cultureDelta: 0 };
    let msg = '';
    p.gold -= cost;

    if (action === 'develop') {
      p.food += 100; p.manpower += 200;
      setCulture(v => v + 5);
      snapshot.cultureDelta = 5;
      msg = '🛠️ Infrastructure investment completed.';
    } else if (action === 'recruit') {
      p.manpower -= 250; p.militaryStrength += 600;
      msg = '🏹 Levies raised. Military strength increased.';
    } else if (action === 'diplomacy') {
      const curRel = p.relations[targetId] || 0;
      if (curRel >= 100) return notify(`🤝 Relations with ${factions.find(f => f.id === targetId)?.name} are already maxed (100). Gold wasted!`, 'warning');
      p.relations[targetId] = Math.min(100, curRel + 20);
      msg = `🤝 Diplomacy improved with ${factions.find(f => f.id === targetId)?.name}.`;
    } else if (action === 'peace') {
      p.atWar = p.atWar.filter(id => id !== targetId);
      msg = `🕊️ Peace declared with ${factions.find(f => f.id === targetId)?.name}.`;
    }

    p.ruler.xp += 40;
    setPlayerSnapshot(snapshot);
    setCanUndo(true);
    setPlayer(p);
    setAction(null);
    setTargetId(null);
    notify(msg, 'success');
    addLog(msg);
  };

  const executeWarAction = () => {
    if (!warConfirm) return;
    const p = { ...player };
    p.atWar = [...p.atWar, warConfirm.targetId];
    p.relations[warConfirm.targetId] = -100;
    p.ruler.xp += 40;
    const msg = `⚔️ War declared on ${warConfirm.targetName}!`;
    setPlayer(p);
    setWarConfirm(null);
    setAction(null);
    setTargetId(null);
    notify(msg, 'warning');
    addLog(msg);
  };

  const undoAction = () => {
    if (!playerSnapshot || !canUndo) return;
    setPlayer(playerSnapshot.player);
    if (playerSnapshot.cultureDelta) setCulture(v => v - playerSnapshot.cultureDelta);
    setPlayerSnapshot(null);
    setCanUndo(false);
    notify('↩️ Last action reversed.', 'info');
  };

  const nextTurn = () => {
    setCanUndo(false);
    setPlayerSnapshot(null);
    const nm = month === 12 ? 1 : month + 1;
    const ny = month === 12 ? year + 1 : year;
    setMonth(nm); setYear(ny);

    const p = { ...player };
    if (nm === 1) { p.ruler.tenure += 1; p.ruler.xp += 50; }
    if (p.ruler.xp >= p.ruler.level * 200) { p.ruler.xp -= p.ruler.level * 200; p.ruler.level += 1; setPerkPrompt(true); }
    if (p.ruler.tenure >= p.ruler.maxTenure) {
      const old = { ...p.ruler };
      const newR = makeChar(p.name, true, (p.rulerIndex || 0) + 1);
      p.ruler = newR; p.rulerIndex = (p.rulerIndex || 0) + 1;
      p.stability = Math.max(20, p.stability - 25);
      setSuccessionData({ old, new: newR, score: calcLegacy(p, culture, prestige, old.tenure) });
    }

    const { goldIncome, foodIncome } = calculateIncome(p, REGIONS, difficulty);
    p.gold += goldIncome; p.food += foodIncome; p.manpower += calculateGrowth(p);

    const battleLog = [];
    let updatedFactions = factions.map(f => {
      if (f.id === p.id) return p;
      if (!p.atWar.includes(f.id)) return f;
      const { attackerWon, defenderWon } = calculateBattle(p, f, { varna: p.varna, traits: p.ruler.traits.map(t => t.id), perks: p.ruler.perks });
      const enemy = { ...f };
      if (attackerWon) {
        const { success, regionId } = resolveConquest(p, enemy, REGIONS);
        if (success) {
          const regionName = REGIONS.find(r => r.id === regionId)?.name || regionId;
          p.regionIds.push(regionId);
          enemy.regionIds = enemy.regionIds.filter(id => id !== regionId);
          battleLog.push(`⚔️ Victory! Annexed ${regionName} from ${enemy.name}.`);
        } else {
          battleLog.push(`⚔️ Victory over ${enemy.name} — frontier holds.`);
        }
      } else if (defenderWon) {
        p.stability = Math.max(0, p.stability - 10);
        p.militaryStrength = Math.max(0, p.militaryStrength - 200);
        battleLog.push(`💔 Defeat against ${enemy.name}. Stability −10, Military −200.`);
      } else {
        battleLog.push(`⚔️ Skirmish with ${enemy.name} — no decisive outcome.`);
      }
      return enemy;
    });

    setFactions(updatedFactions);
    setPlayer(p);
    setTurnSummary([`💰 Income: +${goldIncome}G`, `🌾 Food: +${foodIncome}`, `👥 Manpower: +${calculateGrowth(p)}`, ...battleLog]);

    if (updatedFactions.filter(f => !f.isPlayer && f.regionIds.length > 0).length === 0) { setScreen('victory'); return; }
    if (p.regionIds.length <= 0) { setScreen('ended'); return; }
    if (Math.random() < 0.3) setEvent(pick(EVENTS));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (screen !== 'playing') return;
      if (e.key === 'Escape') {
        if (warConfirm) { setWarConfirm(null); return; }
        if (showExitConfirm) { setShowExitConfirm(false); setAbandonConfirm(false); return; }
        if (action) { setAction(null); setTargetId(null); return; }
        return;
      }
      const blocked = event || turnSummary || successionData || perkPrompt || showExitConfirm || warConfirm || showTutorial;
      if ((e.key === 'Enter' || e.key === ' ') && !blocked) {
        e.preventDefault();
        if (confirmingTurn) { nextTurn(); setConfirmingTurn(false); }
        else setConfirmingTurn(true);
        return;
      }
      if (!blocked && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const actions = ['develop', 'recruit', 'diplomacy', 'war', 'peace'];
        const idx = parseInt(e.key) - 1;
        if (idx >= 0 && idx <= 4) setAction(actions[idx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, event, turnSummary, successionData, perkPrompt, showExitConfirm, confirmingTurn, action, warConfirm, showTutorial, nextTurn]);

  const commonProps = {
    isMobile, isTablet, setScreen,
    player, factions, month, year, culture, prestige,
    score: calcLegacy(player, culture, prestige, year - 600),
    log, action, setAction, targetId, setTargetId, executeAction,
    nextTurn, confirmingTurn, setConfirmingTurn,
    event, handleEvent,
    turnSummary, setTurnSummary,
    perkPrompt, setPlayer, setPerkPrompt,
    successionData, setSuccessionData,
    setShowExitConfirm, showExitConfirm,
    performSave, clearSave,
    setActiveHelp, activeHelp, notifications,
    difficulty, setDifficulty, startGame, calcLegacy, loadSave,
    // New UX props
    warConfirm, setWarConfirm, executeWarAction,
    canUndo, undoAction,
    abandonConfirm, setAbandonConfirm,
    showTutorial, setShowTutorial, tutorialStep, setTutorialStep
  };

  if (screen === 'menu') return <MainMenu {...commonProps} />;
  if (screen === 'selection') return <DynastySelection {...commonProps} />;
  if (screen === 'custom_setup') return <CustomSetup {...commonProps} />;
  if (screen === 'howtoplay') return <HowToPlay {...commonProps} />;
  if (screen === 'victory' || screen === 'ended') return <GameOver {...commonProps} victoryType={victoryType} />;
  if (screen === 'playing') return <GameDashboard {...commonProps} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(MandalaOfKings));
