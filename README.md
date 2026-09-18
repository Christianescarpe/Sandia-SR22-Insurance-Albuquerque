# Sandia SR22 Insurance Albuquerque

A fast, mobile-responsive website for Sandia SR22 Insurance Albuquerque, featuring dynamic quote forms, comprehensive service pages, neighborhood landing pages, educational guides, and a serverless contact API designed for seamless deployment on GitHub and Vercel.

---

## 🚀 Quick Deployment Guide (Vercel)

Deploying to Vercel requires zero complex setup. Follow these steps:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete Sandia SR22 Insurance Albuquerque website"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository.
   - Configure the project settings:
     - **Framework Preset**: `Other`
     - **Build Command**: `npm run build`
     - **Output Directory**: Leave empty / default (`.`)
     - **Root Directory**: `./`

3. **Environment Variables (Optional)**:
   Add in your Vercel Project Settings under **Settings > Environment Variables**:
   | Variable | Description |
   |---|---|
   | `WEBHOOK_URL` | Optional Slack, Discord, or Zapier webhook URL to receive instant notifications when quotes are submitted. |
   | `NOTIFICATION_EMAIL` | Optional administrative email notification address. |

4. **Deploy**:
   - Click **Deploy**. Vercel will run `npm run build`, process all 27 pages, and deploy the serverless contact endpoint at `/api/contact`.

---

## 🛠 Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Start Local Preview Server
```bash
npm start
```
- Local preview available at: `http://localhost:3000`
- API endpoint active at: `http://localhost:3000/api/contact`

### 2. Rebuild All Pages
```bash
npm run build
```
Regenerates all 27 pages from source data with 100% consistency across services, locations, and blogs.

### 3. Verify Links & Assets
```bash
node verify.js
```
Performs an automated audit of all 27 HTML pages, verifying that every internal link (1,200+) and image reference (110+) resolves without broken paths or 404s.

---

## 📂 Project Architecture

```
├── api/
│   └── contact.js         # Vercel Serverless Function (POST /api/contact)
├── assets/
│   ├── css/
│   │   ├── style.css      # Core stylesheet with responsive design & animations
│   │   └── services.css   # Specialized layout styles for service pages
│   ├── js/
│   │   └── main.js        # Mobile drawer, navigation, & async quote form handler
│   └── images/            # Local high-resolution insurance photography & icons
├── blog/                  # 10 Educational SR-22 blog articles & blog index
├── contact-us/            # Contact & quote request page with interactive Google Map
├── faq/                   # Albuquerque SR-22 FAQs & accordion
├── how-to-get-an-sr22-in-albuquerque/  # Service page
├── non-owners-sr22-insurance/          # Service page
├── what-is-sr22/                       # Service page
├── [location-slugs]/      # 10 Albuquerque metro location pages
├── .env.example           # Reference environment variables
├── .gitignore             # Git ignore rules (.env, node_modules, dist, .vercel)
├── build.js               # Master build orchestrator
├── package.json           # Node configuration & scripts
├── vercel.json            # Vercel routing, trailing slashes, & cache headers
└── verify.js              # Full-site link and asset verification suite
```

---

## 🔒 Security & Environment Variables

- Sensitive variables and API secrets are never committed to version control.
- `.gitignore` is configured to exclude all `.env*` files, build folders, and IDE temporary files.
- Refer to `.env.example` for all configurable keys.

---

## 📞 Business Information
- **Business Name**: Sandia SR22 Insurance Albuquerque
- **Phone**: [(505) 460-8649](tel:+15054608649)
- **Address**: 2400 Rio Grande Blvd NW Ste j, Albuquerque, NM 87104, United States
- **Google Maps**: [View Location](https://maps.app.goo.gl/ZAe7dAqF8GjL8nBN6)
