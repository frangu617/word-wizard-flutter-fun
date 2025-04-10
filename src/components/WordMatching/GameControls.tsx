
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GameControlsProps {
  gameMode: "word-word";
  difficulty: "easy" | "medium" | "hard";
  // onGameModeChange: (value: "word-word" | "word-definition" | "word-image") => void;
  onDifficultyChange: (value: "easy" | "medium" | "hard") => void;
  matchedPairs: number;
  totalPairs: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  difficulty,
  // onGameModeChange,
  onDifficultyChange,
  matchedPairs,
  totalPairs
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <div className="mb-4 sm:mb-0">
        <p className="text-lg font-semibold mb-1">Game Settings:</p>
        <div className="flex flex-wrap gap-3">          
          <div>
            <p className="text-sm mb-1">Difficulty:</p>
            <Select
              value={difficulty}
              onValueChange={(value) => onDifficultyChange(value as "easy" | "medium" | "hard")}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy (3×4)</SelectItem>
                <SelectItem value="medium">Medium (4×4)</SelectItem>
                <SelectItem value="hard">Hard (4×6)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-100 p-3 rounded-lg">
        <p className="text-yellow-800">
          <span className="font-bold">Matches:</span> {matchedPairs} / {totalPairs}
        </p>
      </div>
    </div>
  );
};

export default GameControls;
