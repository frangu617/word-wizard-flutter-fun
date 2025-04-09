
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import Confetti from 'react-confetti';
import audioService from '@/services/audioService';
import { getRandomWords } from '@/services/wordService';
import GameBoard from '@/components/WordMatching/GameBoard';
import GameControls from '@/components/WordMatching/GameControls';
import { MatchingCard } from '@/components/WordMatching/MatchingCard';

// Define grid sizes based on difficulty
const gridSizes = {
  easy: { pairs: 6, cols: 3 },
  medium: { pairs: 8, cols: 4 },
  hard: { pairs: 12, cols: 4 }
};

const WordMatching = () => {
  const [cards, setCards] = useState<MatchingCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [totalPairs, setTotalPairs] = useState<number>(6);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<"word-word" | "word-definition" | "word-image">("word-word");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [gridCols, setGridCols] = useState<number>(3);
  
  // Start a new game when component mounts or when game mode/difficulty changes
  useEffect(() => {
    startNewGame();
  }, [gameMode, difficulty]);
  
  // Function to start a new game
  const startNewGame = () => {
    const currentGridSize = gridSizes[difficulty];
    setTotalPairs(currentGridSize.pairs);
    setGridCols(currentGridSize.cols);
    
    let newCards: MatchingCard[] = [];
    const words = getRandomWords(currentGridSize.pairs, difficulty);
    
    // Reset state
    setFlippedCards([]);
    setMatchedPairs(0);
    setGameCompleted(false);
    setShowConfetti(false);
    
    if (gameMode === "word-word") {
      // Create pairs of the same words
      words.forEach((word, index) => {
        // First card of the pair
        newCards.push({
          id: index * 2,
          content: word,
          type: "word",
          matched: false,
          flipped: false,
          matchId: index
        });
        
        // Second card of the pair
        newCards.push({
          id: index * 2 + 1,
          content: word,
          type: "word",
          matched: false,
          flipped: false,
          matchId: index
        });
      });
    } else if (gameMode === "word-definition") {
      // Create pairs of words and simple definitions
      const definitions = [
        "a furry pet that meows", "a pet that barks", "a yellow fruit", 
        "used to tell time", "the color of the sky", "a red fruit",
        "a big gray animal", "a sweet frozen treat", "falls from the sky",
        "you sleep in it", "you sit on it", "you eat with it",
        "worn on your feet", "covers your head", "used to write with",
        "you read this", "grows in gardens", "flies in the sky",
        "swims in water", "crawls on ground", "gives light"
      ];
      
      words.forEach((word, index) => {
        // Word card
        newCards.push({
          id: index * 2,
          content: word,
          type: "word",
          matched: false,
          flipped: false,
          matchId: index
        });
        
        // Definition card
        newCards.push({
          id: index * 2 + 1,
          content: definitions[index % definitions.length],
          type: "definition",
          matched: false,
          flipped: false,
          matchId: index
        });
      });
    } else if (gameMode === "word-image") {
      // Create pairs of words and emojis (simple visual representation)
      const emojis = ["🐱", "🐶", "🍌", "⏰", "🌈", "🍎", "🐘", "🍦", "☔", "🛏️", "🪑", "🍴", 
                      "👟", "🧢", "✏️", "📚", "🌷", "🦅", "🐟", "🐛", "💡"];
      
      words.forEach((word, index) => {
        // Word card
        newCards.push({
          id: index * 2,
          content: word,
          type: "word",
          matched: false,
          flipped: false,
          matchId: index
        });
        
        // Image/emoji card
        newCards.push({
          id: index * 2 + 1,
          content: emojis[index % emojis.length],
          type: "image",
          matched: false,
          flipped: false,
          matchId: index
        });
      });
    }
    
    // Shuffle the cards
    newCards = shuffleArray(newCards);
    
    console.log("Creating new cards:", newCards);
    setCards(newCards);
  };
  
  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: MatchingCard[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Handle card click
  const handleCardClick = (id: number) => {
    // Don't allow clicks during checking or if card is already flipped/matched
    if (isChecking) return;
    
    const clickedCard = cards.find(card => card.id === id);
    if (!clickedCard || clickedCard.matched || clickedCard.flipped) return;
    
    // Don't allow more than 2 cards to be flipped at once
    if (flippedCards.length >= 2) return;
    
    // Update the flipped status of the clicked card
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    );
    
    setCards(updatedCards);
    setFlippedCards([...flippedCards, id]);
    
    // If this is the second card flipped, check for a match
    if (flippedCards.length === 1) {
      setIsChecking(true);
      
      // Check if the two flipped cards match
      setTimeout(() => {
        const firstCardId = flippedCards[0];
        const secondCardId = id;
        
        const firstCard = updatedCards.find(card => card.id === firstCardId);
        const secondCard = updatedCards.find(card => card.id === secondCardId);
        
        if (firstCard && secondCard && firstCard.matchId === secondCard.matchId) {
          // Match found
          const matchedCards = updatedCards.map(card => 
            (card.id === firstCardId || card.id === secondCardId) 
              ? { ...card, matched: true, flipped: false } 
              : card
          );
          
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs(prev => prev + 1);
          
          // Play success sound
          audioService.playSound('success');
          
          // Show toast for successful match
          toast({
            title: "Match found!",
            description: "Great job! Keep going.",
          });
          
          // Check if the game is completed
          if (matchedPairs + 1 === totalPairs) {
            setGameCompleted(true);
            setShowConfetti(true);
            
            // Play victory sound
            audioService.speak("Congratulations! You've matched all the pairs!");
            
            // Show toast for game completion
            toast({
              title: "Game completed!",
              description: "Congratulations! You've matched all the pairs!",
            });
            
            // Hide confetti after a few seconds
            setTimeout(() => {
              setShowConfetti(false);
            }, 5000);
          }
        } else {
          // No match found
          const resetFlippedCards = updatedCards.map(card => 
            (card.id === firstCardId || card.id === secondCardId) 
              ? { ...card, flipped: false } 
              : card
          );
          
          setCards(resetFlippedCards);
          setFlippedCards([]);
          
          // Play error sound
          audioService.playSound('error');
        }
        
        setIsChecking(false);
      }, 1000);
    }
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-yellow-100 to-yellow-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-center text-yellow-700">Word Matching</h1>
          
          <Button 
            variant="outline" 
            onClick={startNewGame}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            New Game
          </Button>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-6">
          <GameControls 
            gameMode={gameMode}
            difficulty={difficulty}
            onGameModeChange={(value) => setGameMode(value)}
            onDifficultyChange={(value) => setDifficulty(value)}
            matchedPairs={matchedPairs}
            totalPairs={totalPairs}
          />
          
          <GameBoard 
            cards={cards}
            handleCardClick={handleCardClick}
            gridCols={gridCols}
          />
          
          {gameCompleted && (
            <div className="mt-6 bg-green-100 p-4 rounded-lg text-center">
              <p className="text-green-800 font-bold text-xl">Congratulations!</p>
              <p className="text-green-700">You've successfully matched all the pairs!</p>
              <Button 
                onClick={startNewGame} 
                className="mt-3 bg-green-600 hover:bg-green-700"
              >
                Play Again
              </Button>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow max-w-2xl mx-auto">
          <h3 className="text-lg font-bold mb-2">How to Play:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Click on cards to flip them and find matching pairs</li>
            <li>Only two cards can be flipped at once</li>
            <li>Match all pairs to win the game</li>
            <li>Choose different modes for more challenge:</li>
            <ul className="list-circle pl-5 space-y-1 mt-1">
              <li><span className="font-semibold">Word-Word:</span> Match identical words</li>
              <li><span className="font-semibold">Word-Definition:</span> Match words with their definitions</li>
              <li><span className="font-semibold">Word-Image:</span> Match words with related images</li>
            </ul>
            <li>Difficulty levels change both word complexity and grid size</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WordMatching;
