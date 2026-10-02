import React, { useState } from 'react';
import { 
  User, 
  Tutor, 
  BookingInquiry, 
  Review, 
  GRADE_LABELS,
  StudentGrade,
  LessonDuration,
  LessonFormat,
  FilterState 
} from '../types';
import { 
  Heart, 
  BookOpen, 
  Clock, 
  MessageCircle, 
  Send
} from 'lucide-react';
import { TutorCard } from './TutorCard';
import { formatCurrency, getWhatsAppLink, getTelegramLink } from '../utils/pricing';

interface StudentDashboardProps {
  currentUser: User;
  tutors: Tutor[];
  inquiries: BookingInquiry[];
  reviews: Review[];
  onOpenDetails: (tutor: Tutor) => void;
  onOpenBooking: (tutor: Tutor, grade: StudentGrade, duration: LessonDuration, format: LessonFormat) => void;
  onToggleFavorite: (tutorId: string) => void;
  filters: FilterState;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  tutors,
  inquiries,
  onOpenDetails,
  onOpenBooking,
  onToggleFavorite,
  filters,
}) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'favorites'>('inquiries');

  const favoriteTutors = tutors.filter(t => currentUser.favorites?.includes(t.id));
  const studentInquiries = inquiries.filter(i => i.studentId === currentUser.id || i.studentName === currentUser.name);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center font-bold text-lg">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Кабинет ученика: {currentUser.name}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Ваши заявки на уроки и сохраненные преподаватели
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
            activeTab === 'inquiries'
              ? 'bg-white text-black font-bold'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/5'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Мои заявки ({studentInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
            activeTab === 'favorites'
              ? 'bg-white text-black font-bold'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-white/5'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Избранное ({favoriteTutors.length})</span>
        </button>
      </div>

      {/* Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white pb-3 border-b border-white/5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-400" />
            История заявок
          </h3>

          {studentInquiries.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 text-xs">
              Вы пока не отправляли заявок на уроки.
            </div>
          ) : (
            <div className="space-y-3">
              {studentInquiries.map((inq) => {
                const tutor = tutors.find(t => t.id === inq.tutorId);
                const waLink = tutor ? getWhatsAppLink(tutor.contacts.whatsapp || tutor.contacts.phone, tutor.name, inq.subject) : '#';
                const tgLink = tutor?.contacts.telegram ? getTelegramLink(tutor.contacts.telegram) : null;

                return (
                  <div key={inq.id} className="p-4 rounded-xl bg-neutral-950 border border-white/5 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white">Репетитор: {inq.tutorName}</h4>
                        <p className="text-[11px] text-neutral-400">
                          {inq.subject} • {GRADE_LABELS[inq.gradeLevel]?.title} • {inq.durationMinutes} мин
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-neutral-500 block">Стоимость:</span>
                        <span className="text-sm font-bold text-white">
                          {formatCurrency(inq.calculatedPrice)}
                        </span>
                      </div>
                    </div>

                    {tutor && (
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 flex items-center gap-1 font-medium"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>

                        {tgLink && (
                          <a
                            href={tgLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 flex items-center gap-1 font-medium"
                          >
                            <Send className="w-3.5 h-3.5 text-sky-400" />
                            <span>Telegram</span>
                          </a>
                        )}

                        <button
                          onClick={() => onOpenDetails(tutor)}
                          className="px-3 py-1 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white border border-white/5"
                        >
                          Профиль
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          {favoriteTutors.length === 0 ? (
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-10 text-center text-neutral-500 text-xs">
              В избранном пока никого нет.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoriteTutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  filters={filters}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  onOpenDetails={onOpenDetails}
                  onOpenBooking={onOpenBooking}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
