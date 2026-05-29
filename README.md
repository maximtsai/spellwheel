# SpellWheel

[![Play on Steam](https://img.shields.io/badge/Play%20on-Steam-171a21?logo=steam)](https://store.steampowered.com/app/3170660/SpellWheel/)
[![Play on itch.io](https://img.shields.io/badge/Play%20on-itch.io-fa5c5c?logo=itch.io)](https://adayofjoy.itch.io/spellwheel)

**SpellWheel** is a real-time spellcasting strategy puzzle game built with **Phaser 3**. Instead of selecting spells from a menu, you physically align two concentric rotating wheels — pairing **Element Runes** with **Embodiment Runes** — to build and cast spells on the fly.

---

## The Core Mechanic

The game board is a **dual-ring wheel**:

- **Inner Ring** — Element Runes: `MATTER`, `MIND`, `TIME`, `VOID`
- **Outer Ring** — Embodiment Runes: `STRIKE`, `ENHANCE`, `PROTECT`, `REINFORCE`, `UNLOAD`

| | Strike | Enhance | Protect | Reinforce | Unload |
|---|---|---|---|---|---|
| **Matter** | Physical attack | +DMG buff | Stone shield | Thorns armor | Stalagmite ultimate |
| **Mind** | DMG + defense break | Free next cast | Retaliatory shield | True damage bonus | Spell multiplier (x3) |
| **Time** | DMG + slow | Extra attacks | Damage delay pool | Speed boost | Time freeze |
| **Void** | %HP true damage | Void damage adder | Attack negation | Damage immunity | Self + enemy %HP |

Players drag or keyboard-spin each ring to align a pair, then press **CAST**. Each rune burns out after use and recharges via a full wheel spin — forcing you to adapt your strategy on the fly as your available spell list shrinks and refills.

---

## Key Features

- **20 unique spells** from 4 elements × 5 embodiment combinations
- **Physics-driven wheel** with torque, friction, magnetic snap-to alignment, and spin momentum
- **28 enemy types** with distinct attack patterns and animations
- **16+ levels** with progressive rune unlocks, boss fights, and narrative
- **Full localization** in 10+ languages including English, French, Chinese, Russian, Spanish, and Japanese
- **Status effects system** with timed buffs, debuffs, shields, and damage-over-time
- **Mobile support** with touch input, responsive scaling, and orientation lock

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Engine** | Phaser 3 (Canvas/WebGL) |
| **Language** | Vanilla JavaScript (ES6) |
| **Rendering** | Multi-atlas sprite sheets, bitmap fonts, particle effects |
| **Audio** | Web Audio API with dynamic pitch shifting |
| **Architecture** | Custom pub/sub event bus, object pooling, centralized update loop |
| **Persistence** | Local Storage (save progress, settings, language) |
| **Distribution** | Web (itch.io, CrazyGames), Steam |

---

## Architecture Highlights

- **Decoupled event-driven architecture** — Systems communicate via a custom `MessageBus` rather than direct references, making the codebase modular and testable
- **Custom 2D physics** — The wheel uses a purpose-built torque simulation with decay, static friction, and a quartic falloff magnetic snap system — no third-party physics engine
- **Object pooling** — Reusable game objects (combat text, status icons, projectiles) minimize garbage collection pauses
- **Centralized update manager** — A single `requestAnimationFrame` loop drives all per-frame systems, keeping performance predictable
- **Multi-language without a framework** — Text is stored as JSON key-value pairs with runtime lookup and fallback, supporting 10+ languages with zero dependencies

---

## Project Structure

```
spellwheel/
├── main.js                 # Phaser config & game lifecycle
├── index.html              # Entry point
│
├── scripts/
│   ├── magicCircle.js      # Core wheel UI, physics, casting logic
│   ├── spellManager.js     # Spell effect execution & VFX
│   ├── player.js           # Player health, statuses, damage pipeline
│   ├── levelHandler.js     # Level setup, dialogs, rune progression
│   ├── enemyhandler.js     # Enemy factory (maps levels → enemy classes)
│   ├── deathHandler.js     # Victory/defeat screens & transitions
│   ├── tutorialHandler.js  # Interactive tutorials
│   ├── gameConsts.js       # Rune definitions & level progression data
│   ├── cutsceneManager.js  # Narrative cutscenes
│   ├── encyclopedia.js     # In-game spell reference
│   ├── bannerTextManager.js# Narrative banners
│   ├── combatTextManager.js# Floating damage numbers
│   ├── options.js          # Settings/options screen
│   ├── unlocks.js          # Achievement system
│   └── enemies/            # 28 enemy behavior classes
│
├── util/
│   ├── util.js             # Core utilities (text, audio, input helpers)
│   ├── messageBus.js       # Pub/sub event system
│   ├── updateManager.js    # Centralized per-frame update loop
│   ├── poolManager.js      # Object pooling
│   ├── audioManager.js     # Web Audio API sound engine
│   ├── mouseManager.js     # Mouse/touch input abstraction
│   └── buttonManager.js    # Reusable button system
│
├── sprites/                # Sprite atlases (JSON + PNG/WebP)
├── audio/                  # Sound effects
├── fonts/                  # Bitmap fonts
└── raw_assets/             # Source artwork
```

---

## Development

```bash
# Serve locally (works on any static file server)
python -m http.server 8080
# or use the included pythonRunServer.bat
```

No build step required — the game runs directly in the browser from source.

---

## Links

- [Steam Page](https://store.steampowered.com/app/3170660/SpellWheel/)
- [itch.io Page](https://adayofjoy.itch.io/spellwheel)
