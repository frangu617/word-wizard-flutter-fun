
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import audioService from '@/services/audioService';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import GameHeader from '@/components/RhymeRacer/GameHeader';
import RaceTrack from '@/components/RhymeRacer/RaceTrack';
import { RacingWord } from '@/components/RhymeRacer/RacingWord';

// Rhyme sets for the game
const rhymeSets = [
  { targetWord: "cat", rhymes: ["bat", "hat", "mat", "rat", "sat", "fat"], nonRhymes: ["dog", "car", "can", "cup", "kit"] },
  { targetWord: "pig", rhymes: ["big", "dig", "fig", "rig", "wig", "jig"], nonRhymes: ["dog", "hog", "pet", "pin", "peg"] },
  { targetWord: "ball", rhymes: ["call", "fall", "hall", "mall", "tall", "wall"], nonRhymes: ["bell", "bull", "bill", "doll", "bowl"] },
  { targetWord: "cake", rhymes: ["bake", "fake", "lake", "make", "rake", "take"], nonRhymes: ["cook", "bike", "cope", "cut", "cat"] },
  { targetWord: "sun", rhymes: ["bun", "fun", "gun", "run", "one", "won"], nonRhymes: ["son", "sin", "soon", "sand", "shine"] },
  { targetWord: "bed", rhymes: ["fed", "led", "red", "wed", "shed", "sped"], nonRhymes: ["bud", "bad", "bid", "bead", "boat"] },
  { targetWord: "hop", rhymes: ["bop", "cop", "mop", "pop", "stop", "top"], nonRhymes: ["hip", "hap", "help", "hoop", "hat"] },
  { targetWord: "ring", rhymes: ["bring", "king", "sing", "sting", "thing", "wing"], nonRhymes: ["rang", "rung", "rong", "ripe", "run"] },
  { targetWord: "light", rhymes: ["bite", "fight", "kite", "might", "night", "sight"], nonRhymes: ["lot", "lit", "late", "lift", "left"] },
  { targetWord: "blue", rhymes: ["clue", "due", "glue", "new", "true", "zoo"], nonRhymes: ["blow", "blew", "black", "brown", "bow"] }
];

// Vehicle types for the race
const vehicles = ["car", "rocket", "bike", "boat", "plane"];

