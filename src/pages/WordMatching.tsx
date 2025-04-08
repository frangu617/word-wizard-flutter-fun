
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getRandomWords } from '@/services/wordService';
import { toast } from "@/components/ui/use-toast";
import audioService from '@/services/audioService';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Define card types for different difficulty levels
type MatchingCard = {
  id: number;
  content: string;
  type: 'word' | 'image' | 'definition';
  matched: boolean;
  flipped: boolean;
  matchId: number;
};

const WordMatching = () => {
  const [cards, setCards] = useState<MatchingCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [totalPairs, setTotalPairs] = useState<number>(8);
  const [moves, setMoves] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  useEffect(() => {
    startNewGame();
  }, [difficulty]);

  const startNewGame = () => {
    setIsLoading(true);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameWon(false);

    // Get random words
    const wordCount = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 6 : 5;
    setTotalPairs(wordCount);
    const randomWords = getRandomWords(wordCount);
    
    // Create cards based on difficulty
    let newCards: MatchingCard[] = [];
    
    if (difficulty === 'easy') {
      // Match words with identical words
      const cardPairs = randomWords.flatMap((word, index) => {
        return [
          {
            id: index * 2,
            content: word,
            type: 'word',
            matched: false,
            flipped: false,
            matchId: index
          },
          {
            id: index * 2 + 1,
            content: word, 
            type: 'word',
            matched: false,
            flipped: false,
            matchId: index
          }
        ];
      });
      newCards = cardPairs;
    } 
    else if (difficulty === 'medium') {
      // Match words with "images" (in this case just descriptions like "a red apple")
      const images = [
        "a red apple", "a blue ball", "a green tree", 
        "a yellow sun", "a brown dog", "a pink flower"
      ];
      
      const cardPairs = randomWords.slice(0, 6).flatMap((word, index) => {
        return [
          {
            id: index * 2,
            content: word,
            type: 'word',
            matched: false,
            flipped: false,
            matchId: index
          },
          {
            id: index * 2 + 1,
            content: images[index],
            type: 'image',
            matched: false,
            flipped: false,
            matchId: index
          }
        ];
      });
      newCards = cardPairs;
    }
    else {
      // Match words with simple definitions
      const definitions = [
        "to look at words on a page", 
        "a color of the sky", 
        "the opposite of big",
        "something you write with",
        "a place to live in"
      ];
      
      const cardPairs = randomWords.slice(0, 5).flatMap((word, index) => {
        return [
          {
            id: index * 2,
            content: word,
            type: 'word',
            matched: false,
            flipped: false,
            matchId: index
          },
          {
            id: index * 2 + 1,
            content: definitions[index],
            type: 'definition',
            matched: false,
            flipped: false,
            matchId: index
          }
        ];
      });
      newCards = cardPairs;
    }
    
    // Shuffle the cards
    const shuffledCards = [...newCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setIsLoading(false);
  };

  const handleCardClick = (id: number) => {
    // Ignore clicks if already flipped, matched, or more than 2 cards flipped
    if (
      flippedCards.includes(id) || 
      cards.find(card => card.id === id)?.matched || 
      flippedCards.length >= 2 ||
      gameWon
    ) {
      return;
    }

    // Flip the card
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // Check for match if 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const firstCard = cards.find(card => card.id === newFlippedCards[0]);
      const secondCard = cards.find(card => card.id === newFlippedCards[1]);
      
      if (firstCard && secondCard && firstCard.matchId === secondCard.matchId) {
        // Match found
        setTimeout(() => {
          const updatedCards = cards.map(card => {
            if (card.id === firstCard.id || card.id === secondCard.id) {
              return { ...card, matched: true };
            }
            return card;
          });
          
          setCards(updatedCards);
          setFlippedCards([]);
          setMatchedPairs(prev => {
            const newMatched = prev + 1;
            if (newMatched === totalPairs) {
              setGameWon(true);
              audioService.speak("You won! Great job!", false);
            } else {
              audioService.playSound('success');
            }
            return newMatched;
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
          audioService.playSound('error');
        }, 1000);
      }
    }
  };

  const getCardStyle = (card: MatchingCard) => {
    if (card.matched) {
      return "bg-green-200 text-green-800 border-2 border-green-500";
    }
    
    if (flippedCards.includes(card.id)) {
      if (card.type === 'word') {
        return "bg-blue-100 text-blue-800 border-2 border-blue-500";
      } else if (card.type === 'image') {
        return "bg-purple-100 text-purple-800 border-2 border-purple-500";
      } else {
        return "bg-amber-100 text-amber-800 border-2 border-amber-500";
      }
    }
    
    return "bg-white hover:bg-gray-100";
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-yellow-100 to-orange-50">
      {gameWon && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-center text-amber-700">Word Matching</h1>
          
          <Button 
            variant="outline" 
            onClick={startNewGame}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            New Game
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow flex-1">
            <div className="flex justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500">Matches:</div>
                <div className="text-xl font-bold">{matchedPairs} / {totalPairs}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Moves:</div>
                <div className="text-xl font-bold">{moves}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <RadioGroup 
                value={difficulty} 
                onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard">Hard</Label>
                </div>
              </RadioGroup>
            </div>
            
            {gameWon && (
              <div className="bg-green-100 p-3 rounded-lg text-center mb-4">
                <p className="text-green-800 font-bold">Great job! You matched all the words!</p>
                <p className="text-green-600">Total moves: {moves}</p>
              </div>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow flex-1">
            <h3 className="text-lg font-bold mb-2">How to Play:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Click on cards to flip them over</li>
              <li>Try to find matching pairs</li>
              <li>
                {difficulty === 'easy' && 'Match identical words'}
                {difficulty === 'medium' && 'Match words with their images'}
                {difficulty === 'hard' && 'Match words with their definitions'}
              </li>
              <li>Complete the game with as few moves as possible</li>
            </ul>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center p-8">Loading game...</div>
        ) : (
          <div className={`grid gap-3 w-full mx-auto ${
            difficulty === 'easy' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' 
              : difficulty === 'medium'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
          }`}>
            {cards.map(card => (
              <Card
                key={card.id}
                className={`
                  p-3 cursor-pointer flex items-center justify-center 
                  min-h-24 text-center transition-all transform
                  ${getCardStyle(card)}
                  ${(card.matched || flippedCards.includes(card.id)) ? 'scale-105' : ''}
                `}
                onClick={() => handleCardClick(card.id)}
              >
                {card.matched || flippedCards.includes(card.id) ? (
                  <div className="font-medium">
                    {card.content}
                  </div>
                ) : (
                  <div className="text-xl font-bold text-gray-400">?</div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WordMatching;
