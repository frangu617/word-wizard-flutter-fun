
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Dictionary from './pages/Dictionary';
import Flashcards from './pages/Flashcards';
import SightWordBingo from './pages/SightWordBingo';
import WordMatching from './pages/WordMatching';
import WordSearch from './pages/WordSearch';
import Syllables from './pages/Syllables';
import MissingLetter from './pages/MissingLetter';
import RhymeRacer from './pages/RhymeRacer';
import SentenceBuilder from './pages/SentenceBuilder';
import CrosswordPuzzle from './pages/CrosswordPuzzle';
import LetterSoundPop from './pages/LetterSoundPop';
import WordShooterWarning from './pages/WordShooterWarning';
import WordShooter from './pages/WordShooter';
import WordLadder from './pages/WordLadder';
import WordMaze from './pages/WordMaze';
import StoryBuilder from './pages/StoryBuilder';
import ReadAndColor from './pages/ReadAndColor';
import ReadingTest from './pages/ReadingTest';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';

function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/sight-word-bingo" element={<SightWordBingo />} />
          <Route path="/word-matching" element={<WordMatching />} />
          <Route path="/word-search" element={<WordSearch />} />
          <Route path="/syllables" element={<Syllables />} />
          <Route path="/missing-letter" element={<MissingLetter />} />
          <Route path="/rhyme-racer" element={<RhymeRacer />} />
          <Route path="/sentence-builder" element={<SentenceBuilder />} />
          <Route path="/crossword-puzzle" element={<CrosswordPuzzle />} />
          <Route path="/letter-sound-pop" element={<LetterSoundPop />} />
          <Route path="/word-shooter-warning" element={<WordShooterWarning />} />
          <Route path="/word-shooter" element={<WordShooter />} />
          <Route path="/word-ladder" element={<WordLadder />} />
          <Route path="/word-maze" element={<WordMaze />} />
          <Route path="/story-builder" element={<StoryBuilder />} />
          <Route path="/read-and-color" element={<ReadAndColor />} />
          <Route path="/reading-test" element={<ReadingTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </TooltipProvider>
  );
}

export default App;
