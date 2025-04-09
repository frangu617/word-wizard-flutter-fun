
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSightWords } from '@/services/wordService';
import { toast } from "@/components/ui/use-toast";
import audioService from '@/services/audioService';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SightWordBingo = () => {
  const [bingoBoard, setBingoBoard] = useState<string[][]>([]);
  const [selectedCells, setSelectedCells] = useState<boolean[][]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [hasBingo, setHasBingo] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [calledWords, setCalledWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal'>('easy');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Create a 5x5 bingo board filled with random sight words
  useEffect(() => {
    createNewBoard();
  }, []);
  
  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time's up, move to next word
      callNewWord();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, timerActive]);
  
  const createNewBoard = () => {
    setIsLoading(true);
    setHasBingo(false);
    setShowConfetti(false);
    setCalledWords([]);
    setTimerActive(false);
    setTimeLeft(30);
    
    // Get sight words from all grades
    const allWords = getSightWords();
    
    // Shuffle and take 25 unique words for the board
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    const uniqueWords = Array.from(new Set(shuffled)).slice(0, 25);
    
    // Not enough words
    if (uniqueWords.length < 25) {
      toast({
        title: "Not enough words",
        description: "Please add more sight words to play bingo",
        variant: "destructive"
      });
      return;
    }
    
    // Create 5x5 board
    const board: string[][] = [];
    const selected: boolean[][] = [];
    
    for (let i = 0; i < 5; i++) {
      const row: string[] = [];
      const selectedRow: boolean[] = [];
      
      for (let j = 0; j < 5; j++) {
        const wordIndex = i * 5 + j;
        row.push(uniqueWords[wordIndex]);
        selectedRow.push(false);
      }
      
      board.push(row);
      selected.push(selectedRow);
    }
    
    // Set the central cell as "FREE" and mark as selected
    board[2][2] = "FREE";
    selected[2][2] = true;
    
    setBingoBoard(board);
    setSelectedCells(selected);
    setIsLoading(false);
    
    // Call the first word after a delay
    setTimeout(callNewWord, 1500);
  };
  
  const callNewWord = () => {
    // Clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // Reset timer
    setTimeLeft(30);
    setTimerActive(true);
    
    // Get all the words from the board (except "FREE")
    const allBoardWords = bingoBoard.flat().filter(word => word !== "FREE");
    
    // Include words from the board and some words not on the board to make it challenging
    const availableWords = [...allBoardWords];
    
    // Add some random words (not on the board)
    const allWords = getSightWords();
    const extraWords = allWords.filter(word => !allBoardWords.includes(word) && !calledWords.includes(word));
    const randomExtraWords = extraWords.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    // Combine board words and extra words, then filter out called words
    const combinedWords = [...availableWords, ...randomExtraWords].filter(word => !calledWords.includes(word));
    
    // If no more words to call, end the game
    if (combinedWords.length === 0) {
      toast({
        title: "All words called!",
        description: "Start a new game to continue playing.",
      });
      setTimerActive(false);
      return;
    }
    
    // Choose a random word from available words
    const randomWord = combinedWords[Math.floor(Math.random() * combinedWords.length)];
    
    // Update current word and called words list
    setCurrentWord(randomWord);
    setCalledWords(prev => [...prev, randomWord]);
    
    // Speak the word
    audioService.speak(randomWord);
  };
  
  const handleCellClick = (row: number, col: number) => {
    // If cell is already selected or if there's a bingo, do nothing
    if (selectedCells[row][col] || hasBingo) return;
    
    const clickedWord = bingoBoard[row][col];
    
    // Check if the clicked word matches the current word
    if (clickedWord === currentWord) {
      // Update selected cells
      const newSelectedCells = [...selectedCells];
      newSelectedCells[row][col] = true;
      setSelectedCells(newSelectedCells);
      
      // Play success sound
      audioService.playSound('success');
      
      // Check for bingo
      if (checkForBingo(newSelectedCells)) {
        setHasBingo(true);
        setShowConfetti(true);
        setTimerActive(false);
        
        toast({
          title: "BINGO!",
          description: "You got 5 in a row!",
        });
        
        // Hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } else {
      // Play error sound
      audioService.playSound('error');
      
      toast({
        title: "Not a match!",
        description: `Listen for the word "${currentWord}"`,
        variant: "destructive"
      });
    }
  };
  
  const checkForBingo = (cells: boolean[][]) => {
    // Check rows
    for (let row = 0; row < 5; row++) {
      if (cells[row].every(cell => cell === true)) {
        return true;
      }
    }
    
    // Check columns
    for (let col = 0; col < 5; col++) {
      let colComplete = true;
      for (let row = 0; row < 5; row++) {
        if (!cells[row][col]) {
          colComplete = false;
          break;
        }
      }
      if (colComplete) return true;
    }
    
    // Check diagonal (top-left to bottom-right)
    let diagonal1Complete = true;
    for (let i = 0; i < 5; i++) {
      if (!cells[i][i]) {
        diagonal1Complete = false;
        break;
      }
    }
    if (diagonal1Complete) return true;
    
    // Check diagonal (top-right to bottom-left)
    let diagonal2Complete = true;
    for (let i = 0; i < 5; i++) {
      if (!cells[i][4-i]) {
        diagonal2Complete = false;
        break;
      }
    }
    if (diagonal2Complete) return true;
    
    return false;
  };
  
  // Determine if a word should be highlighted based on difficulty
  const shouldHighlightWord = (word: string): boolean => {
    return difficulty === 'easy' && word === currentWord;
  };

  // Skip current word and move to next
  const handleSkipWord = () => {
    callNewWord();
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-pink-100 to-purple-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-center text-purple-700">Sight Word Bingo</h1>
          
          <Button 
            variant="outline" 
            onClick={createNewBoard}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            New Game
          </Button>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Called Word:</h2>
              <Select 
                value={difficulty} 
                onValueChange={(value: 'easy' | 'normal') => setDifficulty(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-2">
              <div 
                className="text-4xl font-bold text-center p-4 rounded-lg bg-gradient-to-r from-purple-200 to-pink-200 cursor-pointer"
                onClick={() => audioService.speak(currentWord)}
              >
                {currentWord ? currentWord : isLoading ? "Loading..." : "Starting..."}
              </div>
              {currentWord && (
                <p className="text-center mt-2 text-gray-600">
                  (Tap the word to hear it again)
                </p>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="bg-purple-100 px-4 py-2 rounded-lg text-purple-800 font-medium">
                Next word in: {timeLeft}s
              </div>
              
              <Button 
                onClick={handleSkipWord}
                variant="outline"
                size="sm"
              >
                Skip Word
              </Button>
            </div>
          </div>
          
          {/* Bingo Board */}
          <div className="grid grid-cols-5 gap-2 w-full max-w-lg">
            {bingoBoard.map((row, rowIndex) => (
              row.map((word, colIndex) => (
                <TooltipProvider key={`${rowIndex}-${colIndex}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card 
                        className={`
                          p-2 cursor-pointer flex items-center justify-center 
                          min-h-16 text-center transition-all transform
                          ${selectedCells[rowIndex][colIndex] 
                            ? 'bg-pink-500 text-white font-bold shadow-md scale-105' 
                            : 'bg-white hover:bg-pink-100'}
                          ${shouldHighlightWord(word) && !selectedCells[rowIndex][colIndex] 
                            ? 'ring-2 ring-purple-500 ring-offset-2 animate-pulse' 
                            : ''}
                          ${word === "FREE" ? 'bg-purple-300 font-bold' : ''}
                        `}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {word}
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click if this matches the called word</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow max-w-lg mx-auto">
          <h3 className="text-lg font-bold mb-2">How to Play:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Listen to the called word (tap to hear it again)</li>
            <li>Find and click the matching word on your bingo board</li>
            <li>Get 5 in a row (horizontally, vertically, or diagonally) to win!</li>
            <li>The center square is FREE</li>
            <li>Each word will be called for 30 seconds before moving to the next word</li>
            <li><span className="font-semibold">Easy mode:</span> Highlights the called word on your board</li>
            <li><span className="font-semibold">Normal mode:</span> No highlighting - find the word yourself!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SightWordBingo;
