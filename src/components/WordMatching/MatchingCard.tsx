import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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
    <div
      className={`relative w-24 h-28 sm:w-28 sm:h-32 md:w-32 md:h-36 perspective ${
        card.matched ? "pointer-events-none" : "cursor-pointer"
      }`}
      onClick={() => onClick(card.id)}
    >
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* FRONT FACE */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center backface-hidden rounded-md 
            border-2 bg-yellow-500 text-white font-bold text-xl
            ${card.matched ? "border-green-500" : "border-yellow-400"}
          `}
        >
          ?
        </div>

        {/* BACK FACE */}
        <div
          className={`
            absolute inset-0 flex items-center justify-center backface-hidden rounded-md 
            border-2 bg-white
            ${card.matched ? "border-green-500" : "border-yellow-400"}
          `}
          style={{ transform: "rotateY(180deg)" }}
        >
          {card.type === "image" ? (
            <span className="text-4xl">{card.content}</span>
          ) : (
            <p
              className={`${
                card.type === "definition" ? "text-xs" : "text-xl font-bold"
              } text-center px-2`}
            >
              {card.content}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MatchingCardComponent;
