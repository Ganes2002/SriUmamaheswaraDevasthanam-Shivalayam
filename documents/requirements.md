# Functional Requirement Document (FRD) — Final Production Blueprint
**Project Name**: Sri Umamaheswara Devasthanam Web Portal

**Architecture**: Single Page Application (SPA) with integrated secure modular Admin Dashboard
**Cost Target**: ₹0 / $0 USD Lifetime Deployment (Excluding personal Custom Domain choice)

---

## 1. Technical Architecture & Tech Stack

```
[ Frontend: React / Vite SPA ] -------------> Hosted on -----> [ Cloud Run Container / Vercel ] (Free Tier)
          |
          v (Secure Client-Side / State Synchronization via LocalStorage API)
[ Multi-Device Persistence Engine ] -----------> Hosted on -----> [ Web Storage System ] (Persistent LocalState)
          |
          +---> [ Gallery Asset Stream ] ------> Max 1MB compressed base64 / Image (Client Compressor)
          |                                      Max 5MB Original File Size Guard (Strict Frontend Interceptor)
          |                                      Max 20 Total Active Images (Cap Limit Exhaustion Block)
          |
          +---> [ Database Records ] ----------> Auto-Purged records & rollover calculations > 365 days
```

* **Frontend Framework**: ReactJS utilizing functional components, custom hooks, and standard Vite structure for hot loading and optimized rendering.
* **Styling Engine**: Tailwind CSS utility classes with native responsive layout prefixes (`sm:`, `md:`, `lg:`, `xl:`) for pixel-perfect adaptivity across all mobile phone browsers, tablets, and wide monitors.
* **Database & Persistence**: LocalStorage persistence engine with automatic database seeds, state synchronization, and clean transaction logs stored under the `um_dev_*` namespace keys.
* **Media Handling**: Client-side Canvas Image Compressor transforming uploaded images to base64 formats under 1MB; YouTube video stream integrations for zero-byte server bandwidth consumption.

---

## 2. User Roles & Access Control

### 2.1 Public Viewers (Devotees)
* **100% Open Access**: Zero-gate policy for public pages. Device-rendered instantly.
* **View-Only Capabilities**: Capable of reading the real-time Telugu Panchangam elements, upcoming holy schedules, live scrolling marquee alerts, video stream playback, and scrolling the Welfare transparent Ledger.
* **Social Sharing**: Interactive WhatsApp share integration to forward festival flyers to custom family networks.

### 2.2 Admin Users (Authorized Temple Committee Members)
* **Unified Navbar Login Access**: Accessible exclusively through the top Navigation Bar (`NavBar.tsx`). The persistent floating login button at the bottom-right has been removed to preserve negative workspace margins and high elegant visuals.
* **Case-Insensitive Multi-Member Passcode Gate**: A secure entrance block matched with flexible case-insensitive checks. Users can input standard master passcodes or custom registered keys. Official default operator credentials:
  * **DEV1008**: Siddhanthi Sri Somshekara Sastry (*Chief Priest & Spiritual Advisor*)
  * **PRES1008**: Dr. K. Radhakrishna Murthy (*Temple Committee President / Chairman*)
  * **SECY567**: Sri S. V. Mallikarjuna Rao (*General Secretary*)
  * **TEMP123**: Smt. T. Uma Maheswari (*Treasurer & Financial Auditor*)
* **Operator Session Context Ribbon**: When logged in, the dashboard dynamically welcomes the operator by displaying their avatar profile picture, official human name, title, and current active session key.

---

## 3. Core Single-Page Section Requirements

### 3.1 Navigation Bar & Global Utilities
* **Sticky Navigation Header**: High-contrast header enabling anchor scroll navigation: Home | About | Calendar | Events | Gallery | Donations | Contact.
* **Bilingual Script Toggle**: Static high-contrast button allowing users to shift the complete user interface text between English (`EN`) and Telugu (`TE`) instantly.
* **"Today's Special Announcement" Scrolling Marquee**: An amber scrolling banner pinned directly below the navbar to relay dynamic festival notifications, edited instantly by admins via the dashboard.

