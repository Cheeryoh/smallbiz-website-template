import { supabase }          from './supabase-config.js';
import { DEFAULTS }           from './defaults.js';

// ── In-memory draft ───────────────────────────────────────────────────────────
let draft = JSON.parse(JSON.stringify(DEFAULTS));

// ── DOM shortcuts ─────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const loginPage  = $('login-page');
const adminPage  = $('admin-page');
const loginError = $('login-error');
const toast      = $('toast');
const saveBtn    = $('save-btn');
const saveStatus = $('save-status');
const fileInput  = $('image-file-input');

// ── Utilities ─────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(message, type = 'success') {
  toast.textContent = (type === 'success' ? '✅ ' : '❌ ') + message;
  toast.className = 'toast ' + type;
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    loginPage.style.display = 'none';
    adminPage.style.display = 'flex';
    loadDraft();
  } else {
    loginPage.style.display = 'flex';
    adminPage.style.display = 'none';
  }
});

$('login-btn').addEventListener('click', async () => {
  const email    = $('login-email').value.trim();
  const password = $('login-password').value;
  loginError.classList.remove('visible');

  if (!email || !password) {
    loginError.textContent = 'Please enter your email and password.';
    loginError.classList.add('visible');
    return;
  }

  $('login-btn').textContent = 'Signing in…';
  $('login-btn').disabled = true;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msgs = {
      'Invalid login credentials': 'Wrong email or password. Please try again.',
      'Email not confirmed':        'Please confirm your email address first.'
    };
    loginError.textContent = msgs[error.message] || 'Could not sign in. Please try again.';
    loginError.classList.add('visible');
    $('login-btn').textContent = 'Sign In';
    $('login-btn').disabled = false;
  }
});

$('login-password').addEventListener('keydown', e => {
  if (e.key === 'Enter') $('login-btn').click();
});

$('logout-btn').addEventListener('click', async () => {
  await supabase.auth.signOut();
});

// ── NAVIGATION ────────────────────────────────────────────────────────────────
const sectionMeta = {
  announcement: { title: 'Announcement Bar',     hint: 'The banner at the very top of your website' },
  hero:         { title: 'Homepage Banner',       hint: 'Edit the headline and description visitors see first' },
  services: { title: 'Our Services',             hint: 'Edit service card titles, descriptions, and photos' },
  pricing:  { title: 'Price List',               hint: 'Add, edit, or remove items from your pricing tables' },
  contact:  { title: 'Contact Information',      hint: 'Update your phone, email, address, and hours' },
  footer:   { title: 'Page Footer',              hint: 'Edit the text at the very bottom of your website' },
  leads:    { title: 'New Leads — Sign-Ups',     hint: 'People who filled out your sign-up form' },
  gallery:  { title: 'Gallery Photos',           hint: 'Upload and remove photos shown in the "Our Work" section' }
};

document.getElementById('sidebar-nav').addEventListener('click', e => {
  const btn = e.target.closest('button[data-section]');
  if (!btn) return;
  const section = btn.dataset.section;

  document.querySelectorAll('#sidebar-nav button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + section).classList.add('active');

  $('topbar-title').textContent = sectionMeta[section].title;
  $('topbar-hint').textContent  = sectionMeta[section].hint;
});

// ── LOAD DRAFT ────────────────────────────────────────────────────────────────
async function loadDraft() {
  saveStatus.textContent = 'Loading your content…';
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 1)
      .single();

    if (data && !error) {
      const remote = data.content;
      // Merge pricing by id — DEFAULTS tables always appear as base
      const remotePricingById = Object.fromEntries(
        (remote.pricing || []).map(t => [t.id, t])
      );
      const mergedPricing = DEFAULTS.pricing.map(t =>
        remotePricingById[t.id] ? { ...t, ...remotePricingById[t.id] } : t
      );
      (remote.pricing || []).forEach(t => {
        if (!DEFAULTS.pricing.find(d => d.id === t.id)) mergedPricing.push(t);
      });
      draft = {
        announcement: { ...DEFAULTS.announcement, ...remote.announcement },
        hero:         { ...DEFAULTS.hero,          ...remote.hero },
        services: remote.services || DEFAULTS.services,
        pricing:  mergedPricing,
        contact:  { ...DEFAULTS.contact, ...remote.contact },
        footer:   { ...DEFAULTS.footer,  ...remote.footer },
        gallery:  remote.gallery  || DEFAULTS.gallery
      };
    }
  } catch (err) {
    console.warn('Could not load content, using defaults.', err.message);
  }
  populateForms();
  saveStatus.textContent = '';
}

