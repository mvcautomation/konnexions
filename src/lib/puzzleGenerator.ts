/**
 * Puzzle Generator using ConceptNet API + curated wordplay categories
 *
 * Strategy:
 * 1. Use curated "tricky" categories (wordplay, hidden meanings, pop culture)
 * 2. Fetch related words from ConceptNet to find red herrings
 * 3. Ensure words have overlap potential between categories
 */

import { Puzzle, Category, Difficulty } from './puzzles';

const CONCEPTNET_API = 'https://api.conceptnet.io';

// Curated tricky categories - the "purple tier" stuff that makes puzzles hard
const TRICKY_CATEGORIES: Omit<Category, 'difficulty'>[] = [
  // Hidden body parts
  { theme: 'Hidden body parts', words: ['TEMPLE', 'PALM', 'CROWN', 'SOLE'] },
  { theme: 'Body parts in phrases', words: ['ELBOW', 'SHOULDER', 'KNEE', 'TONGUE'] },

  // _____ King patterns
  { theme: '_____ King', words: ['BURGER', 'LION', 'STEPHEN', 'DRAG'] },
  { theme: '_____ Queen', words: ['DAIRY', 'DRAG', 'DRAMA', 'BEAUTY'] },

  // Things with keys
  { theme: 'Things with keys', words: ['PIANO', 'KEYBOARD', 'MAP', 'FLORIDA'] },
  { theme: 'Things with rings', words: ['TREE', 'CIRCUS', 'PHONE', 'BOXING'] },

  // Double meanings
  { theme: 'Things that are pitched', words: ['TENT', 'IDEA', 'BASEBALL', 'VOICE'] },
  { theme: 'Things you can break', words: ['RECORD', 'NEWS', 'WIND', 'BREAD'] },
  { theme: 'Things you can run', words: ['MARATHON', 'ERRANDS', 'WATER', 'MOUTH'] },
  { theme: 'Things you can catch', words: ['COLD', 'FISH', 'FLIGHT', 'DRIFT'] },
  { theme: 'Things you can draw', words: ['PICTURE', 'BATH', 'ATTENTION', 'CONCLUSION'] },
  { theme: 'Things you can crack', words: ['JOKE', 'SAFE', 'DAWN', 'WHIP'] },
  { theme: 'Things you can throw', words: ['PARTY', 'SHADE', 'TOWEL', 'PUNCH'] },
  { theme: 'Things you can hit', words: ['ROAD', 'JACKPOT', 'BOTTOM', 'SNOOZE'] },
  { theme: 'Things you can lose', words: ['MIND', 'TOUCH', 'SLEEP', 'FACE'] },
  { theme: 'Things that flow', words: ['RIVER', 'TRAFFIC', 'CASH', 'LAVA'] },
  { theme: 'Things that bounce', words: ['BALL', 'CHECK', 'IDEA', 'LIGHT'] },
  { theme: 'Things that spread', words: ['BUTTER', 'RUMOR', 'FIRE', 'DISEASE'] },

  // Word before/after patterns
  { theme: 'Words before "BOARD"', words: ['SKATE', 'CUTTING', 'BULLETIN', 'CHESS'] },
  { theme: 'Words before "BALL"', words: ['BASKET', 'FOOT', 'BASE', 'CRYSTAL'] },
  { theme: 'Words before "BOOK"', words: ['FACE', 'NOTE', 'TEXT', 'YEAR'] },
  { theme: 'Words before "HOUSE"', words: ['GLASS', 'TREE', 'DOG', 'BIRD'] },
  { theme: 'Words before "LIGHT"', words: ['FLASH', 'LIME', 'HIGH', 'SPOT'] },
  { theme: 'Words before "LINE"', words: ['FINISH', 'DEAD', 'PUNCH', 'BOTTOM'] },
  { theme: 'Words before "WORK"', words: ['FRAME', 'NET', 'FIRE', 'CLOCK'] },
  { theme: 'Words after "FIRE"', words: ['FLY', 'WORKS', 'PLACE', 'CRACKER'] },
  { theme: 'Words after "BLACK"', words: ['JACK', 'BIRD', 'BERRY', 'SMITH'] },
  { theme: 'Words after "COLD"', words: ['WAR', 'SHOULDER', 'FEET', 'TURKEY'] },
  { theme: 'Words after "HONEY"', words: ['MOON', 'BEE', 'DEW', 'COMB'] },
  { theme: 'Can follow "HOME"', words: ['RUN', 'WORK', 'SICK', 'PAGE'] },
  { theme: '___ and cheese', words: ['MAC', 'WINE', 'CRACKERS', 'GRILLED'] },
  { theme: '___ Lane', words: ['PENNY', 'FAST', 'MEMORY', 'LOIS'] },
  { theme: '_____ Stone', words: ['ROLLING', 'STEPPING', 'KIDNEY', 'ROSETTA'] },
  { theme: '___ House', words: ['WHITE', 'FULL', 'HAUNTED', 'OPERA'] },
  { theme: '___ Code', words: ['ZIP', 'DRESS', 'MORSE', 'CHEAT'] },
  { theme: '___ Party', words: ['BLOCK', 'SEARCH', 'GARDEN', 'SLUMBER'] },
  { theme: '___ Man', words: ['IRON', 'SPIDER', 'ANT', 'BAT'] },
  { theme: '___ Trip', words: ['ROAD', 'GUILT', 'ROUND', 'EGO'] },

  // Famous people by first name
  { theme: 'Famous Michaels', words: ['JACKSON', 'JORDAN', 'SCOTT', 'MYERS'] },
  { theme: 'Famous Georges', words: ['WASHINGTON', 'CLOONEY', 'LUCAS', 'STRAIT'] },
  { theme: 'Famous Bills', words: ['GATES', 'MURRAY', 'CLINTON', 'NYE'] },
  { theme: 'Famous Toms', words: ['HANKS', 'CRUISE', 'HOLLAND', 'PETTY'] },
  { theme: 'Famous Johns', words: ['LENNON', 'WAYNE', 'WICK', 'LEGEND'] },
  { theme: 'Famous Jacks', words: ['SPARROW', 'NICHOLSON', 'BLACK', 'KNIFE'] },
  { theme: 'Famous Davids', words: ['BOWIE', 'LETTERMAN', 'BECKHAM', 'COPPERFIELD'] },
  { theme: 'Famous Steves', words: ['JOBS', 'WONDER', 'HARVEY', 'CARELL'] },
  { theme: 'Famous Chrises', words: ['HEMSWORTH', 'EVANS', 'PRATT', 'PINE'] },
  { theme: 'Famous Roberts', words: ['DOWNEY', 'DENIRO', 'REDFORD', 'PATTINSON'] },

  // Colors as last names
  { theme: 'Last names that are colors', words: ['WHITE', 'GREEN', 'BLACK', 'BROWN'] },

  // Classic rock bands (single word names)
  { theme: 'Classic rock bands', words: ['QUEEN', 'KISS', 'RUSH', 'CREAM'] },
  { theme: 'One-word rock bands', words: ['BOSTON', 'CHICAGO', 'KANSAS', 'EUROPE'] },

  // Slang
  { theme: 'Slang for money', words: ['BREAD', 'DOUGH', 'CHEDDAR', 'CABBAGE'] },
  { theme: 'Slang for good', words: ['SICK', 'FIRE', 'TIGHT', 'FRESH'] },

  // Things that are ___
  { theme: 'Things that are golden', words: ['GATE', 'RETRIEVER', 'GIRLS', 'STATE'] },
  { theme: 'Things that are green', words: ['THUMB', 'LIGHT', 'ROOM', 'CARD'] },
  { theme: 'Things that are blind', words: ['DATE', 'SPOT', 'FAITH', 'SIDE'] },
  { theme: 'Things that are sweet', words: ['DREAMS', 'SIXTEEN', 'TOOTH', 'TALK'] },
  { theme: 'Things that are wild', words: ['CARD', 'GOOSE', 'WEST', 'GUESS'] },
  { theme: 'Things that are sharp', words: ['KNIFE', 'CHEDDAR', 'TONGUE', 'SHOOTER'] },
  { theme: 'Things that are heavy', words: ['METAL', 'BREATHING', 'HANDED', 'CREAM'] },
  { theme: 'Things that are deep', words: ['SEA', 'STATE', 'POCKETS', 'FRIED'] },
  { theme: 'Things that are dry', words: ['HUMOR', 'SPELL', 'RUN', 'CLEANED'] },
  { theme: 'Things that are clear', words: ['COAST', 'AIR', 'CONSCIENCE', 'CUT'] },
  { theme: 'Things that are flat', words: ['TIRE', 'EARTH', 'RATE', 'FOOT'] },
  { theme: 'Things that are rough', words: ['DIAMOND', 'DRAFT', 'PATCH', 'HOUSING'] },
  { theme: 'Things that are tight', words: ['BUDGET', 'ROPE', 'SHIP', 'LIPS'] },
  { theme: 'Things that are sticky', words: ['SITUATION', 'NOTE', 'FINGERS', 'WICKET'] },
  { theme: 'Things that are bitter', words: ['TASTE', 'END', 'SWEET', 'PILL'] },

  // Things with parts
  { theme: 'Things with heads', words: ['NAIL', 'CABBAGE', 'SHOWER', 'RIVER'] },
  { theme: 'Things with teeth', words: ['SAW', 'COMB', 'GEAR', 'ZIPPER'] },
  { theme: 'Things with hands', words: ['CLOCK', 'POKER', 'SECOND', 'FARM'] },
  { theme: 'Things with caps', words: ['BOTTLE', 'KNEE', 'MUSHROOM', 'GRADUATION'] },
  { theme: 'Things with shells', words: ['TURTLE', 'EGG', 'NUT', 'TACO'] },
  { theme: 'Things with wings', words: ['AIRPLANE', 'CHICKEN', 'ANGEL', 'BUFFALO'] },
  { theme: 'Things with points', words: ['POWER', 'BULLET', 'TALKING', 'COMPASS'] },
  { theme: 'Things with roots', words: ['TREE', 'HAIR', 'GRASS', 'SQUARE'] },
  { theme: 'Things with waves', words: ['OCEAN', 'HAIR', 'HEAT', 'RADIO'] },

  // Word patterns
  { theme: 'Words with double letters', words: ['BALLOON', 'COFFEE', 'GIRAFFE', 'RACCOON'] },
  { theme: 'Compound words with "SUN"', words: ['FLOWER', 'GLASSES', 'BURN', 'RISE'] },
  { theme: 'Words before "FISH"', words: ['GOLD', 'CAT', 'JELLY', 'STAR'] },
  { theme: 'Words before "BERRY"', words: ['STRAW', 'BLUE', 'BLACK', 'RASP'] },
  { theme: 'Words before "DAY"', words: ['BIRTH', 'HOLI', 'WEDNES', 'HUMP'] },
  { theme: 'Words before "OUT"', words: ['BLACK', 'FREAK', 'BURN', 'WORK'] },
  { theme: 'Words before "BACK"', words: ['QUARTER', 'FLASH', 'PAPER', 'THROW'] },
  { theme: 'Words before "BAND"', words: ['RUBBER', 'ROCK', 'HEAD', 'BROAD'] },

  // Entertainment
  { theme: 'Bond film endings', words: ['ROYALE', 'SOLACE', 'SKYFALL', 'SPECTRE'] },
  { theme: 'Pixar one-word titles', words: ['COCO', 'UP', 'BRAVE', 'CARS'] },
];

