import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Language } from '../../translations';
import { Announcement } from '../../types';

interface AdminAnnouncementFormProps {
  language: Language;
  announcement: Announcement;
  onUpdateAnnouncement: (ann: Announcement) => void;
  t: (key: string) => string;
}

export default function AdminAnnouncementForm({
  language,
  announcement,
  onUpdateAnnouncement,
  t
}: AdminAnnouncementFormProps) {
  const [annTextEN, setAnnTextEN] = useState(announcement.textEN);
  const [annTextTE, setAnnTextTE] = useState(announcement.textTE);

  const handleAnnUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAnn: Announcement = {
      ...announcement,
      textEN: annTextEN,
      textTE: annTextTE,
      updatedAt: new Date().toISOString()
    };
    onUpdateAnnouncement(updatedAnn);
    alert(language === 'EN' ? "Announcement ticker updated successfully!" : "తాజా స్క్రోలింగ్ నివేదిక మార్చబడింది!");
  };

  return (
    <div id="admin-announcement-section" className="bg-white p-6 rounded-3xl border border-stone-200">
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
            {language === 'EN' ? "Save Ticker Text" : "వార్తలు అప్‌డేట్ చేయి"}
          </button>
        </div>
      </form>
    </div>
  );
}
