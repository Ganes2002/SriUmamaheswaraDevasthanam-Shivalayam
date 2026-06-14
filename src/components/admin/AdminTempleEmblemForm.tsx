import React, { useState, useRef } from 'react';
import { Upload, Check, RotateCcw, Sparkles, Edit2, CheckSquare, Trash2, Plus, Image, Loader2 } from 'lucide-react';
import { Language } from '../../translations';
import { TempleEmblemSlot } from '../../types';
import { uploadImageToStorage } from '../../db';

interface AdminTempleEmblemFormProps {
  language: Language;
  templeEmblem: string;
  onUpdateTempleEmblem: (url: string) => void;
  templeEmblemLibrary: TempleEmblemSlot[];
  onUpdateTempleEmblemLibrary: (list: TempleEmblemSlot[]) => void;
}

const DEFAULT_PRESETS: TempleEmblemSlot[] = [
  { id: 1, nameEN: 'Majestic Gopuram Vimana', nameTE: 'దివ్య రాజగోపురం దర్బార్', url: 'https://images.unsplash.com/photo-1600100397759-db2427a810f6?auto=format&fit=crop&q=80&w=400' },
  { id: 2, nameEN: 'Adorned Holy Shiva Lingam', nameTE: 'దివ్య మంగళాకార లింగం', url: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=400' },
  { id: 3, nameEN: 'Lord Ganesha Vigneshwara', nameTE: 'శ్రీ విఘ్నేశ్వర ప్రసాదం', url: 'https://images.unsplash.com/photo-1609137144814-7ebd5b40cfeb?auto=format&fit=crop&q=80&w=400' },
  { id: 4, nameEN: 'Sacred Brass Aarti Bell', nameTE: 'గర్భాలయ ఘంటా రావము', url: 'https://images.unsplash.com/photo-1608976328267-e6730f70067a?auto=format&fit=crop&q=80&w=400' },
  { id: 5, nameEN: 'Vedic Fire Homa Kundam', nameTE: 'దేవస్థాన హోమ గుండము', url: 'https://images.unsplash.com/photo-1618090584126-129cd84357ae?auto=format&fit=crop&q=80&w=400' },
];

export default function AdminTempleEmblemForm({
  language,
  templeEmblem,
  onUpdateTempleEmblem,
  templeEmblemLibrary,
  onUpdateTempleEmblemLibrary,
}: AdminTempleEmblemFormProps) {
  const slots = templeEmblemLibrary && templeEmblemLibrary.length > 0 ? templeEmblemLibrary : DEFAULT_PRESETS;
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(slots[0]?.id || 1);
  const activeSlot = slots.find((s) => s.id === selectedSlotId) || slots[0] || null;

  const [editNameEN, setEditNameEN] = useState(activeSlot?.nameEN || '');
  const [editNameTE, setEditNameTE] = useState(activeSlot?.nameTE || '');
  const [editUrl, setEditUrl] = useState(activeSlot?.url || '');
  const [editUploading, setEditUploading] = useState(false);

  const [newNameEN, setNewNameEN] = useState('');
  const [newNameTE, setNewNameTE] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newUploading, setNewUploading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [dragActive, setDragActive] = useState(false);
  const [dragActiveNew, setDragActiveNew] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputNewRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (activeSlot) {
      setEditNameEN(activeSlot.nameEN);
      setEditNameTE(activeSlot.nameTE);
      setEditUrl(activeSlot.url);
    }
    setErrorText('');
    setSuccessText('');
  }, [selectedSlotId]);

  // Compress image via Canvas then upload blob to Supabase Storage
  const compressAndUpload = async (
    file: File,
    folder: 'carousel' | 'gallery',
    onResult: (url: string) => void,
    setUploading: (v: boolean) => void
  ): Promise<void> => {
    if (file.size > 100 * 1024 * 1024) {
      setErrorText(
        language === 'EN'
          ? 'Selected image is too large! Please select an image under 100 MB.'
          : 'చిత్రం పరిమాణం చాలా ఎక్కువగా ఉంది! దయచేసి 100 MB లోపు ఉన్న చిత్రాన్ని ఎంచుకోండి.'
      );
      return;
    }
    setUploading(true);
    setErrorText('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const MAX_DIM = 800;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) { height = Math.round((height * MAX_DIM) / width); width = MAX_DIM; }
          else { width = Math.round((width * MAX_DIM) / height); height = MAX_DIM; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setUploading(false); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(async (blob) => {
          if (!blob) { setUploading(false); return; }
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const url = await uploadImageToStorage(blob, folder, `${Date.now()}-${safeName}`);
          setUploading(false);
          if (url) {
            onResult(url);
          } else {
            setErrorText(
              language === 'EN'
                ? 'Upload failed. Check your internet and try again.'
                : 'అప్‌లోడ్ విఫలమైంది. మళ్ళీ ప్రయత్నించండి.'
            );
          }
        }, 'image/jpeg', 0.7);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleActivateSlot = (slot: TempleEmblemSlot) => {
    onUpdateTempleEmblem(slot.url);
    setErrorText('');
    setSuccessText(
      language === 'EN'
        ? `Successfully activated: "${slot.nameEN}"!`
        : `విజయవంతంగా ప్రైమరీ మార్చబడింది: "${slot.nameTE}"!`
    );
    setTimeout(() => setSuccessText(''), 3000);
  };

  const handleSaveSlotEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedSlotId || !activeSlot) return;
    if (!editUrl.trim()) {
      setErrorText(language === 'EN' ? 'Please input a valid image URL first.' : 'దయచేసి ఒక సరైన చిత్ర చిరునామాను నమోదు చేయండి.');
      return;
    }
    if (!editNameEN.trim() || !editNameTE.trim()) {
      setErrorText(language === 'EN' ? 'Please fill out both English and Telugu titles.' : 'దయచేసి ఆంగ్ల మరియు తెలుగు పేర్లను నమోదు చేయండి.');
      return;
    }
    const updatedSlots = slots.map((slot) =>
      slot.id === selectedSlotId ? { ...slot, nameEN: editNameEN.trim(), nameTE: editNameTE.trim(), url: editUrl.trim() } : slot
    );
    onUpdateTempleEmblemLibrary(updatedSlots);
    if (templeEmblem === activeSlot.url) onUpdateTempleEmblem(editUrl.trim());
    setErrorText('');
    setSuccessText(language === 'EN' ? 'Library slot modified & saved!' : 'సవరణలు విజయవంతంగా భద్రపరచబడ్డాయి!');
    setTimeout(() => setSuccessText(''), 3000);
  };

  const handleDeleteSlot = (idToDelete: number) => {
    if (slots.length <= 1) {
      setErrorText(language === 'EN' ? 'Cannot delete! At least 1 image is required.' : 'తొలగించడం వీలుకాదు! కనీసం 1 చిత్రం అవసరం.');
      return;
    }
    if (!confirm(language === 'EN' ? 'Delete this image from the carousel?' : 'ఈ చిత్రాన్ని కరౌసెల్ నుండి తొలగించాలా?')) return;

    const target = slots.find((s) => s.id === idToDelete);
    const updatedSlots = slots.filter((s) => s.id !== idToDelete);
    onUpdateTempleEmblemLibrary(updatedSlots);
    if (target && templeEmblem === target.url && updatedSlots.length > 0) onUpdateTempleEmblem(updatedSlots[0].url);
    if (selectedSlotId === idToDelete) setSelectedSlotId(updatedSlots[0]?.id || null);
    setErrorText('');
    setSuccessText(language === 'EN' ? 'Image removed from carousel!' : 'చిత్రం విజయవంతంగా తొలగించబడింది!');
    setTimeout(() => setSuccessText(''), 3000);
  };

  const handleAddNewEmblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (slots.length >= 5) {
      setErrorText(language === 'EN' ? 'Maximum 5 images reached! Delete one to add new.' : 'గరిష్ట 5 చిత్రాల పరిమితి చేరింది!');
      return;
    }
    if (!newUrl.trim()) {
      setErrorText(language === 'EN' ? 'Please upload an image or paste a URL.' : 'దయచేసి చిత్రం అప్‌లోడ్ చెయ్యండి లేదా వెబ్ లింక్ ఇవ్వండి.');
      return;
    }
    if (!newNameEN.trim() || !newNameTE.trim()) {
      setErrorText(language === 'EN' ? 'Please fill both English and Telugu titles.' : 'దయచేసి ఆంగ్ల మరియు తెలుగు పేర్లను రాయండి.');
      return;
    }
    const maxId = slots.reduce((max, s) => (s.id > max ? s.id : max), 0);
    const newSlotItem: TempleEmblemSlot = { id: maxId + 1, nameEN: newNameEN.trim(), nameTE: newNameTE.trim(), url: newUrl.trim() };
    onUpdateTempleEmblemLibrary([...slots, newSlotItem]);
    setNewNameEN(''); setNewNameTE(''); setNewUrl(''); setShowAddForm(false);
    setSelectedSlotId(newSlotItem.id);
    setErrorText('');
    setSuccessText(language === 'EN' ? 'New image added to carousel!' : 'కొత్త చిత్రం కరౌసెల్‌కు జోడించబడింది!');
    setTimeout(() => setSuccessText(''), 3000);
  };

  const handleResetToAllDefaults = () => {
    if (confirm(language === 'EN' ? 'Reset carousel to 5 sacred temple preset images?' : 'కరౌసెల్‌ను అసలు 5 పవిత్ర చిత్రాలకు మార్చాలా?')) {
      onUpdateTempleEmblemLibrary(DEFAULT_PRESETS);
      onUpdateTempleEmblem(DEFAULT_PRESETS[0].url);
      setSelectedSlotId(1);
      setErrorText('');
      setSuccessText(language === 'EN' ? 'Carousel reverted to original defaults!' : 'కరౌసెల్ విజయవంతంగా రీసెట్ చేయబడింది!');
      setTimeout(() => setSuccessText(''), 3000);
    }
  };

  // Drag handlers for edit slot
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) compressAndUpload(e.dataTransfer.files[0], 'carousel', setEditUrl, setEditUploading);
  };

  // Drag handlers for new slot
  const handleDragNew = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActiveNew(e.type === 'dragenter' || e.type === 'dragover');
  };
  const handleDropNew = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActiveNew(false);
    if (e.dataTransfer.files?.[0]) compressAndUpload(e.dataTransfer.files[0], 'carousel', setNewUrl, setNewUploading);
  };

  const isStorageOrHttpUrl = (url: string) => url.startsWith('https://');

  return (
    <div id="admin-temple-emblem-section" className="bg-white p-6 rounded-3xl border border-stone-200 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-3">
        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] flex items-center space-x-2">
          <Sparkles size={18} className="text-amber-500 animate-pulse" />
          <span>{language === 'EN' ? 'Home Slider Carousel Manager (Max 5 Images)' : 'హోమ్ స్లైడర్ కరౌసెల్ నిర్వాహకుడు (గరిష్టంగా 5 చిత్రాలు)'}</span>
        </h4>
        <button type="button" onClick={handleResetToAllDefaults} className="text-xs font-serif font-black underline text-[#7A1E1E] hover:text-amber-600 transition cursor-pointer flex items-center gap-1">
          <RotateCcw size={12} />
          {language === 'EN' ? 'Revert to Original Presets' : 'అసలు ఆలయ చిత్రాలకు మార్చు'}
        </button>
      </div>

      <p className="text-xs text-stone-500 leading-relaxed max-w-2xl">
        {language === 'EN'
          ? 'Upload up to five carousel images. Files are compressed and stored in Supabase Storage CDN — fast global delivery at zero extra cost.'
          : 'మీరు గరిష్టంగా ఐదు కరౌసెల్ చిత్రాలను ఉంచవచ్చు. ఫైల్స్ కుదించబడి Supabase Storage CDNలో భద్రపరచబడతాయి — వేగంగా ఉచితంగా లోడ్ అవుతాయి.'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left: Slots list */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="block text-xs font-bold text-stone-700">
              {language === 'EN' ? `Carousel Images (${slots.length} / 5):` : `ప్రస్తుత కరౌసెల్ చిత్రాలు (${slots.length} / 5):`}
            </span>
            {slots.length < 5 && !showAddForm && (
              <button type="button" onClick={() => { setShowAddForm(true); setErrorText(''); }}
                className="py-1 px-2.5 bg-amber-500 text-stone-950 hover:bg-[#7A1E1E] hover:text-white rounded-xl text-[10px] font-black tracking-wide flex items-center gap-1 transition-all cursor-pointer">
                <Plus size={12} strokeWidth={2.5} />
                <span>{language === 'EN' ? 'Add Image' : 'చిత్రాన్ని జోడించు'}</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {slots.map((slot, index) => {
              const isActiveEmblem = templeEmblem === slot.url;
              const isSelectedForEdit = selectedSlotId === slot.id && !showAddForm;
              return (
                <div key={slot.id} className={`p-3 rounded-2xl border transition flex items-center justify-between ${isSelectedForEdit ? 'border-[#7A1E1E] bg-[#FAF6F0] ring-1 ring-[#7A1E1E]' : 'border-stone-200 bg-white hover:bg-stone-50'}`}>
                  <button type="button" onClick={() => { setSelectedSlotId(slot.id); setShowAddForm(false); }} className="flex items-center space-x-3 text-left flex-1 cursor-pointer">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-300 relative bg-stone-900 shrink-0 shadow-sm">
                      <img src={slot.url} alt={slot.nameEN} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-0 left-0 bg-stone-900/90 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-br font-serif">{index + 1}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-stone-800 truncate">{language === 'EN' ? slot.nameEN : slot.nameTE}</h5>
                      <span className="text-[10px] text-stone-400 font-sans block mt-0.5">
                        {isActiveEmblem ? (language === 'EN' ? '● ACTIVE BANNER' : '● లైవ్ బేనర్') : (language === 'EN' ? 'Carousel Slide' : 'కరౌసెల్ స్లైడ్')}
                      </span>
                    </div>
                  </button>
                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    <button type="button" onClick={() => { setSelectedSlotId(slot.id); setShowAddForm(false); }} title="Edit slide"
                      className={`p-2 rounded-xl transition ${isSelectedForEdit ? 'bg-[#7A1E1E] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200 cursor-pointer'}`}>
                      <Edit2 size={13} />
                    </button>
                    <button type="button" onClick={() => handleDeleteSlot(slot.id)} title="Delete slide"
                      className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-155 hover:bg-red-600 hover:text-white transition cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {slots.length >= 5 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[10px] text-[#7A1E1E] font-medium leading-relaxed">
              ⚠️ {language === 'EN' ? 'Maximum 5 carousel images reached. Delete one to add a new image.' : 'గరిష్ట 5 చిత్రాల పరిమితి చేరింది. కొత్తది జోడించడానికి పాతది తొలగించండి.'}
            </div>
          )}
        </div>

        {/* Right: Add / Edit form */}
        <div className="lg:col-span-7">
          {showAddForm && slots.length < 5 ? (
            <form onSubmit={handleAddNewEmblem} className="bg-neutral-50 p-5 rounded-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <span className="text-xs font-bold text-[#7A1E1E] flex items-center space-x-1.5">
                  <Plus size={14} strokeWidth={2.5} />
                  <span>{language === 'EN' ? 'Add New Image to Carousel' : 'కరౌసెల్‌లోకి కొత్త చిత్రం జోడించండి'}</span>
                </span>
                <button type="button" onClick={() => setShowAddForm(false)} className="text-[10px] font-bold text-stone-400 hover:text-stone-700 cursor-pointer">
                  {language === 'EN' ? 'Cancel' : 'రద్దు చెయ్'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-600 uppercase">{language === 'EN' ? 'Image Title (English):' : 'చిత్రం పేరు (ఆంగ్లం):'}</label>
                  <input type="text" value={newNameEN} onChange={(e) => setNewNameEN(e.target.value)} placeholder="e.g. Swarna Ratham Darshanam"
                    className="w-full text-xs font-sans rounded-xl border border-stone-300 px-3 py-2 bg-white text-stone-800 focus:outline-none focus:border-amber-500" required />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-600 uppercase">{language === 'EN' ? 'Image Title (Telugu):' : 'చిత్రం పేరు (తెలుగు):'}</label>
                  <input type="text" value={newNameTE} onChange={(e) => setNewNameTE(e.target.value)} placeholder="ఉదా: శ్రీ స్వర్ణ రథోత్సవ దర్శనం"
                    className="w-full text-xs font-sans rounded-xl border border-stone-300 px-3 py-2 bg-white text-stone-800 focus:outline-none focus:border-amber-500" required />
                </div>
              </div>

              {/* Drop zone for new slot */}
              <div onDragEnter={handleDragNew} onDragOver={handleDragNew} onDragLeave={handleDragNew} onDrop={handleDropNew}
                onClick={() => !newUploading && fileInputNewRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center transition flex flex-col items-center justify-center space-y-1 select-none min-h-[90px] ${newUploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} ${dragActiveNew ? 'border-amber-500 bg-amber-50/50' : 'border-stone-300 hover:border-amber-400 bg-white'}`}>
                <input ref={fileInputNewRef} type="file" accept="image/*" className="hidden" disabled={newUploading}
                  onChange={(e) => { if (e.target.files?.[0]) compressAndUpload(e.target.files[0], 'carousel', setNewUrl, setNewUploading); }} />
                {newUploading ? (
                  <><Loader2 size={20} className="text-[#7A1E1E] animate-spin" /><span className="text-xs text-[#7A1E1E] font-bold">{language === 'EN' ? 'Uploading...' : 'అప్‌లోడ్ అవుతోంది...'}</span></>
                ) : isStorageOrHttpUrl(newUrl) ? (
                  <><img src={newUrl} className="h-16 w-24 object-cover rounded-lg border border-amber-300" alt="Preview" /><span className="text-[10px] text-emerald-600 font-bold">✓ {language === 'EN' ? 'Image ready' : 'చిత్రం సిద్ధంగా ఉంది'}</span></>
                ) : (
                  <><Upload size={18} className="text-[#7A1E1E] animate-bounce" /><span className="text-xs font-bold text-[#7A1E1E]">{language === 'EN' ? 'Upload/Drop image file' : 'చిత్రం ఫైల్ వేయండి / క్లిక్ చేయండి'}</span>
                  <p className="text-[9px] text-stone-400">{language === 'EN' ? 'Auto compressed & stored in CDN.' : 'ఆటో కంప్రెస్ చేసి CDNలో భద్రపరచబడుతుంది.'}</p></>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-600 uppercase">{language === 'EN' ? 'Or paste Direct Image URL:' : 'లేదా వెబ్ ఇమేజ్ అడ్రస్ లింక్ ఇవ్వండి:'}</label>
                <input type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.com/shiva.jpg"
                  className="w-full text-xs font-mono rounded-xl border border-stone-300 px-3 py-2 bg-white text-stone-800 focus:outline-none focus:border-amber-500" />
              </div>

              <button type="submit" disabled={newUploading}
                className="w-full py-2 px-4 bg-[#7A1E1E] hover:bg-[#5E1414] text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus size={14} strokeWidth={2.5} />
                <span>{language === 'EN' ? 'Create Custom Image Slide' : 'కొత్త ఇమేజ్ స్లైడ్‌ను సృష్టించండి'}</span>
              </button>
            </form>
          ) : activeSlot ? (
            <div className="bg-neutral-50/50 p-5 rounded-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <span className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
                  <Edit2 size={13} className="text-[#7A1E1E]" />
                  <span>{language === 'EN' ? 'Modify Carousel Slide Details' : 'స్లైడ్ వివరాల సవరణ'}</span>
                </span>
                <span className="text-[10px] bg-amber-100 text-[#7A1E1E] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {language === 'EN' ? 'Database Slide' : 'లైబ్రరీ స్లైడ్'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-600 uppercase">{language === 'EN' ? 'Slide Label (English):' : 'చిత్రం పేరు (ఆంగ్లం):'}</label>
                  <input type="text" value={editNameEN} onChange={(e) => setEditNameEN(e.target.value)} placeholder="e.g. Lord Shiva Alankaram"
                    className="w-full text-xs font-sans rounded-xl border border-stone-300 px-3 py-2 bg-white text-stone-800 focus:outline-none focus:border-amber-500" />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-600 uppercase">{language === 'EN' ? 'Slide Label (Telugu):' : 'చిత్రం పేరు (తెలుగు):'}</label>
                  <input type="text" value={editNameTE} onChange={(e) => setEditNameTE(e.target.value)} placeholder="ఉదా: శ్రీ ఉమామహేశ్వర స్వామి"
                    className="w-full text-xs font-sans rounded-xl border border-stone-300 px-3 py-2 bg-white text-stone-800 focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              {/* Drop zone for edit slot */}
              <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
                onClick={() => !editUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center transition flex flex-col items-center justify-center space-y-1 select-none min-h-[90px] ${editUploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} ${dragActive ? 'border-amber-500 bg-amber-50/50' : 'border-stone-300 hover:border-amber-400 bg-white'}`}>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" disabled={editUploading}
                  onChange={(e) => { if (e.target.files?.[0]) compressAndUpload(e.target.files[0], 'carousel', setEditUrl, setEditUploading); }} />
                {editUploading ? (
                  <><Loader2 size={20} className="text-[#7A1E1E] animate-spin" /><span className="text-xs text-[#7A1E1E] font-bold">{language === 'EN' ? 'Uploading...' : 'అప్‌లోడ్ అవుతోంది...'}</span></>
                ) : isStorageOrHttpUrl(editUrl) ? (
                  <><img src={editUrl} className="h-16 w-24 object-cover rounded-lg border border-amber-300" alt="Current" /><span className="text-[10px] text-stone-500">{language === 'EN' ? 'Click or drop to replace' : 'క్లిక్ చేసి మార్చండి'}</span></>
                ) : (
                  <><Upload size={18} className="text-[#7A1E1E] animate-bounce mb-0.5" /><span className="text-xs font-bold text-[#7A1E1E]">{language === 'EN' ? 'Replace image file' : 'ఈ చిత్రాన్ని మార్చండి'}</span>
                  <p className="text-[9px] text-stone-400">{language === 'EN' ? 'Auto compressed & stored in CDN.' : 'ఆటో కంప్రెస్ చేసి CDNలో భద్రపరచబడుతుంది.'}</p></>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-stone-600 uppercase">{language === 'EN' ? 'Or paste Direct Image URL:' : 'లేదా వెబ్ ఇమేజ్ అడ్రస్ లింక్:'}</label>
                <input type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://example.com/lord-shiva.jpg"
                  className="w-full text-xs font-mono rounded-xl border border-stone-300 px-3 py-2 bg-white text-stone-800 focus:outline-none focus:border-amber-500" />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => handleSaveSlotEdit()} disabled={editUploading}
                  className="flex-1 py-2 px-4 bg-[#7A1E1E] hover:bg-[#5E1414] text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  <CheckSquare size={13} />
                  <span>{language === 'EN' ? 'Apply & Save Changes' : 'మార్పులు సేవ చేయి'}</span>
                </button>
                <button type="button" onClick={() => handleActivateSlot(activeSlot)}
                  className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer">
                  <Image size={13} />
                  <span>{language === 'EN' ? 'Make Primary' : 'లైవ్ లోగో చేయి'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-50 p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-400">
              {language === 'EN' ? 'Add a slide or click edit icon to begin.' : 'సవరించడం ప్రారంభించడానికి ఒక స్లైడ్ పై నొక్కండి.'}
            </div>
          )}
        </div>
      </div>

      {successText && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 text-center animate-pulse">{successText}</div>
      )}
      {errorText && (
        <div className="p-3 bg-red-50 text-red-800 text-xs font-bold rounded-xl border border-red-200 text-center animate-pulse">{errorText}</div>
      )}
    </div>
  );
}
