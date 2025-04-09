
import React from 'react';
import { Timer } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface GameHeaderProps {
  score: number;
  targetWord: string | undefined;
  timeLeft: number;
  difficulty: "easy" | "medium" | "hard";
  gameActive: boolean;
  onDifficultyChange: (difficulty: "easy" | "medium" | "hard") => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  score,
  targetWord,
  timeLeft,
  difficulty,
  gameActive,
  onDifficultyChange
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-gray-500">Score:</div>
          <div className="text-xl font-bold">{score}</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-500">Target Word:</div>
          <div className="text-xl font-bold text-purple-600">
            {targetWord || "—"}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-red-500" />
          <div className="text-xl font-bold">{timeLeft}s</div>
        </div>
      </div>
      
      {/* Difficulty selector */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-2">
          <Button 
            variant={difficulty === "easy" ? "default" : "outline"}
            size="sm"
            onClick={() => onDifficultyChange("easy")}
            disabled={gameActive}
          >
            Easy
          </Button>
          <Button 
            variant={difficulty === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() => onDifficultyChange("medium")}
            disabled={gameActive}
          >
            Medium
          </Button>
          <Button 
            variant={difficulty === "hard" ? "default" : "outline"}
            size="sm"
            onClick={() => onDifficultyChange("hard")}
            disabled={gameActive}
          >
            Hard
          </Button>
        </div>
      </div>
    </>
  );
};

export default GameHeader;