### 3.2 Section 1: Home & Hero Welcoming Screen
* **Wide-Screen Fitting Slider Carousel**: A massive screen-fitting rectangular slideshow (not rounded, matching responsive heights) displaying exactly up to five high-quality, auto-compressed devotional images from the `um_dev_temple_emblem_library` database array.
* **Simplified Presentation & Transitions**: Image transitions occur seamlessly every 5 seconds, or manual overrides can be triggered via high-contrast left/right Chevron buttons and navigation dots at the bottom. No corner index numbers (such as "1/5", "2/5") are displayed to ensure a pristine devotional overview.
* **Bilingual Display Labels**: Display captions and title tags adapt instantly to the active language configuration (`EN`/`TE`).
* **Devotional Welcome Copy**: Displays simplified greetings and CTA buttons with clean font settings and balanced white space gaps.

### 3.3 Section 2: About & Tap-to-Navigate Maps
* Tells the history and divine origin of the Sri Umamaheswara Devasthanam.
* **Tap-to-Navigate Maps Shortcut**: A native button directing mobile triggers straight to Google Maps or Apple Maps apps with pre-loaded coordinates. Saves rendering weight and keeps database operations completely zero-cost.

### 3.4 Section 3: Automated "Auspicious Time" Calculator (Telugu Panchangam)
* Calculates and displays South Indian Telugu Panchangam elements (*Tithi*, *Nakshatram*, *Rahu Kalam*, *Yamagandam*, *Gulika*) computed entirely client-side on the devotee’s browser using custom coordinate math formulas.
* **Fail-Safe Structural Fallback**: If mathematical calculator failures occur, the script automatically hides the calculator boxes gracefully and displays a link button to open the today's official static Panchangam timing chart document instead.

### 3.5 Section 4: Upcoming Events & Pujas (With WhatsApp Integration)
* Displays custom event cards consisting of scheduled temple festivals, timings, and venues.
* **WhatsApp Integration**: Includes a formatted WhatsApp share button on every event card that compiles a beautiful pre-filled template text (*"You are cordially invited to join us for the auspicious Maha Abhishekam..."*) to broadcast to custom grouping contacts in one click.

### 3.6 Section 5: Dynamic Media Gallery & Video Stream Rules
* Grid layout displaying visual temple gallery assets.
* **Strict Image Caps**: Limits total active gallery images to a maximum of **20 active images**. If the cap is reached, the dashboard blocks new image additions and mandates deleting an older asset first.
* **Zero-Cost Streaming Architecture**: No raw `.mp4` file uploads are accepted on the server to prevent bandwidth drainage. Playback streams are connected exclusively using shared YouTube URL links.

### 3.7 Section 6: Financial Transparency & Welfare Ledger
* **Welfare Ledger Grid**: Displays verifiable ledger entries of public cash contributions.
* **Total Cumulative Welfare Counter**: Tracks long-term lifetime collections to verify public trust.
* **Current-Year Rolling Tracker**: Puts a highlight spotlight specifically on resources received during the ongoing active calendar year (2026).
* **The 1-Year Financial Registry Security Guard**: Public grid lists of individual donors are restricted to display records **only for the current year (2026) and exactly one previous prior year (2025)**. Records older than 2025 are securely archived internally, satisfying security preservation rules.

### 3.8 Section 7: Footer & Committee Directory
* Physical coordinates, addresses, and a dynamic committee directory. The directory prints mobile numbers, roles, and profile pictures mapped directly from database rosters.

---

## 4. Decoupled Modular Admin Dashboard Architecture

To enable high performance, readability, and avoid code file bloat, all administrative features are organized into isolated single-responsibility modules inside `/src/components/admin/`:

1. **`AdminAnnouncementForm`**: Updates the dynamic scrolling marquee ticker across English & Telugu.
2. **`AdminDonationForm`**: Appends active cash ledger reports and tallies their values back into the active current-year collection counter instantly.
3. **`AdminYearlyAuditForm`**: Enables auditing yearly totals and milestones. Generates a strict custom selector listing all years ranging from **2000 to 2050** inclusive.
4. **`AdminGalleryManager`**: Intercepts local photo uploads, runs size-constraint checks, converts inputs to compressed base64 elements, hosts YouTube feeds, and displays an image preview prior to executing deletions.
5. **`AdminEventsManager`**: Posts or deletes upcoming devotional temple schedules.
6. **`AdminCommitteeManager`**: Dynamically registers committee contact details, email addresses, and admin passcodes. Includes safety guards blocks preventing an operator from executing account deletions on their own active login profile.
7. **`AdminLogsViewer`**: Renders verified admin system audit actions.
8. **`AdminTempleEmblemForm`**: Empowers committee members with the capability to manage, add, replace, or delete the 5 slideshow carousel images stored in local storage database. Supports full file drag-and-drop, base64 optimization, and dual-language description editing.

