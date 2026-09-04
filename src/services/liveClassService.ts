import { LiveClassSession } from '../types';

export type LiveSessionStatus = 'live_now' | 'scheduled' | 'ended';

/**
 * Checks the dynamic status of a live session based on date, start time, and duration
 */
export function getLiveSessionDynamicStatus(session: LiveClassSession): LiveSessionStatus {
  if (!session || !session.date) return 'scheduled';

  try {
    const timeStr = session.time || '20:00';
    const [hours, minutes] = timeStr.split(':').map(n => parseInt(n, 10) || 0);

    const sessionStart = new Date(session.date);
    sessionStart.setHours(hours, minutes, 0, 0);

    const duration = session.durationMinutes || 90;
    const sessionEnd = new Date(sessionStart.getTime() + duration * 60 * 1000);

    const now = new Date();

    if (now >= sessionStart && now <= sessionEnd) {
      return 'live_now';
    } else if (now < sessionStart) {
      return 'scheduled';
    } else {
      return 'ended';
    }
  } catch {
    return 'scheduled';
  }
}

/**
 * Returns active live sessions (live now or upcoming scheduled sessions)
 */
export function getActiveLiveSessions(sessions: LiveClassSession[]): LiveClassSession[] {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter(session => {
    const status = getLiveSessionDynamicStatus(session);
    return status === 'live_now' || status === 'scheduled';
  });
}

/**
 * Formats date and time into a readable Bangla schedule string
 */
export function formatBanglaLiveSchedule(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return 'শীঘ্রই সময় নির্ধারিত হবে';

  const banglaDigits: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };

  const toBn = (num: number | string) =>
    num.toString().replace(/\d/g, d => banglaDigits[d] || d);

  try {
    const dateObj = new Date(dateStr);
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

    const dayName = days[dateObj.getDay()] || '';
    const day = toBn(dateObj.getDate());
    const month = months[dateObj.getMonth()] || '';
    const year = toBn(dateObj.getFullYear());

    let timeFormatted = '';
    if (timeStr) {
      const [h, m] = timeStr.split(':').map(n => parseInt(n, 10) || 0);
      const isPm = h >= 12;
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const minutePad = m < 10 ? `0${m}` : `${m}`;
      const period = isPm
        ? (h >= 17 ? 'সন্ধ্যা' : h >= 20 ? 'রাত' : 'দুপুর')
        : (h < 6 ? 'রাত' : 'সকাল');

      timeFormatted = `, ${period} ${toBn(hour12)}:${toBn(minutePad)} মিনিট`;
    }

    return `${day} ${month} ${year} (${dayName})${timeFormatted}`;
  } catch {
    return dateStr;
  }
}
