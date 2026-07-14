# Handoff: bemodel — Modeling Agency Website

## Overview
A boutique modeling agency website ("bemodel") with a warm, editorial, high-fashion aesthetic. It is a single-page app with client-side view switching across five screens: **Home**, **Models roster** (Women / New Faces), **Model profile**, **Academy**, **About**, and **Contact / Become-a-Model**. The design emphasizes large imagery, a serif display face, generous whitespace, and subtle motion (video hero, hover card-flip).

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look and behavior. They are **not** production code to copy directly. `bemodel.dc.html` is authored in a proprietary "Design Component" format (custom `<x-dc>`, `<sc-for>`, `<sc-if>`, `<x-import>` tags plus a `support.js` runtime) that will **not** run in a normal app.

Your task: **recreate these designs in the target codebase's environment** (React, Vue, Svelte, SwiftUI, etc.) using its established patterns, routing, and component libraries. If no environment exists yet, pick the most appropriate framework (a React + Vite + React Router SPA is a natural fit) and implement there. Treat the HTML as the source of truth for layout, tokens, copy, and interactions.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, and interactions are final. Recreate the UI pixel-perfectly using the codebase's libraries. All model/lesson imagery is placeholder (drag-and-drop upload slots) — in production these become real `<img>` elements fed by a CMS/admin upload.

---

## Design Tokens

### Colors
- `--bg` Cream background: `#F3EDE3`
- `--bg-alt` Warmer panel / section: `#FAF6EF`
- `--ink` Primary text / dark sections: `#211D18`
- `--ink-soft` Body text on light: `#6B6157`
- `--ink-softer` Muted body: `#4A4238`
- `--accent` Taupe/terracotta accent (tweakable): default `#7C6A57` (original `#A96B52`; alt options `#9C6B6B`, `#6E7A6A`)
- Accent-on-dark / rose highlight: `#C29A87`, `#E4C7B8`
- Neutral label text: `#8A7F70`, `#A99B86`
- Placeholder image fill: `#EAE1D2`
- Light text on dark: `#F6F1E9`, `#CDC3B4`, `#B7AC9C`
- Polaroid card paper: `#FFFDF9`

### Typography
- **Display / headings:** `'Cormorant Garamond', serif` — weights 400/500/600, includes italic. Used for the logo, all `<h1>/<h2>/<h3>`, model names, and large numerals. Tight line-height (0.94–1.06), letter-spacing ≈ `-0.015em` on the biggest headings.
- **Body / UI:** `'Jost', sans-serif` — weights 300/400/500. Body copy is weight 300. Labels/eyebrows are uppercase, 10–12px, `letter-spacing: 0.14em–0.28em`.
- **Mono accents:** `'Courier New', monospace` — tiny uppercase captions (city, credits), 10px, `letter-spacing: 0.12em–0.18em`.
- Google Fonts import: `Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500` and `Jost:wght@300;400;500`.

Heading sizes use `clamp()`:
- Hero H1: `clamp(52px, 8vw, 120px)`
- Section H2: `clamp(34px, 4.5vw, 60px)`
- Profile name H1: `clamp(48px, 5vw, 74px)`

### Spacing
- Section padding: `clamp(64px, 8vw, 110px)` vertical, `clamp(40px, 6vw, 96px)` horizontal.
- Header padding: `20px 48px`.
- Grid gaps: cards `34px 26px`; profile gallery `20px`; polaroids `16px`.

### Borders / Shadows / Radius
- Hairline dividers: `1px solid rgba(33,29,24,0.10–0.14)`; on dark `rgba(243,237,227,0.14–0.16)`.
- **No border-radius anywhere** — everything is square-cornered (editorial style). Buttons, cards, images are all sharp.
- Polaroid shadow: `0 8px 22px rgba(33,29,24,0.10)`, paper border `1px solid rgba(33,29,24,0.06)`, padding `10px 10px 34px` (extra bottom for caption).
- Hero text shadow: `0 2px 40px rgba(0,0,0,0.25)`.

### Buttons
- **Solid dark:** bg `#211D18`, text `#F3EDE3`, padding `15px 28px`, uppercase 11px, `letter-spacing:0.18em`; hover bg → accent.
- **Outline:** `1px solid #211D18`, transparent; hover fills to `#211D18` with cream text.
- **Light (on media):** bg `#F6F1E9`, dark text; hover → accent with light text.
- Transitions: `all .3s`.

---

## Screens / Views

