import { supabase } from './supabase-config.js';
import { DEFAULTS }  from './defaults.js';

// ── Helpers ──────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function setText(el, val) { if (el && val !== undefined) el.textContent = val; }
function setHtml(el, val) { if (el && val !== undefined) el.innerHTML = val; }

// ── Photo strip (gallery) ─────────────────────────────────────────────────────
function applyGallery(photoUrls) {
  const track = document.getElementById('photo-strip-track');
  if (!track || !photoUrls?.length) return;
  const imgs = photoUrls.map((url, i) =>
    `<img src="${esc(url)}" alt="Work sample" loading="${i === 0 ? 'eager' : 'lazy'}" />`
  ).join('');
  track.innerHTML =
    `<div class="photo-strip-content">${imgs}</div>` +
    `<div class="photo-strip-content" aria-hidden="true">${imgs}</div>`;
}

// ── Announcement bar ──────────────────────────────────────────────────────────
function applyAnnouncement(ann) {
  const bar = document.getElementById('announcement-bar');
  if (!bar) return;
  if (!ann.enabled) { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  bar.href = ann.ctaUrl || 'signup.html';
  const textEl = bar.querySelector('[data-cms="announcement.text"]');
  if (textEl) textEl.textContent = ann.text;
}

// ── Renderers ─────────────────────────────────────────────────────────────────
function applyHero(hero) {
  setText(document.querySelector('[data-cms="hero.headline"]'), hero.headline);
  setText(document.querySelector('[data-cms="hero.subtext"]'),  hero.subtext);
}

function applyServices(services) {
  const grid = document.getElementById('services-grid');
  if (!grid) return;
  grid.innerHTML = services
    .filter(s => s.visible !== false)
    .map(s => `
      <div class="card">
        <img src="${esc(s.imageUrl)}" alt="${esc(s.imageAlt || s.title)}" loading="lazy" />
        <div class="card-body">
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.description)}</p>
        </div>
      </div>`)
    .join('');
}

function applyPricing(pricing) {
  const grid = document.getElementById('pricing-grid');
  if (!grid) return;
  grid.innerHTML = pricing.map(table => `
    <div class="price-table">
      <h3>${esc(table.heading)}</h3>
      <table>
        ${table.rows.map(r =>
          `<tr><td>${esc(r.label)}</td><td>${esc(r.price)}</td></tr>`
        ).join('')}
      </table>
    </div>`).join('');
}

function applyContact(contact) {
  setText(document.querySelector('[data-cms="contact.intro"]'),   contact.intro);
  setHtml(document.querySelector('[data-cms="contact.address"]'), contact.address.replace(/\n/g, '<br>'));

  // Update every phone element — hero CTA and contact section share the same attribute
  document.querySelectorAll('[data-cms="contact.phone"]').forEach(el => {
    el.href = 'tel:+1' + contact.phone.replace(/\D/g, '');
    el.textContent = el.classList.contains('btn-primary') || el.classList.contains('btn-secondary')
      ? '📞 ' + contact.phone
      : contact.phone;
  });

  document.querySelectorAll('[data-cms="contact.email"]').forEach(el => {
    el.href = 'mailto:' + contact.email;
    el.textContent = el.classList.contains('btn-primary') || el.classList.contains('btn-secondary')
      ? '✉ ' + contact.email
      : contact.email;
  });

  setText(document.querySelector('[data-cms="contact.hours"]'), contact.hours);
}

function applyFooter(footer) {
  setText(document.querySelector('[data-cms="footer.text"]'), footer.text);
}

function applyContent(data) {
  if (data.announcement) applyAnnouncement(data.announcement);
  if (data.hero)         applyHero(data.hero);
  if (data.services)     applyServices(data.services);
  if (data.pricing)      applyPricing(data.pricing);
  if (data.contact)      applyContact(data.contact);
  if (data.footer)       applyFooter(data.footer);
  if (data.gallery)      applyGallery(data.gallery);
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
async function loadContent() {
  applyContent(DEFAULTS);
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 1)
      .single();

    if (error || !data) return;

    const remote = data.content;

    // Merge pricing: DEFAULTS tables always present; Supabase edits overlay by id.
    // Never use remote.pricing || DEFAULTS.pricing — that would erase DEFAULTS
    // tables any time the DB has saved pricing data.
    const remotePricingById = Object.fromEntries(
      (remote.pricing || []).map(t => [t.id, t])
    );
    const mergedPricing = DEFAULTS.pricing.map(t =>
      remotePricingById[t.id] ? { ...t, ...remotePricingById[t.id] } : t
    );
    (remote.pricing || []).forEach(t => {
      if (!DEFAULTS.pricing.find(d => d.id === t.id)) mergedPricing.push(t);
    });

    applyContent({
      announcement: { ...DEFAULTS.announcement, ...remote.announcement },
      hero:         { ...DEFAULTS.hero,          ...remote.hero },
      services:     remote.services || DEFAULTS.services,
      pricing:      mergedPricing,
      contact:      { ...DEFAULTS.contact,       ...remote.contact },
      footer:       { ...DEFAULTS.footer,        ...remote.footer },
      gallery:      remote.gallery || DEFAULTS.gallery
    });
  } catch (err) {
    console.info('Supabase unavailable; using built-in defaults.', err.message);
  }
}

loadContent();
