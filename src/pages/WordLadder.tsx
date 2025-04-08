
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import audioService from '@/services/audioService';
import { ArrowLeft, RefreshCcw, Lightbulb, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';

// Define word ladder puzzles
const wordLadderPuzzles = [
  { start: "cat", end: "dog", level: "easy" },
  { start: "hit", end: "pot", level: "easy" },
  { start: "red", end: "lap", level: "easy" },
  { start: "pin", end: "bat", level: "medium" },
  { start: "fish", end: "boat", level: "medium" },
  { start: "cold", end: "warm", level: "medium" },
  { start: "night", end: "sunny", level: "hard" },
  { start: "sleep", end: "awake", level: "hard" },
  { start: "grass", end: "trees", level: "hard" }
];

// Common 3-letter words for validating user inputs
const commonWords = new Set([
  "act", "add", "age", "ago", "aid", "aim", "air", "all", "and", "any", "arm", "art", "ask", "bad", 
  "bag", "ban", "bar", "bat", "bay", "bed", "bee", "beg", "bet", "bid", "big", "bin", "bit", "bog", 
  "boy", "bud", "bug", "bun", "bus", "but", "buy", "cab", "cap", "car", "cat", "cod", "cog", "cop", 
  "cow", "cry", "cup", "cut", "dad", "dam", "day", "den", "dew", "did", "die", "dig", "dim", "dip", 
  "dog", "dot", "dry", "due", "dug", "ear", "eat", "egg", "end", "eye", "fan", "far", "fat", "fed", 
  "fee", "few", "fig", "fin", "fir", "fit", "fix", "fly", "fog", "for", "fox", "fun", "fur", "gap", 
  "gas", "get", "got", "gum", "gun", "gut", "guy", "gym", "had", "ham", "has", "hat", "hen", "her", 
  "hey", "hid", "him", "hip", "his", "hit", "hop", "hot", "how", "hub", "hug", "hut", "ice", "ill", 
  "ink", "inn", "its", "jam", "jar", "jaw", "jet", "job", "jog", "joy", "key", "kid", "kit", "lab", 
  "lag", "lap", "law", "lay", "led", "leg", "let", "lid", "lie", "lip", "lit", "log", "lot", "low", 
  "mad", "man", "map", "mat", "may", "men", "met", "mid", "mix", "mob", "mom", "mop", "mud", "mug", 
  "nap", "net", "new", "nod", "not", "now", "nut", "odd", "off", "oil", "old", "one", "our", "out", 
  "owe", "own", "pad", "pan", "par", "pat", "paw", "pay", "pea", "pen", "pet", "pie", "pig", "pin", 
  "pit", "pop", "pot", "put", "rad", "rag", "rap", "rat", "raw", "red", "rib", "rid", "rig", "rim", 
  "rip", "rob", "rod", "rot", "row", "rub", "rug", "run", "sad", "sag", "sat", "saw", "say", "sea", 
  "see", "set", "sew", "she", "shy", "sip", "sir", "sit", "six", "ski", "sky", "sly", "sob", "son", 
  "sow", "spy", "sum", "sun", "tab", "tag", "tan", "tap", "tar", "tax", "tea", "the", "tie", "tin", 
  "tip", "toe", "top", "toy", "try", "tub", "two", "use", "van", "vat", "vet", "via", "war", "was", 
  "wax", "way", "web", "wed", "wet", "who", "why", "wig", "win", "wit", "wok", "won", "yes", "yet", 
  "you", "zip", "zoo"
]);

// Add more 4-letter words
const commonFourLetterWords = new Set([
  "able", "ache", "acid", "aged", "also", "area", "army", "away", "baby", "back", "ball", "band", 
  "bank", "base", "bath", "bear", "beat", "been", "beer", "bell", "belt", "best", "bike", "bill", 
  "bird", "bite", "blue", "boat", "body", "bone", "book", "boot", "born", "both", "bowl", "bulk", 
  "burn", "bush", "busy", "calm", "came", "camp", "card", "care", "cash", "cast", "cell", "chat", 
  "chip", "city", "club", "coal", "coat", "code", "cold", "come", "cook", "cool", "cope", "copy", 
  "cost", "crew", "crop", "dark", "data", "date", "dawn", "days", "dead", "deal", "dean", "dear", 
  "debt", "deep", "deny", "desk", "dial", "dice", "diet", "dirt", "dish", "disk", "does", "done", 
  "door", "dose", "down", "draw", "drew", "drop", "drug", "dual", "duke", "dust", "duty", "each", 
  "earn", "ease", "east", "easy", "edge", "else", "even", "ever", "evil", "exit", "face", "fact", 
  "fade", "fail", "fair", "fall", "fame", "farm", "fast", "fate", "fear", "feed", "feel", "feet", 
  "fell", "felt", "file", "fill", "film", "find", "fine", "fire", "firm", "fish", "five", "flat", 
  "flow", "folk", "food", "foot", "ford", "form", "fort", "four", "free", "from", "fuel", "full", 
  "fund", "gain", "game", "gate", "gave", "gear", "gene", "gift", "girl", "give", "glad", "goal", 
  "goes", "gold", "golf", "gone", "good", "gray", "grew", "grey", "grow", "gulf", "hair", "half", 
  "hall", "hand", "hang", "hard", "harm", "hate", "have", "head", "hear", "heat", "held", "hell", 
  "help", "here", "hero", "high", "hill", "hire", "hold", "hole", "holy", "home", "hope", "host", 
  "hour", "huge", "hung", "hunt", "hurt", "idea", "inch", "into", "iron", "item", "jack", "jane", 
  "jean", "john", "join", "jump", "jury", "just", "keen", "keep", "kent", "kept", "kick", "kill", 
  "kind", "king", "knew", "know", "lack", "lady", "laid", "lake", "land", "lane", "last", "late", 
  "lead", "left", "less", "life", "lift", "like", "line", "link", "list", "live", "load", "loan", 
  "lock", "logo", "long", "look", "lord", "lose", "loss", "lost", "love", "luck", "made", "mail", 
  "main", "make", "male", "many", "mark", "mass", "matt", "meal", "mean", "meat", "meet", "menu", 
  "mere", "mike", "mile", "milk", "mill", "mind", "mine", "miss", "mode", "mood", "moon", "more", 
  "most", "move", "much", "must", "name", "navy", "near", "neck", "need", "news", "next", "nice", 
  "nick", "nine", "none", "nose", "note", "okay", "once", "only", "onto", "open", "oral", "over", 
  "pace", "pack", "page", "paid", "pain", "pair", "palm", "park", "part", "pass", "past", "path", 
  "peak", "pick", "pink", "pipe", "plan", "play", "plot", "plug", "plus", "poll", "pool", "poor", 
  "port", "post", "pull", "pure", "push", "race", "rail", "rain", "rank", "rare", "rate", "read", 
  "real", "rear", "rely", "rent", "rest", "rice", "rich", "ride", "ring", "rise", "risk", "road", 
  "rock", "role", "roll", "roof", "room", "root", "rose", "rule", "rush", "ruth", "safe", "said", 
  "sake", "sale", "salt", "same", "sand", "save", "seat", "seed", "seek", "seem", "seen", "self", 
  "sell", "send", "sent", "sept", "ship", "shop", "shot", "show", "shut", "sick", "side", "sign", 
  "site", "size", "skin", "slip", "slow", "snow", "soft", "soil", "sold", "sole", "some", "song", 
  "soon", "sort", "soul", "spot", "star", "stay", "step", "stop", "such", "suit", "sure", "take", 
  "tale", "talk", "tall", "tank", "tape", "task", "team", "tech", "tell", "tend", "term", "test", 
  "text", "than", "that", "them", "then", "they", "thin", "this", "thus", "time", "tiny", "told", 
  "toll", "tone", "tony", "took", "tool", "tour", "town", "tree", "trip", "true", "tune", "turn", 
  "twin", "type", "unit", "upon", "used", "user", "vary", "vast", "very", "vice", "view", "vote", 
  "wage", "wait", "wake", "walk", "wall", "want", "ward", "warm", "wash", "wave", "ways", "weak", 
  "wear", "week", "well", "went", "were", "west", "what", "when", "whom", "wide", "wife", "wild", 
  "will", "wind", "wine", "wing", "wire", "wise", "wish", "with", "wood", "word", "wore", "work", 
  "yard", "yeah", "year", "your", "zero", "zone"
]);

// Combine both sets
const allWords = new Set([...commonWords, ...commonFourLetterWords]);

// Check if two words differ by just one letter
const differsByOneLetter = (word1: string, word2: string): boolean => {
  if (word1.length !== word2.length) return false;
  
  let differences = 0;
  for (let i = 0; i < word1.length; i++) {
    if (word1[i] !== word2[i]) {
      differences++;
    }
    if (differences > 1) return false;
  }
  
  return differences === 1;
};

// Validate a word (exists in dictionary and only differs by one letter)
const isValidWord = (word: string, previousWord: string): boolean => {
  word = word.toLowerCase();
  previousWord = previousWord.toLowerCase();
  
  // Check if the word exists in our dictionary
  if (!allWords.has(word)) {
    return false;
  }
  
  // Check if it differs by exactly one letter
  return differsByOneLetter(word, previousWord);
};

const WordLadder = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState({ start: "", end: "" });
  const [ladder, setLadder] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [puzzleDifficulty, setPuzzleDifficulty] = useState<string>("easy");
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  
  useEffect(() => {
    startNewGame("easy");
  }, []);
  
  const startNewGame = (difficulty: string) => {
    // Filter puzzles by difficulty
    const filteredPuzzles = wordLadderPuzzles.filter(puzzle => puzzle.level === difficulty);
    
    // Pick a random puzzle
    const randomPuzzle = filteredPuzzles[Math.floor(Math.random() * filteredPuzzles.length)];
    setCurrentPuzzle(randomPuzzle);
    
    // Reset state
    setLadder([randomPuzzle.start]);
    setCurrentInput("");
    setIsComplete(false);
    setShowConfetti(false);
    setPuzzleDifficulty(difficulty);
    setHintsUsed(0);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value.toLowerCase());
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentInput.trim()) {
      toast({
        title: "Please enter a word",
        variant: "destructive"
      });
      return;
    }
    
    const previousWord = ladder[ladder.length - 1];
    const newWord = currentInput.trim().toLowerCase();
    
    // Check if the word is valid
    if (isValidWord(newWord, previousWord)) {
      // Add to ladder
      const newLadder = [...ladder, newWord];
      setLadder(newLadder);
      setCurrentInput("");
      
      // Check if we've reached the end word
      if (newWord === currentPuzzle.end) {
        setIsComplete(true);
        setShowConfetti(true);
        
        toast({
          title: "Congratulations!",
          description: `You completed the word ladder in ${newLadder.length - 1} steps!`,
        });
        
        audioService.speak("Great job! You completed the word ladder!");
        
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        audioService.playSound('success');
      }
    } else {
      // Invalid word
      audioService.playSound('error');
      
      if (!allWords.has(newWord)) {
        toast({
          title: "Not a valid word",
          description: "Please enter a common English word",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Invalid word",
          description: "You can only change one letter at a time",
          variant: "destructive"
        });
      }
    }
  };
  
  const getHint = () => {
    const currentWord = ladder[ladder.length - 1];
    const targetWord = currentPuzzle.end;
    
    // Simple hint: change one letter to be the same as in the target word
    let hintWord = currentWord.split('');
    
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] !== targetWord[i]) {
        hintWord[i] = targetWord[i];
        const potentialHint = hintWord.join('');
        
        if (isValidWord(potentialHint, currentWord)) {
          setCurrentInput(potentialHint);
          setHintsUsed(prev => prev + 1);
          
          toast({
            title: "Hint provided",
            description: `Try changing letter "${currentWord[i]}" to "${targetWord[i]}"`,
          });
          
          return;
        }
        
        // Reset hintWord for next try
        hintWord = currentWord.split('');
      }
    }
    
    // If we couldn't find a direct hint toward the target
    // Just try any valid next word
    for (const word of allWords) {
      if (isValidWord(word, currentWord)) {
        setCurrentInput(word);
        setHintsUsed(prev => prev + 1);
        
        toast({
          title: "Hint provided",
          description: "Here's a possible next word",
        });
        
        return;
      }
    }
    
    toast({
      title: "No hint available",
      description: "Try changing one letter at a time",
      variant: "destructive"
    });
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-red-100 to-pink-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-center text-red-700">Word Ladder</h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={getHint}
              disabled={isComplete}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Hint
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => startNewGame(puzzleDifficulty)}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              New Game
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-gray-500 text-sm">Difficulty:</span>
                <div className="flex mt-1 space-x-2">
                  <Button 
                    variant={puzzleDifficulty === "easy" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => startNewGame("easy")}
                  >
                    Easy
                  </Button>
                  <Button 
                    variant={puzzleDifficulty === "medium" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => startNewGame("medium")}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={puzzleDifficulty === "hard" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => startNewGame("hard")}
                  >
                    Hard
                  </Button>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-gray-500 text-sm">Hints used:</span>
                <div className="text-lg font-bold">{hintsUsed}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="text-2xl font-bold py-3 px-5 bg-red-600 text-white rounded-lg">
                {currentPuzzle.start}
              </div>
              <div className="text-lg">to</div>
              <div className="text-2xl font-bold py-3 px-5 bg-green-600 text-white rounded-lg">
                {currentPuzzle.end}
              </div>
            </div>
            
            {/* Word Ladder */}
            <div className="space-y-2 mb-6">
              {ladder.map((word, index) => (
                <div key={index} className="flex items-center justify-center">
                  <div 
                    className={`
                      py-2 px-4 rounded-lg text-lg font-medium 
                      ${index === 0 ? 'bg-red-100 text-red-800' : 
                        index === ladder.length - 1 && word === currentPuzzle.end ? 
                          'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    `}
                  >
                    {word}
                  </div>
                  
                  {index < ladder.length - 1 && (
                    <ArrowDown className="h-6 w-6 text-gray-400 my-1" />
                  )}
                </div>
              ))}
            </div>
            
            {!isComplete && (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="text"
                  value={currentInput}
                  onChange={handleInputChange}
                  maxLength={currentPuzzle.start.length}
                  placeholder={`Change one letter in "${ladder[ladder.length - 1]}"`}
                  className="flex-1"
                />
                <Button type="submit">Add</Button>
              </form>
            )}
            
            {isComplete && (
              <div className="p-3 bg-green-100 rounded-lg text-center">
                <p className="text-green-800 font-bold">
                  Congratulations! You completed the ladder in {ladder.length - 1} steps!
                </p>
                <Button
                  onClick={() => startNewGame(puzzleDifficulty)}
                  className="mt-2 bg-green-600 hover:bg-green-700"
                >
                  Play Again
                </Button>
              </div>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">How to Play:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Change one letter at a time to make a new word</li>
              <li>Each new word must be a valid English word</li>
              <li>Try to get from the start word to the end word in as few steps as possible</li>
              <li>Use the hint button if you get stuck</li>
            </ul>
            
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-blue-800 font-medium">Example:</p>
              <p className="text-blue-600">
                cat → <span className="font-bold">c</span>ot → <span className="font-bold">d</span>ot → do<span className="font-bold">g</span>
              </p>
              <p className="text-blue-600 text-sm mt-1">
                (Changing one letter at each step)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordLadder;
