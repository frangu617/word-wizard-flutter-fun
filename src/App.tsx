
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Flashcards from "./pages/Flashcards";
import Dictionary from "./pages/Dictionary";
import WordSearch from "./pages/WordSearch";
import ReadingTest from "./pages/ReadingTest";
import Syllables from "./pages/Syllables";
import WordShooter from "./pages/WordShooter";
import WordShooterWarning from "./pages/WordShooterWarning";
import SightWordBingo from "./pages/SightWordBingo";
import WordMatching from "./pages/WordMatching";
import SentenceBuilder from "./pages/SentenceBuilder";
import WordLadder from "./pages/WordLadder";
import LetterSoundPop from "./pages/LetterSoundPop";
import MissingLetter from "./pages/MissingLetter";
import RhymeRacer from "./pages/RhymeRacer";
import WordMaze from "./pages/WordMaze";
import ReadAndColor from "./pages/ReadAndColor";
import StoryBuilder from "./pages/StoryBuilder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/word-search" element={<WordSearch />} />
          <Route path="/reading-test" element={<ReadingTest />} />
          <Route path="/syllables" element={<Syllables />} />
          <Route path="/word-shooter" element={<WordShooter />} />
          <Route path="/word-shooter-warning" element={<WordShooterWarning />} />
          <Route path="/sight-word-bingo" element={<SightWordBingo />} />
          <Route path="/word-matching" element={<WordMatching />} />
          <Route path="/sentence-builder" element={<SentenceBuilder />} />
          <Route path="/word-ladder" element={<WordLadder />} />
          <Route path="/letter-sound-pop" element={<LetterSoundPop />} />
          <Route path="/missing-letter" element={<MissingLetter />} />
          <Route path="/rhyme-racer" element={<RhymeRacer />} />
          <Route path="/word-maze" element={<WordMaze />} />
          <Route path="/read-and-color" element={<ReadAndColor />} />
          <Route path="/story-builder" element={<StoryBuilder />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
