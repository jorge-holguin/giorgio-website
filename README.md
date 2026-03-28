# Jorge Holguin - Portfolio Website

A premium personal portfolio website featuring a unique **Tactical Mode** with interactive 3D environment, bilingual support (ES/EN), and real-time YouTube integration.

**Live Demo:** [https://jorgeholguin.dev](https://jorgeholguin.dev) *(update with your URL)*

---

## Features

### Main Portfolio
- **Hero Section**: Animated introduction with role cycling and cyber-terminal aesthetic
- **About**: Professional summary with key highlights and stats
- **Experience**: Timeline of professional roles (HJATCH/MINSA, Congress of Peru, Freelance)
- **Projects/Case Files**: GitHub repository showcase with filtering
- **Tech Stack**: Categorized skills with visual indicators
- **Content/El Hub de Giorgio**: YouTube channel integration with real video thumbnails
- **Contact**: Functional contact form with social links and CV download

### Tactical Mode (Interactive 3D Experience)
An immersive cyber-tactical briefing room built with Three.js:

- **3D Environment**: Navigate a room with interactive target pillars
- **First-Person Shooter Mechanics**: 
  - Crosshair follows mouse cursor
  - WASD movement
  - Click to shoot with muzzle flash and bullet physics
  - Shooting sound effects (Web Audio API)
  - Bullets aligned with crosshair position
- **Interactive Targets**: 5 hotspots (About, Projects, Tech Stack, Content, Contact)
- **Dual Interface**:
  - **Desktop**: 3D room with mouse look and shooting
  - **Mobile**: Swipe carousel with tactical panels
- **Boot Sequence**: Animated startup with system messages
- **Language Toggle**: ES/EN switcher even in tactical mode

### Internationalization (i18n)
Full bilingual support:
- **Spanish** and **English** translations
- Language toggle in header and tactical mode
- All sections, forms, and tactical interfaces translated

### Integrations
- **YouTube API**: Real-time video fetching from "El Hub de Giorgio" channel
- **GitHub API**: Repository data with caching
- **Contact Form**: Ready for Supabase integration

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Custom CSS variables |
| **3D Graphics** | Three.js (raw), @react-three/fiber |
| **Animations** | Framer Motion |
| **State** | React hooks, useRef for game state |
| **Database** | Supabase (client included) |
| **APIs** | YouTube Data API v3, GitHub API |
| **Icons** | Lucide React |
| **Theme** | next-themes (dark mode always in tactical) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- YouTube API key (for video integration)

### Installation

```bash
# Clone repository
git clone https://github.com/jorge-holguin/personal-website.git
cd personal-website

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
# Supabase (optional - for contact form)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# YouTube API (required for video integration)
NEXT_PUBLIC_YOUTUBE_API_KEY=your-youtube-api-key
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=your-channel-id

# GitHub (optional - for repo showcase)
GITHUB_TOKEN=your-github-token
```

---

## Project Structure

```
src/
├── app/
│   ├── globals.css              # Global styles + Tailwind
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Main portfolio page
│   └── tactical/
│       └── page.tsx             # Tactical mode with 3D room
├── components/
│   ├── sections/                # Main portfolio sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── TechStack.tsx
│   │   ├── Content.tsx         # YouTube integration
│   │   └── Contact.tsx         # Contact form
│   ├── tactical/               # Tactical mode components
│   │   ├── TacticalRoom.tsx    # Three.js 3D room (main)
│   │   ├── TacticalDesktop.tsx # Desktop overlay panels
│   │   ├── TacticalMobile.tsx  # Mobile carousel view
│   │   ├── TacticalPanelOverlay.tsx # Info panels
│   │   └── TacticalDesktopOverlay.tsx # Desktop variant
│   └── ui/                     # Reusable components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Header.tsx          # With language toggle
│       ├── Footer.tsx
│       └── SectionHeading.tsx
├── context/
│   ├── LanguageContext.tsx     # i18n provider
│   └── ThemeContext.tsx        # Dark/light mode
├── hooks/
│   ├── useYouTubeVideos.ts     # YouTube API hook
│   └── useGitHubRepos.ts       # GitHub API hook
├── services/
│   ├── youtube.service.ts      # YouTube API service
│   ├── youtube-cache.service.ts # Supabase caching
│   └── github.service.ts       # GitHub API service
├── lib/
│   ├── i18n/
│   │   └── translations.ts     # ES/EN translations
│   └── utils.ts
└── data/
    └── mock-data.ts            # Fallback data
```

---

## Tactical Mode Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| **Move** | WASD | N/A (auto-navigate) |
| **Look** | Mouse | Swipe |
| **Shoot/Select** | Click | Tap target |
| **Open Panel** | Click target | Tap target |
| **Change Language** | Top toggle | Top toggle |
| **Exit** | Top-left button | Top-left button |

---

## Design System

### Colors
- **void**: #0a0a0b (near-black background)
- **cyber-green**: #4ade80 (primary accent)
- **tactical-amber**: #f59e0b (secondary accent)
- **alert-red**: #ef4444 (tertiary accent)

### Typography
- **Display**: Orbitron (headings, tactical UI)
- **Sans**: Inter (body text)
- **Mono**: JetBrains Mono (code, terminal, HUD)

### Key Features
- Glass morphism panels with backdrop blur
- HUD corner decorations with animated scan lines
- Custom clip-path buttons
- Terminal-style typography in tactical mode

---

## Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

### Platforms
Compatible with:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages** (with static export config)

### Environment Setup for Production
1. Add environment variables in your hosting platform
2. Ensure YouTube API key has quota for production traffic
3. Configure Supabase RLS policies if using database features

---

## Key Implementation Details

### Three.js Tactical Room
- Raw Three.js implementation (no React wrappers for performance)
- Raycaster-based target detection from crosshair position
- Bullet physics aligned with mouse raycast direction
- Efficient cleanup on unmount to prevent memory leaks

### YouTube Integration
- Two-tier caching: In-memory (15min) + Supabase (1hour)
- Graceful fallbacks if API is unavailable
- Real thumbnails and video metadata

### Performance Optimizations
- Lazy loading for tactical mode component
- Dynamic imports with `ssr: false` for Three.js
- Image optimization with lazy loading
- CSS-based animations where possible

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support in main site
- Reduced motion preferences respected

---

## Contact

**Jorge Holguin**
- Email: jahc2026@gmail.com
- LinkedIn: [linkedin.com/in/jorgeholguin](https://linkedin.com/in/jorgeholguin)
- GitHub: [github.com/jorge-holguin](https://github.com/jorge-holguin)
- YouTube: [El Hub de Giorgio](https://youtube.com/@elhubdegiorgio)

---

## License

MIT License - Feel free to use as inspiration for your own portfolio.

---

**Created by Jorge Holguin** | Full Stack Developer | Backend Specialist | Tech Content Creator