### 1. Header (persistent)
- Sticky top, `z-index:50`, translucent cream `rgba(243,237,227,0.82)` + `backdrop-filter: blur(14px)`, bottom hairline.
- Left: wordmark "bemodel" (Cormorant, 30px, weight 600) — click → Home.
- Center nav: **MODELS**, **New Faces**, **ACADEMY**, **Contact** — uppercase 11px, `letter-spacing:0.22em`, hover color → accent.
- Right: "Become a Model" outline button → Contact.

### 2. Home
- **Hero:** full-viewport (`min-height: calc(100vh - 73px)`) autoplaying, muted, looping background `<video>` (`assets/madina.mp4`), `object-fit:cover`. Dark gradient overlay `linear-gradient(to top, rgba(24,20,16,0.72), rgba(24,20,16,0.22) 45%, rgba(24,20,16,0.30))`. Content bottom-aligned: eyebrow (city · Worldwide · Est. 2014), H1 "Faces that *define* the moment." (italic on "define"), body, two buttons ("View the Models", "Meet Madina"). Fade-up entrance animation (`fadeUp .8s ease`).
- **Latest section** (bg `#FAF6EF`): eyebrow "Newest work" + H2 "Latest". Grid `1.15fr 2fr`: left is one tall feature image slot (`aspect-ratio:3/4.4`) with name + credit caption; right is a `repeat(3,1fr)` grid of smaller slots (`aspect-ratio:3/3.9`) with staggered `margin-top` offsets (0 / 64px / 24px) for a masonry feel, each with name + credit. "View all models →" link below.
- **Manifesto** (grid `0.9fr 1.1fr`): left image slot (BTS), right eyebrow "The agency" + H2 "We build careers, not just portfolios." + two paragraphs + "Our story →".
- **CTA band** (bg `#211D18`, centered): eyebrow "Open call", H2 "Think you have it?", light button "Become a Model →".

### 3. Models roster
- Header row: eyebrow "Roster · N talents", H1 (Models / New Faces), and Women / New Faces tab toggle (active tab has 2px dark underline, inactive is muted `#A99B86`).
- Grid: `repeat(auto-fill, minmax(220px, 1fr))`, gap `38px 26px`.
- **Card (flip):** `aspect-ratio:3/4`, `perspective:1400px`. Inner div `transform-style:preserve-3d`, `transition: transform .6s cubic-bezier(.4,.2,.2,1)`.
  - **Front:** image (upload slot), `backface-visibility:hidden`.
  - **Back** (`transform:rotateY(180deg)`, bg `#211D18`, light text): model name (Cormorant 26px) + measurement rows (Height / Bust / Waist / Hips / Shoes / Hair / Eyes) as label/value flex rows with hairline separators, then "View portfolio →" cue in accent.
  - On hover the inner flips to `rotateY(180deg)` (driven by hover state).
  - Clicking the card (back), the name, or "View →" navigates to that model's profile.
- Caption below card: name (Cormorant 20px) + city (mono 10px uppercase) + "View →".

### 4. Model profile
- Back link "← Back to roster".
- Two-column grid `340px 1fr`, gap `clamp(40px,5vw,80px)`.
  - **Left (sticky, top:110px):** eyebrow (city), H1 name, measurement table (label uppercase 11px muted / value 13px) with hairline rows: Height, Bust, Waist, Hips (cm), Shoes (EU), Hair, Eyes. "Book this model →" solid dark button.
  - **Right:** "Portfolio" eyebrow + `1fr 1fr` gallery of `aspect-ratio:3/4` image slots. Then "Polaroids · Digitals" eyebrow + sub-note, and a `repeat(4,1fr)` grid of polaroid cards (paper bg `#FFFDF9`, shadow, extra bottom padding) each with an image slot and a centered mono caption (Front / Profile / Full length / Smile).

### 5. Academy
- **Video hero** (`min-height:78vh`): same muted-loop video treatment, stronger overlay. Eyebrow "bemodel Academy", H1 "Learn the craft before the camera finds you.", body, "Apply to the Academy →" light button.
- **About** (grid `1.05fr 0.95fr`, bg `#FAF6EF`): left copy ("A real education, not a photoshoot.") + 3 stat blocks (8 Weeks / 16 Sessions / 12 Per cohort — big Cormorant numeral in accent + uppercase label). Right image slot.
- **Curriculum:** eyebrow "The curriculum" + H2 "Inside the lessons". Grid `repeat(auto-fill, minmax(260px,1fr))` of six lesson cards: image slot (`aspect-ratio:4/3`) + H3 title + note. Lessons: Runway & Movement, Posing for Camera, Editorial & Styling, Grooming & Care, Casting & Confidence, The Business.
- **FAQ** (bg `#211D18`, grid `0.7fr 1.3fr`): left heading "Questions, answered." + "Get in touch →" outline button. Right: list of Q/A items separated by top hairlines (Q in Cormorant 24px light, A body 15px). FAQs cover cost (180,000 KZT, 8-week foundation), duration (8 weeks / 16 sessions), experience (none needed), age (15+, guardian co-sign under 18), deliverables (portfolio, digitals, certificate, representation review), location (studio in city).

