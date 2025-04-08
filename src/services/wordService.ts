import { toast } from "@/components/ui/use-toast";
import { sightWordsByGrade } from "./sightWordsByGrade";
import { readingPassages, additionalReadingPassages } from "./readingPassages";

// Local storage key for custom sight words
const CUSTOM_SIGHT_WORDS_KEY = 'wordWizard_customSightWords';

// Function to get custom sight words from local storage
export const getCustomSightWords = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const storedWords = localStorage.getItem(CUSTOM_SIGHT_WORDS_KEY);
    return storedWords ? JSON.parse(storedWords) : [];
  } catch (error) {
    console.error('Error getting custom sight words from local storage:', error);
    return [];
  }
};

// Function to add a custom sight word to local storage
export const addCustomSightWord = (word: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const currentWords = getCustomSightWords();
    
    // Check if word already exists
    if (currentWords.includes(word)) {
      toast({
        title: "Word already exists",
        description: `"${word}" is already in your sight words.`,
        variant: "destructive"
      });
      return;
    }
    
    // Add new word
    const updatedWords = [...currentWords, word];
    localStorage.setItem(CUSTOM_SIGHT_WORDS_KEY, JSON.stringify(updatedWords));
  } catch (error) {
    console.error('Error adding custom sight word to local storage:', error);
    toast({
      title: "Error",
      description: "Could not save the word. Please try again.",
      variant: "destructive"
    });
  }
};

// Function to get all sight words (built-in + custom)
export const getSightWords = (
  gradeLevel?: keyof typeof sightWordsByGrade
): string[] => {
  const baseWords = gradeLevel
    ? sightWordsByGrade[gradeLevel] || []
    : Object.values(sightWordsByGrade).flat();
  return [...baseWords, ...getCustomSightWords()];
};


// Generate an array of random words for the flashcards from our sight words array
export const getRandomWords = (
  count: number = 10,
  gradeLevel?: keyof typeof sightWordsByGrade
) => {
  const allWords = getSightWords(gradeLevel);
  const shuffled = [...allWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};


// Word search game words by category
export const wordSearchCategories = {
  animals: ["cat", "dog", "bird", "fish", "bear", "lion", "tiger", "elephant", "monkey", "zebra"],
  colors: ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black", "white"],
  food: ["apple", "banana", "pizza", "milk", "water", "bread", "cheese", "cookie", "cake", "egg"],
  body: ["hand", "foot", "head", "eye", "ear", "nose", "mouth", "arm", "leg", "hair"],
  clothes: ["shirt", "pants", "shoes", "hat", "coat", "dress", "sock", "glove", "scarf", "belt"],
  school: ["book", "pen", "desk", "chair", "teacher", "student", "class", "pencil", "paper", "ruler"]
};



// Function to split words into syllables (simplified approach)
export const splitIntoSyllables = (word: string): string[] => {
  // This is a simplified syllable splitting algorithm
  // A more accurate implementation would use pronunciation dictionaries or ML models
  
  // Convert to lowercase
  word = word.toLowerCase();
  
  // Define vowels
  const vowels = ["a", "e", "i", "o", "u", "y"];
  
  // If word is short, don't split
  if (word.length <= 3) {
    return [word];
  }
  
  const syllables: string[] = [];
  let currentSyllable = "";
  let vowelFound = false;
  
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    currentSyllable += char;
    
    // Check if current character is a vowel
    if (vowels.includes(char)) {
      vowelFound = true;
    }
    
    // If we've found a vowel and the next character is a consonant, or it's the end of the word
    if (vowelFound && i < word.length - 1) {
      const nextChar = word[i + 1];
      if (!vowels.includes(nextChar)) {
        // If the next char is a consonant and we're not at the end of the word
        if (i < word.length - 2) {
          syllables.push(currentSyllable);
          currentSyllable = "";
          vowelFound = false;
        }
      }
    }
  }
  
  // Add the last syllable
  if (currentSyllable) {
    syllables.push(currentSyllable);
  }
  
  // If we couldn't split it properly, just return the original word
  if (syllables.length === 0) {
    return [word];
  }
  
  return syllables;
};

