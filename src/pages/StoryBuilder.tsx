
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import audioService from '@/services/audioService';
import { ArrowLeft, RefreshCcw, PlayCircle, Save, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRandomWords } from '@/services/wordService';

// Story components
const settings = [
  "forest", "castle", "beach", "space", "jungle",
  "desert", "mountain", "ocean", "city", "farm",
  "school", "library", "park", "zoo", "museum"
];

const characters = [
  "wizard", "dragon", "knight", "fairy", "robot",
  "alien", "dinosaur", "pirate", "princess", "monster",
  "teacher", "doctor", "astronaut", "chef", "scientist"
];

const actions = [
  "finds", "loses", "builds", "creates", "discovers",
  "chases", "helps", "saves", "teaches", "learns from",
  "plays with", "dances with", "sings to", "runs from", "hides from"
];

const objects = [
  "treasure", "map", "key", "book", "potion",
  "wand", "sword", "spaceship", "crown", "crystal",
  "computer", "telescope", "cake", "painting", "garden"
];

// Story templates
const storyTemplates = [
  "Once upon a time, a {character} was in a {setting}. The {character} {action} a {object}. It was amazing!",
  "In a magical {setting}, there lived a {character}. One day, the {character} {action} a {object}. What an adventure!",
  "Far away in a {setting}, a brave {character} {action} a special {object}. Everyone was surprised!",
  "Long ago, a {character} visited a {setting}. There, the {character} {action} a mysterious {object}. It was incredible!",
  "There was a {character} who loved to explore the {setting}. One day, the {character} {action} a wonderful {object}. It changed everything!"
];

const StoryBuilder = () => {
  const [selectedSetting, setSelectedSetting] = useState<string>("");
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedObject, setSelectedObject] = useState<string>("");
  
  const [settingOptions, setSettingOptions] = useState<string[]>([]);
  const [characterOptions, setCharacterOptions] = useState<string[]>([]);
  const [actionOptions, setActionOptions] = useState<string[]>([]);
  const [objectOptions, setObjectOptions] = useState<string[]>([]);
  
  const [generatedStory, setGeneratedStory] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [savedStories, setSavedStories] = useState<string[]>([]);
  
  useEffect(() => {
    // Get saved stories from local storage
    const saved = localStorage.getItem('wordWizard_savedStories');
    if (saved) {
      setSavedStories(JSON.parse(saved));
    }
    
    shuffleOptions();
  }, []);
  
  const shuffleOptions = () => {
    // Get 5 random options for each category
    setSettingOptions(getRandomArrayElements(settings, 5));
    setCharacterOptions(getRandomArrayElements(characters, 5));
    setActionOptions(getRandomArrayElements(actions, 5));
    setObjectOptions(getRandomArrayElements(objects, 5));
    
    // Reset selections
    setSelectedSetting("");
    setSelectedCharacter("");
    setSelectedAction("");
    setSelectedObject("");
    setGeneratedStory("");
  };
  
  const getRandomArrayElements = (array: string[], count: number) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const generateStory = () => {
    if (!selectedSetting || !selectedCharacter || !selectedAction || !selectedObject) {
      toast({
        title: "Missing story elements",
        description: "Please select all four story elements first",
        variant: "destructive"
      });
      return;
    }
    
    // Pick a random story template
    const template = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
    
    // Fill in the template
    const story = template
      .replace("{setting}", selectedSetting)
      .replace("{character}", selectedCharacter)
      .replace("{action}", selectedAction)
      .replace("{object}", selectedObject);
    
    setGeneratedStory(story);
  };
  
  const playStory = () => {
    if (!generatedStory) {
      toast({
        title: "No story to play",
        description: "Please generate a story first",
        variant: "destructive"
      });
      return;
    }
    
    setIsPlaying(true);
    audioService.speak(generatedStory, false);
    
    // Reset playing state after a delay
    setTimeout(() => {
      setIsPlaying(false);
    }, generatedStory.length * 100); // Rough estimate of audio duration
  };
  
  const saveStory = () => {
    if (!generatedStory) {
      toast({
        title: "No story to save",
        description: "Please generate a story first",
        variant: "destructive"
      });
      return;
    }
    
    // Add to saved stories
    const newSavedStories = [...savedStories, generatedStory];
    setSavedStories(newSavedStories);
    
    // Save to local storage
    localStorage.setItem('wordWizard_savedStories', JSON.stringify(newSavedStories));
    
    toast({
      title: "Story saved!",
      description: "Your story has been saved to your collection.",
    });
  };
  
  const downloadStories = () => {
    if (savedStories.length === 0) {
      toast({
        title: "No stories to download",
        description: "Save some stories first",
        variant: "destructive"
      });
      return;
    }
    
    const storiesText = savedStories.join("\n\n---\n\n");
    const blob = new Blob([storiesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-stories.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Stories downloaded",
      description: "Your stories have been downloaded as a text file.",
    });
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-pink-100 to-purple-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-center text-pink-700">Story Builder</h1>
          
          <Button 
            variant="outline" 
            onClick={shuffleOptions}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            New Cards
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4 text-center">Pick Your Story Elements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setting (Where)
              </label>
              <Select
                value={selectedSetting}
                onValueChange={setSelectedSetting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a setting" />
                </SelectTrigger>
                <SelectContent>
                  {settingOptions.map(setting => (
                    <SelectItem key={setting} value={setting}>
                      {setting}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Character */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Character (Who)
              </label>
              <Select
                value={selectedCharacter}
                onValueChange={setSelectedCharacter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a character" />
                </SelectTrigger>
                <SelectContent>
                  {characterOptions.map(character => (
                    <SelectItem key={character} value={character}>
                      {character}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Action */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action (What)
              </label>
              <Select
                value={selectedAction}
                onValueChange={setSelectedAction}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an action" />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map(action => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Object */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Object (What)
              </label>
              <Select
                value={selectedObject}
                onValueChange={setSelectedObject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an object" />
                </SelectTrigger>
                <SelectContent>
                  {objectOptions.map(object => (
                    <SelectItem key={object} value={object}>
                      {object}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center mb-6">
            <Button 
              onClick={generateStory}
              size="lg"
              className="bg-pink-600 hover:bg-pink-700"
            >
              Build My Story!
            </Button>
          </div>
          
          {generatedStory && (
            <div className="mt-8">
              <div className="bg-pink-50 p-6 rounded-lg border border-pink-200 mb-4">
                <h3 className="text-lg font-bold mb-3">Your Story:</h3>
                <p className="text-xl leading-relaxed">{generatedStory}</p>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={playStory}
                  disabled={isPlaying}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <PlayCircle className="h-4 w-4" />
                  {isPlaying ? "Playing..." : "Read Aloud"}
                </Button>
                
                <Button
                  onClick={saveStory}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Story
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {savedStories.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Saved Stories</h2>
              <Button 
                variant="outline" 
                onClick={downloadStories}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download All
              </Button>
            </div>
            
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {savedStories.map((story, index) => (
                <Card key={index} className="p-4">
                  <p>{story}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setGeneratedStory(story);
                      audioService.speak(story, false);
                    }}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Read Aloud
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-white p-4 rounded-lg shadow max-w-lg mx-auto">
          <h3 className="text-lg font-bold mb-2">How to Play:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Choose one option from each category: setting, character, action, and object</li>
            <li>Click "Build My Story!" to generate a unique story with your choices</li>
            <li>Click "Read Aloud" to have the story read to you</li>
            <li>Save your favorite stories to your collection</li>
            <li>Click "New Cards" for different options</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StoryBuilder;