// Medium difficulty - requires knowledge or a non-obvious connection
const MEDIUM_CATEGORIES: Omit<Category, 'difficulty'>[] = [
  // Words that ALSO mean something else (ambiguous)
  { theme: 'Units of measurement', words: ['FOOT', 'YARD', 'POUND', 'STONE'] },
  { theme: 'Dances', words: ['SWING', 'TAP', 'TWIST', 'BREAK'] },
  { theme: 'Fonts', words: ['TIMES', 'ARIAL', 'IMPACT', 'COURIER'] },
  { theme: 'Keyboard keys', words: ['SHIFT', 'CONTROL', 'RETURN', 'SPACE'] },
  { theme: 'Golf terms', words: ['BIRDIE', 'EAGLE', 'BOGEY', 'DRIVER'] },
  { theme: 'Poker hands', words: ['FLUSH', 'STRAIGHT', 'PAIR', 'HOUSE'] },
  { theme: 'Coffee sizes', words: ['TALL', 'GRANDE', 'VENTI', 'SHORT'] },

  // Pop culture that requires specific knowledge
  { theme: 'Tarantino films', words: ['PULP', 'RESERVOIR', 'JACKIE', 'HATEFUL'] },
  { theme: 'Wes Anderson films', words: ['ROYAL', 'MOONRISE', 'GRAND', 'FANTASTIC'] },
  { theme: 'Nintendo franchises', words: ['MARIO', 'ZELDA', 'METROID', 'KIRBY'] },
  { theme: 'Marvel phases', words: ['IRON', 'ULTRON', 'INFINITY', 'ENDGAME'] },

  // Less obvious groupings
  { theme: 'Things sold by the dozen', words: ['EGGS', 'ROSES', 'DONUTS', 'BAGELS'] },
  { theme: 'Things with stripes', words: ['ZEBRA', 'TIGER', 'CANDY', 'FLAG'] },
  { theme: 'Things that come in pairs', words: ['SOCKS', 'TWINS', 'DICE', 'LUNGS'] },
  { theme: 'Things with layers', words: ['ONION', 'CAKE', 'LASAGNA', 'OGRE'] },
  { theme: 'Things that melt', words: ['ICE', 'BUTTER', 'CHOCOLATE', 'HEART'] },
  { theme: 'Things that sting', words: ['BEE', 'JELLYFISH', 'NETTLE', 'INSULT'] },
  { theme: 'Things with buttons', words: ['SHIRT', 'REMOTE', 'ELEVATOR', 'BELLY'] },

  // Greek letters but less obvious ones
  { theme: 'Sorority/fraternity letters', words: ['KAPPA', 'SIGMA', 'THETA', 'PHI'] },

  // Word associations that require thinking
  { theme: 'Casino games', words: ['CRAPS', 'SLOTS', 'ROULETTE', 'BLACKJACK'] },
  { theme: 'Monopoly properties', words: ['PARK', 'BOARDWALK', 'BALTIC', 'ORIENTAL'] },
  { theme: 'Clue suspects', words: ['MUSTARD', 'SCARLET', 'PLUM', 'PEACOCK'] },
  { theme: 'Types of knots', words: ['SQUARE', 'SLIP', 'GRANNY', 'BOWLINE'] },
  { theme: 'Card game actions', words: ['DEAL', 'DRAW', 'PASS', 'BID'] },
];

