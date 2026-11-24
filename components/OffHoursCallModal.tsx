import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import {
  buildGoogleCalendarUrl,
  computeRigaStatus,
  downloadCallReminderIcs
} from '../utils/salonHours';
import { CalendarPlus, Check, Clock, ExternalLink, Phone, X } from 'lucide-react';

interface OffHoursCallModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
}

const MODAL_UI: Record<
  Language,
  {
    eyebrow: string;
    title: string;
    notice: string;
    hoursMonSat: string;
    hoursSun: string;
    remindBtnPrefix: string;
    remindSaved: string;
    googleCalLink: string;
    callAnywayBtn: string;
    cancelBtn: string;
  }
> = {
  lv: {
    eyebrow: 'Rīgas darba laiks · Salons Aneri',
    title: 'Salons šobrīd ir slēgts',
    notice:
      'Mūsu administrators atbild uz zvaniem tikai darba laikā. Varat saglabāt atgādinājumu tālruņa kalendārā ar mūsu numuru vai piezvanīt tūlīt.',
    hoursMonSat: 'P.–S.',
    hoursSun: 'Sv.',
    remindBtnPrefix: 'Atgādināt kalendārā plkst.',
    remindSaved: 'Atgādinājums (.ics) sagatavots!',
    googleCalLink: 'Pievienot Google Kalendāram',
    callAnywayBtn: 'Zvanīt tik un tā',
    cancelBtn: 'Atcelt'
  },
  ru: {
    eyebrow: 'Время работы в Риге · Salons Aneri',
    title: 'Сейчас салон закрыт',
    notice:
      'Живой администратор отвечает на звонки в рабочие часы салона. Можно в 1 клик сохранить напоминание в календарь с готовым номером или позвонить сейчас.',
    hoursMonSat: 'Пн–Сб',
    hoursSun: 'Вс',
    remindBtnPrefix: 'Напомнить в календаре в',
    remindSaved: 'Напоминание (.ics) готово для календаря!',
    googleCalLink: 'Открыть в Google Календаре',
    callAnywayBtn: 'Всё равно позвонить',
    cancelBtn: 'Отмена'
  },
  en: {
    eyebrow: 'Riga Salon Hours · Salons Aneri',
    title: 'Salon is currently closed',
    notice:
      'Our live administrator answers calls during opening hours. Save a one-tap calendar reminder with our phone number or place the call anyway.',
    hoursMonSat: 'Mon–Sat',
    hoursSun: 'Sun',
    remindBtnPrefix: 'Remind in calendar at',
    remindSaved: 'Calendar reminder (.ics) saved!',
    googleCalLink: 'Add to Google Calendar',
    callAnywayBtn: 'Call anyway',
    cancelBtn: 'Cancel'
  }
};

const OffHoursCallModal: React.FC<OffHoursCallModalProps> = ({ isOpen, lang, onClose }) => {
  const [calendarSaved, setCalendarSaved] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCalendarSaved(false);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ui = MODAL_UI[lang] || MODAL_UI.lv;
  const status = computeRigaStatus(lang);
  const googleCalUrl = buildGoogleCalendarUrl(lang);

  const handleAddCalendar = () => {
    downloadCallReminderIcs(lang);
    setCalendarSaved(true);
  };

  return (
    <div
      className="fixed inset-0 z-[130] bg-[#1F2227]/80 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offhours-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden bg-white border border-slate-300 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Metallic Signboard Modal Header */}
        <div className="bg-signboard-metal px-6 py-6 text-white relative border-b border-slate-500/40">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8E1B32] via-[#E33955] to-[#8E1B32]"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={ui.cancelBtn}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#E3E7ED] hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>

          <p className="text-[10px] uppercase tracking-[0.24em] text-[#C7CDD6] font-semibold mb-2">
            {ui.eyebrow}
          </p>
          <div className="flex items-center gap-3">
            <Clock size={22} className="text-[#E33955] shrink-0" />
            <h2
              id="offhours-modal-title"
              className="text-2xl sm:text-3xl font-serif font-semibold text-white leading-tight pr-6"
            >
              {ui.title}
            </h2>
          </div>
          <p className="mt-2 text-sm text-[#E3E7ED] font-medium">
            {status.statusText}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            {ui.notice}
          </p>

          {/* Concise Salon Hours Summary */}
          <div className="rounded-xl bg-[#F5F6F8] border border-slate-200/90 px-4 py-3 text-xs sm:text-sm space-y-1.5">
            <div className="flex items-center justify-between text-slate-700">
              <span>{ui.hoursMonSat}</span>
              <span className="font-semibold text-[#25282E] tabular-nums">09:00 – 20:00</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 border-t border-slate-200/80 pt-1.5">
              <span>{ui.hoursSun}</span>
              <span className="font-semibold text-[#25282E] tabular-nums">10:00 – 16:00</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleAddCalendar}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#8E1B32] hover:bg-[#25282E] text-white px-5 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] transition-colors shadow-md"
            >
              {calendarSaved ? <Check size={16} /> : <CalendarPlus size={16} />}
              <span>
                {calendarSaved
                  ? ui.remindSaved
                  : `${ui.remindBtnPrefix} ${status.nextOpenTime}`}
              </span>
            </button>

            {calendarSaved && (
              <div className="text-center pt-0.5">
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8E1B32] hover:text-[#25282E] underline decoration-[#8E1B32]/40 transition-colors"
                >
                  <span>{ui.googleCalLink}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            {/* Native tel: anchor ensures direct dialer launch on iOS & Android */}
            <a
              href="tel:+37127580047"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#ECEFF3] hover:bg-[#E3E7ED] text-[#25282E] border border-slate-300/80 px-5 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
            >
              <Phone size={15} className="text-[#8E1B32]" />
              <span>{ui.callAnywayBtn}</span>
              <span className="tabular-nums font-bold">· +371 27580047</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 hover:text-[#25282E] transition-colors"
            >
              {ui.cancelBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffHoursCallModal;
