import { useEffect, useState } from 'react';
import { Language } from '../types';

export interface RigaSalonStatus {
  isOpen: boolean;
  statusText: string;
  subText: string;
  currentDayType: 'weekday_sat' | 'sunday';
}

function computeRigaStatus(lang: Language, now: Date = new Date()): RigaSalonStatus {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Riga',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(now);

    const weekday = parts.find(p => p.type === 'weekday')?.value || 'Mon';
    const hourRaw = Number(parts.find(p => p.type === 'hour')?.value ?? 12);
    const minuteRaw = Number(parts.find(p => p.type === 'minute')?.value ?? 0);
    const hour = hourRaw === 24 ? 0 : hourRaw;
    const totalMinutes = hour * 60 + minuteRaw;

    const isSunday = weekday === 'Sun';
    const openMin = isSunday ? 10 * 60 : 9 * 60;
    const closeMin = isSunday ? 16 * 60 : 20 * 60;
    const isOpen = totalMinutes >= openMin && totalMinutes < closeMin;
    const closeHourLabel = isSunday ? '16:00' : '20:00';

    // Determine next opening day/time if currently closed
    const isBeforeOpen = totalMinutes < openMin;
    const nextIsSunday =
      (weekday === 'Sat' && !isBeforeOpen) || (isSunday && isBeforeOpen);
    const nextOpenTime = nextIsSunday ? '10:00' : '09:00';

    if (lang === 'ru') {
      return {
        isOpen,
        currentDayType: isSunday ? 'sunday' : 'weekday_sat',
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
    // Safe timezone fallback
    return {
      isOpen: true,
      currentDayType: 'weekday_sat',
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
