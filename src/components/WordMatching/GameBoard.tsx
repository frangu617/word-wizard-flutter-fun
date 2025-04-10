import React from 'react';
import MatchingCardComponent, { MatchingCard } from './MatchingCard';

interface GameBoardProps {
  cards: MatchingCard[];
  handleCardClick: (id: number) => void;
  gridCols: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ cards, handleCardClick, gridCols }) => {
  return (
    <div
      className="grid gap-3 justify-center"
      style={{
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
      }}
    >
      {cards.map((card) => (
        <MatchingCardComponent 
          key={card.id} 
          card={card} 
          onClick={handleCardClick}
        />
      ))}
    </div>
  );
};

export default GameBoard;
