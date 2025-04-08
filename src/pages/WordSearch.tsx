
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { wordSearchCategories, generateWordSearch } from '@/services/wordService';
import audioService from '@/services/audioService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WordEntryForm from '@/components/WordEntryForm';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils"

const WordSearch = () => {
  const [category, setCategory] = useState<keyof typeof wordSearchCategories | 'custom'>('animals');
  const [customWords, setCustomWords] = useState<string[]>([]);
  const [wordSearch, setWordSearch] = useState<{
    grid: string[][];
    placedWords: Array<{ word: string; row: number; col: number; direction: string }>;
  } | null>(null);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [selectedCells, setSelectedCells] = useState<Array<[number, number]>>([]);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [incorrectCells, setIncorrectCells] = useState<Array<[Number, number]>>([]);

  // Define grid sizes and word counts based on difficulty
  const difficultySettings = {
    easy: { gridSize: 8, wordCount: 6 },
    medium: { gridSize: 10, wordCount: 8 },
    hard: { gridSize: 12, wordCount: 10 }
  };

  const gridColClasses: Record<'easy' | 'medium' | 'hard', string> = {
    easy: "grid-cols-8",
    medium: "grid-cols-10",
    hard: "grid-cols-12"
  };

  // Generate a new word search puzzle when category, custom words, or difficulty change
  useEffect(() => {
    generateNewPuzzle();
  }, [category, customWords, difficulty]);

  const generateNewPuzzle = () => {
    let words: string[];
    const { gridSize, wordCount } = difficultySettings[difficulty];

    if (category === 'custom') {
      words = customWords.length > 0 ? customWords : wordSearchCategories.animals.slice(0, wordCount);
    } else {
      words = wordSearchCategories[category].slice(0, wordCount);
    }

    const puzzle = generateWordSearch(words, gridSize);
    setWordSearch(puzzle);
    setFoundWords(new Set());
    setSelectedCells([]);
  };

  const handleAddCustomWords = (words: string[]) => {
    setCustomWords(words);
    setCategory('custom');
    setShowCustomDialog(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!wordSearch) return;

    // If this is the first cell selected
    if (selectedCells.length === 0) {
      setSelectedCells([[row, col]]);
      return;
    }

    // If this is the second cell (completing a selection)
    if (selectedCells.length === 1) {
      const [startRow, startCol] = selectedCells[0];

      // Check if the selection is straight (horizontal, vertical, or diagonal)
      const rowDiff = row - startRow;
      const colDiff = col - startCol;

      if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
        const cells: Array<[number, number]> = [[startRow, startCol]];

        // Calculate direction
        const rowDir = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
        const colDir = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

        // Calculate steps
        const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

        // Fill in the cells in between
        for (let i = 1; i <= steps; i++) {
          cells.push([startRow + i * rowDir, startCol + i * colDir]);
        }

        setSelectedCells(cells);

        // Check if a word was found
        checkForWord(cells);
      }
    } else {
      // Reset selection
      setSelectedCells([[row, col]]);
    }
  };

  const checkForWord = (cells: Array<[number, number]>) => {
    if (!wordSearch) return;

    // Construct the word from the selected cells
    let word = '';
    for (const [row, col] of cells) {
      word += wordSearch.grid[row][col];
    }

    // Check if the word is in our list
    const wordForward = word.toLowerCase();
    const wordBackward = [...word].reverse().join('').toLowerCase();
    const placedWords = wordSearch.placedWords.map(w => w.word.toLowerCase());

    if (placedWords.includes(wordForward)) {
      handleWordFound(wordForward, cells);
    } else if (placedWords.includes(wordBackward)) {
      handleWordFound(wordBackward, cells);
    } else {
      // Not a word, reset selection after a delay
      setIncorrectCells(cells);
      setTimeout(() => {
        setIncorrectCells([]);
        setSelectedCells([]);
      }, 500);
    }
  };

  const handleWordFound = (word: string, cells:Array<[number,number]>) => {
    if (foundWords.has(word)) {
      // Already found, just reset selection
      setSelectedCells([]);
      return;
    }

    // Add to found words
    const newFoundWords = new Set(foundWords);
    newFoundWords.add(word);
    setFoundWords(newFoundWords);

    // Keep selected cells highlighted
    setSelectedCells((prev) => [...prev, ...cells]);

    // Speak the word
    audioService.speak(word, true);

    // Keep the selection visible for a bit, then reset
    // setTimeout(() => {
    //   setSelectedCells([]);
    // }, 1000);

    // Check if all words are found
    if (wordSearch && newFoundWords.size === wordSearch.placedWords.length) {
      // All words found!
      setTimeout(() => {
        alert("Great job! You found all the words!");
      }, 1200);
    }
  };

  const isCorrectCell = (row: number, col: number) =>
    selectedCells.some(([r, c]) => r === row && c === col);

  const isIncorrectCell = (row: number, col: number) =>
    incorrectCells.some(([r, c]) => r === row && c === col);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-50">
      <header className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
          <Home className="h-6 w-6 text-kid-blue" />
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-kid-green">Word Search</h1>
        <Button
          onClick={generateNewPuzzle}
          className="bg-kid-green hover:bg-kid-green/80 rounded-full p-2 h-10 w-10"
        >
          <RefreshCw size={20} />
        </Button>
      </header>

      <div className="max-w-xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 w-full md:w-auto">
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as keyof typeof wordSearchCategories | 'custom')}
            >
              <SelectTrigger className="w-[180px] text-lg">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="animals">Animals</SelectItem>
                <SelectItem value="colors">Colors</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="body">Body Parts</SelectItem>
                <SelectItem value="clothes">Clothes</SelectItem>
                <SelectItem value="school">School</SelectItem>
                <SelectItem value="custom">My Words</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-kid-green text-kid-green">
                  Add My Words
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Your Own Words</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <WordEntryForm onAddWords={handleAddCustomWords} maxWords={10} />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="text-xl">
            Found: {foundWords.size}/{wordSearch?.placedWords.length || 0}
          </div>
        </div>

        {/* Difficulty Selector */}
        <Card className="kid-bubble border-kid-green mb-6">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4">Select Difficulty:</h3>
            <RadioGroup
              value={difficulty}
              onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="easy" id="easy" />
                <Label htmlFor="easy" className="text-lg">
                  Easy (8×8 grid, 6 words)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-lg">
                  Medium (10×10 grid, 8 words)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hard" id="hard" />
                <Label htmlFor="hard" className="text-lg">
                  Hard (12×12 grid, 10 words)
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Word List */}
          <Card className="kid-bubble border-kid-green md:w-1/3">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Find these words:</h3>
              <ul className="space-y-2">
                {wordSearch?.placedWords.map(({ word }) => (
                  <li
                    key={word}
                    className={`text-lg font-medium p-2 rounded ${foundWords.has(word.toLowerCase())
                        ? 'bg-kid-green/20 line-through'
                        : ''
                      }`}
                  >
                    {word}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Word Search Grid */}
          <Card className="kid-bubble border-kid-green flex-1">
            <CardContent className="pt-6">
              <div className={cn("grid gap-1", gridColClasses[difficulty])}>
                {wordSearch?.grid.map((row, rowIndex) =>
                  row.map((letter, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={cn(
                        "w-full aspect-square flex items-center justify-center font-bold uppercase cursor-pointer transition-colors",
                        difficulty === "hard"
                          ? "text-sm"
                          : difficulty === "medium"
                            ? "text-base"
                            : "text-xl",
                        isCorrectCell(rowIndex, colIndex)
                          ? "bg-kid-green text-white"
                          : isIncorrectCell(rowIndex, colIndex)
                            ? "bg-red-400 text-white"
                            : "hover:bg-kid-green/20"
                      )}
                    >
                      {letter}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default WordSearch;
