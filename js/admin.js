import { supabase }               from './supabase-config.js';
import { DEFAULTS }                from './defaults.js';
import { t, setLanguage, getLang } from './i18n.js';

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

// ── LANGUAGE TOGGLE ───────────────────────────────────────────────────────────
document.getElementById('lang-toggle').addEventListener('click', e => {
  const btn = e.target.closest('.lang-btn');
  if (!btn) return;
  setLanguage(btn.dataset.lang);
  // Re-render dynamic sections so their strings update too
  renderServicesEditor();
  renderPricingEditor();
  // Re-render leads/gallery if visible
  if ($('section-leads').classList.contains('active'))   loadLeads();
  if ($('section-gallery').classList.contains('active')) renderGalleryEditor();
  // Update toggle label, save button, announcement label
  saveBtn.textContent = t('saveBtn');
  const annEnabled = $('announcement-enabled');
  if (annEnabled) {
    $('announcement-enabled-label').textContent = annEnabled.checked
      ? t('annShowing') : t('annHidden');
  }
});

// Apply saved language on load (before auth resolves)
setLanguage(getLang());

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
    loginError.textContent = t('missingCredentials');
    loginError.classList.add('visible');
    return;
  }

  $('login-btn').textContent = t('signingIn');
  $('login-btn').disabled = true;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const msgs = {
      'Invalid login credentials': t('wrongCredentials'),
      'Email not confirmed':        t('emailNotConfirmed')
    };
    loginError.textContent = msgs[error.message] || t('signInFailed');
    loginError.classList.add('visible');
    $('login-btn').textContent = t('loginBtn');
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
// sectionMeta reads from t() so it reflects the active language at call time
function getSectionMeta(section) {
  const map = {
    announcement: { titleKey: 'titleAnnouncement', hintKey: 'hintAnnouncement' },
    hero:         { titleKey: 'titleHero',         hintKey: 'hintHero'         },
    services:     { titleKey: 'titleServices',     hintKey: 'hintServices'     },
    pricing:      { titleKey: 'titlePricing',      hintKey: 'hintPricing'      },
    contact:      { titleKey: 'titleContact',      hintKey: 'hintContact'      },
    footer:       { titleKey: 'titleFooter',       hintKey: 'hintFooter'       },
    leads:        { titleKey: 'titleLeads',        hintKey: 'hintLeads'        },
    gallery:      { titleKey: 'titleGallery',      hintKey: 'hintGallery'      },
  };
  const m = map[section];
  return m ? { title: t(m.titleKey), hint: t(m.hintKey) } : { title: section, hint: '' };
}