// Yellow tier - still needs thought but connection is clearer once seen
const EASY_CATEGORIES: Omit<Category, 'difficulty'>[] = [
  // Words with double meanings (less tricky than purple)
  { theme: 'Things with scales', words: ['FISH', 'PIANO', 'MAP', 'JUSTICE'] },
  { theme: 'Things with tongues', words: ['SHOE', 'BELL', 'FLAME', 'SNAKE'] },
  { theme: 'Things that tick', words: ['CLOCK', 'BOMB', 'HEART', 'BOX'] },
  { theme: 'Things that can be stuffed', words: ['TURKEY', 'ANIMAL', 'PEPPER', 'SHIRT'] },
  { theme: 'Things that fold', words: ['CHAIR', 'PAPER', 'LAUNDRY', 'POKER'] },

  // Category requires recognition but not obscure knowledge
  { theme: 'Types of bread', words: ['RYE', 'PUMPERNICKEL', 'SOURDOUGH', 'CIABATTA'] },
  { theme: 'Pasta shapes', words: ['PENNE', 'RIGATONI', 'FUSILLI', 'FARFALLE'] },
  { theme: 'Coffee drinks', words: ['ESPRESSO', 'AMERICANO', 'MACCHIATO', 'CORTADO'] },
  { theme: 'Whiskey types', words: ['BOURBON', 'SCOTCH', 'RYE', 'IRISH'] },
  { theme: 'Cheese varieties', words: ['BRIE', 'GOUDA', 'GRUYERE', 'MANCHEGO'] },

  // Pop culture but widely known
  { theme: 'Disney villains', words: ['URSULA', 'SCAR', 'JAFAR', 'MALEFICENT'] },
  { theme: 'Pixar characters', words: ['WOODY', 'NEMO', 'WALL-E', 'SULLEY'] },
  { theme: 'Studio Ghibli films', words: ['SPIRITED', 'TOTORO', 'HOWL', 'PONYO'] },

  // Trivia-ish but not obscure
  { theme: 'Ivy League schools', words: ['HARVARD', 'YALE', 'PRINCETON', 'BROWN'] },
  { theme: 'London tube lines', words: ['CENTRAL', 'VICTORIA', 'JUBILEE', 'PICCADILLY'] },
  { theme: 'NYC boroughs', words: ['MANHATTAN', 'BROOKLYN', 'QUEENS', 'BRONX'] },
  { theme: 'California cities', words: ['OAKLAND', 'FRESNO', 'PASADENA', 'BURBANK'] },

  // Things that share an unexpected connection
  { theme: 'Things that can be wild', words: ['CARD', 'GUESS', 'CHILD', 'PITCH'] },
  { theme: 'Things that can be blank', words: ['CHECK', 'STARE', 'SLATE', 'CANVAS'] },
  { theme: 'Things that can be loaded', words: ['DICE', 'QUESTION', 'GUN', 'POTATO'] },
];

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Check if categories have word overlap (makes puzzle harder)
function hasWordOverlap(categories: Omit<Category, 'difficulty'>[]): boolean {
  const allWords = categories.flatMap(c => c.words);
  const uniqueWords = new Set(allWords);
  return uniqueWords.size < allWords.length;
}

