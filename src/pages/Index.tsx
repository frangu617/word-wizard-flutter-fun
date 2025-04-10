import React, { useState } from 'react';
import KidNavButton from '@/components/KidNavButton';
import { Book, Search, Clock, BookOpen, Target, Grid3X3, Puzzle, AlignJustify, ArrowUpDown, Music, Car, Footprints, Palette, Feather, Plus } from 'lucide-react';
import { Flashcard } from '@/components/lucide-icons';
import { getRandomWords, getSightWords, addCustomSightWord } from '@/services/wordService';
import WordCard from '@/components/WordCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [featuredWords, setFeaturedWords] = React.useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [newWord, setNewWord] = useState('');
  const [showAddWordDialog, setShowAddWordDialog] = useState(false);

  React.useEffect(() => {
    // Get 5 random sight words to feature
    setFeaturedWords(getRandomWords(5));
  }, []);

  const nextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % featuredWords.length);
  };

  const handleAddWord = () => {
    const word = newWord.trim().toLowerCase();
    
    if (!word) {
      toast({
        title: "Word is empty",
        description: "Please enter a word",
        variant: "destructive"
      });
      return;
    }

    if (word.length > 10) {
      toast({
        title: "Word is too long",
        description: "Word must be 10 characters or less",
        variant: "destructive"
      });
      return;
    }

    // Add the word to the list
    addCustomSightWord(word);
    
    // Refresh the featured words
    setFeaturedWords(getRandomWords(5));
    
    // Reset input and close dialog
    setNewWord('');
    setShowAddWordDialog(false);
    
    toast({
      title: "Word added!",
      description: `"${word}" has been added to your sight words.`
    });
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
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-kid-purple">Today's Sight Word</h2>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white"
              onClick={() => setShowAddWordDialog(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
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
      <Tabs defaultValue="core" className="w-full max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="core">Core Games</TabsTrigger>
          <TabsTrigger value="all">All Games</TabsTrigger>
        </TabsList>
        
        <TabsContent value="core" className="mt-0">
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
              to="/word-shooter-warning"
              color="kid-orange"
              icon={<Target />}
            >
              Word Shooter
            </KidNavButton>
            
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <KidNavButton
              to="/sight-word-bingo"
              color="kid-red"
              icon={<Grid3X3 />}
            >
              Sight Word Bingo
            </KidNavButton>
            
            <KidNavButton
              to="/word-matching"
              color="kid-blue"
              icon={<Puzzle />}
            >
              Word Matching
            </KidNavButton>
            
            <KidNavButton
              to="/sentence-builder"
              color="kid-green"
              icon={<AlignJustify />}
            >
              Sentence Builder
            </KidNavButton>
            
            <KidNavButton
              to="/word-ladder"
              color="kid-purple"
              icon={<ArrowUpDown />}
            >
              Word Ladder
            </KidNavButton>
            
            <KidNavButton
              to="/letter-sound-pop"
              color="kid-orange"
              icon={<Music />}
            >
              Letter Sound Pop
            </KidNavButton>
            
            <KidNavButton
              to="/missing-letter"
              color="kid-red"
              icon={<Feather />}
            >
              Missing Letter
            </KidNavButton>
            
            <KidNavButton
              to="/rhyme-racer"
              color="kid-blue"
              icon={<Car />}
            >
              Rhyme Racer
            </KidNavButton>
            
            <KidNavButton
              to="/word-maze"
              color="kid-green"
              icon={<Footprints />}
            >
              Word Maze
            </KidNavButton>
            
            <KidNavButton
              to="/story-builder"
              color="kid-purple"
              icon={<Feather />}
            >
              Story Builder
            </KidNavButton>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Word Dialog */}
      <Dialog open={showAddWordDialog} onOpenChange={setShowAddWordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a New Sight Word</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Input 
                placeholder="Enter a word" 
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                maxLength={10}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddWord();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddWordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWord} className="bg-kid-purple hover:bg-kid-purple/90">
              Add Word
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
