import { useEffect, useState } from 'react';
import { Language } from '../types';

export interface RigaSalonStatus {
  isOpen: boolean;
  statusText: string;
  subText: string;
  currentDayType: 'weekday_sat' | 'sunday';
  nextOpenTime: string;
  isTodayOpenNext: boolean;
}

export interface NextOpeningRigaInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  labelTime: string;
  isToday: boolean;
  utcStart: Date;
  utcEnd: Date;
}

interface RigaDateParts {
  year: number;
  month: number;
  day: number;
  weekday: string;
  hour: number;
  minute: number;
}

function getRigaDateParts(date: Date = new Date()): RigaDateParts {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Riga',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date);

  const getNum = (type: string, fallback: number) => {
    const val = Number(parts.find(p => p.type === type)?.value);
    return Number.isFinite(val) ? val : fallback;
  };

  const weekday = parts.find(p => p.type === 'weekday')?.value || 'Mon';
  const hourRaw = getNum('hour', 12);

  return {
    year: getNum('year', date.getUTCFullYear()),
    month: getNum('month', date.getUTCMonth() + 1),
    day: getNum('day', date.getUTCDate()),
    weekday,
    hour: hourRaw === 24 ? 0 : hourRaw,
    minute: getNum('minute', date.getUTCMinutes())
  };
}

// Converts a target wall-clock date/time in Europe/Riga directly into the exact UTC Date (DST-safe)
function rigaWallTimeToUtcDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  let candidate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  for (let pass = 0; pass < 2; pass++) {
    const actual = getRigaDateParts(candidate);
    const desiredWallMs = Date.UTC(year, month - 1, day, hour, minute, 0);
    const actualWallMs = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, 0);
    const diffMs = desiredWallMs - actualWallMs;
    if (diffMs === 0) break;
    candidate = new Date(candidate.getTime() + diffMs);
  }
  return candidate;
}

export function getNextOpeningRigaInfo(now: Date = new Date()): NextOpeningRigaInfo {
  try {
    const riga = getRigaDateParts(now);
    const totalMinutes = riga.hour * 60 + riga.minute;
    const isSundayToday = riga.weekday === 'Sun';
    const openMinToday = isSundayToday ? 10 * 60 : 9 * 60;
    const isBeforeOpen = totalMinutes < openMinToday;

    let targetYear = riga.year;
    let targetMonth = riga.month;
    let targetDay = riga.day;
    let openHour = isSundayToday ? 10 : 9;

    if (!isBeforeOpen) {
      // Next day in calendar
      const tomorrowCal = new Date(Date.UTC(riga.year, riga.month - 1, riga.day + 1));
      targetYear = tomorrowCal.getUTCFullYear();
      targetMonth = tomorrowCal.getUTCMonth() + 1;
      targetDay = tomorrowCal.getUTCDate();
      const nextIsSunday = riga.weekday === 'Sat';
      openHour = nextIsSunday ? 10 : 9;
    }

    const utcStart = rigaWallTimeToUtcDate(targetYear, targetMonth, targetDay, openHour, 0);
    const utcEnd = new Date(utcStart.getTime() + 15 * 60 * 1000);
    const labelTime = openHour === 10 ? '10:00' : '09:00';

    return {
      year: targetYear,
      month: targetMonth,
      day: targetDay,
      hour: openHour,
      minute: 0,
      labelTime,
      isToday: isBeforeOpen,
      utcStart,
      utcEnd
    };
  } catch {
    const fallbackStart = new Date(now.getTime() + 12 * 3600 * 1000);
    return {
      year: fallbackStart.getUTCFullYear(),
      month: fallbackStart.getUTCMonth() + 1,
      day: fallbackStart.getUTCDate(),
      hour: 9,
      minute: 0,
      labelTime: '09:00',
      isToday: false,
      utcStart: fallbackStart,
      utcEnd: new Date(fallbackStart.getTime() + 15 * 60 * 1000)
    };
  }
}

