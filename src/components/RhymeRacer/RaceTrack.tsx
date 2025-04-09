
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import RacingWordComponent, { RacingWord } from './RacingWord';

interface RaceTrackProps {
  racetrackRef: React.RefObject<HTMLDivElement>;
  racingWords: RacingWord[];
  handleWordClick: (word: RacingWord) => void;
}

const RaceTrack: React.FC<RaceTrackProps> = ({ racetrackRef, racingWords, handleWordClick }) => {
  return (
    <div 
      ref={racetrackRef}
      className="relative h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50"
    >
      {/* Racing track with lanes */}
      <div className="absolute inset-0 flex flex-col">
        {[0, 1, 2, 3, 4].map(lane => (
          <div 
            key={lane}
            className="flex-1 border-b border-dashed border-gray-200 last:border-b-0"
          />
        ))}
      </div>
      
      {/* Racing words */}
      <AnimatePresence>
        {racingWords.map(word => (
          <RacingWordComponent
            key={word.id}
            word={word}
            onClick={handleWordClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RaceTrack;
