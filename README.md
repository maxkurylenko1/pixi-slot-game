# PixiJS 5x3 Slot Machine

A 5x3 slot machine demo built with PixiJS v8, TypeScript, and Vite.
Shows how to structure a small game-oriented frontend: reel engine with spin/stop flow, scene management, typed event bus, responsive scaling, and debug HUD (FPS, window/game sizes). Designed as an MVP to demonstrate skills for multiplayer / casino / realtime roles.

## Features

- 5x3 reels with fruit symbols
- Spin → timed stop flow (each reel stops sequentially)
- 60 FPS rendering (PixiJS ticker)
- Separated game logic & rendering
- Modular architecture: core/, scenes/, ui/
- Typed event system for UI ↔ game core
- Responsive layout – slot centered, window and “game area” sizes shown
- Debug HUD: FPS + window/game sizes
- SPIN button with SPINNING... state

## Stack

- PixiJS v8
- TypeScript
- Vite

## Suggested Project Structure

src/
core/
Application.ts # init Pixi, canvas, resize
EventBus.ts # typed events
assets.ts # assets list (symbols, bg)
game/
SlotMachine.ts # main slot controller
Reel.ts # single reel: spin, stop, speed
symbols.ts # symbols config
SlotState.ts # idle, spinning, stopping, finished
scenes/
GameScene.ts # background, slot, ui
ui/
SpinButton.ts # SPIN / SPINNING
DebugOverlay.ts # FPS, sizes
main.ts # entrypoint

## How It Works

1. App initializes Pixi Application and resize listener.
2. GameScene is created and contains the slot and UI.
3. SlotMachine:
   - accepts config (reels, speed, stop delay)
   - on spin() starts all reels
   - on timer/tick tells each reel to stop
   - emits events: slot:spinning, slot:stopped, slot:finished
4. UI listens to events and toggles the button state.
5. Debug overlay updates every frame with FPS and sizes.

## Getting Started

npm install
npm run dev

# http://localhost:5173

npm run build
npm run preview

## Gameplay Flow

1. User clicks SPIN
2. UI fires slot:spin
3. All reels go to spinning state
4. Reels stop one by one (timed)
5. On last reel – slot:finished
6. UI returns SPIN button

## Why This Project

- Demonstrates PixiJS v8 experience
- Shows game architecture, not only rendering
- Clear separation of core / game / UI
- Can be extended to server-authoritative RNG
- Easy to evolve into Coinflip / Dice / Jackpot demos

## Next Steps (Todo)

- Add server RNG / fairness verification
- Add win-lines and payout calculation
- Asset loading via Pixi Assets
- Win animations (blink / scale / overlay)
- Balance & bet panel

## Links

PixiJS: https://pixijs.com/
TypeScript: https://www.typescriptlang.org/
