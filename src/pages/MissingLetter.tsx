
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import audioService from '@/services/audioService';
import { ArrowLeft, RefreshCcw, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Word lists by difficulty
const wordsByDifficulty = {
  easy: [
    "cat", "dog", "sun", "run", "hat", "bat", "map", "cap", "sad", "mad",
    "big", "pig", "hop", "top", "red", "bed", "ten", "pen", "sit", "hit"
  ],
  medium: [
    "cake", "lake", "time", "lime", "book", "look", "fish", "dish", "rain", "pain",
    "blue", "glue", "star", "cart", "jump", "bump", "frog", "blog", "ship", "chip"
  ],
  hard: [
    "cloud", "proud", "train", "brain", "smile", "while", "dream", "cream", "house", "mouse",
    "snake", "shake", "flower", "shower", "school", "stool", "light", "night", "bread", "thread"
  ]
};

const MissingLetter = () => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [displayedWord, setDisplayedWord] = useState<string>("");
  const [missingLetterIndex, setMissingLetterIndex] = useState<number>(0);
  const [missingLetter, setMissingLetter] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  useEffect(() => {
    startNewRound();
  }, [difficulty]);
  
  const startNewRound = () => {
    setIsCorrect(null);
    setSelectedOption(null);
    
    // Get a random word based on difficulty
    const wordList = wordsByDifficulty[difficulty];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(randomWord);
    
    // Select a random position for the missing letter
    const randomIndex = Math.floor(Math.random() * randomWord.length);
    setMissingLetterIndex(randomIndex);
    setMissingLetter(randomWord[randomIndex]);
    
    // Create the displayed word with the missing letter
    const wordWithMissing = randomWord.split('').map((letter, i) => 
      i === randomIndex ? '_' : letter
    ).join('');
    setDisplayedWord(wordWithMissing);
    
    // Generate options (including the correct letter)
    generateOptions(randomWord[randomIndex]);
    
    setRound(prev => prev + 1);
  };
  
  const generateOptions = (correctLetter: string) => {
    // Start with the correct letter
    const allOptions = [correctLetter];
    
    // Add some similar-looking or similar-sounding letters
    const similarLetters: Record<string, string[]> = {
      'a': ['e', 'o', 'u'],
      'b': ['d', 'p', 'q'],
      'c': ['k', 's', 'g'],
      'd': ['b', 'p', 'q'],
      'e': ['a', 'i', 'o'],
      'f': ['v', 'p', 't'],
      'g': ['j', 'q', 'c'],
      'h': ['n', 'm', 'k'],
      'i': ['j', 'l', 'e'],
      'j': ['i', 'g', 'y'],
      'k': ['c', 'x', 'h'],
      'l': ['i', 'j', 't'],
      'm': ['n', 'w', 'h'],
      'n': ['m', 'h', 'r'],
      'o': ['a', 'e', 'u'],
      'p': ['b', 'd', 'q'],
      'q': ['p', 'g', 'd'],
      'r': ['n', 'v', 'w'],
      's': ['c', 'z', 'x'],
      't': ['f', 'l', 'i'],
      'u': ['v', 'o', 'a'],
      'v': ['u', 'w', 'y'],
      'w': ['v', 'm', 'n'],
      'x': ['k', 's', 'z'],
      'y': ['j', 'v', 'g'],
      'z': ['s', 'x', 'c']
    };
    
    // Get similar letters or random ones if not in our map
    const similar = similarLetters[correctLetter] || 
      ['a', 'e', 'i', 'o', 'u'].filter(l => l !== correctLetter);
    
    // Add some of the similar letters
    for (let i = 0; i < 3; i++) {
      if (similar.length > i) {
        allOptions.push(similar[i]);
      }
    }
    
    // If we need more options (for harder difficulties)
    while (allOptions.length < (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5)) {
      const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
      if (!allOptions.includes(randomLetter)) {
        allOptions.push(randomLetter);
      }
    }
    
    // Shuffle the options
    const shuffled = [...allOptions].sort(() => 0.5 - Math.random());
    setOptions(shuffled);
  };
  
  const handleOptionClick = (letter: string) => {
    if (isCorrect !== null) return; // Already answered
    
    setSelectedOption(letter);
    
    const correct = letter === missingLetter;
    setIsCorrect(correct);
    
    if (correct) {
      // Correct answer
      audioService.playSound('success');
      setScore(prev => prev + (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3));
      setStreak(prev => prev + 1);
      
      if (streak >= 4) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      
      toast({
        title: "Correct!",
        description: `That's right! The word is "${currentWord}".`,
      });
      
      // Speak the full word
      setTimeout(() => {
        audioService.speak(currentWord);
      }, 500);
      
      // Move to next round after delay
      setTimeout(startNewRound, 2000);
    } else {
      // Wrong answer
      audioService.playSound('error');
      setStreak(0);
      
      toast({
        title: "Not quite right",
        description: `The correct letter is "${missingLetter}". The word is "${currentWord}".`,
        variant: "destructive"
      });
      
      // Move to next round after longer delay
      setTimeout(startNewRound, 3000);
    }
  };
  
  const speakWord = () => {
    audioService.speak(currentWord);
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-green-100 to-emerald-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-center text-green-700">Missing Letter</h1>
          
          <Button 
            variant="outline" 
            onClick={startNewRound}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            New Word
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-gray-500">Score:</div>
                <div className="text-xl font-bold">{score}</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500">Streak:</div>
                <div className="text-xl font-bold">{streak}</div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">Difficulty:</div>
                <Select
                  value={difficulty}
                  onValueChange={(value) => setDifficulty(value as "easy" | "medium" | "hard")}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Word display */}
            <div className="mb-8 text-center">
              <div 
                className="text-3xl font-bold mb-4 tracking-wider cursor-pointer"
                onClick={speakWord}
              >
                {displayedWord.split('').map((letter, index) => (
                  <span
                    key={index}
                    className={`inline-block mx-1 min-w-8 p-2 ${
                      letter === '_' 
                        ? 'border-b-4 border-green-500' 
                        : ''
                    }`}
                  >
                    {letter}
                  </span>
                ))}
                <Volume2 className="inline-block ml-2 h-6 w-6 text-green-500" />
              </div>
              
              <p className="text-gray-500">
                Click the word to hear it pronounced
              </p>
            </div>
            
            {/* Options */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-6">
              {options.map((letter, index) => (
                <Card
                  key={index}
                  className={`
                    cursor-pointer transition-all transform hover:scale-105
                    ${selectedOption === letter && isCorrect === true ? 'bg-green-100 border-green-500' : ''}
                    ${selectedOption === letter && isCorrect === false ? 'bg-red-100 border-red-500' : ''}
                    ${selectedOption === null ? 'hover:border-green-300' : ''}
                  `}
                  onClick={() => handleOptionClick(letter)}
                >
                  <CardContent className="p-6 flex items-center justify-center">
                    <span className="text-3xl font-bold">{letter}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {isCorrect === true && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-100 rounded-lg text-center"
              >
                <p className="text-green-800 font-bold">Correct! The word is "{currentWord}".</p>
              </motion.div>
            )}
            
            {isCorrect === false && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-100 rounded-lg text-center"
              >
                <p className="text-red-800 font-bold">
                  The correct letter is "{missingLetter}". The word is "{currentWord}".
                </p>
              </motion.div>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">How to Play:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Look at the word with a missing letter</li>
              <li>Click on the correct letter to complete the word</li>
              <li>Click on the word to hear it pronounced</li>
              <li>Build your streak for bonus effects!</li>
            </ul>
            
            <div className="mt-4">
              <h4 className="font-medium mb-1">Difficulty Levels:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Easy:</strong> Short 3-letter words</li>
                <li><strong>Medium:</strong> 4-letter words</li>
                <li><strong>Hard:</strong> 5-6 letter words with more complex patterns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingLetter;
