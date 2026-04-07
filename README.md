# Cinematic Smart Calendar

A visually stunning, highly interactive calendar component built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion. This is not just a calendar — it's a cinematic experience combining visual storytelling, micro-interactions, intelligent UX, and delightful animations.

## Features

### Wall Calendar Aesthetic
- Realistic wall calendar layout with depth, shadows, and glassmorphism
- Dynamic hero images that change per month (sourced from Unsplash)
- Subtle parallax effect on mouse movement
- Ambient glow effects that follow the month's color theme

### Date Range Selection
- Click-to-select date ranges with animated highlights
- Gradient transitions between start and end dates
- Hover preview before selection
- Smart suggestions based on range length ("5 days selected — add a plan?")

### Integrated Notes System
- Add notes per individual date
- Add notes per selected date range
- Floating note cards with spring animations
- Edit and delete notes inline
- Expandable side panel (desktop) / bottom sheet (mobile)
- Full localStorage persistence

### Flip Animations
- Month transitions with 3D page-flip effect using Framer Motion
- Smooth enter/exit animations for all UI elements
- Spring-based micro-interactions on every interactive element

### Dynamic Theming
- Each month has a unique color palette (primary, secondary, accent)
- UI automatically adapts colors per month
- Ambient background glows follow the theme
- Gradient overlays on hero images

### Smart UX
- Holiday indicators with emoji badges (US holidays)
- Weekend day highlighting
- "Today" ring indicator
- Smart suggestions when selecting date ranges
- Contextual hints for user guidance

### Mobile-First Design
- Fully responsive layout (desktop + mobile)
- Touch swipe gestures for month navigation
- Bottom sheet notes UI on mobile
- Compact day name headers on small screens

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | Framework with SSR/SSG support |
| **React 19** | UI library with functional components + hooks |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS 4** | Utility-first styling with custom design system |
| **Framer Motion** | Animations (flip, spring, layout) |
| **Zustand** | Lightweight state management |
| **date-fns** | Date manipulation utilities |
| **localStorage** | Client-side data persistence |

## Architecture

```
src/
├── app/
│   ├── globals.css          # Global styles, glass effects, scrollbar
│   ├── layout.tsx           # Root layout with Inter font
│   └── page.tsx             # Entry point (dynamic import, no SSR)
├── components/
│   ├── Calendar.tsx          # Main orchestrator component
│   ├── CalendarGrid.tsx      # 7-column grid with flip animation
│   ├── DateCell.tsx          # Individual date cell (memoized)
│   ├── HeroImage.tsx         # Month hero with parallax
│   ├── MonthNavigation.tsx   # Prev/Next/Today controls
│   ├── NotesPanel.tsx        # Side panel / bottom sheet for notes
│   ├── RangeHighlighter.tsx  # Range selection UI + controls
│   └── SmartSuggestion.tsx   # Context-aware suggestions
├── data/
│   ├── heroImages.ts         # Monthly hero image URLs
│   ├── holidays.ts           # US holiday mock data
│   └── monthThemes.ts        # Per-month color themes
├── hooks/
│   ├── useParallax.ts        # Mouse-driven parallax offset
│   └── useSwipe.ts           # Touch swipe detection
├── store/
│   └── calendarStore.ts      # Zustand global state + localStorage
├── types/
│   └── index.ts              # TypeScript interfaces
└── utils/
    ├── calendar.ts           # Date math utilities
    └── colors.ts             # Color helpers
```

### Design Decisions

1. **Dynamic Import with SSR disabled**: The calendar relies heavily on browser APIs (localStorage, mouse events, touch events) so it's loaded client-side only with a beautiful loading spinner.

2. **Zustand over Context**: Zustand provides a simpler API with better performance characteristics — no unnecessary re-renders from context changes.

3. **Memoized DateCell**: Each date cell is wrapped in `React.memo` to prevent re-renders when unrelated state changes occur (critical with 35-42 cells rendered per month).

4. **Framer Motion AnimatePresence**: Used for the flip animation between months — `mode="wait"` ensures smooth exit-enter transitions.

5. **Bottom Sheet Pattern (Mobile)**: Notes panel transforms from a side panel on desktop to a bottom sheet on mobile, following native mobile UX patterns.

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd cinematic-calendar

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Usage

- **Navigate months**: Click the arrow buttons or swipe left/right on mobile
- **Jump to today**: Click the "Today" button
- **Select a date**: Click any date to open the notes panel
- **Select a range**: Click "Select range", then click start and end dates
- **Add notes**: Type in the notes panel and press Enter or click +
- **Edit notes**: Hover over a note and click the edit icon
- **Delete notes**: Hover over a note and click the trash icon

## License

MIT
