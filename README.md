# Neighbourhood

An editorial travel magazine for creative travellers in African cities. Built with Next.js, Tailwind CSS and Markdown (MDX) files, and deployed on Vercel. No database needed.

You can run the whole magazine without touching code: articles, cities and pages are plain text files in the `content/` folder, and site-wide settings live in one file, `site.config.ts`.

---

## 1. What's in the folder (in plain words)

```
neighbourhood/
│
├── content/                 ← EVERYTHING YOU WRITE LIVES HERE
│   ├── articles/            ← one folder per city, one file per article
│   │   ├── lagos/
│   │   │   ├── where-to-eat-in-lagos.mdx
│   │   │   └── the-yaba-designer-building-a-studio-from-scratch.mdx
│   │   ├── nairobi/
│   │   └── kigali/
│   ├── cities/              ← one file per city (name, photo, intro, quick facts)
│   │   ├── lagos.md
│   │   ├── nairobi.md
│   │   └── kigali.md
│   ├── pages/               ← About, Contact, Partner With Us, Privacy, Terms
│   └── templates/
│       └── new-article.mdx  ← copy this when you write a new article
│
├── site.config.ts           ← SITE SETTINGS: name, emails, social links, ads on/off
│
├── app/                     ← the page layouts (code; you rarely need to touch this)
│   ├── page.tsx             ← homepage
│   ├── [city]/page.tsx      ← a city page, e.g. /lagos
│   ├── [city]/[slug]/       ← an article, e.g. /lagos/where-to-eat-in-lagos
│   ├── city-guides/         ← list of all cities
│   ├── section/[section]/   ← section pages, e.g. /section/people
│   ├── tag/[tag]/           ← tag pages, e.g. /tag/design
│   ├── search/              ← search page
│   ├── about/ contact/ partner-with-us/ privacy/ terms/
│   ├── api/subscribe/       ← sends newsletter sign-ups to your email provider
│   ├── sitemap.ts           ← builds /sitemap.xml for Google automatically
│   ├── robots.ts            ← builds /robots.txt automatically
│   ├── opengraph-image.tsx  ← default image when a page is shared on social media
│   └── globals.css          ← colours and fonts
│
├── components/              ← reusable building blocks (cards, header, ad slots, affiliate box…)
├── lib/                     ← behind-the-scenes code that reads your content files
├── public/                  ← put your own images here (e.g. public/images/lagos-market.jpg)
└── .env.example             ← example of private settings (newsletter keys)
```

**In short:** you'll spend 95% of your time in `content/` and occasionally open `site.config.ts`.

### Web addresses

| Page | Address |
|---|---|
| Homepage | `/` |
| All cities | `/city-guides` |
| A city | `/lagos` |
| An article | `/lagos/where-to-eat-in-lagos` |
| A section | `/section/travel`, `/section/people`, `/section/photography`, `/section/my-city`, `/section/stays`, `/section/city-guides` |
| A tag | `/tag/food-and-drink` |
| Search | `/search` |
| Info pages | `/about`, `/contact`, `/partner-with-us`, `/privacy`, `/terms` |

---

## 2. Run it on your computer

You only need to do the setup once.

### One-time setup

1. **Install Node.js.** Go to <https://nodejs.org>, download the **LTS** version, and install it like any other app.
2. **Install Git.** Mac: open the **Terminal** app, type `git --version` and press Enter; if it isn't installed, your Mac will offer to install it. Windows: download it from <https://git-scm.com>.
3. **Download the project.** In Terminal (Mac) or **Command Prompt** (Windows), run:
   ```bash
   git clone https://github.com/benjamingainyllo/neighbourhood.git
   cd neighbourhood
   npm install
   ```
   `npm install` downloads the building blocks the site needs. It takes a minute or two.

> **Easier option:** if you use **Cursor**, choose *File → Open Folder*, select the `neighbourhood` folder, then open the built-in terminal with *View → Terminal*. Type the commands there.

### Every time you want to see the site

```bash
npm run dev
```

Then open <http://localhost:3000> in your browser. Leave the terminal window open while you work. When you save a file, the page updates by itself. To stop it, click in the terminal and press **Ctrl + C**.

### Check everything before publishing (optional but recommended)

```bash
npm run build
```

If something is wrong in an article (for example a missing title or a misspelt city), this command stops and tells you **which file and which line to fix**, in plain English.

