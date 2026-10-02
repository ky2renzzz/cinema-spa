import React from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { POPULAR_SUBJECTS } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
}) => {
  return (
    <div className="py-12 border-b border-[#1c1c1c]">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Monospaced Meta Tag */}
        <div className="inline-flex items-center gap-2 font-mono-meta text-[11px] uppercase text-neutral-400 border border-[#262626] px-3 py-1 rounded-full bg-[#0a0a0a]">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>Generalist Tutor Intelligence v2.4</span>
        </div>

        {/* Big High-Impact Typography */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
          Direct access to world-class educators.
        </h1>

        <p className="text-[#a3a3a3] text-sm sm:text-base max-w-2xl font-light leading-relaxed">
          Pioneering one-on-one academic excellence. Filter by specialized subject, verified background, experience, and pricing structure.
        </p>

        {/* Minimal High-Contrast Search Input */}
        <div className="max-w-xl pt-2">
          <div className="relative flex items-center input-generalist px-4 py-3 shadow-2xl">
            <Search className="w-4 h-4 text-neutral-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by subject, key topics or tutor name..."
              className="w-full bg-transparent px-3 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-neutral-500 hover:text-white transition-colors"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-1 text-[11px] font-mono-meta text-neutral-500 pr-1">
                <span>PRESS</span>
                <kbd className="px-1.5 py-0.5 bg-[#1a1a1a] border border-[#333] text-neutral-400 rounded text-[10px]">⌘F</kbd>
              </div>
            )}
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {POPULAR_SUBJECTS.slice(0, 6).map((sub) => {
            const isSelected = selectedSubject === sub || (sub === 'Все предметы' && selectedSubject === 'Все предметы');
            return (
              <button
                key={sub}
                onClick={() => onSubjectChange(sub)}
                className={`px-4 py-1.5 text-xs font-mono-meta transition-all ${
                  isSelected
                    ? 'btn-generalist-active'
                    : 'btn-generalist-secondary'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};




