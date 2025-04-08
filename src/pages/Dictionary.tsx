
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, Search, Volume2, BookOpen, AlertTriangle } from 'lucide-react';
import { fetchWordDefinition, getPronunciationRules, splitIntoSyllables } from '@/services/wordService';
import audioService from '@/services/audioService';
import SyllableWord from '@/components/SyllableWord';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface WordDefinition {
  word: string;
  phonetics: Array<{
    text: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
    }>;
  }>;
}

const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [wordData, setWordData] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWordDefinition(searchTerm);
      
      if (!data) {
        setWordData(null);
        return;
      }
      
      setWordData(data);
      
      // Get pronunciation rules
      const pronunciationRules = getPronunciationRules(searchTerm);
      setRules(pronunciationRules);
      
      // Speak the word
      audioService.speak(searchTerm, true);
    } catch (error) {
      console.error('Error fetching word:', error);
      setWordData(null);
      setError('We couldn\'t find that word in our dictionary. Try another word!');
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const pronounceWord = () => {
    if (wordData) {
      audioService.speak(wordData.word, true);
    }
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-50">
      <header className="flex justify-between items-center mb-8">
        <Link to="/" className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
          <Home className="h-6 w-6 text-kid-blue" />
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-kid-blue">Dictionary</h1>
        <div className="w-10"></div> {/* This is to balance the header */}
      </header>
      
      <div className="max-w-2xl mx-auto mb-8">
        <Card className="kid-bubble border-kid-blue mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-kid-blue h-6 w-6" />
              <h2 className="text-xl font-semibold">Kid-Safe Dictionary</h2>
            </div>
            <p className="text-gray-600">
              This dictionary is designed for children and filters out inappropriate content. 
              Some words or definitions may not be available.
            </p>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type a word..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-xl p-6 rounded-full border-2 border-kid-blue"
          />
          <Button onClick={handleSearch} className="bg-kid-blue hover:bg-kid-blue/80 rounded-full w-14 h-14 p-0">
            <Search size={24} />
          </Button>
        </div>
      </div>
      
      {loading && (
        <div className="text-center my-8">
          <p className="text-xl">Looking up the word...</p>
        </div>
      )}
      
      {error && !loading && (
        <Alert className="max-w-2xl mx-auto mb-8 bg-yellow-50 border-yellow-500">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Word Not Found</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {wordData && !loading && (
        <div className="max-w-2xl mx-auto">
          <Card className="kid-bubble border-kid-blue mb-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <SyllableWord word={wordData.word} size="lg" />
                <Button 
                  onClick={pronounceWord} 
                  className="bg-kid-blue hover:bg-kid-blue/80 rounded-full p-2 h-12 w-12"
                >
                  <Volume2 size={24} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {wordData.meanings.map((meaning, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold text-kid-purple mb-2">
                    {meaning.partOfSpeech}
                  </h3>
                  <ul className="space-y-2">
                    {meaning.definitions.slice(0, 2).map((def, i) => (
                      <li key={i} className="text-lg">
                        <p>{def.definition}</p>
                        {def.example && (
                          <p className="text-gray-600 mt-1">Example: {def.example}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Syllables and Pronunciation */}
          <Card className="kid-bubble border-kid-green mb-8">
            <CardHeader>
              <CardTitle className="text-kid-green">Syllables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                {splitIntoSyllables(wordData.word).map((syllable, i) => (
                  <Card key={i} className="p-4 bg-kid-green/10 border-kid-green/30">
                    <span className="text-2xl font-bold">{syllable}</span>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Pronunciation Rules */}
          {rules.length > 0 && (
            <Card className="kid-bubble border-kid-purple mb-8">
              <CardHeader>
                <CardTitle className="text-kid-purple">Pronunciation Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {rules.map((rule, i) => (
                    <li key={i} className="text-lg flex items-start gap-2">
                      <span className="text-kid-purple font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {!wordData && !loading && !error && searchTerm && (
        <div className="text-center my-8">
          <p className="text-xl">No word found. Try another word!</p>
        </div>
      )}
      
      {!wordData && !loading && !error && !searchTerm && (
        <div className="text-center my-8">
          <p className="text-xl">Type a word to look it up!</p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
            {['cat', 'dog', 'run', 'jump', 'happy', 'tree'].map(word => (
              <Button 
                key={word}
                onClick={() => {
                  setSearchTerm(word);
                  setTimeout(() => handleSearch(), 10);
                }}
                className="bg-kid-yellow hover:bg-kid-yellow/80 p-4 text-lg"
              >
                {word}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dictionary;
