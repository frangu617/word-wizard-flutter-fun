
import React from 'react';
import { splitIntoSyllables } from '@/services/wordService';
import { cn } from '@/lib/utils';

interface SyllableWordProps {
  word: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  highlight?: boolean;
  className?: string;
}

const SyllableWord: React.FC<SyllableWordProps> = ({ 
  word, 
  size = 'md',
  highlight = true,
  className 
}) => {
  const syllables = splitIntoSyllables(word);
  
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };
  
  // Array of colors to rotate through for syllables
  const colors = ['bg-kid-red/20', 'bg-kid-blue/20', 'bg-kid-green/20', 'bg-kid-purple/20', 'bg-kid-yellow/20'];
  
  return (
    <div className={cn("flex flex-wrap justify-center", sizeClasses[size], className)}>
      {syllables.map((syllable, index) => (
        <span 
          key={index} 
          className={cn(
            "syllable transition-all", 
            highlight ? colors[index % colors.length] : ''
          )}
        >
          {syllable}
        </span>
      ))}
    </div>
  );
};

export default SyllableWord;
