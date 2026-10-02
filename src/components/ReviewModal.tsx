import React, { useState } from 'react';
import { Tutor, StudentGrade, Review, GRADE_LABELS } from '../types';
import { X, Star, UserX, Check } from 'lucide-react';

interface ReviewModalProps {
  tutor: Tutor | null;
  onClose: () => void;
  onSubmit: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

const AVAILABLE_TAGS = [
  'Понятно объясняет',
  'Сдали ЕГЭ на 85+',
  'Сдали ОГЭ на 5',
  'Пунктуальный',
  'Индивидуальный подход',
  'Быстрый прогресс'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  tutor,
  onClose,
  onSubmit,
}) => {
  if (!tutor) return null;

  const [rating, setRating] = useState<number>(5);
  const [clarityRating, setClarityRating] = useState<number>(5);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);
  const [resultRating, setResultRating] = useState<number>(5);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [gradeLevel, setGradeLevel] = useState<StudentGrade>('grades_10_11_exam');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Понятно объясняет']);
  const [comment, setComment] = useState<string>('');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmit({
      tutorId: tutor.id,
      authorName: isAnonymous ? 'Анонимный ученик' : 'Ученик',
      isAnonymous,
      rating,
      clarityRating,
      punctualityRating,
      resultRating,
      comment: comment.trim(),
      gradeLevel,
      tags: selectedTags,
      verified: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-neutral-950 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Оставить отзыв
            </h3>
            <p className="text-xs text-neutral-400">
              Преподаватель: {tutor.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Star rating */}
          <div className="text-center p-4 rounded-xl bg-neutral-950 border border-white/5 space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Общая оценка:
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      s <= rating ? 'fill-white text-white' : 'text-neutral-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Anonymous toggle */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-medium text-neutral-200">Опубликовать анонимно</span>
            </div>

            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                isAnonymous ? 'bg-white' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-black shadow transition duration-200 ${
                  isAnonymous ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Grade Level */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1 block">
              Класс / Уровень:
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value as StudentGrade)}
              className="w-full input-minimal rounded-xl px-3 py-2 text-xs"
            >
              {(Object.keys(GRADE_LABELS) as StudentGrade[]).map((g) => (
                <option key={g} value={g} className="bg-neutral-900 text-neutral-200">
                  {GRADE_LABELS[g].title}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1 block">
              Теги:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-white text-black font-semibold'
                        : 'bg-neutral-950 text-neutral-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1 block">
              Текст отзыва *:
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Напишите ваш честный отзыв об уроках..."
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
              className="py-2 px-5 rounded-xl font-bold text-xs bg-white text-black hover:bg-neutral-200"
            >
              Опубликовать
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
