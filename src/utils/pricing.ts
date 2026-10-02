import { Tutor, StudentGrade, LessonDuration, LessonFormat, GRADE_LABELS } from '../types';

/**
 * Рассчитывает точную стоимость урока в манатах (AZN / ₼)
 */
export function calculateLessonPrice(
  tutor: Tutor,
  grade: StudentGrade,
  duration: LessonDuration,
  format: LessonFormat
): number {
  const tier = tutor.pricing?.tiers?.[grade];
  if (!tier) {
    const base = tutor.pricing?.baseRate60 || 25;
    const ratio = duration / 60;
    return Math.round(base * ratio);
  }

  let price = tier.durationRates?.[duration];
  if (!price) {
    const base60 = tier.durationRates?.[60] || tutor.pricing.baseRate60 || 25;
    price = Math.round(base60 * (duration / 60));
  }

  if (format === 'student_home' && tier.offlineSurcharge) {
    price += tier.offlineSurcharge;
  } else if (format === 'tutor_home' && tier.offlineSurcharge) {
    price += Math.round(tier.offlineSurcharge * 0.5);
  }

  return price;
}

/**
 * Диапазон цен репетитора в манатах
 */
export function getTutorPriceRange(tutor: Tutor): { min: number; max: number } {
  const prices: number[] = [];
  
  if (tutor.pricing?.tiers) {
    Object.values(tutor.pricing.tiers).forEach(tier => {
      if (tier.durationRates) {
        Object.values(tier.durationRates).forEach(rate => {
          if (typeof rate === 'number' && rate > 0) {
            prices.push(rate);
          }
        });
      }
    });
  }

  if (prices.length === 0) {
    const base = tutor.pricing?.baseRate60 || 25;
    return { min: Math.round(base * 0.5), max: Math.round(base * 2) };
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

/**
 * Форматирование стоимости в манатах (AZN / ₼)
 */
export function formatCurrency(amount: number): string {
  return `${amount} ₼`;
}

/**
 * Ссылка для WhatsApp с готовым сообщением
 */
export function getWhatsAppLink(phone: string, tutorName: string, subject: string, grade?: StudentGrade): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const gradeText = grade ? `для ${GRADE_LABELS[grade].title}` : '';
  const message = `Здравствуйте, ${tutorName}! Нашел(ла) ваш профиль на платформе TutorHub. Хочу уточнить возможность занятий по предмету "${subject}" ${gradeText}.`;
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Ссылка для Telegram
 */
export function getTelegramLink(tgHandle: string): string {
  const cleanHandle = tgHandle.replace(/[@https:\/\/t.me\/]/g, '').trim();
  return `https://t.me/${cleanHandle}`;
}

/**
 * Ссылка для Instagram
 */
export function getInstagramLink(instaHandle: string): string {
  const cleanHandle = instaHandle.replace(/[@https:\/\/instagram.com\/]/g, '').trim();
  return `https://instagram.com/${cleanHandle}`;
}

/**
 * Ссылка для телефона
 */
export function getPhoneLink(phone: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  return `tel:${cleanPhone}`;
}