// Function to get pronunciation rules for a word
export const getPronunciationRules = (word: string): string[] => {
  const rules: string[] = [];
  word = word.toLowerCase();
  
  // Silent E rule
  if (word.length > 2 && word.endsWith('e') && 
      !['a', 'e', 'i', 'o', 'u'].includes(word[word.length - 2])) {
    rules.push("Silent E: The 'e' at the end makes the vowel before it say its name.");
  }
  
  // Two vowels together rule
  for (let i = 0; i < word.length - 1; i++) {
    if (['a', 'e', 'i', 'o', 'u'].includes(word[i]) && 
        ['a', 'e', 'i', 'o', 'u'].includes(word[i + 1])) {
      rules.push("When two vowels go walking, the first one does the talking.");
      break;
    }
  }
  
  // Check for common consonant blends
  const blends = ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 
                  'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'tr', 'tw', 'ch', 'sh', 'th', 'wh'];
  
  for (const blend of blends) {
    if (word.includes(blend)) {
      rules.push(`Consonant blend '${blend}': These letters blend together to make a special sound.`);
    }
  }
  
  // Check for common digraphs
  const digraphs = [
    {pattern: 'th', rule: "This makes either a soft sound like in 'thin' or a voiced sound like in 'the'."},
    {pattern: 'sh', rule: "This makes a 'sh' sound like in 'ship'."},
    {pattern: 'ch', rule: "This makes a 'ch' sound like in 'chip'."},
    {pattern: 'ph', rule: "This makes an 'f' sound like in 'phone'."},
    {pattern: 'wh', rule: "This often makes a 'w' sound like in 'what'."},
    {pattern: 'ck', rule: "This makes a 'k' sound like in 'back'."}
  ];
  
  for (const {pattern, rule} of digraphs) {
    if (word.includes(pattern)) {
      rules.push(`Digraph '${pattern}': ${rule}`);
    }
  }
  
  return rules;
};

// List of inappropriate words for child safety in the dictionary
const inappropriateWords = [
  "sexy", "porn", "cocaine", "heroin", "marijuana", 
  "rape", "ass", "boob", 
  "dick", "cock", "fuck", "shit", "damn", "bastard", 
  "cunt", "whore", "slut", "gay",  
  "beer", "wine", "vodka", "whiskey", "cigarette", 
  "tobacco", "vape", "gambling", "casino", "prostitute", "hooker"
];

// Function to check if a word is appropriate for children
const isAppropriateWord = (word: string): boolean => {
  const lowercaseWord = word.toLowerCase();
  return !inappropriateWords.some(badWord => lowercaseWord.includes(badWord));
};

// Function to fetch word definition from a dictionary API with child safety filter
export const fetchWordDefinition = async (word: string) => {
  try {
    // Check if the word is appropriate for children
    if (!isAppropriateWord(word)) {
      toast({
        title: "Word not available",
        description: "This word is not available in the children's dictionary.",
        variant: "destructive"
      });
      return null;
    }
    
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    
    if (!response.ok) {
      throw new Error('Word not found');
    }
    
    const data = await response.json();
    
    // Double check definitions and examples for inappropriate content
    const cleanedData = {
      ...data[0],
      meanings: data[0].meanings.map((meaning: any) => ({
        ...meaning,
        definitions: meaning.definitions.filter((def: any) => {
          // Check if definition or example contains inappropriate words
          const definitionText = def.definition || '';
          const exampleText = def.example || '';
          return isAppropriateWord(definitionText) && isAppropriateWord(exampleText);
        })
      })).filter((meaning: any) => meaning.definitions.length > 0) // Only keep meanings that have definitions
    };
    
    // If all definitions were filtered out, return null
    if (cleanedData.meanings.length === 0) {
      toast({
        title: "Word not available",
        description: "The dictionary entry for this word is not available in the children's dictionary.",
        variant: "destructive"
      });
      return null;
    }
    
    return cleanedData;
  } catch (error) {
    console.error("Error fetching word definition:", error);
    toast({
      title: "Error",
      description: "Could not find this word in the dictionary.",
      variant: "destructive"
    });
    return null;
  }
};

