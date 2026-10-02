import React, { useState } from 'react';
import { 
  Tutor, 
  StudentGrade, 
  LessonDuration, 
  LessonFormat, 
  Review, 
  GRADE_LABELS, 
  FORMAT_LABELS, 
  DURATION_OPTIONS 
} from '../types';
import { 
  X, 
  Star, 
  CheckCircle2, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  Calculator, 
  Check, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

import { 
  calculateLessonPrice, 
  formatCurrency, 
  getWhatsAppLink, 
  getTelegramLink, 
  getPhoneLink, 
  getInstagramLink 
} from '../utils/pricing';

interface TutorDetailModalProps {
  tutor: Tutor | null;
  reviews: Review[];
  onClose: () => void;
  onOpenBooking: (tutor: Tutor, grade: StudentGrade, duration: LessonDuration, format: LessonFormat) => void;
  onOpenReviewModal: (tutor: Tutor) => void;
  initialGrade?: StudentGrade;
  initialDuration?: LessonDuration;
  initialFormat?: LessonFormat;
}

export const TutorDetailModal: React.FC<TutorDetailModalProps> = ({
  tutor,
  reviews,
  onClose,
  onOpenBooking,
  onOpenReviewModal,
  initialGrade = 'grades_10_11_exam',
  initialDuration = 60,
  initialFormat = 'online',
}) => {
  if (!tutor) return null;

  const [calcGrade, setCalcGrade] = useState<StudentGrade>(initialGrade);
  const [calcDuration, setCalcDuration] = useState<LessonDuration>(initialDuration);
  const [calcFormat, setCalcFormat] = useState<LessonFormat>(initialFormat);

  const calculatedPrice = calculateLessonPrice(tutor, calcGrade, calcDuration, calcFormat);
  const monthlyPrice = tutor.pricing.monthlyRate || (calculatedPrice * 8);
  const tutorReviews = reviews.filter(r => r.tutorId === tutor.id);

  const waLink = getWhatsAppLink(tutor.contacts.whatsapp || tutor.contacts.phone, tutor.name, tutor.mainSubject, calcGrade);
  const tgLink = tutor.contacts.telegram ? getTelegramLink(tutor.contacts.telegram) : null;
  const phoneLink = getPhoneLink(tutor.contacts.phone);
  const instaLink = tutor.contacts.instagram ? getInstagramLink(tutor.contacts.instagram) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-neutral-950 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400">
            Объявление репетитора
          </span>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          
          {/* Main Info Header */}
          <div className="flex flex-col sm:flex-row items-start gap-5 bg-[#121212] p-5 rounded-xl border border-neutral-800">
            <div className="relative shrink-0">
              <img
                src={tutor.avatar}
                alt={tutor.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-neutral-800"
              />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {tutor.name}
                </h2>
                {tutor.isVerified && (
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[11px] font-medium border border-neutral-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Проверен
                  </span>
                )}
              </div>

              {tutor.headline && (
                <p className="text-xs text-neutral-300">
                  {tutor.headline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-neutral-400">
                {tutor.rating > 0 && (
                  <div className="flex items-center gap-1 bg-[#181818] px-2.5 py-1 rounded font-semibold text-neutral-200 border border-neutral-800">
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                    <span>{tutor.rating.toFixed(1)}</span>
                    <span className="text-neutral-500 font-normal">({tutorReviews.length})</span>
                  </div>
                )}

                {tutor.experienceYears > 0 && (
                  <div className="flex items-center gap-1 bg-[#181818] px-2.5 py-1 rounded border border-neutral-800">
                    <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Опыт {tutor.experienceYears} лет</span>
                  </div>
                )}

                <div className="flex items-center gap-1 bg-[#181818] px-2.5 py-1 rounded border border-neutral-800">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{tutor.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC PRICING MATRIX CALCULATOR */}
          <div className="bg-neutral-950 p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-neutral-300" />
              <div>
                <h3 className="text-base font-bold text-white">
                  Калькулятор стоимости за урок и за месяц
                </h3>
                <p className="text-xs text-neutral-400">
                  Выберите параметры для расчёта оплаты
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center pt-2">
              {/* Controls */}
              <div className="lg:col-span-2 space-y-4">
                {/* 1. Grade */}
                <div>
                  <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                    1. Класс / уровень ученика:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(GRADE_LABELS) as StudentGrade[]).map((gradeKey) => {
                      const info = GRADE_LABELS[gradeKey];
                      const isSelected = calcGrade === gradeKey;
                      return (
                        <button
                          key={gradeKey}
                          onClick={() => setCalcGrade(gradeKey)}
                          className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-white text-black font-bold shadow'
                              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
                          }`}
                        >
                          <span className="text-xs font-bold">{info.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Duration */}
                <div>
                  <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                    2. Длительность:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DURATION_OPTIONS.map((dur) => {
                      const isSelected = calcDuration === dur;
                      return (
                        <button
                          key={dur}
                          onClick={() => setCalcDuration(dur)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all text-center ${
                            isSelected
                              ? 'bg-white text-black font-bold shadow'
                              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {dur} мин
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Format */}
                <div>
                  <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                    3. Формат проведения:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tutor.formats.map((fmt) => {
                      const info = FORMAT_LABELS[fmt];
                      const isSelected = calcFormat === fmt;
                      return (
                        <button
                          key={fmt}
                          onClick={() => setCalcFormat(fmt)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all text-center ${
                            isSelected
                              ? 'bg-white text-black font-bold shadow'
                              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {info.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Price Calculation Box */}
              <div className="bg-neutral-900 p-6 rounded-2xl border border-white/10 text-center flex flex-col justify-between h-full space-y-4">
                <div>
                  <span className="text-xs font-semibold text-neutral-400">
                    За 1 урок ({calcDuration} мин):
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {formatCurrency(calculatedPrice)}
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-800">
                    <span className="text-xs text-neutral-400 block">Абонемент за месяц:</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(monthlyPrice)} / месяц</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBooking(tutor, calcGrade, calcDuration, calcFormat)}
                  className="w-full py-3 rounded-xl font-bold text-xs bg-white text-black hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
                >
                  <span>Записаться на урок</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* DIRECT CONTACTS */}
          <div className="bg-neutral-950 p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>💬</span> Прямые контакты
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-white/10 transition-all flex items-center gap-3"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">WhatsApp</p>
                  <p className="text-[11px] text-neutral-400">{tutor.contacts.phone}</p>
                </div>
              </a>

              {tgLink && (
                <a
                  href={tgLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-white/10 transition-all flex items-center gap-3"
                >
                  <Send className="w-5 h-5 text-sky-400" />
                  <div>
                    <p className="text-xs font-bold text-white">Telegram</p>
                    <p className="text-[11px] text-neutral-400">@{tutor.contacts.telegram}</p>
                  </div>
                </a>
              )}

              <a
                href={phoneLink}
                className="p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-white/10 transition-all flex items-center gap-3"
              >
                <Phone className="w-5 h-5 text-neutral-300" />
                <div>
                  <p className="text-xs font-bold text-white">Позвонить</p>
                  <p className="text-[11px] text-neutral-400">{tutor.contacts.phone}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-neutral-950 p-5 rounded-2xl border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                О преподавателе
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {tutor.bio}
              </p>
              <div className="pt-2 text-xs text-neutral-400 border-t border-white/5">
                🎓 <strong>Образование:</strong> {tutor.education}
              </div>
            </div>

            <div className="bg-neutral-950 p-5 rounded-2xl border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Методика и график
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {tutor.methodology}
              </p>
              <div className="pt-2 text-xs text-neutral-300 border-t border-white/5">
                📅 <strong>Периодичность:</strong> {tutor.lessonsPerWeek || '2-3 раза в неделю'}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