---

## 5. Automated Data Cleaning Schedulers (Backend Simulation)

The platform incorporates automatic cleanup sweeps simulating scheduled cron operations to retain a permanent light, clean local storage footprint:

* **Event data janitor**: Deletes festival cards whose dates are older than 365 days.
* **Donor details janitor**: Daily records checker that isolates individual public listing lines older than 365 days and archives them.
* **Cumulative Preservation Logic**: Before dropping individual list items, the script transfers the numerical transaction sum into the global cumulative *Lifetime Counter* pool to ensure historical math totals remain precise and mathematically unbroken.
* **Admin Activity History Tracker**: Registers action histories securely and deletes audit trace lines older than 30 days to maximize browser memory health.

---
*The above blueprint is verified, compiled, and actively deployed inside the application structure.*

---

## 6. Recent Production Revisions & Optimizations (June 2026)

### 6.1 Default Language Sequence Override
* **Status**: Deployed.
* **Update**: Modified the default state loading order to prioritize the regional **Telugu (TE)** interface language upon initial load instead of English (EN). This ensures optimal integration for local communities, allowing them to explicitly toggle English should they wish to.

### 6.2 Desktop Navigation & Toolbar Overlapping Fix
* **Status**: Deployed.
* **Update**: Resolved header element crowding issues on standard desktops (1024px to 1280px widths). Styled links and action tags as `whitespace-nowrap` layout elements, pushed the language switcher and admin access button sets with explicit flex `ml-auto` rules, and transitioned high-density breakpoints dynamically to full-drawer mobile menus below `xl` scales (1280px).

### 6.3 Sacred Tagline Contrast Enhancement
* **Status**: Deployed.
* **Update**: Elevated readability of the main devotional tagline *"Union of Cosmic Power & Divine Grace"* inside the Hero Section banner. Transitioned from the low-contrast transparent yellow (`text-amber-300/60` at 11px) to a solid, high-contrast, bold golden typography (`text-amber-300` at 12px-14px) separated elegantly by a customized top separator line (`border-amber-400/20`).

### 6.4 Dynamic Temple Emblem & Sacred Logo Manager
* **Status**: Deployed.
* **Update**: Implemented a customizable primary Temple Emblem component prominently mounted at the center of the welcome Hero Section. Fully updated the admin dashboard with an intuitive drag-and-drop file uploader (featuring automated canvas compression to prevent database space bloating), pasted URL helper, and multi-preset selectors for pristine celestial icons. This ensures immediate recognition for non-fluent or village devotees upon initial landing.

### 6.5 Strictly Enforced 5-Slot Emblem Library & Enlarged Celestial Logo
* **Status**: Deployed.
* **Update**: Restructured database schemas and uploader workflows to strictly enforce a static 5-slot library boundary limit, protecting against storage space issues by avoiding the accumulation of stale base64 metadata. Redesigned the main welcome logo, enlarging its diameter by nearly 2x (up to `w-56 h-56` on desktop/tablet) and wrapping it with elegant, pulsing golden auras. Simplified layout presentation by removing the unrequested click-zoom triggers, devotional "darshan" buttons, and the timing card in accordance with constructive user specifications, leaving a pristine and highly focused corporate aesthetic. Added global horizontal layout bounders (`overflow-x-hidden`) to guarantee mobile viewport stability and absolute zero vertical-axis shaking.

### 6.6 Full-Screen Fitting Slider Carousel & Dynamic Editing
* **Status**: Deployed.
* **Update**: Overhauled the static welcome emblem layout with a massive, screen-fitting rectangular slideshow (designed with precise aspect ratios, non-rounded edges, and sleek aesthetic borders) matching standard slider templates on top devotion portfolios. Added automated slide rotation every 5 seconds, custom manual pagination buttons (left/right Chevrons and responsive tracking nodes), and high-contrast text caption cards describing the active Alankara image. Erased all numbers/count indicators (e.g., "1/5", "2/5") to retain an absolute clean layout.
* **Administrative Sync & Deletion Capability**: Fully integrated the `AdminTempleEmblemForm` carousel library module. Authorized committee members can instantly replace existing slots (via dragging/dropping or direct pasting), add new customized cards, or delete unnecessary assets while strictly guarding the 5-image total queue limit in the local database, guaranteeing all visual changes instantly propagate cleanly to physical devotees.

