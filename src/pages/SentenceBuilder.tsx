
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSightWords } from '@/services/wordService';
import { toast } from "@/components/ui/use-toast";
import audioService from '@/services/audioService';
import { ArrowLeft, RefreshCcw, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Confetti from 'react-confetti';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define sentence templates
const sentenceTemplates = {
  easy: [
    { sentence: "The cat is big.", words: ["The", "cat", "is", "big"] },
    { sentence: "I see a dog.", words: ["I", "see", "a", "dog"] },
    { sentence: "The sun is yellow.", words: ["The", "sun", "is", "yellow"] },
    { sentence: "I can run fast.", words: ["I", "can", "run", "fast"] },
    { sentence: "The sky is blue.", words: ["The", "sky", "is", "blue"] }
  ],
  medium: [
    { sentence: "The red bird flew away.", words: ["The", "red", "bird", "flew", "away"] },
    { sentence: "We play in the park.", words: ["We", "play", "in", "the", "park"] },
    { sentence: "She likes to read books.", words: ["She", "likes", "to", "read", "books"] },
    { sentence: "The dog ate his food.", words: ["The", "dog", "ate", "his", "food"] },
    { sentence: "My cat sleeps all day.", words: ["My", "cat", "sleeps", "all", "day"] }
  ],
  hard: [
    { sentence: "The children played outside after lunch.", words: ["The", "children", "played", "outside", "after", "lunch"] },
    { sentence: "My friend and I went to the movies.", words: ["My", "friend", "and", "I", "went", "to", "the", "movies"] },
    { sentence: "The little puppy chased the yellow ball.", words: ["The", "little", "puppy", "chased", "the", "yellow", "ball"] },
    { sentence: "We need to clean our room today.", words: ["We", "need", "to", "clean", "our", "room", "today"] },
    { sentence: "She walks to school every morning.", words: ["She", "walks", "to", "school", "every", "morning"] }
  ]
};

const SentenceBuilder = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  useEffect(() => {
    startNewGame();
  }, [difficulty]);
  
  const startNewGame = () => {
    // Reset state
    setIsCorrect(null);
    setShowConfetti(false);
    setShowHint(false);
    setSelectedWords([]);
    
    // Get a random sentence from the templates
    const templates = sentenceTemplates[difficulty];
    const randomIndex = Math.floor(Math.random() * templates.length);
    setCurrentSentenceIndex(randomIndex);
    
    // Shuffle the words
    const wordList = [...templates[randomIndex].words];
    shuffle(wordList);
    setShuffledWords(wordList);
  };
  
  const shuffle = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside the list
    if (!destination) {
      return;
    }
    
    // Determine which list we're moving from/to
    if (source.droppableId === 'shuffled' && destination.droppableId === 'selected') {
      // Move from shuffled to selected
      const wordToMove = shuffledWords[source.index];
      const newShuffledWords = [...shuffledWords];
      newShuffledWords.splice(source.index, 1);
      
      const newSelectedWords = [...selectedWords];
      newSelectedWords.splice(destination.index, 0, wordToMove);
      
      setShuffledWords(newShuffledWords);
      setSelectedWords(newSelectedWords);
    } 
    else if (source.droppableId === 'selected' && destination.droppableId === 'shuffled') {
      // Move from selected to shuffled
      const wordToMove = selectedWords[source.index];
      const newSelectedWords = [...selectedWords];
      newSelectedWords.splice(source.index, 1);
      
      const newShuffledWords = [...shuffledWords];
      newShuffledWords.splice(destination.index, 0, wordToMove);
      
      setShuffledWords(newShuffledWords);
      setSelectedWords(newSelectedWords);
    } 
    else if (source.droppableId === 'selected' && destination.droppableId === 'selected') {
      // Reorder selected list
      const newSelectedWords = [...selectedWords];
      const [removed] = newSelectedWords.splice(source.index, 1);
      newSelectedWords.splice(destination.index, 0, removed);
      setSelectedWords(newSelectedWords);
    } 
    else if (source.droppableId === 'shuffled' && destination.droppableId === 'shuffled') {
      // Reorder shuffled list
      const newShuffledWords = [...shuffledWords];
      const [removed] = newShuffledWords.splice(source.index, 1);
      newShuffledWords.splice(destination.index, 0, removed);
      setShuffledWords(newShuffledWords);
    }
  };
  
  const checkSentence = () => {
    const correctSentence = sentenceTemplates[difficulty][currentSentenceIndex].sentence;
    const userSentence = selectedWords.join(" ");
    
    // Compare without the final period
    const isCorrectSentence = userSentence === correctSentence.slice(0, -1);
    
    setIsCorrect(isCorrectSentence);
    
    if (isCorrectSentence) {
      audioService.speak("Great job! You built the sentence correctly!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      
      toast({
        title: "Correct!",
        description: "You built the sentence correctly!",
      });
    } else {
      audioService.playSound('error');
      toast({
        title: "Not quite right",
        description: "Try rearranging the words to form a correct sentence.",
        variant: "destructive"
      });
    }
  };
  
  const toggleHint = () => {
    setShowHint(!showHint);
    if (!showHint) {
      audioService.speak(sentenceTemplates[difficulty][currentSentenceIndex].sentence);
    }
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-indigo-100 to-blue-50">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-center text-indigo-700">Sentence Builder</h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={toggleHint}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Hint
            </Button>
            
            <Button 
              variant="outline" 
              onClick={startNewGame}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              New Sentence
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold text-indigo-900">Build a sentence</div>
            
            <Select
              value={difficulty}
              onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {showHint && (
            <div className="mb-6 p-3 bg-indigo-100 rounded-lg">
              <p className="text-indigo-800 font-medium">
                Hint: {sentenceTemplates[difficulty][currentSentenceIndex].sentence}
              </p>
            </div>
          )}
          
          <DragDropContext onDragEnd={handleDragEnd}>
            {/* Selected words - the sentence builder area */}
            <div className="mb-8">
              <div className="text-sm font-medium text-gray-500 mb-2">Your sentence:</div>
              <Droppable droppableId="selected" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      min-h-16 p-4 rounded-lg border-2 border-dashed flex flex-wrap gap-2
                      ${snapshot.isDraggingOver ? 'bg-indigo-50 border-indigo-300' : 'bg-gray-50 border-gray-300'}
                      ${isCorrect === true ? 'bg-green-50 border-green-300' : ''}
                      ${isCorrect === false ? 'bg-red-50 border-red-300' : ''}
                    `}
                  >
                    {selectedWords.map((word, index) => (
                      <Draggable key={`selected-${word}-${index}`} draggableId={`selected-${word}-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              bg-indigo-600 text-white px-3 py-2 rounded-lg shadow-sm
                              ${snapshot.isDragging ? 'opacity-70' : ''}
                            `}
                          >
                            {word}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {selectedWords.length === 0 && (
                      <div className="text-gray-400 text-center w-full">
                        Drag words here to build your sentence
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
            
            {/* Available words to drag */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">Available words:</div>
              <Droppable droppableId="shuffled" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      min-h-16 p-4 rounded-lg border flex flex-wrap gap-2
                      ${snapshot.isDraggingOver ? 'bg-blue-50 border-blue-300' : 'bg-gray-100 border-gray-200'}
                    `}
                  >
                    {shuffledWords.map((word, index) => (
                      <Draggable key={`shuffled-${word}-${index}`} draggableId={`shuffled-${word}-${index}`} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              bg-white border border-gray-300 px-3 py-2 rounded-lg shadow-sm
                              ${snapshot.isDragging ? 'opacity-70' : ''}
                            `}
                          >
                            {word}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {shuffledWords.length === 0 && (
                      <div className="text-gray-400 text-center w-full">
                        All words have been used
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
          
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={checkSentence}
              disabled={selectedWords.length === 0 || shuffledWords.length > 0}
              className="bg-indigo-600 hover:bg-indigo-700"
              size="lg"
            >
              Check Sentence
            </Button>
          </div>
          
          {isCorrect === true && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
              <p className="text-green-800 font-bold">Great job! Your sentence is correct!</p>
              <p className="text-green-600">
                {sentenceTemplates[difficulty][currentSentenceIndex].sentence}
              </p>
            </div>
          )}
          
          {isCorrect === false && (
            <div className="mt-4 p-3 bg-red-100 rounded-lg text-center">
              <p className="text-red-800 font-medium">Not quite right. Try again!</p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow max-w-lg mx-auto">
          <h3 className="text-lg font-bold mb-2">How to Play:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Drag words from the bottom area to the sentence building area</li>
            <li>Arrange the words to form a correct sentence</li>
            <li>Click "Check Sentence" when you're ready</li>
            <li>Use the "Hint" button if you need help</li>
            <li>Click "New Sentence" to try a different one</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SentenceBuilder;
