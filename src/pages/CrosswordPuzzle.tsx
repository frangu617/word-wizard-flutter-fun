
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { generateCrossword } from '@/services/wordService';
import WordEntryForm from '@/components/WordEntryForm';

const CrosswordPuzzle = () => {
  const [customWords, setCustomWords] = useState<string[]>([]);
  const [clues, setClues] = useState<{[key: string]: string}>({});
  const [crossword, setCrossword] = useState<{
    grid: string[][];
    words: Array<{word: string; row: number; col: number; direction: string; clue: string}>;
  } | null>(null);
  const [userInput, setUserInput] = useState<{[key: string]: string}>({});
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  
  useEffect(() => {
    if (customWords.length > 0) {
      generateNewCrossword();
    }
  }, [customWords]);
  
  const generateNewCrossword = () => {
    // Create clues for the words if they don't exist
    const updatedClues = {...clues};
    customWords.forEach(word => {
      if (!updatedClues[word]) {
        updatedClues[word] = `Clue for ${word}`;
      }
    });
    setClues(updatedClues);
    
    const puzzle = generateCrossword(customWords, updatedClues);
    setCrossword(puzzle);
    setUserInput({});
  };
  
  const handleAddCustomWords = (words: string[]) => {
    setCustomWords(words);
    setShowCustomDialog(false);
  };
  
  const handleUpdateClue = (word: string, clue: string) => {
    setClues({
      ...clues,
      [word]: clue
    });
  };
  
  const handleInputChange = (row: number, col: number, value: string) => {
    const key = `${row}-${col}`;
    setUserInput({
      ...userInput,
      [key]: value.toUpperCase()
    });
    
    // Check if the crossword is complete
    if (crossword) {
      let complete = true;
      for (let r = 0; r < crossword.grid.length; r++) {
        for (let c = 0; c < crossword.grid[r].length; c++) {
          if (crossword.grid[r][c] !== ' ' && userInput[`${r}-${c}`] !== crossword.grid[r][c]) {
            complete = false;
            break;
          }
        }
      }
      
      if (complete) {
        // The crossword is complete
        alert('Congratulations! You completed the crossword!');
      }
    }
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-50">
      <header className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
          <Home className="h-6 w-6 text-kid-blue" />
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-kid-green">Crossword Puzzle</h1>
        {customWords.length > 0 && (
          <Button 
            onClick={generateNewCrossword}
            className="bg-kid-green hover:bg-kid-green/80 rounded-full p-2 h-10 w-10"
          >
            <RefreshCw size={20} />
          </Button>
        )}
      </header>
      
      <div className="max-w-4xl mx-auto mb-6">
        {!crossword ? (
          <Card className="kid-bubble border-kid-green p-6">
            <CardContent className="pt-0">
              <h2 className="text-2xl font-bold mb-4 text-center">Create Your Crossword</h2>
              <p className="text-center mb-6">Add your own words and create a custom crossword puzzle!</p>
              
              <WordEntryForm onAddWords={handleAddCustomWords} maxWords={10} />
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Crossword Grid */}
            <Card className="kid-bubble border-kid-green lg:flex-1">
              <CardContent className="pt-6">
                <div className="grid grid-cols-10 gap-1">
                  {crossword.grid.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          relative w-full aspect-square flex items-center justify-center 
                          text-lg font-bold border 
                          ${cell === ' ' ? 'bg-black border-black' : 'bg-white'}
                        `}
                      >
                        {cell !== ' ' && (
                          <>
                            {crossword.words.some(w => 
                              (w.row === rowIndex && w.col === colIndex) ||
                              (w.direction === 'horizontal' && w.row === rowIndex && w.col <= colIndex && colIndex < w.col + w.word.length) ||
                              (w.direction === 'vertical' && w.col === colIndex && w.row <= rowIndex && rowIndex < w.row + w.word.length)
                            ) && (
                              <Input
                                className="absolute inset-0 w-full h-full text-center font-bold uppercase p-0 border-0"
                                value={userInput[`${rowIndex}-${colIndex}`] || ''}
                                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                                maxLength={1}
                              />
                            )}
                            
                            {crossword.words.some(w => w.row === rowIndex && w.col === colIndex) && (
                              <span className="absolute top-0 left-0 text-xs font-normal p-0.5">
                                {crossword.words.findIndex(w => w.row === rowIndex && w.col === colIndex) + 1}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    ))
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Clues */}
            <Card className="kid-bubble border-kid-green lg:w-2/5">
              <CardContent className="pt-6">
                <div className="flex gap-4 mb-4">
                  <Button 
                    onClick={() => setShowCustomDialog(true)}
                    className="bg-kid-green hover:bg-kid-green/90 w-full"
                  >
                    Update Words
                  </Button>
                  
                  <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Update Your Words</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <WordEntryForm onAddWords={handleAddCustomWords} maxWords={10} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <h3 className="text-xl font-bold mb-2">Clues</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {crossword.words.map((word, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex gap-2">
                        <span className="font-bold">{index + 1}.</span>
                        <Input
                          value={clues[word.word] || ''}
                          onChange={(e) => handleUpdateClue(word.word, e.target.value)}
                          placeholder={`Enter clue for "${word.word}"`}
                        />
                      </div>
                      <div className="ml-6 text-sm text-gray-500">
                        {word.direction === 'horizontal' ? 'Across' : 'Down'} - {word.word.length} letters
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrosswordPuzzle;
