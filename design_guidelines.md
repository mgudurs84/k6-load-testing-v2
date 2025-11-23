# K6 Load Testing Dashboard - Design Guidelines

## Design Approach

**Reference-Based Strategy**: Draw inspiration from modern dashboard platforms like Linear, Vercel, and Stripe for clean, professional aesthetics combined with healthcare application standards for trust and clarity.

**Core Principles**:
- Professional polish with subtle gradients and depth
- Data-first hierarchy emphasizing metrics and actionable insights
- Wizard flow with clear progression and state management
- Healthcare-appropriate trust signals and reliability indicators

## Typography

**Font System**:
- Primary: Inter or similar geometric sans-serif via Google Fonts
- Hierarchy: Display (36-48px), H1 (32px), H2 (24px), H3 (20px), Body (16px), Caption (14px), Small (12px)
- Weights: Regular (400), Medium (500), Semibold (600) for emphasis
- Line heights: 1.2 for headings, 1.5 for body text

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-6 to p-8
- Section gaps: gap-6 to gap-8
- Card spacing: space-y-6
- Wizard step margins: mb-12 between major sections

**Grid Structure**: 
- Max container: max-w-7xl for main content
- Stats cards: 3-column grid (grid-cols-3) with gap-6
- Application cards: 2-column grid (grid-cols-2) with gap-6
- API endpoints: Single column list with grouped categories

## Component Library

### Header
- Full-width sticky header with slight backdrop blur
- Left: Gradient logo (purple/pink accent) + "K6 Dashboard" wordmark
- Center: Search bar with icon, rounded-full design, subtle border
- Right: Notification bell with unread badge + user avatar with dropdown

### Stats Cards
- Large metric number (text-4xl, font-semibold)
- Small label below (text-sm, muted)
- Custom icon top-left (24px size, accent tint background circle)
- Subtle shadow (shadow-sm), white/elevated background
- Hover: slight shadow increase (shadow-md transition)

### Step Indicator
- Horizontal timeline with connecting lines
- Steps: Circle with number (completed: checkmark icon, green fill | active: number, blue border | pending: number, gray)
- Step labels below circles (text-sm)
- Connecting lines: 2px height, gray for pending, accent for completed

### Application Cards
- Prominent gradient icon background (48px circle, unique tint per app: blue/green/purple/orange/yellow/pink)
- Application name (text-xl, font-semibold)
- API count badge (rounded-full, small text, muted background)
- Star favorite icon (top-right, interactive, filled/outline states)
- Description text (text-sm, 2 lines max)
- Hover: subtle scale (scale-105) and shadow enhancement

### API Endpoint List
- Search bar at top with filter chips (Category, Method)
- List items: Left - HTTP method badge (GET: emerald, POST: blue, PUT: amber, DELETE: red, rounded-md, text-xs)
- Endpoint path (font-mono, text-sm)
- Response time indicator (right-aligned, text-xs, muted)
- Category headers (text-xs, uppercase, tracking-wide, muted)
- Checkbox selection (left of each item)

### Configuration Controls
- Section headers with icons (Activity icon for VUs, Clock for timing, Target for thresholds)
- Sliders: Accent track fill, large thumb, value display above slider (text-lg, font-semibold)
- Quick preset buttons (Light/Medium/Heavy/Stress): Small pills, outlined, active state filled
- Duration chips: Inline chips (5min, 10min, 15min, 30min, 1hr) with selected state
- Advanced settings: Accordion with chevron icon, subtle border-top separation

### Review Screen
- Application badge: Large rounded pill with icon, name, gradient background
- Expandable API list: Count badge (e.g., "12 APIs selected"), chevron to expand, scrollable max-height
- Metrics grid: 2x2 grid of parameter cards (VUs, Duration, Ramp-up, Think Time) with icons and large values
- JSON preview: Code block with syntax highlighting (gray background, monospace font, rounded-lg)

### CTA Buttons
- Primary: Gradient background (purple to pink), white text, rounded-lg, px-8 py-3, icon + text
- "Trigger Load Test": Rocket icon left, prominent positioning
- "Continue/Next": Arrow icon right, slightly smaller than primary
- Secondary: Outlined, no background, hover fills with subtle tint

### Test Summary
- Metric cards in grid: Icon + label + large value + trend indicator (↑↓ with percentage)
- Performance score: Large circular progress indicator (0-100 scale) with grade letter (A/B/C/D/F)
- Bottleneck alerts: Warning cards with amber accent, icon, description
- Recommendations: List with checkmark icons, actionable items

## Navigation & Flow

- Breadcrumb: Top of wizard (Dashboard > Configure Test > Step X)
- Progress bar: Thin line across top showing wizard completion percentage
- Back/Cancel buttons: Ghost buttons, left-aligned
- Toast notifications: Top-right, slide-in animation, auto-dismiss, with icons (success: green, error: red, info: blue)

## Micro-interactions

- Button hover: Subtle scale (scale-105), shadow enhancement
- Card hover: Shadow elevation, subtle lift
- Slider interaction: Thumb pulse on drag, track fill animation
- Checkbox: Smooth check animation with slight bounce
- Loading states: Skeleton loaders matching component shapes, pulse animation
- Step completion: Checkmark fade-in with scale animation

## Images

No large hero images needed for this dashboard application. Focus on:
- Application icons: Custom gradient backgrounds for each healthcare app
- Metric icons: Lucide icons for stats, configuration parameters, and performance indicators
- Empty states: Simple illustrations for "no tests" or "no results" scenarios

## Visual Enhancements

- Gradient accents: Subtle purple-to-pink or blue-to-teal gradients for headers, buttons, and emphasis elements
- Card elevation: Consistent shadow system (shadow-sm base, shadow-md hover, shadow-lg modal)
- Backdrop blur: For overlays, modals, and sticky headers (backdrop-blur-sm)
- Border radius: Consistent rounding (rounded-lg for cards, rounded-full for pills/avatars, rounded-md for inputs)