// Function to create a word search puzzle grid
export const generateWordSearch = (words: string[], size: number = 10) => {
  // Create empty grid
  const grid: string[][] = Array(size).fill('').map(() => Array(size).fill(''));
  const placedWords: {word: string, row: number, col: number, direction: string}[] = [];
  
  // Directions: horizontal, vertical, diagonal (for simplicity, just using horizontal and vertical for now)
  const directions = [
    {name: 'horizontal', rowChange: 0, colChange: 1},
    {name: 'vertical', rowChange: 1, colChange: 0},
  ];
  
  // Try to place each word
  for (const word of words) {
    if (word.length > size) continue; // Skip words that are too long
    
    let placed = false;
    let attempts = 0;
    const maxAttempts = 50;
    
    while (!placed && attempts < maxAttempts) {
      attempts++;
      
      // Choose random direction
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      // Choose random starting position
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      
      // Check if word fits
      if (direction.name === 'horizontal' && col + word.length > size) continue;
      if (direction.name === 'vertical' && row + word.length > size) continue;
      
      // Check if word can be placed without conflicts
      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + i * direction.rowChange;
        const c = col + i * direction.colChange;
        
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
          canPlace = false;
          break;
        }
      }
      
      // Place the word
      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const r = row + i * direction.rowChange;
          const c = col + i * direction.colChange;
          grid[r][c] = word[i];
        }
        
        placed = true;
        placedWords.push({
          word,
          row,
          col,
          direction: direction.name
        });
      }
    }
  }
  
  // Fill empty spaces with random letters
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
  
  return { grid, placedWords };
};

// Function to get phonics rules for a word
export const getPhonicsRules = (word: string): string[] => {
  const rules: string[] = [];
  
  // Common vowel patterns
  const vowelPatterns = [
    { pattern: /[aeiou][aeiou]/, rule: "When two vowels go walking, the first one does the talking." },
    { pattern: /[^aeiou]e$/, rule: "Silent E makes the vowel say its name." },
    { pattern: /[aeiou][^aeiou][^aeiou]/, rule: "Closed syllable: vowel makes a short sound." },
    { pattern: /[^aeiou][l|r]/, rule: "R-controlled or L-controlled vowels have special sounds." },
  ];
  
  for (const { pattern, rule } of vowelPatterns) {
    if (pattern.test(word)) {
      rules.push(rule);
    }
  }
  
  // Word endings
  if (word.endsWith('ing')) {
    rules.push("'-ing' ending: action is happening now.");
  }
  
  if (word.endsWith('ed')) {
    rules.push("'-ed' ending: action happened in the past.");
  }
  
  return rules;
};

// Function to generate a crossword puzzle
export const generateCrossword = (
  words: string[], 
  clues: {[key: string]: string}
) => {
  // Sort words by length (longest first)
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
  // Initialize an empty grid (15x15)
  const size = 15;
  const grid: string[][] = Array(size).fill('').map(() => Array(size).fill(' '));
  const placedWords: Array<{word: string; row: number; col: number; direction: string; clue: string}> = [];
  
  // Try to place each word
  for (const word of sortedWords) {
    let placed = false;
    
    // First try to place horizontally
    if (!placed) {
      placed = tryPlaceHorizontal(word, grid, placedWords, clues);
    }
    
    // Then try vertically
    if (!placed) {
      placed = tryPlaceVertical(word, grid, placedWords, clues);
    }
    
    // If still not placed, try to place it without intersections
    if (!placed) {
      // Try center row
      const centerRow = Math.floor(size / 2);
      for (let col = 0; col <= size - word.length; col++) {
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[centerRow][col + i] !== ' ') {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[centerRow][col + i] = word[i].toUpperCase();
          }
          
          placedWords.push({
            word,
            row: centerRow,
            col,
            direction: 'horizontal',
            clue: clues[word] || `Clue for ${word}`
          });
          
          placed = true;
          break;
        }
      }
    }
    
    if (!placed) {
      // Try center column
      const centerCol = Math.floor(size / 2);
      for (let row = 0; row <= size - word.length; row++) {
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][centerCol] !== ' ') {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[row + i][centerCol] = word[i].toUpperCase();
          }
          
          placedWords.push({
            word,
            row,
            col: centerCol,
            direction: 'vertical',
            clue: clues[word] || `Clue for ${word}`
          });
          
          placed = true;
          break;
        }
      }
    }
  }
  
  return { grid, words: placedWords };
};

