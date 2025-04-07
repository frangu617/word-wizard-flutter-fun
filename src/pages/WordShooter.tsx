
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, Trophy, Star, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import ReactConfetti from 'react-confetti';
import audioService from '@/services/audioService';
import { generateMisspelledWords } from '@/services/wordService';

// High score interface
interface HighScore {
  score: number;
  date: string;
  level: string;
}

// Difficulty types
type Difficulty = 'easy' | 'medium' | 'hard';

const WordShooter = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState<{word: string; correct: boolean; position: {x: number; y: number}; color?: string}[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mistakes, setMistakes] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Load high scores from local storage on mount
  useEffect(() => {
    const storedScores = localStorage.getItem('wordShooterHighScores');
    if (storedScores) {
      setHighScores(JSON.parse(storedScores));
    }
  }, []);
  
  // Start the game
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setGameActive(true);
    setGameOver(false);
    setTimeLeft(difficulty === 'hard' ? Infinity : 60);
    setWords([]);
    setMistakes(0);
    spawnWords();
    
    toast({
      title: "Game Started!",
      description: `Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
      duration: 3000,
    });
  };
  
  // Game timer
  useEffect(() => {
    if (!gameActive || difficulty === 'hard') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameActive, difficulty]);
  
  // Spawn words at random intervals
  useEffect(() => {
    if (!gameActive) return;
    
    const spawnInterval = setInterval(spawnWords, 3000 / level);
    return () => clearInterval(spawnInterval);
  }, [gameActive, level, difficulty]);
  
  // Move words down
  useEffect(() => {
    if (!gameActive) return;
    
    const moveInterval = setInterval(() => {
      setWords(prev => 
        prev.map(word => ({
          ...word,
          position: {
            ...word.position,
            y: word.position.y + 5
          }
        })).filter(word => {
          // Check if any words have fallen off screen
          const wordOffScreen = word.position.y >= (gameAreaRef.current?.clientHeight || 600);
          
          // In hard mode, if a correct word falls off screen, it's a mistake
          if (difficulty === 'hard' && wordOffScreen && word.correct) {
            setMistakes(prev => {
              const newMistakes = prev + 1;
              if (newMistakes >= 3) {
                endGame();
              }
              return newMistakes;
            });
          }
          
          return !wordOffScreen;
        })
      );
    }, 100);
    
    return () => clearInterval(moveInterval);
  }, [gameActive, difficulty]);
  
  // Level up based on score
  useEffect(() => {
    if (score > 0 && score % 10 === 0) {
      setLevel(prev => Math.min(prev + 1, 5));
      audioService.playSound('success');
    }
  }, [score]);
  
  // Handle mistakes in hard mode
  useEffect(() => {
    if (difficulty === 'hard' && mistakes >= 3 && gameActive) {
      endGame();
    }
  }, [mistakes, difficulty, gameActive]);
  
  // End game and save high score
  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    setWords([]); // Clear words from screen
    
    // Play fanfare sound
    audioService.playSound('success');
    // In a timeout to let the first sound finish
    setTimeout(() => audioService.playSound('success'), 300);
    
    // Show confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
    
    // Create new high score entry
    const newScore: HighScore = {
      score: score,
      date: new Date().toLocaleString(),
      level: difficulty
    };
    
    // Update high scores
    const updatedHighScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep only top 5 scores
    
    setHighScores(updatedHighScores);
    localStorage.setItem('wordShooterHighScores', JSON.stringify(updatedHighScores));
  };
  
  // Generate random color for medium/hard difficulties
  const getRandomColor = () => {
    const colors = ['bg-blue-100 border-blue-300', 'bg-purple-100 border-purple-300', 
                    'bg-yellow-100 border-yellow-300', 'bg-indigo-100 border-indigo-300',
                    'bg-pink-100 border-pink-300', 'bg-orange-100 border-orange-300'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Spawn new words
  const spawnWords = () => {
    if (!gameAreaRef.current) return;
    
    const gameWidth = gameAreaRef.current.clientWidth;
    const wordPair = generateMisspelledWords(level);
    
    const newWords = wordPair.map(({ word, correct }) => {
      // For medium and hard difficulties, use random or neutral colors
      let wordColor = '';
      
      if (difficulty === 'easy') {
        wordColor = correct ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300';
      } else {
        // Medium and hard use the same neutral/random color scheme
        wordColor = getRandomColor();
      }
      
      return {
        word,
        correct,
        color: wordColor,
        position: {
          x: Math.random() * (gameWidth - 100) + 50,
          y: -50 - Math.random() * 100
        }
      };
    });
    
    setWords(prev => [...prev, ...newWords]);
  };
  
  // Handle shooting a word
  const shootWord = (word: {word: string; correct: boolean; position: {x: number; y: number}; color?: string}) => {
    if (word.correct) {
      // Shot a correctly spelled word
      setScore(prev => prev + 1);
      audioService.playSound('success');
    } else {
      // Shot an incorrectly spelled word
      setScore(prev => Math.max(prev - 1, 0));
      audioService.playSound('error');
      
      // In hard mode, count mistakes
      if (difficulty === 'hard') {
        setMistakes(prev => {
          const newMistakes = prev + 1;
          return newMistakes;
        });
      }
    }
    
    // Remove the shot word
    setWords(prev => prev.filter(w => w !== word));
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-50">
      {showConfetti && <ReactConfetti recycle={false} />}
      
      <header className="flex justify-between items-center mb-6">
        <Link to="/" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
          <Home className="h-6 w-6 text-kid-blue" />
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-kid-green">Word Shooter</h1>
        <div className="w-10"></div>
      </header>
      
      <div className="max-w-4xl mx-auto mb-6">
        {!gameActive && !gameOver ? (
          <Card className="kid-bubble border-kid-green p-6">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Word Shooter Game</h2>
              <p className="mb-6">Tap on the correctly spelled words and avoid the misspelled ones!</p>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Select Difficulty:</h3>
                <RadioGroup 
                  value={difficulty} 
                  onValueChange={(value) => setDifficulty(value as Difficulty)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easy" id="easy" />
                    <Label htmlFor="easy" className="flex items-center">
                      <span className="mr-2">Easy</span> 
                      <Star className="h-4 w-4 text-yellow-500" />
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="flex items-center">
                      <span className="mr-2">Medium</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="hard" />
                    <Label htmlFor="hard" className="flex items-center">
                      <span className="mr-2">Hard</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                onClick={startGame}
                className="bg-kid-green hover:bg-kid-green/90 text-xl py-6 px-8"
              >
                Start Game
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-bold">Score: {score}</div>
              <div className="text-xl font-bold">Level: {level}</div>
              {difficulty === 'hard' ? (
                <div className="text-xl font-bold flex items-center">
                  <ShieldAlert className="h-5 w-5 mr-1 text-red-500" />
                  Lives: {3 - mistakes}
                </div>
              ) : (
                <div className="text-xl font-bold">Time: {timeLeft}s</div>
              )}
            </div>
            
            <Card className="kid-bubble border-kid-green overflow-hidden">
              <div 
                ref={gameAreaRef}
                className="relative bg-gradient-to-b from-blue-50 to-blue-100 h-[500px]"
              >
                {gameActive && words.map((word, index) => (
                  <button
                    key={`${word.word}-${index}-${word.position.x}-${word.position.y}`}
                    className={`
                      absolute px-4 py-2 rounded-lg font-bold text-xl cursor-pointer
                      ${word.color || 'bg-gray-100 border-gray-300'} 
                      border-2 hover:scale-105 transition-transform
                    `}
                    style={{
                      left: `${word.position.x}px`,
                      top: `${word.position.y}px`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: word.correct ? 1 : 0
                    }}
                    onClick={() => shootWord(word)}
                  >
                    {word.word}
                  </button>
                ))}
                
                {gameOver && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm">
                    <div className="text-center mb-6">
                      <h2 className="text-4xl font-bold text-kid-red mb-2">Game Over!</h2>
                      <p className="text-2xl font-bold mb-4">Final Score: {score}</p>
                      <Button 
                        onClick={startGame}
                        className="bg-kid-green hover:bg-kid-green/90 text-xl py-4 px-6 flex items-center gap-2 mb-6"
                      >
                        <RefreshCw className="h-5 w-5" />
                        Play Again
                      </Button>
                    </div>
                    
                    {highScores.length > 0 && (
                      <div className="w-full max-w-md">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          High Scores
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Rank</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Difficulty</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {highScores.map((highScore, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="font-bold">{highScore.score}</TableCell>
                                <TableCell className="capitalize">{highScore.level}</TableCell>
                                <TableCell>{highScore.date}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default WordShooter;
