import React, { useState, useRef } from 'react';
import { Image as ImageIcon, User, Loader2, Camera } from 'lucide-react';
import { Language } from '../../translations';
import { uploadImageToStorage } from '../../db';
import { showToast } from '../Toast';

interface AdminDefaultAssetsFormProps {
  language: Language;
  defaultEventImage: string;
  onUpdateDefaultEventImage: (url: string) => void;
  defaultProfileMale: string;
  defaultProfileFemale: string;
  onUpdateDefaultProfileIcons: (maleUrl: string, femaleUrl: string) => void;
}

export default function AdminDefaultAssetsForm({
  language,
  defaultEventImage,
  onUpdateDefaultEventImage,
  defaultProfileMale,
  defaultProfileFemale,
  onUpdateDefaultProfileIcons,
}: AdminDefaultAssetsFormProps) {
  const [eventImgUrl, setEventImgUrl] = useState(defaultEventImage);
  const [maleUrl, setMaleUrl] = useState(defaultProfileMale);
  const [femaleUrl, setFemaleUrl] = useState(defaultProfileFemale);

  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [uploadingMale, setUploadingMale] = useState(false);
  const [uploadingFemale, setUploadingFemale] = useState(false);

  const eventFileRef = useRef<HTMLInputElement>(null);
  const maleFileRef = useRef<HTMLInputElement>(null);
  const femaleFileRef = useRef<HTMLInputElement>(null);

  const compressAndUpload = (
    file: File,
    folder: 'events' | 'profile',
    maxDim: number,
    quality: number,
    setUploading: (v: boolean) => void,
    onDone: (url: string) => void
  ) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast(language === 'EN' ? 'File too large — max 5 MB.' : 'ఫైల్ చాలా పెద్దది — గరిష్టం 5 MB.', 'warning');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      if (!src) { setUploading(false); return; }
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        // Defer heavy canvas work to avoid blocking the main thread (INP)
        requestAnimationFrame(() => {
          setTimeout(() => {
            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
            if (w > maxDim || h > maxDim) {
              if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
              else { w = Math.round(w * maxDim / h); h = maxDim; }
            }
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
            canvas.toBlob(async (blob) => {
              if (!blob) { setUploading(false); return; }
              const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
              const url = await uploadImageToStorage(blob, folder, `${Date.now()}-${safeName}`);
              setUploading(false);
              if (url) {
                onDone(url);
                showToast(language === 'EN' ? 'Image uploaded!' : 'చిత్రం అప్‌లోడ్ అయింది!', 'success');
              } else {
                showToast(language === 'EN' ? 'Upload failed — check F12 console.' : 'అప్‌లోడ్ విఫలమైంది.', 'error');
              }
            }, 'image/jpeg', quality);
          }, 0);
        });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEventImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventImgUrl.trim()) return;
    onUpdateDefaultEventImage(eventImgUrl.trim());
    showToast(language === 'EN' ? 'Default event image saved!' : 'డిఫాల్ట్ ఈవెంట్ చిత్రం సేవ్ అయింది!', 'success');
  };

  const handleSaveProfileIcons = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maleUrl.trim() || !femaleUrl.trim()) return;
    onUpdateDefaultProfileIcons(maleUrl.trim(), femaleUrl.trim());
    showToast(language === 'EN' ? 'Default profile icons saved!' : 'డిఫాల్ట్ ప్రొఫైల్ చిత్రాలు సేవ్ అయ్యాయి!', 'success');
  };

  const UploadArea = ({
    isUploading,
    fileRef,
    onFile,
    accept = 'image/*',
  }: {
    isUploading: boolean;
    fileRef: React.RefObject<HTMLInputElement | null>;
    onFile: (f: File) => void;
    accept?: string;
  }) => (
    <div
      onClick={() => !isUploading && fileRef.current?.click()}
      className={`border border-dashed rounded-xl p-3 text-center bg-white flex flex-col items-center justify-center h-14 select-none max-w-[180px] transition ${isUploading ? 'cursor-not-allowed opacity-60 border-stone-200' : 'cursor-pointer hover:border-[#7A1E1E] hover:bg-stone-50 border-stone-300'}`}
    >
      <input ref={fileRef} type="file" accept={accept} className="hidden" disabled={isUploading}
        onChange={(e) => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} />
      {isUploading
        ? <Loader2 size={14} className="text-[#7A1E1E] animate-spin" />
        : <div className="flex items-center gap-1 text-[11px] font-bold text-[#7A1E1E]">
            <Camera size={12} /> <span>{language === 'EN' ? 'Upload Image' : 'చిత్రం అప్‌లోడ్'}</span>
          </div>}
    </div>
  );

  return (
    <div id="admin-default-assets-section" className="space-y-5">

      {/* Default Event Image */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200">
        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-1 flex items-center space-x-2 border-b border-stone-100 pb-3">
          <ImageIcon size={18} />
          <span>{language === 'EN' ? 'Default Temple Event Image' : 'డిఫాల్ట్ ఆలయ ఈవెంట్ చిత్రం'}</span>
        </h4>
        <p className="text-[11px] text-stone-500 mt-3 mb-4 leading-relaxed">
          {language === 'EN'
            ? 'This image is shown on event cards when the admin does not upload a specific event photo. Upload a new image or paste a URL.'
            : 'అడ్మిన్ నిర్దిష్ట ఈవెంట్ ఫోటో అప్‌లోడ్ చేయనప్పుడు ఇవెంట్ కార్డులపై ఈ చిత్రం చూపబడుతుంది.'}
        </p>
        <form onSubmit={handleSaveEventImage} className="space-y-4">
          <div className="flex gap-4 items-start flex-wrap">
            {/* Current preview */}
            <img
              src={eventImgUrl || defaultEventImage}
              alt="Default event"
              className="h-24 w-36 object-cover rounded-xl border border-stone-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-[200px] space-y-2">
              <UploadArea
                isUploading={uploadingEvent}
                fileRef={eventFileRef}
                onFile={(f) => compressAndUpload(f, 'events', 1200, 0.80, setUploadingEvent, setEventImgUrl)}
              />
              <input
                type="url"
                value={eventImgUrl}
                onChange={(e) => setEventImgUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-800 bg-[#FCFBF7] font-mono placeholder:font-sans placeholder:text-stone-400"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={uploadingEvent}
              className="px-5 py-2.5 bg-[#7A1E1E] hover:bg-[#5E1414] text-white rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-50">
              {language === 'EN' ? 'Save Default Event Image' : 'డిఫాల్ట్ ఈవెంట్ చిత్రం సేవ్ చేయి'}
            </button>
          </div>
        </form>
      </div>

      {/* Default Profile Icons */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200">
        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-1 flex items-center space-x-2 border-b border-stone-100 pb-3">
          <User size={18} />
          <span>{language === 'EN' ? 'Default Profile Icons (Male & Female)' : 'డిఫాల్ట్ ప్రొఫైల్ చిత్రాలు (పురుష & స్త్రీ)'}</span>
        </h4>
        <p className="text-[11px] text-stone-500 mt-3 mb-4 leading-relaxed">
          {language === 'EN'
            ? 'Committee members who do not upload a photo can choose the Male or Female icon. Upload or paste a URL to update each icon.'
            : 'ఫోటో అప్‌లోడ్ చేయని కమిటీ సభ్యులు పురుష లేదా స్త్రీ చిహ్నాన్ని ఎంచుకోవచ్చు.'}
        </p>
        <form onSubmit={handleSaveProfileIcons} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Male icon */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                  {language === 'EN' ? 'MALE' : 'పురుష'}
                </span>
              </p>
              <div className="flex items-center gap-3">
                <img src={maleUrl || defaultProfileMale} alt="Male default"
                  className="h-14 w-14 rounded-full object-cover border-2 border-blue-200 shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1 space-y-1.5">
                  <UploadArea
                    isUploading={uploadingMale}
                    fileRef={maleFileRef}
                    onFile={(f) => compressAndUpload(f, 'profile', 200, 0.85, setUploadingMale, setMaleUrl)}
                  />
                  <input type="url" value={maleUrl} onChange={(e) => setMaleUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-800 bg-[#FCFBF7] font-mono placeholder:font-sans placeholder:text-stone-400" />
                </div>
              </div>
            </div>

            {/* Female icon */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                  {language === 'EN' ? 'FEMALE' : 'స్త్రీ'}
                </span>
              </p>
              <div className="flex items-center gap-3">
                <img src={femaleUrl || defaultProfileFemale} alt="Female default"
                  className="h-14 w-14 rounded-full object-cover border-2 border-pink-200 shrink-0" referrerPolicy="no-referrer" />
                <div className="flex-1 space-y-1.5">
                  <UploadArea
                    isUploading={uploadingFemale}
                    fileRef={femaleFileRef}
                    onFile={(f) => compressAndUpload(f, 'profile', 200, 0.85, setUploadingFemale, setFemaleUrl)}
                  />
                  <input type="url" value={femaleUrl} onChange={(e) => setFemaleUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-800 bg-[#FCFBF7] font-mono placeholder:font-sans placeholder:text-stone-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={uploadingMale || uploadingFemale}
              className="px-5 py-2.5 bg-[#7A1E1E] hover:bg-[#5E1414] text-white rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-50">
              {language === 'EN' ? 'Save Profile Icons' : 'ప్రొఫైల్ చిత్రాలు సేవ్ చేయి'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