const RhymeRacer = () => {
  const [currentRhymeSet, setCurrentRhymeSet] = useState<typeof rhymeSets[0] | null>(null);
  const [racingWords, setRacingWords] = useState<RacingWord[]>([]);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);
  
  const gameLoopRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const racetrackRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load high score from local storage
    const savedHighScore = localStorage.getItem('wordWizard_rhymeRacerHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  const startGame = () => {
    // Reset game state
    setGameActive(true);
    setScore(0);
    setTimeLeft(60);
    setRacingWords([]);
    setCurrentRhymeSet(rhymeSets[Math.floor(Math.random() * rhymeSets.length)]);
    
    // Start timer
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start game loop
    startGameLoop();
  };
  
  const endGame = () => {
    setGameActive(false);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    
    // Check for high score
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('wordWizard_rhymeRacerHighScore', score.toString());
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      toast({
        title: "New High Score!",
        description: `Congratulations! You set a new record of ${score} points!`,
      });
    } else {
      toast({
        title: "Game Over!",
        description: `Your final score is ${score} points.`,
      });
    }
  };
  
  const startGameLoop = () => {
    let lastSpawnTime = Date.now();
    let lastUpdateTime = Date.now();
    
    const spawnInterval = difficulty === "easy" ? 3000 : 
                        difficulty === "medium" ? 2000 : 1500;
    
    const animate = () => {
      const currentTime = Date.now();
      
      // Spawn new words at regular intervals
      if (currentTime - lastSpawnTime > spawnInterval && gameActive) {
        spawnRacingWord();
        lastSpawnTime = currentTime;
      }
      
      // Update word positions
      if (currentTime - lastUpdateTime > 16 && gameActive) { // ~60fps
        updateWordPositions();
        lastUpdateTime = currentTime;
      }
      
      if (gameActive) {
        gameLoopRef.current = requestAnimationFrame(animate);
      }
    };
    
    gameLoopRef.current = requestAnimationFrame(animate);
  };
  
  const spawnRacingWord = () => {
    if (!currentRhymeSet || !gameActive) return;
    
    const id = Date.now();
    const laneCount = 5;
    const lane = Math.floor(Math.random() * laneCount);
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    
    // Decide if this will be a rhyming word
    const isRhyme = Math.random() < 0.6; // 60% chance of rhyming word
    
    let word;
    if (isRhyme) {
      const rhymingWords = currentRhymeSet.rhymes.filter(
        w => !racingWords.find(rw => rw.word === w && !rw.clicked)
      );
      word = rhymingWords[Math.floor(Math.random() * rhymingWords.length)];
    } else {
      const nonRhymingWords = currentRhymeSet.nonRhymes.filter(
        w => !racingWords.find(rw => rw.word === w && !rw.clicked)
      );
      word = nonRhymingWords[Math.floor(Math.random() * nonRhymingWords.length)];
    }
    
    // If we've run out of words in our sets, pick a random one
    if (!word) {
      const allWords = [...currentRhymeSet.rhymes, ...currentRhymeSet.nonRhymes];
      word = allWords[Math.floor(Math.random() * allWords.length)];
    }
    
    // Adjust speed based on difficulty
    const baseSpeed = difficulty === "easy" ? 0.5 : 
                     difficulty === "medium" ? 0.8 : 1.2;
    const speed = baseSpeed + Math.random() * 0.3;
    
    const newWord: RacingWord = {
      id,
      word,
      rhymes: isRhyme,
      position: 0, // Start at the left
      speed,
      lane,
      vehicle,
      clicked: false
    };
    
    console.log("Spawning new word:", newWord);
    setRacingWords(prev => [...prev, newWord]);
  };
  
  const updateWordPositions = () => {
    if (!racetrackRef.current) return;
    
    const trackWidth = racetrackRef.current.offsetWidth;
    console.log("Track width:", trackWidth);
    
    setRacingWords(prev => {
      const updated = prev.map(word => {
        if (word.clicked) return word;
        
        // Move the word - fix position calculation
        const newPosition = word.position + word.speed;
        console.log(`Word ${word.word} position: ${word.position} -> ${newPosition}`);
        
        // Return updated word
        return {
          ...word,
          position: newPosition
        };
      });
      
      // Remove words that have gone off the track - proper calculation
      return updated.filter(word => word.position <= trackWidth);
    });
  };
  
  const handleWordClick = (word: RacingWord) => {
    if (!gameActive || word.clicked) return;
    
    // Mark as clicked
    setRacingWords(prev => 
      prev.map(w => w.id === word.id ? { ...w, clicked: true } : w)
    );
    
    // Check if it's a rhyme
    if (word.rhymes) {
      // Correct!
      audioService.playSound('success');
      const pointValue = difficulty === "easy" ? 1 : 
                        difficulty === "medium" ? 2 : 3;
      setScore(prev => prev + pointValue);
      
      // Visual feedback
      toast({
        title: "Correct!",
        description: `"${word.word}" rhymes with "${currentRhymeSet?.targetWord}"`,
        variant: "default"
      });
    } else {
      // Incorrect
      audioService.playSound('error');
      setScore(prev => Math.max(0, prev - 1));
      
      toast({
        title: "Oops!",
        description: `"${word.word}" doesn't rhyme with "${currentRhymeSet?.targetWord}"`,
        variant: "destructive"
      });
    }
  };
  
  const changeDifficulty = (newDifficulty: "easy" | "medium" | "hard") => {
    if (gameActive) {
      toast({
        title: "Game in progress",
        description: "Please end the current game before changing difficulty",
        variant: "destructive"
      });
      return;
    }
    
    setDifficulty(newDifficulty);
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-purple-100 to-blue-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-center text-purple-700">Rhyme Racer</h1>
          
          <Button 
            variant={gameActive ? "destructive" : "outline"}
            onClick={gameActive ? endGame : startGame}
            className="flex items-center gap-2"
          >
            {gameActive ? "End Game" : "New Game"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
            <GameHeader 
              score={score}
              targetWord={currentRhymeSet?.targetWord}
              timeLeft={timeLeft}
              difficulty={difficulty}
              gameActive={gameActive}
              onDifficultyChange={changeDifficulty}
            />
            
            {!gameActive ? (
              <div className="flex flex-col items-center justify-center py-10">
                <h2 className="text-xl font-bold mb-2">Click "New Game" to start!</h2>
                <p className="text-gray-600 text-center mb-4">
                  Click on words that rhyme with the target word as they race across the screen.
                </p>
                <div className="text-center">
                  <div className="font-medium">High Score: {highScore}</div>
                </div>
              </div>
            ) : (
              <RaceTrack 
                racetrackRef={racetrackRef}
                racingWords={racingWords}
                handleWordClick={handleWordClick}
              />
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">How to Play:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Words race across the screen in vehicles</li>
              <li>Click on words that <strong>rhyme</strong> with the target word</li>
              <li>Earn points for each correct rhyme</li>
              <li>Lose points for clicking non-rhyming words</li>
              <li>Complete as many rhymes as possible before time runs out</li>
            </ul>
            
            <div className="mt-4">
              <h4 className="font-medium mb-1">Difficulty Levels:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Easy:</strong> Slower speed, longer spawn time</li>
                <li><strong>Medium:</strong> Medium speed, more frequent words</li>
                <li><strong>Hard:</strong> Fast speed, very frequent words</li>
              </ul>
            </div>
            
            {currentRhymeSet && (
              <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                <h4 className="font-medium mb-1">Rhymes with "{currentRhymeSet.targetWord}":</h4>
                <div className="flex flex-wrap gap-2">
                  {currentRhymeSet.rhymes.map(word => (
                    <span key={word} className="inline-block px-2 py-1 bg-white rounded-full text-xs">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RhymeRacer;
