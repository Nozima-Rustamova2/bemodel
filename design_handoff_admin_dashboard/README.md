# Handoff: bemodel — Admin Dashboard

## Overview
An admin dashboard for the **bemodel** modeling-agency site. It lets a staff member manage everything the public site displays: the model roster (photos, measurements, bio), the homepage hero video and "Latest" featured shoots, Academy content (lessons + FAQs), the About page copy, and incoming "Become a Model" applications. Two visual variations were explored (see below) — same functionality, different skin.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing the intended look, data model and behavior. They are **not** production code to copy directly. `Admin.dc.html` / `Admin-B.dc.html` and `bemodel.dc.html` are authored in a proprietary "Design Component" format (custom `<x-dc>`, `<sc-for>`, `<sc-if>`, `<x-import>` tags plus a `support.js` runtime) that will **not** run in a normal app. `assets/store.js` is a genuine, framework-agnostic ES module (plain JS, no proprietary tags) — its data shape and CRUD logic are the real spec for the backend/state layer and can be read directly as reference (though in production it should be replaced by real API calls instead of `localStorage`).

Your task: **recreate these designs in the target codebase's environment** (React, Vue, Svelte, etc., or native) using its established patterns, routing, auth and component libraries. If no environment exists yet, pick the most appropriate framework and implement there. Treat the HTML as the source of truth for layout, tokens, copy and interaction; treat `store.js`'s data shape as the source of truth for the data model.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing and interactions are final for both variations. Recreate pixel-perfectly using the codebase's UI libraries. Photo/video uploads are prototyped with a drag-and-drop placeholder component (`image-slot.js`) — in production these become real uploads to object storage (S3/Cloudinary/etc.) behind an authenticated API.

## Two variations
Both files implement **identical functionality** against the same data shape — only the visual skin differs. Ship whichever the team prefers, or offer both as a theme.

- **`Admin.dc.html`** — dark sidebar (`#181B21`), blue accent (`#3B6FE0`), sharper corners.
- **`Admin-B.dc.html`** — white sidebar with a hairline border, warm stone neutrals, teal accent (`#0D9488`), slightly softer corners.

Shared conventions (both variations):
- Font: `system-ui, -apple-system, "Segoe UI", sans-serif` — a plain OS-native stack, deliberately distinct from the public site's editorial serif/sans pairing (Cormorant Garamond / Jost), to read as a utilitarian tool.
- Layout: fixed **232px sidebar** + fluid content area (`max-width:1180px`, `padding:36px 44px`).
- Cards: white background, `1px solid` hairline border, border-radius ~10px, no drop shadows.
- No icons — the sidebar uses a small 6×6px square dot as the active-state indicator instead of icon glyphs.

## Screens / Views

### 1. Login
Centered card (max-width 360px) on the app background: wordmark, "Admin sign in" heading, Email + Password inputs (underline-free, bordered, 7px radius), full-width "Sign in" button. **Visual only — any input signs in** (no real auth in the prototype; wire to real auth in production).

### 2. App shell (post-login)
Persistent left sidebar: wordmark, then 6 nav rows (Dashboard, Models, Homepage, Academy, About, Applications) — active row gets a filled pill background + colored dot; "Sign out" pinned to the bottom, returns to Login.

### 3. Dashboard
Heading + subheading. A 4-up stat-card grid: Total models, Women, New faces, New applications (unread count). Below, a "Quick links" 3-up grid of clickable cards that jump to Models/Homepage/Academy/Applications/About.

### 4. Models — list
Heading, "+ Add model" button (top right), talent count, and an All / Women / New Faces filter (underline tabs). Below: a single bordered card containing one row per model — 44×44 rounded photo thumbnail, name + city + category, "Edit" and "Delete" actions.

### 5. Models — editor
Opens in place of the list (not a modal) when Add/Edit is clicked. Back link, editor title, Cancel/Save buttons top-right. Two-column layout:
- **Left column** — three cards: *Profile* (Name, City, Category select), *Measurements* (Height/Bust/Waist/Hips/Shoes/Hair/Eyes, 3-per-row grid), *Bio/notes* (textarea).
- **Right column** — three cards, each holding `<image-slot>` drag-and-drop placeholders: *Card photo* (1, portrait), *Portfolio* (3, portrait), *Polaroids/digitals* (4, portrait).
Slug is generated once when a model is created (from the name, de-duplicated) and never changes after — it's the stable key that ties a model to its photo slots. Changing "Category" moves the model between the Women/New Faces lists on save.

