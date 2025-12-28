'use client';

import { Player } from '@/lib/types';

interface WordCardProps {
  word: string;
  isSelected: boolean;
  playerSelections: Record<string, Player>;
  localPlayerId: string;
  onClick: () => void;
  disabled?: boolean;
}

export function WordCard({
  word,
  isSelected,
  playerSelections,
  localPlayerId,
  onClick,
  disabled = false,
}: WordCardProps) {
  // Find which players have selected this word
  const selectingPlayers = Object.values(playerSelections).filter(
    player => player.selectedWords.includes(word) && player.id !== localPlayerId
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        word-card relative min-h-[70px] text-sm md:text-base
        ${isSelected ? 'selected' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {word}

      {/* Player selection indicators */}
      {selectingPlayers.length > 0 && (
        <div className="absolute top-1 right-1 flex gap-0.5">
          {selectingPlayers.slice(0, 4).map((player) => (
            <div
              key={player.id}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: player.color }}
              title={player.username}
            />
          ))}
          {selectingPlayers.length > 4 && (
            <div className="w-3 h-3 rounded-full bg-gray-500 text-[8px] flex items-center justify-center text-white">
              +{selectingPlayers.length - 4}
            </div>
          )}
        </div>
      )}
    </button>
  );
}
