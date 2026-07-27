# Jay's Properties and Gardens — Website

A simple, fast, mobile-friendly brochure site built with **Astro**, **Tailwind CSS**, and **Decap CMS**. Content lives in plain JSON files so a non-technical client can edit it through a web-based CMS, without touching code.

## Running locally

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:4321`.

Other commands:

```bash
npm run build    # build the static site to ./dist
npm run preview  # preview the production build locally
```

## Where the editable content lives

All editable content is plain JSON in [src/data/](src/data/):

- **`src/data/site.json`** — business name, tagline, hero text, and contact details (phone + email, shown in the footer).
- **`src/data/services.json`** — the services section heading, intro, and list of services (title + description).
- **`src/data/gallery.json`** — gallery images, alt text, and captions.

Components in [src/components/](src/components/) import this data directly — there's no database and no build step required to change copy, just edit the JSON (or use the CMS below) and rebuild/redeploy.

Placeholder gallery images live in `public/images/placeholder/` so the site looks reasonable before real photos are uploaded. Once real photos are added through the CMS, they'll be stored in `public/uploads/gallery/` and `gallery.json` will point there instead.

## Using the CMS

The CMS is available at **`/admin`** once deployed (`https://jayspropertiesandgardens.co.uk/admin`).

It has three sections:

1. **Site Settings** — business name, tagline, hero copy, and contact details (phone + email).
2. **Services** — the services heading/intro and the list of services.
3. **Gallery** — gallery images, alt text, and captions (uploads go to `public/uploads/gallery`).

Every field has a short hint explaining what it's for, and each collection has a "Preview" link (once `site_url` in `config.yml` is set to the live domain) that jumps straight to the relevant part of the homepage.

Editing and publishing a change in the CMS commits directly to this repo, which triggers a new Netlify deploy automatically.

## Deploying on Netlify with Decap CMS

1. **Push this project to a GitHub repo** — Decap CMS needs a real repo to commit to. See "Pushing to GitHub" below.
2. **Create a new Netlify site** from that repo. Build command: `npm run build`. Publish directory: `dist`.
3. **Enable Netlify Identity**: Site configuration → Identity → Enable Identity.
4. **Set registration to "Invite only"** under Identity → Registration (recommended so random people can't sign up as CMS editors).
5. **Enable Git Gateway**: Identity → Services → Git Gateway → Enable. This is what lets Decap CMS commit content changes on the client's behalf, without giving them a GitHub account.
6. **Invite the client**: Identity → Invite users → enter their email. They'll get an email to set a password.
7. The client can then log in at `https://jayspropertiesandgardens.co.uk/admin` and start editing.

These steps are also noted as a comment in [public/admin/index.html](public/admin/index.html).

### Connecting the jayspropertiesandgardens.co.uk domain (bought via GoDaddy)

1. In Netlify: **Site configuration → Domain management → Add a domain** → enter `jayspropertiesandgardens.co.uk`.
2. Netlify will show you either an **A record** (pointing to Netlify's load balancer IP) or a set of **Netlify DNS nameservers** to use — it recommends nameservers for full HTTPS/CDN support.
3. Log into **GoDaddy → My Products → DNS** for this domain, and either:
   - Replace GoDaddy's nameservers with the ones Netlify gave you (simplest, Netlify manages everything), or
   - Keep GoDaddy's nameservers and just add the A record (and a CNAME for `www`) Netlify provides.
4. DNS changes can take anywhere from a few minutes to 24-48 hours to propagate.
5. Back in Netlify, once it detects the DNS is pointing correctly, enable **HTTPS** (Netlify provisions a free SSL certificate automatically via Let's Encrypt — this can take a few minutes after DNS resolves).
6. `site_url` in [public/admin/config.yml](public/admin/config.yml) is already set to `https://jayspropertiesandgardens.co.uk`, so the CMS preview links will work once the domain is live.

### Testing the CMS locally (optional)

Decap's hosted `git-gateway` backend only works once deployed to Netlify. To test the CMS UI locally first:

```bash
npx decap-server
```

Then uncomment `local_backend: true` in [public/admin/config.yml](public/admin/config.yml) and visit `http://localhost:4321/admin` while `npm run dev` is running.

## Project structure

```
src/
  layouts/BaseLayout.astro   # shared <head>, favicon, skip link, imports Tailwind
  pages/index.astro          # the single page, composes all sections
  components/                # Header, Hero, Services, Gallery, Footer
  data/                      # site.json, services.json, gallery.json — all editable content
  styles/global.css          # Tailwind entry point
public/
  admin/                     # Decap CMS (index.html + config.yml)
  images/placeholder/        # placeholder gallery images (swap out before launch)
  uploads/gallery/           # CMS gallery image uploads land here
  favicon.svg                # browser tab icon — swap for a real logo mark if you have one
```

There's no "Get a Quote" button or dedicated Contact section on the page — the only contact info is the phone/email in the footer.

## Before going live

- [x] Business details in `src/data/site.json` (business name, phone, email) are the real ones.
- [x] Gallery photos are real project photos (in `public/uploads/gallery/`, referenced from `src/data/gallery.json`).
- [ ] `public/favicon.svg` is a hand-recreated approximation of the business card logo (house icon, two-tone green). Swap in the actual logo file if a vector/high-res version exists.
- [x] `site_url` in `public/admin/config.yml` is set to `https://jayspropertiesandgardens.co.uk`.
- [ ] Push this project to a GitHub repo (see below).
- [ ] Create the Netlify site from that repo and connect the `jayspropertiesandgardens.co.uk` domain (see deploy steps above).
- [ ] Complete the Netlify Identity / Git Gateway setup (see deploy steps above) before handing off `/admin` to the client.

## Pushing to GitHub

1. On [github.com](https://github.com), create a new **empty** repository (no README/license) — e.g. named `jays-properties-and-gardens`.
2. Then, from this project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

Replace the URL in the `remote add` line with the one GitHub shows you after creating the repo.
