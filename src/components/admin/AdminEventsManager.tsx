import React, { useState } from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import { Language } from '../../translations';
import { EventItem } from '../../types';
import { addLog } from '../../db';

interface AdminEventsManagerProps {
  language: Language;
  eventsList: EventItem[];
  onUpdateEvents: (list: EventItem[]) => void;
  t: (key: string) => string;
}

export default function AdminEventsManager({
  language,
  eventsList,
  onUpdateEvents,
  t
}: AdminEventsManagerProps) {
  // Add Event Form state
  const [evtTitleEN, setEvtTitleEN] = useState('');
  const [evtTitleTE, setEvtTitleTE] = useState('');
  const [evtDate, setEvtDate] = useState('2026-06-20');
  const [evtTime, setEvtTime] = useState('09:00 AM - 12:00 PM');
  const [evtDescEN, setEvtDescEN] = useState('');
  const [evtDescTE, setEvtDescTE] = useState('');
  const [evtLocEN, setEvtLocEN] = useState('Main Sanctum');
  const [evtLocTE, setEvtLocTE] = useState('దర్శన మండపం');
  const [evtImage, setEvtImage] = useState('');

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitleEN || !evtTitleTE) {
      alert("Please provide both English & Telugu Event titles.");
      return;
    }

    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      titleEN: evtTitleEN,
      titleTE: evtTitleTE,
      date: evtDate,
      time: evtTime,
      descriptionEN: evtDescEN || "Special divine ceremony.",
      descriptionTE: evtDescTE || "ప్రత్యేక వైదిక వేడుక.",
      locationEN: evtLocEN,
      locationTE: evtLocTE,
      imageUrl: evtImage || "https://images.unsplash.com/photo-1609137144814-7ebd5b40cfeb?auto=format&fit=crop&q=80&w=600"
    };

    const nextEvents = [newEvent, ...eventsList];
    onUpdateEvents(nextEvents);
    addLog(`Posted new custom event: "${evtTitleEN}"`, "edit");
    
    // Clear Event Form
    setEvtTitleEN('');
    setEvtTitleTE('');
    setEvtDescEN('');
    setEvtDescTE('');
    alert(language === 'EN' ? "New event posted successfully!" : "కొత్త సేవ సమాచారం ప్రచురించబడింది!");
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Remove event: "${title}"?`)) {
      const nextEvents = eventsList.filter(e => e.id !== id);
      onUpdateEvents(nextEvents);
      addLog(`Removed event: "${title}"`, "edit");
    }
  };

  return (
    <div id="admin-events-section" className="space-y-6">
      {/* Visual Add Form */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 text-left">
        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-4 flex items-center space-x-2 border-b border-stone-100 pb-3">
          <Calendar size={18} />
          <span>{t('addEvent')}</span>
        </h4>
        <form onSubmit={handleEventSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Title EN */}
            <div>
              <label htmlFor="evtNameEN" className="block text-xs text-stone-600 font-bold mb-1">Event Title (English)</label>
              <input
                id="evtNameEN"
                type="text"
                placeholder="Ganesh Nimajjanam Fest"
                value={evtTitleEN}
                onChange={(e) => setEvtTitleEN(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
                required
              />
            </div>

            {/* Title TE */}
            <div>
              <label htmlFor="evtNameTE" className="block text-xs text-stone-600 font-bold mb-1">సేవ శీర్షిక (తెలుగు)</label>
              <input
                id="evtNameTE"
                type="text"
                placeholder="వినాయక నిమజ్జన మహోత్సవం"
                value={evtTitleTE}
                onChange={(e) => setEvtTitleTE(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="evtDay" className="block text-xs text-stone-600 font-bold mb-1">Scheduled Date</label>
              <input
                id="evtDay"
                type="date"
                value={evtDate}
                onChange={(e) => setEvtDate(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label htmlFor="evtHour" className="block text-xs text-stone-600 font-bold mb-1">Time Block slot</label>
              <input
                id="evtHour"
                type="text"
                value={evtTime}
                onChange={(e) => setEvtTime(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
                required
              />
            </div>

            {/* Venue EN */}
            <div>
              <label htmlFor="evtVenEN" className="block text-xs text-stone-600 font-bold mb-1">Venue (English)</label>
              <input
                id="evtVenEN"
                type="text"
                value={evtLocEN}
                onChange={(e) => setEvtLocEN(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
                required
              />
            </div>

            {/* Venue TE */}
            <div>
              <label htmlFor="evtVenTE" className="block text-xs text-stone-600 font-bold mb-1">కళ్యాణ వేదిక (తెలుగు)</label>
              <input
                id="evtVenTE"
                type="text"
                value={evtLocTE}
                onChange={(e) => setEvtLocTE(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
                required
              />
            </div>

            {/* Description EN */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="evtDescriptionEN" className="block text-xs text-stone-600 font-bold mb-1">Brief Description (English)</label>
              <textarea
                id="evtDescriptionEN"
                value={evtDescEN}
                onChange={(e) => setEvtDescEN(e.target.value)}
                className="w-full text-xs font-sans rounded-lg border border-stone-300 px-3 py-2 text-stone-855 h-16 bg-[#FCFBF7]"
                required
              />
            </div>

            {/* Description TE */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="evtDescriptionTE" className="block text-xs text-stone-600 font-bold mb-1">సేవ పూర్తి వివరాలు (తెలుగు)</label>
              <textarea
                id="evtDescriptionTE"
                value={evtDescTE}
                onChange={(e) => setEvtDescTE(e.target.value)}
                className="w-full text-xs font-sans rounded-lg border border-stone-300 px-3 py-2 text-stone-855 h-16 bg-[#FCFBF7]"
                required
              />
            </div>

            {/* Event decoration image url */}
            <div className="col-span-1">
              <label htmlFor="evtBannerUrl" className="block text-xs text-stone-600 font-bold mb-1">Banner Image URL (Optional)</label>
              <input
                id="evtBannerUrl"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={evtImage}
                onChange={(e) => setEvtImage(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
              />
            </div>

          </div>

          <div className="flex justify-end pt-2 border-t border-stone-150">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#7A1E1E] hover:bg-[#5E1414] text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              + {t('addEvent')}
            </button>
          </div>
        </form>
      </div>

      {/* Visual Cleaners Listing Directory Panel */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 text-left">
        <h5 className="font-serif text-sm font-extrabold text-[#7A1E1E] uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">
          🛡️ {language === 'EN' ? "Active Event Cards Manager" : "ప్రస్తుత యాక్టివ్ సేవలు రికార్డు"}
        </h5>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {eventsList.map(evt => (
            <div key={evt.id} className="flex items-center justify-between p-3 bg-[#FCFBF7] rounded-xl border border-stone-200 text-xs">
              <div>
                <p className="font-bold text-stone-855">{language === 'EN' ? evt.titleEN : evt.titleTE}</p>
                <p className="text-[10px] text-stone-500 font-mono italic mt-0.5">{evt.date} | {evt.time}</p>
              </div>
              <button 
                onClick={() => handleDeleteEvent(evt.id, evt.titleEN)}
                className="text-red-650 hover:bg-red-50 p-2 rounded-full transition cursor-pointer"
                title="Delete event post"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