document.getElementById('sidebar-nav').addEventListener('click', e => {
  const btn = e.target.closest('button[data-section]');
  if (!btn) return;
  const section = btn.dataset.section;

  document.querySelectorAll('#sidebar-nav button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + section).classList.add('active');

  const meta = getSectionMeta(section);
  $('topbar-title').textContent = meta.title;
  $('topbar-hint').textContent  = meta.hint;
});

// ── LOAD DRAFT ────────────────────────────────────────────────────────────────
async function loadDraft() {
  saveStatus.textContent = t('loadingContent');
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
        (remote.pricing || []).map(tbl => [tbl.id, tbl])
      );
      const mergedPricing = DEFAULTS.pricing.map(tbl =>
        remotePricingById[tbl.id] ? { ...tbl, ...remotePricingById[tbl.id] } : tbl
      );
      (remote.pricing || []).forEach(tbl => {
        if (!DEFAULTS.pricing.find(d => d.id === tbl.id)) mergedPricing.push(tbl);
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
  $('announcement-enabled-label').textContent = ann.enabled !== false
    ? t('annShowing') : t('annHidden');
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
  if (!container) return;
  container.innerHTML = draft.services.map((svc, i) => `
    <div class="service-editor-card" data-svc-index="${i}">
      <div class="service-card-header">
        <strong>${t('serviceCardN')} ${i + 1}</strong>
      </div>

      <img class="service-img-preview" id="svc-img-preview-${i}"
           src="${esc(svc.imageUrl)}" alt="${esc(svc.title)}" />

      <div style="margin-bottom:1rem;">
        <button class="btn-upload-photo" data-upload-svc="${i}">
          ${t('replacePhoto')}
        </button>
        <div class="upload-progress" id="svc-upload-progress-${i}">${t('uploadingPhoto')}</div>
      </div>

      <div class="field-group">
        <label class="field-label" for="svc-title-${i}">${t('cardTitleLabel')}</label>
        <input type="text" class="admin-input" id="svc-title-${i}"
               value="${esc(svc.title)}" placeholder="e.g. Service Name" />
      </div>

      <div class="field-group" style="margin-bottom:0.75rem;">
        <label class="field-label" for="svc-desc-${i}">${t('cardDescLabel')}</label>
        <textarea class="admin-textarea" id="svc-desc-${i}"
                  rows="3">${esc(svc.description)}</textarea>
      </div>

      <div class="toggle-row">
        <label class="toggle-switch">
          <input type="checkbox" id="svc-visible-${i}" ${svc.visible !== false ? 'checked' : ''} />
          <span class="toggle-slider"></span>
        </label>
        <span style="font-weight:600; font-size:0.95rem;">
          ${t('showCardLabel')}
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
  if (!container) return;
  container.innerHTML = draft.pricing.map((table, ti) => `
    <div class="pricing-table-editor" data-table-index="${ti}">
      <div class="pricing-table-header">
        <input class="table-heading-input" type="text"
               value="${esc(table.heading)}" placeholder="${t('categoryPlaceholder')}"
               data-table-heading="${ti}" />
        <button class="btn-delete-table" data-delete-table="${ti}">
          ${t('deleteCategoryBtn')}
        </button>
      </div>
      <div class="price-rows-list" id="rows-${ti}">
        ${table.rows.map((row, ri) => rowHTML(ti, ri, row)).join('')}
      </div>
      <button class="add-row-btn" data-add-row="${ti}">
        ${t('addRowBtn')}
      </button>
    </div>
  `).join('');

  bindPricingEvents(container);
}

function rowHTML(ti, ri, row) {
  return `
    <div class="price-row" data-row-index="${ri}">
      <input type="text" class="row-label" value="${esc(row.label)}" placeholder="${t('itemNamePlaceholder')}" />
      <input type="text" class="row-price" value="${esc(row.price)}" placeholder="${t('itemPricePlaceholder')}" />
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
    if (!confirm(t('deleteRowConfirm'))) return;
    draft.pricing[ti].rows.splice(ri, 1);
    rerenderTableRows(ti);
  });

  container.querySelectorAll('[data-delete-table]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ti   = parseInt(btn.dataset.deleteTable, 10);
      const name = draft.pricing[ti].heading;
      if (!confirm(t('deleteCategoryConfirm').replace('{name}', name))) return;
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
  draft.pricing.push({ id: 'table-' + Date.now(), heading: t('newCategoryName'), rows: [{ label: '', price: '' }] });
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
      showToast(t('toastPhotoUploaded'));
    } catch (err) {
      showToast(t('toastPhotoFailed'), 'error');
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
  container.innerHTML = `<p style="color:#4A5568;">${t('leadsLoading')}</p>`;

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    container.innerHTML = `<p style="color:#C53030;">${t('leadsError')}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem; color:#718096;">
        <div style="font-size:3rem; margin-bottom:1rem;">📭</div>
        <p style="font-size:1.1rem; font-weight:600;">${t('leadsEmptyTitle')}</p>
        <p>${t('leadsEmptyDesc')}</p>
      </div>`;
    return;
  }

  badge.textContent = data.length;
  badge.style.display = 'inline';

  const locale = getLang() === 'ko' ? 'ko-KR' : 'en-US';
  const totalStr = data.length === 1
    ? t('leadsTotal').replace('{n}', data.length)
    : t('leadsTotalPlural').replace('{n}', data.length);

  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:0.9rem;">
        <thead>
          <tr style="background:#EDF2F7; text-align:left;">
            <th style="padding:0.75rem 1rem; font-weight:700; white-space:nowrap;">${t('leadsColDate')}</th>
            <th style="padding:0.75rem 1rem; font-weight:700;">${t('leadsColName')}</th>
            <th style="padding:0.75rem 1rem; font-weight:700;">${t('leadsColBusiness')}</th>
            <th style="padding:0.75rem 1rem; font-weight:700;">${t('leadsColPhone')}</th>
            <th style="padding:0.75rem 1rem; font-weight:700;">${t('leadsColEmail')}</th>
            <th style="padding:0.75rem 1rem; font-weight:700;">${t('leadsColCity')}</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((lead, i) => `
            <tr style="border-bottom:1px solid #E2E8F0; background:${i % 2 === 0 ? '#fff' : '#F7FAFC'};">
              <td style="padding:0.7rem 1rem; white-space:nowrap; color:#4A5568;">
                ${new Date(lead.created_at).toLocaleDateString(locale, { month:'short', day:'numeric', year:'numeric' })}
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
    <p style="margin-top:1rem; color:#718096; font-size:0.85rem;">${totalStr}</p>`;
}

// ── GALLERY ───────────────────────────────────────────────────────────────────
function renderGalleryEditor() {
  const grid = $('gallery-grid');
  if (!grid) return;
  const photos = draft.gallery || [];
  if (photos.length === 0) {
    grid.innerHTML = `<p style="color:#718096; text-align:center; padding:2rem;">${t('galleryNoPhotos')}</p>`;
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
      if (!confirm(t('galleryDeleteConfirm'))) return;
      draft.gallery.splice(idx, 1);
      if (url.includes('supabase')) {
        const path = url.split('/service-images/')[1];
        if (path) supabase.storage.from('service-images').remove([path]).catch(() => {});
      }
      renderGalleryEditor();
      showToast(t('galleryPhotoRemoved'));
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
    const key = uploaded === 1 ? 'galleryUploaded' : 'galleryUploadedPlural';
    showToast(t(key).replace('{n}', uploaded));
  } else {
    showToast(t('galleryUploadFailed').replace('{u}', uploaded).replace('{f}', failed), 'error');
  }
});

// Toggle label update
document.getElementById('announcement-enabled')?.addEventListener('change', function () {
  $('announcement-enabled-label').textContent = this.checked ? t('annShowing') : t('annHidden');
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
  saveBtn.textContent = t('saving');
  saveStatus.textContent = '';

  const { error } = await supabase
    .from('site_content')
    .upsert({ id: 1, content: draft, updated_at: new Date().toISOString() });

  if (error) {
    showToast(t('toastSaveError'), 'error');
    console.error(error);
  } else {
    showToast(t('toastSaved'));
    saveStatus.textContent = t('lastSaved') + new Date().toLocaleTimeString();
  }

  saveBtn.disabled = false;
  saveBtn.textContent = t('saveBtn');
});
