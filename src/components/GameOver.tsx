'use client';

import { Category } from '@/lib/puzzles';
import { SolvedCategory } from './SolvedCategory';
import { sortCategoriesByDifficulty } from '@/lib/gameLogic';

interface GameOverProps {
  won: boolean;
  categories: Category[];
  strikes: number;
  onNewGame: () => void;
  onBackToLobby: () => void;
}

export function GameOver({
  won,
  categories,
  strikes,
  onNewGame,
  onBackToLobby,
}: GameOverProps) {
  const sortedCategories = sortCategoriesByDifficulty(categories);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--background)] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Result header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {won ? '🎉 You Won!' : '😔 Game Over'}
          </h2>
          <p className="opacity-70">
            {won
              ? `Solved with ${strikes} mistake${strikes !== 1 ? 's' : ''}`
              : 'Better luck next time!'}
          </p>
        </div>

        {/* All categories */}
        <div className="space-y-2 mb-6">
          {sortedCategories.map((category) => (
            <SolvedCategory key={category.theme} category={category} />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBackToLobby}
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--background-card)]
                       font-medium hover:opacity-80 transition-opacity"
          >
            Back to Lobby
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-purple)] text-[var(--background)]
                       font-bold hover:opacity-90 transition-opacity"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
