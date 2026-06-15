import React, { useState } from 'react';
import { Image as ImageIcon, ImageUp, Trash2, Loader2 } from 'lucide-react';
import { Language } from '../../translations';
import { GalleryItem } from '../../types';
import { addLog, uploadImageToStorage } from '../../db';
import { showToast } from '../Toast';

interface AdminGalleryManagerProps {
  language: Language;
  galleryList: GalleryItem[];
  onUpdateGallery: (list: GalleryItem[]) => Promise<boolean>;
  t: (key: string) => string;
}

export default function AdminGalleryManager({
  language,
  galleryList,
  onUpdateGallery,
  t
}: AdminGalleryManagerProps) {
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaTitleEN, setMediaTitleEN] = useState('');
  const [mediaTitleTE, setMediaTitleTE] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaUploadStatus, setMediaUploadStatus] = useState('');
  const [mediaUploadError, setMediaUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [galleryDeletionConfirm, setGalleryDeletionConfirm] = useState<GalleryItem | null>(null);

  // Compress → upload to Supabase Storage → store CDN URL (never stores base64 in DB)
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaUploadError('');
    setMediaUploadStatus('');

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setMediaUploadError(language === 'EN' ? 'Image must be under 100 MB.' : 'చిత్రం 100 MB కంటే తక్కువగా ఉండాలి.');
      addLog(`Blocked upload of ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB exceeds 100 MB limit)`, 'security');
      return;
    }

    setIsUploading(true);
    setMediaUploadStatus(language === 'EN' ? 'Compressing & uploading to temple storage...' : 'చిత్రం కుదించి అప్‌లోడ్ అవుతోంది...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1200;
        if (width > height) {
          if (width > maxDim) { height = Math.round((height * maxDim) / width); width = maxDim; }
        } else {
          if (height > maxDim) { width = Math.round((width * maxDim) / height); height = maxDim; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setIsUploading(false); return; }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(async (blob) => {
          if (!blob) {
            setIsUploading(false);
            setMediaUploadError(language === 'EN' ? 'Image processing failed.' : 'చిత్రం ప్రక్రియ విఫలమైంది.');
            return;
          }
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const url = await uploadImageToStorage(blob, 'gallery', `${Date.now()}-${safeName}`);
          setIsUploading(false);
          if (url) {
            setMediaUrl(url);
            setMediaUploadStatus(t('imageUploadedSuccess'));
            addLog(`Uploaded photo "${file.name}" to temple media storage.`, 'gallery');
          } else {
            setMediaUploadError(language === 'EN' ? 'Upload failed. Check your internet and try again.' : 'అప్‌లోడ్ విఫలమైంది. మళ్ళీ ప్రయత్నించండి.');
          }
        }, 'image/jpeg', 0.75);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitleEN || !mediaTitleTE) {
      showToast(
        language === 'EN'
          ? 'Please enter the title in both English and Telugu before saving.'
          : 'తెలుగు మరియు ఇంగ్లీష్ రెండింటిలో శీర్షికలు నమోదు చేయండి.',
        'warning'
      );
      return;
    }
    if (!mediaUrl) {
      showToast(
        language === 'EN'
          ? 'Please upload a photo or paste a valid YouTube video URL first.'
          : 'మొదట ఒక ఫోటో అప్‌లోడ్ చేయండి లేదా YouTube లింక్ ఇవ్వండి.',
        'warning'
      );
      return;
    }
    if (isUploading) {
      showToast(
        language === 'EN'
          ? 'Upload in progress — please wait until it finishes before saving.'
          : 'అప్‌లోడ్ పూర్తయ్యేంత వరకు వేచి ఉండండి.',
        'warning'
      );
      return;
    }

    const imagesCount = galleryList.filter((item) => item.type === 'image').length;
    if (mediaType === 'image' && imagesCount >= 20) {
      showToast(t('imageLimitAlert'), 'warning');
      addLog('Attempted image upload blocked due to 20-image cap exhaustion.', 'gallery');
      return;
    }

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      type: mediaType,
      titleEN: mediaTitleEN,
      titleTE: mediaTitleTE,
      url: mediaUrl,
      addedAt: new Date().toISOString(),
    };

    setIsUploading(true);
    setMediaUploadStatus(language === 'EN' ? 'Saving to database...' : 'డేటాబేస్‌లో సేవ్ అవుతోంది...');

    const success = await onUpdateGallery([newItem, ...galleryList]);

    setIsUploading(false);
    setMediaUploadStatus('');

    if (!success) {
      setMediaUploadError(
        language === 'EN'
          ? 'Failed to save to database. Check browser console (F12) for the exact Supabase error — it is usually an RLS policy missing on gallery_assets table.'
          : 'డేటాబేస్‌లో సేవ్ విఫలమైంది. బ్రౌజర్ కన్సోల్ (F12) తెరిచి చూడండి.'
      );
      return;
    }

    addLog(`Appended new ${mediaType} to media stream: "${mediaTitleEN}"`, 'gallery');
    setMediaTitleEN('');
    setMediaTitleTE('');
    setMediaUrl('');
    setMediaUploadStatus('');
    setMediaUploadError('');
    showToast(
      language === 'EN'
        ? `${mediaType === 'image' ? 'Photo' : 'Video'} added to the gallery — it is now live on the site!`
        : `${mediaType === 'image' ? 'చిత్రం' : 'వీడియో'} చిత్రమాలికలో విజయవంతంగా ప్రచురించబడింది!`,
      'success'
    );
  };

  const executeGalleryDeletion = () => {
    if (galleryDeletionConfirm) {
      const nextList = galleryList.filter((g) => g.id !== galleryDeletionConfirm.id);
      onUpdateGallery(nextList);
      addLog(`Deleted gallery item: "${galleryDeletionConfirm.titleEN}"`, 'gallery');
      setGalleryDeletionConfirm(null);
    }
  };

  const getYoutubeThumbnail = (url: string) => {
    try {
      const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
      if (match && match[2].length === 11) {
        return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
      }
    } catch {}
    return 'https://images.unsplash.com/photo-1608976328267-e6730f70067a?auto=format&fit=crop&q=80&w=200';
  };

  return (
    <div id="admin-gallery-section" className="space-y-6">
      {/* Add Media Form */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 text-left">
        <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-4 flex items-center space-x-2 border-b border-stone-100 pb-3">
          <ImageIcon size={18} />
          <span>{t('addGallery')}</span>
        </h4>
        <form onSubmit={handleGallerySubmit} className="space-y-4">

          {/* Media type toggle */}
          <div className="flex items-center space-x-4">
            <span className="text-xs text-stone-600 font-bold">Media Type:</span>
            <label className="inline-flex items-center space-x-1.5 text-xs text-stone-800 font-semibold cursor-pointer">
              <input
                type="radio"
                name="mediaType"
                checked={mediaType === 'image'}
                onChange={() => { setMediaType('image'); setMediaUrl(''); setMediaUploadStatus(''); setMediaUploadError(''); }}
                className="text-[#7A1E1E] focus:ring-[#7A1E1E]"
              />
              <span>{t('photoTab')}</span>
            </label>
            <label className="inline-flex items-center space-x-1.5 text-xs text-stone-800 font-semibold cursor-pointer">
              <input
                type="radio"
                name="mediaType"
                checked={mediaType === 'video'}
                onChange={() => { setMediaType('video'); setMediaUrl(''); setMediaUploadStatus(''); setMediaUploadError(''); }}
                className="text-[#7A1E1E] focus:ring-[#7A1E1E]"
              />
              <span>{t('videoTab')} (YouTube link ONLY)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaType === 'image' ? (
              <div className="col-span-1">
                <label htmlFor="galFile" className="block text-xs text-stone-600 font-bold mb-1">
                  Select Local Temple Photo (&lt; 100 MB)
                </label>
                <div className="relative border border-dashed border-stone-350 p-4 bg-[#FCFBF7] rounded-lg text-center flex flex-col items-center justify-center transition hover:bg-amber-50/10 min-h-[100px]">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={24} className="text-[#7A1E1E] animate-spin" />
                      <span className="text-xs text-[#7A1E1E] font-bold">{mediaUploadStatus}</span>
                    </div>
                  ) : mediaUrl && mediaUrl.startsWith('https://') ? (
                    <div className="flex flex-col items-center gap-2">
                      <img src={mediaUrl} alt="Preview" className="h-16 w-24 object-cover rounded-lg border border-amber-300" />
                      <span className="text-xs text-emerald-700 font-bold">✓ {mediaUploadStatus || 'Uploaded'}</span>
                    </div>
                  ) : (
                    <>
                      <ImageUp className="text-[#E29524] h-8 w-8 mb-2" />
                      <span className="text-[11px] text-stone-500 font-semibold block mb-1">Drag file or click here</span>
                      {mediaUploadStatus && <span className="text-xs text-[#7A1E1E] font-bold block mt-1">{mediaUploadStatus}</span>}
                      {mediaUploadError && <span className="text-xs text-red-600 font-bold block mt-1">❌ {mediaUploadError}</span>}
                    </>
                  )}
                  <input
                    id="galFile"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileUpload}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-stone-400 mt-1.5">
                  Photos are compressed and stored in Supabase Storage CDN — serves images fast at zero cost.
                </p>
              </div>
            ) : (
              <div className="col-span-1">
                <label htmlFor="galVidUrl" className="block text-xs text-stone-600 font-bold mb-1">Paste YouTube URL Link</label>
                <input
                  id="galVidUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=co7Pn6mPqNo"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2.5 text-stone-850 bg-[#FCFBF7] font-mono"
                  required={mediaType === 'video'}
                />
                <span className="text-[10px] text-stone-500 font-medium block mt-1.5 leading-normal">
                  * Admins must host video clips on YouTube for free stream playback.
                </span>
              </div>
            )}

            {/* Titles */}
            <div className="col-span-1 space-y-4">
              <div>
                <label htmlFor="galTitleEN" className="block text-xs text-stone-600 font-bold mb-1">Media Title (English)</label>
                <input
                  id="galTitleEN"
                  type="text"
                  placeholder="e.g. Majestic Maha Abhishekam"
                  value={mediaTitleEN}
                  onChange={(e) => setMediaTitleEN(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
                  required
                />
              </div>
              <div>
                <label htmlFor="galTitleTE" className="block text-xs text-stone-600 font-bold mb-1">మీడియా శీర్షిక (తెలుగు)</label>
                <input
                  id="galTitleTE"
                  type="text"
                  placeholder="ఉదా: పవిత్ర మహామంగళహారతి"
                  value={mediaTitleTE}
                  onChange={(e) => setMediaTitleTE(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-stone-150">
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 bg-[#7A1E1E] hover:bg-[#5E1414] text-white rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + {language === 'EN' ? 'Approve & Append to Stream' : 'చిత్రమాలికలో ప్రచురించు'}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Listing */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 text-left">
        <h5 className="font-serif text-sm font-extrabold text-[#7A1E1E] uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">
          🎬 {language === 'EN' ? 'Gallery Assets Catalog Manager' : 'చిత్రమాలిక అసెట్స్ కంట్రోల్'}
        </h5>
        <div className="space-y-3 max-h-68 overflow-y-auto pr-2">
          {galleryList.map((g) => (
            <div key={g.id} className="flex items-center justify-between p-3 bg-[#FCFBF7] rounded-xl border border-stone-200 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-11 shrink-0 rounded-lg overflow-hidden border border-stone-300 relative shadow-sm bg-stone-100">
                  {g.type === 'video' ? (
                    <>
                      <img src={getYoutubeThumbnail(g.url)} className="w-full h-full object-cover" alt="Video thumbnail" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-red-950/20 flex items-center justify-center">
                        <span className="bg-red-600 text-white rounded-full px-1.5 py-0.5 text-[8px] font-bold">▶</span>
                      </div>
                    </>
                  ) : (
                    <img src={g.url} className="w-full h-full object-cover" alt="Image thumbnail" referrerPolicy="no-referrer" />
                  )}
                </div>
                <div className="max-w-[140px] sm:max-w-xs truncate">
                  <p className="font-bold text-stone-850 truncate">{language === 'EN' ? g.titleEN : g.titleTE}</p>
                  <p className="text-[10px] text-stone-500 font-mono italic">
                    {g.type === 'video' ? '📺 VIDEO FEED' : '🖼️ DEITY PHOTO'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGalleryDeletionConfirm(g)}
                className="text-red-650 hover:bg-red-50 p-2 rounded-full transition shadow-sm border border-red-100 cursor-pointer"
                title="Remove media item"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {galleryDeletionConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in text-left">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-2 border-[#7A1E1E]">
            <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-3 flex items-center space-x-1.5 border-b border-stone-100 pb-2">
              <Trash2 className="h-5 w-5" />
              <span>{language === 'EN' ? 'Confirm Resource Deletion' : 'శాశ్వత తొలగింపు నిర్ధారణ'}</span>
            </h4>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              {language === 'EN'
                ? 'CRITICAL WARNING: The following media resource will be deleted instantly. Verify the image preview below before executing.'
                : 'హెచ్చరిక: కింద చూపిన చిత్రం శాశ్వతంగా తొలగించబడుతుంది. దయచేసి నిర్ధారించుకోండి.'}
            </p>
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-stone-350 shadow-inner mb-4 relative bg-stone-100">
              {galleryDeletionConfirm.type === 'video' ? (
                <>
                  <img src={getYoutubeThumbnail(galleryDeletionConfirm.url)} className="w-full h-full object-cover" alt="Video preview" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-red-950/20 flex items-center justify-center">
                    <span className="bg-red-600 text-white rounded-full px-3 py-1 font-sans text-xs font-black">PLAY VIDEOCLIP</span>
                  </div>
                </>
              ) : (
                <img src={galleryDeletionConfirm.url} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
              )}
            </div>
            <p className="font-serif text-xs font-black text-stone-900 mb-6 truncate text-center bg-stone-50 py-1.5 px-3 rounded-lg">
              {language === 'EN' ? galleryDeletionConfirm.titleEN : galleryDeletionConfirm.titleTE}
            </p>
            <div className="flex items-center space-x-3 justify-end">
              <button
                onClick={() => setGalleryDeletionConfirm(null)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl text-xs font-bold bg-white transition cursor-pointer"
              >
                {language === 'EN' ? 'Cancel Guard' : 'రద్దు చేయి'}
              </button>
              <button
                onClick={executeGalleryDeletion}
                className="px-4 py-2 bg-red-650 hover:bg-red-800 text-white rounded-xl text-xs font-extrabold shadow transition cursor-pointer"
              >
                🔥 {language === 'EN' ? 'Delete Instantly' : 'శాశ్వతంగా తొలగించు'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
