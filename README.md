# Small Business Website Template

A complete, production-proven website with a no-code admin CMS. Built for small businesses that need a professional presence, editable content, a lead capture form, and a photo gallery — all without a monthly SaaS fee.

**Live example:** Stanford Dental Lab (built from this template)

---

## Stack

| Layer | Tool | Cost |
|-------|------|------|
| Hosting + CDN | Vercel | Free |
| Database + Auth + Storage | Supabase | Free |
| Email notifications | EmailJS | Free |
| Source control | GitHub | Free |
| Domain (optional) | Any registrar | ~$12/yr |

---

## For Developers

### What you need before starting
- GitHub account
- Supabase account (supabase.com)
- Vercel account (vercel.com)
- 30–60 minutes

---

### Step 1 — Create your repo

1. Go to the template repo on GitHub
2. Click **Use this template** → **Create a new repository**
3. Name it after the client (e.g. `acme-plumbing-website`)
4. Clone it locally

---

### Step 2 — Set up Supabase

1. Go to supabase.com → **New Project** → name it after the client
2. Wait for the project to provision (~1 min)
3. Go to **SQL Editor** → **New Query**
4. Paste the contents of `supabase-setup.sql` → click **Run**
5. Go to **Project Settings → API**
6. Copy the **Project URL** and **anon public** key
7. Paste them into `js/supabase-config.js`:
   ```js
   const SUPABASE_URL      = 'https://yourproject.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGci...';
   ```
8. Create the admin login: **Authentication → Users → Add User**
   - Use the business owner's email and a strong password
   - Tell them to change it after first login (Settings → Account)

---

### Step 3 — Fill in the content

Edit `js/defaults.js` — replace every placeholder with real business content:
- Business name, tagline, description
- Services (titles, descriptions, image paths)
- Pricing tables
- Contact info (phone, email, address, hours)
- Footer text

Edit `index.html` — search for `REPLACE:` comments and update:
- Page `<title>`
- Brand name and icon in the navbar
- Hero background image (or use the default)
- Trusted-by marquee names
- Google Maps embed URL (get it from maps.google.com → Share → Embed)
- Footer fallback text

Add photos to the `/photos/` folder and list them in `DEFAULTS.gallery`.

---

### Step 4 — Deploy to Vercel

1. Go to vercel.com → **New Project** → **Import Git Repository**
2. Select the GitHub repo → click **Deploy**
3. Vercel auto-deploys on every `git push` to `main`/`master`
4. Add a custom domain in **Project Settings → Domains** (optional)

---

### Step 5 — Test end-to-end

- [ ] Visit the live URL — content loads from defaults
- [ ] Visit `/admin.html` — log in with the Supabase user credentials
- [ ] Edit the hero headline → Save Changes → refresh the public site
- [ ] Upload a gallery photo → Save Changes → verify it appears on the public site
- [ ] Fill out the sign-up form (`signup.html`) → check Leads tab in admin

---

### How the CMS works

Every editable element in `index.html` has a `data-cms` attribute:
```html
<h1 data-cms="hero.headline">Default Headline</h1>
```

`js/defaults.js` has a matching key:
```js
DEFAULTS.hero.headline = 'Default Headline'
```

On page load, `js/app.js`:
1. Immediately renders `DEFAULTS` (page works even if DB is down)
2. Fetches the saved content from Supabase
3. Merges it on top of DEFAULTS
4. Updates every `data-cms` element

**Data merge rules:**
- Scalar fields (strings, booleans): spread merge — `{ ...DEFAULTS.section, ...remote.section }`
- Pricing / services arrays: merge by `id` field — DEFAULTS is always the base, Supabase overlays by id
- Gallery (URL array): Supabase wins entirely if present

**Why id-based merge for pricing?** If you add a new pricing table to DEFAULTS after the client has already saved content, Supabase's saved data doesn't have that table. Merging by id ensures new DEFAULTS tables always appear. Never use `remote.pricing || DEFAULTS.pricing` — that would erase new tables.

---

### Adding a new editable section

1. Add a `data-cms` attribute to the HTML element: `data-cms="section.field"`
2. Add the matching key to `DEFAULTS` in `js/defaults.js`
3. Add a renderer function in `js/app.js` that reads the attribute and updates the DOM
4. Add a form field in `admin.html`
5. Wire it up in `js/admin.js` (`populateForms` and `collectDraft`)

---

### Folder structure

```
/
├── index.html              Public website
├── admin.html              Admin dashboard (password-protected)
├── signup.html             Lead capture / landing page (create this per client)
├── theme.css               Public site styles
├── admin.css               Admin panel styles
├── vercel.json             Cache headers — do not change
├── supabase-setup.sql      Run once to set up the database
├── .env.example            Documents required config values
├── js/
│   ├── supabase-config.js  Supabase credentials — fill in per project
│   ├── defaults.js         All default content — fill in per client
│   ├── app.js              Public site renderer — no changes needed
│   └── admin.js            Admin panel logic — no changes needed
└── photos/                 Static fallback images
    └── placeholder.jpg     Replace with real photos
```

---

## For Business Owners

### How to log into your admin panel

1. Open your browser and go to: `yourwebsite.com/admin.html`
2. Enter the email and password your developer gave you
3. Click **Sign In**

---

### What you can edit

**Announcement Bar** — The colored banner at the very top of your site.
- Turn it on or off with the toggle
- Change the message text
- Change what page it links to when clicked
- Use it for promotions, vacation notices, or special offers

**Homepage Banner** — The big headline and description visitors read first.
- Change the headline
- Change the description paragraph
- Update your phone number and email (these appear on the "Call Us" and "Email Us" buttons)

**Our Services** — The cards showing what your business offers.
- Change the title and description of each card
- Replace the photo on any card
- Hide a card temporarily without deleting it (use the toggle)

**Price List** — Your pricing tables.
- Edit any price by clicking on it
- Delete an item with the ✕ button
- Add a new item with "+ Add Item"
- Add a whole new category with "Add a New Price Category"
- Delete a whole category with "Delete Category"

**Contact Information** — Your phone, email, address, and hours.
- Any change here updates the contact section AND the hero buttons automatically

**Page Footer** — The small text at the very bottom of the page.

**New Leads** — People who filled out the sign-up form on your website.
- Shows their name, business, phone, email, and city
- Call or email them to follow up

**Gallery Photos** — The scrolling photo strip showing your work.
- Click the upload area to add new photos (select multiple at once)
- Hover over any photo and click the red ✕ to remove it

---

### Saving your changes

After making any changes, always click the **Save Changes** button at the bottom of the screen. Your website updates within a few seconds.

---

### What to do if something looks wrong

1. Try a hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. If the change you made isn't showing, go back to admin and click Save Changes again
3. If you can't log in, contact your developer to reset your password
4. If the website looks broken, contact your developer — do not try to fix it yourself

---

## EmailJS Setup (optional — for lead notification emails)

When someone fills out your sign-up form, you can get an instant email notification.

1. Go to emailjs.com → create a free account
2. **Add Email Service** → connect your email provider
3. **Email Templates** → New Template → use these variables:
   ```
   {{name}}, {{business}}, {{phone}}, {{email}}, {{city}}
   ```
4. Copy your **Service ID**, **Template ID**, and **Public Key**
5. Paste them into `signup.html` where marked with `YOUR_EMAILJS_*` placeholders

If EmailJS is not configured, form submissions still save to Supabase — you just won't get an instant email.
