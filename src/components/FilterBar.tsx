import React from 'react';
import { 
  FilterState, 
  StudentGrade, 
  GRADE_LABELS, 
  DURATION_OPTIONS 
} from '../types';
import { RotateCcw, ArrowUpDown, Filter } from 'lucide-react';
import { formatCurrency } from '../utils/pricing';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFound: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFound,
}) => {
  return (
    <div className="generalist-card p-5 space-y-6 text-xs">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
        <div className="flex items-center gap-2 text-white font-mono-meta font-medium uppercase tracking-wider text-[11px]">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <span>Parameters</span>
        </div>
        <span className="font-mono-meta text-[10px] text-neutral-500">
          COUNT: {totalFound}
        </span>
      </div>

      {/* Grade Selector */}
      <div className="space-y-2.5">
        <span className="text-neutral-500 font-mono-meta block text-[10px] uppercase tracking-widest">// TARGET GRADE</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onFilterChange({ selectedGrade: 'all' })}
            className={`px-3 py-1 text-xs font-mono-meta transition-all ${
              filters.selectedGrade === 'all'
                ? 'btn-generalist-active'
                : 'btn-generalist-secondary'
            }`}
          >
            ALL
          </button>
          {(Object.keys(GRADE_LABELS) as StudentGrade[]).map((gradeKey) => {
            const info = GRADE_LABELS[gradeKey];
            const isSelected = filters.selectedGrade === gradeKey;
            return (
              <button
                key={gradeKey}
                onClick={() => onFilterChange({ selectedGrade: gradeKey })}
                className={`px-3 py-1 text-xs font-mono-meta transition-all ${
                  isSelected
                    ? 'btn-generalist-active'
                    : 'btn-generalist-secondary'
                }`}
              >
                {info.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Selector */}
      <div className="space-y-2.5 pt-3 border-t border-[#1c1c1c]">
        <span className="text-neutral-500 font-mono-meta block text-[10px] uppercase tracking-widest">// DURATION</span>
        <div className="flex items-center gap-1.5">
          {DURATION_OPTIONS.map((dur) => {
            const isSelected = filters.selectedDuration === dur;
            return (
              <button
                key={dur}
                onClick={() => onFilterChange({ selectedDuration: dur })}
                className={`flex-1 py-1 text-xs font-mono-meta text-center transition-all ${
                  isSelected
                    ? 'btn-generalist-active'
                    : 'btn-generalist-secondary'
                }`}
              >
                {dur}M
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Limit Slider */}
      <div className="space-y-2.5 pt-3 border-t border-[#1c1c1c]">
        <div className="flex items-center justify-between text-neutral-400 font-mono-meta text-[10px]">
          <span className="uppercase tracking-widest text-neutral-500">// MAX PRICE</span>
          <span className="text-white font-semibold">{formatCurrency(filters.priceRange[1])}</span>
        </div>
        <input
          type="range"
          min={5}
          max={100}
          step={5}
          value={filters.priceRange[1]}
          onChange={(e) => onFilterChange({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
          className="w-full cursor-pointer"
        />
      </div>

      {/* Sorting Dropdown */}
      <div className="space-y-2.5 pt-3 border-t border-[#1c1c1c]">
        <span className="text-neutral-500 font-mono-meta block text-[10px] uppercase tracking-widest">// SORTING</span>
        <div className="flex items-center gap-2 border border-[#262626] bg-[#0d0d0d] px-3 py-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
            className="bg-transparent text-white focus:outline-none cursor-pointer text-xs w-full font-mono-meta"
          >
            <option value="rating" className="bg-[#0a0a0a]">RATING</option>
            <option value="price_asc" className="bg-[#0a0a0a]">PRICE ASC</option>
            <option value="price_desc" className="bg-[#0a0a0a]">PRICE DESC</option>
            <option value="experience" className="bg-[#0a0a0a]">EXPERIENCE</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onResetFilters}
        className="w-full flex items-center justify-center gap-2 text-neutral-400 hover:text-white py-2 btn-generalist-secondary text-xs font-mono-meta"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>RESET FILTERS</span>
      </button>

    </div>
  );
};





