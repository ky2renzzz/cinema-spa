import { Tutor, Review, BookingInquiry, User } from '../types';

const STORAGE_KEYS = {
  TUTORS: 'tutorhub_tutors_v4',
  REVIEWS: 'tutorhub_reviews_v4',
  INQUIRIES: 'tutorhub_inquiries_v4',
  USERS: 'tutorhub_users_v4',
  ACTIVE_USER_ID: 'tutorhub_active_user_id_v4',
};

/**
 * Generate a deterministic initials-based avatar data-URI (no external URLs)
 */
function generateAvatarUrl(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  // Deterministic color from name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  const bg = `hsl(${hue}, 35%, 25%)`;
  const fg = `hsl(${hue}, 30%, 85%)`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="${bg}" rx="20"/>
    <text x="100" y="108" font-family="Inter,system-ui,sans-serif" font-size="72" font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

class StorageService {
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  getCurrentUser(): User | null {
    try {
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
      if (!activeId) return null;
      const users = this.getUsers();
      return users.find(u => u.id === activeId) || null;
    } catch {
      return null;
    }
  }

  login(email: string, pass: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'Пользователь с таким Email не найден.' };
    }

    if (user.password && user.password !== pass) {
      return { success: false, error: 'Неверный пароль.' };
    }

    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, user.id);
    return { success: true, user };
  }

  registerUser(data: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: 'student' | 'tutor';
  }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanEmail = data.email.toLowerCase().trim();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Этот Email уже зарегистрирован. Войдите в аккаунт.' };
    }

    const userId = `user-${Date.now()}`;
    let tutorProfileId: string | undefined = undefined;

    if (data.role === 'tutor') {
      tutorProfileId = `tutor-${Date.now()}`;
      const newTutor: Tutor = {
        id: tutorProfileId,
        userId,
        name: data.name,
        headline: '',
        avatar: generateAvatarUrl(data.name),
        subjects: [],
        mainSubject: '',
        experienceYears: 0,
        education: '',
        bio: '',
        methodology: '',
        achievements: [],
        city: 'Баку',
        languages: ['Азербайджанский', 'Русский'],
        formats: ['online'],
        lessonsPerWeek: '',
        pricing: {
          baseRate60: 25,
          monthlyRate: 200,
          freeTrialLesson: false,
          trialDurationMinutes: 30,
          tiers: {
            grades_1_4: { durationRates: { 30: 12, 45: 16, 60: 20, 90: 28, 120: 35 }, offlineSurcharge: 4 },
            grades_5_9: { durationRates: { 30: 14, 45: 18, 60: 22, 90: 30, 120: 38 }, offlineSurcharge: 5 },
            grades_10_11_exam: { durationRates: { 30: 16, 45: 20, 60: 25, 90: 35, 120: 45 }, offlineSurcharge: 6 },
            university_adult: { durationRates: { 30: 18, 45: 24, 60: 30, 90: 42, 120: 55 }, offlineSurcharge: 7 }
          }
        },
        contacts: {
          phone: data.phone,
          whatsapp: data.phone.replace(/[^0-9]/g, ''),
          telegram: '',
          email: cleanEmail
        },
        availability: [],
        rating: 0,
        reviewsCount: 0,
        badges: [],
        isVerified: false,
        freeTrialAvailable: false,
        completedLessonsCount: 0,
        isPublished: false // Start unpublished — tutor must fill profile first
      };

      this.saveTutor(newTutor);
    }

    const newUser: User = {
      id: userId,
      name: data.name,
      email: cleanEmail,
      password: data.password,
      role: data.role,
      phone: data.phone,
      tutorProfileId,
      favorites: []
    };

    users.push(newUser);
    this.saveUsers(users);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, newUser.id);
    return { success: true, user: newUser };
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
  }

  getTutors(): Tutor[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TUTORS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /** Only published tutors for catalog display */
  getPublishedTutors(): Tutor[] {
    return this.getTutors().filter(t => t.isPublished);
  }

  getTutorById(id: string): Tutor | undefined {
    return this.getTutors().find(t => t.id === id);
  }

  saveTutors(tutors: Tutor[]): void {
    localStorage.setItem(STORAGE_KEYS.TUTORS, JSON.stringify(tutors));
  }

  saveTutor(tutor: Tutor): Tutor {
    const tutors = this.getTutors();
    const index = tutors.findIndex(t => t.id === tutor.id);
    if (index >= 0) {
      tutors[index] = tutor;
    } else {
      tutors.unshift(tutor);
    }
    this.saveTutors(tutors);
    return tutor;
  }

  getReviews(tutorId?: string): Review[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const reviews: Review[] = data ? JSON.parse(data) : [];
      if (tutorId) {
        return reviews.filter(r => r.tutorId === tutorId);
      }
      return reviews;
    } catch {
      return [];
    }
  }

  addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const allReviews = this.getReviews();
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      verified: true
    };
    allReviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(allReviews));

    const tutorReviews = allReviews.filter(r => r.tutorId === review.tutorId);
    if (tutorReviews.length > 0) {
      const avgRating = tutorReviews.reduce((sum, r) => sum + r.rating, 0) / tutorReviews.length;
      const tutor = this.getTutorById(review.tutorId);
      if (tutor) {
        tutor.rating = Number(avgRating.toFixed(2));
        tutor.reviewsCount = tutorReviews.length;
        this.saveTutor(tutor);
      }
    }

    return newReview;
  }

  getInquiries(): BookingInquiry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  createInquiry(inquiry: Omit<BookingInquiry, 'id' | 'createdAt' | 'status'>): BookingInquiry {
    const inquiries = this.getInquiries();
    const newInquiry: BookingInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    return newInquiry;
  }

  updateInquiryStatus(id: string, status: BookingInquiry['status']): void {
    const inquiries = this.getInquiries();
    const inq = inquiries.find(i => i.id === id);
    if (inq) {
      inq.status = status;
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    }
  }

  toggleFavorite(tutorId: string): string[] {
    const user = this.getCurrentUser();
    if (!user) return [];
    const favorites = user.favorites || [];
    const index = favorites.indexOf(tutorId);
    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(tutorId);
    }
    user.favorites = favorites;

    const users = this.getUsers();
    const uIdx = users.findIndex(u => u.id === user.id);
    if (uIdx >= 0) {
      users[uIdx] = user;
      this.saveUsers(users);
    }
    return favorites;
  }

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.TUTORS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
  }
}

export const storage = new StorageService();
