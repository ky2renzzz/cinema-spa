import React, { useState } from 'react';
import { 
  Tutor, 
  StudentGrade, 
  LessonDuration, 
  LessonFormat, 
  User, 
  BookingInquiry, 
  GRADE_LABELS, 
  FORMAT_LABELS, 
  DURATION_OPTIONS 
} from '../types';
import { 
  X, 
  CheckCircle2, 
  Send, 
  MessageCircle 
} from 'lucide-react';
import { calculateLessonPrice, formatCurrency, getWhatsAppLink } from '../utils/pricing';

interface BookingModalProps {
  tutor: Tutor | null;
  currentUser: User;
  onClose: () => void;
  onSubmit: (inquiry: Omit<BookingInquiry, 'id' | 'createdAt' | 'status'>) => void;
  initialGrade: StudentGrade;
  initialDuration: LessonDuration;
  initialFormat: LessonFormat;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  tutor,
  currentUser,
  onClose,
  onSubmit,
  initialGrade,
  initialDuration,
  initialFormat,
}) => {
  if (!tutor) return null;

  const [grade, setGrade] = useState<StudentGrade>(initialGrade);
  const [duration, setDuration] = useState<LessonDuration>(initialDuration);
  const [format, setFormat] = useState<LessonFormat>(initialFormat);
  const [studentName, setStudentName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '+994 ');
  const [telegram, setTelegram] = useState(currentUser.telegram || '');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const price = calculateLessonPrice(tutor, grade, duration, format);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim()) return;

    onSubmit({
      tutorId: tutor.id,
      tutorName: tutor.name,
      studentId: currentUser.id,
      studentName: studentName.trim(),
      studentContact: {
        phone: phone.trim(),
        telegram: telegram.trim() || undefined,
      },
      subject: tutor.mainSubject,
      gradeLevel: grade,
      durationMinutes: duration,
      format,
      calculatedPrice: price,
      message: message.trim()
    });

    setIsSuccess(true);
  };

  const waLink = getWhatsAppLink(tutor.contacts.whatsapp || tutor.contacts.phone, tutor.name, tutor.mainSubject, grade);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-neutral-950 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Запись на урок
            </h3>
            <p className="text-xs text-neutral-400">
              {tutor.name} • {tutor.mainSubject}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">
                Заявка отправлена
              </h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Репетитор <strong className="text-neutral-200">{tutor.name}</strong> свяжется с вами по номеру <strong className="text-neutral-200">{phone}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-white/5 text-left text-xs space-y-1.5 text-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-500">Уровень:</span>
                <span className="font-semibold text-white">{GRADE_LABELS[grade].title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Длительность:</span>
                <span className="font-semibold text-white">{duration} мин</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Стоимость:</span>
                <span className="font-bold text-white">{formatCurrency(price)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Написать в WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl font-medium text-xs bg-white text-black hover:bg-neutral-200"
              >
                Закрыть
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Calculated price */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-white/5">
              <div>
                <span className="text-[11px] text-neutral-400">Стоимость урока:</span>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(price)}
                </div>
              </div>
              <span className="text-xs text-neutral-400">
                {duration} мин • {GRADE_LABELS[grade].title}
              </span>
            </div>

            {/* Form controls */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 mb-1 block">
                  Класс:
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as StudentGrade)}
                  className="w-full input-minimal rounded-xl px-3 py-2 text-xs"
                >
                  {(Object.keys(GRADE_LABELS) as StudentGrade[]).map((g) => (
                    <option key={g} value={g} className="bg-neutral-900 text-neutral-200">
                      {GRADE_LABELS[g].title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 mb-1 block">
                  Длительность:
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) as LessonDuration)}
                  className="w-full input-minimal rounded-xl px-3 py-2 text-xs"
                >
                  {DURATION_OPTIONS.map((d) => (
                    <option key={d} value={d} className="bg-neutral-900 text-neutral-200">
                      {d} минут
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 mb-1 block">
                  Ваше имя *:
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full input-minimal rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 mb-1 block">
                  Телефон *:
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full input-minimal rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 mb-1 block">
                Комментарий или цель занятий:
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="например: подготовка к экзамену..."
                className="w-full input-minimal rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
              >
                Отмена
              </button>

              <button
                type="submit"
                className="py-2 px-5 rounded-xl font-bold text-xs bg-white text-black hover:bg-neutral-200 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Отправить заявку</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
