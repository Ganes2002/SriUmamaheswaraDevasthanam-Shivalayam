export type Language = 'EN' | 'TE';

export interface TranslationDictionary {
  [key: string]: {
    EN: string;
    TE: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  appName: {
    EN: "Sri Umamaheswara Devasthanam (Shivalayam)",
    TE: "శ్రీ ఉమామహేశ్వర దేవస్థానం (శివాలయం)"
  },
  appSubtitle: {
    EN: "Official Devotee Portal",
    TE: "అధికారిక భక్త జన పోర్టల్"
  },
  tagline: {
    EN: "Union of Cosmic Power & Divine Grace",
    TE: "శివ శక్తి స్వరూపం - దైవ కరుణా ప్రవాహం"
  },
  navHome: {
    EN: "Home",
    TE: "ముగింపు" // Wait, Home is "ప్రధాన పేజీ"
  },
  navHomeCorrect: {
    EN: "Home",
    TE: "ప్రధాన పేజీ"
  },
  navAbout: {
    EN: "About",
    TE: "ఆలయ విశిష్టత"
  },
  navPanchangam: {
    EN: "Panchangam",
    TE: "పంచాంగం"
  },
  navEvents: {
    EN: "Events & Pujas",
    TE: "పూజలు & ఉత్సవాలు"
  },
  navGallery: {
    EN: "Media Gallery",
    TE: "చిత్రమాలిక"
  },
  navDonations: {
    EN: "Donations & Ledger",
    TE: "విరాళాలు & లెడ్జర్"
  },
  navContact: {
    EN: "Committee",
    TE: "కమిటీ బృందం"
  },
  adminLogin: {
    EN: "Admin Portal",
    TE: "అడ్మిన్ లాగిన్"
  },
  // Announcements
  announcementLabel: {
    EN: "FLASH UPDATE",
    TE: "తాజా సమాచారం"
  },
  // Hero
  heroGreeting: {
    EN: "Welcome to Sri Umamaheswara Devasthanam (Shivalayam)",
    TE: "శ్రీ ఉమామహేశ్వర దేవస్థానము (శివాలయం) నకు సుస్వాగతం"
  },
  heroDesc: {
    EN: "Experience the ultimate peace, divine silence, and pure energy of Lord Shiva and Goddess Parvati.",
    TE: "సాక్షాత్తు జగద్గురువులైన ఉమామహేశ్వరుల అనుగ్రహం, శాంతి మరియు పవిత్ర చైతన్యాన్ని దర్శించండి."
  },
  exploreDeity: {
    EN: "Explore Temple Timings",
    TE: "దర్శన వేళలు చూడండి"
  },
  darshanTimings: {
    EN: "Daily Darshan: 6:00 AM - 12:30 PM & 4:30 PM - 8:30 PM",
    TE: "రోజువారీ దర్శనములు: ఉదయం 6:00 - మధ్యాహ్నం 12:30 & సాయంత్రం 4:30 - रात्री 8:30"
  },
  // About Section
  aboutTitle: {
    EN: "History & Significance",
    TE: "ఆలయ చరిత్ర మరియు విశిష్టత"
  },
  aboutPara1: {
    EN: "Sri Umamaheswara Devasthanam (Shivalayam) stands as a glorious beacon of spiritual consciousness, representing the eternal cosmic union of Lord Shiva (Maheswara) and Goddess Parvati (Uma). Established generations ago, the devasthanam acts as a celestial sanctuary where Vedic rituals, spiritual discourses, and social welfare run in absolute harmony.",
    TE: "శ్రీ ఉమామహేశ్వర దేవస్థానం (శివాలయం) ఆధ్యాత్మిక చైతన్యానికి ఒక మహోజ్వల నిలయం, ఇది శివపార్వతుల నిత్య కల్యాణ రూపమైన ఉమామహేశ్వర తత్వానికి ప్రతీక. ఎన్నో తరాల క్రితం ప్రతిష్ఠించబడిన ఈ క్షేత్రం వేద మంత్రోచ్ఛారణలు, నిత్య పూజలు మరియు సామాజిక సంక్షేమ కార్యక్రమాలతో భక్తుల హృదయాల్లో ఓ ఆధ్యాత్మిక ఒయాసిస్సులా విరాజిల్లుతోంది."
  },
  aboutPara2: {
    EN: "We invite devotees from across the globe to partake in holy Pujas, experience the serenity of the temple architecture, and contribute towards community service and maintenance pipelines.",
    TE: "ప్రపంచవ్యాప్తంగా ఉన్న భక్తులందరినీ ఆలయ నిత్య పూజా కార్యక్రమాలలో పాల్గొని, ఉమామహేశ్వరుల అనుగ్రహం పొందవలసిందిగా మరియు ఆలయ అభివృద్ధికి, సామాజిక సేవలకు తమ వంతు సహకారం అందించవలసిందిగా కోరుతున్నాము."
  },
  mapsButton: {
    EN: "Tap to Navigate (Google/Apple Maps)",
    TE: "మార్గదర్శి (మ్యాప్స్ ఓపెన్ చేయండి)"
  },
  mapsDesc: {
    EN: "Opens coordinates directly in your native mobile maps app with zero background footprints.",
    TE: "మొబైల్ ఫోన్‌లోని గూగుల్/యాపిల్ మ్యాప్స్ యాప్ ద్వారా ఆలయ మార్గం వెంటనే చూపిస్తుంది."
  },
  // Panchangam Section
  panchangamTitle: {
    EN: "Daily South Indian Telugu Panchangam",
    TE: "నిత్య తెలుగు పంచాంగ కాలిక్యులేటర్"
  },
  panchangamSubtitle: {
    EN: "Calculated client-side seamlessly for dynamic timezones with absolute accuracy.",
    TE: "పరికర సమయం ఆధారంగా ఖచ్చితమైన విలువలని ఉచితంగా లెక్కిస్తుంది."
  },
  calcErrorText: {
    EN: "Mathematical lookup is refreshing or unavailable. Please use our stable official PDF fallback below.",
    TE: "గణిత లెక్కింపు రికార్డు లోడ్ అవుతుంది. దయచేసి దిగువన ఉన్న పీడీఎఫ్ ప్రత్యామ్నాయాన్ని చూడండి."
  },
  pdfFallbackButton: {
    EN: "Click here to view today's official timing chart PDF",
    TE: "నేటి అధికారిక సమయ సూచిక పీడీఎఫ్ (PDF) ఇక్కడే చూడండి"
  },
  tithi: { EN: "Tithi", TE: "తిథి" },
  nakshatram: { EN: "Nakshatram", TE: "నక్షత్రం" },
  rahuKalam: { EN: "Rahu Kalam", TE: "రాహుకాలం" },
  yamagandam: { EN: "Yamagandam", TE: "యమగండం" },
  gulikaKalam: { EN: "Gulika Kalam", TE: "గుళికాకాలం" },
  sunrise: { EN: "Sunrise", TE: "సూర్యోదయం" },
  sunset: { EN: "Sunset", TE: "సూర్యాస్తమయం" },
  varjyam: { EN: "Varjyam", TE: "వర్జ్యం" },
  durmuhurtham: { EN: "Durmuhurtham", TE: "దుర్ముహూర్తం" },
  selectDate: { EN: "Select Date:", TE: "తేదీని ఎంచుకోండి:" },
  today: { EN: "Today", TE: "ఈరోజు" },
  // Events Section
  eventsTitle: {
    EN: "Upcoming Festivals, Pujas & Welfare Schemes",
    TE: "రాబోయే పండుగలు, విశేష పూజలు & సంక్షేమ కార్యక్రమాలు"
  },
  whatsappShare: {
    EN: "Share on WhatsApp",
    TE: "వాట్సాప్ ద్వారా పంచుకోండి"
  },
  whatsappTemplateHeader: {
    EN: "Om Namah Shivaya! Sri Umamaheswara Devasthanam (Shivalayam) Invites you to: ",
    TE: "ఓం నమః శివాయ! శ్రీ ఉమామహేశ్వర దేవస్థాన (శివాలయం) ప్రత్యేక ఆహ్వానం: "
  },
  eventDate: { EN: "Date:", TE: "తేదీ:" },
  eventTime: { EN: "Time:", TE: "సమయం:" },
  eventLocation: { EN: "Venue:", TE: "వేదిక:" },
  // Gallery Section
  galleryTitle: {
    EN: "Live Media Stream & Divinity Gallery",
    TE: "శ్రీ ఉమామహేశ్వర డిజిటల్ చిత్రమాలిక"
  },
  gallerySubtitle: {
    EN: "Browse high-definition dynamic temple highlights. Strictly capped at 20 images to maintain zero-cost parameters.",
    TE: "ఆలయ దృశ్యాల సుందర తరంగాలు. పరిమితి గరిష్టంగా 20 లైవ్ చిత్రాలు మాత్రమే."
  },
  videoTab: { EN: "YouTube Video Feeds", TE: "యూట్యూబ్ క్లిప్స్ & లైవ్" },
  photoTab: { EN: "Deity & Temple Photos", TE: "పూజా అలంకరణల చిత్రాలు" },
  emptyMedia: { EN: "No media is currently active.", TE: "ప్రస్తుతానికి ఎటువంటి మీడియాలు లేవు." },
  // Donations / Welfare Ledger
  donationsTitle: {
    EN: "Financial Transparency & Welfare Ledger",
    TE: "సమర్పిత విరాళాల పారదర్శక లెడ్జర్"
  },
  lifetimeCounterLabel: {
    EN: "Lifetime Welfare Contributions Received",
    TE: "మొత్తం జీవితకాల ఆధ్యాత్మిక సేవలు & విరాళాల నిధి"
  },
  currentYearCounterLabel: {
    EN: "Active Cumulative Current Operational Year Tracker",
    TE: "ప్రస్తుత ఆర్థిక సంవత్సరంలో చేకూరిన విరాళాల నిధి"
  },
  ledgerDisclaimer: {
    EN: "Every rupee received goes directly into social food feeding (Annadanam), Gosala preservation, and Vedic school pathways. To maintain perfect privacy and storage health, individual ledger entries older than 365 days are compiled into the global lifetime counter nightly.",
    TE: "స్వీకరించిన ప్రతి పైసా అన్నదానానికి, గోసంరక్షణకు, వేద పాఠశాలల నిర్వహణకు ఖర్చు చేయబడుతుంది. డేటా నిల్వ భద్రతను దృష్టిలో ఉంచుకుని ఒకటిన్నర సంవత్సరం దాటిన వ్యక్తిగత వివరాలు డిలీట్ చేయబడి, మొత్తం విరాళాల ఖాతాలో కలపబడతాయి."
  },
  searchPlaceholder: {
    EN: "Search donor names or purpose...",
    TE: "భక్తుల పేరు లేదా సేవ రూపం ద్వారా శోధించండి..."
  },
  donorName: { EN: "Donor Name", TE: "దాత పేరు" },
  amount: { EN: "Amount", TE: "మొత్తం" },
  date: { EN: "Date", TE: "సమర్పించిన తేదీ" },
  purpose: { EN: "Devoted Purpose", TE: "సేవ/విరాళం ఉద్దేశం" },
  anonymous: { EN: "Anonymous Devotee", TE: "గుప్తదాత" },
  currencyINR: { EN: "₹", TE: "రూ. " },
  noDonors: { EN: "No donor records found matching your query.", TE: "విరాళాల రికార్డు ఏమీ లభ్యం కాలేదు." },
  viewPDFChart: { EN: "Download Trust Report PDF", TE: "ట్రస్ట్ వార్షిక రిపోర్టు పీడీఎఫ్" },
  // Committee Footer
  footerContactsTitle: {
    EN: "Executive Committee & Administration",
    TE: "ఆలయ కార్యనిర్వాహక కమిటీ డైరెక్టరీ"
  },
  designationPresident: { EN: "President / Chairman", TE: "చేర్మన్ / అధ్యక్షులు" },
  designationSecretary: { EN: "General Secretary", TE: "ప్రధాన కార్యదర్శి" },
  designationTreasurer: { EN: "Treasurer", TE: "కోశాధికారి" },
  designationAdvisor: { EN: "Chief Spiritual Advisor", TE: "ప్రధాన అర్చకులు / సలహాదారు" },
  addressLabel: { EN: "Temple Address:", TE: "ఆలయ చిరునామా:" },
  addressText: {
    EN: "Sri Umamaheswara Devasthanam (Shivalayam), Devotional Hill Complex, Sector 4, Hyderabad, Telangana - 500045, India",
    TE: "శ్రీ ఉమామహేశ్వర దేవస్థానం (శివాలయం), భక్తి గిరి సముదాయం, సెక్టార్ 4, హైదరాబాద్, తెలంగాణా - 500045, భారతదేశం"
  },
  phoneLabel: { EN: "Helpline Number:", TE: "హెల్ప్‌లైన్ నెంబరు:" },
  phoneText: { EN: "1800-425-6677", TE: "1800-425-6677" },
  emailLabel: { EN: "Official Email ID:", TE: "ఈమెయిల్ చిరునామా:" },
  emailText: { EN: "seva@umamaheswaradevasthanam.org", TE: "seva@umamaheswaradevasthanam.org" },
  // Admin panel UI
  adminTitle: { EN: "Supreme Administration Dashboard", TE: "ఆలయ పర్యవేక్షణ అడ్మిన్ డ్యాష్‌బోర్డ్" },
  logout: { EN: "Logout", TE: "నిష్క్రమించు" },
  password: { EN: "Enter Master Admin Passcode:", TE: "అడ్మిన్ మాస్టర్ పాస్‌కోడ్ నమోదు చేయండి:" },
  submit: { EN: "Unlock Dashboard", TE: "డేటా అన్‌లాక్ చేయి" },
  errorWrongPassword: { EN: "Invalid admin passcode! Secure system blocked access.", TE: "తప్పు పాస్‌కోడ్! ఆటోమేటిక్ సెక్యూరిటీ బ్లాక్ చేయబడింది." },
  addEvent: { EN: "Post Custom Event", TE: "కొత్త సేవ సమాచారం ప్రచురించు" },
  addGallery: { EN: "Add Gallery Media", TE: "కొత్త మీడియాను అప్‌లోడ్ చేయి" },
  addDonor: { EN: "Record New Trust Donation", TE: "కొత్త విరాళం నమోదు చేయి" },
  updateMarquee: { EN: "Revise Live Ticker Text", TE: "తాజా స్క్రోలింగ్ నివేదిక మార్చు" },
  activeLogs: { EN: "Midnight Schedulers & Audit Trail", TE: "సేఫ్ అర్ధరాత్రి జన్యు స్కెడ్యూలర్ రికార్డులు" },
  systemCleanBtn: { EN: "Simulate Midnight Database Janitor Now", TE: "రాజ్యాంగ పద్దతిలో డాటా క్లీనింగ్ సిమ్యులేట్ చేయి" },
  systemCleanSuccess: {
    EN: "Database cleaning finished successfully! Purged items older than 365 days. Values safely rolled over to lifetime counter.",
    TE: "డాటా క్లీనింగ్ విజయవంతమైంది! పాత దాతల డేటా జీవితకాల నిధికి విజయవంతంగా రోల్‌ఓవర్ చేయబడింది!"
  },
  imageLimitAlert: {
    EN: "Gallery contains 20 active images! To upload a new photo, you must delete an existing image first to preserve free hosting constraints.",
    TE: "చిత్రాల సంఖ్య గరిష్ట గీత (20) దాటింది! ఉచిత అప్‌లోడ్ నిబంధనల ప్రకారం ఏదైనా పాత చిత్రం డిలీట్ చేయండి."
  },
  imageUploadedSuccess: {
    EN: "Image Compressed to under 1MB & saved successfully!",
    TE: "చిత్రం విజయవంతంగా కుదించబడింది (<1MB) మరియు సేవ్ చేయబడింది!"
  },
  wrongSizeAlert: {
    EN: "Selected image is larger than 5MB code constraints! Upload request blocked instantly.",
    TE: "చిత్రం సైజు 5ఎంబీ (5MB) కన్నా ఎక్కువ ఉంది! సిస్టమ్ వెంటనే తిరస్కరించింది."
  }
};
