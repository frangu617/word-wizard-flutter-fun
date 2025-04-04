
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Volume2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  splitIntoSyllables, 
  getPronunciationRules, 
  getPhonicsRules 
} from '@/services/wordService';
import audioService from '@/services/audioService';

const syllableWords = [
  { word: "cat", difficulty: "easy" },
  { word: "dog", difficulty: "easy" },
  { word: "apple", difficulty: "easy" },
  { word: "banana", difficulty: "medium" },
  { word: "elephant", difficulty: "medium" },
  { word: "butterfly", difficulty: "medium" },
  { word: "hamburger", difficulty: "medium" },
  { word: "dinosaur", difficulty: "medium" },
  { word: "computer", difficulty: "hard" },
  { word: "alligator", difficulty: "hard" },
  { word: "helicopter", difficulty: "hard" },
  { word: "rhinoceros", difficulty: "hard" },
  { word: "octopus", difficulty: "medium" },
  { word: "penguin", difficulty: "medium" },
  { word: "giraffe", difficulty: "medium" },
];

const Syllables = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  const filteredWords = syllableWords.filter(word => 
    difficulty === 'easy' ? word.difficulty === 'easy' :
    difficulty === 'medium' ? ['easy', 'medium'].includes(word.difficulty) :
    true
  );
  
  const currentWord = filteredWords[currentWordIndex]?.word || "cat";
  const syllables = splitIntoSyllables(currentWord);
  const pronunciationRules = getPronunciationRules(currentWord);
  const phonicsRules = getPhonicsRules(currentWord);
  
  const nextWord = () => {
    if (currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      if (filteredWords[currentWordIndex + 1]) {
        audioService.speak(filteredWords[currentWordIndex + 1].word, true);
      }
    }
  };
  
  const prevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      if (filteredWords[currentWordIndex - 1]) {
        audioService.speak(filteredWords[currentWordIndex - 1].word, true);
      }
    }
  };
  
  const pronounceWord = () => {
    audioService.speak(currentWord, true);
  };
  
  const pronounceSyllable = (syllable: string) => {
    audioService.speak(syllable, true);
  };
  
  // Colors for syllables
  const syllableColors = [
    'bg-kid-red/20 border-kid-red/30',
    'bg-kid-blue/20 border-kid-blue/30',
    'bg-kid-green/20 border-kid-green/30',
    'bg-kid-purple/20 border-kid-purple/30',
    'bg-kid-yellow/20 border-kid-yellow/30',
  ];
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-50">
      <header className="flex justify-between items-center mb-8">
        <Link to="/" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
          <Home className="h-6 w-6 text-kid-blue" />
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-kid-orange">Syllables</h1>
        <div className="w-10"></div>
      </header>
      
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => setDifficulty('easy')}
            className={`${
              difficulty === 'easy' 
                ? 'bg-kid-green text-white' 
                : 'bg-kid-green/20 text-kid-green'
            }`}
          >
            Easy
          </Button>
          <Button
            onClick={() => setDifficulty('medium')}
            className={`${
              difficulty === 'medium' 
                ? 'bg-kid-orange text-white' 
                : 'bg-kid-orange/20 text-kid-orange'
            }`}
          >
            Medium
          </Button>
          <Button
            onClick={() => setDifficulty('hard')}
            className={`${
              difficulty === 'hard' 
                ? 'bg-kid-red text-white' 
                : 'bg-kid-red/20 text-kid-red'
            }`}
          >
            Hard
          </Button>
        </div>
        
        <Card className="kid-bubble border-kid-orange mb-8">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-kid-orange">Word</CardTitle>
            <Button 
              onClick={pronounceWord} 
              className="bg-kid-orange hover:bg-kid-orange/80 rounded-full p-2 h-12 w-12"
            >
              <Volume2 size={24} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">{currentWord}</h2>
              
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                {syllables.map((syllable, index) => (
                  <Card 
                    key={index} 
                    className={`p-6 border-2 ${syllableColors[index % syllableColors.length]} flex flex-col items-center cursor-pointer transition-transform hover:scale-105`}
                    onClick={() => pronounceSyllable(syllable)}
                  >
                    <span className="text-3xl font-bold mb-2">{syllable}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="mt-2 p-1 h-8 w-8 rounded-full bg-white"
                    >
                      <Volume2 size={16} />
                    </Button>
                  </Card>
                ))}
              </div>
              
              <p className="text-lg mt-4">
                This word has <strong>{syllables.length}</strong> syllable{syllables.length !== 1 ? 's' : ''}.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {pronunciationRules.length > 0 && (
          <Card className="kid-bubble border-kid-purple mb-8">
            <CardHeader>
              <CardTitle className="text-kid-purple">Pronunciation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pronunciationRules.map((rule, i) => (
                  <li key={i} className="text-lg flex items-start gap-2">
                    <span className="text-kid-purple font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-between w-full mb-8">
          <Button 
            onClick={prevWord} 
            disabled={currentWordIndex === 0}
            className="bg-kid-blue hover:bg-kid-blue/80 p-6"
            size="lg"
          >
            <ArrowLeft className="mr-2" /> Previous
          </Button>
          
          <Button 
            onClick={nextWord} 
            disabled={currentWordIndex === filteredWords.length - 1}
            className="bg-kid-blue hover:bg-kid-blue/80 p-6"
            size="lg"
          >
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Syllables;