### 6. Homepage
Heading + subheading, then stacked cards:
- **Hero video** — current video preview (16:9), "Upload new video" button (file input, accept mp4/webm) and "Reset to default" link. Prototype stores the file as a data URL client-side, capped at 8MB with an alert past that size — production should upload to real video storage instead.
- **Hero copy** — 3 inputs for the headline (pre-text / emphasized word / post-text) + a body textarea.
- **Manifesto section** — title input + two paragraph textareas (paragraph 2 supports a `{city}` token, substituted at render time).
- **Latest shoots** — a 4-up grid; each card shows the linked model's photo, a `<select>` to pick which model is featured, and a credit-line input.

### 7. Academy
Heading + subheading, then stacked cards:
- **Hero** — title input + body textarea (body supports a `{city}` token).
- **About the academy** — title input, two paragraph textareas (paragraph 1 supports a `{name}` token), and a 3-up numeric row (Weeks / Sessions / Per cohort).
- **Curriculum lessons** — repeatable rows: 70px thumbnail (`<image-slot>`), Title input, Description input, Remove button; "+ Add lesson" adds a blank row.
- **FAQs** — repeatable rows: Question input, Answer textarea, Remove button; "+ Add FAQ" adds a blank row.

### 8. About page
Heading + subheading, then: a card with Heading input + two paragraph textareas (paragraph 1 supports `{name}`/`{city}` tokens); a second card with a fixed 3-up grid of "process step" editors (Title input + description textarea each) — the step count is fixed at 3 to match the public page's 3-column layout, so this list has no add/remove.

### 9. Applications
Heading + subheading. Each submission renders as a card: name + submitted-at timestamp, a status pill (New / Reviewed) with a toggle button and a Delete button, then a 6-up detail grid (Email, Phone, Instagram, City, DOB, Height) and the free-text message below if present. Empty state: a dashed-border card reading "No applications yet…".

## Interactions & Behavior
- **Nav / routing**: single `page` state (`dashboard | models | homepage | academy | about | applications`) plus a separate `editingSlug` flag that, when set, swaps the Models screen to the editor. In your app, use real routes (e.g. `/admin`, `/admin/models`, `/admin/models/:slug`, `/admin/homepage`, …).
- **Auth**: `loggedIn` boolean gates the whole shell. Replace with real session/auth in production; add role-gating if only certain staff should reach this tool.
- **Model save**: on Save, the model is removed from both `women`/`newfaces` arrays (by slug) and re-inserted into whichever array matches its current Category — this is what makes changing category "move" the model.
- **Autosave vs. explicit save**: Homepage/Academy/About/Applications fields autosave on every change (no Save button — the store write happens per keystroke/blur). The Model editor is the one exception: it stages edits in a local `draft` and only commits on the explicit "Save model" click (Cancel discards).
- **Cross-tab live sync**: the data store fires a custom event + relies on the native `storage` event, so an edit made in one browser tab is picked up by any other open tab (including the public site) without a reload. Replace with real-time sync (websocket/poll) or just normal page-load fetching in production — the "instant cross-tab" behavior was a prototype convenience, not a hard requirement.
- **Image uploads**: `<image-slot>` is a prototype-only drag-and-drop component that stores dropped images as data URLs in a local JSON sidecar, keyed by the `id` attribute. The **same id** is reused between the admin editor and the public site (e.g. `card-{slug}`, `gal-{slug}-0..2`, `pol-{slug}-0..3`, `academy-l{n}`, `latest-{n}`) — that shared-id convention is how "upload here, appears there" works in the prototype. In production, replace with a real upload flow (presigned URL / multipart upload) and store the resulting URL against the model/lesson/etc. record; keep the same conceptual id scheme so it's obvious which upload maps to which slot on the public site.
- **Video upload size cap**: prototype-only 8MB guard because it's stored as a data URL in `localStorage` (quota ~5-10MB). Not a real constraint — production video upload should support normal file sizes via real storage.

## State Management
- `loggedIn` — auth gate.
- `page` — current admin section.
- `data` — the full site content object (see Data model below), loaded from and written back to the shared store.
- `modelFilter` — All / Women / New Faces filter on the Models list.
- `editingSlug` / `draft` — which model is being edited (or `'__new__'`) and its staged (uncommitted) field values.

