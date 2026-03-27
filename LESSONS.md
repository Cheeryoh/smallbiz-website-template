# Lessons Learned — Stanford Dental Lab Build

This file documents every meaningful bug and process failure from the first production project built on this template. Read it before starting a new project.

**Reference build:** Stanford Dental Lab (crowndl@yahoo.com) — San Jose, CA dental laboratory
**Original conversation:** `C:\Users\Justin O\.claude\projects\C--Users-Justin-O\b8379bbe-9e7f-48a2-9b8c-d31970052269.jsonl`

---

## Bug 1 — Unstaged file deployed as old version

**What happened:** A button was removed from `index.html`. The commit that followed staged `theme.css`, `js/app.js`, `js/defaults.js`, `admin.html`, and `js/admin.js` — but not `index.html`. Vercel deployed the old HTML from git. The button appeared gone locally but live on the site for the client.

**Root cause:** No `git status` check before committing. Assumed "files I edited = files I staged."

**Prevention:** Always run `git status` before every commit. List every modified file in your commit message. Never assume a file is staged — verify.

---

## Bug 2 — New pricing table disappearing after admin save

**What happened:** A new "Crowns & Bridges" table was added to `DEFAULTS`. It showed correctly until the client saved from the admin panel. Then it vanished. The bug: `app.js` used `remote.pricing || DEFAULTS.pricing` — any Supabase data replaced the entire defaults array, wiping out tables added after the initial save.

**Root cause:** Array replacement instead of merge. The data model didn't account for growth.

**Prevention:** Arrays of objects with stable IDs must always merge by ID. DEFAULTS is the base; Supabase overlays by ID. This is already correctly implemented in this template's `app.js` and `admin.js`. Never revert it to wholesale replacement.

---

## Bug 3 — Hero CTA buttons not updating from admin

**What happened:** The admin panel saved contact info (phone, email) correctly. The hero "Call Us" and "Email Us" buttons never changed. The buttons had no `data-cms` attributes, so `applyContact()` couldn't find them.

**Root cause:** The `data-cms` convention was applied inconsistently. No upfront schema was defined.

**Prevention:** Before writing any HTML for a new project, produce a `data-cms` schema table — every editable element, its attribute value, and its key in DEFAULTS. Apply it consistently. Any element the admin can change must have the attribute.

---

## Bug 4 — Browser caching serving old JS/CSS after deploy

**What happened:** Changes to JS/CSS were deployed to Vercel but browsers served old cached files. Users (and the developer) couldn't see updates.

**Root cause:** `vercel.json` was set to `immutable` (1-year cache). This is correct for content-hashed assets but wrong for files served at stable URLs.

**Prevention:** `vercel.json` with `max-age=0, must-revalidate` is already set in this template. Never change it to `immutable` unless you add content hashing to the build.

---

## Bug 5 — Animated components required 4+ rounds of iteration

**What happened:** The photo strip and client marquee each went through multiple rounds — wrong CSS structure, wrong speed, wrong size, then user wanted smaller, then even smaller, then add lightbox.

**Root cause:** Visual behavior wasn't spec'd before implementation. "A scrolling strip" is underspecified.

**Prevention:** Before building any animation or visual component, write a one-sentence spec and confirm it: *"I'll build [behavior, size, speed, interaction]. Does that match what you're picturing?"* One confirmation saves four edit cycles.

---

## Bug 6 — External image URL blocked by browser security

**What happened:** A Wikipedia thumbnail URL was used for a service card image. Chrome's ORB (Opaque Response Blocking) security policy blocked it.

**Root cause:** Grabbed the first available URL without testing it in a real browser.

**Prevention:** Use images in `/photos/` or Supabase Storage by default. Only use external URLs from CDNs designed for hotlinking. Test any external image URL in Chrome before committing. Wikimedia Commons: use `upload.wikimedia.org` (works), not `wikipedia.org` thumbnails (blocked).

---

## Process gap — no pre-deploy checklist

Every deploy was a mental scan with no systematic check. A short checklist would have caught the unstaged `index.html` immediately.

**Pre-deploy checklist (run before every `git push`):**
1. `git status` — confirm all intended files are staged
2. `git diff --staged` — scan the diff for accidental changes
3. Commit message describes ALL changed files

---

## What worked well

- **DEFAULTS as fallback:** The page renders correctly with no database. Zero blank-page failures.
- **Single JSONB row:** One `upsert` saves everything. Simple, fast, no schema migrations.
- **Infinite CSS scroll animation:** Duplicate-content + `translateX(-50%)` pattern. No JavaScript, no libraries.
- **`data-cms` attribute pattern:** Clean separation between HTML structure and content. Easy to add new editable fields.
- **Admin panel UX:** Toggle switches, toast notifications, and inline pricing editors were immediately intuitive for non-technical users.
- **Supabase Storage for gallery:** Upload → get public URL → store in the same JSONB content object. No separate image table needed.
