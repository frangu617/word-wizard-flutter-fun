
import { LucideIcon } from 'lucide-react';
import { Book, Search, Clock, BookOpen } from 'lucide-react';

// Custom Flashcard icon since Lucide doesn't have one
export const Flashcard: LucideIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
};

export { Book, Search, Clock, BookOpen };