## Data model
`assets/store.js` is the real spec for the data shape. Top level:
```
{
  brand: { name, city, accent },
  home: { heroPre, heroEm, heroPost, heroBody, manifestoTitle, manifestoBody1, manifestoBody2 },
  heroVideo: '',            // data URL or '' for default asset
  featured: [ { slug, credit } ]         // 4 entries for the homepage "Latest" grid
  women: [ Model ],
  newfaces: [ Model ],
  about: { heading, body1, body2, steps: [ { title, body } ] },   // steps fixed at 3
  academy: {
    heroTitle, heroBody, aboutTitle, aboutBody1, aboutBody2,
    stats: { weeks, sessions, cohort },
    lessons: [ { title, note } ],
    faqs: [ { q, a } ]
  },
  applications: [ Application ]
}
```
**Model**: `{ name, slug, cat: 'women'|'newfaces', city, height, bust, waist, hips, shoes, hair, eyes, bio, photos: string[] }`. `slug` is generated once (slugified name, de-duplicated) and used as the stable key for photo slot ids.

**Application**: `{ id, ts, status: 'new'|'reviewed', name, email, phone, instagram, city, dob, height, message }`.

Copy fields that embed `{name}` / `{city}` tokens are substituted at render time on the public site (see `bemodel.dc.html`'s `renderVals()` for the exact substitution points) — do the same token replacement in your recreation, or better, resolve them server-side before sending copy to the client.

`store.js` also exports `load()`/`save()`/`subscribe()`/`newSlug()`/`blankModel()` — read these for the exact merge-with-defaults and slug-uniqueness logic to replicate against your real backend.

## Design Tokens

### Variation A (`Admin.dc.html`)
- App background `#F4F5F7`; cards `#fff` on `1px solid rgba(20,22,26,0.10)`, radius 10px.
- Sidebar `#181B21`, inactive text `#A9AFBC`, active row bg `rgba(255,255,255,0.06)`, active dot/accent `#3B6FE0`.
- Primary buttons: bg `#181B21`, text `#fff`, hover bg `#3B6FE0`.
- Danger actions: `#C0392B` text, hover bg `rgba(192,57,43,0.08)`.
- Secondary text `#6B7280`; placeholders/empty image bg `#EDEEF1`.

### Variation B (`Admin-B.dc.html`)
- App background `#FAFAF9`; cards `#fff` on `1px solid rgba(28,25,23,0.08)`, radius 10px.
- Sidebar `#FFFFFF` with `1px solid rgba(28,25,23,0.08)` right border, inactive text `#78716C`, active row bg `rgba(13,148,136,0.10)`, active dot/accent `#0D9488`.
- Primary buttons: bg `#0D9488`, text `#fff`.
- Danger actions: `#B91C1C` text, hover bg `rgba(185,28,28,0.08)`.
- Secondary text `#78716C`; placeholders/empty image bg `#F0EEEB`.

### Shared
- Font: `system-ui, -apple-system, "Segoe UI", sans-serif` throughout, all weights via the system stack (no webfont load).
- Status pill (Applications): "New" uses the accent color at ~12% opacity bg; "Reviewed" uses `#1F8A5B` text on `rgba(31,138,91,0.12)` bg in both variations (semantic, not accent-driven).
- Border radius scale: inputs/buttons 6–7px, cards 8–10px, photo thumbnails 6–8px.
- No shadows anywhere; hierarchy comes from hairline borders and background contrast only.

## Assets
- `assets/store.js` — the real, portable data-store module (see Data model above).
- `assets/image-slot.js` — prototype-only drag-and-drop image placeholder; **do not ship this to production** — replace with a real upload component wired to your storage/API, but keep it functionally equivalent (drop-to-set, click-to-browse, persists per a stable id).
- `bemodel.dc.html` — the public site this admin panel feeds (included for reference so the shared id/data conventions are traceable end-to-end; see its own handoff bundle, `design_handoff_bemodel_site/`, for full public-site detail).

## Files
- `Admin.dc.html` — Admin dashboard, Variation A (dark sidebar / blue accent).
- `Admin-B.dc.html` — Admin dashboard, Variation B (light sidebar / teal accent).
- `bemodel.dc.html` — the public site, reference only.
- `assets/store.js`, `assets/image-slot.js` — supporting modules referenced above.

> Reminder: the `.dc.html` files will not run standalone in a normal web app. Use them as a visual + structural + data-model spec, not a codebase.
