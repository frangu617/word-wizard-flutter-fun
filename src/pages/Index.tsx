
import React from 'react';
import KidNavButton from '@/components/KidNavButton';
import { Book, Search, Clock, BookOpen } from 'lucide-react';
import { Flashcard } from '@/components/lucide-icons';
import { getRandomWords } from '@/services/wordService';
import WordCard from '@/components/WordCard';

const Index = () => {
  const [featuredWords, setFeaturedWords] = React.useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);

  React.useEffect(() => {
    // Get 5 random sight words to feature
    setFeaturedWords(getRandomWords(5));
  }, []);

  const nextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % featuredWords.length);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-50">
      <header className="text-center mb-8 pt-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-kid-blue">
          Word Wizard
        </h1>
        <p className="text-xl text-gray-600">Learn to read with fun!</p>
      </header>

      {/* Featured Sight Word */}
      {featuredWords.length > 0 && (
        <div className="mb-12 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-kid-purple">Today's Sight Word</h2>
          <div className="w-full max-w-sm" onClick={nextWord}>
            <WordCard 
              word={featuredWords[currentWordIndex]} 
              className="cursor-pointer hover:scale-105 transition-transform animate-pop"
            />
          </div>
          <p className="mt-4 text-gray-600">Tap the card to see more words!</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <KidNavButton
          to="/flashcards"
          color="kid-red"
          icon={<Flashcard />}
        >
          Flashcards
        </KidNavButton>
        
        <KidNavButton
          to="/dictionary"
          color="kid-blue"
          icon={<Book />}
        >
          Dictionary
        </KidNavButton>
        
        <KidNavButton
          to="/word-search"
          color="kid-green"
          icon={<Search />}
        >
          Word Search
        </KidNavButton>
        
        <KidNavButton
          to="/reading-test"
          color="kid-purple"
          icon={<Clock />}
        >
          Reading Test
        </KidNavButton>
        
        <KidNavButton
          to="/syllables"
          color="kid-orange"
          icon={<BookOpen />}
        >
          Syllables
        </KidNavButton>
      </div>
    </div>
  );
};

export default Index;