// Helper function to try placing a word horizontally
const tryPlaceHorizontal = (
  word: string, 
  grid: string[][], 
  placedWords: Array<{word: string; row: number; col: number; direction: string; clue: string}>,
  clues: {[key: string]: string}
) => {
  const size = grid.length;
  
  // First try to find intersections with existing words
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Try to place the word starting at this position
      if (col + word.length > size) continue;
      
      let intersection = false;
      let canPlace = true;
      
      for (let i = 0; i < word.length; i++) {
        const current = grid[row][col + i];
        
        // Check if there's an intersection
        if (current !== ' ' && current !== word[i].toUpperCase()) {
          canPlace = false;
          break;
        }
        
        if (current === word[i].toUpperCase()) {
          intersection = true;
        }
        
        // Check if there are words above or below that would block placement
        if (current === ' ') {
          // Check above
          if (row > 0 && grid[row - 1][col + i] !== ' ') {
            canPlace = false;
            break;
          }
          
          // Check below
          if (row < size - 1 && grid[row + 1][col + i] !== ' ') {
            canPlace = false;
            break;
          }
        }
        
        // Check adjacent cells at the start and end of the word
        if (i === 0 && col > 0 && grid[row][col - 1] !== ' ') {
          canPlace = false;
          break;
        }
        
        if (i === word.length - 1 && col + i + 1 < size && grid[row][col + i + 1] !== ' ') {
          canPlace = false;
          break;
        }
      }
      
      // Only place the word if there's an intersection with an existing word
      // or if it's the first word
      if (canPlace && (intersection || placedWords.length === 0)) {
        for (let i = 0; i < word.length; i++) {
          grid[row][col + i] = word[i].toUpperCase();
        }
        
        placedWords.push({
          word,
          row,
          col,
          direction: 'horizontal',
          clue: clues[word] || `Clue for ${word}`
        });
        
        return true;
      }
    }
  }
  
  return false;
};

// Helper function to try placing a word vertically
const tryPlaceVertical = (
  word: string, 
  grid: string[][], 
  placedWords: Array<{word: string; row: number; col: number; direction: string; clue: string}>,
  clues: {[key: string]: string}
) => {
  const size = grid.length;
  
  // First try to find intersections with existing words
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Try to place the word starting at this position
      if (row + word.length > size) continue;
      
      let intersection = false;
      let canPlace = true;
      
      for (let i = 0; i < word.length; i++) {
        const current = grid[row + i][col];
        
        // Check if there's an intersection
        if (current !== ' ' && current !== word[i].toUpperCase()) {
          canPlace = false;
          break;
        }
        
        if (current === word[i].toUpperCase()) {
          intersection = true;
        }
        
        // Check if there are words to the left or right that would block placement
        if (current === ' ') {
          // Check left
          if (col > 0 && grid[row + i][col - 1] !== ' ') {
            canPlace = false;
            break;
          }
          
          // Check right
          if (col < size - 1 && grid[row + i][col + 1] !== ' ') {
            canPlace = false;
            break;
          }
        }
        
        // Check adjacent cells at the start and end of the word
        if (i === 0 && row > 0 && grid[row - 1][col] !== ' ') {
          canPlace = false;
          break;
        }
        
        if (i === word.length - 1 && row + i + 1 < size && grid[row + i + 1][col] !== ' ') {
          canPlace = false;
          break;
        }
      }
      
      // Only place the word if there's an intersection with an existing word
      // or if it's the first word
      if (canPlace && (intersection || placedWords.length === 0)) {
        for (let i = 0; i < word.length; i++) {
          grid[row + i][col] = word[i].toUpperCase();
        }
        
        placedWords.push({
          word,
          row,
          col,
          direction: 'vertical',
          clue: clues[word] || `Clue for ${word}`
        });
        
        return true;
      }
    }
  }
  
  return false;
};

