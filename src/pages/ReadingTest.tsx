
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Play, Pause, RotateCcw, CheckCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { readingPassages, additionalReadingPassages } from '@/services/wordService';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const ReadingTest = () => {
  const [level, setLevel] = useState('beginner');
  const [isReading, setIsReading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wordsRead, setWordsRead] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [passages, setPassages] = useState([...readingPassages, ...additionalReadingPassages]);
  const [selectedPassage, setSelectedPassage] = useState<number | null>(null);
  const [showPassageSelector, setShowPassageSelector] = useState(false);
  const [randomPassage, setRandomPassage] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Filter passages by level
  const levelPassages = passages.filter(p => p.level === level);
  
  // Get the current passage
  const currentPassage = selectedPassage !== null 
    ? levelPassages.find(p => p.id === selectedPassage) 
    : levelPassages.length > 0 
      ? levelPassages[Math.floor(Math.random() * levelPassages.length)] 
      : null;
  
  const totalWords = currentPassage ? currentPassage.text.split(/\s+/).length : 0;
  
  useEffect(() => {
    // When level changes, reset selected passage
    setSelectedPassage(null);
    
    return () => {
      // Clean up timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [level]);
  
  const selectRandomPassage = () => {
    if (levelPassages.length > 0) {
      const randomIndex = Math.floor(Math.random() * levelPassages.length);
      setSelectedPassage(levelPassages[randomIndex].id);
    }
  };
  
  const startReading = () => {
    // If random mode is on and no passage is selected, pick a random one
    if (randomPassage && selectedPassage === null) {
      selectRandomPassage();
    }
    
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
    
    // If in random mode, reset the selected passage
    if (randomPassage) {
      setSelectedPassage(null);
    }
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
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner" className="text-lg">
                    Beginner - Short, simple sentences with basic words
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate" className="text-lg">
                    Intermediate - Longer sentences with more complex vocabulary
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced" className="text-lg">
                    Advanced - Multiple paragraphs with rich vocabulary
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="mt-6 flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="randomPassage" 
                  checked={randomPassage} 
                  onChange={() => setRandomPassage(!randomPassage)}
                  className="h-5 w-5"
                />
                <Label htmlFor="randomPassage" className="text-lg">
                  Use random passages (recommended for testing reading ability)
                </Label>
              </div>
              
              {!randomPassage && (
                <div className="mt-4">
                  <Dialog open={showPassageSelector} onOpenChange={setShowPassageSelector}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-kid-purple text-kid-purple">
                        <BookOpen className="mr-2" /> 
                        {selectedPassage 
                          ? `Selected: ${currentPassage?.title}` 
                          : "Select a specific passage"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Select a Reading Passage</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 max-h-[60vh] overflow-y-auto">
                        {levelPassages.map((passage) => (
                          <div 
                            key={passage.id}
                            className={`p-4 mb-2 rounded-lg cursor-pointer ${
                              selectedPassage === passage.id 
                                ? 'bg-kid-purple/20 border-2 border-kid-purple' 
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={() => {
                              setSelectedPassage(passage.id);
                              setShowPassageSelector(false);
                            }}
                          >
                            <h3 className="font-bold text-lg">{passage.title}</h3>
                            <p className="text-gray-600">
                              {passage.text.slice(0, 100)}...
                            </p>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              
              <Button 
                onClick={startReading} 
                className="mt-6 bg-kid-purple hover:bg-kid-purple/80 w-full text-xl py-6"
                disabled={!randomPassage && selectedPassage === null}
              >
                <Play className="mr-2" /> Start Reading
              </Button>
            </CardContent>
          </Card>
        )}
        
        {isReading && currentPassage && (
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
                <CardTitle className="text-kid-purple">{currentPassage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl leading-relaxed">{currentPassage.text}</p>
                
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
