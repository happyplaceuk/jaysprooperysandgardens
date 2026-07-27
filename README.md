# Jay's Properties and Gardens — Website

A simple, fast, mobile-friendly brochure site built with **Astro** and **Tailwind CSS**. Content lives in plain JSON files — there's no CMS or client login; content changes are made by editing these files directly and pushing to GitHub.

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

- **`src/data/site.json`** — business name, tagline, hero text, and contact details (phone + email, shown in the footer and hero).
- **`src/data/services.json`** — the services section heading, intro, and list of services (title + description).
- **`src/data/gallery.json`** — gallery images, alt text, and captions.

Components in [src/components/](src/components/) import this data directly — there's no database and no build step required to change copy, just edit the JSON, commit, and push. Vercel redeploys automatically on every push to `main`.

Gallery photos live in `public/uploads/gallery/` (real project photos) with a handful of placeholder SVGs still in `public/images/placeholder/` for any slots not yet replaced.

## Deploying on Vercel

1. Push this project to GitHub (see below) — already done, it's at [github.com/happyplaceuk/jaysprooperysandgardens](https://github.com/happyplaceuk/jaysprooperysandgardens).
2. Go to [vercel.com](https://vercel.com) → **Add New… → Project** → import the `jaysprooperysandgardens` repo.
3. Vercel auto-detects Astro — build command `astro build`, output directory `dist`. No changes needed.
4. Click **Deploy**. Vercel gives you a `*.vercel.app` URL immediately.

### Connecting the jayspropertiesandgardens.co.uk domain (bought via GoDaddy)

1. In Vercel: **Project → Settings → Domains** → add `jayspropertiesandgardens.co.uk`.
2. Vercel will show you an **A record** (and/or a CNAME for `www`) to add.
3. Log into **GoDaddy → My Products → DNS** for this domain, and add the records Vercel gave you (GoDaddy's DNS records page lets you add/edit A and CNAME records directly — no need to change nameservers).
4. DNS changes can take anywhere from a few minutes to 24-48 hours to propagate.
5. Vercel provisions HTTPS automatically once DNS resolves.

## Making content changes

Since there's no CMS, updating the site means:

```bash
# edit src/data/site.json, services.json, or gallery.json (or add photos to public/uploads/gallery/)
git add .
git commit -m "Update services list"
git push
```

Vercel picks up the push and redeploys within a minute or two.

## Project structure

```
src/
  layouts/BaseLayout.astro   # shared <head>, favicon, skip link, imports Tailwind
  pages/index.astro          # the single page, composes all sections
  components/                # Header, Hero, Services, Gallery, Footer
  data/                      # site.json, services.json, gallery.json — all editable content
  styles/global.css          # Tailwind entry point
public/
  images/placeholder/        # placeholder gallery images (swap out as real photos come in)
  uploads/gallery/            # real gallery photos
  favicon.svg                 # browser tab icon — swap for a real logo mark if you have one
```

There's no "Get a Quote" button or dedicated Contact section on the page — the only contact info is the phone/email in the footer and hero.

## Before going live

- [x] Business details in `src/data/site.json` (business name, phone, email) are the real ones.
- [x] Gallery photos are real project photos (in `public/uploads/gallery/`, referenced from `src/data/gallery.json`).
- [ ] `public/favicon.svg` is a hand-recreated approximation of the business card logo (house icon, two-tone green). Swap in the actual logo file if a vector/high-res version exists.
- [x] Code pushed to GitHub at [happyplaceuk/jaysprooperysandgardens](https://github.com/happyplaceuk/jaysprooperysandgardens).
- [ ] Create the Vercel project from that repo and connect the `jayspropertiesandgardens.co.uk` domain (see deploy steps above).

## Pushing changes to GitHub

The repo is already set up and pushed. For future changes:

```bash
git add .
git commit -m "Describe the change"
git push
```