// Find categories that share potential "trap" words
function findCompatibleCategories(
  tricky: Omit<Category, 'difficulty'>[],
  medium: Omit<Category, 'difficulty'>[],
  easy: Omit<Category, 'difficulty'>[]
): Category[] {
  // We want: 1 easy (yellow), 1 medium (green), 1 hard (blue), 1 tricky (purple)
  const shuffledEasy = shuffle(easy);
  const shuffledMedium = shuffle(medium);
  const shuffledTricky = shuffle(tricky);

  // Find a combination without duplicate words
  for (const easyC of shuffledEasy) {
    for (const mediumC of shuffledMedium) {
      for (let i = 0; i < shuffledTricky.length - 1; i++) {
        const trickyC1 = shuffledTricky[i];
        const trickyC2 = shuffledTricky[i + 1];

        const allWords = [
          ...easyC.words,
          ...mediumC.words,
          ...trickyC1.words,
          ...trickyC2.words,
        ];

        const uniqueWords = new Set(allWords.map(w => w.toUpperCase()));

        // If all 16 words are unique, we have a valid puzzle
        if (uniqueWords.size === 16) {
          return [
            { ...easyC, difficulty: 'yellow' as Difficulty },
            { ...mediumC, difficulty: 'green' as Difficulty },
            { ...trickyC1, difficulty: 'blue' as Difficulty },
            { ...trickyC2, difficulty: 'purple' as Difficulty },
          ];
        }
      }
    }
  }

  // Fallback: just pick random non-overlapping ones
  return pickNonOverlappingCategories();
}