---

## 3. Add a new article

1. Open `content/templates/new-article.mdx` and copy it.
2. Paste it into the right city folder, e.g. `content/articles/lagos/`.
3. Rename it to match the web address you want, e.g. `best-bars-in-lagos.mdx` (lowercase, words separated by dashes).
4. Fill in the details at the top, between the two `---` lines:

| Field | What to write | Example |
|---|---|---|
| `title` | The headline | `"The best bars in Lagos"` |
| `slug` | The web address (lowercase, dashes) | `best-bars-in-lagos` |
| `excerpt` | 1–2 sentence summary for cards and Google | `"Rooftops, speakeasies and…"` |
| `city` | Must match a file in `content/cities/` | `lagos` |
| `section` | One of: `city-guides`, `travel`, `people`, `photography`, `my-city`, `stays` | `city-guides` |
| `tags` | A list, one per line starting with `-` | `- Nightlife` |
| `author` | Writer's name | `Tolu Adebayo` |
| `date` | Year-month-day | `2026-10-20` |
| `heroImage` | Main photo: an Unsplash link or `/images/your-photo.jpg` | |
| `heroAlt` | Describe the photo (for accessibility and Google) | `"Rooftop bar at dusk"` |
| `heroCaption` | Caption under the main photo (optional) | |
| `photoCredit` | e.g. `"Photo: Jane Doe"` (optional) | |
| `sponsored` | `true` shows a **Partnership** label | `false` |
| `featured` | `true` puts it at the top of the homepage | `false` |
| `draft` | `true` hides it on the live site | `false` |

5. Write the article below the second `---`. Leave an empty line between paragraphs. Use `## ` for subheadings, `**bold**`, `*italics*` and `[link text](https://…)`.
6. Save the file. With `npm run dev` running, you'll see it at `http://localhost:3000/lagos/best-bars-in-lagos`.

**Watch out for colons.** If a value contains a colon followed by a space, wrap it in double quotes:
`title: "My Kigali: a love letter"`. If you forget, the site tells you exactly which file to fix.

### Adding photos inside an article

```mdx
<Figure
  src="https://images.unsplash.com/photo-…"
  alt="Describe the photo"
  caption="A caption."
  credit="Photo: Jane Doe"
/>
```

Optional extras: `ratio="4/5"` for portrait photos (also `"16/9"`, `"4/3"`, `"1/1"`), and `size="text"` to make the photo only as wide as the text.

To use your own photos, put them in `public/images/` and write `src="/images/my-photo.jpg"`.

### Pull quotes

```mdx
<PullQuote cite="Adaeze Okafor">
  In London I was designing about Lagos. Here, I get to design with it.
</PullQuote>
```

### Affiliate boxes (hotels, tours, eSIMs)

```mdx
<AffiliateBox
  type="hotel"
  title="The Fig House, Karen"
  description="Eight garden rooms and breakfast on the veranda."
  href="https://your-affiliate-link"
  partner="Booking.com"
  price="From £140 a night"
  cta="Check availability"
  image="https://images.unsplash.com/photo-…"
/>
```

`type` can be `hotel`, `tour` or `esim`. Every box automatically shows the disclosure line *"We may earn a commission if you book through this link…"*, and the link is marked as sponsored for Google.

### Ads inside articles

You don't need to do anything. The in-article ad is placed after the 3rd paragraph automatically.

---

## 4. Add a new city

1. Copy `content/cities/lagos.md` and rename the copy to the new city's address, e.g. `accra.md`. The file name becomes the web address (`/accra`).
2. Edit the details at the top: `name`, `country`, `order` (its position in lists), `excerpt`, `heroImage`, `heroAlt`, `photoCredit` and the `facts` list.
3. Replace the paragraph below the second `---` with an introduction to the city.
4. Create a folder for its articles: `content/articles/accra/`.
5. In each new article, write `city: accra`.

The new city automatically appears in the menu, footer, homepage city grid, City Guides page and sitemap. Optionally, edit the "Coming soon" names in `app/page.tsx` (search for `Accra, Cape Town`).

---

## 5. Publish it on the internet (Vercel)

### First time

