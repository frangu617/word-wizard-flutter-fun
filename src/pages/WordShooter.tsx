
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import audioService from '@/services/audioService';
import { generateMisspelledWords } from '@/services/wordService';

// High score interface
interface HighScore {
  score: number;
  date: string;
  level: number;
}

const WordShooter = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState<{word: string; correct: boolean; position: {x: number; y: number}}[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
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
    setTimeLeft(60);
    setWords([]);
    spawnWords();
  };
  
  // Game timer
  useEffect(() => {
    if (!gameActive) return;
    
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
  }, [gameActive]);
  
  // Spawn words at random intervals
  useEffect(() => {
    if (!gameActive) return;
    
    const spawnInterval = setInterval(spawnWords, 3000 / level);
    return () => clearInterval(spawnInterval);
  }, [gameActive, level]);
  
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
        })).filter(word => word.position.y < (gameAreaRef.current?.clientHeight || 600))
      );
    }, 100);
    
    return () => clearInterval(moveInterval);
  }, [gameActive]);
  
  // Level up based on score
  useEffect(() => {
    if (score > 0 && score % 10 === 0) {
      setLevel(prev => Math.min(prev + 1, 5));
      audioService.playSound('success');
    }
  }, [score]);
  
  // End game and save high score
  const endGame = () => {
    setGameActive(false);
    setGameOver(true);
    setWords([]); // Clear words from screen
    
    // Create new high score entry
    const newScore: HighScore = {
      score: score,
      date: new Date().toLocaleString(),
      level: level
    };
    
    // Update high scores
    const updatedHighScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep only top 5 scores
    
    setHighScores(updatedHighScores);
    localStorage.setItem('wordShooterHighScores', JSON.stringify(updatedHighScores));
  };
  
  // Spawn new words
  const spawnWords = () => {
    if (!gameAreaRef.current) return;
    
    const gameWidth = gameAreaRef.current.clientWidth;
    const wordPair = generateMisspelledWords(level);
    
    const newWords = wordPair.map(({ word, correct }) => ({
      word,
      correct,
      position: {
        x: Math.random() * (gameWidth - 100) + 50,
        y: -50 - Math.random() * 100
      }
    }));
    
    setWords(prev => [...prev, ...newWords]);
  };
  
  // Handle shooting a word
  const shootWord = (word: {word: string; correct: boolean; position: {x: number; y: number}}) => {
    if (word.correct) {
      // Shot a correctly spelled word
      setScore(prev => prev + 1);
      audioService.playSound('success');
    } else {
      // Shot an incorrectly spelled word
      setScore(prev => Math.max(prev - 1, 0));
      audioService.playSound('error');
    }
    
    // Remove the shot word
    setWords(prev => prev.filter(w => w !== word));
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-50">
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
            <CardContent className="pt-0 text-center">
              <h2 className="text-2xl font-bold mb-4">Word Shooter Game</h2>
              <p className="mb-6">Tap on the correctly spelled words and avoid the misspelled ones!</p>
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
              <div className="text-xl font-bold">Time: {timeLeft}s</div>
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
                      ${word.correct ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} 
                      border-2 hover:scale-105 transition-transform
                    `}
                    style={{
                      left: `${word.position.x}px`,
                      top: `${word.position.y}px`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: word.correct ? 1 : 0
                    }}
                    onClick={event => {
                      event.preventDefault();
                      shootWord(word);
                    }}
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
                              <TableHead>Level</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {highScores.map((highScore, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="font-bold">{highScore.score}</TableCell>
                                <TableCell>{highScore.level}</TableCell>
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
