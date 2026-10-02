import React, { useState, useEffect } from 'react';
import { 
  Tutor, 
  StudentGrade, 
  LessonDuration, 
  LessonFormat,
  BookingInquiry, 
  Review, 
  AvailabilitySlot,
  GRADE_LABELS, 
  DURATION_OPTIONS,
  FORMAT_LABELS,
  POPULAR_SUBJECTS
} from '../types';
import { 
  Settings, 
  Calendar, 
  MessageSquare, 
  Star, 
  Save, 
  CheckCircle2, 
  MessageCircle, 
  Send, 
  Phone, 
  Calculator,
  Briefcase,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  User
} from 'lucide-react';
import { formatCurrency, getWhatsAppLink, getTelegramLink, getPhoneLink } from '../utils/pricing';

const DAY_NAMES = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

interface TutorDashboardProps {
  tutor: Tutor;
  onSaveTutor: (updatedTutor: Tutor) => void;
  inquiries: BookingInquiry[];
  onUpdateInquiryStatus: (id: string, status: BookingInquiry['status']) => void;
  reviews: Review[];
}

type TabType = 'vacancy' | 'pricing' | 'schedule' | 'inquiries' | 'reviews';

export const TutorDashboard: React.FC<TutorDashboardProps> = ({
  tutor,
  onSaveTutor,
  inquiries,
  onUpdateInquiryStatus,
  reviews,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('vacancy');
  const [formData, setFormData] = useState<Tutor>(JSON.parse(JSON.stringify(tutor)));
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [subjectInput, setSubjectInput] = useState('');

  // Re-sync formData when tutor prop changes (e.g. after save + refresh)
  useEffect(() => {
    setFormData(JSON.parse(JSON.stringify(tutor)));
  }, [tutor]);

  const tutorInquiries = inquiries.filter(i => i.tutorId === tutor.id);
  const tutorReviews = reviews.filter(r => r.tutorId === tutor.id);

  const handleSave = () => {
    onSaveTutor(formData);
    setSaveMessage('Изменения сохранены!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const updateTierRate = (grade: StudentGrade, duration: LessonDuration, value: number) => {
    const updated = { ...formData };
    if (!updated.pricing.tiers[grade]) {
      updated.pricing.tiers[grade] = {
        durationRates: { 30: 12, 45: 16, 60: 20, 90: 28, 120: 35 },
        offlineSurcharge: 5
      };
    }
    updated.pricing.tiers[grade].durationRates[duration] = value;
    setFormData(updated);
  };

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !formData.subjects.includes(trimmed)) {
      setFormData({ ...formData, subjects: [...formData.subjects, trimmed] });
      setSubjectInput('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData({ ...formData, subjects: formData.subjects.filter(s => s !== subject) });
  };

  const addScheduleSlot = () => {
    // Find first day not yet used
    const usedDays = new Set(formData.availability.map(s => s.dayOfWeek));
    let newDay = 0;
    for (let d = 0; d < 7; d++) {
      if (!usedDays.has(d)) {
        newDay = d;
        break;
      }
    }
    const newSlot: AvailabilitySlot = {
      dayOfWeek: newDay,
      dayName: DAY_NAMES[newDay],
      startTime: '10:00',
      endTime: '18:00',
      availableHours: ['10:00', '14:00', '16:00']
    };
    setFormData({ ...formData, availability: [...formData.availability, newSlot] });
  };

  const removeScheduleSlot = (index: number) => {
    const updated = [...formData.availability];
    updated.splice(index, 1);
    setFormData({ ...formData, availability: updated });
  };

  const updateScheduleSlot = (index: number, updates: Partial<AvailabilitySlot>) => {
    const updated = [...formData.availability];
    updated[index] = { ...updated[index], ...updates };
    // Auto-update dayName when dayOfWeek changes
    if (updates.dayOfWeek !== undefined) {
      updated[index].dayName = DAY_NAMES[updates.dayOfWeek];
    }
    setFormData({ ...formData, availability: updated });
  };

  const toggleHour = (slotIndex: number, hour: string) => {
    const slot = formData.availability[slotIndex];
    const hours = slot.availableHours.includes(hour)
      ? slot.availableHours.filter(h => h !== hour)
      : [...slot.availableHours, hour].sort();
    updateScheduleSlot(slotIndex, { availableHours: hours });
  };

  const toggleFormat = (fmt: LessonFormat) => {
    const formats = formData.formats.includes(fmt)
      ? formData.formats.filter(f => f !== fmt)
      : [...formData.formats, fmt];
    if (formats.length > 0) {
      setFormData({ ...formData, formats });
    }
  };

  const profileCompleteness = (() => {
    let filled = 0;
    let total = 8;
    if (formData.name.trim()) filled++;
    if (formData.mainSubject.trim()) filled++;
    if (formData.headline.trim()) filled++;
    if (formData.bio.trim()) filled++;
    if (formData.contacts.phone.trim()) filled++;
    if (formData.city.trim()) filled++;
    if (formData.availability.length > 0) filled++;
    if (formData.education.trim()) filled++;
    return Math.round((filled / total) * 100);
  })();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={formData.avatar}
            alt={formData.name}
            className="w-14 h-14 rounded-xl object-cover border border-neutral-800"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">
                Кабинет репетитора
              </h1>
              <button
                onClick={() => {
                  setFormData({ ...formData, isPublished: !formData.isPublished });
                }}
                className={`px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1 border ${
                  formData.isPublished
                    ? 'bg-neutral-800 text-white border-neutral-700'
                    : 'bg-[#171717] text-neutral-400 border-neutral-800'
                }`}
              >
                {formData.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{formData.isPublished ? 'Опубликовано' : 'Скрыто'}</span>
              </button>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {formData.name || 'Имя не указано'} • {formData.mainSubject || 'Предмет не указан'}
            </p>
            {/* Profile completeness bar */}
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-24 h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${profileCompleteness}%` }}
                />
              </div>
              <span className="text-[10px] text-neutral-500">{profileCompleteness}% заполнено</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {saveMessage}
            </span>
          )}

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl font-bold text-xs bg-white text-black hover:bg-neutral-200 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить</span>
          </button>
        </div>
      </div>

      {!formData.isPublished && (
        <div className="bg-[#171717] border border-neutral-700 rounded-xl p-3 text-xs text-neutral-300 flex items-start gap-2">
          <EyeOff className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Ваше объявление скрыто.</strong> Заполните профиль, укажите предмет, цены и расписание. Затем нажмите «Опубликовано», чтобы стать видимым в каталоге.
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-2">
        {([
          { key: 'vacancy' as TabType, label: 'Профиль', icon: <Briefcase className="w-4 h-4" /> },
          { key: 'pricing' as TabType, label: 'Цены', icon: <Calculator className="w-4 h-4" /> },
          { key: 'schedule' as TabType, label: 'Расписание', icon: <Calendar className="w-4 h-4" /> },
          { key: 'inquiries' as TabType, label: `Заявки (${tutorInquiries.length})`, icon: <MessageSquare className="w-4 h-4" /> },
          { key: 'reviews' as TabType, label: `Отзывы (${tutorReviews.length})`, icon: <Star className="w-4 h-4" /> },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white bg-[#121212] border border-neutral-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: VACANCY / PROFILE EDITOR */}
      {activeTab === 'vacancy' && (
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 space-y-5 text-xs">
          <h3 className="text-sm font-bold text-white pb-3 border-b border-neutral-800">
            Профиль и объявление
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-300 font-medium mb-1 block">ФИО Преподавателя *:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full input-clean px-3 py-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium mb-1 block">Главный предмет *:</label>
              <select
                value={formData.mainSubject}
                onChange={(e) => setFormData({ ...formData, mainSubject: e.target.value })}
                className="w-full input-clean px-3 py-2 text-xs"
              >
                <option value="" className="bg-[#121212]">Выберите предмет</option>
                {POPULAR_SUBJECTS.filter(s => s !== 'Все предметы').map(s => (
                  <option key={s} value={s} className="bg-[#121212]">{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-neutral-300 font-medium mb-1 block">Заголовок объявления:</label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="Преподаватель математики для школьников"
                className="w-full input-clean px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium mb-1 block">Опыт преподавания (лет):</label>
              <input
                type="number"
                min={0}
                max={50}
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full input-clean px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium mb-1 block">Город:</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full input-clean px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium mb-1 block">Периодичность занятий:</label>
              <input
                type="text"
                value={formData.lessonsPerWeek}
                onChange={(e) => setFormData({ ...formData, lessonsPerWeek: e.target.value })}
                placeholder="2-3 раза в неделю"
                className="w-full input-clean px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium mb-1 block">Образование:</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="Бакинский Государственный Университет"
                className="w-full input-clean px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium mb-1 block">Языки (через запятую):</label>
              <input
                type="text"
                value={formData.languages.join(', ')}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value.split(',').map(l => l.trim()).filter(Boolean) })}
                placeholder="Азербайджанский, Русский, Английский"
                className="w-full input-clean px-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Additional subjects */}
          <div>
            <label className="text-neutral-300 font-medium mb-1.5 block">Дополнительные предметы:</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.subjects.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-lg bg-[#171717] border border-neutral-800 text-neutral-200 flex items-center gap-1.5">
                  {s}
                  <button onClick={() => removeSubject(s)} className="text-neutral-500 hover:text-white">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                placeholder="Добавить предмет..."
                className="flex-1 input-clean px-3 py-1.5 text-xs"
              />
              <button onClick={addSubject} className="px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Formats */}
          <div>
            <label className="text-neutral-300 font-medium mb-1.5 block">Формат занятий:</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(FORMAT_LABELS) as LessonFormat[]).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => toggleFormat(fmt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    formData.formats.includes(fmt)
                      ? 'bg-white text-black'
                      : 'bg-[#171717] text-neutral-400 border border-neutral-800 hover:text-white'
                  }`}
                >
                  {FORMAT_LABELS[fmt].icon} {FORMAT_LABELS[fmt].title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-medium mb-1 block">Описание:</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Расскажите о себе, опыте и подходе к обучению..."
              className="w-full input-clean px-3 py-2 text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="text-neutral-300 font-medium mb-1 block">Методика преподавания:</label>
            <textarea
              rows={2}
              value={formData.methodology}
              onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
              placeholder="Описание вашей методики..."
              className="w-full input-clean px-3 py-2 text-xs leading-relaxed"
            />
          </div>

          {/* Contacts */}
          <div className="pt-3 border-t border-neutral-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Контактная информация</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-neutral-300 font-medium mb-1 block">Телефон:</label>
                <input
                  type="text"
                  value={formData.contacts.phone}
                  onChange={(e) => setFormData({ ...formData, contacts: { ...formData.contacts, phone: e.target.value } })}
                  className="w-full input-clean px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-neutral-300 font-medium mb-1 block">WhatsApp (номер):</label>
                <input
                  type="text"
                  value={formData.contacts.whatsapp}
                  onChange={(e) => setFormData({ ...formData, contacts: { ...formData.contacts, whatsapp: e.target.value } })}
                  placeholder="9945012345678"
                  className="w-full input-clean px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-neutral-300 font-medium mb-1 block">Telegram (username):</label>
                <input
                  type="text"
                  value={formData.contacts.telegram}
                  onChange={(e) => setFormData({ ...formData, contacts: { ...formData.contacts, telegram: e.target.value } })}
                  placeholder="username"
                  className="w-full input-clean px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-neutral-300 font-medium mb-1 block">Instagram (username):</label>
                <input
                  type="text"
                  value={formData.contacts.instagram || ''}
                  onChange={(e) => setFormData({ ...formData, contacts: { ...formData.contacts, instagram: e.target.value } })}
                  placeholder="username"
                  className="w-full input-clean px-3 py-2 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING & MONTHLY RATES */}
      {activeTab === 'pricing' && (
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 space-y-6 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
            <div>
              <h3 className="text-sm font-bold text-white">
                Цены за урок и абонемент за месяц
              </h3>
              <p className="text-neutral-400">
                Укажите стоимость одного урока и ежемесячную оплату в манатах (₼)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#171717] border border-neutral-800">
              <label className="text-neutral-300 font-medium mb-1 block">Базовая цена за 1 урок (₼ / 60 мин):</label>
              <input
                type="number"
                step="1"
                value={formData.pricing.baseRate60}
                onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, baseRate60: Number(e.target.value) } })}
                className="w-full input-clean px-3 py-2 text-base font-bold"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#171717] border border-neutral-800">
              <label className="text-neutral-300 font-medium mb-1 block">Абонемент за 1 месяц (₼ / месяц):</label>
              <input
                type="number"
                step="10"
                value={formData.pricing.monthlyRate || 0}
                onChange={(e) => setFormData({ ...formData, pricing: { ...formData.pricing, monthlyRate: Number(e.target.value) } })}
                className="w-full input-clean px-3 py-2 text-base font-bold"
              />
            </div>
          </div>

          {/* Free trial toggle */}
          <div className="p-3 rounded-xl bg-[#171717] border border-neutral-800 flex items-center justify-between">
            <span className="text-neutral-200 font-medium">Бесплатный пробный урок:</span>
            <button
              onClick={() => {
                const newVal = !formData.pricing.freeTrialLesson;
                setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, freeTrialLesson: newVal },
                  freeTrialAvailable: newVal
                });
              }}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                formData.pricing.freeTrialLesson ? 'bg-white' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow transition duration-200 ${
                  formData.pricing.freeTrialLesson ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Pricing matrix per grade */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-white uppercase tracking-wider">Ставки по классам (₼):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.keys(GRADE_LABELS) as StudentGrade[]).map((gradeKey) => {
                const info = GRADE_LABELS[gradeKey];
                const tier = formData.pricing.tiers[gradeKey] || {
                  durationRates: { 30: 12, 45: 16, 60: 20, 90: 28, 120: 35 },
                  offlineSurcharge: 5
                };

                return (
                  <div key={gradeKey} className="p-3.5 rounded-xl bg-[#171717] border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{info.title}</span>
                      <span>{formatCurrency(tier.durationRates[60] || 25)} / 60м</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1 pt-1">
                      {DURATION_OPTIONS.map((dur) => (
                        <div key={dur} className="text-center">
                          <span className="text-[10px] text-neutral-500 font-medium block">{dur}м</span>
                          <input
                            type="number"
                            step="1"
                            value={tier.durationRates[dur] || 0}
                            onChange={(e) => updateTierRate(gradeKey, dur, Number(e.target.value))}
                            className="w-full input-clean px-1 py-1 text-center font-semibold text-white text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULE — Fully editable */}
      {activeTab === 'schedule' && (
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="text-sm font-bold text-white">
              Расписание свободных дней
            </h3>
            <button
              onClick={addScheduleSlot}
              disabled={formData.availability.length >= 7}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Добавить день</span>
            </button>
          </div>

          {formData.availability.length === 0 ? (
            <div className="text-center py-10 text-neutral-500">
              Расписание пока не заполнено. Добавьте дни, в которые вы свободны.
            </div>
          ) : (
            <div className="space-y-4">
              {formData.availability.map((slot, index) => (
                <div key={index} className="p-4 rounded-xl bg-[#171717] border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <select
                        value={slot.dayOfWeek}
                        onChange={(e) => updateScheduleSlot(index, { dayOfWeek: Number(e.target.value) })}
                        className="input-clean px-2.5 py-1.5 text-xs font-bold"
                      >
                        {DAY_NAMES.map((name, idx) => (
                          <option key={idx} value={idx} className="bg-[#121212]">{name}</option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <span>с</span>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateScheduleSlot(index, { startTime: e.target.value })}
                          className="input-clean px-2 py-1 text-xs"
                        />
                        <span>до</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateScheduleSlot(index, { endTime: e.target.value })}
                          className="input-clean px-2 py-1 text-xs"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => removeScheduleSlot(index)}
                      className="p-1.5 rounded-lg bg-[#0a0a0a] hover:bg-neutral-800 text-neutral-500 hover:text-red-400 border border-neutral-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Time slots */}
                  <div>
                    <label className="text-neutral-400 font-medium mb-1.5 block">Свободные часы:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {TIME_SLOTS.map((hr) => (
                        <button
                          key={hr}
                          onClick={() => toggleHour(index, hr)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                            slot.availableHours.includes(hr)
                              ? 'bg-white text-black font-bold'
                              : 'bg-[#0a0a0a] text-neutral-500 hover:text-white border border-neutral-800'
                          }`}
                        >
                          {hr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white pb-3 border-b border-neutral-800">
            Заявки от учеников ({tutorInquiries.length})
          </h3>

          {tutorInquiries.length === 0 ? (
            <div className="text-center py-10 text-neutral-500">
              Новых заявок пока нет.
            </div>
          ) : (
            <div className="space-y-3">
              {tutorInquiries.map((inq) => {
                const waLink = getWhatsAppLink(inq.studentContact.phone, inq.studentName, inq.subject, inq.gradeLevel);
                const phoneLink = getPhoneLink(inq.studentContact.phone);

                const statusLabels: Record<string, { text: string; color: string }> = {
                  pending: { text: 'Ожидает', color: 'text-neutral-400' },
                  accepted: { text: 'Принята', color: 'text-emerald-400' },
                  declined: { text: 'Отклонена', color: 'text-red-400' },
                  completed: { text: 'Завершена', color: 'text-white' },
                };
                const status = statusLabels[inq.status] || statusLabels.pending;

                return (
                  <div key={inq.id} className="p-4 rounded-xl bg-[#171717] border border-neutral-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-xs">{inq.studentName}</h4>
                        <p className="text-neutral-400 text-[11px]">
                          {GRADE_LABELS[inq.gradeLevel]?.title} • {inq.durationMinutes} мин • {formatCurrency(inq.calculatedPrice)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className={`text-[11px] font-semibold ${status.color}`}>{status.text}</span>
                        {inq.status === 'pending' && (
                          <>
                            <button
                              onClick={() => onUpdateInquiryStatus(inq.id, 'accepted')}
                              className="px-2.5 py-1 rounded bg-white text-black font-bold text-[11px]"
                            >
                              Принять
                            </button>
                            <button
                              onClick={() => onUpdateInquiryStatus(inq.id, 'declined')}
                              className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 font-bold text-[11px]"
                            >
                              Отклонить
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {inq.message && (
                      <p className="text-neutral-400 text-[11px] bg-[#0a0a0a] px-3 py-2 rounded-lg">
                        «{inq.message}»
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#0a0a0a] hover:bg-neutral-900 text-emerald-400 border border-neutral-800 flex items-center gap-1.5 font-medium"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp ({inq.studentContact.phone})</span>
                      </a>

                      <a
                        href={phoneLink}
                        className="px-3 py-1.5 rounded-lg bg-[#0a0a0a] text-neutral-300 hover:text-white border border-neutral-800"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white pb-3 border-b border-neutral-800">
            Отзывы учеников ({tutorReviews.length})
          </h3>

          {tutorReviews.length === 0 ? (
            <div className="text-center py-10 text-neutral-500">
              Отзывов пока нет. Ваши ученики смогут оставить отзыв после занятий.
            </div>
          ) : (
            <div className="space-y-3">
              {tutorReviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-[#171717] border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                      <div>
                        <span className="font-bold text-white">{rev.authorName}</span>
                        {rev.gradeLevel && (
                          <span className="text-neutral-500 ml-1.5">• {GRADE_LABELS[rev.gradeLevel]?.title}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-white text-white' : 'text-neutral-700'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-neutral-300 leading-relaxed">{rev.comment}</p>

                  {rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {rev.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-[#0a0a0a] text-neutral-400 text-[10px]">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-neutral-600">{rev.createdAt}</div>
                </div>
              ))}
            </div>
          )}

          {/* Average ratings */}
          {tutorReviews.length > 0 && (
            <div className="p-4 rounded-xl bg-[#171717] border border-neutral-800">
              <h4 className="font-bold text-white mb-2">Средние оценки</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Общая', value: tutorReviews.reduce((s, r) => s + r.rating, 0) / tutorReviews.length },
                  { label: 'Ясность', value: tutorReviews.reduce((s, r) => s + r.clarityRating, 0) / tutorReviews.length },
                  { label: 'Пунктуальность', value: tutorReviews.reduce((s, r) => s + r.punctualityRating, 0) / tutorReviews.length },
                  { label: 'Результат', value: tutorReviews.reduce((s, r) => s + r.resultRating, 0) / tutorReviews.length },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-lg font-bold text-white">{stat.value.toFixed(1)}</div>
                    <div className="text-neutral-500 text-[10px]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
