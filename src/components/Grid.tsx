'use client';

import { WordCard } from './WordCard';
import { SolvedCategory } from './SolvedCategory';
import { Category } from '@/lib/puzzles';
import { Player } from '@/lib/types';
import { sortCategoriesByDifficulty } from '@/lib/gameLogic';

interface GridProps {
  words: string[];
  selectedWords: string[];
  solvedCategories: Category[];
  playerSelections: Record<string, Player>;
  localPlayerId: string;
  onWordClick: (word: string) => void;
  isShaking: boolean;
  disabled?: boolean;
}

export function Grid({
  words,
  selectedWords,
  solvedCategories,
  playerSelections,
  localPlayerId,
  onWordClick,
  isShaking,
  disabled = false,
}: GridProps) {
  const sortedSolved = sortCategoriesByDifficulty(solvedCategories);

  return (
    <div className="w-full max-w-lg mx-auto space-y-2">
      {/* Solved categories */}
      {sortedSolved.map((category) => (
        <SolvedCategory key={category.theme} category={category} />
      ))}

      {/* Word grid */}
      <div
        className={`grid grid-cols-4 gap-2 ${isShaking ? 'shake' : ''}`}
      >
        {words.map((word) => (
          <WordCard
            key={word}
            word={word}
            isSelected={selectedWords.includes(word)}
            playerSelections={playerSelections}
            localPlayerId={localPlayerId}
            onClick={() => onWordClick(word)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
