'use client';

import { Player } from '@/lib/types';

interface PlayerListProps {
  players: Record<string, Player>;
  localPlayerId: string;
}

export function PlayerList({ players, localPlayerId }: PlayerListProps) {
  const playerArray = Object.values(players);

  if (playerArray.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--background-card)] rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-3 opacity-70">Players</h3>
      <div className="space-y-2">
        {playerArray.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-2"
          >
            {/* Color indicator */}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: player.color }}
            />

            {/* Username */}
            <span className="text-sm truncate flex-1">
              {player.username}
              {player.id === localPlayerId && (
                <span className="opacity-50 ml-1">(you)</span>
              )}
            </span>

            {/* Connection status */}
            {player.connectionStatus === 'reconnecting' && (
              <span className="text-xs text-yellow-400 animate-pulse">
                reconnecting...
              </span>
            )}
            {player.connectionStatus === 'disconnected' && (
              <span className="text-xs text-red-400">
                offline
              </span>
            )}

            {/* Selection count */}
            {player.connectionStatus === 'connected' && player.selectedWords.length > 0 && (
              <span className="text-xs opacity-50">
                {player.selectedWords.length}/4
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