// ── POPULATE FORMS ────────────────────────────────────────────────────────────
function populateForms() {
  const ann = draft.announcement || DEFAULTS.announcement;
  $('announcement-enabled').checked  = ann.enabled !== false;
  $('announcement-enabled-label').textContent = ann.enabled !== false ? 'Showing on website' : 'Hidden from website';
  $('announcement-text').value       = ann.text   || '';
  $('announcement-cta-url').value    = ann.ctaUrl || 'signup.html';

  $('hero-headline').value = draft.hero.headline;
  $('hero-subtext').value  = draft.hero.subtext;
  $('hero-phone').value    = draft.contact.phone;
  $('hero-email').value    = draft.contact.email;

  renderServicesEditor();
  renderPricingEditor();

  $('contact-phone').value   = draft.contact.phone;
  $('contact-email').value   = draft.contact.email;
  $('contact-address').value = draft.contact.address;
  $('contact-hours').value   = draft.contact.hours;
  $('contact-intro').value   = draft.contact.intro;

  $('footer-text').value = draft.footer.text;
}

// ── SERVICES EDITOR ───────────────────────────────────────────────────────────
function renderServicesEditor() {
  const container = $('services-editor');
  container.innerHTML = draft.services.map((svc, i) => `
    <div class="service-editor-card" data-svc-index="${i}">
      <div class="service-card-header">
        <strong>Service Card ${i + 1}</strong>
      </div>

      <img class="service-img-preview" id="svc-img-preview-${i}"
           src="${esc(svc.imageUrl)}" alt="${esc(svc.title)}" />

      <div style="margin-bottom:1rem;">
        <button class="btn-upload-photo" data-upload-svc="${i}">
          📷 Replace Photo
        </button>
        <div class="upload-progress" id="svc-upload-progress-${i}">Uploading photo…</div>
      </div>

      <div class="field-group">
        <label class="field-label" for="svc-title-${i}">Card Title</label>
        <input type="text" class="admin-input" id="svc-title-${i}"
               value="${esc(svc.title)}" placeholder="e.g. Service Name" />
      </div>

      <div class="field-group" style="margin-bottom:0.75rem;">
        <label class="field-label" for="svc-desc-${i}">Description</label>
        <textarea class="admin-textarea" id="svc-desc-${i}"
                  rows="3">${esc(svc.description)}</textarea>
      </div>

      <div class="toggle-row">
        <label class="toggle-switch">
          <input type="checkbox" id="svc-visible-${i}" ${svc.visible !== false ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
        <span style="font-weight:600; font-size:0.95rem;">
          Show this card on the website
        </span>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('[data-upload-svc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.uploadSvc, 10);
      fileInput.dataset.uploadTarget = 'service';
      fileInput.dataset.uploadIndex  = idx;
      fileInput.value = '';
      fileInput.click();
    });
  });
}

// ── PRICING EDITOR ────────────────────────────────────────────────────────────
function renderPricingEditor() {
  const container = $('pricing-editor');
  container.innerHTML = draft.pricing.map((table, ti) => `
    <div class="pricing-table-editor" data-table-index="${ti}">
      <div class="pricing-table-header">
        <input class="table-heading-input" type="text"
               value="${esc(table.heading)}" placeholder="Category name"
               data-table-heading="${ti}" />
        <button class="btn-delete-table" data-delete-table="${ti}">
          🗑 Delete Category
        </button>
      </div>
      <div class="price-rows-list" id="rows-${ti}">
        ${table.rows.map((row, ri) => rowHTML(ti, ri, row)).join('')}
      </div>
      <button class="add-row-btn" data-add-row="${ti}">
        + Add Item to this Category
      </button>
    </div>
  `).join('');

  bindPricingEvents(container);
}

function rowHTML(ti, ri, row) {
  return `
    <div class="price-row" data-row-index="${ri}">
      <input type="text" class="row-label" value="${esc(row.label)}" placeholder="Item name" />
      <input type="text" class="row-price" value="${esc(row.price)}" placeholder="$0" />
      <button class="btn-delete-row" data-delete-row="${ri}"
              data-table-index="${ti}" title="Remove this item">✕</button>
    </div>`;
}

function bindPricingEvents(container) {
  container.querySelectorAll('[data-add-row]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ti = parseInt(btn.dataset.addRow, 10);
      draft.pricing[ti].rows.push({ label: '', price: '' });
      rerenderTableRows(ti);
    });
  });

  container.addEventListener('click', e => {
    const delBtn = e.target.closest('[data-delete-row]');
    if (!delBtn) return;
    const ti = parseInt(delBtn.dataset.tableIndex, 10);
    const ri = parseInt(delBtn.dataset.deleteRow, 10);
    if (!confirm('Remove this price item?')) return;
    draft.pricing[ti].rows.splice(ri, 1);
    rerenderTableRows(ti);
  });

  container.querySelectorAll('[data-delete-table]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ti   = parseInt(btn.dataset.deleteTable, 10);
      const name = draft.pricing[ti].heading;
      if (!confirm(`Delete the entire "${name}" category and all its prices?`)) return;
      draft.pricing.splice(ti, 1);
      renderPricingEditor();
    });
  });
}

function rerenderTableRows(ti) {
  const tbody = $('rows-' + ti);
  if (!tbody) return;
  tbody.innerHTML = draft.pricing[ti].rows.map((row, ri) => rowHTML(ti, ri, row)).join('');
}

$('add-table-btn').addEventListener('click', () => {
  draft.pricing.push({ id: 'table-' + Date.now(), heading: 'New Category', rows: [{ label: '', price: '' }] });
  renderPricingEditor();
  document.querySelectorAll('.pricing-table-editor').at(-1)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ── IMAGE UPLOAD ──────────────────────────────────────────────────────────────
fileInput.addEventListener('change', async () => {
  const file   = fileInput.files[0];
  const target = fileInput.dataset.uploadTarget;
  const idx    = parseInt(fileInput.dataset.uploadIndex, 10);
  if (!file) return;

  if (target === 'service') {
    const progress = $('svc-upload-progress-' + idx);
    const preview  = $('svc-img-preview-' + idx);
    progress.classList.add('visible');

    try {
      const path = `${draft.services[idx].id}-${Date.now()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('service-images')
        .getPublicUrl(uploadData.path);

      draft.services[idx].imageUrl = urlData.publicUrl;
      preview.src = urlData.publicUrl;
      showToast('Photo uploaded! Remember to click Save Changes.');
    } catch (err) {
      showToast('Photo upload failed. Please try again.', 'error');
      console.error(err);
    } finally {
      progress.classList.remove('visible');
    }
  }
});

