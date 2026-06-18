import React, { useState, useRef } from 'react';
import { Calendar, Trash2, Upload, Loader2, Pencil, X, Share2 } from 'lucide-react';
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

  // Edit mode — null means "add new", non-null means "editing this event"
  const [editingId, setEditingId] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const evtFileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setEvtTitleEN(''); setEvtTitleTE('');
    setEvtDate('2026-06-20'); setEvtTime('09:00 AM - 12:00 PM');
    setEvtDescEN(''); setEvtDescTE('');
    setEvtLocEN('Main Sanctum'); setEvtLocTE('దర్శన మండపం');
    setEvtImage(''); setEditingId(null);
  };

  const handleEditEvent = (evt: EventItem) => {
    setEditingId(evt.id);
    setEvtTitleEN(evt.titleEN);
    setEvtTitleTE(evt.titleTE);
    setEvtDate(evt.date);
    setEvtTime(evt.time);
    setEvtDescEN(evt.descriptionEN);
    setEvtDescTE(evt.descriptionTE);
    setEvtLocEN(evt.locationEN);
    setEvtLocTE(evt.locationTE);
    setEvtImage(evt.imageUrl || '');
    // Scroll the form into view
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleWhatsAppShare = (evt: EventItem) => {
    const title = language === 'EN' ? evt.titleEN : evt.titleTE;
    const desc  = language === 'EN' ? evt.descriptionEN : evt.descriptionTE;
    const loc   = language === 'EN' ? evt.locationEN : evt.locationTE;

    const msg = [
      `🙏 *శ్రీ ఉమా మహేశ్వర దేవస్థానం*`,
      ``,
      `📢 *${title}*`,
      `🗓 ${evt.date}  |  🕐 ${evt.time}`,
      `📍 ${loc}`,
      ``,
      desc,
      ``,
      language === 'EN'
        ? `All are welcome. Jai Shiva! 🕉️`
        : `అందరికీ ఆహ్వానం. జై శివ! 🕉️`,
    ].join('\n');

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const MAX_DIM = 1200;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) { height = Math.round((height * MAX_DIM) / width); width = MAX_DIM; }
          else { width = Math.round((width * MAX_DIM) / height); height = MAX_DIM; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setEvtImageUploading(false); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(async (blob) => {
          if (!blob) { setEvtImageUploading(false); return; }
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
            showToast(
              language === 'EN'
                ? 'Upload failed. Open browser console (F12) for the exact error.'
                : 'అప్‌లోడ్ విఫలమైంది. F12 కన్సోల్ తెరిచి చూడండి.',
              'error'
            );
          }
        }, 'image/jpeg', 0.8);
      };
      img.onerror = () => console.error('[Events] Image failed to decode');
    };
    reader.onerror = () => console.error('[Events] FileReader error');
    reader.readAsDataURL(file);
  };

  const handleEvtDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setEvtDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleEvtDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setEvtDragActive(false);
    if (e.dataTransfer.files?.[0]) compressAndUploadEventBanner(e.dataTransfer.files[0]);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitleEN || !evtTitleTE) {
      showToast(
        language === 'EN'
          ? 'Event title is required in both English and Telugu.'
          : 'ఇంగ్లీష్ మరియు తెలుగు రెండింటిలో శీర్షిక నమోదు చేయండి.',
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

    const eventData: EventItem = {
      id: editingId ?? `evt-${Date.now()}`,
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

    if (editingId) {
      // Update existing event in place
      onUpdateEvents(eventsList.map(ev => ev.id === editingId ? eventData : ev));
      addLog(`Updated event: "${evtTitleEN}"`, 'edit');
      showToast(
        language === 'EN'
          ? `"${evtTitleEN}" updated successfully!`
          : `"${evtTitleTE}" విజయవంతంగా నవీకరించబడింది!`,
        'success'
      );
    } else {
      // Add new event
      onUpdateEvents([eventData, ...eventsList]);
      addLog(`Posted new event: "${evtTitleEN}"`, 'edit');
      showToast(
        language === 'EN'
          ? `"${evtTitleEN}" published to Events section!`
          : `"${evtTitleTE}" సేవలు విభాగంలో ప్రచురించబడింది!`,
        'success'
      );
    }

    resetForm();
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (editingId === id) resetForm();
    if (confirm(`Remove event: "${title}"?`)) {
      onUpdateEvents(eventsList.filter(e => e.id !== id));
      addLog(`Removed event: "${title}"`, 'edit');
    }
  };

  const isEditing = editingId !== null;

  return (
    <div id="admin-events-section" className="space-y-6">

      {/* Add / Edit form */}
      <div ref={formRef} className="bg-white p-6 rounded-3xl border border-stone-200 text-left">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] flex items-center space-x-2">
            <Calendar size={18} />
            <span>{isEditing ? (language === 'EN' ? 'Edit Event' : 'సేవ సవరించండి') : t('addEvent')}</span>
          </h4>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center space-x-1 text-xs text-stone-500 hover:text-stone-800 border border-stone-200 rounded-lg px-2.5 py-1.5 transition cursor-pointer"
            >
              <X size={12} />
              <span>{language === 'EN' ? 'Cancel Edit' : 'రద్దు చేయి'}</span>
            </button>
          )}
        </div>

        {isEditing && (
          <div className="mb-4 text-[11px] bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-amber-800 font-medium">
            {language === 'EN'
              ? `Editing: "${evtTitleEN}" — make your changes and click Update Event.`
              : `సవరిస్తోంది: "${evtTitleTE}" — మార్పులు చేసి నవీకరించండి.`}
          </div>
        )}

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

          <div className="flex items-center justify-between pt-2 border-t border-stone-150">
            {/* WhatsApp share hint when editing */}
            <p className="text-[10px] text-stone-400 italic">
              {language === 'EN'
                ? 'Use the WhatsApp button on each event card to share with devotees.'
                : 'భక్తులకు పంచుకోవడానికి WhatsApp బటన్ వాడండి.'}
            </p>
            <button type="submit" disabled={evtImageUploading}
              className={`px-5 py-2.5 text-white rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isEditing ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#7A1E1E] hover:bg-[#5E1414]'}`}>
              {isEditing
                ? (language === 'EN' ? '✓ Update Event' : '✓ నవీకరించు')
                : `+ ${t('addEvent')}`}
            </button>
          </div>
        </form>
      </div>

      {/* Active events list */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 text-left">
        <h5 className="font-serif text-sm font-extrabold text-[#7A1E1E] uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">
          🛡️ {language === 'EN' ? 'Active Event Cards Manager' : 'ప్రస్తుత యాక్టివ్ సేవలు రికార్డు'}
        </h5>
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
          {eventsList.length === 0 && (
            <p className="text-xs text-stone-400 text-center py-4">
              {language === 'EN' ? 'No events yet. Add one above.' : 'ఏ సేవలు లేవు. పైన జోడించండి.'}
            </p>
          )}
          {eventsList.map(evt => (
            <div
              key={evt.id}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs transition ${editingId === evt.id ? 'bg-amber-50 border-amber-300' : 'bg-[#FCFBF7] border-stone-200'}`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                {evt.imageUrl && (
                  <img src={evt.imageUrl} alt={evt.titleEN}
                    className="w-12 h-9 object-cover rounded-lg border border-stone-200 shrink-0" referrerPolicy="no-referrer" />
                )}
                <div className="min-w-0">
                  <p className="font-bold text-stone-800 truncate">{language === 'EN' ? evt.titleEN : evt.titleTE}</p>
                  <p className="text-[10px] text-stone-500 font-mono mt-0.5">{evt.date} | {evt.time}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-1 shrink-0 ml-2">
                {/* WhatsApp share */}
                <button
                  type="button"
                  onClick={() => handleWhatsAppShare(evt)}
                  title={language === 'EN' ? 'Share on WhatsApp' : 'WhatsApp లో పంచుకోండి'}
                  className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition cursor-pointer"
                >
                  <Share2 size={12} />
                  <span className="text-[10px] font-bold hidden sm:inline">WA</span>
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleEditEvent(evt)}
                  title={language === 'EN' ? 'Edit event' : 'సేవ సవరించండి'}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${editingId === evt.id ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600'}`}
                >
                  <Pencil size={12} />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(evt.id, evt.titleEN)}
                  title={language === 'EN' ? 'Delete event' : 'తొలగించు'}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
