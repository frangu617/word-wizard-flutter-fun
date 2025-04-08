
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Repeat, Home, Plus, Save, Trash } from 'lucide-react';
import WordCard from '@/components/WordCard';
import { getRandomWords, addCustomSightWord } from '@/services/wordService';
import audioService from '@/services/audioService';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const Flashcards = () => {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSyllables, setShowSyllables] = useState(true);
  const [newWord, setNewWord] = useState('');
  const [customSet, setCustomSet] = useState<string[]>([]);
  const [isCustom, setIsCustom] = useState(false);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  
  useEffect(() => {
    // Get 10 random words initially
    loadRandomWords();
  }, []);
  
  const loadRandomWords = () => {
    setWords(getRandomWords(10));
    setIsCustom(false);
    setCurrentIndex(0);
  };
  
  const loadCustomWords = () => {
    if (customSet.length > 0) {
      setWords(customSet);
      setIsCustom(true);
      setCurrentIndex(0);
      // Speak the first word
      if (customSet[0]) {
        audioService.speak(customSet[0], true);
      }
    } else {
      toast({
        title: "No custom words",
        description: "You haven't added any custom words yet.",
        variant: "destructive"
      });
    }
  };
  
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
    if (isCustom) {
      const shuffled = [...customSet].sort(() => 0.5 - Math.random());
      setWords(shuffled);
    } else {
      setWords(getRandomWords(10));
    }
    setCurrentIndex(0);
    // Speak the first word of the new set
    if (words[0]) {
      audioService.speak(words[0], true);
    }
  };
  
  const addWordToCustomSet = () => {
    if (!newWord.trim()) {
      toast({
        title: "Empty word",
        description: "Please enter a word to add.",
        variant: "destructive"
      });
      return;
    }
    
    if (customSet.includes(newWord.trim().toLowerCase())) {
      toast({
        title: "Duplicate word",
        description: "This word is already in your custom set.",
        variant: "destructive"
      });
      return;
    }
    
    // Add to custom set
    const updatedSet = [...customSet, newWord.trim().toLowerCase()];
    setCustomSet(updatedSet);
    setNewWord('');
    
    // Also add to sight words for future use
    addCustomSightWord(newWord.trim().toLowerCase());
    
    toast({
      title: "Word added",
      description: `"${newWord.trim().toLowerCase()}" has been added to your custom set.`,
    });
  };
  
  const removeFromCustomSet = (wordToRemove: string) => {
    const updatedSet = customSet.filter(word => word !== wordToRemove);
    setCustomSet(updatedSet);
    
    // If we're viewing the custom set, update the current words too
    if (isCustom) {
      setWords(updatedSet);
      if (currentIndex >= updatedSet.length) {
        setCurrentIndex(Math.max(0, updatedSet.length - 1));
      }
    }
    
    toast({
      title: "Word removed",
      description: `"${wordToRemove}" has been removed from your custom set.`,
    });
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
        <div className="w-full flex justify-between mb-4">
          <Button 
            onClick={loadRandomWords}
            className={`${!isCustom ? 'bg-kid-purple' : 'bg-gray-300'} hover:bg-kid-purple/80`}
          >
            Random Words
          </Button>
          
          <Button 
            onClick={loadCustomWords}
            className={`${isCustom ? 'bg-kid-purple' : 'bg-gray-300'} hover:bg-kid-purple/80`}
          >
            My Words
          </Button>
          
          <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
            <DialogTrigger asChild>
              <Button className="bg-kid-green hover:bg-kid-green/80">
                <Plus className="mr-2" /> Add Words
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md">
              <DialogHeader>
                <DialogTitle>Create Custom Flashcards</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="flex gap-2">
                  <Input 
                    value={newWord} 
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="Enter a word..."
                    className="text-lg"
                    onKeyDown={(e) => e.key === 'Enter' && addWordToCustomSet()}
                  />
                  <Button onClick={addWordToCustomSet} className="bg-kid-blue hover:bg-kid-blue/80">
                    <Save className="mr-2" /> Add
                  </Button>
                </div>
                
                {customSet.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-bold mb-2">Your Custom Words:</h3>
                      <div className="flex flex-wrap gap-2">
                        {customSet.map(word => (
                          <div key={word} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                            <span className="mr-2">{word}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full hover:bg-red-100 p-1"
                              onClick={() => removeFromCustomSet(word)}
                            >
                              <Trash className="h-4 w-4 text-kid-red" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      
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
              <Repeat className="mr-2" /> Shuffle Words
            </Button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-xl">No flashcards available. Add some custom words!</p>
            <Button 
              onClick={() => setShowCustomDialog(true)}
              className="mt-4 bg-kid-green hover:bg-kid-green/80"
            >
              <Plus className="mr-2" /> Add Words
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;
