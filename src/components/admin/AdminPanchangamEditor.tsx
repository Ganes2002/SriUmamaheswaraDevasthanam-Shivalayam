import React, { useState } from 'react';
import { Calendar, Save, Trash2, RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Language } from '../../translations';
import { PanchangamDetails } from '../../types';
import { calculatePanchangam } from '../../panchangam';
import { getPanchangamCacheEntry, savePanchangamOverride, clearPanchangamOverride } from '../../db';
import { showToast } from '../Toast';

interface Props {
  language: Language;
}

type CacheStatus = 'idle' | 'api' | 'manual' | 'uncached';

const today = new Date().toISOString().split('T')[0];

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-amber-400 bg-white"
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
      <h5 className="text-xs font-black text-[#7A1E1E] uppercase tracking-widest border-b border-amber-100 pb-2">{title}</h5>
      <div className="grid grid-cols-2 gap-2.5">{children}</div>
    </div>
  );
}

export default function AdminPanchangamEditor({ language }: Props) {
  const [selectedDate, setSelectedDate] = useState(today);
  const [status, setStatus] = useState<CacheStatus>('idle');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PanchangamDetails | null>(null);

  const set = (field: keyof PanchangamDetails) => (value: string) => {
    setForm(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleLoad = async () => {
    setLoading(true);
    try {
      // Check DB first to know the override status
      const entry = await getPanchangamCacheEntry(selectedDate);
      // Load the actual data (triggers Edge Function → Prokerala if uncached)
      const data = await calculatePanchangam(selectedDate);
      setForm(data);
      if (entry?.isManualOverride) setStatus('manual');
      else if (entry) setStatus('api');
      else setStatus('uncached');
    } catch {
      showToast(language === 'EN' ? 'Failed to load panchangam data.' : 'డేటా లోడ్ కాలేదు.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await savePanchangamOverride(selectedDate, { ...form, date: selectedDate });
      setStatus('manual');
      showToast(
        language === 'EN'
          ? `Panchangam for ${selectedDate} saved as manual override.`
          : `${selectedDate} పంచాంగం మాన్యువల్‌గా సేవ్ చేయబడింది.`,
        'success'
      );
    } catch {
      showToast(language === 'EN' ? 'Save failed.' : 'సేవ్ విఫలమైంది.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    if (!confirm(language === 'EN'
      ? `Clear manual override for ${selectedDate}? The API data will be used next time.`
      : `${selectedDate} మాన్యువల్ ఓవర్‌రైడ్ తొలగించాలా? తదుపరి API డేటా వస్తుంది.`
    )) return;
    setSaving(true);
    try {
      await clearPanchangamOverride(selectedDate);
      setStatus('uncached');
      showToast(
        language === 'EN' ? 'Override cleared. API data will refresh.' : 'ఓవర్‌రైడ్ తొలగించబడింది.',
        'success'
      );
    } catch {
      showToast(language === 'EN' ? 'Clear failed.' : 'తొలగింపు విఫలమైంది.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const statusBadge: Record<CacheStatus, { label: string; labelTE: string; color: string; icon: React.ReactNode }> = {
    idle:     { label: 'No date loaded',   labelTE: 'తేదీ లోడ్ కాలేదు',          color: 'bg-stone-100 text-stone-500',   icon: <Calendar size={12} /> },
    api:      { label: 'Live API Data',     labelTE: 'API నుండి డేటా',             color: 'bg-emerald-50 text-emerald-700', icon: <CheckCircle size={12} /> },
    manual:   { label: 'Manual Override',   labelTE: 'మాన్యువల్ ఓవర్‌రైడ్',        color: 'bg-amber-50 text-amber-700',    icon: <AlertCircle size={12} /> },
    uncached: { label: 'Not Yet Cached',    labelTE: 'కాష్ అవ్వలేదు',              color: 'bg-blue-50 text-blue-700',      icon: <RefreshCw size={12} /> },
  };
  const badge = statusBadge[status];

  return (
    <div className="bg-white border border-amber-200 rounded-3xl p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-amber-100 pb-4">
        <div className="p-2 bg-amber-50 rounded-xl border border-amber-200">
          <Calendar size={18} className="text-[#7A1E1E]" />
        </div>
        <div>
          <h4 className="font-serif font-bold text-stone-900 text-sm">
            {language === 'EN' ? 'Panchangam Editor' : 'పంచాంగం సంపాదకుడు'}
          </h4>
          <p className="text-[10px] text-stone-500">
            {language === 'EN'
              ? 'View or override panchangam data for any date. Manual values take priority over the API.'
              : 'ఏ తేదీకైనా పంచాంగం డేటాను చూడండి లేదా సవరించండి. మాన్యువల్ విలువలు API కంటే ముందు వస్తాయి.'}
          </p>
        </div>
      </div>

      {/* Date picker + load */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
            {language === 'EN' ? 'Select Date' : 'తేదీ ఎంచుకోండి'}
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => { setSelectedDate(e.target.value); setStatus('idle'); setForm(null); }}
            className="border border-stone-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white"
          />
        </div>
        <button
          type="button"
          onClick={handleLoad}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-[#7A1E1E] text-white rounded-xl text-xs font-bold hover:bg-[#5E1414] disabled:opacity-50 transition cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
          <span>{loading ? (language === 'EN' ? 'Loading...' : 'లోడ్ అవుతోంది...') : (language === 'EN' ? 'Load Data' : 'డేటా లోడ్')}</span>
        </button>

        {/* Status badge */}
        <span className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${badge.color}`}>
          {badge.icon}
          <span>{language === 'EN' ? badge.label : badge.labelTE}</span>
        </span>
      </div>

      {/* Form — only shown after loading */}
      {form && (
        <>
          <div className="space-y-3">
            <Section title={language === 'EN' ? 'Calendar Context' : 'పంచాంగం సందర్భం'}>
              <Field label="Samvatsara (EN)" value={form.samvatsaraEN} onChange={set('samvatsaraEN')} />
              <Field label="సంవత్సరం (TE)" value={form.samvatsaraTE} onChange={set('samvatsaraTE')} />
              <Field label="Ayanam (EN)" value={form.ayanamEN} onChange={set('ayanamEN')} />
              <Field label="ఆయనం (TE)" value={form.ayanamTE} onChange={set('ayanamTE')} />
              <Field label="Rutvu / Season (EN)" value={form.rutvuEN} onChange={set('rutvuEN')} />
              <Field label="ఋతువు (TE)" value={form.rutvuTE} onChange={set('rutvuTE')} />
              <Field label="Maasam / Month (EN)" value={form.maasamEN} onChange={set('maasamEN')} />
              <Field label="మాసం (TE)" value={form.maasamTE} onChange={set('maasamTE')} />
              <Field label="Paksham (EN)" value={form.pakshamEN} onChange={set('pakshamEN')} />
              <Field label="పక్షం (TE)" value={form.pakshamTE} onChange={set('pakshamTE')} />
            </Section>

            <Section title={language === 'EN' ? 'Tithi' : 'తిథి'}>
              <Field label="Tithi (EN)" value={form.tithiEN} onChange={set('tithiEN')} />
              <Field label="తిథి (TE)" value={form.tithiTE} onChange={set('tithiTE')} />
              <Field label="End Time (e.g. 9:15 AM)" value={form.tithiEndTime ?? ''} onChange={set('tithiEndTime')} />
              <Field label="Next Tithi (EN)" value={form.tithiNextEN ?? ''} onChange={set('tithiNextEN')} />
              <Field label="తదుపరి తిథి (TE)" value={form.tithiNextTE ?? ''} onChange={set('tithiNextTE')} />
            </Section>

            <Section title={language === 'EN' ? 'Nakshatram' : 'నక్షత్రం'}>
              <Field label="Nakshatram (EN)" value={form.nakshatramEN} onChange={set('nakshatramEN')} />
              <Field label="నక్షత్రం (TE)" value={form.nakshatramTE} onChange={set('nakshatramTE')} />
              <Field label="End Time" value={form.nakshatramEndTime ?? ''} onChange={set('nakshatramEndTime')} />
              <Field label="Next Nakshatram (EN)" value={form.nakshatramNextEN ?? ''} onChange={set('nakshatramNextEN')} />
              <Field label="తదుపరి నక్షత్రం (TE)" value={form.nakshatramNextTE ?? ''} onChange={set('nakshatramNextTE')} />
            </Section>

            <Section title={language === 'EN' ? 'Yogam' : 'యోగం'}>
              <Field label="Yogam (EN)" value={form.yogamEN} onChange={set('yogamEN')} />
              <Field label="యోగం (TE)" value={form.yogamTE} onChange={set('yogamTE')} />
              <Field label="End Time" value={form.yogamEndTime ?? ''} onChange={set('yogamEndTime')} />
              <Field label="Next Yogam (EN)" value={form.yogamNextEN ?? ''} onChange={set('yogamNextEN')} />
              <Field label="తదుపరి యోగం (TE)" value={form.yogamNextTE ?? ''} onChange={set('yogamNextTE')} />
            </Section>

            <Section title={language === 'EN' ? 'Karanam' : 'కరణం'}>
              <Field label="Karanam (EN)" value={form.karanamEN} onChange={set('karanamEN')} />
              <Field label="కరణం (TE)" value={form.karanamTE} onChange={set('karanamTE')} />
              <Field label="End Time" value={form.karanamEndTime ?? ''} onChange={set('karanamEndTime')} />
              <Field label="Next Karanam (EN)" value={form.karanamNextEN ?? ''} onChange={set('karanamNextEN')} />
              <Field label="తదుపరి కరణం (TE)" value={form.karanamNextTE ?? ''} onChange={set('karanamNextTE')} />
            </Section>

            <Section title={language === 'EN' ? 'Rashi' : 'రాశి'}>
              <Field label="Surya Rashi (EN)" value={form.suryaRashiEN} onChange={set('suryaRashiEN')} />
              <Field label="సూర్య రాశి (TE)" value={form.suryaRashiTE} onChange={set('suryaRashiTE')} />
              <Field label="Chandra Rashi (EN)" value={form.chandraRashiEN} onChange={set('chandraRashiEN')} />
              <Field label="చంద్ర రాశి (TE)" value={form.chandraRashiTE} onChange={set('chandraRashiTE')} />
            </Section>

            <Section title={language === 'EN' ? 'Sun & Inauspicious Times' : 'సూర్యోదయం & అశుభ సమయాలు'}>
              <Field label="Sunrise" value={form.sunrise} onChange={set('sunrise')} />
              <Field label="Sunset" value={form.sunset} onChange={set('sunset')} />
              <Field label="Rahu Kalam" value={form.rahuKalam} onChange={set('rahuKalam')} />
              <Field label="Yamagandam" value={form.yamagandam} onChange={set('yamagandam')} />
              <Field label="Gulika Kalam" value={form.gulikaKalam} onChange={set('gulikaKalam')} />
              <Field label="Durmuhurtham (use ↵ for 2 slots)" value={form.durmuhurtham} onChange={set('durmuhurtham')} />
            </Section>

            <Section title={language === 'EN' ? 'Auspicious Times' : 'శుభ సమయాలు'}>
              <Field label="Varjyam" value={form.varjyam} onChange={set('varjyam')} />
              <Field label="Amritakalam" value={form.amritakalam} onChange={set('amritakalam')} />
            </Section>

            <Section title={language === 'EN' ? 'Special Day (optional)' : 'ప్రత్యేక దినం (ఐచ్ఛికం)'}>
              <Field label="Special Day (EN)" value={form.specialDayEN ?? ''} onChange={set('specialDayEN')} />
              <Field label="ప్రత్యేక దినం (TE)" value={form.specialDayTE ?? ''} onChange={set('specialDayTE')} />
            </Section>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-amber-100">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#7A1E1E] text-white rounded-xl text-xs font-bold hover:bg-[#5E1414] disabled:opacity-50 transition cursor-pointer disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              <span>{language === 'EN' ? 'Save as Manual Override' : 'మాన్యువల్‌గా సేవ్ చేయండి'}</span>
            </button>

            {status === 'manual' && (
              <button
                type="button"
                onClick={handleClear}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 disabled:opacity-50 transition cursor-pointer disabled:cursor-not-allowed"
              >
                <Trash2 size={13} />
                <span>{language === 'EN' ? 'Clear Override (Use API)' : 'ఓవర్‌రైడ్ తొలగించు (API వాడు)'}</span>
              </button>
            )}
          </div>

          {status === 'manual' && (
            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              {language === 'EN'
                ? 'This date uses manually entered data. Visitors see your values, not the API. Click "Clear Override" to restore live API data.'
                : 'ఈ తేదీ మాన్యువల్ డేటా ఉపయోగిస్తోంది. "ఓవర్‌రైడ్ తొలగించు" నొక్కితే తిరిగి API డేటా వస్తుంది.'}
            </p>
          )}
        </>
      )}
    </div>
  );
}
