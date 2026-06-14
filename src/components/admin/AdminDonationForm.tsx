import React, { useState } from 'react';
import { Receipt, Plus } from 'lucide-react';
import { Language } from '../../translations';
import { DonorRecord } from '../../types';
import { addLog } from '../../db';

interface AdminDonationFormProps {
  language: Language;
  donorsList: DonorRecord[];
  onUpdateDonors: (list: DonorRecord[]) => void;
  currentYearCounter: number;
  onUpdateCurrentYearCounter: (val: number) => void;
  t: (key: string) => string;
}

export default function AdminDonationForm({
  language,
  donorsList,
  onUpdateDonors,
  currentYearCounter,
  onUpdateCurrentYearCounter,
  t
}: AdminDonationFormProps) {
  const [donorNameEN, setDonorNameEN] = useState('');
  const [donorNameTE, setDonorNameTE] = useState('');
  const [donorAmount, setDonorAmount] = useState<number>(5116);
  const [donorDate, setDonorDate] = useState('2026-06-03');
  const [donorPurposeEN, setDonorPurposeEN] = useState('General Temple Welfare');
  const [donorPurposeTE, setDonorPurposeTE] = useState('సాధారణ సేవా విరాళం');
  const [donorIsAnon, setDonorIsAnon] = useState(false);

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorIsAnon && (!donorNameEN || !donorNameTE)) {
      alert("Sponsor names required.");
      return;
    }

    const finalNameEN = donorIsAnon ? "Anonymous Devotee" : donorNameEN;
    const finalNameTE = donorIsAnon ? "గుప్తదాత" : donorNameTE;

    const newRecord: DonorRecord = {
      id: `don-${Date.now()}`,
      nameEN: finalNameEN,
      nameTE: finalNameTE,
      amount: Number(donorAmount),
      date: donorDate,
      purposeEN: donorPurposeEN,
      purposeTE: donorPurposeTE,
      isAnonymous: donorIsAnon
    };

    // Update main donors grid
    const nextDonors = [newRecord, ...donorsList];
    onUpdateDonors(nextDonors);

    // Add amounts instantly to the cumulative current-year tracking pool!
    onUpdateCurrentYearCounter(currentYearCounter + Number(donorAmount));
    
    addLog(`Recorded trust donation: ₹${donorAmount.toLocaleString()} received from ${donorIsAnon ? 'Private Sponsor' : finalNameEN}`, "edit");

    // Reset Form
    setDonorNameEN('');
    setDonorNameTE('');
    setDonorAmount(5116);
    alert(language === 'EN' ? "Donation recorded to transparent ledger successfully!" : "విరాళం విజయవంతంగా లెడ్జర్ లో నమోదు చేయబడింది!");
  };

  return (
    <div id="admin-donation-section" className="bg-white p-6 rounded-3xl border border-stone-200">
      <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-4 flex items-center space-x-2 border-b border-stone-100 pb-3">
        <Receipt size={18} />
        <span>{t('addDonor')}</span>
      </h4>
      <form onSubmit={handleDonationSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Name EN */}
          <div className="col-span-1">
            <label htmlFor="donNameEN" className="block text-xs text-stone-600 font-bold mb-1">Donor Name (English)</label>
            <input
              id="donNameEN"
              type="text"
              placeholder="G. Janardhan"
              value={donorNameEN}
              onChange={(e) => setDonorNameEN(e.target.value)}
              className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
              required={!donorIsAnon}
              disabled={donorIsAnon}
            />
          </div>

          {/* Name TE */}
          <div className="col-span-1">
            <label htmlFor="donNameTE" className="block text-xs text-stone-600 font-bold mb-1">దాత పేరు (తెలుగు)</label>
            <input
              id="donNameTE"
              type="text"
              placeholder="జి. జనార్ధన్"
              value={donorNameTE}
              onChange={(e) => setDonorNameTE(e.target.value)}
              className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
              required={!donorIsAnon}
              disabled={donorIsAnon}
            />
          </div>

          {/* Amount */}
          <div className="col-span-1">
            <label htmlFor="donAmount" className="block text-xs text-stone-600 font-bold mb-1">Amount (₹ INR)</label>
            <input
              id="donAmount"
              type="number"
              value={donorAmount}
              onChange={(e) => setDonorAmount(Number(e.target.value))}
              className="w-full text-xs font-mono rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
              required
            />
          </div>

          {/* Date */}
          <div className="col-span-1">
            <label htmlFor="donDate" className="block text-xs text-stone-600 font-bold mb-1">Payment Date</label>
            <input
              id="donDate"
              type="date"
              value={donorDate}
              onChange={(e) => setDonorDate(e.target.value)}
              className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
              required
            />
          </div>

          {/* Anonymous Toggle */}
          <div className="col-span-1 flex flex-col justify-end">
            <label className="inline-flex items-center space-x-2 text-xs text-stone-600 font-bold mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={donorIsAnon}
                onChange={(e) => setDonorIsAnon(e.target.checked)}
                className="rounded text-[#7A1E1E] focus:ring-[#7A1E1E]"
              />
              <span>{t('anonymous')}</span>
            </label>
          </div>

          {/* Purpose EN */}
          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="donPurpEN" className="block text-xs text-stone-600 font-bold mb-1">Dedicated Purpose (English)</label>
            <input
              id="donPurpEN"
              type="text"
              value={donorPurposeEN}
              onChange={(e) => setDonorPurposeEN(e.target.value)}
              className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
              required
            />
          </div>

          {/* Purpose TE */}
          <div className="col-span-1 sm:col-span-2">
            <label htmlFor="donPurpTE" className="block text-xs text-stone-600 font-bold mb-1">విరాళం ఉద్దేశం (తెలుగు)</label>
            <input
              id="donPurpTE"
              type="text"
              value={donorPurposeTE}
              onChange={(e) => setDonorPurposeTE(e.target.value)}
              className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7]"
              required
            />
          </div>

          {/* Submit btn */}
          <div className="col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Plus size={12} />
              <span>{language === 'EN' ? "Post Donation" : "విరాళం నమోదు"}</span>
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
