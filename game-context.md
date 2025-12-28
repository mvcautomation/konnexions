# Konnexions - Game Context

A multiplayer word puzzle game inspired by NYT Connections, built for couch co-op play.

## Overview

Players work together (or compete) to find 4 groups of 4 words that share a hidden connection. Each puzzle has 4 categories of increasing difficulty: yellow (easiest), green, blue, and purple (hardest).

## Tech Stack

- **Frontend**: Next.js 16 (App Router) with Tailwind CSS 4
- **Real-time**: PartyKit (WebSocket server on Cloudflare edge)
- **State Management**: Zustand with localStorage persistence
- **Logging**: pino

## Project Structure

```
konnexions/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home - create/join room
│   │   ├── game/[roomId]/page.tsx # Game room
│   │   ├── globals.css           # Tailwind + custom CSS variables
│   │   ├── layout.tsx            # Root layout
│   │   └── icon.svg              # Favicon (4-color grid)
│   ├── components/
│   │   ├── Grid.tsx              # 4x4 word grid
│   │   ├── WordCard.tsx          # Individual word tile
│   │   ├── PlayerList.tsx        # Player presence sidebar
│   │   ├── GameControls.tsx      # Submit/shuffle/deselect buttons
│   │   ├── ModeSelector.tsx      # Co-op vs competitive mode picker
│   │   ├── UsernameModal.tsx     # Username entry modal
│   │   ├── SolvedCategory.tsx    # Solved category banner
│   │   ├── StrikeCounter.tsx     # Wrong guess counter
│   │   └── GameOver.tsx          # Win/lose modal
│   ├── lib/
│   │   ├── puzzleGenerator.ts    # Generates puzzles from curated categories
│   │   ├── puzzles.ts            # Legacy static puzzles (unused)
│   │   ├── types.ts              # TypeScript types
│   │   ├── gameLogic.ts          # Game validation logic
│   │   ├── usePartySocket.ts     # WebSocket hook for PartyKit
│   │   └── logger.ts             # pino logger setup
│   ├── party/
│   │   └── index.ts              # PartyKit server (room state, game logic)
│   └── stores/
│       └── gameStore.ts          # Zustand store (player identity, UI state)
├── partykit.json                 # PartyKit configuration
├── .env.production               # Production PartyKit host
└── package.json
```

## Game Modes

### Co-op Mode
- All players see the same puzzle
- **Consensus required**: All players must select the same 4 words before anyone can submit
- Player selections are shown as colored highlights on word cards
- Shared strikes (4 max)

### Competitive Mode
- Teams race against each other
- Each team gets a different puzzle
- First team to solve all 4 categories wins

## Puzzle Generation

Puzzles are generated from curated category pools in `puzzleGenerator.ts`:

- **HARD_CATEGORIES** (purple): Wordplay, puns, obscure connections
- **TRICKY_CATEGORIES** (blue): Requires specific knowledge
- **MEDIUM_CATEGORIES** (green): Non-obvious but gettable
- **EASY_CATEGORIES** (yellow): Lateral thinking required

Each puzzle randomly selects one category from each difficulty tier.

## Deployment

### Frontend (Next.js)
- **Host**: PM2 on local machine
- **URL**: https://konnexions.beyondthecourse.app
- **Port**: 3003
- **Process name**: `konnexions`

To deploy changes:
```bash
cd /Users/bill/Documents/GitHub/konnexions
npm run build
pm2 restart konnexions
```

### WebSocket Server (PartyKit)
- **Host**: Cloudflare edge via PartyKit
- **URL**: https://konnexions.mvcautomation.partykit.dev

To deploy PartyKit changes:
```bash
npm run deploy:party
```

### Environment Variables

| Variable | Value | Location |
|----------|-------|----------|
| `NEXT_PUBLIC_PARTYKIT_HOST` | `konnexions.mvcautomation.partykit.dev` | `.env.production` |

## Key Design Decisions

1. **Username-only auth**: No passwords. Player identity stored in localStorage with UUID.

2. **15-second grace period**: If a player disconnects, they have 15 seconds to reconnect before being removed from the game.

3. **Room codes**: 8-character uppercase alphanumeric (e.g., `ABC12345`). Host shares code with other players.

4. **No outlines**: Modern flat UI design. Selected words show a glow/ring effect instead of borders.

5. **Player colors**: Each player gets a unique color for their selection highlights.

## Color Palette

```css
--background: #1a1a2e
--background-card: #16213e
--foreground: #edf2f4
--color-yellow: #f4d35e   /* Easy category */
--color-green: #95d5b2    /* Medium category */
--color-blue: #8ecae6     /* Tricky category */
--color-purple: #c77dff   /* Hard category */
```

## Common Tasks

### Add new puzzle categories
Edit `src/lib/puzzleGenerator.ts` and add to the appropriate difficulty array.

### Change game rules
Edit `src/party/index.ts` for server-side logic, `src/lib/gameLogic.ts` for validation.

### Modify UI
Components are in `src/components/`. Styles use Tailwind classes + CSS variables from `globals.css`.

### Debug WebSocket issues
Check PartyKit logs: `npx partykit dev` for local, or Cloudflare dashboard for production.

## GitHub Repository

https://github.com/mvcautomation/konnexions
