
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import audioService from '@/services/audioService';
import { generateMisspelledWords } from '@/services/wordService';

const WordShooter = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState<{word: string; correct: boolean; position: {x: number; y: number}}[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [crosshairPosition, setCrosshairPosition] = useState({ x: 0, y: 0 });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  
  // Start the game
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setGameActive(true);
    setGameOver(false);
    setTimeLeft(60);
    spawnWords();
  };
  
  // Game timer
  useEffect(() => {
    if (!gameActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          setGameOver(true);
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
  
  // Track mouse movement for crosshair
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current) return;
      
      const rect = gameAreaRef.current.getBoundingClientRect();
      setCrosshairPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    const gameArea = gameAreaRef.current;
    if (gameArea) {
      gameArea.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (gameArea) {
        gameArea.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
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
              <p className="mb-6">Shoot the correctly spelled words and avoid the misspelled ones!</p>
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
                className="relative bg-gradient-to-b from-blue-50 to-blue-100 h-[500px] cursor-none"
                onClick={() => {
                  // Find if we clicked on any word
                  const clickedWordIndex = words.findIndex(word => {
                    const wordElement = document.getElementById(`word-${word.word}-${word.position.x}-${word.position.y}`);
                    if (!wordElement) return false;
                    
                    const rect = wordElement.getBoundingClientRect();
                    return (
                      crosshairPosition.x >= rect.left - (gameAreaRef.current?.getBoundingClientRect().left || 0) &&
                      crosshairPosition.x <= rect.right - (gameAreaRef.current?.getBoundingClientRect().left || 0) &&
                      crosshairPosition.y >= rect.top - (gameAreaRef.current?.getBoundingClientRect().top || 0) &&
                      crosshairPosition.y <= rect.bottom - (gameAreaRef.current?.getBoundingClientRect().top || 0)
                    );
                  });
                  
                  if (clickedWordIndex !== -1) {
                    shootWord(words[clickedWordIndex]);
                  }
                }}
              >
                {words.map((word, index) => (
                  <div
                    id={`word-${word.word}-${word.position.x}-${word.position.y}`}
                    key={`${word.word}-${index}-${word.position.x}-${word.position.y}`}
                    className={`
                      absolute px-4 py-2 rounded-lg font-bold text-xl
                      ${word.correct ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} 
                      border-2 pointer-events-none
                    `}
                    style={{
                      left: `${word.position.x}px`,
                      top: `${word.position.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {word.word}
                  </div>
                ))}
                
                {/* Crosshair */}
                <div 
                  className="absolute w-20 h-20 pointer-events-none"
                  style={{
                    left: `${crosshairPosition.x}px`,
                    top: `${crosshairPosition.y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Crosshair 
                    className="text-red-500 h-full w-full animate-pulse" 
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </Card>
            
            {gameOver && (
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                <p className="mb-6">Final Score: {score}</p>
                <Button 
                  onClick={startGame}
                  className="bg-kid-green hover:bg-kid-green/90 text-xl py-4 px-6"
                >
                  Play Again
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WordShooter;
