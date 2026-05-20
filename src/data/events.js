export const EVENTS = [
  {
    title: 'Trade Caravan Arrival',
    desc: 'A massive trade caravan from the Silk Road has arrived at your capital. They offer rare spices and silk in exchange for royal protection.',
    choices: [
      { text: 'Grant Protection (50G, +10 Stability)', effect: { gold: -50, stability: 10 } },
      { text: 'Tax the Caravan (+100G, -5 Stability)', effect: { gold: 100, stability: -5 } }
    ]
  },
  {
    title: 'Monastery Patronage',
    desc: 'A prominent Nalanda scholar requests funds to transcribe ancient manuscripts.',
    choices: [
      { text: 'Fund the Scholars (40G, +20 Culture)', effect: { gold: -40, culture: 20 } },
      { text: 'Decline Politely', effect: {} }
    ]
  },
  {
    title: 'Border Skirmish',
    desc: 'Local tribal leaders are raiding border villages. How will you respond?',
    choices: [
      { text: 'Send the Varman Guard (-300 Manpower, +5 Stability)', effect: { manpower: -300, stability: 5 } },
      { text: 'Negotiate Peace (-20G, -5 Prestige)', effect: { gold: -20, prestige: -5 } }
    ]
  },
  {
    title: 'Temple Consecration',
    desc: 'A grand temple is being completed. The priests ask for a royal sacrifice.',
    choices: [
      { text: 'Perform the Ritual (60G, +15 Stability, +10 Culture)', effect: { gold: -60, stability: 15, culture: 10 } },
      { text: 'Divert Funds to Army (60G, +500 Military Strength)', effect: { gold: -60, militaryStrength: 500 } }
    ]
  },
  {
    title: 'Succession Dispute',
    desc: 'A minor cousin claims right to a frontier governorship.',
    choices: [
      { text: 'Grant the Title (-10 Stability, +5 Prestige)', effect: { stability: -10, prestige: 5 } },
      { text: 'Exile the Pretender (+5 Stability, -5 Prestige)', effect: { stability: 5, prestige: -5 } }
    ]
  },
  {
    title: 'Drought in the Doab',
    desc: 'The monsoon has failed this year. Famine looms over the heartland.',
    choices: [
      { text: 'Open Royal Granaries (-100 Food, +15 Stability)', effect: { food: -100, stability: 15 } },
      { text: 'Let Fate Decide (-10 Stability, +50G)', effect: { stability: -10, gold: 50 } }
    ]
  },
  {
      title: "The Ashvamedha Challenge",
      desc: "A rival dynasty's horse has entered your territory, challenging your sovereignty. A duel is demanded.",
      choices: [
        { text: "Accept the Challenge (Duel, 40% Win)", effect: { duel: true } },
        { text: "Pay Tribute (80G, -10 Prestige)", effect: { gold: -80, prestige: -10 } }
      ]
  },
  {
      title: "Foreign Philosophers",
      desc: "Scholars from the West have arrived, debating the nature of the zero. Your court is intrigued.",
      choices: [
        { text: "Host a Debate (30G, +25 Culture)", effect: { gold: -30, culture: 25 } },
        { text: "Ignore Them", effect: {} }
      ]
  },
  {
      title: "Vassal Rebellion",
      desc: "A disgruntled vassal is plotting with your enemies. You must act.",
      choices: [
        { text: "Seize their Lands (+100G, +300 Manpower, +10 War Chance)", effect: { gold: 100, manpower: 300, war_chance: 0.15 } },
        { text: "Pardon them (+10 Stability, +5 Relations)", effect: { stability: 10, relations_bonus: 5 } }
      ]
  }
];
