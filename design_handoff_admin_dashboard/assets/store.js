// Shared client-side data store for the bemodel site + admin panel.
// Plain localStorage (per-browser) — good enough for a prototype: the
// admin panel writes here, the public site reads here, and a 'storage'
// event lets an open site tab live-update when admin saves in another tab.
const KEY = 'bemodel_store_v1';
const EVT = 'bemodel-store-changed';

function slugify(name) {
  return (name || '').toLowerCase().replace(/[^a-z]/g, '') || ('model' + Date.now());
}

const mk = (name, cat, city, s) => Object.assign(
  { name, slug: slugify(name), cat, city, bio: '', photos: [] }, s
);

export const DEFAULTS = {
  brand: { name: 'bemodel', city: 'Almaty', accent: '#7C6A57' },
  home: {
    heroPre: 'Faces that', heroEm: 'define', heroPost: 'the moment.',
    heroBody: "A boutique agency representing women and new faces across editorial, runway and campaign. Scouted with intention, developed with care.",
    manifestoTitle: 'We build careers, not just portfolios.',
    manifestoBody1: 'From first test to global campaign, every face on our board is placed with intention. We work closely with a small roster so no one gets lost in the crowd.',
    manifestoBody2: 'Editorial, commercial, runway and digital — represented in {city} and placed worldwide through our partner network.'
  },
  heroVideo: '',
  featured: [
    { slug: 'shakhin', credit: 'Editorial — SS26' },
    { slug: 'dinara', credit: 'Runway — Almaty FW26' },
    { slug: 'aigerim', credit: 'Campaign — Vogue KZ' },
    { slug: 'milana', credit: 'Editorial — July 2026' }
  ],
  women: [
    mk('Shakhin', 'women', 'Almaty', { height: '177', bust: '82', waist: '59', hips: '88', shoes: '39', hair: 'Dark brown', eyes: 'Brown', photos: ['assets/madina-1.png', 'assets/madina-2.png', 'assets/madina-3.png'] }),
    mk('Anastasiya', 'women', 'Almaty', { height: '178', bust: '84', waist: '60', hips: '89', shoes: '40', hair: 'Brown', eyes: 'Green' }),
    mk('Dinara', 'women', 'Astana', { height: '176', bust: '82', waist: '59', hips: '88', shoes: '39', hair: 'Black', eyes: 'Brown' }),
    mk('Aigerim', 'women', 'Almaty', { height: '179', bust: '85', waist: '61', hips: '90', shoes: '40', hair: 'Dark brown', eyes: 'Hazel' }),
    mk('Milana', 'women', 'Moscow', { height: '177', bust: '83', waist: '60', hips: '88', shoes: '39', hair: 'Blonde', eyes: 'Blue' }),
    mk('Sofia', 'women', 'Kyiv', { height: '180', bust: '84', waist: '60', hips: '89', shoes: '41', hair: 'Brown', eyes: 'Grey' }),
    mk('Kamila', 'women', 'Shymkent', { height: '175', bust: '82', waist: '58', hips: '87', shoes: '38', hair: 'Black', eyes: 'Brown' }),
    mk('Alina', 'women', 'Almaty', { height: '178', bust: '83', waist: '60', hips: '88', shoes: '40', hair: 'Auburn', eyes: 'Green' }),
    mk('Lea', 'women', 'Paris', { height: '181', bust: '85', waist: '61', hips: '90', shoes: '41', hair: 'Brown', eyes: 'Brown' })
  ],
  newfaces: [
    mk('Zarina', 'newfaces', 'Almaty', { height: '177', bust: '82', waist: '59', hips: '88', shoes: '39', hair: 'Black', eyes: 'Brown' }),
    mk('Nadia', 'newfaces', 'Astana', { height: '176', bust: '81', waist: '58', hips: '87', shoes: '38', hair: 'Dark brown', eyes: 'Hazel' }),
    mk('Emma', 'newfaces', 'Almaty', { height: '178', bust: '83', waist: '60', hips: '89', shoes: '40', hair: 'Blonde', eyes: 'Blue' }),
    mk('Yasmin', 'newfaces', 'Taraz', { height: '175', bust: '82', waist: '59', hips: '87', shoes: '38', hair: 'Black', eyes: 'Brown' }),
    mk('Amina', 'newfaces', 'Almaty', { height: '179', bust: '84', waist: '60', hips: '88', shoes: '40', hair: 'Brown', eyes: 'Green' }),
    mk('Polina', 'newfaces', 'Karaganda', { height: '177', bust: '82', waist: '59', hips: '88', shoes: '39', hair: 'Light brown', eyes: 'Grey' })
  ],
  about: {
    heading: 'A small board, a global reach, and a lot of care.',
    body1: "We founded {name} in {city} with a simple conviction: talent deserves attention, not a spreadsheet. We keep our roster intentionally small so every model is developed personally — from the first digitals to international placement.",
    body2: 'Today we represent women and new faces working in editorial, campaign, runway and digital, placed across Europe, Asia and the Middle East through a trusted partner network.',
    steps: [
      { title: 'Scouting', body: "We find faces with something the camera can't invent — and we develop them slowly, properly." },
      { title: 'Development', body: 'Tests, coaching, portfolio and digitals — everything a career needs before the first booking.' },
      { title: 'Placement', body: "Direct clients and partner agencies worldwide, matched to each model's strengths and pace." }
    ]
  },
  academy: {
    heroTitle: 'BEMODEL ACADEMY',
    heroBody: 'An 8-week foundation in runway, posing, styling and the business of modeling — taught by working professionals in {city}.',
    aboutTitle: 'A real education, not a photoshoot.',
    aboutBody1: 'The {name} Academy takes small groups through everything a new model needs — from the first nervous walk to a confident casting. Every cohort is capped at twelve so each student gets real attention.',
    aboutBody2: "Classes are led by our own bookers alongside visiting photographers and stylists, and finish with a full portfolio shoot you keep.",
    stats: { weeks: '8', sessions: '16', cohort: '12' },
    lessons: [
      { title: 'Runway & Movement', note: 'Walk, posture, turns, and presence on the catwalk.' },
      { title: 'Posing for Camera', note: 'Angles, expression and working with photographers.' },
      { title: 'Editorial & Styling', note: 'Understanding mood boards, fashion and set direction.' },
      { title: 'Grooming & Care', note: 'Skin, hair, nutrition and looking after yourself.' },
      { title: 'Casting & Confidence', note: 'Go-sees, interviews, and self-presentation.' },
      { title: 'The Business', note: 'Contracts, agencies, social media and your rights.' }
    ],
    faqs: [
      { q: 'How much does the Academy cost?', a: 'Our 8-week foundation course is 180,000 KZT, payable in full or in two instalments. Scouted talents may qualify for a partial scholarship — ask us at your interview.' },
      { q: 'How long is the programme?', a: 'The foundation course runs 8 weeks, with two 2-hour sessions per week (16 sessions total) plus a final portfolio shoot.' },
      { q: 'Do I need experience?', a: 'None at all. The Academy is built for complete beginners as well as models wanting to refine their craft before signing.' },
      { q: 'What age can I join?', a: 'We accept students from 15 and up. Applicants under 18 need a parent or guardian to co-sign enrolment.' },
      { q: 'What do I get at the end?', a: 'A professional portfolio and digitals from the final shoot, a completion certificate, and a review for possible representation with the agency.' },
      { q: 'Where are classes held?', a: 'At our studio, with select workshops hosted by visiting photographers and stylists.' }
    ]
  },
  applications: []
};