function pickNonOverlappingCategories(): Category[] {
  const all = [
    ...EASY_CATEGORIES.map(c => ({ ...c, difficulty: 'yellow' as Difficulty })),
    ...MEDIUM_CATEGORIES.map(c => ({ ...c, difficulty: 'green' as Difficulty })),
    ...TRICKY_CATEGORIES.map(c => ({ ...c, difficulty: 'blue' as Difficulty })),
  ];

  const shuffled = shuffle(all);
  const selected: Category[] = [];
  const usedWords = new Set<string>();

  for (const cat of shuffled) {
    const catWords = cat.words.map(w => w.toUpperCase());
    if (catWords.every(w => !usedWords.has(w))) {
      selected.push(cat);
      catWords.forEach(w => usedWords.add(w));

      if (selected.length === 4) break;
    }
  }

  // Assign difficulties based on category type
  const difficulties: Difficulty[] = ['yellow', 'green', 'blue', 'purple'];
  return selected.map((cat, i) => ({
    ...cat,
    difficulty: difficulties[i] || 'purple',
  }));
}

// Generate a puzzle with proper difficulty distribution
export function generatePuzzle(): Puzzle {
  const categories = findCompatibleCategories(
    TRICKY_CATEGORIES,
    MEDIUM_CATEGORIES,
    EASY_CATEGORIES
  ) as [Category, Category, Category, Category];

  // Sort by difficulty
  const sorted = categories.sort((a, b) => {
    const order: Difficulty[] = ['yellow', 'green', 'blue', 'purple'];
    return order.indexOf(a.difficulty) - order.indexOf(b.difficulty);
  });

  return {
    id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    categories: sorted as [Category, Category, Category, Category],
  };
}

// ConceptNet integration for finding related words
export async function getRelatedWords(word: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${CONCEPTNET_API}/c/en/${word.toLowerCase()}?limit=20`
    );
    const data = await response.json();

    const related: string[] = [];
    for (const edge of data.edges || []) {
      const start = edge.start?.label || '';
      const end = edge.end?.label || '';
      const other = start.toLowerCase() === word.toLowerCase() ? end : start;

      if (other && other.length > 2 && !other.includes(' ') && other.length < 12) {
        related.push(other.toUpperCase());
      }
    }

    return [...new Set(related)].slice(0, 10);
  } catch (error) {
    console.error('ConceptNet API error:', error);
    return [];
  }
}

// Export all categories for reference
export { TRICKY_CATEGORIES, MEDIUM_CATEGORIES, EASY_CATEGORIES };
