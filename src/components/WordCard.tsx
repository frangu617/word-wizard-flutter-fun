
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SyllableWord from './SyllableWord';
import audioService from '@/services/audioService';
import { Volume2 } from 'lucide-react';

interface WordCardProps {
  word: string;
  showSyllables?: boolean;
  className?: string;
}

const WordCard: React.FC<WordCardProps> = ({ 
  word, 
  showSyllables = true,
  className 
}) => {
  const pronounceWord = () => {
    audioService.speak(word, true);
  };
  
  return (
    <div 
      className={cn(
        "word-card flex flex-col items-center justify-center gap-4 p-8",
        "border-kid-blue bg-white",
        className
      )}
    >
      {showSyllables ? (
        <SyllableWord word={word} size="xl" />
      ) : (
        <div className="text-6xl font-bold">{word}</div>
      )}
      
      <Button 
        onClick={pronounceWord} 
        className="mt-4 bg-kid-blue hover:bg-kid-blue/80 rounded-full p-2 h-12 w-12"
        aria-label="Pronounce word"
      >
        <Volume2 size={24} />
      </Button>
    </div>
  );
};

export default WordCard;
