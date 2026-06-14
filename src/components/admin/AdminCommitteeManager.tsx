import React, { useState, useRef } from 'react';
import { Users, Edit, Trash2, Phone, Mail, UserPlus, Camera } from 'lucide-react';
import { Language } from '../../translations';
import { CommitteeMember } from '../../types';
import { addLog } from '../../db';

interface AdminCommitteeManagerProps {
  language: Language;
  committeeList: CommitteeMember[];
  onUpdateCommittee?: (list: CommitteeMember[]) => void;
  loggedInAdmin: CommitteeMember | null;
  setLoggedInAdmin: (val: CommitteeMember | null) => void;
}

export default function AdminCommitteeManager({
  language,
  committeeList,
  onUpdateCommittee,
  loggedInAdmin,
  setLoggedInAdmin
}: AdminCommitteeManagerProps) {
  // Form State: Committee Members customizer
  const [editCommitteeId, setEditCommitteeId] = useState<string | null>(null);
  const [commNameEN, setCommNameEN] = useState('');
  const [commNameTE, setCommNameTE] = useState('');
  const [commRoleEN, setCommRoleEN] = useState('');
  const [commRoleTE, setCommRoleTE] = useState('');
  const [commPhone, setCommPhone] = useState('');
  const [commEmail, setCommEmail] = useState('');
  const [commImageUrl, setCommImageUrl] = useState('');
  const [commPasscode, setCommPasscode] = useState('');
  const [commUsername, setCommUsername] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressAndSetProfileImage = (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(language === 'EN' 
        ? "Selected image is too large! Please select an image under 2MB." 
        : "చిత్రం పరిమాణం చాలా ఎక్కువగా ఉంది! దయచేసి 2MB లోపు ఉన్న చిత్రాన్ని ఎంచుకోండి.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const originalResult = event.target?.result as string;
      if (!originalResult) return;

      const img = new window.Image();
      img.src = originalResult;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Force maximum bounds for speedy storage loading (Profile photo can be small: 160x160)
        const MAX_DIM = 160;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          setCommImageUrl(compressedBase64);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const resetCommitteeForm = () => {
    setEditCommitteeId(null);
    setCommNameEN('');
    setCommNameTE('');
    setCommRoleEN('');
    setCommRoleTE('');
    setCommPhone('');
    setCommEmail('');
    setCommImageUrl('');
    setCommPasscode('');
    setCommUsername('');
  };

  const handleEditCommitteeSelect = (member: CommitteeMember) => {
    setEditCommitteeId(member.id);
    setCommNameEN(member.nameEN);
    setCommNameTE(member.nameTE);
    setCommRoleEN(member.roleEN);
    setCommRoleTE(member.roleTE);
    setCommPhone(member.phone);
    setCommEmail(member.email);
    setCommImageUrl(member.imageUrl || '');
    setCommPasscode(member.passcode || '');
    setCommUsername(member.username || '');
  };

  const handleCommitteeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateCommittee) return;

    const typedPass = commPasscode.trim();
    if (typedPass.length < 4) {
      alert(language === 'EN' ? "Security Passcode must be at least 4 characters long!" : "భద్రతా పాస్‌కోడ్ కనీసం 4 అక్షరాల నిడివి కలిగి ఉండాలి!");
      return;
    }

    if (editCommitteeId) {
      // Edit mode
      const nextList = committeeList.map(m => {
        if (m.id === editCommitteeId) {
          return {
            ...m,
            nameEN: commNameEN,
            nameTE: commNameTE,
            roleEN: commRoleEN,
            roleTE: commRoleTE,
            phone: commPhone,
            email: commEmail,
            imageUrl: commImageUrl || undefined,
            passcode: typedPass,
            username: commUsername.trim() || undefined
          };
        }
        return m;
      });
      onUpdateCommittee(nextList);
      addLog(`Updated committee member: "${commNameEN}"`, "edit");
      alert(language === 'EN' ? "Committee member and admin credentials updated successfully!" : "కమిటీ సభ్యుని సమగ్ర వివరాలు మరియు లాగిన్ క్రెడెన్షియల్స్ నవీకరించబద్ధాయి!");

      // If logged-in admin was edited, update current session information immediately
      if (loggedInAdmin && loggedInAdmin.id === editCommitteeId) {
        const liveCurrent = {
          ...loggedInAdmin,
          nameEN: commNameEN,
          nameTE: commNameTE,
          roleEN: commRoleEN,
          roleTE: commRoleTE,
          phone: commPhone,
          email: commEmail,
          imageUrl: commImageUrl || undefined,
          passcode: typedPass,
          username: commUsername.trim() || undefined
        };
        setLoggedInAdmin(liveCurrent);
        localStorage.setItem('um_dev_logged_in_admin', JSON.stringify(liveCurrent));
      }

    } else {
      // Create mode
      const newMember: CommitteeMember = {
        id: `member-${Date.now()}`,
        nameEN: commNameEN,
        nameTE: commNameTE,
        roleEN: commRoleEN,
        roleTE: commRoleTE,
        phone: commPhone,
        email: commEmail,
        imageUrl: commImageUrl || undefined,
        passcode: typedPass,
        username: commUsername.trim() || undefined
      };
      onUpdateCommittee([...committeeList, newMember]);
      addLog(`Added new committee member: "${commNameEN}"`, "edit");
      alert(language === 'EN' ? "New committee member & passcode credentials registered!" : "కొత్త కమిటీ సభ్యుడు & లాగిన్ పాస్‌కోడ్ జోడించబడ్డారు!");
    }

    resetCommitteeForm();
  };

  const handleDeleteCommitteeMember = (member: CommitteeMember) => {
    if (!onUpdateCommittee) return;
    
    if (loggedInAdmin && member.id === loggedInAdmin.id) {
      alert(language === 'EN' ? "You cannot delete your own active running session account!" : "ప్రస్తుతం లాగిన్ అయి ఉన్న మీ స్వంత ఖాతాను మీరు తొలగించలేరు!");
      return;
    }

    if (confirm(language === 'EN' ? `Are you sure you want to delete committee member "${member.nameEN}"?` : `గుర్తింపు పొందిన కమిటీ సభ్యుణ్ణి "${member.nameTE}" తొలగించడం ఖాయమేనా?`)) {
      const nextList = committeeList.filter(m => m.id !== member.id);
      onUpdateCommittee(nextList);
      addLog(`Removed committee member: "${member.nameEN}"`, "edit");
      alert(language === 'EN' ? "Member removed from active roll!" : "కమిటీ సభ్యుడు తొలగించబడ్డారు!");
      if (editCommitteeId === member.id) {
        resetCommitteeForm();
      }
    }
  };

  return (
    <div id="admin-committee-section" className="bg-white p-6 rounded-3xl border border-stone-200 text-left">
      <h4 className="font-serif text-base font-extrabold text-[#7A1E1E] mb-4 flex items-center space-x-2 border-b border-stone-100 pb-3">
        <Users size={18} />
        <span>{language === 'EN' ? "Temple Committee Members Roll & Contacts" : "ఆలయ కమిటీ సభ్యులు & సేవా బృందం సవరణ"}</span>
      </h4>

      <div className="bg-amber-50/40 p-4 border border-amber-100 rounded-2xl mb-6 text-xs text-[#7A1E1E] leading-relaxed">
        👉 {language === 'EN' 
          ? "Admins can update contact details, phone numbers, emails, names, or titles of existing committee member cards, or register new ones. Edits update the public footer contacts section immediately." 
          : "ఈ మ్యానేజర్ ద్వారా ఆలయ కమిటీ సభ్యుల ఫోన్ నంబర్లు, ఈమెయిల్స్, పేర్లు లేదా హోదాలను సవరించవచ్చు లేదా కొత్త సభ్యులను రిజిస్టర్ చేయవచ్చు. మార్పులు ఆలయ ఫుటర్ లో వెంటనే అమల్లోకి వస్తాయి."}
      </div>

      <form onSubmit={handleCommitteeSubmit} className="space-y-4 mb-8">
        <div className="bg-[#FAF6F0]/50 p-4 rounded-2xl border border-amber-100/60 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#7A1E1E]">
              {editCommitteeId 
                ? (language === 'EN' ? "⚡ MODE: EDITING MEMBER DETAILS" : "⚡ విధానం: సభ్యుల వివరాల సవరణ") 
                : (language === 'EN' ? "➕ MODE: REGISTER NEW MEMBER" : "➕ విధానం: కొత్త సభ్యుని నమోదు")}
            </span>
            {editCommitteeId && (
              <button 
                type="button" 
                onClick={resetCommitteeForm}
                className="text-xs font-bold text-stone-600 hover:text-stone-900 border border-stone-300 px-2 py-1 rounded bg-white transition hover:bg-stone-50 cursor-pointer"
              >
                {language === 'EN' ? "Cancel Edit & Set to Add New" : "రిసెట్ చేసి కొత్తగా సృష్టించు"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Name EN */}
            <div>
              <label htmlFor="commNameENInput" className="block text-xs text-stone-600 font-bold mb-1">
                {language === 'EN' ? "Full Name (English):" : "పూర్తి పేరు (ఇంగ్లీష్):"}
              </label>
              <input
                id="commNameENInput"
                type="text"
                placeholder="Sri Ramakrishna Rao"
                value={commNameEN}
                onChange={(e) => setCommNameEN(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7] font-sans"
                required
              />
            </div>

            {/* Name TE */}
            <div>
              <label htmlFor="commNameTEInput" className="block text-xs text-stone-600 font-bold mb-1">
                {language === 'EN' ? "ధార్మిక పేరు (Telugu Name):" : "పూర్తి పేరు (తెలుగు):"}
              </label>
              <input
                id="commNameTEInput"
                type="text"
                placeholder="శ్రీ రామకృష్ణ రావు"
                value={commNameTE}
                onChange={(e) => setCommNameTE(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-855 bg-[#FCFBF7] font-sans"
                required
              />
            </div>

            {/* Role EN */}
            <div>
              <label htmlFor="commRoleENInput" className="block text-xs text-stone-600 font-bold mb-1">
                {language === 'EN' ? "Role / Title (English):" : "హోదా / బాధ్యత (ఇంగ్లీష్):"}
              </label>
              <input
                id="commRoleENInput"
                type="text"
                placeholder="Trustee Member / Secretary"
                value={commRoleEN}
                onChange={(e) => setCommRoleEN(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7] font-sans"
                required
              />
            </div>

            {/* Role TE */}
            <div>
              <label htmlFor="commRoleTEInput" className="block text-xs text-stone-600 font-bold mb-1">
                {language === 'EN' ? "సేవా హోదా (Telugu Role):" : "హోదా / బాధ్యత (తెలుగు):"}
              </label>
              <input
                id="commRoleTEInput"
                type="text"
                placeholder="ట్రస్ట్ సభ్యుడు / కార్యదర్శి"
                value={commRoleTE}
                onChange={(e) => setCommRoleTE(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7] font-sans"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="commPhoneInput" className="block text-xs text-stone-600 font-bold mb-1">
                {language === 'EN' ? "Active Mobile No:" : "మొబైల్ ఫోన్ నెంబర్:"}
              </label>
              <input
                id="commPhoneInput"
                type="tel"
                placeholder="+91 94400 12345"
                value={commPhone}
                onChange={(e) => setCommPhone(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7] font-mono"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="commEmailInput" className="block text-xs text-stone-600 font-bold mb-1">
                {language === 'EN' ? "Email Address:" : "ఈమెయిల్ చిరునామా:"}
              </label>
              <input
                id="commEmailInput"
                type="email"
                placeholder="contact@templetrust.org"
                value={commEmail}
                onChange={(e) => setCommEmail(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7] font-mono"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="commUsernameInput" className="block text-xs text-stone-600 font-bold mb-1">
                {language === 'EN' ? "Admin Login Username (Optional):" : "లాగిన్ యూజర్ నేమ్ (ఐచ్ఛికం):"}
              </label>
              <input
                id="commUsernameInput"
                type="text"
                placeholder="e.g. shastri"
                value={commUsername}
                onChange={(e) => setCommUsername(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 text-stone-850 bg-[#FCFBF7] font-sans"
              />
            </div>

            {/* Passcode */}
            <div>
              <label htmlFor="commPasscodeInput" className="block text-xs text-[#7A1E1E] font-bold mb-1 flex items-center space-x-1">
                <span>🔑</span>
                <span>{language === 'EN' ? "Dashboard Key/Passcode (Required):" : "లాగిన్ పాస్‌కోడ్ (తప్పనిసరి):"}</span>
              </label>
              <input
                id="commPasscodeInput"
                type="text"
                placeholder="e.g. TEMP123 / DEV1008"
                value={commPasscode}
                onChange={(e) => setCommPasscode(e.target.value)}
                className="w-full text-xs rounded-lg border border-[#7A1E1E]/50 px-3 py-2 text-[#7A1E1E] bg-[#FCFBF7] font-mono font-bold focus:border-[#7A1E1E] focus:ring-1 focus:ring-[#7A1E1E]"
                required
                minLength={4}
              />
            </div>

            {/* Image Upload and/or URL option for high flexibility */}
            <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-dashed border-stone-200/60 pt-4 mt-2">
              <div>
                <label className="block text-xs text-stone-700 font-bold mb-1">
                  {language === 'EN' ? "Option A: Upload Profile Image" : "ఆప్షన్ A: ప్రొఫైల్ ఫోటో అప్‌లోడ్ చెయ్యండి"}
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-stone-300 hover:border-[#7A1E1E] rounded-xl p-3 text-center cursor-pointer bg-white hover:bg-stone-50 transition flex flex-col items-center justify-center space-y-1 h-20 select-none"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        compressAndSetProfileImage(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="flex items-center space-x-1 font-serif text-xs font-bold text-[#7A1E1E]">
                    <Camera size={14} />
                    <span>{language === 'EN' ? "Select Image File" : "ఫోటో ఫైలును ఎంచుకోండి"}</span>
                  </div>
                  <p className="text-[10px] text-stone-400">
                    {commImageUrl && commImageUrl.startsWith('data:image') 
                      ? (language === 'EN' ? "✓ Profile photo uploaded" : "✓ ఫోటో అప్‌లోడ్ అయింది") 
                      : (language === 'EN' ? "Auto compressed (Max 2MB)" : "ఆటోమాటిగ్గా కంప్రెస్ అవుతుంది")}
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="commImageUrlInput" className="block text-xs text-stone-700 font-bold mb-1">
                  {language === 'EN' ? "Option B: Or paste direct Image URL:" : "ఆప్షన్ B: లేదా చిత్రం వెబ్ అడ్రస్ ఇక్కడ రాయండి:"}
                </label>
                <textarea
                  id="commImageUrlInput"
                  rows={2}
                  placeholder="https://images.unsplash.com/..."
                  value={commImageUrl}
                  onChange={(e) => setCommImageUrl(e.target.value)}
                  className="w-full text-xs rounded-xl border border-stone-300 px-3 py-1.5 text-stone-850 bg-[#FCFBF7] font-mono h-20 resize-none focus:outline-none focus:border-[#7A1E1E]"
                />
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-stone-150">
          <button 
            type="submit" 
            className="flex items-center space-x-1.5 px-5 py-2.5 bg-[#7A1E1E] hover:bg-[#5E1414] text-white rounded-lg text-xs font-bold transition shadow cursor-pointer"
          >
            {editCommitteeId ? <Edit size={13} /> : <UserPlus size={13} />}
            <span>
              {editCommitteeId 
                ? (language === 'EN' ? `Save Changes to ${commNameEN || 'Member'}` : `${commNameTE || 'సభ్యుని'} వివరాలు సేవ్ చేయండి`)
                : (language === 'EN' ? "Register Committee Member" : "కమిటీ సభ్యునిగా చేర్చు")}
            </span>
          </button>
        </div>
      </form>

      {/* Active Committee Members visual rolling grid list */}
      <h5 className="font-serif text-sm font-extrabold text-[#7A1E1E] uppercase tracking-wider mb-4 border-b border-[#FAF6F0] pb-2 text-left">
        📜 {language === 'EN' ? "Active Roll Call Directory & Admin Controls:" : "ప్రస్తుత కమిటీ సభ్యుల డైరెక్టరీ & ఆఫీస్ సవరణ లింకులు:"}
      </h5>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {committeeList.length === 0 ? (
          <p className="text-xs text-stone-400 font-sans col-span-full">No committee members listed in local system registry.</p>
        ) : (
          committeeList.map((m) => (
            <div 
              key={m.id} 
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                editCommitteeId === m.id 
                  ? 'bg-amber-50/50 border-[#7A1E1E] ring-1 ring-[#7A1E1E]' 
                  : 'bg-[#FCFBF7] border-stone-200 hover:border-[#7A1E1E]/55'
              }`}
            >
              <div>
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#FAF6F0] border border-amber-200 flex items-center justify-center font-bold text-sm text-[#7A1E1E] shrink-0">
                    {m.imageUrl ? (
                      <img src={m.imageUrl} alt={m.nameEN} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span>{m.nameEN ? m.nameEN.charAt(0) : 'ॐ'}</span>
                    )}
                  </div>
                  
                  <div className="min-w-0">
                    <h6 className="font-serif text-xs font-black text-stone-900 truncate">
                      {language === 'EN' ? m.nameEN : m.nameTE}
                    </h6>
                    <p className="text-[10px] text-[#7A1E1E] font-bold truncate">
                      {language === 'EN' ? m.roleEN : m.roleTE}
                    </p>
                  </div>
                </div>

                <div className="mt-3 space-y-1 pt-2.5 border-t border-stone-100 font-sans text-[11px] text-stone-600 min-w-0">
                  <p className="flex items-center space-x-1">
                    <Phone size={10} className="text-stone-400 shrink-0" />
                    <span className="truncate">{m.phone}</span>
                  </p>
                  <p className="flex items-center space-x-1">
                    <Mail size={10} className="text-stone-400 shrink-0" />
                    <span className="truncate">{m.email}</span>
                  </p>
                  <div className="mt-2 pt-2 border-t border-dashed border-stone-200 text-[10px] bg-stone-50 p-1.5 rounded-lg flex items-center justify-between">
                    <span className="text-stone-500 flex items-center space-x-1 font-sans">
                      <span>🔑 {language === 'EN' ? "Key" : "పాస్‌కోడ్"}:</span>
                      <span className="font-mono font-bold text-stone-800">{m.passcode}</span>
                    </span>
                    {m.username && (
                      <span className="text-stone-400 font-sans">
                        @{m.username}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 mt-4 pt-2 border-t border-[#FAF6F0]">
                <button
                  type="button"
                  onClick={() => handleEditCommitteeSelect(m)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#7A1E1E] rounded-lg text-[10px] font-sans font-bold transition border border-amber-200 cursor-pointer"
                >
                  <Edit size={10} />
                  <span>{language === 'EN' ? "Edit" : "సవరించు"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCommitteeMember(m)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg transition border border-red-200 cursor-pointer"
                  title={language === 'EN' ? "Remove Member" : "సభ్యున్ని తొలగించు"}
                >
                  <Trash2 size={10} />
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