// ── COLLECT FORM VALUES ───────────────────────────────────────────────────────
function collectDraft() {
  draft.announcement = {
    enabled:  $('announcement-enabled').checked,
    text:     $('announcement-text').value.trim(),
    ctaUrl:   $('announcement-cta-url').value.trim() || 'signup.html'
  };

  draft.hero.headline  = $('hero-headline').value.trim();
  draft.hero.subtext   = $('hero-subtext').value.trim();

  draft.contact.phone   = $('contact-phone').value.trim() || $('hero-phone').value.trim();
  draft.contact.email   = $('contact-email').value.trim() || $('hero-email').value.trim();
  draft.contact.address = $('contact-address').value.trim();
  draft.contact.hours   = $('contact-hours').value.trim();
  draft.contact.intro   = $('contact-intro').value.trim();

  draft.services.forEach((svc, i) => {
    svc.title       = ($('svc-title-' + i)?.value   ?? svc.title).trim();
    svc.description = ($('svc-desc-' + i)?.value    ?? svc.description).trim();
    svc.visible     = $('svc-visible-' + i)?.checked ?? svc.visible;
  });

  document.querySelectorAll('.pricing-table-editor').forEach((tableEl, ti) => {
    if (!draft.pricing[ti]) return;
    draft.pricing[ti].heading = tableEl.querySelector('.table-heading-input')?.value.trim() ?? '';
    const rows = [];
    tableEl.querySelectorAll('.price-row').forEach(rowEl => {
      const label = rowEl.querySelector('.row-label')?.value.trim() ?? '';
      const price = rowEl.querySelector('.row-price')?.value.trim() ?? '';
      if (label || price) rows.push({ label, price });
    });
    draft.pricing[ti].rows = rows;
  });

  draft.footer.text = $('footer-text').value.trim();
}