function clone(o) { return JSON.parse(JSON.stringify(o)); }

function deepMerge(base, patch) {
  if (Array.isArray(base)) return patch !== undefined ? patch : base;
  if (base && typeof base === 'object') {
    const out = Object.assign({}, base);
    if (patch && typeof patch === 'object') {
      for (const k in patch) out[k] = deepMerge(base[k], patch[k]);
    }
    return out;
  }
  return patch !== undefined ? patch : base;
}

export function load() {
  let saved = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) saved = JSON.parse(raw);
  } catch (e) {}
  return saved ? deepMerge(clone(DEFAULTS), saved) : clone(DEFAULTS);
}

export function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  try { window.dispatchEvent(new CustomEvent(EVT)); } catch (e) {}
  return data;
}

export function subscribe(fn) {
  const handler = () => fn(load());
  window.addEventListener('storage', handler);
  window.addEventListener(EVT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(EVT, handler);
  };
}

export function newSlug(name, data) {
  const base = slugify(name);
  const taken = new Set([...data.women, ...data.newfaces].map(m => m.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(base + n)) n++;
  return base + n;
}

export function blankModel() {
  return { name: 'New Model', slug: '', cat: 'women', city: '', height: '', bust: '', waist: '', hips: '', shoes: '', hair: '', eyes: '', bio: '', photos: [] };
}
