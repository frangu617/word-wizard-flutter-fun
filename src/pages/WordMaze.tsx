
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import audioService from '@/services/audioService';
import { ArrowLeft, RefreshCcw, ArrowDown, ArrowUp, ArrowLeft as ArrowLeftIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { getRandomWords } from '@/services/wordService';

// Define maze types
type MazeCell = {
  word: string;
  isPath: boolean;
  isVisited: boolean;
  isStart: boolean;
  isEnd: boolean;
  isCurrent: boolean;
  x: number;
  y: number;
};

type MazeDirection = 'up' | 'right' | 'down' | 'left';

// Sample sentences for the maze goals
const sentences = [
  ["The", "cat", "sits", "on", "the", "mat"],
  ["I", "can", "read", "this", "book"],
  ["We", "love", "to", "play", "games"],
  ["She", "runs", "in", "the", "park"],
  ["He", "likes", "to", "swim", "fast"],
  ["The", "dog", "barks", "at", "night"],
  ["My", "friend", "plays", "the", "piano"],
  ["Birds", "fly", "in", "the", "sky"],
  ["Fish", "swim", "in", "the", "ocean"],
  ["Children", "learn", "at", "school"],
  ["The", "sun", "shines", "very", "bright"],
  ["Frogs", "jump", "in", "the", "pond"]
];

const WordMaze = () => {
  const [maze, setMaze] = useState<MazeCell[][]>([]);
  const [playerPos, setPlayerPos] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [targetSentence, setTargetSentence] = useState<string[]>([]);
  const [collectedWords, setCollectedWords] = useState<string[]>([]);
  const [level, setLevel] = useState<number>(1);
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [moveCount, setMoveCount] = useState<number>(0);
  
  useEffect(() => {
    startNewGame();
  }, [level]);
  
  const startNewGame = () => {
    // Reset game state
    setGameComplete(false);
    setShowConfetti(false);
    setMoveCount(0);
    setCollectedWords([]);
    
    // Get a random sentence as the goal
    const randomSentenceIndex = Math.floor(Math.random() * sentences.length);
    const sentence = sentences[randomSentenceIndex];
    setTargetSentence(sentence);
    
    // Generate the maze
    const mazeSize = level === 1 ? 5 : level === 2 ? 6 : 7;
    generateMaze(mazeSize, sentence);
  };
  
  const generateMaze = (size: number, sentence: string[]) => {
    // Create an empty maze
    const newMaze: MazeCell[][] = [];
    for (let y = 0; y < size; y++) {
      const row: MazeCell[] = [];
      for (let x = 0; x < size; x++) {
        row.push({
          word: "",
          isPath: false,
          isVisited: false,
          isStart: false,
          isEnd: false,
          isCurrent: false,
          x,
          y
        });
      }
      newMaze.push(row);
    }
    
    // Define start and end positions
    const startX = 0;
    const startY = Math.floor(Math.random() * size);
    const endX = size - 1;
    const endY = Math.floor(Math.random() * size);
    
    newMaze[startY][startX].isStart = true;
    newMaze[startY][startX].isPath = true;
    newMaze[endY][endX].isEnd = true;
    newMaze[endY][endX].isPath = true;
    
    // Set player position at start
    setPlayerPos({x: startX, y: startY});
    newMaze[startY][startX].isCurrent = true;
    
    // Generate a path from start to end
    generatePath(newMaze, startX, startY, endX, endY);
    
    // Place words on the path
    placeWordsOnPath(newMaze, sentence);
    
    // Fill in other cells with random words
    fillEmptyCells(newMaze);
    
    setMaze(newMaze);
  };
  
  const generatePath = (maze: MazeCell[][], startX: number, startY: number, endX: number, endY: number) => {
    // Simple algorithm to generate a random path from start to end
    let currentX = startX;
    let currentY = startY;
    
    while (currentX !== endX || currentY !== endY) {
      // Decide whether to move in x or y direction
      const moveInXDirection = Math.random() < 0.5;
      
      if (moveInXDirection && currentX !== endX) {
        // Move towards endX
        currentX += currentX < endX ? 1 : -1;
      } else if (currentY !== endY) {
        // Move towards endY
        currentY += currentY < endY ? 1 : -1;
      } else {
        // Have to move in X direction
        currentX += currentX < endX ? 1 : -1;
      }
      
      // Mark as part of the path
      maze[currentY][currentX].isPath = true;
    }
    
    // Add some random branches to make it more maze-like
    addRandomBranches(maze);
  };
  
  const addRandomBranches = (maze: MazeCell[][]) => {
    const size = maze.length;
    const numBranches = Math.floor(size * 1.5);
    
    for (let i = 0; i < numBranches; i++) {
      // Find a random cell that's part of the path
      const pathCells = [];
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (maze[y][x].isPath && !maze[y][x].isStart && !maze[y][x].isEnd) {
            pathCells.push({x, y});
          }
        }
      }
      
      if (pathCells.length === 0) continue;
      
      const randomPathCellIndex = Math.floor(Math.random() * pathCells.length);
      const {x, y} = pathCells[randomPathCellIndex];
      
      // Try to add a branch in a random direction
      const directions: MazeDirection[] = ['up', 'right', 'down', 'left'];
      const shuffledDirections = [...directions].sort(() => 0.5 - Math.random());
      
      for (const dir of shuffledDirections) {
        const newX = dir === 'left' ? x - 1 : dir === 'right' ? x + 1 : x;
        const newY = dir === 'up' ? y - 1 : dir === 'down' ? y + 1 : y;
        
        // Check if the new position is within the maze and not already a path
        if (
          newX >= 0 && newX < size && 
          newY >= 0 && newY < size && 
          !maze[newY][newX].isPath
        ) {
          maze[newY][newX].isPath = true;
          break;
        }
      }
    }
  };
  
  const placeWordsOnPath = (maze: MazeCell[][], sentence: string[]) => {
    // Find all cells that are part of the path
    const size = maze.length;
    const pathCells = [];
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (maze[y][x].isPath) {
          pathCells.push({x, y});
        }
      }
    }
    
    // Shuffle path cells to randomly place words
    const shuffledPathCells = [...pathCells].sort(() => 0.5 - Math.random());
    
    // Place target sentence words on the path (ensuring start and end are included)
    // First word at start
    const startCell = pathCells.find(cell => maze[cell.y][cell.x].isStart);
    if (startCell) {
      maze[startCell.y][startCell.x].word = sentence[0];
    }
    
    // Last word at end
    const endCell = pathCells.find(cell => maze[cell.y][cell.x].isEnd);
    if (endCell) {
      maze[endCell.y][endCell.x].word = sentence[sentence.length - 1];
    }
    
    // Place rest of the words along the path
    let wordIndex = 1;
    for (const cell of shuffledPathCells) {
      // Skip start and end cells as they already have words
      if (maze[cell.y][cell.x].isStart || maze[cell.y][cell.x].isEnd) continue;
      
      // Place the next word from the sentence
      if (wordIndex < sentence.length - 1) {
        maze[cell.y][cell.x].word = sentence[wordIndex++];
      } else {
        break;
      }
    }
  };
  
  const fillEmptyCells = (maze: MazeCell[][]) => {
    const size = maze.length;
    const fillerWords = getRandomWords(size * size);
    let fillerIndex = 0;
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // If the cell doesn't have a word yet
        if (!maze[y][x].word) {
          // If it's a path cell, use a word from the sentence to create decoys
          if (maze[y][x].isPath) {
            // Alternate between filler words and words from the sentence
            if (Math.random() < 0.7) {
              maze[y][x].word = fillerWords[fillerIndex++ % fillerWords.length];
            } else {
              const randomSentenceWord = targetSentence[Math.floor(Math.random() * targetSentence.length)];
              maze[y][x].word = randomSentenceWord;
            }
          } else {
            // Non-path cells get filler words
            maze[y][x].word = fillerWords[fillerIndex++ % fillerWords.length];
          }
        }
      }
    }
  };
  
  const movePlayer = (direction: MazeDirection) => {
    if (gameComplete) return;
    
    const {x, y} = playerPos;
    let newX = x;
    let newY = y;
    
    // Calculate new position
    switch (direction) {
      case 'up':
        newY = Math.max(0, y - 1);
        break;
      case 'right':
        newX = Math.min(maze[0].length - 1, x + 1);
        break;
      case 'down':
        newY = Math.min(maze.length - 1, y + 1);
        break;
      case 'left':
        newX = Math.max(0, x - 1);
        break;
    }
    
    // Only allow movement if the new position is different
    if (newX === x && newY === y) return;
    
    setMoveCount(prev => prev + 1);
    
    // Update the maze
    setMaze(prev => {
      const newMaze = [...prev.map(row => [...row])];
      
      // Mark current cell as visited and not current
      newMaze[y][x].isCurrent = false;
      if (newMaze[y][x].isPath) {
        newMaze[y][x].isVisited = true;
      }
      
      // Mark new cell as current
      newMaze[newY][newX].isCurrent = true;
      
      // If the new cell is on the path and has a word, collect it
      if (newMaze[newY][newX].isPath && newMaze[newY][newX].word) {
        const word = newMaze[newY][newX].word;
        
        // If we haven't collected this word yet, add it
        if (!collectedWords.includes(word)) {
          collectWord(word);
        }
      }
      
      return newMaze;
    });
    
    // Update player position
    setPlayerPos({x: newX, y: newY});
    
    // Check if we've reached the end
    if (maze[newY][newX].isEnd) {
      checkGameCompletion();
    }
  };
  
  const collectWord = (word: string) => {
    // Add to collected words
    setCollectedWords(prev => {
      // Check if this is the next word in the sentence
      const nextWordIndex = prev.length;
      if (nextWordIndex < targetSentence.length && word === targetSentence[nextWordIndex]) {
        // Correct next word
        audioService.playSound('success');
        return [...prev, word];
      } else if (targetSentence.includes(word)) {
        // It's a word from the sentence but not the next one
        toast({
          title: "Out of order",
          description: "Try to collect the words in the order of the sentence",
          variant: "destructive"
        });
        audioService.playSound('error');
      }
      
      return prev;
    });
  };
  
  const checkGameCompletion = () => {
    // Check if we've collected all words in the correct order
    if (
      collectedWords.length === targetSentence.length &&
      collectedWords.every((word, i) => word === targetSentence[i])
    ) {
      // Game complete!
      setGameComplete(true);
      setShowConfetti(true);
      
      audioService.speak("Great job! You completed the sentence!");
      
      toast({
        title: "Level Complete!",
        description: `You successfully navigated the word maze in ${moveCount} moves!`,
      });
      
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      // Reached the end but didn't collect all words correctly
      toast({
        title: "Not quite right",
        description: "You need to collect all the words in the correct order",
        variant: "destructive"
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (gameComplete) return;
    
    switch (e.key) {
      case 'ArrowUp':
        movePlayer('up');
        break;
      case 'ArrowRight':
        movePlayer('right');
        break;
      case 'ArrowDown':
        movePlayer('down');
        break;
      case 'ArrowLeft':
        movePlayer('left');
        break;
    }
  };
  
  return (
    <div 
      className="min-h-screen p-4 bg-gradient-to-b from-orange-100 to-amber-50"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-center text-orange-700">Word Maze</h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={startNewGame}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              New Game
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm text-gray-500">Level:</div>
                  <div className="flex gap-2">
                    <Button 
                      variant={level === 1 ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setLevel(1)}
                      disabled={gameComplete}
                    >
                      Easy
                    </Button>
                    <Button 
                      variant={level === 2 ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setLevel(2)}
                      disabled={gameComplete}
                    >
                      Medium
                    </Button>
                    <Button 
                      variant={level === 3 ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setLevel(3)}
                      disabled={gameComplete}
                    >
                      Hard
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-500">Goal:</div>
                  <div className="font-bold">
                    {targetSentence.join(" ")}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500">Moves:</div>
                  <div className="text-xl font-bold">{moveCount}</div>
                </div>
              </div>
              
              {/* Collected words display */}
              <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Collected Words:</div>
                <div className="flex flex-wrap gap-2">
                  {collectedWords.map((word, index) => (
                    <span 
                      key={index}
                      className="inline-block px-3 py-1 bg-orange-500 text-white rounded-full"
                    >
                      {word}
                    </span>
                  ))}
                  {collectedWords.length < targetSentence.length && (
                    Array(targetSentence.length - collectedWords.length).fill(0).map((_, i) => (
                      <span 
                        key={`empty-${i}`}
                        className="inline-block w-10 h-6 bg-gray-200 rounded-full"
                      />
                    ))
                  )}
                </div>
              </div>
              
              {/* Maze display */}
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${maze.length}, 1fr)` }}>
                {maze.map((row, y) => (
                  row.map((cell, x) => (
                    <Card
                      key={`${x}-${y}`}
                      className={`
                        p-2 aspect-square flex items-center justify-center
                        ${cell.isCurrent ? 'ring-2 ring-orange-500 ring-offset-2' : ''}
                        ${cell.isVisited ? 'bg-orange-100' : 'bg-white'}
                        ${cell.isStart ? 'bg-green-100 border-green-500' : ''}
                        ${cell.isEnd ? 'bg-blue-100 border-blue-500' : ''}
                      `}
                    >
                      <div className="text-center">
                        <div className="font-bold text-sm">{cell.word}</div>
                        {cell.isCurrent && (
                          <div className="text-orange-600">🧙</div>
                        )}
                      </div>
                    </Card>
                  ))
                ))}
              </div>
              
              {/* Movement controls */}
              <div className="mt-6 grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                <div></div>
                <Button
                  variant="outline"
                  onClick={() => movePlayer('up')}
                  disabled={gameComplete}
                >
                  <ArrowUp />
                </Button>
                <div></div>
                
                <Button
                  variant="outline"
                  onClick={() => movePlayer('left')}
                  disabled={gameComplete}
                >
                  <ArrowLeftIcon />
                </Button>
                <div></div>
                <Button
                  variant="outline"
                  onClick={() => movePlayer('right')}
                  disabled={gameComplete}
                >
                  <ArrowRight />
                </Button>
                
                <div></div>
                <Button
                  variant="outline"
                  onClick={() => movePlayer('down')}
                  disabled={gameComplete}
                >
                  <ArrowDown />
                </Button>
                <div></div>
              </div>
              
              {/* Game complete message */}
              {gameComplete && (
                <div className="mt-4 p-4 bg-green-100 rounded-lg text-center">
                  <h3 className="text-xl font-bold text-green-800 mb-2">Level Complete!</h3>
                  <p className="mb-2">You successfully navigated the word maze in {moveCount} moves!</p>
                  <Button
                    onClick={() => {
                      setLevel(prev => Math.min(3, prev + 1));
                      startNewGame();
                    }}
                    className="bg-green-600 hover:bg-green-700 mt-2"
                  >
                    {level < 3 ? "Next Level" : "Play Again"}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">How to Play:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Navigate the maze using arrow keys or buttons</li>
              <li>Collect words that form the target sentence <strong>in order</strong></li>
              <li>Start at the green cell and reach the blue cell</li>
              <li>Complete the sentence by the time you reach the end</li>
            </ul>
            
            <div className="mt-4">
              <h4 className="font-medium mb-1">Controls:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Arrow keys on your keyboard</li>
                <li>Or use the on-screen arrow buttons</li>
              </ul>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-1">Difficulty Levels:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Easy:</strong> 5×5 maze with shorter sentences</li>
                <li><strong>Medium:</strong> 6×6 maze with more complex paths</li>
                <li><strong>Hard:</strong> 7×7 maze with longer sentences</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordMaze;
