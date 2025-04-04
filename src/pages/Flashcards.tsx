
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Repeat, Home } from 'lucide-react';
import WordCard from '@/components/WordCard';
import { getRandomWords } from '@/services/wordService';
import audioService from '@/services/audioService';

const Flashcards = () => {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSyllables, setShowSyllables] = useState(true);
  
  useEffect(() => {
    // Get 10 random words
    setWords(getRandomWords(10));
  }, []);
  
  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (words[currentIndex + 1]) {
        audioService.speak(words[currentIndex + 1], true);
      }
    }
  };
  
  const prevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (words[currentIndex - 1]) {
        audioService.speak(words[currentIndex - 1], true);
      }
    }
  };
  
  const shuffleWords = () => {
    setWords(getRandomWords(10));
    setCurrentIndex(0);
    // Speak the first word of the new set
    if (words[0]) {
      audioService.speak(words[0], true);
    }
  };
  
  // Speak the current word when first rendered
  useEffect(() => {
    if (words.length > 0) {
      audioService.speak(words[currentIndex], true);
    }
  }, [words, currentIndex]);
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-50">
      <header className="flex justify-between items-center mb-8">
        <Link to="/" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
          <Home className="h-6 w-6 text-kid-blue" />
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-kid-red">Flashcards</h1>
        <Button 
          onClick={() => setShowSyllables(!showSyllables)} 
          variant="outline" 
          className="bg-white border-kid-purple text-kid-purple hover:bg-kid-purple hover:text-white"
        >
          {showSyllables ? "Hide Syllables" : "Show Syllables"}
        </Button>
      </header>
      
      <div className="flex flex-col items-center justify-center max-w-lg mx-auto">
        {words.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              Card {currentIndex + 1} of {words.length}
            </div>
            
            <WordCard 
              word={words[currentIndex]} 
              showSyllables={showSyllables} 
              className="mb-8 h-64 w-full"
            />
            
            <div className="flex justify-between w-full mb-8">
              <Button 
                onClick={prevWord} 
                disabled={currentIndex === 0}
                className="bg-kid-blue hover:bg-kid-blue/80 p-6"
              >
                <ArrowLeft className="mr-2" /> Previous
              </Button>
              
              <Button 
                onClick={nextWord} 
                disabled={currentIndex === words.length - 1}
                className="bg-kid-blue hover:bg-kid-blue/80 p-6"
              >
                Next <ArrowRight className="ml-2" />
              </Button>
            </div>
            
            <Button 
              onClick={shuffleWords} 
              className="bg-kid-green hover:bg-kid-green/80 p-6"
            >
              <Repeat className="mr-2" /> New Words
            </Button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-xl">Loading flashcards...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
