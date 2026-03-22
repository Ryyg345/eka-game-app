# Mandala of Kings: Modularization & Scalability Plan

This document outlines a structural refactor for the **Mandala of Kings** project. Transitioning from a monolithic `app.jsx` to a modular architecture will improve performance, reduce bugs, and simplify the addition of complex new features like sophisticated AI or multiplayer support.

---

## 📂 Proposed Directory Structure

```bash
src/
├── components/          # React UI Components
│   ├── Common/          # Shared elements (InfoIcon, Tooltips, Notifications)
│   ├── Dashboard/       # Main gameplay HUD and resource bars
│   ├── Map/             # SVG Region Map and interaction logic
│   ├── Overlays/        # Event, Succession, and Perk selection screens
│   └── Screens/         # Main Menu, Dynasty selection, and Victory screens
├── data/                # Static Game Data (JSON/Constants)
│   ├── constants.js     # Varnas, Perks, and Difficulty levels
│   ├── dynasties.js     # Historical naming and Varna associations
│   ├── events.js        # Event tree and outcome definitions
│   └── regions.js       # Geographic map data and neighbor lists
├── engine/              # Pure JavaScript Game Logic (No React)
│   ├── combat.js        # Battle math, modifiers, and military attrition
│   ├── economy.js       # Income, statecraft bonuses, and development costs
│   ├── succession.js    # XP gain, legacy scoring, and ruler generation
│   └── turnManager.js   # Orchestrator for the `nextTurn` logic loop
├── hooks/               # Custom React Hooks
│   ├── useGameState.js  # Core state for factions, turn, and resources
│   ├── usePersistence.js# Auto-save and localStorage synchronization
│   └── useUIFeedback.js # Centralized notification and sound triggers
└── styles/              # Global Design System
    ├── theme.css        # Palace-inspired color tokens and typography
    └── components/      # Component-specific CSS modules
```

---

## 🚀 Architectural Advantages

### 1. Data-Logic Decoupling
By moving `DYNASTY_DATA`, `REGIONS`, and `EVENTS` into separate files, we remove over 600 lines from the main UI component. This makes the data easier to audit for historical accuracy and simpler to expand with new "Modding" content without touching the code.

### 2. The "Pure" Engine Strategy
Move game calculations (Combat, Economy, Succession) into `src/engine`. These are pure functions that don't depend on React's state directly, which:
*   Allows for **unit testing** of battle math.
*   Simplifies debugging—if combat is broken, the bug is in `combat.js`.
*   Prevents React re-render loops caused by complex nested calculations.

### 3. Atomic UI Components
Breaking `app.jsx` into smaller pieces allows for **React Optimization**:
*   **Memoization**: The high-detail SVG map only re-renders when a territory changes owner, not when the Gold counter updates.
*   **Reusability**: Shared elements like the parchment-style background or the `InfoIcon` can be used across multiple screens with a single source of truth for design.

### 4. Custom Hooks for "Global" State
Instead of 40+ `useState` calls in a single component, custom hooks (`useGameState.js`) provide a clean API for components to "ask" for data or "trigger" actions. This reduces "prop drilling" and keeps the component code purely focused on the visual interface.

---

## 🛠️ Implementation Roadmap (Suggested)

1.  **Phase 1: Data Migration**: Safely extract all constants (`REGIONS`, `DYNASTY_DATA`, `EVENTS`) into `/src/data`.
2.  **Phase 2: Common Components**: Extract the `InfoIcon`, `TooltipOverlay`, and `NotificationSystem` into `/src/components/Common`.
3.  **Phase 3: Logic Federated**: Move `nextTurn`, `executeAction`, and `handleEvent` logic into `/src/engine`.
4.  **Phase 4: Component Decomposition**: Gradually break the large `MandalaOfKings` return block into individual screen and HUD components.

---

> [!TIP]
> **Refactoring approach:** Start by creating the `src/data` folder first. This is high-impact with near-zero risk of breaking the game logic, and it immediately cleans up half of the current `app.jsx`.