### 6.7 Dual Profile Photo Options & Shiva Denomination Accentuation
* **Status**: Deployed.
* **Update**: Added a flexible, high-fidelity profile photo selector in `AdminCommitteeManager`. Committee operators can now instantly choose between **Option A (direct file upload)** with automated, super-light Canvas base64 JPEG compression in the user's browser, or **Option B (pasting direct web image URLs)**. This ensures that custom physical committee headshots can be added on any device with zero setup overhead.
* **Title Clarification**: Appended `(Shivalayam)` and `(శివాలయం)` to all English and Telugu translations representing the temple's official title (yielding *"Sri Umamaheswara Devasthanam (Shivalayam)"* / *"శ్రీ ఉమామహేశ్వర దేవస్థానం (శివాలయం)"*), ensuring immediate recognition as a temple of Lord Shiva.

### 6.8 Purity of Donor Registry and Emoji Decandescence
* **Status**: Deployed.
* **Update**: Refined the visual representation of anonymous and private donor records by removing the unrequested lock/shusheer (`🤫`) emoji prefix from the name column in the ledger section, ensuring a highly respectful, pristine, and clean presentation in accordance with the corporate devotional layout standards.

### 6.9 Supabase/PostgreSQL Dual-Language Seeding Script
* **Status**: Deployed.
* **Update**: Created the SQL seeding file `/documents/database_seed.sql` populated with actual live default application records (including bilingual announcements, temple events, deities gallery links, donor ledger logs, committee roster passcodes, yearly stats, and carousel image slides). Ready for instant cloud migration to Supabase/PostgreSQL.

### 6.10 Intelligent Floating Speed-Dial Navigation Page Jump
* **Status**: Deployed.
* **Update**: Created a fully responsive, interactive floating speed-dial section quick-navigator (`QuickNavigator`), specially optimized to prevent scroll fatigue on mobile browsers. Pinned elegant gold-rimmed icons and bilingual labels (`ప్రధాన పేజీ`, `ఆలయ విశిష్టత`, etc.) inside a collapsible drawer. Now perpetually available at all scroll positions (including the page absolute top) for immediate zero-effort jump actions. Uses intelligent top offsets to perfectly align with sticky header layers.

### 6.11 Unified Sticky Composite Header Stack and Direct Admin Visibility
* **Status**: Deployed.
* **Update**: Grouped the Spiritual Chant Ribbon, the branding logo with devotee portal titles, and the scrolling flash updates announcement marquee into a single static/fixed sticky container. Refactored the header navigation into a highly responsive toolbar visible on computers, laptops, tablets, and mobiles. Standardized laptop size breakpoints (now $\ge 1024px$ default desktop) and made the critical "Admin" login toggle directly accessible on standard desktop width without layout compromises.

### 6.12 Restored Clean Desktop/Mobile Action Button Aesthetics
* **Status**: Deployed.
* **Update**: Restored the original high-contrast gold/red desktop/tablet and clean mobile actions layout to keep the navbar aesthetically pristine. On screens larger than tablet (`lg:` break limit), the header utilizes the roomy inline bilingual language switcher badge and bordered Admin credentials login buttons. On mobile viewports under 1024px, the header features a clean circular language translation shortcut alongside the primary navigation menu drawer, preserving maximum negative space and preventing screen crowd on small device viewports.

### 6.13 Robust Scroll Sticky Positioning Fix via overflow-x: clip
* **Status**: Deployed.
* **Update**: Replaced legacy `overflow-x: hidden` with modern browser-safe `overflow-x: clip` in root CSS layouts. This prevents horizontal margins shift on iOS and other touch devices while keeping the composite sticky headers (Chant Ribbon, Branding Navbar, and Flash Announcement Ticker) perfectly static/fixed on screen during active scroll navigation.

### 6.14 Surgical Hover Precision for Floating Jump Speed-dial
* **Status**: Deployed.
* **Update**: Refined hover area activation for the floating speed-dial component. The quick jump options drawer now expands *only* when the cursor is directly positioned over the floating launcher button, completely eliminating accidental activations from empty margins and blank layout corners.



