// ─────────────────────────────────────────────────────────────────────────────
//  DEFAULT SITE CONTENT
//  Replace every value below with the real business content.
//  This file is the single source of truth — the website works with no database
//  by falling back to these values. Supabase saves overlay on top of these.
//
//  RULES:
//  - Keep the data structure exactly as-is (ids, keys, nesting)
//  - Replace the string values with real content
//  - Add/remove service cards and pricing rows as needed
//  - Every id must be unique and stable (used for database merge)
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULTS = {

  // ── ANNOUNCEMENT BAR ──────────────────────────────────────────────────────
  // The clickable blue banner above the navbar.
  // Set enabled: false to hide it (e.g. during vacation).
  // ctaUrl is the page visitors go to when they click the banner.
  announcement: {
    enabled:  true,
    text:     'Your promotional message here. Keep it short — one sentence works best.',
    ctaUrl:   'signup.html'
  },

  // ── HERO ──────────────────────────────────────────────────────────────────
  // The big headline and description visitors read first.
  hero: {
    headline: 'Your Business Tagline Goes Here',
    subtext:  'A short description of what you do, who you serve, and what makes you different. Two to three sentences works well here.'
  },

  // ── SERVICES ──────────────────────────────────────────────────────────────
  // Each object is one card in the "Our Services" grid.
  // visible: false hides a card without deleting it.
  // imageUrl: use a path like 'photos/service-1.jpg' or a Supabase Storage URL.
  services: [
    {
      id:          'service-1',
      title:       'Service One',
      description: 'Describe this service in 1–2 sentences. What is it, and why do customers choose it?',
      imageUrl:    'photos/placeholder.jpg',
      imageAlt:    'Service One',
      visible:     true
    },
    {
      id:          'service-2',
      title:       'Service Two',
      description: 'Describe this service in 1–2 sentences. What is it, and why do customers choose it?',
      imageUrl:    'photos/placeholder.jpg',
      imageAlt:    'Service Two',
      visible:     true
    },
    {
      id:          'service-3',
      title:       'Service Three',
      description: 'Describe this service in 1–2 sentences. What is it, and why do customers choose it?',
      imageUrl:    'photos/placeholder.jpg',
      imageAlt:    'Service Three',
      visible:     true
    }
  ],

  // ── PRICING ───────────────────────────────────────────────────────────────
  // Each object is a pricing table with a heading and rows.
  // IMPORTANT: ids must be stable — they are used to merge DB edits on top of
  // these defaults. Renaming an id will cause that table to duplicate.
  pricing: [
    {
      id:      'category-1',
      heading: 'Category One',
      rows: [
        { label: 'Item A',   price: '$00' },
        { label: 'Item B',   price: '$00' },
        { label: 'Item C',   price: 'Call' }
      ]
    },
    {
      id:      'category-2',
      heading: 'Category Two',
      rows: [
        { label: 'Item A',   price: '$00' },
        { label: 'Item B',   price: '$00' }
      ]
    }
  ],

  // ── CONTACT ───────────────────────────────────────────────────────────────
  contact: {
    intro:   'A sentence or two about how customers can reach you and what to expect when they do.',
    address: '123 Main Street\nYour City, State 00000',
    phone:   '(000) 000-0000',
    email:   'you@yourbusiness.com',
    hours:   'Mon–Fri 9am–5pm'
  },

  // ── FOOTER ────────────────────────────────────────────────────────────────
  footer: {
    text: '\u00A9 2025 Your Business Name \u00A0|\u00A0 123 Main St, Your City, State \u00A0|\u00A0 (000) 000-0000'
  },

  // ── GALLERY ───────────────────────────────────────────────────────────────
  // Array of image URLs shown in the scrolling photo strip.
  // Add your own photos to the /photos/ folder and list them here.
  // The admin panel can also upload photos to Supabase Storage.
  gallery: [
    'photos/placeholder.jpg'
  ]
};
