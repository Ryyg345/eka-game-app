import { VARNAS, TRAITS, PERKS } from './src/data/mechanics.js';
import { REGIONS, DYNASTY_REGIONS } from './src/data/regions.js';
import { DYNASTY_DATA, DYNASTY_NAMES } from './src/data/dynasties.js?v=fixed';
import { EVENTS } from './src/data/events.js';
import { rnd, pick, rndName, calcLegacy } from './src/data/utils.js';
import { makeChar, makeFaction } from './src/engine/factories.js';
import { calculateBattle, resolveConquest } from './src/engine/combat.js';
import { calculateIncome, calculateGrowth } from './src/engine/economy.js';
import { calculateActionCost, applyChoiceEffect } from './src/engine/actions.js';

const { useState, useEffect } = React;

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
      <div key={n.id} style={{ padding: '1rem', background: n.type === 'error' ? 'rgba(127,29,29,0.9)' : n.type === 'success' ? 'rgba(6,95,70,0.9)' : n.type === 'warning' ? 'rgba(180,83,9,0.9)' : 'rgba(30,58,138,0.9)', backdropFilter: 'blur(8px)', border: `1px solid ${n.type === 'error' ? '#f87171' : n.type === 'success' ? '#34d399' : n.type === 'warning' ? '#fbbf24' : '#60a5fa'}`, borderRadius: '0.75rem', color: '#fff', fontSize: '0.85rem', fontWeight: '600', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', animation: 'fadeInRight 0.3s ease-out' }}>
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
  const resources = [
    { label: 'Gold', val: Math.floor(player?.gold || 0), col: '#fbbf24', icon: '💰', sub: `+${(player?.regionIds.length || 0) * 20}` },
    { label: 'Food', val: Math.floor(player?.food || 0), col: '#4ade80', icon: '🌾', sub: `+${(player?.regionIds.length || 0) * 15}` },
    { label: 'Manpower', val: Math.floor(player?.manpower || 0), col: '#f87171', icon: '👥', sub: 'Pool' },
    { label: 'Military', val: player?.militaryStrength || 0, col: '#fb923c', icon: '⚔️', sub: 'Strength' }
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

const ActionsPanel = ({ action, setAction, targetId, setTargetId, others, regions, executeAction, player, setActiveHelp }) => {
  const cardStyle = { background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)' };
  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.2rem' }}>📜</span> Royal Actions <InfoIcon content="Issue royal decrees to develop your land, raise armies, or conduct diplomacy with foreign powers." setActiveHelp={setActiveHelp} />
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '1.25rem' }}>
        {['develop', 'recruit', 'diplomacy', 'war', 'peace'].map(a => (
          <button key={a} onClick={() => setAction(a)} style={{ padding: '0.75rem 0.4rem', background: action === a ? 'linear-gradient(135deg, #d97706, #fbbf24)' : 'rgba(255,255,255,0.05)', color: action === a ? '#451a03' : '#fbbf24', border: action === a ? 'none' : '1px solid rgba(217,119,6,0.3)', borderRadius: '0.6rem', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s', boxShadow: action === a ? '0 4px 12px rgba(217,119,6,0.3)' : 'none' }}>{a}</button>
        ))}
      </div>
      {action ? (
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid rgba(217,119,6,0.2)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#fef3c7' }}>
            {action === 'develop' && '🛠️ Invest gold into infrastructure to boost food and manpower.'}
            {action === 'recruit' && '⚔️ Spend gold and manpower to levy elite soldiers.'}
            {(action === 'diplomacy' || action === 'war' || action === 'peace') && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginBottom: '0.4rem', fontWeight: 'bold' }}>Target Dynasty</div>
                <select onChange={(e) => setTargetId(parseInt(e.target.value))} value={targetId || ''} style={{ width: '100%', background: '#1e1b4b', color: 'white', border: '1px solid rgba(217,119,6,0.4)', borderRadius: '0.5rem', padding: '0.6rem', fontSize: '0.85rem' }}>
                  <option value="">Select Target...</option>
                  {others.filter(f => {
                    if (action === 'war') return player.regionIds.some(rid => regions.find(r => r.id === rid)?.neighbors.some(nb => f.regionIds.includes(nb)));
                    if (action === 'peace') return player.atWar.includes(f.id);
                    return true;
                  }).map(f => (
                    <option key={f.id} value={f.id}>{f.name} (Rel: {player?.relations[f.id] || 0})</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button onClick={executeAction} style={{ width: '100%', padding: '0.8rem', background: 'linear-gradient(to right, #fbbf24, #d97706)', color: '#451a03', fontWeight: 'bold', border: 'none', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(217,119,6,0.2)' }}>Confirm Command</button>
        </div>
      ) : (
        <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(254,243,199,0.3)', fontSize: '0.85rem', border: '1px dashed rgba(217,119,6,0.2)', borderRadius: '0.8rem' }}>Select an action to begin</div>
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
            <div key={i} style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.6rem', borderLeft: `4px solid ${line.includes('Victory') ? '#4ade80' : line.includes('Defeat') ? '#ef4444' : '#60a5fa'}`, color: '#fef3c7', fontSize: '0.95rem', lineHeight: '1.4' }}>{line}</div>
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
  const { isMobile, isTablet, player, factions, month, year, culture, prestige, score, log, action, setAction, targetId, setTargetId, executeAction, nextTurn, confirmingTurn, setConfirmingTurn, event, handleEvent, turnSummary, setTurnSummary, perkPrompt, setPlayer, setPerkPrompt, successionData, setSuccessionData, setShowExitConfirm, showExitConfirm, performSave, clearSave, setActiveHelp, activeHelp, notifications, setScreen } = props;
  const cardStyle = { background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)' };
  const others = factions.filter(f => !f.isPlayer && f.regionIds.length > 0);
  const myRegions = REGIONS.filter(r => player?.regionIds?.includes(r.id));
  const enemyRegions = others.flatMap(f => REGIONS.filter(r => f.regionIds.includes(r.id)).map(r => ({ ...r, owner: f.name })));
  const frontiers = enemyRegions.filter(er => myRegions.some(mr => mr.neighbors.includes(er.id)));
  const bg = 'radial-gradient(circle at center, #581c87 0%, #1e1b4b 100%)';

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: isMobile ? '0.75rem' : '1.5rem', color: '#fef3c7', fontFamily: 'sans-serif', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ ...cardStyle, background: 'rgba(88,28,135,0.2)', borderColor: 'rgba(217,119,6,0.5)', marginBottom: '1rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', position: 'relative', gap: '1rem' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, #d97706, #fbbf24, #d97706)' }} />
          <div>
            <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.25rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', background: 'linear-gradient(to right, #fef3c7, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{player?.name} Dynasty</h1>
            <div style={{ display: 'flex', gap: isMobile ? '0.75rem' : '1.5rem', color: '#fbbf24', fontSize: isMobile ? '0.75rem' : '0.95rem', marginTop: '0.4rem', fontWeight: '600', letterSpacing: '0.05em', flexWrap: 'wrap' }}>
              <span>👑 {player?.ruler.name}</span>
              <span>📅 {month}/{year} CE</span>
              <span>🏛️ {player?.regionIds.length} Realms</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
              <div style={{ fontSize: '0.6rem', color: '#fbbf24', letterSpacing: '0.1em', fontWeight: 'bold' }}>LEGACY SCORE <InfoIcon content="Your final score is calculated based on realms controlled, resources, culture, and prestige." side="right" setActiveHelp={setActiveHelp} /></div>
              <div style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', fontWeight: 'bold', lineHeight: '1' }}>{score}</div>
            </div>
            <button onClick={() => setShowExitConfirm(true)} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '0.5rem', color: '#fca5a5', fontSize: '0.7rem', padding: '0.4rem 0.75rem', cursor: 'pointer' }}>EXIT</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1fr 340px', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <ResourcesStrip player={player} isMobile={isMobile} />
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
              <ActionsPanel action={action} setAction={setAction} targetId={targetId} setTargetId={setTargetId} others={others} regions={REGIONS} executeAction={executeAction} player={player} setActiveHelp={setActiveHelp} />
              <div style={cardStyle}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'Georgia,serif', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🕌</span> Your Mandala <InfoIcon content="The internal stability of your kingdom affects resource generation. Low stability can lead to revolts." setActiveHelp={setActiveHelp} />
                </h2>
                <div style={{ background: 'rgba(0,0,0,0.4)', height: '6px', borderRadius: '999px', marginBottom: '1.25rem' }}>
                  <div style={{ background: 'linear-gradient(to right, #7c3aed, #a78bfa)', height: '100%', borderRadius: '999px', width: `${player?.stability}%` }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {myRegions.map(r => (<div key={r.id} style={{ padding: '0.4rem 0.8rem', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: '0.5rem', fontSize: '0.75rem' }}>{r.name}</div>))}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ ...cardStyle, background: 'rgba(0,0,0,0.2)' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📜 Chronicles</h2>
                <div style={{ maxHeight: '12rem', overflowY: 'auto' }}>
                  {log.map((l, i) => (<div key={i} style={{ fontSize: '0.8rem', color: i === 0 ? '#fbbf24' : 'rgba(254,243,199,0.7)', marginBottom: '0.6rem' }}>{l}</div>))}
                </div>
              </div>
              <div style={{ ...cardStyle, background: 'rgba(127,29,29,0.05)', borderColor: 'rgba(248,113,113,0.3)' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fca5a5', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⚔️ Conflict Borders</h2>
                <div style={{ maxHeight: '12rem', overflowY: 'auto' }}>
                    {frontiers.map(r => (
                      <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '0.6rem', marginBottom: '0.5rem' }}>
                        <div><div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{r.name}</div><div style={{ fontSize: '0.7rem' }}>{r.owner}</div></div>
                        <span>🎯</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={cardStyle}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fbbf24', borderBottom: '1px solid rgba(217,119,6,0.2)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>🏆 Victory Progress</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[{ label: 'Culture', val: culture, max: 2000, col: '#818cf8' }, { label: 'Prestige', val: prestige, max: 2500, col: '#fbbf24' }].map(r => (
                  <div key={r.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span>{r.label}</span><span>{r.val}/{r.max}</span></div>
                    <div style={{ background: 'rgba(0,0,0,0.5)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ background: r.col, width: `${Math.min(100, (r.val / r.max) * 100)}%`, height: '100%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={cardStyle}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '1.25rem' }}>👑 Rival Mandalas</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {others.map(f => (
                  <div key={f.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{f.name}</span>
                      <span style={{ color: player?.atWar.includes(f.id) ? '#f87171' : '#4ade80' }}>{player?.atWar.includes(f.id) ? '⚔️ WAR' : '🕊️ PEACE'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => { if(confirmingTurn) { nextTurn(); setConfirmingTurn(false); } else { setConfirmingTurn(true); } }}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: confirmingTurn ? '200px' : '70px', height: '70px', borderRadius: '35px', background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#451a03', border: 'none', cursor: 'pointer', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', transition: 'all 0.3s' }}>
          {confirmingTurn ? 'CONFIRM TURN' : '⏳'}
        </button>

        <EventOverlay event={event} player={player} handleEvent={handleEvent} />
        <TurnReport turnSummary={turnSummary} month={month} year={year} setTurnSummary={setTurnSummary} />
        <SuccessionOverlay data={successionData} setSuccessionData={setSuccessionData} />
        
        {perkPrompt && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ ...cardStyle, maxWidth: '40rem', textAlign: 'center', border: '2px solid #fbbf24' }}>
              <h2 style={{ fontSize: '2rem', color: '#fbbf24', marginBottom: '2rem' }}>Enlightened Wisdom</h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1rem' }}>
                {PERKS.filter(p => !player.ruler.perks.includes(p.id)).map(p => (
                  <button key={p.id} onClick={() => { const nextP = { ...player }; nextP.ruler.perks = [...nextP.ruler.perks, p.id]; setPlayer(nextP); setPerkPrompt(false); }}
                    style={{ padding: '1.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #fbbf24', borderRadius: '1rem', color: 'white' }}>
                    <div style={{ fontSize: '2rem' }}>{p.icon}</div>
                    <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showExitConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
            <div style={{ ...cardStyle, maxWidth: '28rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Seal Your Legacy?</h2>
              <button onClick={() => { performSave(); setScreen('menu'); setShowExitConfirm(false); }} style={{ width: '100%', padding: '1rem', background: '#10b981', color: 'white', borderRadius: '0.8rem', marginBottom: '1rem' }}>SAVE & EXIT</button>
              <button onClick={() => setShowExitConfirm(false)} style={{ width: '100%', padding: '1rem', background: 'transparent', color: 'white', border: '1px solid #fff', borderRadius: '0.8rem' }}>CANCEL</button>
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
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '1rem' : '2rem', color: '#fef3c7', textAlign: 'center' }}>
      <div style={{ maxWidth: '42rem', width: '100%' }}>
        <h1 style={{ fontSize: isMobile ? '2.5rem' : '4.5rem', fontWeight: 'bold', fontFamily: 'Georgia,serif', color: '#fbbf24', marginBottom: '0.5rem' }}>Mandala of Kings</h1>
        <p style={{ letterSpacing: '0.3em', color: '#fbbf24', marginBottom: '2rem' }}>भारतवर्ष • BHĀRATAVARṢA</p>
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '2.5rem', borderRadius: '1.5rem', marginBottom: '3rem', border: '1px solid rgba(217,119,6,0.3)' }}>
          <p style={{ lineHeight: '1.8', marginBottom: '2rem' }}>Assume the mantle of a medieval Indian sovereign. Navigate the shifting tides of war, weave intricate diplomatic webs, and foster a cultural renaissance.</p>
          <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.3)', padding: '0.4rem', borderRadius: '1rem', border: '1px solid #fbbf24' }}>
            {[{ id: 'easy', l: 'Bhūpati' }, { id: 'normal', l: 'Rāja' }, { id: 'difficult', l: 'Mahārāja' }].map(d => (
              <button key={d.id} onClick={() => setDifficulty(d.id)} style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', border: 'none', background: difficulty === d.id ? '#fbbf24' : 'transparent', color: difficulty === d.id ? '#451a03' : '#fbbf24', cursor: 'pointer' }}>{d.l}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {localStorage.getItem('mandala_save') && <button onClick={loadSave} style={{ padding: '1rem 2rem', background: '#10b981', color: 'white', borderRadius: '0.8rem' }}>CONTINUE</button>}
          <button onClick={() => startGame()} style={{ padding: '1rem 2rem', background: '#9333ea', color: 'white', borderRadius: '0.8rem' }}>QUICK PLAY</button>
          <button onClick={() => setScreen('selection')} style={{ padding: '1rem 2rem', background: '#fbbf24', color: '#451a03', borderRadius: '0.8rem' }}>FOUND DYNASTY</button>
          <button onClick={() => setScreen('howtoplay')} style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.05)', color: '#fbbf24', border: '1px solid #fbbf24', borderRadius: '0.8rem' }}>HOW TO PLAY</button>
        </div>
      </div>
    </div>
  );
};

const DynastySelection = ({ isMobile, difficulty, setDifficulty, startGame, setScreen }) => {
  const bg = 'radial-gradient(circle at center, #1e1b4b 0%, #0c0a09 100%)';
  return (
    <div style={{ minHeight: '100vh', background: bg, padding: '4rem 2rem', color: '#fef3c7' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '3rem', fontFamily: 'Georgia,serif', color: '#fbbf24', marginBottom: '4rem' }}>Select Your Sacred Lineage</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div onClick={() => setScreen('custom_setup')} style={{ background: 'rgba(251,191,36,0.05)', border: '2px dashed #fbbf24', borderRadius: '1.25rem', padding: '2rem', cursor: 'pointer', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>✍️</div><h3>Forge Custom Lineage</h3>
          </div>
          {DYNASTY_NAMES.map((name, idx) => (
            <div key={name} onClick={() => startGame(idx)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #fbbf2422', borderRadius: '1.25rem', padding: '2rem', cursor: 'pointer' }}>
              <h3 style={{ fontSize: '1.75rem', color: '#fbbf24', fontFamily: 'Georgia,serif' }}>{name}</h3>
              <p style={{ color: 'rgba(254,243,199,0.7)' }}>{DYNASTY_DATA[name].male?.slice(0, 2).join(', ') || 'Royal rulers'}...</p>
            </div>
          ))}
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
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at center, #4c1d95 0%, #0c0a09 100%)', padding: '2rem 1rem', color: '#fef3c7' }}>
      <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#fbbf24', marginBottom: '2rem' }}>Forge Your Sacred Lineage</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: '1rem' }}>
            <label>DYNASTY NAME</label>
            <input value={cName} onChange={e => setCName(e.target.value)} style={{ width: '100%', background: '#000', color: '#fff', border: '1px solid #fbbf24', padding: '0.8rem', borderRadius: '0.5rem' }} />
            <label>RULER NAME</label>
            <input value={cRuler} onChange={e => setCRuler(e.target.value)} style={{ width: '100%', background: '#000', color: '#fff', border: '1px solid #fbbf24', padding: '0.8rem', borderRadius: '0.5rem' }} />
          </div>
          <button onClick={() => startGame(-1, { name: cName, rulerName: cRuler, varna: cVarna, capitalId: cCapital })} style={{ padding: '1.5rem', background: '#fbbf24', color: '#000', fontWeight: 'bold', borderRadius: '1rem' }}>BEGIN REIGN</button>
        </div>
      </div>
    </div>
  );
};

const HowToPlay = ({ isMobile, setScreen }) => (
  <div style={{ minHeight: '100vh', background: '#1e1b4b', padding: '4rem 2rem', color: '#fef3c7' }}>
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', textAlign: 'center', color: '#fbbf24' }}>Arthashastra</h1>
      <p style={{ lineHeight: '1.8', marginTop: '2rem' }}>Lead your dynasty to supremacy before the year 1000 CE. Balance Gold, Food, and Manpower to expand your Mandala.</p>
      <button onClick={() => setScreen('menu')} style={{ width: '100%', padding: '1.5rem', background: '#fbbf24', color: '#000', fontWeight: 'bold', marginTop: '3rem' }}>RETURN TO COURT</button>
    </div>
  </div>
);

const GameOver = ({ screen, player, culture, prestige, year, victoryType, isMobile, calcLegacy, setScreen }) => {
  const score = calcLegacy(player, culture, prestige, year - 600);
  return (
    <div style={{ minHeight: '100vh', background: '#1e1b4b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', color: '#fbbf24' }}>{screen === 'victory' ? 'Victory!' : 'End of Reign'}</h1>
        <div style={{ fontSize: '5rem', fontWeight: 'bold', color: '#fff', margin: '2rem 0' }}>{score.toLocaleString()}</div>
        <button onClick={() => setScreen('menu')} style={{ padding: '1.5rem 3rem', background: '#fbbf24', fontWeight: 'bold', borderRadius: '1rem' }}>NEW REIGN</button>
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

  const performSave = () => { if (player) { localStorage.setItem('mandala_save', JSON.stringify({ month, year, factions, player, culture, prestige, log, difficulty })); } };
  useEffect(() => { if (screen === 'playing') performSave(); }, [month, year, factions, player, culture, prestige, screen, difficulty, log]);

  const loadSave = () => {
    const saved = localStorage.getItem('mandala_save');
    if (saved) {
      const s = JSON.parse(saved);
      setMonth(s.month); setYear(s.year); setFactions(s.factions); setPlayer(s.player); setCulture(s.culture); setPrestige(s.prestige); setLog(s.log); setScreen('playing'); setDifficulty(s.difficulty || 'normal');
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
  
  const [event, setEvent] = useState(null);
  const [log, setLog] = useState([]);
  const [action, setAction] = useState(null);
  const [targetId, setTargetId] = useState(null);
  const [activeHelp, setActiveHelp] = useState(null);
  const [victoryType, setVictoryType] = useState(null);
  const [turnSummary, setTurnSummary] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [confirmingTurn, setConfirmingTurn] = useState(false);

  const notify = (msg, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const addLog = (msg) => setLog(p => [msg, ...p].slice(0, 10));

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
    REGIONS.forEach(reg => { if (!newFactions.some(f => f.regionIds.includes(reg.id))) { const neighbors = newFactions.filter(f => f.regionIds.some(rid => REGIONS.find(r => r.id === rid)?.neighbors.includes(reg.id))); pick(neighbors.length ? neighbors : newFactions).regionIds.push(reg.id); } });
    newFactions.forEach(f => { const c = f.regionIds.length; f.gold = c * 25; f.food = c * 30; f.manpower = c * 500; f.militaryStrength = c * 1000; });
    setFactions(newFactions); setPlayer(playerFaction); setScreen('playing'); setMonth(1); setYear(600); setCulture(10); setPrestige(20); setLog([`The chronicles of ${playerFaction.name} begin.`]); clearSave();
  };

  const handleEvent = (choice) => {
    const { player: updatedPlayer, prestige: prestigeAdd, culture: cultureAdd, notifications: resNotifs } = applyChoiceEffect(choice, player);
    if (prestigeAdd) setPrestige(v => v + prestigeAdd);
    if (cultureAdd) setCulture(v => v + cultureAdd);
    resNotifs.forEach(n => notify(n.msg, n.type));
    setPlayer(updatedPlayer); setEvent(null); addLog(`📜 ${choice.text}`);
  };

  const executeAction = () => {
    const p = { ...player };
    const cost = calculateActionCost(action, p, { traits: p.ruler.traits.map(t => t.id), perks: p.ruler.perks });
    if (p.gold < cost) return notify('💰 Treasury empty!', 'error');
    if (action === 'recruit' && p.manpower < 250) return notify('👥 Not enough manpower!', 'error');
    let msg = ''; p.gold -= cost;
    if (action === 'develop') { p.food += 100; p.manpower += 200; setCulture(v => v + 5); msg = `🛠️ Infrastructure investment.`; }
    else if (action === 'recruit') { p.manpower -= 250; p.militaryStrength += 600; msg = `⚔️ Levies raised.`; }
    else if (targetId) {
      if (action === 'diplomacy') { p.relations[targetId] = Math.min(100, (p.relations[targetId] || 0) + 20); msg = `🤝 Diplomacy with ${factions.find(f => f.id === targetId).name}.`; }
      else if (action === 'war') { if (p.atWar.includes(targetId)) return notify('⚔️ Already at war!', 'warning'); p.atWar.push(targetId); p.relations[targetId] = -100; msg = `⚔️ War on ${factions.find(f => f.id === targetId).name}!`; }
      else if (action === 'peace') { p.atWar = p.atWar.filter(id => id !== targetId); msg = `🕊️ Peace with ${factions.find(f => f.id === targetId).name}.`; }
    }
    p.ruler.xp += 40; setPlayer(p); setAction(null); setTargetId(null); notify(msg, 'success');
  };

  const nextTurn = () => {
    const nm = month === 12 ? 1 : month + 1; const ny = month === 12 ? year + 1 : year; setMonth(nm); setYear(ny);
    const p = { ...player };
    if (nm === 1) { p.ruler.tenure += 1; p.ruler.xp += 50; }
    if (p.ruler.xp >= p.ruler.level * 200) { p.ruler.xp -= p.ruler.level * 200; p.ruler.level += 1; setPerkPrompt(true); }
    if (p.ruler.tenure >= p.ruler.maxTenure) {
      const old = { ...p.ruler }; const newR = makeChar(p.name, true, (p.rulerIndex || 0) + 1);
      p.ruler = newR; p.rulerIndex = (p.rulerIndex || 0) + 1; p.stability = Math.max(20, p.stability - 25);
      setSuccessionData({ old, new: newR, score: calcLegacy(p, culture, prestige, old.tenure) });
    }
    const { goldIncome, foodIncome } = calculateIncome(p, REGIONS, difficulty);
    p.gold += goldIncome; p.food += foodIncome; p.manpower += calculateGrowth(p);
    
    let updatedFactions = factions.map(f => {
      if (f.id === p.id) return p;
      if (!p.atWar.includes(f.id)) return f;
      const { attackerWon, defenderWon } = calculateBattle(p, f, { varna: p.varna, traits: p.ruler.traits.map(t => t.id), perks: p.ruler.perks });
      const enemy = { ...f };
      if (attackerWon) { const { success, regionId } = resolveConquest(p, enemy, REGIONS); if (success) { p.regionIds.push(regionId); enemy.regionIds = enemy.regionIds.filter(id => id !== regionId); } }
      else if (defenderWon) { p.stability = Math.max(0, p.stability - 10); p.militaryStrength = Math.max(0, p.militaryStrength - 200); }
      return enemy;
    });
    setFactions(updatedFactions); setPlayer(p); setTurnSummary([`💰 Income: +${goldIncome}G`, `👥 Growth: +${calculateGrowth(p)}M`]);
    if (updatedFactions.filter(f => !f.isPlayer && f.regionIds.length > 0).length === 0) { setScreen('victory'); return; }
    if (p.regionIds.length <= 0) { setScreen('ended'); return; }
    if (Math.random() < 0.3) setEvent(pick(EVENTS));
  };

  const commonProps = { isMobile, isTablet, setScreen, player, factions, month, year, culture, prestige, score: calcLegacy(player, culture, prestige, year - 600), log, action, setAction, targetId, setTargetId, executeAction, nextTurn, confirmingTurn, setConfirmingTurn, event, handleEvent, turnSummary, setTurnSummary, perkPrompt, setPlayer, setPerkPrompt, successionData, setSuccessionData, setShowExitConfirm, showExitConfirm, performSave, clearSave, setActiveHelp, activeHelp, notifications, difficulty, setDifficulty, startGame, calcLegacy };

  if (screen === 'menu') return <MainMenu {...commonProps} />;
  if (screen === 'selection') return <DynastySelection {...commonProps} />;
  if (screen === 'custom_setup') return <CustomSetup {...commonProps} />;
  if (screen === 'howtoplay') return <HowToPlay {...commonProps} />;
  if (screen === 'victory' || screen === 'ended') return <GameOver {...commonProps} victoryType={victoryType} />;
  if (screen === 'playing') return <GameDashboard {...commonProps} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(MandalaOfKings));
