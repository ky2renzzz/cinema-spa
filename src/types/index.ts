export type StudentGrade = 
  | 'grades_1_4'        // 1-4 классы
  | 'grades_5_9'        // 5-9 классы
  | 'grades_10_11_exam' // 10-11 классы / Экзамены
  | 'university_adult'; // Студенты / Взрослые

export type LessonDuration = 30 | 45 | 60 | 90 | 120; // в минутах

export type LessonFormat = 'online' | 'tutor_home' | 'student_home';

export interface DurationRateMap {
  30: number;
  45: number;
  60: number;
  90: number;
  120: number;
}

export interface GradePricingConfig {
  durationRates: DurationRateMap;
  offlineSurcharge?: number; // Доплата за выезд (₼)
  description?: string;
}

export interface PricingMatrix {
  baseRate60: number; // Базовая ставка за урок (₼)
  monthlyRate?: number; // Стоимость за месяц (₼ / месяц)
  freeTrialLesson: boolean;
  trialDurationMinutes?: number;
  tiers: Record<StudentGrade, GradePricingConfig>;
}

export interface TutorContacts {
  phone: string;
  whatsapp: string;
  telegram: string;
  instagram?: string;
  email: string;
}

export interface AvailabilitySlot {
  dayOfWeek: number; // 0 = Пн, 6 = Вс
  dayName: string;
  startTime: string;
  endTime: string;
  availableHours: string[];
}

export interface Review {
  id: string;
  tutorId: string;
  authorName: string;
  isAnonymous: boolean;
  rating: number;
  clarityRating: number;
  punctualityRating: number;
  resultRating: number;
  comment: string;
  gradeLevel?: StudentGrade;
  tags: string[];
  createdAt: string;
  verified: boolean;
}

export interface Tutor {
  id: string;
  userId?: string;
  name: string;
  headline: string;
  avatar: string;
  subjects: string[];
  mainSubject: string;
  experienceYears: number;
  education: string;
  bio: string;
  methodology: string;
  achievements: string[];
  city: string;
  languages: string[];
  formats: LessonFormat[];
  lessonsPerWeek: string; // e.g. "2-3 раза в неделю"
  pricing: PricingMatrix;
  contacts: TutorContacts;
  availability: AvailabilitySlot[];
  rating: number;
  reviewsCount: number;
  badges: string[];
  isVerified: boolean;
  freeTrialAvailable: boolean;
  completedLessonsCount: number;
  isPublished: boolean; // Опубликована ли вакансия
}

export interface BookingInquiry {
  id: string;
  tutorId: string;
  tutorName: string;
  studentId?: string;
  studentName: string;
  studentContact: {
    phone: string;
    telegram?: string;
    whatsapp?: string;
  };
  subject: string;
  gradeLevel: StudentGrade;
  durationMinutes: LessonDuration;
  format: LessonFormat;
  calculatedPrice: number; // в манатах (₼)
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

export type UserRole = 'guest' | 'student' | 'tutor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  tutorProfileId?: string;
  gradeLevel?: StudentGrade;
  favorites: string[];
}

export interface FilterState {
  searchQuery: string;
  selectedSubject: string;
  selectedGrade: StudentGrade | 'all';
  selectedDuration: LessonDuration;
  selectedFormat: LessonFormat | 'all';
  priceRange: [number, number]; // [min ₼, max ₼]
  freeTrialOnly: boolean;
  selectedDay: number | 'all';
  minRating: number;
  sortBy: 'rating' | 'price_asc' | 'price_desc' | 'experience' | 'reviews';
}

export const GRADE_LABELS: Record<StudentGrade, { title: string; subtitle: string; icon: string }> = {
  grades_1_4: { title: '1–4 классы', subtitle: 'Начальная школа (7–10 лет)', icon: '🎒' },
  grades_5_9: { title: '5–9 классы', subtitle: 'Средняя школа / Выпускные (11–15 лет)', icon: '📐' },
  grades_10_11_exam: { title: '10–11 классы', subtitle: 'Экзамены, Поступление (16–18 лет)', icon: '🎓' },
  university_adult: { title: 'Студенты и Взрослые', subtitle: 'Высшая математика, Языки, IT', icon: '💼' }
};

export const FORMAT_LABELS: Record<LessonFormat, { title: string; icon: string }> = {
  online: { title: 'Онлайн', icon: '💻' },
  tutor_home: { title: 'У репетитора', icon: '🏠' },
  student_home: { title: 'Выезд к ученику', icon: '🚗' }
};

export const DURATION_OPTIONS: LessonDuration[] = [30, 45, 60, 90, 120];

export const POPULAR_SUBJECTS = [
  'Все предметы',
  'Математика',
  'Английский язык',
  'Физика',
  'Информатика / Программирование',
  'Химия и Биология',
  'Азербайджанский язык',
  'Русский язык',
  'Немецкий язык'
];