1. **Put the code on GitHub.** It's already on GitHub at `benjamingainyllo/neighbourhood`.
2. Go to <https://vercel.com> and click **Sign Up** → **Continue with GitHub**.
3. Click **Add New…** → **Project**.
4. Find **neighbourhood** in the list and click **Import**. (If it's missing, click **Adjust GitHub App Permissions** and give Vercel access to the repository.)
5. Leave every setting as it is (Vercel detects Next.js automatically) and click **Deploy**.
6. After about a minute you'll get a live address like `neighbourhood-xyz.vercel.app`. 🎉

### Every time after that

Every change pushed to your **production branch** on GitHub goes live automatically within a minute or two. That's normally `main`; you can see or change it in Vercel under **Settings → Git**. Other branches get their own private preview link, which is handy for checking an article before it goes live.

### Connect your own domain

In Vercel: open your project → **Settings** → **Domains** → type your domain → **Add**, then follow the instructions it shows for your domain provider. Afterwards, go to **Settings → Environment Variables** and add `NEXT_PUBLIC_SITE_URL` = `https://www.yourdomain.com`, then redeploy (**Deployments** → **⋯** → **Redeploy**). This makes Google, the sitemap and social sharing use your real domain.

---

## 6. Settings you'll want to change

All of these are in **`site.config.ts`**:

- **Site name, tagline, description**: used in the header, footer and Google results.
- **Emails**: `general` and `partnerships`. Also update the email addresses written in `content/pages/contact.mdx` and `partner-with-us.mdx`.
- **Social links**: leave a value as `""` to hide that link.
- **Ads**: see below.

**Colours and fonts** are at the top of `app/globals.css` (look for `--color-accent` to change the terracotta accent colour).

### Google AdSense

There are three ad slots: inside articles (after the 3rd paragraph), at the end of articles, and in a right-hand column on desktop. There are **no ads on the homepage**.

- **Turn all ads off:** in `site.config.ts`, set `enabled: false`. Turn them back on with `enabled: true`.
- **Before AdSense approves you**, the slots show grey "Advertisement" boxes so you can see the layout. Set `enabled: false` before launch if you'd rather not show empty boxes.
- **Once approved:** paste your publisher ID (`ca-pub-…`) into `client` and your three ad-unit IDs into `slots`. Real ads then appear automatically.

### Newsletter

The sign-up form works straight away in **placeholder mode**: it accepts emails and records them in the server log, but doesn't send them anywhere. To connect your email provider, add these in Vercel → **Settings** → **Environment Variables**, then redeploy:

| Provider | Variables to add |
|---|---|
| Beehiiv | `NEWSLETTER_PROVIDER` = `beehiiv`, `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID` |
| ConvertKit (Kit) | `NEWSLETTER_PROVIDER` = `convertkit`, `CONVERTKIT_API_KEY`, `CONVERTKIT_FORM_ID` |
| Mailchimp | `NEWSLETTER_PROVIDER` = `mailchimp`, `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID` |

See `.env.example` for where to find each key. To test on your computer, copy `.env.example` to a new file called `.env.local` and fill it in. That file stays private and is never uploaded.

---

## 7. Before you launch: checklist

- [ ] Replace the six sample articles. **They are fictional placeholders**: the restaurants, hotels and people in them are made up.
- [ ] Update emails in `site.config.ts`, `content/pages/contact.mdx` and `content/pages/partner-with-us.mdx`.
- [ ] Update social links in `site.config.ts`.
- [ ] Have a lawyer review `content/pages/privacy.mdx` and `content/pages/terms.mdx` (they're templates). If you serve ads to UK/EU visitors, you'll also need a cookie-consent banner; Google's own consent tool, available in AdSense, works.
- [ ] Decide on ads: `enabled: false` until AdSense approves you, or keep the placeholders.
- [ ] Connect your newsletter provider.
- [ ] Replace placeholder affiliate links with your real affiliate links.
- [ ] Connect your domain and set `NEXT_PUBLIC_SITE_URL`.
- [ ] Submit `https://yourdomain.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

---

## For developers

- Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, `next-mdx-remote` + `gray-matter`.
- All article, city, section and tag pages are statically generated at build time (`generateStaticParams` + `dynamicParams = false`); unknown URLs return 404. Cache Components is intentionally not enabled.
- Content loading and validation: `lib/content.ts`. MDX rendering, the in-article ad injection (a small remark plugin) and MDX components: `lib/mdx.tsx`.
- `npm run lint` and `npx tsc --noEmit` should both pass.