// Common English words dictionary - a comprehensive set for validating misspellings
const commonEnglishWords = new Set([
  // Basic everyday words
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", 
  "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", 
  "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
  
  // Common household objects and concepts
  "house", "home", "room", "door", "window", "bed", "chair", "table", "food", "water", "book", "car", "bus", "train",
  "day", "night", "sun", "moon", "star", "sky", "rain", "snow", "tree", "flower", "bird", "fish", "cat", "dog",
  
  // Common short words often confused
  "bead", "bed", "bad", "bid", "head", "heed", "had", "hid", "red", "reed", "read", "rid", "led", "lead", "lid",
  "set", "sat", "sit", "bet", "bat", "bit", "let", "lat", "lit", "met", "mat", "mitt", "net", "nat", "nit",
  "pen", "pan", "pin", "ten", "tan", "tin", "men", "man", "min", "den", "dan", "din",
  "punk", "pink", "pork", "fork", "ink", "link", "sink", "rink", "tank", "sank", "dank", "rank",
  "font", "hunt", "punt", "runt", "hint", "mint", "lint", "tint", "dent", "rent", "sent", "bent",
  "cook", "look", "book", "took", "hook", "rook", "back", "pack", "rack", "sack", "tack", "lack",
  "lock", "dock", "rock", "sock", "mock", "tick", "lick", "pick", "sick", "kick", "wick",
  "fair", "hair", "pair", "chair", "stair", "flair", "fear", "dear", "near", "clear", "year",
  "four", "pour", "roar", "soar", "boar", "door", "poor", "floor", "more", "sore", "tore", "wore",
  "cure", "pure", "sure", "lure", "fire", "hire", "tire", "wire", "dire", "mire", "sire",
  
  // Basic verbs and tenses
  "run", "runs", "running", "ran", "walk", "walks", "walking", "walked", "talk", "talks", "talking", "talked",
  "jump", "jumps", "jumping", "jumped", "play", "plays", "playing", "played", "say", "says", "saying", "said",
  "eat", "eats", "eating", "ate", "drink", "drinks", "drinking", "drank", "see", "sees", "seeing", "saw",
  "hear", "hears", "hearing", "heard", "feel", "feels", "feeling", "felt", "smell", "smells", "smelling", "smelled",
  
  // Words from our game categories
  ...wordSearchCategories.animals,
  ...wordSearchCategories.colors,
  ...wordSearchCategories.food,
  ...wordSearchCategories.body,
  ...wordSearchCategories.clothes,
  ...wordSearchCategories.school
]);

// Advanced word checking - fetches from an online dictionary API
async function isRealWord(word: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return response.ok; // If response is OK, the word exists
  } catch (error) {
    console.error("Error checking word:", error);
    return false; // On error, assume it's not a real word to be safe
  }
}

// Function to generate misspelled variants of words for the shooting game
export const generateMisspelledWords = (level: number) => {
  // Get a random word from our word categories
  const categories = Object.keys(wordSearchCategories) as Array<keyof typeof wordSearchCategories>;
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const words = wordSearchCategories[randomCategory];
  
  const word = words[Math.floor(Math.random() * words.length)];
  
  // Create a misspelled version that is guaranteed not to be a real word
  let misspelled = createNonWordMisspelling(word);
  
  // If somehow we still got a valid word (very rare), use the aggressive approach
  if (commonEnglishWords.has(misspelled)) {
    misspelled = createAggressiveMisspelling(word);
  }
  
  // Randomly decide which is correct (the original or the misspelled)
  const result = [
    { word, correct: true },
    { word: misspelled, correct: false }
  ];
  
  return result;
};

// Function to create a misspelled version that's guaranteed not to be a real word
const createNonWordMisspelling = (word: string): string => {
  // Create an initial misspelling
  let misspelled = createMisspelling(word, 1);
  let attempts = 0;
  const maxAttempts = 15;
  
  // Keep trying until we find a non-word misspelling
  while (commonEnglishWords.has(misspelled) && attempts < maxAttempts) {
    if (attempts < 5) {
      // First few attempts: try simple misspellings
      misspelled = createMisspelling(word, 1);
    } else if (attempts < 10) {
      // Next few attempts: try more complex misspellings
      misspelled = createMisspelling(word, 3);
    } else {
      // Last resort: combine multiple misspelling techniques
      misspelled = createAggressiveMisspelling(word);
    }
    attempts++;
  }
  
  // If we've exhausted our attempts and still have a valid word,
  // use a guaranteed approach by adding 'qq' to the word
  if (commonEnglishWords.has(misspelled)) {
    if (word.length > 3) {
      // Insert 'qq' in the middle of the word
      const middle = Math.floor(word.length / 2);
      misspelled = word.substring(0, middle) + 'qq' + word.substring(middle);
    } else {
      // For very short words, append 'qq'
      misspelled = word + 'qq';
    }
  }
  
  return misspelled;
};

