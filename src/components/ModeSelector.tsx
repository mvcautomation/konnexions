'use client';

import { useState } from 'react';
import { GameMode, TEAM_COLORS } from '@/lib/types';

interface ModeSelectorProps {
  onStart: (mode: GameMode, teamCount?: number) => void;
  playerCount: number;
}

export function ModeSelector({ onStart, playerCount }: ModeSelectorProps) {
  const [mode, setMode] = useState<GameMode>('coop');
  const [teamCount, setTeamCount] = useState(2);

  const maxTeams = Math.min(4, Math.floor(playerCount / 1)); // At least 1 player per team

  return (
    <div className="bg-[var(--background-card)] rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-bold text-center">Choose Game Mode</h2>

      {/* Mode selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode('coop')}
          className={`p-4 rounded-xl text-center transition-all ${
            mode === 'coop'
              ? 'bg-[var(--color-green)] text-[var(--background)]'
              : 'bg-[var(--background)] hover:opacity-80'
          }`}
        >
          <div className="text-2xl mb-1">🤝</div>
          <div className="font-semibold">Co-op</div>
          <div className="text-xs opacity-70 mt-1">Work together</div>
        </button>

        <button
          onClick={() => setMode('competitive')}
          className={`p-4 rounded-xl text-center transition-all ${
            mode === 'competitive'
              ? 'bg-[var(--color-purple)] text-[var(--background)]'
              : 'bg-[var(--background)] hover:opacity-80'
          }`}
        >
          <div className="text-2xl mb-1">🏆</div>
          <div className="font-semibold">Competitive</div>
          <div className="text-xs opacity-70 mt-1">Race to finish</div>
        </button>
      </div>

      {/* Team count selector (competitive only) */}
      {mode === 'competitive' && (
        <div className="space-y-3">
          <label className="text-sm opacity-70">Number of teams:</label>
          <div className="flex gap-2">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => setTeamCount(count)}
                disabled={count > maxTeams}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  teamCount === count
                    ? 'bg-[var(--color-purple)] text-[var(--background)]'
                    : 'bg-[var(--background)] hover:opacity-80'
                } ${count > maxTeams ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {count}
              </button>
            ))}
          </div>

          {/* Team preview */}
          <div className="flex gap-2 justify-center mt-4">
            {TEAM_COLORS.slice(0, teamCount).map((team) => (
              <div
                key={team.name}
                className="flex items-center gap-1 text-sm"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <span>{team.name}</span>
              </div>
            ))}
          </div>

          {playerCount < teamCount && (
            <p className="text-xs text-center text-[var(--color-accent)]">
              Need at least {teamCount} players for {teamCount} teams
            </p>
          )}
        </div>
      )}

      {/* Co-op description */}
      {mode === 'coop' && (
        <p className="text-sm text-center opacity-70">
          Everyone works on the same puzzle. All players must agree on the same 4 words before submitting.
        </p>
      )}

      {/* Start button */}
      <button
        onClick={() => onStart(mode, mode === 'competitive' ? teamCount : undefined)}
        disabled={mode === 'competitive' && playerCount < teamCount}
        className="w-full py-4 rounded-xl bg-[var(--color-green)] text-[var(--background)]
                   font-bold text-lg hover:opacity-90 transition-opacity
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start Game
      </button>
    </div>
  );
}
