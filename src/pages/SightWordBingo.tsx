
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSightWords } from '@/services/wordService';
import { toast } from "@/components/ui/use-toast";
import audioService from '@/services/audioService';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';

const SightWordBingo = () => {
  const [bingoBoard, setBingoBoard] = useState<string[][]>([]);
  const [selectedCells, setSelectedCells] = useState<boolean[][]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [hasBingo, setHasBingo] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [calledWords, setCalledWords] = useState<string[]>([]);
  
  // Create a 5x5 bingo board filled with random sight words
  useEffect(() => {
    createNewBoard();
  }, []);
  
  const createNewBoard = () => {
    setIsLoading(true);
    setHasBingo(false);
    setShowConfetti(false);
    setCalledWords([]);
    
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
    // Get all the words from the board (except "FREE")
    const allBoardWords = bingoBoard.flat().filter(word => word !== "FREE");
    
    // Filter out words that have already been called
    const availableWords = allBoardWords.filter(word => !calledWords.includes(word));
    
    // If no more words to call, end the game
    if (availableWords.length === 0) {
      toast({
        title: "All words called!",
        description: "Start a new game to continue playing.",
      });
      return;
    }
    
    // Choose a random word from available words
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
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
        
        toast({
          title: "BINGO!",
          description: "You got 5 in a row!",
        });
        
        // Hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        // Call the next word after a delay
        setTimeout(callNewWord, 1000);
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
            <h2 className="text-xl text-center mb-2">Called Word:</h2>
            <div 
              className="text-4xl font-bold text-center p-4 rounded-lg bg-gradient-to-r from-purple-200 to-pink-200"
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
          
          {/* Bingo Board */}
          <div className="grid grid-cols-5 gap-2 w-full max-w-lg">
            {bingoBoard.map((row, rowIndex) => (
              row.map((word, colIndex) => (
                <Card 
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    p-2 cursor-pointer flex items-center justify-center 
                    min-h-16 text-center transition-all transform
                    ${selectedCells[rowIndex][colIndex] 
                      ? 'bg-pink-500 text-white font-bold shadow-md scale-105' 
                      : 'bg-white hover:bg-pink-100'}
                    ${word === currentWord && !selectedCells[rowIndex][colIndex] 
                      ? 'ring-2 ring-purple-500 ring-offset-2 animate-pulse' 
                      : ''}
                    ${word === "FREE" ? 'bg-purple-300 font-bold' : ''}
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {word}
                </Card>
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
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SightWordBingo;
