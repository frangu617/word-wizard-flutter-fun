
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface WordEntryFormProps {
  onAddWords: (words: string[]) => void;
  maxWords?: number;
}

const WordEntryForm: React.FC<WordEntryFormProps> = ({ 
  onAddWords, 
  maxWords = 10 
}) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [error, setError] = useState('');
  
  const handleAddWord = () => {
    const word = currentWord.trim().toLowerCase();
    
    // Validate the word
    if (!word) {
      setError('Please enter a word');
      return;
    }
    
    if (word.length > 10) {
      setError('Word must be 10 characters or less');
      return;
    }
    
    if (words.includes(word)) {
      setError('This word is already in the list');
      return;
    }
    
    if (words.length >= maxWords) {
      setError(`You can only add up to ${maxWords} words`);
      return;
    }
    
    // Add the word to the list
    setWords([...words, word]);
    setCurrentWord('');
    setError('');
  };
  
  const handleRemoveWord = (wordToRemove: string) => {
    setWords(words.filter(word => word !== wordToRemove));
  };
  
  const handleSubmit = () => {
    if (words.length > 0) {
      onAddWords(words);
    } else {
      setError('Please add at least one word');
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <div className="flex gap-2 mb-2">
          <Input
            value={currentWord}
            onChange={(e) => setCurrentWord(e.target.value)}
            placeholder="Enter a word"
            maxLength={10}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddWord();
              }
            }}
          />
          <Button 
            onClick={handleAddWord}
            variant="outline"
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      
      {words.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">Your words ({words.length}/{maxWords}):</p>
          <div className="flex flex-wrap gap-2">
            {words.map(word => (
              <div 
                key={word} 
                className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1"
              >
                <span>{word}</span>
                <button 
                  onClick={() => handleRemoveWord(word)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Button 
        onClick={handleSubmit}
        className="w-full bg-kid-green hover:bg-kid-green/90"
      >
        Create Puzzle with My Words
      </Button>
    </div>
  );
};

export default WordEntryForm;
