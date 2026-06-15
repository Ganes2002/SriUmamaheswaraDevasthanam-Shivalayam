import React, { useState, useRef } from 'react';
import { Calendar, Trash2, Upload, Loader2 } from 'lucide-react';
import { Language } from '../../translations';
import { EventItem } from '../../types';
import { addLog, uploadImageToStorage } from '../../db';
import { showToast } from '../Toast';

interface AdminEventsManagerProps {
  language: Language;
  eventsList: EventItem[];
  onUpdateEvents: (list: EventItem[]) => void;
  t: (key: string) => string;
}

const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1609137144814-7ebd5b40cfeb?auto=format&fit=crop&q=80&w=600';

export default function AdminEventsManager({
  language,
  eventsList,
  onUpdateEvents,
  t
}: AdminEventsManagerProps) {
  const [evtTitleEN, setEvtTitleEN] = useState('');
  const [evtTitleTE, setEvtTitleTE] = useState('');
  const [evtDate, setEvtDate] = useState('2026-06-20');
  const [evtTime, setEvtTime] = useState('09:00 AM - 12:00 PM');
  const [evtDescEN, setEvtDescEN] = useState('');
  const [evtDescTE, setEvtDescTE] = useState('');
  const [evtLocEN, setEvtLocEN] = useState('Main Sanctum');
  const [evtLocTE, setEvtLocTE] = useState('దర్శన మండపం');
  const [evtImage, setEvtImage] = useState('');
  const [evtImageUploading, setEvtImageUploading] = useState(false);
  const [evtDragActive, setEvtDragActive] = useState(false);

  const evtFileInputRef = useRef<HTMLInputElement>(null);

  const compressAndUploadEventBanner = (file: File) => {
    console.log(`[Events] File selected → name="${file.name}" size=${(file.size / 1024).toFixed(1)} KB type="${file.type}"`);
    if (file.size > 100 * 1024 * 1024) {
      showToast(
        language === 'EN' ? 'Image must be under 100 MB.' : 'చిత్రం 100 MB కంటే తక్కువగా ఉండాలి.',
        'warning'
      );
      return;
    }
    setEvtImageUploading(true);
    const totalStart = performance.now();
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log(`[Events] FileReader done → starting canvas decode`);
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        console.log(`[Events] Image decoded → original size ${img.width}×${img.height}`);
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const MAX_DIM = 1200;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) { height = Math.round((height * MAX_DIM) / width); width = MAX_DIM; }
          else { width = Math.round((width * MAX_DIM) / height); height = MAX_DIM; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setEvtImageUploading(false); return; }
        ctx.drawImage(img, 0, 0, width, height);
        console.log(`[Events] Canvas drawn → output size ${width}×${height}, calling toBlob(jpeg, 0.8)`);
        canvas.toBlob(async (blob) => {
          if (!blob) { console.error('[Events] toBlob returned null'); setEvtImageUploading(false); return; }
          console.log(`[Events] Blob ready → compressed size ${(blob.size / 1024).toFixed(1)} KB`);
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const url = await uploadImageToStorage(blob, 'events', `${Date.now()}-${safeName}`);
          setEvtImageUploading(false);
          if (url) {
            console.log(`[Events] ✓ Total time: ${(performance.now() - totalStart).toFixed(0)}ms`);
            setEvtImage(url);
            showToast(
              language === 'EN' ? 'Event banner uploaded!' : 'ఈవెంట్ బ్యానర్ అప్‌లోడ్ అయింది!',
              'success'
            );
          } else {
            console.error('[Events] ✗ uploadImageToStorage returned null — check Supabase Storage bucket setup');
            showToast(
              language === 'EN'
                ? 'Upload failed. Open browser console (F12) for the exact error.'
                : 'అప్‌లోడ్ విఫలమైంది. F12 కన్సోల్ తెరిచి చూడండి.',
              'error'
            );
          }
        }, 'image/jpeg', 0.8);
      };
      img.onerror = () => console.error('[Events] Image failed to decode — unsupported format?');
    };
    reader.onerror = () => console.error('[Events] FileReader error');
    reader.readAsDataURL(file);
  };

  const handleEvtDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEvtDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleEvtDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEvtDragActive(false);
    if (e.dataTransfer.files?.[0]) compressAndUploadEventBanner(e.dataTransfer.files[0]);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitleEN || !evtTitleTE) {
      showToast(
        language === 'EN'
          ? 'Event title is required in both English and Telugu before publishing.'
          : 'ప్రచురించే ముందు ఇంగ్లీష్ మరియు తెలుగు రెండింటిలో సేవ శీర్షిక నమోదు చేయండి.',
        'warning'
      );
      return;
    }
    if (evtImageUploading) {
      showToast(
        language === 'EN' ? 'Banner upload in progress — please wait.' : 'బ్యానర్ అప్‌లోడ్ పూర్తయ్యేంత వరకు వేచి ఉండండి.',
        'warning'
      );
      return;
    }

    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      titleEN: evtTitleEN,
      titleTE: evtTitleTE,
      date: evtDate,
      time: evtTime,
      descriptionEN: evtDescEN || 'Special divine ceremony.',
      descriptionTE: evtDescTE || 'ప్రత్యేక వైదిక వేడుక.',
      locationEN: evtLocEN,
      locationTE: evtLocTE,
      imageUrl: evtImage || DEFAULT_EVENT_IMAGE,
    };

    onUpdateEvents([newEvent, ...eventsList]);
    addLog(`Posted new custom event: "${evtTitleEN}"`, 'edit');

    setEvtTitleEN('');
    setEvtTitleTE('');
    setEvtDescEN('');
    setEvtDescTE('');
    setEvtImage('');
    showToast(
      language === 'EN'
        ? `"${evtTitleEN}" has been published to the Events section!`
        : `"${evtTitleTE}" సేవలు విభాగంలో విజయవంతంగా ప్రచురించబడింది!`,
      'success'
    );
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Remove event: "${title}"?`)) {
      onUpdateEvents(eventsList.filter(e => e.id !== id));
      addLog(`Removed event: "${title}"`, 'edit');
    }
  };

  return (
    <div id="admin-events-section" className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-stone-200 text-left">
        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-4 flex items-center space-x-2 border-b border-stone-100 pb-3">
          <Calendar size={18} />
          <span>{t('addEvent')}</span>
        </h4>
        <form onSubmit={handleEventSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <div>
              <label htmlFor="evtNameEN" className="block text-xs text-stone-600 font-bold mb-1">Event Title (English)</label>
              <input id="evtNameEN" type="text" placeholder="Ganesh Nimajjanam Fest"
                value={evtTitleEN} onChange={(e) => setEvtTitleEN(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]" required />
            </div>

            <div>
              <label htmlFor="evtNameTE" className="block text-xs text-stone-600 font-bold mb-1">సేవ శీర్షిక (తెలుగు)</label>
              <input id="evtNameTE" type="text" placeholder="వినాయక నిమజ్జన మహోత్సవం"
                value={evtTitleTE} onChange={(e) => setEvtTitleTE(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]" required />
            </div>

            <div>
              <label htmlFor="evtDay" className="block text-xs text-stone-600 font-bold mb-1">Scheduled Date</label>
              <input id="evtDay" type="date" value={evtDate} onChange={(e) => setEvtDate(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]" required />
            </div>

            <div>
              <label htmlFor="evtHour" className="block text-xs text-stone-600 font-bold mb-1">Time Block slot</label>
              <input id="evtHour" type="text" value={evtTime} onChange={(e) => setEvtTime(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]" required />
            </div>

            <div>
              <label htmlFor="evtVenEN" className="block text-xs text-stone-600 font-bold mb-1">Venue (English)</label>
              <input id="evtVenEN" type="text" value={evtLocEN} onChange={(e) => setEvtLocEN(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]" required />
            </div>

            <div>
              <label htmlFor="evtVenTE" className="block text-xs text-stone-600 font-bold mb-1">కళ్యాణ వేదిక (తెలుగు)</label>
              <input id="evtVenTE" type="text" value={evtLocTE} onChange={(e) => setEvtLocTE(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]" required />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="evtDescriptionEN" className="block text-xs text-stone-600 font-bold mb-1">Brief Description (English)</label>
              <textarea id="evtDescriptionEN" value={evtDescEN} onChange={(e) => setEvtDescEN(e.target.value)}
                className="w-full text-xs font-sans rounded-lg border border-stone-300 px-3 py-2 text-stone-855 h-16 bg-[#FCFBF7]" required />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="evtDescriptionTE" className="block text-xs text-stone-600 font-bold mb-1">సేవ పూర్తి వివరాలు (తెలుగు)</label>
              <textarea id="evtDescriptionTE" value={evtDescTE} onChange={(e) => setEvtDescTE(e.target.value)}
                className="w-full text-xs font-sans rounded-lg border border-stone-300 px-3 py-2 text-stone-855 h-16 bg-[#FCFBF7]" required />
            </div>

            {/* Event banner image upload */}
            <div className="col-span-1">
              <label className="block text-xs text-stone-600 font-bold mb-1">
                {language === 'EN' ? 'Event Banner Photo (Optional)' : 'ఈవెంట్ బ్యానర్ ఫోటో (ఐచ్ఛికం)'}
              </label>
              <div
                onDragEnter={handleEvtDrag} onDragOver={handleEvtDrag}
                onDragLeave={handleEvtDrag} onDrop={handleEvtDrop}
                onClick={() => !evtImageUploading && evtFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center transition flex flex-col items-center justify-center space-y-1 select-none min-h-[90px] ${evtImageUploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} ${evtDragActive ? 'border-amber-500 bg-amber-50/50' : 'border-stone-300 hover:border-amber-400 bg-[#FCFBF7]'}`}
              >
                <input ref={evtFileInputRef} type="file" accept="image/*" className="hidden"
                  disabled={evtImageUploading}
                  onChange={(e) => { if (e.target.files?.[0]) compressAndUploadEventBanner(e.target.files[0]); }} />
                {evtImageUploading ? (
                  <><Loader2 size={20} className="text-[#7A1E1E] animate-spin" />
                  <span className="text-xs text-[#7A1E1E] font-bold">{language === 'EN' ? 'Uploading...' : 'అప్‌లోడ్ అవుతోంది...'}</span></>
                ) : evtImage ? (
                  <><img src={evtImage} className="h-14 w-20 object-cover rounded-lg border border-amber-300" alt="Banner preview" />
                  <span className="text-[10px] text-emerald-600 font-bold">✓ {language === 'EN' ? 'Banner ready — click to replace' : 'బ్యానర్ సిద్ధంగా ఉంది'}</span></>
                ) : (
                  <><Upload size={18} className="text-[#7A1E1E] animate-bounce" />
                  <span className="text-xs font-bold text-[#7A1E1E]">{language === 'EN' ? 'Click or drop banner image' : 'బ్యానర్ ఫోటో అప్‌లోడ్ చేయండి'}</span>
                  <p className="text-[9px] text-stone-400">{language === 'EN' ? 'If skipped, a default temple image is used.' : 'అప్‌లోడ్ చేయకపోతే డిఫాల్ట్ చిత్రం వాడబడుతుంది.'}</p></>
                )}
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-2 border-t border-stone-150">
            <button type="submit" disabled={evtImageUploading}
              className="px-5 py-2.5 bg-[#7A1E1E] hover:bg-[#5E1414] text-white rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              + {t('addEvent')}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-stone-200 text-left">
        <h5 className="font-serif text-sm font-extrabold text-[#7A1E1E] uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">
          🛡️ {language === 'EN' ? 'Active Event Cards Manager' : 'ప్రస్తుత యాక్టివ్ సేవలు రికార్డు'}
        </h5>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {eventsList.map(evt => (
            <div key={evt.id} className="flex items-center justify-between p-3 bg-[#FCFBF7] rounded-xl border border-stone-200 text-xs">
              <div className="flex items-center space-x-3">
                {evt.imageUrl && (
                  <img src={evt.imageUrl} alt={evt.titleEN}
                    className="w-12 h-9 object-cover rounded-lg border border-stone-200 shrink-0" referrerPolicy="no-referrer" />
                )}
                <div>
                  <p className="font-bold text-stone-855">{language === 'EN' ? evt.titleEN : evt.titleTE}</p>
                  <p className="text-[10px] text-stone-500 font-mono italic mt-0.5">{evt.date} | {evt.time}</p>
                </div>
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
