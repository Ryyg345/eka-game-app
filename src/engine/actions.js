export const calculateActionCost = (action, faction, modifiers = {}) => {
  const varna = faction.varna;
  const perks = modifiers.perks || [];
  const traits = modifiers.traits || [];

  let costMult = varna === 'vaishya' ? 0.6 : (perks.includes('statecraft') ? 0.75 : 1);
  
  if (action === 'develop') return Math.floor(50 * costMult);
  if (action === 'recruit') return perks.includes('warfare') ? 60 : 80;
  if (action === 'diplomacy') return traits.includes('diplomat') ? 25 : 40;
  if (action === 'peace') return 150;
  
  return 0;
};

export const applyChoiceEffect = (choice, player) => {
  const e = choice.effect;
  let p = { ...player };
  
  let prestigeChange = e.prestige || 0;
  let cultureChange = e.culture || 0;
  let notifications = [];

  if (e.gold) p.gold += e.gold;
  if (e.food) p.food += e.food;
  if (e.manpower) p.manpower = Math.max(0, p.manpower + (e.manpower || 0));
  if (e.stability) p.stability = Math.max(0, Math.min(100, p.stability + (e.stability || 0)));
  if (e.militaryStrength) p.militaryStrength += (e.militaryStrength || 0);

  if (e.war_chance && Math.random() < e.war_chance) {
    p.stability = Math.max(0, p.stability - 10);
    notifications.push({ msg: '⚔️ Unrest erupts on the frontier!', type: 'warning' });
  }
  if (e.relations_bonus) {
    Object.keys(p.relations).forEach(id => { p.relations[id] = Math.min(100, (p.relations[id] || 0) + e.relations_bonus); });
    notifications.push({ msg: '🤝 Relations improved with all dynasties.', type: 'success' });
  }

  if (e.duel) {
    if (Math.random() > 0.45) { 
      prestigeChange += 50; 
      notifications.push({ msg: '🏆 Duel Victory!', type: 'success' });
    } else { 
      p.stability = Math.max(0, p.stability - 15); 
      notifications.push({ msg: '💔 Duel Defeat', type: 'error' });
    }
  }

  return { player: p, prestige: prestigeChange, culture: cultureChange, notifications };
};
