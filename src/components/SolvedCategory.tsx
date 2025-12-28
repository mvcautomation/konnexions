'use client';

import { Category } from '@/lib/puzzles';

interface SolvedCategoryProps {
  category: Category;
}

export function SolvedCategory({ category }: SolvedCategoryProps) {
  return (
    <div className={`category-banner ${category.difficulty} fade-in`}>
      <div className="font-bold text-sm uppercase tracking-wide">
        {category.theme}
      </div>
      <div className="text-sm mt-1 opacity-80">
        {category.words.join(', ')}
      </div>
    </div>
  );
}
