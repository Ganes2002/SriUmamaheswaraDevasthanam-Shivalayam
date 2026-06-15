import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Language } from '../../translations';
import { YearlyStat } from '../../types';
import { addLog } from '../../db';
import { showToast } from '../Toast';

interface AdminYearlyAuditFormProps {
  language: Language;
  yearlyStats?: YearlyStat[];
  onUpdateYearlyStats?: (list: YearlyStat[]) => void;
}

export default function AdminYearlyAuditForm({
  language,
  yearlyStats = [],
  onUpdateYearlyStats
}: AdminYearlyAuditFormProps) {
  const [editYear, setEditYear] = useState<string>('2026');
  const [editYearAmount, setEditYearAmount] = useState<number>(685420);
  const [editYearEN, setEditYearEN] = useState<string>('');
  const [editYearTE, setEditYearTE] = useState<string>('');

  useEffect(() => {
    if (yearlyStats && yearlyStats.length > 0) {
      const match = yearlyStats.find(s => s.year === editYear);
      if (match) {
        setEditYearAmount(match.totalAmount);
        setEditYearEN(match.achievementEN);
        setEditYearTE(match.achievementTE);
      } else {
        // If year is not yet defined in database, pre-populate with zero or empty
        setEditYearAmount(0);
        setEditYearEN('');
        setEditYearTE('');
      }
    }
  }, [editYear, yearlyStats]);

  const handleYearlyStatsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateYearlyStats && yearlyStats) {
      const exists = yearlyStats.some(s => s.year === editYear);
      let nextStats: YearlyStat[];
      if (exists) {
        nextStats = yearlyStats.map(s => {
          if (s.year === editYear) {
            return {
              ...s,
              totalAmount: Number(editYearAmount),
              achievementEN: editYearEN,
              achievementTE: editYearTE
            };
          }
          return s;
        });
      } else {
        nextStats = [
          ...yearlyStats,
          {
            year: editYear,
            totalAmount: Number(editYearAmount),
            achievementEN: editYearEN,
            achievementTE: editYearTE
          }
        ];
      }
      onUpdateYearlyStats(nextStats);
      addLog(`Updated financial stats for Year ${editYear}: ₹${Number(editYearAmount).toLocaleString()}`, "edit");
      showToast(
        language === 'EN'
          ? `${editYear} financial stats saved — Welfare Ledger charts updated instantly!`
          : `${editYear} ఆర్థిక వివరాలు సేవ్ అయ్యాయి — వెల్ఫేర్ లెడ్జర్ తక్షణమే నవీకరించబడింది!`,
        'success'
      );
    }
  };

  return (
    <div id="admin-yearly-audit-section" className="bg-white p-6 rounded-3xl border border-stone-200">
      <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-4 flex items-center space-x-2 border-b border-stone-100 pb-3">
        <TrendingUp size={18} />
        <span>{language === 'EN' ? "Audit Yearly Donation Totals & Milestones" : "వార్షిక విరాళాల నిధులు & ఘనకార్యాల సవరణ"}</span>
      </h4>
      
      <div className="bg-amber-50/40 p-4 border border-amber-100 rounded-2xl mb-6 text-xs text-[#7A1E1E] leading-relaxed">
        👉 {language === 'EN' 
          ? "Select a year below to view and edit its active audited sum and milestones recorded in the database. Saving edits updates both the public Welfare Ledger charts and annual spotlight cards instantly." 
          : "ఆయా సంవత్సరపు మొత్తం విరాళాల నిధి మరియు సాధించిన విజయాలను సవరించడానికి కింద ఒక సంవత్సరాన్ని ఎంచుకోండి. మార్పులు వెంటనే పబ్లిక్ వెల్ఫేర్ లెడ్జర్ లో అప్‌డేట్ చేయబడతాయి."}
      </div>

      <form onSubmit={handleYearlyStatsSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Select Year to Edit */}
          <div>
            <label htmlFor="editYearSelect" className="block text-xs text-stone-600 font-bold mb-1">
              {language === 'EN' ? "Select Fiscal Year:" : "సంవత్సరాన్ని ఎంచుకోండి:"}
            </label>
            <select
              id="editYearSelect"
              value={editYear}
              onChange={(e) => setEditYear(e.target.value)}
              className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7] font-semibold"
            >
              {Array.from({ length: 51 }, (_, i) => String(2050 - i)).map(yr => (
                <option key={yr} value={yr}>
                  {yr} {yr === '2026' ? `(${language === 'EN' ? 'Active' : 'ప్రస్తుత'})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Yearly Amount Input */}
          <div>
            <label htmlFor="editYearAmount" className="block text-xs text-stone-600 font-bold mb-1">
              {language === 'EN' ? "Audit Total Amount (₹ INR):" : "మొత్తం ఆడిట్ చేసిన నిధి (₹):"}
            </label>
            <input
              id="editYearAmount"
              type="number"
              value={editYearAmount}
              onChange={(e) => setEditYearAmount(Number(e.target.value))}
              className="w-full text-xs font-mono rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7] font-extrabold text-[#7A1E1E]"
              required
            />
          </div>

          {/* Achievements EN */}
          <div className="sm:col-span-2">
            <label htmlFor="editYearEN" className="block text-xs text-stone-600 font-bold mb-1">
              {language === 'EN' ? "Key Milestones & Achievements (English):" : "ఆ సంవత్సరపు విజయాల ప్రస్థానం (English):"}
            </label>
            <textarea
              id="editYearEN"
              value={editYearEN}
              onChange={(e) => setEditYearEN(e.target.value)}
              className="w-full text-xs font-sans rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7] h-16"
              required
            />
          </div>

          {/* Achievements TE */}
          <div className="sm:col-span-2 sm:col-start-3">
            <label htmlFor="editYearTE" className="block text-xs text-stone-600 font-bold mb-1">
              {language === 'EN' ? "సాధించిన విజయాలు (Telugu Milestones):" : "ఆ సంవత్సరపు విజయాల ప్రస్థానం (తెలుగు):"}
            </label>
            <textarea
              id="editYearTE"
              value={editYearTE}
              onChange={(e) => setEditYearTE(e.target.value)}
              className="w-full text-xs font-sans rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7] h-16"
              required
            />
          </div>

        </div>

        <div className="flex justify-end pt-2 border-t border-stone-150">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#7A1E1E] hover:bg-[#5E1414] text-white rounded-lg text-xs font-bold transition shadow cursor-pointer"
          >
            💾 {language === 'EN' ? `Save ${editYear} Audit Records` : `${editYear} నిధుల సమాచారం సేవ్ చేయి`}
          </button>
        </div>
      </form>
    </div>
  );
}
