import React from 'react';
import { 
  Tutor, 
  FilterState, 
  StudentGrade, 
  LessonDuration, 
  LessonFormat
} from '../types';
import { 
  Star, 
  Heart, 
  MapPin, 
  MessageCircle, 
  Send,
  ArrowUpRight
} from 'lucide-react';
import { 
  calculateLessonPrice, 
  formatCurrency, 
  getWhatsAppLink, 
  getTelegramLink 
} from '../utils/pricing';

interface TutorCardProps {
  tutor: Tutor;
  filters: FilterState;
  isFavorite: boolean;
  onToggleFavorite: (tutorId: string) => void;
  onOpenDetails: (tutor: Tutor) => void;
  onOpenBooking: (tutor: Tutor, initialGrade: StudentGrade, initialDuration: LessonDuration, initialFormat: LessonFormat) => void;
}

export const TutorCard: React.FC<TutorCardProps> = ({
  tutor,
  filters,
  isFavorite,
  onToggleFavorite,
  onOpenDetails,
  onOpenBooking,
}) => {
  const activeGrade: StudentGrade = filters.selectedGrade === 'all' ? 'grades_10_11_exam' : filters.selectedGrade;
  const activeDuration: LessonDuration = filters.selectedDuration;
  const activeFormat: LessonFormat = filters.selectedFormat === 'all' ? 'online' : filters.selectedFormat;

  const calculatedPrice = calculateLessonPrice(tutor, activeGrade, activeDuration, activeFormat);
  const monthlyPrice = tutor.pricing.monthlyRate || (calculatedPrice * 8);

  const waLink = getWhatsAppLink(tutor.contacts.whatsapp || tutor.contacts.phone, tutor.name, tutor.mainSubject, activeGrade);
  const tgLink = tutor.contacts.telegram ? getTelegramLink(tutor.contacts.telegram) : null;

  return (
    <div className="generalist-card p-6 flex flex-col justify-between space-y-6 group">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-12 h-12 rounded-none object-cover border border-[#262626] group-hover:border-white transition-colors shrink-0"
              onClick={() => onOpenDetails(tutor)}
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-meta text-[10px] uppercase tracking-wider text-neutral-500 border border-[#262626] px-1.5 py-0.5">
                  ID-{tutor.id.substring(0, 4)}
                </span>
                {tutor.rating > 0 && (
                  <span className="font-mono-meta text-[10px] text-white flex items-center gap-1">
                    ★ {tutor.rating.toFixed(1)}
                  </span>
                )}
              </div>

              <h3 
                onClick={() => onOpenDetails(tutor)}
                className="text-base font-semibold text-white hover:underline cursor-pointer transition-all mt-1"
              >
                {tutor.name}
              </h3>

              <p className="text-xs text-neutral-400 font-mono-meta mt-0.5">
                {tutor.mainSubject} {tutor.experienceYears > 0 && `// ${tutor.experienceYears} YRS EXP`}
              </p>
            </div>
          </div>

          <button
            onClick={() => onToggleFavorite(tutor.id)}
            title={isFavorite ? 'Remove from saved' : 'Save educator'}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white text-white' : ''}`} />
          </button>
        </div>

        {/* Bio */}
        {tutor.bio && (
          <p className="mt-4 text-xs text-neutral-300 line-clamp-3 leading-relaxed font-light">
            {tutor.bio}
          </p>
        )}
      </div>

      {/* Pricing and Action Footer */}
      <div className="pt-4 border-t border-[#1c1c1c] flex items-center justify-between gap-3">
        <div>
          <span className="font-mono-meta text-sm font-semibold text-white">
            {formatCurrency(calculatedPrice)} <span className="text-[11px] font-normal text-neutral-500">/ LESSON</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDetails(tutor)}
            className="px-3 py-1.5 btn-generalist-secondary text-xs font-mono-meta"
          >
            Profile
          </button>

          <button
            onClick={() => onOpenBooking(tutor, activeGrade, activeDuration, activeFormat)}
            className="px-4 py-1.5 btn-generalist-primary text-xs font-mono-meta flex items-center gap-1"
          >
            <span>Book</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};




