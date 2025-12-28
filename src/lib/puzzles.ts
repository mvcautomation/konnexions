export type Difficulty = 'yellow' | 'green' | 'blue' | 'purple';

export interface Category {
  theme: string;
  words: [string, string, string, string];
  difficulty: Difficulty;
}

export interface Puzzle {
  id: string;
  categories: [Category, Category, Category, Category];
}

// Helper to shuffle an array
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Get all 16 words from a puzzle, shuffled
export function getShuffledWords(puzzle: Puzzle): string[] {
  const allWords = puzzle.categories.flatMap(c => c.words);
  return shuffle(allWords);
}

// Get a random puzzle
export function getRandomPuzzle(): Puzzle {
  return PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
}

// Get multiple unique random puzzles (for competitive mode)
export function getRandomPuzzles(count: number): Puzzle[] {
  const shuffled = shuffle([...PUZZLES]);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ~50 curated puzzles
export const PUZZLES: Puzzle[] = [
  {
    id: 'puzzle-001',
    categories: [
      { theme: 'Social media actions', words: ['LIKE', 'SHARE', 'POST', 'FOLLOW'], difficulty: 'yellow' },
      { theme: 'Classic rock bands', words: ['QUEEN', 'KISS', 'RUSH', 'CREAM'], difficulty: 'green' },
      { theme: '___ and cheese', words: ['MAC', 'WINE', 'CRACKERS', 'GRILLED'], difficulty: 'blue' },
      { theme: 'Words before "BOARD"', words: ['SKATE', 'CUTTING', 'BULLETIN', 'CHESS'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-002',
    categories: [
      { theme: 'Types of charts', words: ['BAR', 'PIE', 'LINE', 'FLOW'], difficulty: 'yellow' },
      { theme: 'Poker terms', words: ['FOLD', 'CALL', 'RAISE', 'CHECK'], difficulty: 'green' },
      { theme: 'Apple products', words: ['WATCH', 'MUSIC', 'ARCADE', 'FITNESS'], difficulty: 'blue' },
      { theme: 'Things that are pitched', words: ['TENT', 'IDEA', 'BASEBALL', 'VOICE'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-003',
    categories: [
      { theme: 'Slang for money', words: ['BREAD', 'DOUGH', 'CHEDDAR', 'CABBAGE'], difficulty: 'yellow' },
      { theme: '_____ King', words: ['BURGER', 'LION', 'STEPHEN', 'DRAG'], difficulty: 'green' },
      { theme: 'Things with keys', words: ['PIANO', 'KEYBOARD', 'MAP', 'FLORIDA'], difficulty: 'blue' },
      { theme: 'Hidden body parts', words: ['TEMPLE', 'PALM', 'CROWN', 'SOLE'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-004',
    categories: [
      { theme: 'Coffee drinks', words: ['LATTE', 'MOCHA', 'ESPRESSO', 'CAPPUCCINO'], difficulty: 'yellow' },
      { theme: 'Movie genres', words: ['HORROR', 'COMEDY', 'DRAMA', 'ACTION'], difficulty: 'green' },
      { theme: 'Can follow "HOME"', words: ['RUN', 'WORK', 'SICK', 'PAGE'], difficulty: 'blue' },
      { theme: 'Words with double letters', words: ['BALLOON', 'COFFEE', 'GIRAFFE', 'RACCOON'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-005',
    categories: [
      { theme: 'Primary colors', words: ['RED', 'BLUE', 'YELLOW', 'GREEN'], difficulty: 'yellow' },
      { theme: 'Card games', words: ['POKER', 'BRIDGE', 'HEARTS', 'SPADES'], difficulty: 'green' },
      { theme: 'Things you can break', words: ['RECORD', 'NEWS', 'WIND', 'BREAD'], difficulty: 'blue' },
      { theme: '___ Lane', words: ['PENNY', 'FAST', 'MEMORY', 'LOIS'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-006',
    categories: [
      { theme: 'Breakfast foods', words: ['PANCAKE', 'WAFFLE', 'BACON', 'EGGS'], difficulty: 'yellow' },
      { theme: 'Social media platforms', words: ['TWITTER', 'INSTAGRAM', 'TIKTOK', 'SNAPCHAT'], difficulty: 'green' },
      { theme: 'Words before "BALL"', words: ['BASKET', 'FOOT', 'BASE', 'SNOW'], difficulty: 'blue' },
      { theme: 'Famous Michaels', words: ['JACKSON', 'JORDAN', 'SCOTT', 'MYERS'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-007',
    categories: [
      { theme: 'Fruits', words: ['APPLE', 'BANANA', 'ORANGE', 'GRAPE'], difficulty: 'yellow' },
      { theme: 'Zodiac signs', words: ['LEO', 'ARIES', 'VIRGO', 'GEMINI'], difficulty: 'green' },
      { theme: 'Things in a wallet', words: ['CASH', 'LICENSE', 'CARDS', 'RECEIPTS'], difficulty: 'blue' },
      { theme: '_____ Stone', words: ['ROLLING', 'STEPPING', 'KIDNEY', 'ROSETTA'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-008',
    categories: [
      { theme: 'Weather', words: ['SUNNY', 'RAINY', 'CLOUDY', 'WINDY'], difficulty: 'yellow' },
      { theme: 'Superheroes', words: ['BATMAN', 'SUPERMAN', 'SPIDERMAN', 'IRONMAN'], difficulty: 'green' },
      { theme: 'Things you can run', words: ['MARATHON', 'ERRANDS', 'WATER', 'MOUTH'], difficulty: 'blue' },
      { theme: 'Famous Georges', words: ['WASHINGTON', 'CLOONEY', 'LUCAS', 'STRAIT'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-009',
    categories: [
      { theme: 'Pizza toppings', words: ['PEPPERONI', 'MUSHROOM', 'ONION', 'OLIVE'], difficulty: 'yellow' },
      { theme: 'Harry Potter houses', words: ['GRYFFINDOR', 'SLYTHERIN', 'RAVENCLAW', 'HUFFLEPUFF'], difficulty: 'green' },
      { theme: 'Things with wings', words: ['AIRPLANE', 'CHICKEN', 'ANGEL', 'BUFFALO'], difficulty: 'blue' },
      { theme: 'Words ending in "-tion"', words: ['STATION', 'NATION', 'MOTION', 'POTION'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-010',
    categories: [
      { theme: 'Dog breeds', words: ['POODLE', 'BEAGLE', 'BULLDOG', 'HUSKY'], difficulty: 'yellow' },
      { theme: 'Greek letters', words: ['ALPHA', 'BETA', 'DELTA', 'OMEGA'], difficulty: 'green' },
      { theme: 'Things that are golden', words: ['GATE', 'RETRIEVER', 'GIRLS', 'STATE'], difficulty: 'blue' },
      { theme: 'Compound words with "SUN"', words: ['FLOWER', 'GLASSES', 'BURN', 'RISE'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-011',
    categories: [
      { theme: 'Car brands', words: ['TOYOTA', 'HONDA', 'FORD', 'BMW'], difficulty: 'yellow' },
      { theme: 'Chess pieces', words: ['KING', 'QUEEN', 'BISHOP', 'KNIGHT'], difficulty: 'green' },
      { theme: 'Things that are sharp', words: ['KNIFE', 'CHEDDAR', 'TONGUE', 'SHOOTER'], difficulty: 'blue' },
      { theme: '___ House', words: ['WHITE', 'FULL', 'HAUNTED', 'OPERA'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-012',
    categories: [
      { theme: 'Vegetables', words: ['CARROT', 'BROCCOLI', 'SPINACH', 'CELERY'], difficulty: 'yellow' },
      { theme: 'Disney princesses', words: ['ARIEL', 'BELLE', 'MULAN', 'MOANA'], difficulty: 'green' },
      { theme: 'Things you can catch', words: ['COLD', 'FISH', 'FLIGHT', 'DRIFT'], difficulty: 'blue' },
      { theme: 'Words before "TRIP"', words: ['ROAD', 'GUILT', 'ROUND', 'EGO'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-013',
    categories: [
      { theme: 'Ice cream flavors', words: ['VANILLA', 'CHOCOLATE', 'STRAWBERRY', 'MINT'], difficulty: 'yellow' },
      { theme: 'Olympic sports', words: ['SWIMMING', 'DIVING', 'GYMNASTICS', 'FENCING'], difficulty: 'green' },
      { theme: 'Things with heads', words: ['NAIL', 'CABBAGE', 'SHOWER', 'RIVER'], difficulty: 'blue' },
      { theme: 'Last names that are colors', words: ['WHITE', 'GREEN', 'BLACK', 'BROWN'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-014',
    categories: [
      { theme: 'Pasta types', words: ['SPAGHETTI', 'PENNE', 'RAVIOLI', 'LINGUINE'], difficulty: 'yellow' },
      { theme: 'Marvel villains', words: ['THANOS', 'ULTRON', 'LOKI', 'MAGNETO'], difficulty: 'green' },
      { theme: 'Things that can be broken', words: ['HEART', 'SILENCE', 'ICE', 'PROMISE'], difficulty: 'blue' },
      { theme: 'Famous Jacks', words: ['SPARROW', 'NICHOLSON', 'BLACK', 'KNIFE'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-015',
    categories: [
      { theme: 'Desserts', words: ['CAKE', 'PIE', 'COOKIE', 'BROWNIE'], difficulty: 'yellow' },
      { theme: 'Music genres', words: ['ROCK', 'JAZZ', 'BLUES', 'COUNTRY'], difficulty: 'green' },
      { theme: 'Things that are blind', words: ['DATE', 'SPOT', 'FAITH', 'SIDE'], difficulty: 'blue' },
      { theme: 'Words after "COLD"', words: ['WAR', 'SHOULDER', 'FEET', 'TURKEY'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-016',
    categories: [
      { theme: 'Ocean creatures', words: ['SHARK', 'WHALE', 'DOLPHIN', 'OCTOPUS'], difficulty: 'yellow' },
      { theme: 'Beatles members', words: ['JOHN', 'PAUL', 'GEORGE', 'RINGO'], difficulty: 'green' },
      { theme: 'Things you can draw', words: ['PICTURE', 'BATH', 'ATTENTION', 'CONCLUSION'], difficulty: 'blue' },
      { theme: '___ Code', words: ['ZIP', 'DRESS', 'MORSE', 'CHEAT'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-017',
    categories: [
      { theme: 'School subjects', words: ['MATH', 'SCIENCE', 'HISTORY', 'ENGLISH'], difficulty: 'yellow' },
      { theme: 'Star Wars characters', words: ['LUKE', 'LEIA', 'YODA', 'VADER'], difficulty: 'green' },
      { theme: 'Things with hands', words: ['CLOCK', 'POKER', 'SECOND', 'FARM'], difficulty: 'blue' },
      { theme: 'Famous Bills', words: ['GATES', 'MURRAY', 'CLINTON', 'NYE'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-018',
    categories: [
      { theme: 'Fast food chains', words: ['MCDONALDS', 'WENDYS', 'SUBWAY', 'CHIPOTLE'], difficulty: 'yellow' },
      { theme: 'Months', words: ['MARCH', 'MAY', 'JUNE', 'AUGUST'], difficulty: 'green' },
      { theme: 'Things you can throw', words: ['PARTY', 'SHADE', 'TOWEL', 'PUNCH'], difficulty: 'blue' },
      { theme: 'Words before "BERRY"', words: ['STRAW', 'BLUE', 'BLACK', 'RASP'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-019',
    categories: [
      { theme: 'Tools', words: ['HAMMER', 'SCREWDRIVER', 'WRENCH', 'PLIERS'], difficulty: 'yellow' },
      { theme: 'Planets', words: ['MARS', 'VENUS', 'SATURN', 'JUPITER'], difficulty: 'green' },
      { theme: 'Things that can be heavy', words: ['METAL', 'BREATHING', 'HANDED', 'CREAM'], difficulty: 'blue' },
      { theme: 'Famous Toms', words: ['HANKS', 'CRUISE', 'HOLLAND', 'PETTY'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-020',
    categories: [
      { theme: 'Dairy products', words: ['MILK', 'CHEESE', 'BUTTER', 'YOGURT'], difficulty: 'yellow' },
      { theme: 'Board games', words: ['MONOPOLY', 'SCRABBLE', 'CLUE', 'RISK'], difficulty: 'green' },
      { theme: 'Things that are sweet', words: ['DREAMS', 'SIXTEEN', 'TOOTH', 'TALK'], difficulty: 'blue' },
      { theme: '___ Man', words: ['IRON', 'SPIDER', 'ANT', 'BAT'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-021',
    categories: [
      { theme: 'Birds', words: ['EAGLE', 'HAWK', 'OWL', 'CROW'], difficulty: 'yellow' },
      { theme: 'Programming languages', words: ['PYTHON', 'JAVA', 'RUBY', 'SWIFT'], difficulty: 'green' },
      { theme: 'Things that are running', words: ['WATER', 'NOSE', 'JOKE', 'START'], difficulty: 'blue' },
      { theme: 'Words before "BOOK"', words: ['FACE', 'NOTE', 'TEXT', 'YEAR'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-022',
    categories: [
      { theme: 'Kitchen appliances', words: ['BLENDER', 'TOASTER', 'MICROWAVE', 'OVEN'], difficulty: 'yellow' },
      { theme: 'Game of Thrones houses', words: ['STARK', 'LANNISTER', 'TARGARYEN', 'BARATHEON'], difficulty: 'green' },
      { theme: 'Things you can crack', words: ['JOKE', 'SAFE', 'DAWN', 'WHIP'], difficulty: 'blue' },
      { theme: 'Famous Johns', words: ['LENNON', 'WAYNE', 'WICK', 'LEGEND'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-023',
    categories: [
      { theme: 'Flowers', words: ['ROSE', 'TULIP', 'DAISY', 'LILY'], difficulty: 'yellow' },
      { theme: 'US states', words: ['TEXAS', 'FLORIDA', 'ALASKA', 'HAWAII'], difficulty: 'green' },
      { theme: 'Things that bloom', words: ['FLOWER', 'YOUTH', 'ROMANCE', 'ALGAE'], difficulty: 'blue' },
      { theme: 'Words after "FIRE"', words: ['FLY', 'WORKS', 'PLACE', 'CRACKER'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-024',
    categories: [
      { theme: 'Vegetables', words: ['POTATO', 'TOMATO', 'CUCUMBER', 'PEPPER'], difficulty: 'yellow' },
      { theme: 'Shakespeare plays', words: ['HAMLET', 'MACBETH', 'OTHELLO', 'TEMPEST'], difficulty: 'green' },
      { theme: 'Things that are full', words: ['MOON', 'HOUSE', 'THROTTLE', 'MONTE'], difficulty: 'blue' },
      { theme: 'Last word of Bond films', words: ['ROYALE', 'SOLACE', 'SKYFALL', 'SPECTRE'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-025',
    categories: [
      { theme: 'Nuts', words: ['ALMOND', 'CASHEW', 'WALNUT', 'PEANUT'], difficulty: 'yellow' },
      { theme: 'Avengers', words: ['THOR', 'HULK', 'HAWKEYE', 'WIDOW'], difficulty: 'green' },
      { theme: 'Things with teeth', words: ['SAW', 'COMB', 'GEAR', 'ZIPPER'], difficulty: 'blue' },
      { theme: 'Famous Jennifers', words: ['ANISTON', 'LAWRENCE', 'LOPEZ', 'GARNER'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-026',
    categories: [
      { theme: 'Furniture', words: ['TABLE', 'CHAIR', 'COUCH', 'DESK'], difficulty: 'yellow' },
      { theme: 'Simpsons characters', words: ['HOMER', 'MARGE', 'BART', 'LISA'], difficulty: 'green' },
      { theme: 'Things you can hit', words: ['ROAD', 'JACKPOT', 'BOTTOM', 'SNOOZE'], difficulty: 'blue' },
      { theme: 'Words before "LINE"', words: ['FINISH', 'DEAD', 'PUNCH', 'BOTTOM'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-027',
    categories: [
      { theme: 'Spices', words: ['PEPPER', 'CINNAMON', 'GINGER', 'OREGANO'], difficulty: 'yellow' },
      { theme: 'Friends characters', words: ['ROSS', 'RACHEL', 'MONICA', 'CHANDLER'], difficulty: 'green' },
      { theme: 'Things that can be rough', words: ['DIAMOND', 'DRAFT', 'PATCH', 'HOUSING'], difficulty: 'blue' },
      { theme: 'Famous Davids', words: ['BOWIE', 'LETTERMAN', 'BECKHAM', 'COPPERFIELD'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-028',
    categories: [
      { theme: 'Beverages', words: ['COFFEE', 'TEA', 'JUICE', 'SODA'], difficulty: 'yellow' },
      { theme: 'X-Men', words: ['STORM', 'CYCLOPS', 'WOLVERINE', 'ROGUE'], difficulty: 'green' },
      { theme: 'Things that are wild', words: ['CARD', 'GOOSE', 'WEST', 'GUESS'], difficulty: 'blue' },
      { theme: 'Words before "LIGHT"', words: ['FLASH', 'LIME', 'HIGH', 'SPOT'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-029',
    categories: [
      { theme: 'Trees', words: ['OAK', 'MAPLE', 'PINE', 'BIRCH'], difficulty: 'yellow' },
      { theme: 'Office characters', words: ['MICHAEL', 'DWIGHT', 'JIM', 'PAM'], difficulty: 'green' },
      { theme: 'Things that are green', words: ['THUMB', 'LIGHT', 'ROOM', 'CARD'], difficulty: 'blue' },
      { theme: 'Famous Roberts', words: ['DOWNEY', 'DENIRO', 'REDFORD', 'PATTINSON'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-030',
    categories: [
      { theme: 'Clothing', words: ['SHIRT', 'PANTS', 'JACKET', 'DRESS'], difficulty: 'yellow' },
      { theme: 'Seinfeld characters', words: ['JERRY', 'GEORGE', 'ELAINE', 'KRAMER'], difficulty: 'green' },
      { theme: 'Things with caps', words: ['BOTTLE', 'KNEE', 'MUSHROOM', 'GRADUATION'], difficulty: 'blue' },
      { theme: '___ Party', words: ['BLOCK', 'SEARCH', 'GARDEN', 'SLUMBER'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-031',
    categories: [
      { theme: 'Metals', words: ['GOLD', 'SILVER', 'COPPER', 'IRON'], difficulty: 'yellow' },
      { theme: 'Batman villains', words: ['JOKER', 'PENGUIN', 'RIDDLER', 'CATWOMAN'], difficulty: 'green' },
      { theme: 'Things with rings', words: ['TREE', 'CIRCUS', 'PHONE', 'BOXING'], difficulty: 'blue' },
      { theme: 'Words before "DAY"', words: ['BIRTH', 'HOLI', 'WEDNES', 'HUMP'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-032',
    categories: [
      { theme: 'Insects', words: ['BEE', 'ANT', 'FLY', 'BEETLE'], difficulty: 'yellow' },
      { theme: 'Stranger Things cast', words: ['ELEVEN', 'DUSTIN', 'MIKE', 'LUCAS'], difficulty: 'green' },
      { theme: 'Things that can be sealed', words: ['DEAL', 'FATE', 'ENVELOPE', 'LIP'], difficulty: 'blue' },
      { theme: 'Famous Steves', words: ['JOBS', 'WONDER', 'HARVEY', 'CARELL'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-033',
    categories: [
      { theme: 'Seafood', words: ['SHRIMP', 'LOBSTER', 'CRAB', 'SALMON'], difficulty: 'yellow' },
      { theme: 'Pixar films', words: ['COCO', 'WALL-E', 'UP', 'BRAVE'], difficulty: 'green' },
      { theme: 'Things you can lose', words: ['MIND', 'TOUCH', 'SLEEP', 'FACE'], difficulty: 'blue' },
      { theme: 'Words before "FISH"', words: ['GOLD', 'CAT', 'JELLY', 'STAR'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-034',
    categories: [
      { theme: 'Bread types', words: ['SOURDOUGH', 'BAGUETTE', 'CROISSANT', 'BRIOCHE'], difficulty: 'yellow' },
      { theme: 'Lord of the Rings', words: ['FRODO', 'GANDALF', 'ARAGORN', 'LEGOLAS'], difficulty: 'green' },
      { theme: 'Things that can be clear', words: ['COAST', 'AIR', 'CONSCIENCE', 'CUT'], difficulty: 'blue' },
      { theme: 'Famous Chrises', words: ['HEMSWORTH', 'EVANS', 'PRATT', 'PINE'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-035',
    categories: [
      { theme: 'Cheeses', words: ['CHEDDAR', 'BRIE', 'GOUDA', 'FETA'], difficulty: 'yellow' },
      { theme: 'FRIENDS episodes', words: ['PILOT', 'FINALE', 'THANKSGIVING', 'WEDDING'], difficulty: 'green' },
      { theme: 'Things with points', words: ['POWER', 'BULLET', 'TALKING', 'COMPASS'], difficulty: 'blue' },
      { theme: 'Words after "BLACK"', words: ['JACK', 'BIRD', 'BERRY', 'SMITH'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-036',
    categories: [
      { theme: 'Snacks', words: ['CHIPS', 'POPCORN', 'PRETZEL', 'CRACKERS'], difficulty: 'yellow' },
      { theme: 'The Office (UK/US)', words: ['DAVID', 'MICHAEL', 'GARETH', 'DWIGHT'], difficulty: 'green' },
      { theme: 'Things that tick', words: ['CLOCK', 'BOMB', 'BOX', 'OFF'], difficulty: 'blue' },
      { theme: 'Famous Matts', words: ['DAMON', 'LEBLANC', 'PERRY', 'SMITH'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-037',
    categories: [
      { theme: 'Candies', words: ['SKITTLES', 'SNICKERS', 'TWIX', 'KITKAT'], difficulty: 'yellow' },
      { theme: 'Disney ducks', words: ['DONALD', 'DAISY', 'HUEY', 'SCROOGE'], difficulty: 'green' },
      { theme: 'Things that can be flat', words: ['TIRE', 'EARTH', 'RATE', 'FOOT'], difficulty: 'blue' },
      { theme: 'Words before "WORK"', words: ['FRAME', 'NET', 'FIRE', 'CLOCK'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-038',
    categories: [
      { theme: 'Soups', words: ['CHICKEN', 'TOMATO', 'MINESTRONE', 'CHOWDER'], difficulty: 'yellow' },
      { theme: 'Parks and Rec', words: ['LESLIE', 'RON', 'APRIL', 'ANDY'], difficulty: 'green' },
      { theme: 'Things that sparkle', words: ['DIAMOND', 'WATER', 'EYES', 'WINE'], difficulty: 'blue' },
      { theme: 'Famous Annas', words: ['KENDRICK', 'WINTOUR', 'KARENINA', 'FARIS'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-039',
    categories: [
      { theme: 'Sauces', words: ['KETCHUP', 'MUSTARD', 'MAYO', 'BBQ'], difficulty: 'yellow' },
      { theme: 'Breaking Bad', words: ['WALTER', 'JESSE', 'HANK', 'SKYLER'], difficulty: 'green' },
      { theme: 'Things that flow', words: ['RIVER', 'TRAFFIC', 'CASH', 'LAVA'], difficulty: 'blue' },
      { theme: 'Words before "BAND"', words: ['RUBBER', 'ROCK', 'HEAD', 'BROAD'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-040',
    categories: [
      { theme: 'Salads', words: ['CAESAR', 'GREEK', 'COBB', 'GARDEN'], difficulty: 'yellow' },
      { theme: 'How I Met Your Mother', words: ['TED', 'BARNEY', 'MARSHALL', 'LILY'], difficulty: 'green' },
      { theme: 'Things with shells', words: ['TURTLE', 'EGG', 'NUT', 'TACO'], difficulty: 'blue' },
      { theme: 'Famous Kates', words: ['MIDDLETON', 'WINSLET', 'HUDSON', 'BLANCHETT'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-041',
    categories: [
      { theme: 'Sandwiches', words: ['BLT', 'CLUB', 'REUBEN', 'PHILLY'], difficulty: 'yellow' },
      { theme: 'Brooklyn 99', words: ['JAKE', 'AMY', 'HOLT', 'ROSA'], difficulty: 'green' },
      { theme: 'Things that spread', words: ['BUTTER', 'RUMOR', 'FIRE', 'LEGS'], difficulty: 'blue' },
      { theme: 'Words after "DARK"', words: ['KNIGHT', 'HORSE', 'SIDE', 'WEB'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-042',
    categories: [
      { theme: 'Pizza styles', words: ['NEAPOLITAN', 'CHICAGO', 'DETROIT', 'SICILIAN'], difficulty: 'yellow' },
      { theme: 'Schitts Creek', words: ['DAVID', 'MOIRA', 'JOHNNY', 'ALEXIS'], difficulty: 'green' },
      { theme: 'Things that can be deep', words: ['SEA', 'STATE', 'POCKETS', 'FRIED'], difficulty: 'blue' },
      { theme: 'Famous Julias', words: ['ROBERTS', 'CHILD', 'STILES', 'FOX'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-043',
    categories: [
      { theme: 'Sushi', words: ['SALMON', 'TUNA', 'EEL', 'SHRIMP'], difficulty: 'yellow' },
      { theme: 'New Girl', words: ['JESS', 'NICK', 'SCHMIDT', 'WINSTON'], difficulty: 'green' },
      { theme: 'Things that bounce', words: ['BALL', 'CHECK', 'IDEA', 'LIGHT'], difficulty: 'blue' },
      { theme: 'Words before "HOUSE"', words: ['GLASS', 'TREE', 'DOG', 'BIRD'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-044',
    categories: [
      { theme: 'Wines', words: ['MERLOT', 'PINOT', 'CABERNET', 'RIESLING'], difficulty: 'yellow' },
      { theme: 'Arrested Development', words: ['MICHAEL', 'LINDSAY', 'GOB', 'BUSTER'], difficulty: 'green' },
      { theme: 'Things that are dry', words: ['HUMOR', 'SPELL', 'RUN', 'CLEANED'], difficulty: 'blue' },
      { theme: 'Famous Emmas', words: ['STONE', 'WATSON', 'THOMPSON', 'ROBERTS'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-045',
    categories: [
      { theme: 'Cocktails', words: ['MARTINI', 'MOJITO', 'MARGARITA', 'COSMO'], difficulty: 'yellow' },
      { theme: 'Community', words: ['JEFF', 'BRITTA', 'ABED', 'TROY'], difficulty: 'green' },
      { theme: 'Things with roots', words: ['TREE', 'HAIR', 'GRASS', 'SQUARE'], difficulty: 'blue' },
      { theme: 'Words before "BACK"', words: ['QUARTER', 'FLASH', 'PAPER', 'THROW'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-046',
    categories: [
      { theme: 'Beers', words: ['LAGER', 'PILSNER', 'STOUT', 'ALE'], difficulty: 'yellow' },
      { theme: '30 Rock', words: ['LIZ', 'JACK', 'TRACY', 'JENNA'], difficulty: 'green' },
      { theme: 'Things that can be tight', words: ['BUDGET', 'ROPE', 'SHIP', 'LIPS'], difficulty: 'blue' },
      { theme: 'Famous Daniels', words: ['RADCLIFFE', 'CRAIG', 'KALUUYA', 'DAY-LEWIS'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-047',
    categories: [
      { theme: 'Smoothies', words: ['BANANA', 'BERRY', 'MANGO', 'GREEN'], difficulty: 'yellow' },
      { theme: 'Ted Lasso', words: ['TED', 'REBECCA', 'ROY', 'KEELEY'], difficulty: 'green' },
      { theme: 'Things with waves', words: ['OCEAN', 'HAIR', 'HEAT', 'RADIO'], difficulty: 'blue' },
      { theme: 'Words before "OUT"', words: ['BLACK', 'FREAK', 'BURN', 'WORK'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-048',
    categories: [
      { theme: 'Teas', words: ['GREEN', 'BLACK', 'CHAI', 'OOLONG'], difficulty: 'yellow' },
      { theme: 'Succession', words: ['KENDALL', 'SHIV', 'ROMAN', 'CONNOR'], difficulty: 'green' },
      { theme: 'Things that are tight', words: ['SPOT', 'KNIT', 'SCHEDULE', 'WAD'], difficulty: 'blue' },
      { theme: 'Famous Jessicas', words: ['CHASTAIN', 'ALBA', 'LANGE', 'BIEL'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-049',
    categories: [
      { theme: 'Juices', words: ['ORANGE', 'APPLE', 'GRAPE', 'CRANBERRY'], difficulty: 'yellow' },
      { theme: 'White Lotus', words: ['TANYA', 'JENNIFER', 'HARPER', 'DAPHNE'], difficulty: 'green' },
      { theme: 'Things that can be sticky', words: ['SITUATION', 'NOTE', 'FINGERS', 'WICKET'], difficulty: 'blue' },
      { theme: 'Words after "HONEY"', words: ['MOON', 'BEE', 'DEW', 'COMB'], difficulty: 'purple' },
    ],
  },
  {
    id: 'puzzle-050',
    categories: [
      { theme: 'Waters', words: ['SPARKLING', 'STILL', 'MINERAL', 'TAP'], difficulty: 'yellow' },
      { theme: 'Severance', words: ['MARK', 'HELLY', 'IRVING', 'DYLAN'], difficulty: 'green' },
      { theme: 'Things that can be bitter', words: ['TASTE', 'END', 'SWEET', 'PILL'], difficulty: 'blue' },
      { theme: 'Famous Ryans', words: ['GOSLING', 'REYNOLDS', 'SEACREST', 'PHILLIPPE'], difficulty: 'purple' },
    ],
  },
];
