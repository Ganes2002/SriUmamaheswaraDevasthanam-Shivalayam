import React, { useState } from 'react';
import { Bell, MessageCircle, Clock } from 'lucide-react';
import { Language } from '../../translations';
import { Announcement } from '../../types';
import { showToast } from '../Toast';

interface AdminAnnouncementFormProps {
  language: Language;
  announcement: Announcement;
  onUpdateAnnouncement: (ann: Announcement) => void;
  whatsappLink: string;
  onUpdateWhatsappLink: (link: string) => void;
  templeOpenTime: string;
  templeCloseTime: string;
  onUpdateTempleHours: (open: string, close: string) => void;
  t: (key: string) => string;
}

export default function AdminAnnouncementForm({
  language,
  announcement,
  onUpdateAnnouncement,
  whatsappLink,
  onUpdateWhatsappLink,
  templeOpenTime,
  templeCloseTime,
  onUpdateTempleHours,
  t
}: AdminAnnouncementFormProps) {
  const [annTextEN, setAnnTextEN] = useState(announcement.textEN);
  const [annTextTE, setAnnTextTE] = useState(announcement.textTE);
  const [waLink, setWaLink] = useState(whatsappLink);
  const [openTime, setOpenTime] = useState(templeOpenTime);
  const [closeTime, setCloseTime] = useState(templeCloseTime);

  const handleAnnUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAnn: Announcement = {
      ...announcement,
      textEN: annTextEN,
      textTE: annTextTE,
      updatedAt: new Date().toISOString()
    };
    onUpdateAnnouncement(updatedAnn);
    showToast(
      language === 'EN'
        ? 'Scrolling announcement updated — visitors will see the new text immediately!'
        : 'స్క్రోలింగ్ ప్రకటన నవీకరించబడింది — సందర్శకులకు వెంటనే కనిపిస్తుంది!',
      'success'
    );
  };

  const handleTempleHoursSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedOpen = openTime.trim();
    const trimmedClose = closeTime.trim();
    if (!trimmedOpen || !trimmedClose) {
      showToast(
        language === 'EN' ? 'Please enter both opening and closing times.' : 'దయచేసి తెరవడం మరియు మూయడం రెండు సమయాలు నమోదు చేయండి.',
        'warning'
      );
      return;
    }
    onUpdateTempleHours(trimmedOpen, trimmedClose);
    showToast(
      language === 'EN'
        ? `Temple timings updated: ${trimmedOpen} — ${trimmedClose}`
        : `ఆలయ వేళలు నవీకరించబడ్డాయి: ${trimmedOpen} — ${trimmedClose}`,
      'success'
    );
  };

  const handleWaLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = waLink.trim();
    if (trimmed && !trimmed.startsWith('https://')) {
      showToast(
        language === 'EN'
          ? 'Please enter a valid WhatsApp link starting with https://'
          : 'దయచేసి https:// తో మొదలయ్యే చెల్లుబాటు అయ్యే లింక్ నమోదు చేయండి.',
        'warning'
      );
      return;
    }
    onUpdateWhatsappLink(trimmed);
    showToast(
      language === 'EN'
        ? trimmed
          ? 'WhatsApp community link saved — the Join button is now live on the homepage!'
          : 'WhatsApp link removed — the Join button is now hidden from the homepage.'
        : trimmed
          ? 'WhatsApp లింక్ సేవ్ అయింది — హోమ్ పేజీలో Join బటన్ ప్రత్యక్షమైంది!'
          : 'WhatsApp లింక్ తొలగించబడింది — Join బటన్ దాచబడింది.',
      'success'
    );
  };

  return (
    <div id="admin-announcement-section" className="space-y-5">

      {/* Ticker Announcement */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200">
        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-4 flex items-center space-x-2 border-b border-stone-100 pb-3">
          <Bell size={18} />
          <span>{t('updateMarquee')}</span>
        </h4>
        <form onSubmit={handleAnnUpdateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="annEN" className="block text-xs text-stone-600 font-bold mb-1">
                Ticker Announcement text (English)
              </label>
              <textarea
                id="annEN"
                value={annTextEN}
                onChange={(e) => setAnnTextEN(e.target.value)}
                className="w-full text-xs font-sans rounded-lg border border-stone-300 px-3 py-2 text-stone-850 h-20 bg-[#FCFBF7]"
                required
              />
            </div>
            <div>
              <label htmlFor="annTE" className="block text-xs text-stone-600 font-bold mb-1">
                ఆలయ తాజా వార్తలు (తెలుగు)
              </label>
              <textarea
                id="annTE"
                value={annTextTE}
                onChange={(e) => setAnnTextTE(e.target.value)}
                className="w-full text-xs font-sans rounded-lg border border-stone-300 px-3 py-2 text-stone-850 h-20 bg-[#FCFBF7]"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#7A1E1E] hover:bg-[#5E1414] text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              {language === 'EN' ? 'Save Ticker Text' : 'వార్తలు అప్‌డేట్ చేయి'}
            </button>
          </div>
        </form>
      </div>

      {/* WhatsApp Community Link Manager */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200">
        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-1 flex items-center space-x-2 border-b border-stone-100 pb-3">
          <MessageCircle size={18} />
          <span>{language === 'EN' ? 'WhatsApp Community Link' : 'WhatsApp కమ్యూనిటీ లింక్'}</span>
        </h4>
        <p className="text-[11px] text-stone-500 mt-3 mb-4 leading-relaxed">
          {language === 'EN'
            ? 'Paste your WhatsApp group or channel invite link below. A green "Join our WhatsApp Community" button will appear on the homepage Hero section for all visitors. Leave blank to hide the button.'
            : 'మీ WhatsApp గ్రూప్ లేదా ఛానల్ లింక్ ఇక్కడ పేస్ట్ చేయండి. హోమ్ పేజీలో "మా WhatsApp గ్రూప్‌లో చేరండి" బటన్ కనిపిస్తుంది. తొలగించాలంటే ఖాళీగా సేవ్ చేయండి.'}
        </p>
        <form onSubmit={handleWaLinkSubmit} className="space-y-3">
          <div className="flex gap-3 items-center">
            {/* WhatsApp icon indicator */}
            <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#25D366' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <input
              id="waLink"
              type="url"
              value={waLink}
              onChange={(e) => setWaLink(e.target.value)}
              placeholder="https://chat.whatsapp.com/XXXX  or  https://whatsapp.com/channel/XXXX"
              className="flex-1 text-xs rounded-lg border border-stone-300 px-3 py-2.5 text-stone-800 bg-[#FCFBF7] font-mono placeholder:font-sans placeholder:text-stone-400"
            />
          </div>

          {/* Live preview of current saved link */}
          {whatsappLink && (
            <p className="text-[11px] text-emerald-700 font-medium pl-1">
              ✅ {language === 'EN' ? 'Currently live:' : 'ప్రస్తుత లింక్:'}{' '}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="underline font-mono break-all">
                {whatsappLink}
              </a>
            </p>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              style={{ background: '#128C7E' }}
            >
              {language === 'EN' ? '💬 Save WhatsApp Link' : '💬 WhatsApp లింక్ సేవ్ చేయి'}
            </button>
          </div>
        </form>
      </div>

      {/* Temple Darshan Hours Manager */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200">
        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-1 flex items-center space-x-2 border-b border-stone-100 pb-3">
          <Clock size={18} />
          <span>{language === 'EN' ? 'Daily Darshan Timings' : 'నిత్య దర్శన వేళలు'}</span>
        </h4>
        <p className="text-[11px] text-stone-500 mt-3 mb-4 leading-relaxed">
          {language === 'EN'
            ? 'Set the daily opening and closing times shown on the welcome banner. Displayed as "Open Time — Close Time" to all visitors.'
            : 'హోమ్ పేజీ బ్యానర్‌లో చూపే ఆలయ రోజువారీ తెరవడం మరియు మూయడం సమయాలు సెట్ చేయండి.'}
        </p>
        <form onSubmit={handleTempleHoursSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="templeOpenTime" className="block text-xs text-stone-600 font-bold mb-1">
                {language === 'EN' ? 'Opening Time' : 'తెరవడం సమయం'}
              </label>
              <input
                id="templeOpenTime"
                type="text"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                placeholder="e.g. 6:00 AM"
                className="w-full text-xs font-sans rounded-lg border border-stone-300 px-3 py-2.5 text-stone-800 bg-[#FCFBF7]"
                required
              />
            </div>
            <div>
              <label htmlFor="templeCloseTime" className="block text-xs text-stone-600 font-bold mb-1">
                {language === 'EN' ? 'Closing Time' : 'మూయడం సమయం'}
              </label>
              <input
                id="templeCloseTime"
                type="text"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                placeholder="e.g. 8:30 PM"
                className="w-full text-xs font-sans rounded-lg border border-stone-300 px-3 py-2.5 text-stone-800 bg-[#FCFBF7]"
                required
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-1">
            <p className="text-[11px] text-stone-400 font-sans">
              {language === 'EN' ? 'Preview:' : 'ప్రివ్యూ:'}{' '}
              <span className="font-bold text-stone-700">{openTime} — {closeTime}</span>
            </p>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#7A1E1E] hover:bg-[#5E1414] text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <Clock size={12} />
              <span>{language === 'EN' ? 'Save Timings' : 'వేళలు సేవ్ చేయి'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
