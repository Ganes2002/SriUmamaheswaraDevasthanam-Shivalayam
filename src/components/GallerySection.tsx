import React, { useState } from 'react';
import { TRANSLATIONS, Language } from '../translations';
import { GalleryItem } from '../types';
import { Eye, Film, Play, Image as ImageIcon, Video, X, Download } from 'lucide-react';

interface GallerySectionProps {
  language: Language;
  galleryList: GalleryItem[];
}

export default function GallerySection({ language, galleryList }: GallerySectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos'>('all');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  // title = display label (EN or TE), titleEN = always English for safe download filename
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; title: string; titleEN: string } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    setIsDownloading(true);
    // Always use English title for filename — Telugu/non-ASCII chars break file names
    const safeName = selectedPhoto.titleEN
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .replace(/\s+/g, '_') || 'temple-photo';
    try {
      const response = await fetch(selectedPhoto.url);
      const blob = await response.blob();
      const ext = blob.type === 'image/png' ? '.png' : blob.type === 'image/webp' ? '.webp' : '.jpg';
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${safeName}${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      // CORS-blocked URL (e.g. old Unsplash links) — open in new tab so user can save manually
      window.open(selectedPhoto.url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const t = (key: string) => {
    return TRANSLATIONS[key]?.[language] || key;
  };

  // Extract core YouTube ID
  const parseYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const imagesCount = galleryList.filter(item => item.type === 'image').length;

  const filteredItems = galleryList.filter(item => {
    if (activeTab === 'images') return item.type === 'image';
    if (activeTab === 'videos') return item.type === 'video';
    return true; // ‘all’
  });

  return (
    <section id="gallery" className="py-16 bg-[#FAF6F0] px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        
        {/* Section Title Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 border-2 border-dashed border-[#E29524]">
              <Film className="text-[#7A1E1E] h-5 w-5 animate-pulse" />
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#7A1E1E] tracking-tight">
            {t('galleryTitle')}
          </h2>
          <p className="mt-2 text-stone-600 font-sans text-sm max-w-2xl mx-auto leading-relaxed">
            {t('gallerySubtitle')}
          </p>
          
          {/* Strict Image Cap Gauge */}
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 mt-4 px-3 py-1 rounded-full text-[11px] font-semibold text-stone-700 shadow-sm font-sans">
            <span className="h-2 w-2 bg-[#E29524] rounded-full animate-pulse" />
            <span>
              {language === 'EN' 
                ? `System Image Allotment Status: ${imagesCount} of 20 images used` 
                : `మొత్తం ఇమేజ్ కోటా స్థితి: 20 చిత్రాలకు గాను ${imagesCount} అప్‌లోడ్ చేశారు`}
            </span>
          </div>

          <div className="mx-auto mt-4 h-0.5 w-24 bg-amber-400" />
        </div>

        {/* Tab Selection Filter Controls */}
        <div className="flex justify-center space-x-2 mb-10">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full font-sans text-xs font-bold tracking-wider uppercase transition shadow-sm ${activeTab === 'all' ? 'bg-[#7A1E1E] text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}
          >
            {language === 'EN' ? "All Media" : "అన్నీ"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 rounded-full font-sans text-xs font-bold tracking-wider uppercase transition shadow-sm flex items-center space-x-1.5 ${activeTab === 'images' ? 'bg-[#7A1E1E] text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}
          >
            <ImageIcon size={12} />
            <span>{t('photoTab')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-full font-sans text-xs font-bold tracking-wider uppercase transition shadow-sm flex items-center space-x-1.5 ${activeTab === 'videos' ? 'bg-[#7A1E1E] text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}
          >
            <Video size={12} />
            <span>{t('videoTab')}</span>
          </button>
        </div>

        {/* Grid Area of photos/vids */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white card border border-stone-100 rounded-3xl">
            <p className="text-stone-500 font-sans text-sm">{t('emptyMedia')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredItems.map((item) => {
              const itemTitle = language === 'EN' ? item.titleEN : item.titleTE;

              if (item.type === 'video') {
                const yId = parseYouTubeId(item.url) || "co7Pn6mPqNo";
                const thumbUrl = `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;
                
                return (
                  <div 
                    key={item.id}
                    id={`gallery-${item.id}`}
                    onClick={() => setSelectedVideoId(yId)}
                    className="relative cursor-pointer bg-stone-900 aspect-video rounded-2xl overflow-hidden group border border-stone-800 shadow-md hover:shadow-xl transition-all"
                    title="Click to stream video"
                  >
                    {/* YouTube Thumbnail Background with Lazy Ref Referrer */}
                    <img 
                      src={thumbUrl} 
                      alt={itemTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-60 group-hover:scale-105 transition duration-500"
                    />
                    
                    {/* Overlay Grid play button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white bg-gradient-to-t from-black via-black/40 to-transparent">
                      <div className="h-12 w-12 rounded-full bg-[#E29524] text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition duration-300">
                        <Play size={20} className="fill-current ml-0.5" />
                      </div>
                      
                      {/* Video Category badge */}
                      <span className="mt-3 bg-red-600 text-white rounded px-2 py-0.5 text-[9px] uppercase tracking-wider font-extrabold flex items-center space-x-1 shadow">
                        <Video size={10} />
                        <span>{language === 'EN' ? 'Stream Link' : 'యూట్యూబ్ క్లిప్'}</span>
                      </span>

                      {/* Display name */}
                      <h4 className="mt-2 font-serif text-sm font-bold text-white tracking-wide line-clamp-1">
                        {itemTitle}
                      </h4>
                    </div>
                  </div>
                );
              } else {
                // Image item
                return (
                  <div
                    key={item.id}
                    id={`gallery-${item.id}`}
                    onClick={() => setSelectedPhoto({ url: item.url, title: itemTitle, titleEN: item.titleEN })}
                    className="relative cursor-pointer aspect-square rounded-2xl overflow-hidden bg-stone-100 group border border-amber-100 shadow-sm hover:shadow-xl transition-all"
                  >
                    <img 
                      src={item.url} 
                      alt={itemTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    
                    {/* Hover text label */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#7A1E1E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-white">
                      <span className="bg-amber-400 text-black rounded px-2 py-0.5 text-[9px] uppercase tracking-wider font-extrabold max-w-max mb-1.5 shadow">
                        {language === 'EN' ? 'Photo' : 'చిత్రం'}
                      </span>
                      <h4 className="font-serif text-sm font-bold tracking-wide text-amber-50">
                        {itemTitle}
                      </h4>
                      <p className="text-[10px] text-stone-300 flex items-center space-x-1 mt-1">
                        <Eye size={10} />
                        <span>{language === 'EN' ? 'Tap to Zoom' : 'పెద్దగా చూడండి'}</span>
                      </p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}

        {/* Streaming Instructions Banner */}
        <div className="mt-8 bg-amber-50/50 rounded-2xl border border-amber-100 p-4 text-center text-xs text-stone-600 font-medium">
          🎬 {language === 'EN' 
            ? "Notice: We utilize 100% serverless YouTube streaming parameters. Devotee events are broadcast cost-free via our channel." 
            : "గమనిక: మేము ఇక్కడ చూపే యూట్యూబ్ వీడియోల ద్వారా ఆలయానికి విద్యుత్/నిర్వహణ ఖర్చులు సున్నాగా నిర్వహించబడుతున్నాయి."}
        </div>

      </div>

      {/* High Fidelity YouTube Video Player Overlay */}
      {selectedVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#1A1A1A] rounded-2xl overflow-hidden border border-stone-700 shadow-2xl flex flex-col aspect-video">
            <button
              onClick={() => setSelectedVideoId(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
            <iframe
              id="youtubeFramePlayer"
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`}
              title="Temple Video Player Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Image Zoom Overlay Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl border-2 border-amber-400"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action buttons — top-right corner */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              {/* Download button */}
              <button
                onClick={handleDownloadPhoto}
                disabled={isDownloading}
                title={language === 'EN' ? 'Download photo' : 'ఫోటో డౌన్‌లోడ్ చేయండి'}
                className="rounded-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 p-2 text-stone-950 shadow-lg transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 px-3"
              >
                <Download size={16} strokeWidth={2.5} />
                <span className="text-[11px] font-bold hidden sm:inline">
                  {isDownloading
                    ? (language === 'EN' ? 'Saving...' : 'సేవ్ అవుతోంది...')
                    : (language === 'EN' ? 'Download' : 'డౌన్‌లోడ్')}
                </span>
              </button>
              {/* Close button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                title={language === 'EN' ? 'Close' : 'మూసివేయి'}
                className="rounded-full bg-black/70 hover:bg-black p-2 text-white transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[85vh] object-contain"
            />

            {/* Photo title bar at the bottom */}
            <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-sm px-4 py-2 text-center">
              <p className="font-serif text-xs sm:text-sm font-bold text-amber-300 truncate">{selectedPhoto.title}</p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