### 6. Contact / Become a Model
- Grid `0.85fr 1.15fr`, `min-height:80vh`.
  - **Left (bg `#211D18`):** eyebrow "Get in touch", H2 "Become a Model", instructions, and studio/email/Instagram details.
  - **Right (bg `#FAF6EF`):** application form — underline-style inputs (no box; `border-bottom:1px solid rgba(33,29,24,0.28)`, focus → accent underline). Fields: Full name, Email, Phone, Instagram, City/Country, Date of birth, Height, message textarea. Three dashed photo-upload boxes (Portrait / Full length / Profile). "Submit application →" solid dark button.
  - **Submitted state:** replaces form with a "Thank you. We'll be in touch." confirmation + "Back to home →".

### Footer (persistent)
- bg `#211D18`, light text. Grid `1.6fr 1fr 1fr 1fr`: wordmark + blurb; Explore links (Women, New Faces, About, Academy, Become a Model); Contact (email, phone, city); Social (Instagram, TikTok, LinkedIn). Bottom bar: copyright + "Terms · Privacy · Model Rights".

---

## Interactions & Behavior
- **Routing:** client-side view switch by a single `page` state value (`home | roster | profile | about | academy | contact`). In your app, use real routes (`/`, `/models`, `/models/:slug`, `/academy`, `/about`, `/contact`). Every navigation scrolls to top.
- **Roster tabs:** `cat` state (`women | newfaces`) filters the roster list and swaps the title.
- **Card flip:** hover sets a `hovered` slug; the hovered card's inner rotates `rotateY(180deg)` over 0.6s. Reset on mouse leave. Use CSS `:hover` in a real build (no JS needed): `.card:hover .inner { transform: rotateY(180deg); }`.
- **Video hero:** autoplay + muted + loop + playsinline. IMPORTANT: set the `muted` **property** in JS (not just the attribute) or browsers block autoplay. Persist/restore `currentTime` via localStorage if you want continuity (optional).
- **Form:** controlled inputs in state; submit swaps to a thank-you view. Wire to a real endpoint / email service in production. Add validation (required name + email, valid email, height numeric).
- **Transitions:** buttons `all .3s`; card flip `transform .6s cubic-bezier(.4,.2,.2,1)`; entrance `fadeUp` keyframe (`opacity 0→1`, `translateY(14px)→0`).

## State Management
- `page` — current view. → real router.
- `cat` — roster category filter (women / newfaces).
- `model` — selected model object for the profile view. → route param `:slug` + data lookup.
- `hovered` — currently hovered card (for flip; replace with CSS hover).
- `form` — controlled form field values.
- `submitted` — contact form submitted flag.

## Data model
Each **model**: `{ name, slug, cat: 'women'|'newfaces', city, height, bust, waist, hips, shoes, hair, eyes, photos: string[] }`.
Each model's profile derives: portfolio images, four polaroid/digital slots, and the measurement table from the same fields.
**Academy** data: `lessons: [{ title, note, image }]` and `faqs: [{ q, a }]`.
**Latest** (home) data: `[{ model, credit, image, feature: bool }]`.

## Assets
- `assets/madina.mp4` — hero background video (a model's film reel). Used on Home hero and Academy hero.
- `assets/madina-1.png`, `madina-2.png`, `madina-3.png` — the one real model ("Madina/Shakhin") photos; prefill her card, profile gallery, and polaroids.
- All other model/lesson/BTS images are **placeholder upload slots** — replace with real `<img>` in production, sourced from a CMS or admin upload. No third-party imagery is bundled (avoid using copyrighted photos).
- Fonts: Google Fonts (Cormorant Garamond, Jost).

## Files
- `bemodel.dc.html` — the full design (all screens). Read it for exact markup, inline styles, and copy. Ignore the `<x-dc>`/`<sc-*>`/`<x-import>` framework tags — they are prototype scaffolding.
- `assets/` — video + the three real model images.

> Reminder: the `.dc.html` file will not run standalone. Use it as a visual + structural spec, not a codebase.
