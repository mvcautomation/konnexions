import { Category, Difficulty, Puzzle } from './puzzles';
import { gameLogger as logger } from './logger';

export interface GameState {
  puzzle: Puzzle;
  solvedCategories: Category[];
  remainingWords: string[];
  strikes: number;
  maxStrikes: number;
  isComplete: boolean;
  isWon: boolean;
}

export interface GuessResult {
  correct: boolean;
  category?: Category;
  isOneAway?: boolean;
  message: string;
}

// Initialize a new game state from a puzzle
export function initializeGame(puzzle: Puzzle): GameState {
  const allWords = puzzle.categories.flatMap(c => c.words);
  const shuffledWords = shuffleArray(allWords);

  logger.info({ puzzleId: puzzle.id }, 'Initializing new game');

  return {
    puzzle,
    solvedCategories: [],
    remainingWords: shuffledWords,
    strikes: 0,
    maxStrikes: 4,
    isComplete: false,
    isWon: false,
  };
}

// Shuffle array using Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Check if a guess is correct
export function checkGuess(state: GameState, selectedWords: string[]): GuessResult {
  logger.debug({ selectedWords }, 'Checking guess');

  if (selectedWords.length !== 4) {
    logger.warn({ count: selectedWords.length }, 'Invalid guess: must select 4 words');
    return {
      correct: false,
      message: 'Please select exactly 4 words',
    };
  }

  // Check if all selected words are still in play
  const allValid = selectedWords.every(word => state.remainingWords.includes(word));
  if (!allValid) {
    logger.warn({ selectedWords }, 'Invalid guess: some words already solved');
    return {
      correct: false,
      message: 'Some selected words are no longer available',
    };
  }

  // Find matching category
  const sortedSelected = [...selectedWords].sort();

  for (const category of state.puzzle.categories) {
    if (state.solvedCategories.includes(category)) continue;

    const sortedCategory = [...category.words].sort();
    const matchCount = sortedSelected.filter(word => sortedCategory.includes(word)).length;

    if (matchCount === 4) {
      logger.info({ category: category.theme }, 'Correct guess!');
      return {
        correct: true,
        category,
        message: `Correct! ${category.theme}`,
      };
    }

    if (matchCount === 3) {
      logger.debug({ category: category.theme }, 'One away from category');
      return {
        correct: false,
        isOneAway: true,
        message: 'One away...',
      };
    }
  }

  logger.debug('Incorrect guess');
  return {
    correct: false,
    message: 'Not quite, try again',
  };
}

// Apply a guess result to the game state
export function applyGuess(state: GameState, selectedWords: string[], result: GuessResult): GameState {
  if (result.correct && result.category) {
    const newRemainingWords = state.remainingWords.filter(w => !selectedWords.includes(w));
    const newSolvedCategories = [...state.solvedCategories, result.category];
    const isComplete = newSolvedCategories.length === 4;

    logger.info({
      solvedCount: newSolvedCategories.length,
      remainingCount: newRemainingWords.length,
      isComplete,
    }, 'Category solved');

    return {
      ...state,
      solvedCategories: newSolvedCategories,
      remainingWords: newRemainingWords,
      isComplete,
      isWon: isComplete,
    };
  } else {
    const newStrikes = state.strikes + 1;
    const isComplete = newStrikes >= state.maxStrikes;

    logger.info({
      strikes: newStrikes,
      maxStrikes: state.maxStrikes,
      isComplete,
    }, 'Strike recorded');

    return {
      ...state,
      strikes: newStrikes,
      isComplete,
      isWon: false,
    };
  }
}

// Get difficulty color class
export function getDifficultyColor(difficulty: Difficulty): string {
  const colors: Record<Difficulty, string> = {
    yellow: 'var(--color-yellow)',
    green: 'var(--color-green)',
    blue: 'var(--color-blue)',
    purple: 'var(--color-purple)',
  };
  return colors[difficulty];
}

// Get difficulty label
export function getDifficultyLabel(difficulty: Difficulty): string {
  const labels: Record<Difficulty, string> = {
    yellow: 'Easy',
    green: 'Medium',
    blue: 'Hard',
    purple: 'Tricky',
  };
  return labels[difficulty];
}

// Sort solved categories by difficulty order
export function sortCategoriesByDifficulty(categories: Category[]): Category[] {
  const order: Difficulty[] = ['yellow', 'green', 'blue', 'purple'];
  return [...categories].sort((a, b) =>
    order.indexOf(a.difficulty) - order.indexOf(b.difficulty)
  );
}
