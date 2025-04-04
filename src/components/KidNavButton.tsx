
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface KidNavButtonProps {
  to: string;
  color: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const KidNavButton: React.FC<KidNavButtonProps> = ({ 
  to, 
  color, 
  icon, 
  children, 
  className 
}) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "kid-button bg-" + color,
        "flex flex-col items-center justify-center gap-2 transition-all",
        "hover:animate-bounce-slow hover:shadow-xl",
        className
      )}
    >
      {icon && (
        <div className="text-3xl mb-2">
          {icon}
        </div>
      )}
      <span className="font-bold">{children}</span>
    </Link>
  );
};

export default KidNavButton;
