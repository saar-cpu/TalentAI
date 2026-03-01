# Homepage Wireframe — eilatjobs.com

## Layout Overview (RTL, Mobile-First)

```
┌─────────────────────────────────────────────────┐
│  HEADER (sticky)                                │
│  [Logo: ברק שירותים]   ראשי │ משרות │ אודות │ בלוג  │
│  [📞 073-802-0145]  [WhatsApp CTA]             │
│  Mobile: hamburger menu                         │
├─────────────────────────────────────────────────┤
│  HERO                                           │
│  ┌─────────────────────────────────────────┐    │
│  │  bg: brand-900 → brand-700 gradient     │    │
│  │  badge: "הסוכנות המובילה באילת 🏆"       │    │
│  │  H1: עבודה עם מגורים באילת              │    │
│  │  subtitle: text                          │    │
│  │  [שלחו קורות חיים]  [WhatsApp]          │    │
│  └─────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│  TRUST BAR (brand-50 bg)                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                   │
│  │50+ │ │1000│ │20+ │ │96% │                   │
│  │מעסי│ │הושמ│ │שנות│ │שביע│                   │
│  └────┘ └────┘ └────┘ └────┘                   │
├─────────────────────────────────────────────────┤
│  JOB CATEGORIES  id="jobs"                      │
│  H2: תחומי העסקה                                │
│  ┌──────┐ ┌──────┐ ┌──────┐                     │
│  │🏨    │ │🛍️    │ │👗    │                     │
│  │מלונאו│ │קמעונא│ │אופנה │                     │
│  │roles │ │roles │ │roles │                     │
│  └──────┘ └──────┘ └──────┘                     │
│  ┌──────┐ ┌──────┐ ┌──────┐                     │
│  │🛡️    │ │🍽️    │ │⛽    │                     │
│  │אבטחה │ │מסעדנו│ │תחנות │                     │
│  │roles │ │roles │ │דלק   │                     │
│  └──────┘ └──────┘ └──────┘                     │
├─────────────────────────────────────────────────┤
│  WHY BARAK  id="about"                          │
│  H2: למה ברק שירותים?                           │
│  6 benefit cards (2×3 or 3×2 grid)              │
│  🏠 מגורים │ 🍽️ ארוחות │ 🚌 הסעות              │
│  💰 בונוס  │ 💵 מזומן  │ 🤝 ליווי               │
├─────────────────────────────────────────────────┤
│  TESTIMONIALS                                   │
│  H2: מה אומרים העובדים שלנו                     │
│  3 cards with ★★★★★ + quote + name + role       │
├─────────────────────────────────────────────────┤
│  FAQ  id="faq"                                  │
│  H2: שאלות נפוצות                               │
│  8 accordion items (click to expand)            │
│  ▸ מה כולל חבילת המגורים?                       │
│  ▸ כמה עולים המגורים?                           │
│  ▸ ...                                          │
├─────────────────────────────────────────────────┤
│  BLOG PREVIEW  id="blog"                        │
│  H2: מהבלוג שלנו                                │
│  3 placeholder cards with title + excerpt       │
├─────────────────────────────────────────────────┤
│  QUICK APPLICATION FORM                         │
│  H2: הגישו מועמדות עכשיו                        │
│  [שם מלא] [טלפון] [תחום ▼]                     │
│  [שלחו מועמדות]                                 │
│  → success: ✅ message                          │
├─────────────────────────────────────────────────┤
│  FOOTER                                         │
│  4-col: brand │ contact │ links │ tools         │
│  ─────────────────────────────────────────      │
│  © 2026 ברק שירותים                             │
└─────────────────────────────────────────────────┘
```

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Icons | Emojis | No external images needed, matches existing pattern |
| Colors | brand-50/500/600/700/900 | Reuse Tailwind config palette |
| Layout | Mobile-first responsive | 1-col → sm:2-col → lg:3-col grids |
| RTL | Inherited from layout.tsx | `dir="rtl"` on `<html>` |
| Images | None | Emoji-only, fast load, no CDN dependency |
| Form | UI-only | Shows success state, wirable to API later |
| FAQ | Accordion | SEO value + AI Overview eligibility |
| WhatsApp | wa.me/9720738020145 | Direct link to business number |
| Phone | 073-802-0145 | Clickable tel: link |
| Nav tools | Dropdown in header | Dashboard, Screening, FB Hunter, Voice AI |
| Scroll | smooth via CSS | Anchor links (#jobs, #about, #blog) |

## Component Tree

```
HomePage
├── Header (state: mobileMenuOpen)
├── HeroSection
├── TrustBar
├── JobCategories
│   └── JobCategoryCard (×6)
├── WhyBarak
│   └── BenefitCard (×6)
├── Testimonials
│   └── TestimonialCard (×3)
├── FaqSection
│   └── FaqItem (×8, state: open)
├── BlogPreview
│   └── BlogPreviewCard (×3)
├── QuickApplicationForm (state: formData, submitted)
└── Footer
```

## Data Arrays (hardcoded Hebrew)

1. `NAV_LINKS` — navigation items with href and label
2. `TRUST_STATS` — 4 objects: value, label, emoji
3. `JOB_CATEGORIES` — 6 objects: emoji, title, roles[], href
4. `BENEFITS` — 6 objects: emoji, title, description
5. `TESTIMONIALS` — 3 objects: name, role, quote, stars
6. `FAQ_ITEMS` — 8 objects: question, answer
7. `BLOG_POSTS` — 3 objects: title, excerpt, date, slug