function formatIcsUtc(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

const CALENDAR_COPY: Record<
  Language,
  { summary: string; description: string }
> = {
  lv: {
    summary: 'Piezvanīt Salons Aneri (+371 27580047)',
    description:
      'Atgādinājums sazināties ar Salons Aneri administratoru par pierakstu.\\nTālrunis: +371 27580047\\nAdrese: Latgales iela 264, Rīga\\nVietne: https://aneri.lv'
  },
  ru: {
    summary: 'Позвонить в Salons Aneri (+371 27580047)',
    description:
      'Напоминание позвонить администратору Salons Aneri для записи.\\nТелефон: +371 27580047\\nАдрес: ул. Латгалес 264, Рига\\nСайт: https://aneri.lv'
  },
  en: {
    summary: 'Call Salons Aneri (+371 27580047)',
    description:
      'Reminder to call Salons Aneri administrator to book your visit.\\nPhone: +371 27580047\\nAddress: Latgales iela 264, Riga\\nWebsite: https://aneri.lv'
  }
};

export function buildCallReminderIcs(lang: Language, now: Date = new Date()): string {
  const nextOpen = getNextOpeningRigaInfo(now);
  const copy = CALENDAR_COPY[lang] || CALENDAR_COPY.lv;
  const uid = `aneri-call-${nextOpen.year}${nextOpen.month}${nextOpen.day}-${Date.now()}@aneri.lv`;
  const stamp = formatIcsUtc(now);
  const dtStart = formatIcsUtc(nextOpen.utcStart);
  const dtEnd = formatIcsUtc(nextOpen.utcEnd);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Salons Aneri//Riga Call Reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${copy.summary}`,
    `DESCRIPTION:${copy.description}`,
    'LOCATION:Latgales iela 264, Rīga, LV-1063',
    'URL:https://aneri.lv',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${copy.summary}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

export function downloadCallReminderIcs(lang: Language, now: Date = new Date()): NextOpeningRigaInfo {
  const nextOpen = getNextOpeningRigaInfo(now);
  const icsContent = buildCallReminderIcs(lang, now);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aneri-call-reminder.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return nextOpen;
}

export function buildGoogleCalendarUrl(lang: Language, now: Date = new Date()): string {
  const nextOpen = getNextOpeningRigaInfo(now);
  const copy = CALENDAR_COPY[lang] || CALENDAR_COPY.lv;
  const dates = `${formatIcsUtc(nextOpen.utcStart)}/${formatIcsUtc(nextOpen.utcEnd)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: copy.summary,
    dates,
    details: copy.description.replace(/\\n/g, '\n'),
    location: 'Salons Aneri, Latgales iela 264, Rīga',
    ctz: 'Europe/Riga'
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function isSalonOpenInRigaNow(now: Date = new Date()): boolean {
  try {
    const riga = getRigaDateParts(now);
    const totalMinutes = riga.hour * 60 + riga.minute;
    const isSunday = riga.weekday === 'Sun';
    const openMin = isSunday ? 10 * 60 : 9 * 60;
    const closeMin = isSunday ? 16 * 60 : 20 * 60;
    return totalMinutes >= openMin && totalMinutes < closeMin;
  } catch {
    return true;
  }
}

export function computeRigaStatus(lang: Language, now: Date = new Date()): RigaSalonStatus {
  try {
    const riga = getRigaDateParts(now);
    const totalMinutes = riga.hour * 60 + riga.minute;

    const isSunday = riga.weekday === 'Sun';
    const openMin = isSunday ? 10 * 60 : 9 * 60;
    const closeMin = isSunday ? 16 * 60 : 20 * 60;
    const isOpen = totalMinutes >= openMin && totalMinutes < closeMin;
    const closeHourLabel = isSunday ? '16:00' : '20:00';

    const nextInfo = getNextOpeningRigaInfo(now);
    const nextOpenTime = nextInfo.labelTime;
    const isBeforeOpen = nextInfo.isToday;

    if (lang === 'ru') {
      return {
        isOpen,
        currentDayType: isSunday ? 'sunday' : 'weekday_sat',
        nextOpenTime,
        isTodayOpenNext: isBeforeOpen,
        statusText: isOpen
          ? `Открыто сейчас · до ${closeHourLabel}`
          : isBeforeOpen
          ? `Откроется сегодня в ${nextOpenTime}`
          : `Откроется завтра в ${nextOpenTime}`,
        subText: isOpen
          ? 'Администратор на связи по телефону'
          : 'Администратор ответит в рабочее время'
      };
    }

    if (lang === 'en') {
      return {
        isOpen,
        currentDayType: isSunday ? 'sunday' : 'weekday_sat',
        nextOpenTime,
        isTodayOpenNext: isBeforeOpen,
        statusText: isOpen
          ? `Open now · until ${closeHourLabel}`
          : isBeforeOpen
          ? `Opens today at ${nextOpenTime}`
          : `Opens tomorrow at ${nextOpenTime}`,
        subText: isOpen
          ? 'Live administrator ready for your call'
          : 'Calls answered during salon hours'
      };
    }

    return {
      isOpen,
      currentDayType: isSunday ? 'sunday' : 'weekday_sat',
      nextOpenTime,
      isTodayOpenNext: isBeforeOpen,
      statusText: isOpen
        ? `Atvērts tagad · līdz ${closeHourLabel}`
        : isBeforeOpen
        ? `Atveras šodien plkst. ${nextOpenTime}`
        : `Atveras rīt plkst. ${nextOpenTime}`,
      subText: isOpen
        ? 'Administrators atbild uz zvaniem tūlīt'
        : 'Administrators atbild darba laikā'
    };
  } catch {
    return {
      isOpen: true,
      currentDayType: 'weekday_sat',
      nextOpenTime: '09:00',
      isTodayOpenNext: false,
      statusText: 'P.–S. 09:00–20:00 · Sv. 10:00–16:00',
      subText: '+371 27580047'
    };
  }
}

export function useRigaSalonStatus(lang: Language): RigaSalonStatus {
  const [status, setStatus] = useState<RigaSalonStatus>(() => computeRigaStatus(lang));

  useEffect(() => {
    setStatus(computeRigaStatus(lang));
    const interval = window.setInterval(() => {
      setStatus(computeRigaStatus(lang));
    }, 60_000);
    return () => window.clearInterval(interval);
  }, [lang]);

  return status;
}