// ── LEADS ─────────────────────────────────────────────────────────────────────
async function loadLeads() {
  const container = $('leads-table-container');
  const badge     = $('leads-badge');
  container.innerHTML = '<p style="color:#4A5568;">Loading leads…</p>';

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    container.innerHTML = '<p style="color:#C53030;">Could not load leads. Please try again.</p>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem; color:#718096;">
        <div style="font-size:3rem; margin-bottom:1rem;">📭</div>
        <p style="font-size:1.1rem; font-weight:600;">No leads yet.</p>
        <p>When someone fills out the sign-up form, they'll appear here.</p>
      </div>`;
    return;
  }

  badge.textContent = data.length;
  badge.style.display = 'inline';

  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
        <thead>
          <tr style="background:#EDF2F7; text-align:left;">
            <th style="padding:0.75rem 1rem; font-weight:700; white-space:nowrap;">Date</th>
            <th style="padding:0.75rem 1rem; font-weight:700;">Name</th>
            <th style="padding:0.75rem 1rem; font-weight:700;">Business</th>
            <th style="padding:0.75rem 1rem; font-weight:700;">Phone</th>
            <th style="padding:0.75rem 1rem; font-weight:700;">Email</th>
            <th style="padding:0.75rem 1rem; font-weight:700;">City</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((lead, i) => `
            <tr style="border-bottom:1px solid #E2E8F0; background:${i % 2 === 0 ? '#fff' : '#F7FAFC'};">
              <td style="padding:0.7rem 1rem; white-space:nowrap; color:#4A5568;">
                ${new Date(lead.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
              </td>
              <td style="padding:0.7rem 1rem; font-weight:600;">${esc(lead.name || '—')}</td>
              <td style="padding:0.7rem 1rem;">${esc(lead.business || '—')}</td>
              <td style="padding:0.7rem 1rem;">
                ${lead.phone ? `<a href="tel:${esc(lead.phone)}" style="color:#2B6CB0;">${esc(lead.phone)}</a>` : '—'}
              </td>
              <td style="padding:0.7rem 1rem;">
                ${lead.email ? `<a href="mailto:${esc(lead.email)}" style="color:#2B6CB0;">${esc(lead.email)}</a>` : '—'}
              </td>
              <td style="padding:0.7rem 1rem;">${esc(lead.city || '—')}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p style="margin-top:1rem; color:#718096; font-size:0.85rem;">${data.length} lead${data.length !== 1 ? 's' : ''} total</p>`;
}

// ── GALLERY ───────────────────────────────────────────────────────────────────
function renderGalleryEditor() {
  const grid = $('gallery-grid');
  if (!grid) return;
  const photos = draft.gallery || [];
  if (photos.length === 0) {
    grid.innerHTML = '<p style="color:#718096; text-align:center; padding:2rem;">No photos yet. Upload some above!</p>';
    return;
  }
  grid.innerHTML = photos.map((url, i) => `
    <div class="gallery-item" data-gallery-index="${i}">
      <img src="${esc(url)}" alt="Gallery photo ${i + 1}" loading="lazy" />
      <button class="gallery-delete-btn" data-delete-gallery="${i}" title="Remove this photo">✕</button>
    </div>`).join('');

  grid.querySelectorAll('[data-delete-gallery]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.deleteGallery, 10);
      const url = draft.gallery[idx];
      if (!confirm('Remove this photo from the gallery?')) return;
      draft.gallery.splice(idx, 1);
      if (url.includes('supabase')) {
        const path = url.split('/service-images/')[1];
        if (path) supabase.storage.from('service-images').remove([path]).catch(() => {});
      }
      renderGalleryEditor();
      showToast('Photo removed. Click Save Changes to publish.');
    });
  });
}

const galleryFileInput = $('gallery-file-input');
$('gallery-upload-trigger').addEventListener('click', () => {
  galleryFileInput.value = '';
  galleryFileInput.click();
});

galleryFileInput.addEventListener('change', async () => {
  const files = Array.from(galleryFileInput.files);
  if (!files.length) return;

  const progress = $('gallery-upload-progress');
  progress.classList.add('visible');

  if (!draft.gallery) draft.gallery = [...DEFAULTS.gallery];

  let uploaded = 0, failed = 0;
  for (const file of files) {
    try {
      const path = `gallery-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('service-images').getPublicUrl(uploadData.path);
      draft.gallery.push(urlData.publicUrl);
      uploaded++;
    } catch (err) {
      console.error('Gallery upload failed:', err);
      failed++;
    }
  }

  progress.classList.remove('visible');
  renderGalleryEditor();

  if (failed === 0) {
    showToast(`${uploaded} photo${uploaded !== 1 ? 's' : ''} uploaded! Click Save Changes to publish.`);
  } else {
    showToast(`${uploaded} uploaded, ${failed} failed. Check your internet and try again.`, 'error');
  }
});

// Toggle label update
document.getElementById('announcement-enabled')?.addEventListener('change', function () {
  $('announcement-enabled-label').textContent = this.checked ? 'Showing on website' : 'Hidden from website';
});

// Load leads / gallery when switching to those tabs
document.getElementById('sidebar-nav').addEventListener('click', e => {
  if (e.target.closest('[data-section="leads"]'))   loadLeads();
  if (e.target.closest('[data-section="gallery"]')) renderGalleryEditor();
}, true);

// ── SAVE ──────────────────────────────────────────────────────────────────────
saveBtn.addEventListener('click', async () => {
  collectDraft();
  saveBtn.disabled = true;
  saveBtn.textContent = '💾 Saving…';
  saveStatus.textContent = '';

  const { error } = await supabase
    .from('site_content')
    .upsert({ id: 1, content: draft, updated_at: new Date().toISOString() });

  if (error) {
    showToast('Could not save. Please check your internet connection and try again.', 'error');
    console.error(error);
  } else {
    showToast('Your changes have been saved! The website will update in a moment.');
    saveStatus.textContent = 'Last saved: ' + new Date().toLocaleTimeString();
  }

  saveBtn.disabled = false;
  saveBtn.textContent = '💾 Save Changes';
});
