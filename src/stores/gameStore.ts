import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Player, RoomState, GameMode, PLAYER_COLORS } from '@/lib/types';
import { Category } from '@/lib/puzzles';
import { uiLogger as logger } from '@/lib/logger';

interface LocalPlayer {
  id: string;
  username: string;
}

interface GameStore {
  // Local player identity (persisted)
  localPlayer: LocalPlayer | null;
  setUsername: (username: string) => void;
  getOrCreatePlayerId: () => string;

  // Room state (from server)
  roomState: RoomState | null;
  setRoomState: (state: RoomState | null) => void;

  // Local UI state
  selectedWords: string[];
  puzzleWords: string[];
  solvedCategories: Category[];
  isShaking: boolean;
  lastMessage: string | null;

  // Actions
  toggleWord: (word: string) => void;
  setSelectedWords: (words: string[]) => void;
  setPuzzleWords: (words: string[]) => void;
  addSolvedCategory: (category: Category) => void;
  setSolvedCategories: (categories: Category[]) => void;
  setShaking: (shaking: boolean) => void;
  setLastMessage: (message: string | null) => void;
  clearSelection: () => void;
  resetGame: () => void;

  // Consensus helpers
  canSubmit: () => boolean;
  getConsensusStatus: () => { aligned: boolean; playerSelections: Record<string, string[]> };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Local player identity
      localPlayer: null,

      setUsername: (username: string) => {
        const playerId = get().getOrCreatePlayerId();
        logger.info({ playerId, username }, 'Setting username');
        set({ localPlayer: { id: playerId, username } });
      },

      getOrCreatePlayerId: () => {
        const existing = get().localPlayer?.id;
        if (existing) return existing;

        const newId = uuidv4();
        logger.info({ playerId: newId }, 'Created new player ID');
        return newId;
      },

      // Room state
      roomState: null,
      setRoomState: (state) => {
        logger.debug({ roomId: state?.roomId }, 'Room state updated');
        set({ roomState: state });
      },

      // Local UI state
      selectedWords: [],
      puzzleWords: [],
      solvedCategories: [],
      isShaking: false,
      lastMessage: null,

      toggleWord: (word: string) => {
        const { selectedWords, puzzleWords } = get();
        if (!puzzleWords.includes(word)) return;

        const isSelected = selectedWords.includes(word);
        let newSelection: string[];

        if (isSelected) {
          newSelection = selectedWords.filter(w => w !== word);
        } else if (selectedWords.length < 4) {
          newSelection = [...selectedWords, word];
        } else {
          // Already have 4 selected
          return;
        }

        logger.debug({ word, action: isSelected ? 'deselect' : 'select', count: newSelection.length }, 'Word toggled');
        set({ selectedWords: newSelection });
      },

      setSelectedWords: (words) => set({ selectedWords: words }),

      setPuzzleWords: (words) => {
        logger.debug({ count: words.length }, 'Puzzle words set');
        set({ puzzleWords: words });
      },

      addSolvedCategory: (category) => {
        const { solvedCategories, puzzleWords } = get();
        const newSolved = [...solvedCategories, category];
        const newPuzzleWords = puzzleWords.filter(w => !category.words.includes(w));

        logger.info({ theme: category.theme, remaining: newPuzzleWords.length }, 'Category solved');
        set({
          solvedCategories: newSolved,
          puzzleWords: newPuzzleWords,
          selectedWords: [],
        });
      },

      setSolvedCategories: (categories) => set({ solvedCategories: categories }),

      setShaking: (shaking) => set({ isShaking: shaking }),

      setLastMessage: (message) => set({ lastMessage: message }),

      clearSelection: () => set({ selectedWords: [] }),

      resetGame: () => {
        logger.info('Game reset');
        set({
          selectedWords: [],
          puzzleWords: [],
          solvedCategories: [],
          isShaking: false,
          lastMessage: null,
        });
      },

      // Consensus helpers for co-op mode
      canSubmit: () => {
        const { roomState, selectedWords } = get();
        if (!roomState || roomState.mode !== 'coop') {
          return selectedWords.length === 4;
        }

        // In co-op, all active players must have the same 4 words selected
        const activePlayers = Object.values(roomState.players).filter(
          p => p.connectionStatus === 'connected'
        );

        if (activePlayers.length === 0) return false;
        if (selectedWords.length !== 4) return false;

        const sortedLocal = [...selectedWords].sort().join(',');

        return activePlayers.every(player => {
          const sortedPlayer = [...player.selectedWords].sort().join(',');
          return sortedPlayer === sortedLocal;
        });
      },

      getConsensusStatus: () => {
        const { roomState, selectedWords } = get();
        const playerSelections: Record<string, string[]> = {};

        if (!roomState) {
          return { aligned: false, playerSelections };
        }

        const activePlayers = Object.values(roomState.players).filter(
          p => p.connectionStatus === 'connected'
        );

        if (activePlayers.length === 0) {
          return { aligned: false, playerSelections };
        }

        activePlayers.forEach(player => {
          playerSelections[player.id] = player.selectedWords;
        });

        const sortedLocal = [...selectedWords].sort().join(',');
        const aligned = selectedWords.length === 4 && activePlayers.every(player => {
          const sortedPlayer = [...player.selectedWords].sort().join(',');
          return sortedPlayer === sortedLocal;
        });

        return { aligned, playerSelections };
      },
    }),
    {
      name: 'konnexions-player',
      partialize: (state) => ({
        localPlayer: state.localPlayer,
      }),
    }
  )
);

// Helper to get player color by index
export function getPlayerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}
