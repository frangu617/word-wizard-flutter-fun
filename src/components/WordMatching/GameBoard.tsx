
import React from 'react';
import MatchingCardComponent, { MatchingCard } from './MatchingCard';

interface GameBoardProps {
  cards: MatchingCard[];
  handleCardClick: (id: number) => void;
  gridCols: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ cards, handleCardClick, gridCols }) => {
  const getGridClasses = () => {
    const colsClass = `grid-cols-${gridCols}`;
    return `grid ${colsClass} gap-3`;
  };
  
  return (
    <div className={getGridClasses()}>
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
