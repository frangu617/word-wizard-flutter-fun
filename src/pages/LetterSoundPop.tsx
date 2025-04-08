
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import audioService from '@/services/audioService';
import { ArrowLeft, RefreshCcw, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define letter sounds
const letterSounds = {
  singleLetters: [
    { letter: "a", sound: "ah", phonetic: "/æ/ as in cat" },
    { letter: "b", sound: "buh", phonetic: "/b/ as in bat" },
    { letter: "c", sound: "kuh", phonetic: "/k/ as in cat" },
    { letter: "d", sound: "duh", phonetic: "/d/ as in dog" },
    { letter: "e", sound: "eh", phonetic: "/ɛ/ as in egg" },
    { letter: "f", sound: "fuh", phonetic: "/f/ as in fish" },
    { letter: "g", sound: "guh", phonetic: "/g/ as in go" },
    { letter: "h", sound: "huh", phonetic: "/h/ as in hat" },
    { letter: "i", sound: "ih", phonetic: "/ɪ/ as in sit" },
    { letter: "j", sound: "juh", phonetic: "/dʒ/ as in jump" },
    { letter: "k", sound: "kuh", phonetic: "/k/ as in kite" },
    { letter: "l", sound: "luh", phonetic: "/l/ as in look" },
    { letter: "m", sound: "muh", phonetic: "/m/ as in mom" },
    { letter: "n", sound: "nuh", phonetic: "/n/ as in no" },
    { letter: "o", sound: "oh", phonetic: "/ɒ/ as in hot" },
    { letter: "p", sound: "puh", phonetic: "/p/ as in pen" },
    { letter: "q", sound: "kwuh", phonetic: "/kw/ as in queen" },
    { letter: "r", sound: "ruh", phonetic: "/r/ as in run" },
    { letter: "s", sound: "sss", phonetic: "/s/ as in sun" },
    { letter: "t", sound: "tuh", phonetic: "/t/ as in top" },
    { letter: "u", sound: "uh", phonetic: "/ʌ/ as in cup" },
    { letter: "v", sound: "vuh", phonetic: "/v/ as in van" },
    { letter: "w", sound: "wuh", phonetic: "/w/ as in win" },
    { letter: "x", sound: "ks", phonetic: "/ks/ as in box" },
    { letter: "y", sound: "yuh", phonetic: "/j/ as in yes" },
    { letter: "z", sound: "zzz", phonetic: "/z/ as in zoo" }
  ],
  blends: [
    { letter: "sh", sound: "shh", phonetic: "/ʃ/ as in ship" },
    { letter: "ch", sound: "ch", phonetic: "/tʃ/ as in chair" },
    { letter: "th", sound: "th", phonetic: "/θ/ as in think" },
    { letter: "wh", sound: "wh", phonetic: "/hw/ as in what" },
    { letter: "ph", sound: "f", phonetic: "/f/ as in phone" },
    { letter: "qu", sound: "kw", phonetic: "/kw/ as in queen" },
    { letter: "bl", sound: "bl", phonetic: "/bl/ as in blue" },
    { letter: "cl", sound: "cl", phonetic: "/kl/ as in clock" },
    { letter: "fl", sound: "fl", phonetic: "/fl/ as in fly" },
    { letter: "gl", sound: "gl", phonetic: "/gl/ as in glad" },
    { letter: "pl", sound: "pl", phonetic: "/pl/ as in play" },
    { letter: "sl", sound: "sl", phonetic: "/sl/ as in sleep" },
    { letter: "br", sound: "br", phonetic: "/br/ as in brown" },
    { letter: "cr", sound: "cr", phonetic: "/kr/ as in cry" },
    { letter: "dr", sound: "dr", phonetic: "/dr/ as in drive" },
    { letter: "fr", sound: "fr", phonetic: "/fr/ as in frog" },
    { letter: "gr", sound: "gr", phonetic: "/gr/ as in green" },
    { letter: "pr", sound: "pr", phonetic: "/pr/ as in price" },
    { letter: "tr", sound: "tr", phonetic: "/tr/ as in tree" },
    { letter: "st", sound: "st", phonetic: "/st/ as in stop" },
    { letter: "sp", sound: "sp", phonetic: "/sp/ as in spot" },
    { letter: "sk", sound: "sk", phonetic: "/sk/ as in sky" },
    { letter: "sm", sound: "sm", phonetic: "/sm/ as in small" },
    { letter: "sn", sound: "sn", phonetic: "/sn/ as in snow" }
  ]
};

// Define types
type Balloon = {
  id: number;
  letter: string;
  sound: string;
  phonetic: string;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  popped: boolean;
};

const colors = [
  "bg-red-400", "bg-blue-400", "bg-green-400", 
  "bg-yellow-400", "bg-purple-400", "bg-pink-400",
  "bg-orange-400", "bg-teal-400", "bg-indigo-400"
];

const LetterSoundPop = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [currentSound, setCurrentSound] = useState<string>("");
  const [currentPhonetic, setCurrentPhonetic] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [gameMode, setGameMode] = useState<"singleLetters" | "blends" | "mixed">("singleLetters");
  const [roundActive, setRoundActive] = useState<boolean>(false);
  const [roundTime, setRoundTime] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  
  const timerRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  useEffect(() => {
    if (roundActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [roundActive, timeLeft]);
  
  const startRound = () => {
    setRoundActive(true);
    setScore(0);
    setTimeLeft(roundTime);
    generateBalloons();
    playCurrentSound();
  };
  
  const endRound = () => {
    setRoundActive(false);
    setBalloons([]);
    
    if (score > 5) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    toast({
      title: "Round Over!",
      description: `You popped ${score} balloons!`,
    });
  };
  
  const generateBalloons = () => {
    // Determine which sound set to use
    let soundSet = letterSounds.singleLetters;
    if (gameMode === "blends") {
      soundSet = letterSounds.blends;
    } else if (gameMode === "mixed") {
      soundSet = [...letterSounds.singleLetters, ...letterSounds.blends];
    }
    
    // Choose a random sound to be the target
    const targetIndex = Math.floor(Math.random() * soundSet.length);
    const targetSound = soundSet[targetIndex];
    
    setCurrentSound(targetSound.sound);
    setCurrentPhonetic(targetSound.phonetic);
    
    // Generate 6-8 balloons, including 1-3 with the target sound
    const numberOfBalloons = 6 + Math.floor(Math.random() * 3);
    const numberOfTargets = 1 + Math.floor(Math.random() * Math.min(3, level));
    
    const newBalloons: Balloon[] = [];
    
    // Add target balloons
    for (let i = 0; i < numberOfTargets; i++) {
      newBalloons.push(createBalloon(targetSound, i));
    }
    
    // Add distractor balloons
    let distractorCount = 0;
    while (newBalloons.length < numberOfBalloons) {
      const randomIndex = Math.floor(Math.random() * soundSet.length);
      if (randomIndex !== targetIndex) {
        newBalloons.push(createBalloon(soundSet[randomIndex], numberOfTargets + distractorCount));
        distractorCount++;
      }
    }
    
    // Shuffle the balloons
    shuffleArray(newBalloons);
    
    setBalloons(newBalloons);
  };
  
  const createBalloon = (
    soundObj: { letter: string, sound: string, phonetic: string }, 
    id: number
  ): Balloon => {
    const maxWidth = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 800;
    const x = 50 + Math.random() * (maxWidth - 100);
    const y = 600 + Math.random() * 200; // Start below the viewport
    const color = colors[Math.floor(Math.random() * colors.length)];
    const speed = 1 + Math.random() * 1.5;
    const size = 70 + Math.floor(Math.random() * 30);
    
    return {
      id,
      letter: soundObj.letter,
      sound: soundObj.sound,
      phonetic: soundObj.phonetic,
      x,
      y,
      color,
      speed,
      size,
      popped: false
    };
  };
  
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  
  const playCurrentSound = () => {
    if (muted) return;
    
    // Play the current sound
    audioService.speak(currentSound);
  };
  
  const handleBalloonClick = (balloon: Balloon) => {
    if (!roundActive || balloon.popped) return;
    
    if (balloon.sound === currentSound) {
      // Correct balloon pop
      const updatedBalloons = balloons.map(b => 
        b.id === balloon.id ? { ...b, popped: true } : b
      );
      
      setBalloons(updatedBalloons);
      setScore(prev => prev + 1);
      
      audioService.playSound('success');
      
      // Check if all target balloons are popped
      const allTargetsPopped = updatedBalloons
        .filter(b => b.sound === currentSound)
        .every(b => b.popped);
      
      if (allTargetsPopped) {
        // Generate new set of balloons
        setTimeout(() => {
          generateBalloons();
          playCurrentSound();
        }, 1000);
      }
    } else {
      // Wrong balloon
      audioService.playSound('error');
      
      toast({
        title: "Oops!",
        description: `That's the letter "${balloon.letter}" which makes the sound "${balloon.sound}"`,
        variant: "destructive"
      });
    }
  };
  
  const toggleMute = () => {
    setMuted(!muted);
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 to-sky-50 overflow-hidden">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-center text-blue-700">Letter Sound Pop</h1>
          
          <Button 
            variant="outline" 
            onClick={toggleMute}
            className="flex items-center gap-2"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {muted ? "Unmute" : "Mute"}
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
                <div className="text-sm text-gray-500">Time Left:</div>
                <div className="text-xl font-bold">{timeLeft}s</div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">Mode:</div>
                <Select
                  value={gameMode}
                  onValueChange={(value) => setGameMode(value as "singleLetters" | "blends" | "mixed")}
                  disabled={roundActive}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="singleLetters">Single Letters</SelectItem>
                    <SelectItem value="blends">Blends</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {!roundActive ? (
              <div className="flex flex-col items-center justify-center my-10">
                <h2 className="text-xl font-bold mb-6">Ready to pop some letter balloons?</h2>
                <Button
                  onClick={startRound}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Game
                </Button>
              </div>
            ) : (
              <div className="relative h-80 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {/* Current sound display */}
                <div className="absolute top-4 left-0 right-0 flex justify-center">
                  <div 
                    onClick={playCurrentSound}
                    className="bg-white px-4 py-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-50 flex items-center gap-2"
                  >
                    <div className="font-bold text-xl">"{currentSound}"</div>
                    <Volume2 className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                
                {/* Balloons */}
                <AnimatePresence>
                  {balloons.map(balloon => (
                    !balloon.popped && (
                      <motion.div
                        key={balloon.id}
                        className={`absolute cursor-pointer flex items-center justify-center rounded-full ${balloon.color}`}
                        style={{
                          width: `${balloon.size}px`,
                          height: `${balloon.size * 1.2}px`,
                          left: `${balloon.x}px`,
                        }}
                        initial={{ y: balloon.y }}
                        animate={{ y: -balloon.size * 1.5 }}
                        transition={{ 
                          duration: balloon.y / (balloon.speed * 50),
                          ease: "linear"
                        }}
                        onClick={() => handleBalloonClick(balloon)}
                      >
                        <div className="font-bold text-white text-lg">
                          {balloon.letter}
                        </div>
                        <div 
                          className="absolute bottom-0 w-1 h-10 bg-gray-400"
                          style={{ transform: "translateY(100%)" }}
                        />
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {roundActive && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">{currentPhonetic}</p>
                <p className="text-sm">Click on balloons with the "{currentSound}" sound</p>
              </div>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">How to Play:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Listen to the letter sound</li>
              <li>Pop balloons that match the sound</li>
              <li>Avoid popping balloons with different sounds</li>
              <li>Click the sound to hear it again</li>
            </ul>
            
            <div className="mt-4">
              <h4 className="font-medium mb-1">Game Modes:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Single Letters:</strong> Basic letter sounds (a, b, c)</li>
                <li><strong>Blends:</strong> Letter combinations (sh, ch, th)</li>
                <li><strong>Mixed:</strong> Both single letters and blends</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterSoundPop;
