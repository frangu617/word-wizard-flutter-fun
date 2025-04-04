
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { readingPassages } from '@/services/wordService';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const ReadingTest = () => {
  const [level, setLevel] = useState('beginner');
  const [isReading, setIsReading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wordsRead, setWordsRead] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Get the passage for the selected level
  const passage = readingPassages.find(p => p.level === level);
  const totalWords = passage ? passage.text.split(/\s+/).length : 0;
  
  useEffect(() => {
    return () => {
      // Clean up timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startReading = () => {
    setIsReading(true);
    setShowResults(false);
    setElapsedTime(0);
    setWordsRead(0);
    setWpm(0);
    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedTime(elapsed);
      }
    }, 1000);
  };
  
  const pauseReading = () => {
    setIsReading(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  const resetTest = () => {
    pauseReading();
    setElapsedTime(0);
    setWordsRead(0);
    setWpm(0);
    setShowResults(false);
    startTimeRef.current = null;
  };
  
  const finishReading = () => {
    pauseReading();
    // Set words read to total words in the passage
    setWordsRead(totalWords);
    
    // Calculate words per minute
    if (elapsedTime > 0) {
      const minutes = elapsedTime / 60;
      const calculatedWpm = Math.round(totalWords / minutes);
      setWpm(calculatedWpm);
    }
    
    setShowResults(true);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-50">
      <header className="flex justify-between items-center mb-8">
        <Link to="/" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
          <Home className="h-6 w-6 text-kid-blue" />
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-kid-purple">Reading Test</h1>
        <div className="w-10"></div>
      </header>
      
      <div className="max-w-3xl mx-auto">
        {!isReading && !showResults && (
          <Card className="kid-bubble border-kid-purple mb-8">
            <CardHeader>
              <CardTitle className="text-kid-purple">Select Reading Level</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={level}
                onValueChange={setLevel}
                className="space-y-4"
              >
                {readingPassages.map((passage) => (
                  <div key={passage.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={passage.level} id={passage.level} />
                    <Label htmlFor={passage.level} className="text-lg capitalize">
                      {passage.level}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <Button 
                onClick={startReading} 
                className="mt-6 bg-kid-purple hover:bg-kid-purple/80 w-full text-xl py-6"
              >
                <Play className="mr-2" /> Start Reading
              </Button>
            </CardContent>
          </Card>
        )}
        
        {isReading && passage && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl font-bold text-kid-purple">
                Timer: {formatTime(elapsedTime)}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={pauseReading}
                  className="bg-kid-red hover:bg-kid-red/80"
                >
                  <Pause className="mr-2" /> Pause
                </Button>
                <Button
                  onClick={resetTest}
                  className="bg-kid-blue hover:bg-kid-blue/80"
                >
                  <RotateCcw className="mr-2" /> Reset
                </Button>
              </div>
            </div>
            
            <Card className="kid-bubble border-kid-purple mb-8">
              <CardHeader>
                <CardTitle className="text-kid-purple">{passage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl leading-relaxed">{passage.text}</p>
                
                <div className="mt-8">
                  <Button
                    onClick={finishReading}
                    className="bg-kid-green hover:bg-kid-green/80 w-full text-xl py-6 animate-pulse"
                  >
                    <CheckCircle className="mr-2" /> I Finished Reading!
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {showResults && (
          <Card className="kid-bubble border-kid-green animate-pop">
            <CardHeader>
              <CardTitle className="text-kid-green text-center text-3xl">Your Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-lg text-gray-600">Time</p>
                  <p className="text-3xl font-bold text-kid-purple">{formatTime(elapsedTime)}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg text-gray-600">Words Read</p>
                  <p className="text-3xl font-bold text-kid-blue">{wordsRead}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg text-gray-600">Speed</p>
                  <p className="text-3xl font-bold text-kid-green">{wpm} WPM</p>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-lg mb-2">Progress:</p>
                <Progress value={100} className="h-4" />
                <p className="text-right mt-1 text-gray-600">
                  {totalWords} of {totalWords} words (100%)
                </p>
              </div>
              
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  onClick={resetTest}
                  className="bg-kid-blue hover:bg-kid-blue/80"
                >
                  <RotateCcw className="mr-2" /> New Test
                </Button>
                <Link to="/">
                  <Button className="bg-kid-purple hover:bg-kid-purple/80">
                    <Home className="mr-2" /> Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReadingTest;
