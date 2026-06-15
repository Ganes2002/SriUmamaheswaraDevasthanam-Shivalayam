-- =========================================================================
-- SRI UMAMAHESWARA DEVASTHANAM — COMPLETE SUPABASE SETUP + SEED
-- =========================================================================
-- Run this ONE TIME in Supabase SQL Editor to set up everything from scratch.
-- Safe to re-run — uses IF NOT EXISTS and ON CONFLICT DO UPDATE throughout.
--
-- HOW TO RUN:
--   1. Go to: https://supabase.com/dashboard/project/[your-project-id]
--   2. Left sidebar → "SQL Editor" → "+ New query"
--   3. Select ALL text (Ctrl+A), paste into editor, click "Run"
--   4. Wait for "Success" message — all tables, permissions, and seed data set.
-- =========================================================================


-- ═══════════════════════════════════════════════════════════════
-- PART A: CREATE ALL 9 TABLES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS announcements (
    id          VARCHAR(50) PRIMARY KEY,
    text_en     TEXT NOT NULL,
    text_te     TEXT NOT NULL,
    is_active   BOOLEAN DEFAULT TRUE,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id              VARCHAR(50) PRIMARY KEY,
    title_en        VARCHAR(255) NOT NULL,
    title_te        VARCHAR(255) NOT NULL,
    event_date      DATE NOT NULL,
    event_time      VARCHAR(100) NOT NULL,
    description_en  TEXT NOT NULL,
    description_te  TEXT NOT NULL,
    location_en     VARCHAR(255) NOT NULL,
    location_te     VARCHAR(255) NOT NULL,
    image_url       TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_assets (
    id          VARCHAR(50) PRIMARY KEY,
    media_type  VARCHAR(10) CHECK (media_type IN ('image', 'video')),
    title_en    VARCHAR(255) NOT NULL,
    title_te    VARCHAR(255) NOT NULL,
    media_url   TEXT NOT NULL,
    added_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donor_ledger (
    id           VARCHAR(50) PRIMARY KEY,
    name_en      VARCHAR(255) NOT NULL DEFAULT 'Anonymous Devotee',
    name_te      VARCHAR(255) NOT NULL DEFAULT 'గుప్తదాత',
    amount       DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL,
    purpose_en   VARCHAR(255) NOT NULL,
    purpose_te   VARCHAR(255) NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS committee_roster (
    id            VARCHAR(50) PRIMARY KEY,
    name_en       VARCHAR(255) NOT NULL,
    name_te       VARCHAR(255) NOT NULL,
    role_en       VARCHAR(255) NOT NULL,
    role_te       VARCHAR(255) NOT NULL,
    phone         VARCHAR(30) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    profile_image TEXT,
    passcode      VARCHAR(50) NOT NULL UNIQUE,
    username      VARCHAR(100) UNIQUE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS yearly_audits (
    fiscal_year      VARCHAR(4) PRIMARY KEY CHECK (fiscal_year BETWEEN '2000' AND '2050'),
    total_amount     DECIMAL(15,2) NOT NULL DEFAULT 0,
    achievement_en   TEXT NOT NULL,
    achievement_te   TEXT NOT NULL,
    last_audited_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS security_audit_logs (
    id           VARCHAR(50) PRIMARY KEY,
    timestamp    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    action_text  TEXT NOT NULL,
    log_category VARCHAR(20) CHECK (log_category IN ('cleaning', 'security', 'edit', 'gallery'))
);

CREATE TABLE IF NOT EXISTS temple_carousel_slides (
    id         INTEGER PRIMARY KEY CHECK (id BETWEEN 1 AND 5),
    name_en    VARCHAR(255) NOT NULL,
    name_te    VARCHAR(255) NOT NULL,
    image_url  TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS global_settings (
    key        VARCHAR(100) PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_events_date    ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_donors_date    ON donor_ledger(payment_date);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON security_audit_logs(timestamp);


-- ═══════════════════════════════════════════════════════════════
-- PART B: DISABLE ROW LEVEL SECURITY ON ALL TABLES
-- This app uses passcode auth at the app level — anon role needs full access.
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE announcements           DISABLE ROW LEVEL SECURITY;
ALTER TABLE events                  DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_assets          DISABLE ROW LEVEL SECURITY;
ALTER TABLE donor_ledger            DISABLE ROW LEVEL SECURITY;
ALTER TABLE committee_roster        DISABLE ROW LEVEL SECURITY;
ALTER TABLE yearly_audits           DISABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs     DISABLE ROW LEVEL SECURITY;
ALTER TABLE temple_carousel_slides  DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings         DISABLE ROW LEVEL SECURITY;


-- ═══════════════════════════════════════════════════════════════
-- PART C: GRANT POSTGRESQL PERMISSIONS TO THE ANON ROLE
-- CRITICAL: Disabling RLS alone is NOT enough.
-- Supabase has two separate access layers:
--   1. RLS policies     → disabled above
--   2. PostgreSQL GRANTs → this section grants the actual table-level access
-- Without these grants every query returns "permission denied for table X".
-- ═══════════════════════════════════════════════════════════════

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Ensures future tables created in this schema also get the same permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;


-- ═══════════════════════════════════════════════════════════════
-- PART D: SEED ALL DATA
-- ═══════════════════════════════════════════════════════════════

-- 1. Global Settings (temple emblem URL + lifetime counter)
INSERT INTO global_settings (key, value, updated_at) VALUES
('primary_temple_emblem', 'https://images.unsplash.com/photo-1600100397759-db2427a810f6?auto=format&fit=crop&q=80&w=600', NOW()),
('lifetime_counter',      '2852500', NOW())
ON CONFLICT (key) DO NOTHING;


-- 2. Announcement Ticker
INSERT INTO announcements (id, text_en, text_te, is_active, updated_at) VALUES (
    'ann-1',
    '⚠️ Note: Temple will close early at 7:00 PM on upcoming Friday due to Chandra Grahanam (Lunar Eclipse). Normal Darshan resumes next morning.',
    '⚠️ గమనిక: గ్రహణం కారణంగా వచ్చే శుక్రవారం సాయంత్రం 7:00 గంటలకే ఆలయం మూసివేయబడుతుంది. మరుసటి రోజు ఉదయం నుండి మామూలుగా దర్శనాలు లభిస్తాయి.',
    TRUE,
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    text_en    = EXCLUDED.text_en,
    text_te    = EXCLUDED.text_te,
    is_active  = EXCLUDED.is_active,
    updated_at = EXCLUDED.updated_at;


-- 3. Devotional Events
INSERT INTO events (id, title_en, title_te, event_date, event_time, description_en, description_te, location_en, location_te, image_url) VALUES
('evt-1', 'Maha Shivaratri Brahmotsavam', 'మహా శివరాత్రి బ్రహ్మోత్సవాలు', '2026-08-15', '4:00 AM - Midnight',
 'Continuous Rudrabhishekam, Kalyanam celebration and sacred Bilva Archana to Lord Maheswara.',
 'అర్చకుల సమక్షంలో నిరంతర ఏకాదశ రుద్రాభిషేకం, ఉమామహేశ్వర స్వామి దివ్య కల్యాణ మహోత్సవం మరియు బిల్వార్చన పారాయణములు.',
 'Main Sanctum Sanctorum', 'గర్భాలయం & ఆలయ ప్రాంగణం',
 'https://images.unsplash.com/photo-1609137144814-7ebd5b40cfeb?auto=format&fit=crop&q=80&w=600'),

('evt-2', 'Sravana Somavaram Annadanam Puja', 'శ్రావణ సోమవారం అన్నదాన సేవ', '2026-08-22', '11:30 AM - 3:00 PM',
 'Grand Annadanam (holy food distribution) serving over 2,000 devotees. Join us in sponsoring the sacred meal.',
 'రెండు వేల మందికి పైగా భక్తులకు పవిత్ర తీర్థప్రసాద అన్న ప్రసాద వితరణ (అన్నదానం). మనస్ఫూర్తిగా సహకరించండి.',
 'Annapurna Dining Hall', 'అన్నపూర్ణ ప్రసాద భవనం',
 'https://images.unsplash.com/photo-1541816267469-a35c24e3deb5?auto=format&fit=crop&q=80&w=600'),

('evt-3', 'Pradosham Special Bhasmabhishekam', 'ప్రదోష కాల ప్రత్యేక భస్మాభిషేకం', '2026-09-08', '5:00 PM - 7:30 PM',
 'Auspicious evening Puja with authentic Bhasmabhishekam for ultimate pure energy and relief from planetary doshas.',
 'క్రాంతి ప్రదోష కాలంలో ఉమామహేశ్వరుల అనుగ్రహం కొరకు విశేష భస్మాభిషేకం మరియు పల్లకి సేవ.',
 'Shiva Linga Mantapam', 'శివలింగ మంటపం',
 'https://images.unsplash.com/photo-1608976328267-e6730f70067a?auto=format&fit=crop&q=80&w=600')
ON CONFLICT (id) DO UPDATE SET
    title_en = EXCLUDED.title_en, title_te = EXCLUDED.title_te,
    event_date = EXCLUDED.event_date, event_time = EXCLUDED.event_time,
    description_en = EXCLUDED.description_en, description_te = EXCLUDED.description_te,
    location_en = EXCLUDED.location_en, location_te = EXCLUDED.location_te,
    image_url = EXCLUDED.image_url;


-- 4. Gallery (images + YouTube videos)
INSERT INTO gallery_assets (id, media_type, title_en, title_te, media_url, added_at) VALUES
('gal-1', 'image', 'Beautifully Adorned Temple Shiva Lingam',          'మహాలింగ అలంకారం - శ్రీ ఉమామహేశ్వర ఆలయం',
 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=600', NOW()),
('gal-2', 'image', 'Temple Main Entrance Gopuram & Flagmast',           'ప్రధాన గోపురం మరియు ధ్వజస్తంభం',
 'https://images.unsplash.com/photo-1600100397759-db2427a810f6?auto=format&fit=crop&q=80&w=600', NOW()),
('gal-3', 'image', 'Traditional Sacred Ritual Fire (Homa Kundam)',      'దేవస్థాన శాంతి కల్యాణ హోమ గుండము',
 'https://images.unsplash.com/photo-1618090584126-129cd84357ae?auto=format&fit=crop&q=80&w=600', NOW()),
('gal-4', 'video', 'Official Evening Aarti & Sanskrit Stotram Chants',  'సాయంత్రం హారతి మరియు సంస్కృత మంత్రోచ్ఛారణలు',
 'https://www.youtube.com/watch?v=co7Pn6mPqNo', NOW()),
('gal-5', 'video', 'Special Deepotsavam Festival Drone View',           'కార్తీక దీపోత్సవం - దేవస్థానం డ్రోన్ వీడియో',
 'https://www.youtube.com/watch?v=0h68rO_O1Sg', NOW()),
('gal-6', 'image', 'Devotees Performing Sacred Pradakshina',            'ఆలయంలో ప్రదక్షిణలు చేస్తున్న భక్తులు',
 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&q=80&w=600', NOW())
ON CONFLICT (id) DO UPDATE SET
    media_type = EXCLUDED.media_type, title_en = EXCLUDED.title_en, title_te = EXCLUDED.title_te,
    media_url = EXCLUDED.media_url, added_at = EXCLUDED.added_at;


-- 5. Donor Ledger (2025–2026 only — app shows last 2 years publicly)
INSERT INTO donor_ledger (id, name_en, name_te, amount, payment_date, purpose_en, purpose_te, is_anonymous) VALUES
('don-1', 'Gaddipati Janardhan Rao & Family', 'గద్దిపాటి జనార్దన్ రావు & కుటుంబం', 151116.00, '2026-05-01', 'Sri Uma Maheswara Deity Golden Crown Project',    'శ్రీ ఉమామహేశ్వర స్వామి స్వర్ణ కిరీట సేవ',        FALSE),
('don-2', 'Karamchedu Srilatha',               'కారంచేడు శ్రీలత',                     51000.00,  '2026-05-10', 'Permanent Annadanam Trust Contribution',           'శాశ్వత అన్నదాన నిధి సమర్పణ',                    FALSE),
('don-3', 'Anonymous Devotee',                  'గుప్తదాత',                             25000.00,  '2026-05-14', 'Vedic Gurukul School Maintenance Support',         'వేద పాఠశాల నిర్వహణ సహాయం',                      TRUE),
('don-4', 'Pervela Mallikarjuna Sastry',        'పేర్వేల మల్లికార్జున శాస్త్రి',       11116.00,  '2026-05-18', 'Special Rudrabhishekam Sponsorship',               'ప్రత్యేక రుద్రాభిషేక సేవ',                       FALSE),
('don-5', 'Nidumolu Srinadh & Brothers',        'నిడుమోలు శ్రీనాధ్ & సోదరులు',         100000.00, '2026-05-20', 'Gosala Cow Care & Veterinary Welfare Fund',        'గోశాల ఆవుల మేత & వైద్య అవసరాల నిధి',            FALSE),
('don-6', 'Anonymous Devotee',                  'గుప్తదాత',                             10000.00,  '2026-05-22', 'Deepotsavam Oil and Brass Lamps Donation',         'దీపోత్సవం కొరకు నూనె & దీపారాధన సామాగ్రి',     TRUE),
('don-7', 'Yellapragada Venkateswarulu',         'యల్లాప్రగడ వెంకటేశ్వర్లు',            25000.00,  '2026-05-25', 'Nitya Archana Seva Trust',                         'నిత్య అర్చన సేవ ట్రస్ట్',                       FALSE),
('don-8', 'Dr. Sandeep Kumar',                  'డా. సందీప్ కుమార్',                    50000.00,  '2026-05-28', 'Devasthanam Free Medical Camp Pharmacy Sponsor',   'దేవస్థానం ఉచిత వైద్య శిబిరం ఔషధాల నిధి',       FALSE),
('don-9', 'Mandadi Laxmi Devi',                 'మందాడి లక్ష్మి దేవి',                  75000.00,  '2026-05-30', 'Temple Entry Path Solar Lights',                   'ఆలయ దారి సోలార్ దీపాల నిధి',                   FALSE),
('don-h1','Smt. G. Sarada Devi',                'శ్రీమతి జి. శారదా దేవి',               50050.00,  '2025-10-12', 'Temple Front Chandelier Lamps Sponsor',            'ఆలయ ప్రాంగణ విద్యుత్ దీపాల సేవ',               FALSE)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en, name_te = EXCLUDED.name_te, amount = EXCLUDED.amount,
    payment_date = EXCLUDED.payment_date, purpose_en = EXCLUDED.purpose_en,
    purpose_te = EXCLUDED.purpose_te, is_anonymous = EXCLUDED.is_anonymous;


-- 6. Committee Members & Admin Credentials
INSERT INTO committee_roster (id, name_en, name_te, role_en, role_te, phone, email, profile_image, passcode, username) VALUES
('mem-1', 'Siddhanthi Sri Somshekara Sastry', 'సిద్ధాంతి శ్రీ సోమశేఖర శాస్త్రి',
 'Chief Priest & Spiritual Advisor', 'ప్రధాన అర్చకులు',
 '+91 94405 11223', 'shastri@umamaheswaradevasthanam.org',
 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
 'DEV1008', 'shastri'),
('mem-2', 'Dr. K. Radhakrishna Murthy', 'డా. కె. రాధాకృష్ణ మూర్తి',
 'Temple Committee President / Chairman', 'ఆలయ కమిటీ అధ్యక్షులు',
 '+91 98480 34567', 'president@umamaheswaradevasthanam.org',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
 'PRES1008', 'president'),
('mem-3', 'Sri S. V. Mallikarjuna Rao', 'శ్రీ ఎస్. వి. మల్లికార్జున రావు',
 'General Secretary', 'ప్రధాన కార్యదర్శి',
 '+91 99630 88990', 'secretary@umamaheswaradevasthanam.org',
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
 'SECY567', 'secretary'),
('mem-4', 'Smt. T. Uma Maheswari', 'శ్రీమతి టి. ఉమా మహేశ్వరి',
 'Treasurer & Financial Auditor', 'కోశాధికారి & ఆర్థిక తనిఖీదారు',
 '+91 73820 54321', 'treasury@umamaheswaradevasthanam.org',
 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
 'TEMP123', 'treasurer'),
('mem-5', 'Sri B. Ranganath', 'శ్రీ బి. రంగనాథ్',
 'Welfare & Logistics Coordinator', 'సామాజిక సేవ మరియు నిర్వహణ సమన్వయకర్త',
 '+91 91770 12345', 'seva@umamaheswaradevasthanam.org',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
 'SEVA789', 'seva')
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en, name_te = EXCLUDED.name_te,
    role_en = EXCLUDED.role_en, role_te = EXCLUDED.role_te,
    phone = EXCLUDED.phone, email = EXCLUDED.email,
    profile_image = EXCLUDED.profile_image, passcode = EXCLUDED.passcode, username = EXCLUDED.username;


-- 7. Yearly Financial Audits (2020–2026)
INSERT INTO yearly_audits (fiscal_year, total_amount, achievement_en, achievement_te) VALUES
('2026', 685420.00, 'Current operational year. Covers active building maintenance, Vedic wages, and daily feeding programs.',               'ప్రస్తుత సంవత్సరపు పారదర్శక రికార్డు. నిత్య అలంకరణలకు, వేద పాఠశాలల వేతనాలకు మరియు సేవా కార్యక్రమాల నిర్వహణ కొరకు.'),
('2025', 720000.00, 'Completed inner temple wall stone engravings and Gopuram pristine renovation work.',                                   'ఆలయ లోపలి ప్రాంగణ రాతి శిల్ప కళాకృతులు మరియు ప్రధాన గోపుర పునర్నిర్మాణ పనులు పూర్తయ్యాయి.'),
('2024', 680000.00, 'Initiated permanent daily free food distribution (Annadanam Trust) facility expansion.',                               'నిత్యాన్నదాన పథకం (అన్నదానం ట్రస్ట్) భవన విస్తరణ కార్యక్రమానికి నాంది.'),
('2023', 615000.00, 'Acquired modern high-grade brass Puja utensils and upgraded community gathering mantapam.',                            'ఆలయ అవసరాల కొరకు కంచు పూజా సామాగ్రి కొనుగోలు మరియు సామాజిక మంటప ఆధునీకరణ.'),
('2022', 540000.00, 'Constructed the Vedic library and installed solar pathway lights throughout the temple premises.',                     'ఆధ్యాత్మిక వేద గ్రంథాలయం నిర్మాణం మరియు ఆలయ పరిసరాలలో సోలార్ దీపాల అమరిక.'),
('2021', 480000.00, 'Constructed Gosala shelter extensions and funded rural free healthcare camps.',                                         'గోశాల షెడ్ల కొత్త విస్తరణ మరియు గ్రామీణ ఉచిత వైద్య శిబిరాల నిర్వహణ.'),
('2020', 350000.00, 'Established the main sanctum silver archways and the grand entrance gate.',                                            'గర్భాలయ వెండి తోరణాల అమరిక మరియు రజత ప్రధాన సింహద్వార సేవ.')
ON CONFLICT (fiscal_year) DO UPDATE SET
    total_amount   = EXCLUDED.total_amount,
    achievement_en = EXCLUDED.achievement_en,
    achievement_te = EXCLUDED.achievement_te;


-- 8. Hero Carousel Slides (exactly 5 slots)
INSERT INTO temple_carousel_slides (id, name_en, name_te, image_url) VALUES
(1, 'Majestic Gopuram Vimana',    'దివ్య రాజగోపురం దర్బార్',   'https://images.unsplash.com/photo-1600100397759-db2427a810f6?auto=format&fit=crop&q=80&w=400'),
(2, 'Adorned Holy Shiva Lingam',  'దివ్య మంగళాకార లింగం',      'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=400'),
(3, 'Lord Ganesha Vigneshwara',   'శ్రీ విఘ్నేశ్వర ప్రసాదం',  'https://images.unsplash.com/photo-1609137144814-7ebd5b40cfeb?auto=format&fit=crop&q=80&w=400'),
(4, 'Sacred Brass Aarti Bell',    'గర్భాలయ ఘంటా రావము',        'https://images.unsplash.com/photo-1608976328267-e6730f70067a?auto=format&fit=crop&q=80&w=400'),
(5, 'Vedic Fire Homa Kundam',     'దేవస్థాన హోమ గుండము',       'https://images.unsplash.com/photo-1618090584126-129cd84357ae?auto=format&fit=crop&q=80&w=400')
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en, name_te = EXCLUDED.name_te, image_url = EXCLUDED.image_url;


-- 9. Seed initial audit log entry
INSERT INTO security_audit_logs (id, timestamp, action_text, log_category) VALUES
('log-setup-1', NOW(), 'Database initialized via supabase_complete_setup.sql — all 9 tables created and seeded.', 'cleaning')
ON CONFLICT (id) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- PART E: VERIFY SETUP (run these SELECT queries separately)
-- ═══════════════════════════════════════════════════════════════
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
-- -- Expected: rowsecurity = false for all 9 tables
--
-- SELECT COUNT(*) FROM committee_roster;   -- Expected: 5
-- SELECT COUNT(*) FROM events;             -- Expected: 3
-- SELECT COUNT(*) FROM gallery_assets;     -- Expected: 6
-- SELECT COUNT(*) FROM donor_ledger;       -- Expected: 10
-- SELECT COUNT(*) FROM yearly_audits;      -- Expected: 7
-- SELECT * FROM global_settings;           -- Expected: 2 rows
-- =========================================================================
-- END OF COMPLETE SETUP SCRIPT
-- =========================================================================
