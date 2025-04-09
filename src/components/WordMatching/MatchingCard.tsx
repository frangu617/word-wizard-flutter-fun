
import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';

export type CardType = "word" | "image" | "definition";

export interface MatchingCard {
  id: number;
  content: string;
  type: CardType;
  matched: boolean;
  flipped: boolean;
  matchId: number;
}

interface MatchingCardProps {
  card: MatchingCard;
  onClick: (id: number) => void;
}

const MatchingCardComponent: React.FC<MatchingCardProps> = ({ card, onClick }) => {
  return (
    <motion.div
      initial={{ rotateY: 0 }}
      animate={{ rotateY: card.flipped ? 180 : 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: card.matched ? 1 : 1.05 }}
      onClick={() => onClick(card.id)}
    >
      <Card className={`
        h-28 flex items-center justify-center cursor-pointer p-3 text-center
        ${card.matched ? 'bg-green-100 border-green-300' : ''}
        ${card.flipped ? 'bg-yellow-50' : 'bg-white'}
      `}>
        {card.flipped || card.matched ? (
          <div className="flex items-center justify-center h-full w-full">
            {card.type === "image" ? (
              <span className="text-4xl">{card.content}</span>
            ) : (
              <p className={`${card.type === "definition" ? "text-xs" : "text-xl font-bold"}`}>
                {card.content}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-yellow-500 w-full h-full rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xl">?</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default MatchingCardComponent;