// Function to create a misspelled version of a word (simpler approach)
const createMisspelling = (word: string, level: number) => {
  // Higher level = more sophisticated misspellings
  const letters = word.split('');
  
  // Common misspelling types
  const misspellingTypes = [
    // Swap two adjacent letters
    () => {
      if (word.length < 2) return word;
      const i = Math.floor(Math.random() * (word.length - 1));
      letters[i] = word[i + 1];
      letters[i + 1] = word[i];
      return letters.join('');
    },
    
    // Double a letter
    () => {
      if (word.length < 1) return word;
      const i = Math.floor(Math.random() * word.length);
      letters.splice(i, 0, word[i]);
      return letters.join('');
    },
    
    // Remove a letter
    () => {
      if (word.length < 2) return word;
      const i = Math.floor(Math.random() * word.length);
      letters.splice(i, 1);
      return letters.join('');
    },
    
    // Replace a vowel with another vowel
    () => {
      const vowels = ['a', 'e', 'i', 'o', 'u'];
      const vowelPositions = letters.map((l, i) => vowels.includes(l) ? i : -1).filter(i => i !== -1);
      
      if (vowelPositions.length === 0) return word;
      
      const pos = vowelPositions[Math.floor(Math.random() * vowelPositions.length)];
      const currentVowel = letters[pos];
      const newVowel = vowels.filter(v => v !== currentVowel)[Math.floor(Math.random() * (vowels.length - 1))];
      
      letters[pos] = newVowel;
      return letters.join('');
    }
  ];
  
  // Choose a random misspelling type
  const misspellingType = misspellingTypes[Math.floor(Math.random() * misspellingTypes.length)];
  
  // Apply the misspelling
  let misspelled = misspellingType();
  
  // Make sure it's actually different
  while (misspelled === word) {
    misspelled = misspellingTypes[Math.floor(Math.random() * misspellingTypes.length)]();
  }
  
  return misspelled;
};

// Function to create a more aggressive misspelling that is unlikely to be a real word
const createAggressiveMisspelling = (word: string): string => {
  // Split the word into letters
  const letters = word.split('');
  
  // Apply multiple misspelling techniques at once for a more drastic change
  
  // 1. Swap two adjacent letters
  if (word.length >= 3) {
    const i = Math.floor(Math.random() * (word.length - 1));
    const temp = letters[i];
    letters[i] = letters[i + 1];
    letters[i + 1] = temp;
  }
  
  // 2. Replace a letter with an uncommon character combination
  if (word.length >= 2) {
    const replacements: Record<string, string> = {
      'a': 'ah', 'e': 'eh', 'i': 'ih', 'o': 'oh', 'u': 'uh',
      't': 'tt', 's': 'ss', 'p': 'pp', 'r': 'rr', 'n': 'nn'
    };
    
    const randomPosition = Math.floor(Math.random() * word.length);
    const letter = word[randomPosition];
    
    if (replacements[letter]) {
      letters[randomPosition] = replacements[letter];
    } else if ('aeiou'.includes(letter)) {
      // For vowels without specific replacements
      letters[randomPosition] = 'q';
    } else {
      // For consonants without specific replacements
      letters[randomPosition] = 'x';
    }
  }
  
  // 3. Add a guaranteed non-English letter combination if the word is long enough
  if (word.length >= 4) {
    // Insert 'zx' at a random position (not the first or last letter)
    const insertPos = 1 + Math.floor(Math.random() * (word.length - 2));
    letters.splice(insertPos, 0, 'z', 'x');
  }
  
  return letters.join('');
};
