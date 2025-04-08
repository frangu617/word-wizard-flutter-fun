import { toast } from "@/components/ui/use-toast";

// Local storage key for custom sight words
const CUSTOM_SIGHT_WORDS_KEY = 'wordWizard_customSightWords';

// Sight words frequently used in early reading
export const sightWords = [
  "the", "of", "and", "a", "to", "in", "is", "you", "that", "it", 
  "he", "was", "for", "on", "are", "as", "with", "his", "they", "I",
  "at", "be", "this", "have", "from", "or", "one", "had", "by", "word",
  "but", "not", "what", "all", "were", "we", "when", "your", "can", "said",
  "there", "use", "an", "each", "which", "she", "do", "how", "their", "if",
  "will", "up", "other", "about", "out", "many", "then", "them", "these", "so",
  "some", "her", "would", "make", "like", "him", "into", "time", "has", "look",
  "two", "more", "write", "go", "see", "number", "no", "way", "could", "people"
];

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
export const getSightWords = (): string[] => {
  return [...sightWords, ...getCustomSightWords()];
};

// Generate an array of random words for the flashcards from our sight words array
export const getRandomWords = (count: number = 10) => {
  const allWords = getSightWords();
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

// Reading speed test passages for different levels
export const readingPassages = [
  {
    id: 1,
    level: "beginner",
    title: "The Cat",
    text: "The cat sat on the mat. It was a big, fat cat. The cat saw a rat. The rat ran fast. The cat ran after the rat. The rat hid in a hole. The cat could not get the rat. The cat went back to the mat and took a nap."
  },
  {
    id: 2,
    level: "intermediate",
    title: "The Little Garden",
    text: "Sam had a little garden. In his garden, he planted seeds. He watered them every day. Soon, green plants started to grow. Sam was very happy. He took good care of his plants. Some plants had flowers. Some plants had vegetables. Sam picked the vegetables and gave them to his mom. His mom made a tasty soup with the vegetables. Sam and his family enjoyed the soup for dinner."
  },
  {
    id: 3,
    level: "advanced",
    title: "The Missing Library Book",
    text: "Lucy loved to read books from the library. Every Saturday, she would visit the library with her dad. One day, Lucy couldn't find her library book. She looked under her bed. She looked in her backpack. She looked on the bookshelf. But the book was not there. Lucy was worried because the book was due today. Then she remembered. She had left the book in the car after reading it on the way home from school. Lucy ran to the car and found the book. She was relieved and promised herself to be more careful with library books in the future."
  }
];

// Additional reading passages for more variety
export const additionalReadingPassages = [
  // Beginner level passages
  {
    id: 4,
    level: "beginner",
    title: "My Pet Dog",
    text: "I have a pet dog. His name is Max. Max is big and brown. He likes to run and play. He likes to fetch the ball. I throw the ball, and Max runs to get it. Max is a good dog. He sits when I tell him to sit. He is my best friend."
  },
  {
    id: 5,
    level: "beginner",
    title: "At the Park",
    text: "I went to the park. The park was big and green. There were many trees. I saw kids on the swings. I went on the slide. It was fun! Then I played in the sand. I made a sand castle. The sun was hot. I had ice cream. Then I went home. I had a good day at the park."
  },
  {
    id: 6,
    level: "beginner",
    title: "The Big Red Bus",
    text: "The big red bus stops at my street. I get on the bus. The bus is full of people. Some people stand. Some people sit. The bus goes fast. It stops at the school. I get off the bus. I wave to the bus driver. The bus drives away."
  },
  {
    id: 7,
    level: "beginner",
    title: "My Birthday",
    text: "Today is my birthday. I am six years old. Mom made a cake. The cake is chocolate. It has blue icing. There are six candles on the cake. My friends came to my house. We played games. We ate cake and ice cream. I got many presents. It was a fun birthday."
  },
  {
    id: 8,
    level: "beginner",
    title: "Winter Day",
    text: "It is cold outside. Snow is falling. The snow is white and soft. I put on my coat. I put on my hat. I put on my gloves. I go outside to play. I make a snowman. The snowman has a carrot nose. I throw snowballs. My hands get cold. I go inside. Mom makes hot chocolate. It is warm and sweet."
  },
  
  // Intermediate level passages
  {
    id: 9,
    level: "intermediate",
    title: "The Brave Little Turtle",
    text: "Tim was a little turtle who lived in a pond. He was afraid to swim in the deep water. All the other turtles swam in the deep part of the pond. They had fun diving and playing. Tim stayed in the shallow water near the edge. One day, Tim's friend fell into a hole in the deep water. No one was close enough to help. Tim knew he had to be brave. He swam into the deep water. He was scared, but he kept swimming. He reached his friend and helped him out of the hole. After that day, Tim was not afraid of the deep water anymore. He learned that being brave means doing something even when you are scared."
  },
  {
    id: 10,
    level: "intermediate",
    title: "The Lost Kitten",
    text: "Emma found a small gray kitten in her backyard. The kitten was alone and meowing. It looked hungry and scared. Emma brought some milk in a small bowl. The kitten drank it quickly. Emma's mom said they should try to find the kitten's owner. They made posters with a picture of the kitten. They put the posters up around the neighborhood. A few days later, a woman called. She said the kitten belonged to her daughter. The kitten's name was Misty. Emma was sad to see Misty go, but she was happy that Misty found her family. The woman thanked Emma for taking good care of Misty. Emma's mom said they could visit the pet shelter to find a kitten that needed a home."
  },
  {
    id: 11,
    level: "intermediate",
    title: "The Science Project",
    text: "Jake and Maria were partners for the school science fair. They wanted to make a volcano that would erupt. First, they made the volcano shape using clay and paint. Then, they mixed baking soda, vinegar, and red food coloring for the eruption. On the day of the science fair, they set up their volcano on a table. Many students and parents came to see it. When it was time, Jake poured the vinegar into the volcano. It bubbled and erupted with red foam! Everyone clapped and cheered. The teacher was impressed with their project. Jake and Maria won second place in the science fair. They were proud of their work and happy that they had worked together."
  },
  {
    id: 12,
    level: "intermediate",
    title: "The Lost Key",
    text: "Ben couldn't find his house key. He looked in his backpack. He looked in his desk. He looked under his bed. The key wasn't anywhere. Ben tried to remember the last time he had the key. He remembered using it yesterday after school. He had put it in his jacket pocket. Ben ran to the closet and checked his jacket. The key wasn't there either. Then Ben remembered that he had worn his jacket to the park. Maybe the key fell out while he was playing. Ben and his dad went to the park to look for the key. They looked in the grass where Ben had played. They looked near the swings and slides. Finally, Ben saw something shiny near the bench. It was his key! Ben was relieved and promised to be more careful with his key in the future."
  },
  {
    id: 13,
    level: "intermediate",
    title: "The Camping Trip",
    text: "The Wilson family went camping in the mountains. They set up their tent near a small stream. Dad taught the children how to fish in the stream. Mom showed them how to identify different trees and plants. In the evening, they built a campfire. They roasted marshmallows and told stories around the fire. When it got dark, they could see many stars in the sky. Dad pointed out some constellations. The children had never seen so many stars before! They slept in sleeping bags inside the tent. In the morning, they heard birds singing. They saw a deer drinking from the stream. It was a wonderful camping trip, and the children couldn't wait to go camping again."
  },
  
  // Advanced level passages
  {
    id: 14,
    level: "advanced",
    title: "The Mystery of the Old Clock Tower",
    text: "The old clock tower stood in the center of the town square, its hands frozen at exactly 3:27 for as long as anyone could remember. Some people said the clock stopped working during a powerful storm fifty years ago. Others believed it was intentionally stopped to mark an important historical event. Most of the children in town thought the clock tower was haunted. Twelve-year-old Oliver was determined to solve the mystery of the old clock tower. He spent weeks researching at the town library, reading old newspapers, and interviewing elderly residents. He discovered that the clockmaker's son, who was responsible for maintaining the tower, had left town suddenly on March 27th, the same day the clock stopped. No one knew why he left or where he went. Oliver found an old journal that mentioned a secret compartment inside the clock tower. With permission from the mayor, Oliver explored the tower. Behind a loose brick, he found a dusty metal box containing a letter. The letter revealed that the clockmaker's son had received news of his father's illness in another town. He had to leave immediately and didn't have time to wind the clock or tell anyone. He had intended to return, but his father's condition worsened, and he stayed to take care of him. The letter included instructions on how to restart the clock. The mayor was impressed with Oliver's detective work. The town held a ceremony to restart the clock, ending fifty years of mystery."
  },
  {
    id: 15,
    level: "advanced",
    title: "The Hidden Garden",
    text: "Maya's new house was on the edge of the forest. While exploring the overgrown backyard, she discovered an old stone path hidden under years of fallen leaves and moss. Curious, she followed the winding path into the forest. After walking for several minutes, Maya came to a tall hedge with a small wooden gate. The gate was locked, but Maya found a rusty key hanging from a nearby tree branch. The key turned with difficulty in the lock, and the gate creaked open. Maya gasped at what she saw. Inside was a beautiful garden with stone fountains, marble statues, and flower beds arranged in geometric patterns. Though neglected, the garden still held an air of magic and mystery. In the center stood a small stone cottage. Maya approached cautiously and knocked on the door. No one answered. Looking through the window, she could see that the cottage was abandoned, with furniture covered in white sheets. On a table near the window was a leather-bound book. Maya returned to the garden each day, slowly clearing weeds and pruning overgrown bushes. She read the book she found, which was a journal belonging to a botanist who had created the garden decades ago. The journal contained detailed notes about rare plants and their medicinal properties. Maya's parents were amazed when she showed them the hidden garden. They helped her restore it to its former glory. The mayor later declared it a historical site, and Maya became its official caretaker, using the botanist's notes to preserve the rare plants for future generations."
  },
  {
    id: 16,
    level: "advanced",
    title: "The Science Competition",
    text: "Jasmine had always been passionate about science, especially renewable energy. When her school announced the annual science competition, she knew exactly what her project would be: a small-scale solar power system that could charge multiple devices simultaneously. For weeks, Jasmine spent every free moment in the school's science lab, designing, building, and testing her invention. She faced numerous challenges. Her first prototype didn't generate enough power, and the second one short-circuited. But Jasmine persisted, learning from each failure. Her science teacher, Ms. Rodriguez, offered guidance and encouragement. The night before the competition, Jasmine made final adjustments to her solar charging station. She had added a digital display showing the amount of energy collected and used. She had also designed a rotating panel that could maximize sun exposure throughout the day. On the day of the competition, the gymnasium was filled with impressive projects. Some students had built robots, while others presented complex chemistry experiments. Jasmine felt nervous but proud of her work. The judges spent several minutes at her station, asking detailed questions about her design process and the practical applications of her invention. When the results were announced, Jasmine was awarded first place! The judges were impressed by the real-world application of her project and her thorough understanding of the scientific principles involved. As part of her prize, Jasmine was invited to present her project at the state science fair, where she hoped to inspire others to explore renewable energy solutions."
  },
  {
    id: 17,
    level: "advanced",
    title: "The Art of Friendship",
    text: "Miguel and Zoe had been best friends since kindergarten, despite their different interests. Miguel was passionate about painting and spent hours in the art room after school. Zoe was the star of the track team and dreamed of winning the state championship. They always supported each other's dreams, even when they didn't fully understand them. During their final year of middle school, both Miguel and Zoe faced important challenges. Miguel was preparing for his first art exhibition at a local gallery, while Zoe was training for the qualifying race for the state championship. As the date of Miguel's exhibition approached, he became increasingly anxious. He worried that his paintings weren't good enough and considered canceling the exhibition. Zoe noticed his distress and, despite her intensive training schedule, spent evenings at Miguel's house, offering encouragement and honest feedback on his work. The day before Zoe's qualifying race, she twisted her ankle during practice. The coach said she could still compete, but she would need to rest completely until the race. This meant missing Miguel's exhibition, which was scheduled for the same evening. Zoe was devastated, knowing how important the night was for her friend. Miguel visited Zoe after learning about her injury. Instead of showing disappointment, he brought his newest painting to show her. It was a portrait of Zoe running on the track, her face showing determination and joy. Miguel explained that this painting was the centerpiece of his exhibition, his tribute to their friendship and her dedication. On the day of the race, Zoe ran with a bandaged ankle and qualified for the state championship by a fraction of a second. She later learned that Miguel had postponed his exhibition by one week so he could attend her race. At the exhibition, Miguel's paintings received high praise, especially the portrait of Zoe. A local newspaper published a story about the young artist and his inspiring friendship with the athlete. Miguel and Zoe realized that their greatest achievement wasn't the exhibition or the race, but the strength of their friendship."
  },
  {
    id: 18,
    level: "advanced",
    title: "Journey to the Mountain Peak",
    text: "The mountain had always been visible from Emma's bedroom window, its snow-capped peak gleaming in the distance. For her sixteenth birthday, Emma's parents finally agreed to let her join the local hiking club's annual expedition to the summit. The journey would take three days, requiring careful preparation and physical stamina. Emma trained for months, increasing her endurance and learning essential wilderness skills. The expedition team consisted of twelve hikers, including Emma, and two experienced guides. They began their ascent early on a clear summer morning. The first day's hike took them through dense forest and meadows filled with wildflowers. Emma was enchanted by the changing landscape and the increasingly spectacular views. That night, they camped on a plateau, sharing stories around a small campfire as stars appeared in the darkening sky. The second day brought greater challenges. The path became steeper and narrower, requiring careful navigation across rocky terrain. A sudden afternoon rainstorm forced the group to seek shelter in a cave until the worst had passed. Some team members suggested turning back, concerned about the weather conditions. The guides monitored the situation carefully, eventually deciding it was safe to continue. Emma felt a mix of exhaustion and exhilaration as they established their second camp at a higher altitude, where the air was noticeably thinner. On the third day, they began the final push to the summit before dawn. Emma struggled with the steep incline and the effects of the altitude, but she was determined to reach the top. The last stretch required them to use ropes and harnesses to navigate a particularly challenging section. When Emma finally reached the summit, the panoramic view took her breath away. Mountain ranges extended in all directions, valleys and lakes miniaturized by distance. The team celebrated their achievement, taking photographs and enjoying a brief rest before beginning their descent. During the journey home, Emma reflected on her experience. She had pushed beyond her perceived limits, faced her fears, and discovered a new confidence in her abilities. The mountain had taught her that with preparation, perseverance, and the support of others, she could accomplish what once seemed impossible. The view from her bedroom window would never look the same again."
  }
];

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
  "sex", "sexy", "nude", "naked", "porn", "drug", "cocaine", "heroin", "marijuana", "weed", 
  "kill", "murder", "dead", "death", "suicide", "rape", "ass", "butt", "boob", "breast", 
  "penis", "vagina", "dick", "cock", "fuck", "shit", "damn", "hell", "bitch", "bastard", 
  "cunt", "whore", "slut", "gay", "lesbian", "transgender", "nazi", "hitler", "terrorist", 
  "bomb", "gun", "weapon", "alcohol", "beer", "wine", "vodka", "whiskey", "cigarette", 
  "tobacco", "smoke", "vape", "gambling", "casino", "slave", "prostitute", "hooker"
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
