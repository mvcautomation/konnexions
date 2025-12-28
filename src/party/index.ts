import type * as Party from 'partykit/server';
import {
  Player,
  RoomState,
  ClientMessage,
  ServerMessage,
  GameMode,
  PLAYER_COLORS,
  TEAM_COLORS,
  Team,
} from '@/lib/types';
import { Puzzle, Category, shuffle } from '@/lib/puzzles';
import { generatePuzzle } from '@/lib/puzzleGenerator';

const RECONNECT_GRACE_PERIOD = 15000; // 15 seconds

interface ConnectionMeta {
  playerId: string;
  disconnectTimer?: ReturnType<typeof setTimeout>;
}

export default class KonnexionsServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  // Room state
  private state: RoomState = {
    roomId: '',
    mode: 'coop',
    hostId: '',
    players: {},
    teams: {},
    puzzleId: '',
    gameStarted: false,
    solvedCategories: [],
    strikes: 0,
  };

  private puzzle: Puzzle | null = null;
  private shuffledWords: string[] = [];
  private connectionMeta: Map<string, ConnectionMeta> = new Map();

  // Logging helper
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: object) {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] [${this.room.id}] ${message}`, data ? JSON.stringify(data) : '');
  }

  async onStart() {
    this.state.roomId = this.room.id;
    this.log('info', 'Room created');
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    this.log('info', 'Connection opened', { connectionId: conn.id });

    // Send current state to new connection (they'll send join message with their player info)
    // For now, just acknowledge the connection
  }

  async onClose(conn: Party.Connection) {
    const meta = this.connectionMeta.get(conn.id);
    if (!meta) {
      this.log('warn', 'Connection closed but no meta found', { connectionId: conn.id });
      return;
    }

    const player = this.state.players[meta.playerId];
    if (!player) {
      this.log('warn', 'Connection closed but no player found', { playerId: meta.playerId });
      return;
    }

    this.log('info', 'Player disconnecting, starting grace period', {
      playerId: meta.playerId,
      username: player.username,
    });

    // Mark as reconnecting
    player.connectionStatus = 'reconnecting';
    this.broadcast({ type: 'playerReconnecting', playerId: meta.playerId });

    // Start grace period timer
    meta.disconnectTimer = setTimeout(() => {
      this.handleDisconnectTimeout(meta.playerId);
    }, RECONNECT_GRACE_PERIOD);
  }

  private handleDisconnectTimeout(playerId: string) {
    const player = this.state.players[playerId];
    if (!player) return;

    if (player.connectionStatus === 'reconnecting') {
      this.log('info', 'Grace period expired, removing player', {
        playerId,
        username: player.username,
      });

      player.connectionStatus = 'disconnected';
      this.broadcast({ type: 'playerLeft', playerId });

      // Remove from active players count but keep in state for reference
      // This allows late reconnection
    }
  }

  async onMessage(message: string, sender: Party.Connection) {
    let parsed: ClientMessage;
    try {
      parsed = JSON.parse(message);
    } catch {
      this.log('error', 'Failed to parse message', { message });
      return;
    }

    this.log('debug', 'Received message', { type: parsed.type, from: sender.id });

    switch (parsed.type) {
      case 'join':
        await this.handleJoin(sender, parsed.playerId, parsed.username);
        break;
      case 'select':
        await this.handleSelect(sender, parsed.words);
        break;
      case 'submit':
        await this.handleSubmit(sender);
        break;
      case 'startGame':
        await this.handleStartGame(sender, parsed.mode, parsed.teamCount);
        break;
      case 'newGame':
        await this.handleNewGame(sender);
        break;
      case 'ping':
        sender.send(JSON.stringify({ type: 'pong' } as ServerMessage));
        break;
    }
  }

  private async handleJoin(conn: Party.Connection, playerId: string, username: string) {
    // Check for existing player
    const existingPlayer = this.state.players[playerId];

    // Find and clean up any old connection for this player
    for (const [oldConnId, meta] of this.connectionMeta.entries()) {
      if (meta.playerId === playerId && oldConnId !== conn.id) {
        // Clear any pending disconnect timer
        if (meta.disconnectTimer) {
          clearTimeout(meta.disconnectTimer);
        }
        // Remove old connection meta
        this.connectionMeta.delete(oldConnId);
        this.log('debug', 'Cleaned up old connection', { oldConnId, playerId });
      }
    }

    // Set up new connection meta
    this.connectionMeta.set(conn.id, { playerId });

    if (existingPlayer) {
      // Existing player reconnecting
      existingPlayer.connectionStatus = 'connected';
      existingPlayer.lastSeen = Date.now();
      existingPlayer.username = username; // Allow username update

      this.log('info', 'Player reconnected', { playerId, username });

      // Send full state to reconnected player
      this.sendRoomState(conn);

      // Notify others only if they were disconnected/reconnecting
      this.broadcast({ type: 'playerReconnected', player: existingPlayer }, conn.id);
      return;
    }

    // New player
    const playerIndex = Object.keys(this.state.players).length;
    const player: Player = {
      id: playerId,
      username,
      color: PLAYER_COLORS[playerIndex % PLAYER_COLORS.length],
      connectionStatus: 'connected',
      selectedWords: [],
      lastSeen: Date.now(),
    };

    this.state.players[playerId] = player;

    // First player becomes host
    if (!this.state.hostId) {
      this.state.hostId = playerId;
    }

    this.log('info', 'Player joined', { playerId, username, isHost: this.state.hostId === playerId });

    // Send full state to new player
    this.sendRoomState(conn);

    // Notify others
    this.broadcast({ type: 'playerJoined', player }, conn.id);
  }

  private async handleSelect(conn: Party.Connection, words: string[]) {
    const meta = this.connectionMeta.get(conn.id);
    if (!meta) return;

    const player = this.state.players[meta.playerId];
    if (!player) return;

    player.selectedWords = words;
    player.lastSeen = Date.now();

    this.log('debug', 'Player selection updated', {
      playerId: meta.playerId,
      wordCount: words.length,
    });

    // Broadcast to all players
    this.broadcast({
      type: 'playerSelected',
      playerId: meta.playerId,
      words,
    });
  }

  private async handleSubmit(conn: Party.Connection) {
    const meta = this.connectionMeta.get(conn.id);
    if (!meta) return;

    const player = this.state.players[meta.playerId];
    if (!player || player.selectedWords.length !== 4) return;

    // In co-op mode, check consensus
    if (this.state.mode === 'coop') {
      const activePlayers = Object.values(this.state.players)
        .filter(p => p.connectionStatus === 'connected');

      const sortedSubmission = [...player.selectedWords].sort().join(',');
      const allAgree = activePlayers.every(p =>
        [...p.selectedWords].sort().join(',') === sortedSubmission
      );

      if (!allAgree) {
        this.log('warn', 'Submit rejected: consensus not reached', { playerId: meta.playerId });
        conn.send(JSON.stringify({
          type: 'error',
          message: 'All players must select the same 4 words',
        } as ServerMessage));
        return;
      }
    }

    // Check the guess
    const result = this.checkGuess(player.selectedWords);

    if (result.correct && result.category) {
      // Remove solved words
      this.shuffledWords = this.shuffledWords.filter(
        w => !result.category!.words.includes(w)
      );
      this.state.solvedCategories.push(result.category.theme);

      this.log('info', 'Category solved', { theme: result.category.theme });

      // Clear all selections
      Object.values(this.state.players).forEach(p => {
        p.selectedWords = [];
      });

      // Broadcast result
      this.broadcast({
        type: 'guessResult',
        correct: true,
        category: {
          theme: result.category.theme,
          words: result.category.words,
          difficulty: result.category.difficulty,
        },
        strikes: this.state.strikes,
      });

      // Check for win
      if (this.state.solvedCategories.length === 4) {
        this.broadcast({
          type: 'gameOver',
          won: true,
          categories: this.puzzle!.categories.map(c => ({
            theme: c.theme,
            words: c.words,
            difficulty: c.difficulty,
          })),
        });
      }
    } else {
      this.state.strikes++;

      this.log('info', 'Wrong guess', {
        strikes: this.state.strikes,
        isOneAway: result.isOneAway,
      });

      this.broadcast({
        type: 'guessResult',
        correct: false,
        isOneAway: result.isOneAway,
        strikes: this.state.strikes,
      });

      // Check for loss
      if (this.state.strikes >= 4) {
        this.broadcast({
          type: 'gameOver',
          won: false,
          categories: this.puzzle!.categories.map(c => ({
            theme: c.theme,
            words: c.words,
            difficulty: c.difficulty,
          })),
        });
      }
    }
  }

  private checkGuess(selectedWords: string[]): {
    correct: boolean;
    category?: Category;
    isOneAway?: boolean;
  } {
    if (!this.puzzle) return { correct: false };

    const sortedSelected = [...selectedWords].sort();

    for (const category of this.puzzle.categories) {
      if (this.state.solvedCategories.includes(category.theme)) continue;

      const sortedCategory = [...category.words].sort();
      const matchCount = sortedSelected.filter(word => sortedCategory.includes(word)).length;

      if (matchCount === 4) {
        return { correct: true, category };
      }

      if (matchCount === 3) {
        return { correct: false, isOneAway: true };
      }
    }

    return { correct: false };
  }

  private async handleStartGame(conn: Party.Connection, mode: GameMode, teamCount?: number) {
    const meta = this.connectionMeta.get(conn.id);
    if (!meta) return;

    // Only host can start
    if (meta.playerId !== this.state.hostId) {
      this.log('warn', 'Non-host tried to start game', { playerId: meta.playerId });
      return;
    }

    this.state.mode = mode;
    this.state.gameStarted = true;
    this.state.solvedCategories = [];
    this.state.strikes = 0;

    // Generate a new puzzle with proper difficulty
    this.puzzle = generatePuzzle();
    this.shuffledWords = shuffle(this.puzzle.categories.flatMap(c => c.words));
    this.state.puzzleId = this.puzzle.id;

    // Clear all selections
    Object.values(this.state.players).forEach(p => {
      p.selectedWords = [];
    });

    if (mode === 'competitive' && teamCount) {
      // Assign players to teams
      const activePlayers = Object.values(this.state.players)
        .filter(p => p.connectionStatus === 'connected');

      // Shuffle players for random team assignment
      const shuffledPlayers = [...activePlayers].sort(() => Math.random() - 0.5);

      // Create teams with separate puzzles
      this.state.teams = {};
      for (let i = 0; i < teamCount; i++) {
        const teamPuzzle = generatePuzzle();
        const team: Team = {
          id: `team-${i}`,
          name: TEAM_COLORS[i].name,
          color: TEAM_COLORS[i].color,
          playerIds: [],
          solvedCategories: [],
          strikes: 0,
          puzzleId: teamPuzzle.id,
        };
        this.state.teams[team.id] = team;
      }

      // Distribute players
      shuffledPlayers.forEach((player, index) => {
        const teamIndex = index % teamCount;
        const teamId = `team-${teamIndex}`;
        player.teamId = teamId;
        this.state.teams[teamId].playerIds.push(player.id);
      });
    }

    this.log('info', 'Game started', {
      mode,
      teamCount,
      puzzleId: this.puzzle.id,
    });

    // Send updated state to all
    this.broadcastRoomState();
  }

  private async handleNewGame(conn: Party.Connection) {
    const meta = this.connectionMeta.get(conn.id);
    if (!meta) return;

    // Only host can start new game
    if (meta.playerId !== this.state.hostId) {
      this.log('warn', 'Non-host tried to start new game', { playerId: meta.playerId });
      return;
    }

    // Reset game state
    this.state.gameStarted = false;
    this.state.solvedCategories = [];
    this.state.strikes = 0;
    this.state.teams = {};
    this.state.winnerId = undefined;
    this.puzzle = null;
    this.shuffledWords = [];

    // Clear all selections and team assignments
    Object.values(this.state.players).forEach(p => {
      p.selectedWords = [];
      p.teamId = undefined;
    });

    this.log('info', 'New game started');

    // Send updated state to all
    this.broadcastRoomState();
  }

  private sendRoomState(conn: Party.Connection) {
    const message: ServerMessage = {
      type: 'roomState',
      state: this.state,
      puzzle: {
        id: this.puzzle?.id || '',
        words: this.shuffledWords,
      },
    };
    conn.send(JSON.stringify(message));
  }

  private broadcastRoomState() {
    const message: ServerMessage = {
      type: 'roomState',
      state: this.state,
      puzzle: {
        id: this.puzzle?.id || '',
        words: this.shuffledWords,
      },
    };
    this.room.broadcast(JSON.stringify(message));
  }

  private broadcast(message: ServerMessage, excludeConnId?: string) {
    const data = JSON.stringify(message);
    for (const conn of this.room.getConnections()) {
      if (conn.id !== excludeConnId) {
        conn.send(data);
      }
    }
  }
}
