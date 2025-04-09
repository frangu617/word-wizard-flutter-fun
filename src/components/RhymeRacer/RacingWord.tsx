
import React from 'react';
import { motion } from 'framer-motion';

export interface RacingWord {
  id: number;
  word: string;
  rhymes: boolean;
  position: number;
  speed: number;
  lane: number;
  vehicle: string;
  clicked: boolean;
}

interface RacingWordProps {
  word: RacingWord;
  onClick: (word: RacingWord) => void;
}

const RacingWordComponent: React.FC<RacingWordProps> = ({ word, onClick }) => {
  return (
    <motion.div
      className={`absolute cursor-pointer ${word.clicked ? 'opacity-50' : ''}`}
      style={{
        top: `${(word.lane * 20) + 5}%`,
        left: `${Math.min(word.position, 90)}%`, // Cap at 90% to keep visible
      }}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      exit={{ opacity: 0 }}
      onClick={() => onClick(word)}
    >
      <div className="relative">
        {/* Vehicle */}
        <div className="text-3xl">
          {word.vehicle === "car" && "🚗"}
          {word.vehicle === "rocket" && "🚀"}
          {word.vehicle === "bike" && "🚲"}
          {word.vehicle === "boat" && "🚢"}
          {word.vehicle === "plane" && "✈️"}
        </div>
        
        {/* Word */}
        <div className={`
          absolute top-full left-1/2 transform -translate-x-1/2 
          bg-white px-2 py-1 rounded-lg shadow text-sm font-bold
          ${word.clicked && word.rhymes ? 'text-green-600' : ''}
          ${word.clicked && !word.rhymes ? 'text-red-600' : ''}
        `}>
          {word.word}
        </div>
      </div>
    </motion.div>
  );
};

export default RacingWordComponent;
