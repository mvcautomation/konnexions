// Shared types for client and server

export type GameMode = 'coop' | 'competitive';
export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

export interface Player {
  id: string;
  username: string;
  color: string;
  connectionStatus: ConnectionStatus;
  selectedWords: string[];
  teamId?: string;
  lastSeen: number;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  playerIds: string[];
  solvedCategories: string[]; // category themes
  strikes: number;
  puzzleId: string;
  finishedAt?: number;
}

export interface RoomState {
  roomId: string;
  mode: GameMode;
  hostId: string;
  players: Record<string, Player>;
  teams: Record<string, Team>;
  puzzleId: string;
  gameStarted: boolean;
  solvedCategories: string[]; // for coop mode
  strikes: number; // for coop mode
  winnerId?: string; // team id or 'coop' for coop mode
}

// WebSocket message types
export type ClientMessage =
  | { type: 'join'; playerId: string; username: string }
  | { type: 'select'; words: string[] }
  | { type: 'submit' }
  | { type: 'startGame'; mode: GameMode; teamCount?: number }
  | { type: 'newGame' }
  | { type: 'ping' };

export type ServerMessage =
  | { type: 'roomState'; state: RoomState; puzzle: { id: string; words: string[] } }
  | { type: 'playerJoined'; player: Player }
  | { type: 'playerLeft'; playerId: string }
  | { type: 'playerReconnecting'; playerId: string }
  | { type: 'playerReconnected'; player: Player }
  | { type: 'playerSelected'; playerId: string; words: string[] }
  | { type: 'guessResult'; correct: boolean; category?: { theme: string; words: string[]; difficulty: string }; isOneAway?: boolean; strikes: number }
  | { type: 'gameOver'; won: boolean; categories: { theme: string; words: string[]; difficulty: string }[] }
  | { type: 'error'; message: string }
  | { type: 'pong' };

// Player colors (assigned in order of joining)
export const PLAYER_COLORS = [
  '#ff6b6b', // coral red
  '#4ecdc4', // teal
  '#ffe66d', // yellow
  '#a8e6cf', // mint
  '#dda0dd', // plum
  '#98d8c8', // seafoam
  '#f7dc6f', // gold
  '#bb8fce', // lavender
];

export const TEAM_COLORS = [
  { name: 'Red', color: '#ff6b6b' },
  { name: 'Blue', color: '#4ecdc4' },
  { name: 'Yellow', color: '#ffe66d' },
  { name: 'Purple', color: '#bb8fce' },
];
