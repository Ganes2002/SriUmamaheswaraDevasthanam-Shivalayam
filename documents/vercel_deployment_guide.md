# Vercel Deployment Guide — Sri Umamaheswara Devasthanam Web Portal

This document covers the complete process of deploying this React + Vite + Supabase application
to Vercel for free, including the branch strategy for safe testing before going live.

---

## Tech Stack Being Deployed

- **Frontend**: React 19 + Vite 6 + TypeScript + Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL) — cloud database, no server needed
- **Hosting**: Vercel (Free Hobby Plan — no credit card required)
- **Repository**: GitHub

---

## Prerequisites

Before deploying you need:
1. Code pushed to a GitHub repository
2. A Supabase project already set up with all tables created (run `supabase_complete_setup.sql`)
3. Your two Supabase credentials ready:
   - `VITE_SUPABASE_URL` — found in Supabase Dashboard → Settings → API → Project URL
   - `VITE_SUPABASE_ANON_KEY` — found in Supabase Dashboard → Settings → API → anon public key

These values are also stored locally in your `.env.local` file (never commit this file).

---

## Part 1 — One-Time Vercel Setup

### Step 1: Create a Vercel Account
1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub** — this links your GitHub account automatically
4. Select the **Hobby** plan (free, no credit card)

### Step 2: Import Your GitHub Repository
1. On the Vercel dashboard click **Add New → Project**
2. Find your repository in the list (`SriUmamaheswaraDevasthanam-Shivalayam`)
3. Click **Import**

### Step 3: Configure Build Settings
Vercel may auto-detect Vite but verify these values manually before deploying:

| Setting | Correct Value |
|---|---|
| Framework Preset | `Vite` |
| **Build Command** | `npm run build` ← CRITICAL (see Common Mistakes below) |
| Output Directory | `dist` |
| Install Command | `npm install` |

> ⚠️ **Important**: Make sure Build Command is `npm run build` — NOT `npm run dev`.
> If Vercel runs `dev` instead of `build`, the deployment hangs forever because
> the dev server never exits. If this happens, cancel the deployment, go to
> Settings → General → Build & Development Settings, correct the command, and redeploy.

### Step 4: Add Environment Variables
Before clicking Deploy, scroll down to **Environment Variables** and add both variables:

| Name | Value | Environment to select |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` | **Production & Preview** |
| `VITE_SUPABASE_ANON_KEY` | `your_anon_key_here` | **Production & Preview** |

**Which environment option to pick:**
Vercel shows these options for each variable:
- `Production & Preview` ← **Select this one**
- `Production`
- `Preview`
- `Development`

Select **Production & Preview** — this covers the live site and all test preview deployments.

> Without these environment variables the site loads but shows no data at all.

### Step 5: Deploy
Click **Deploy**. Vercel builds and publishes in approximately 60 seconds.

You will receive a live URL like:
```
https://your-project-name.vercel.app
```

---

## Part 2 — URLs Reference

| URL Type | URL | When it's used |
|---|---|---|
| **Production** | `https://sri-umamaheswara-devasthanam-shival.vercel.app` | Live site — all visitors |
| **Preview** | `https://your-project-git-dev-yourusername.vercel.app` | Test deployments — only you |

Preview URLs appear in the **Deployments** tab of your Vercel dashboard every time
you push to any branch other than `master`.

---

## Part 3 — Auto-Deployment (Already Active)

When you imported the GitHub repository, Vercel automatically installed a GitHub webhook.
**No manual configuration needed.**

Every push to GitHub triggers Vercel automatically:

```
git add .
git commit -m "your changes"
git push origin master
        ↓
GitHub notifies Vercel via webhook
        ↓
Vercel pulls latest code
        ↓
Runs: npm install → npm run build
        ↓
Publishes dist/ folder to CDN
        ↓
Production site updated in ~60 seconds
```

You can watch this in real time under the **Deployments** tab in your Vercel dashboard.
Each push creates a new row there with live build logs.

---

## Part 4 — Branch Strategy (Test Before Going Live)

This is the recommended workflow so you never accidentally break the live site.
You test changes on a `dev` branch first, then merge to `master` for production.

### One-Time Setup — Create the dev Branch

Run these commands once in your project folder:

```bash
git checkout -b dev
git push origin dev
```

### How Each Branch Works in Vercel

| Branch | Vercel Environment | URL | Who sees it |
|---|---|---|---|
| `master` | Production | `https://sri-umamaheswara-devasthanam-shival.vercel.app` | All visitors |
| `dev` | Preview | Auto-generated per push | Only you (for testing) |
| Any other branch | Preview | Auto-generated per push | Only you |

### Daily Development Workflow

```
1. Switch to dev branch (first time only: git checkout -b dev)

2. Make your code changes

3. Push to dev branch:
   git add .
   git commit -m "describe your change"
   git push origin dev

4. Vercel automatically creates a Preview deployment
   → Check Vercel Dashboard → Deployments tab for the preview URL
   → URL looks like: https://your-project-git-dev-username.vercel.app

5. Open the preview URL and test everything

6. If everything looks good → merge dev to master:
   • Go to github.com/Ganes2002/SriUmamaheswaraDevasthanam-Shivalayam
   • Click Pull requests → New pull request
   • Set:  base: master  ←  compare: dev
   • Click Create pull request → Merge pull request

7. Vercel detects the merge and automatically deploys to Production
   → Live site updated in ~60 seconds
```

### Visual Summary

```
[You write code]
      ↓
git push origin dev
      ↓
[Vercel: Preview URL created]  ← test here
      ↓
[Looks good? Merge dev → master on GitHub]
      ↓
[Vercel: Production URL updated]  ← all visitors see this
```

---

## Part 5 — Vercel Dashboard Reference

| Section | What you find there |
|---|---|
| **Overview** | Latest deployment status, production URL |
| **Deployments** | Full history of every deployment, build logs, preview URLs |
| **Settings → General** | Build command, output directory, framework settings |
| **Settings → Environment Variables** | Add / edit / delete env vars |
| **Settings → Git** | Connected GitHub repo, branch settings |
| **Settings → Domains** | Add a custom domain (e.g. umamaheswaradevasthanam.org) |

---

## Part 6 — Vercel Environment Settings Explained

In **Settings → Environment Variables** you will see three environment rows:

| Environment | Branch | Purpose |
|---|---|---|
| **Production** | `master` | The real live site that devotees visit |
| **Preview** | All other branches (e.g. `dev`) | Test deployments for your review only |
| **Development** | Local machine via `vercel dev` CLI | Local development (optional) |

---

## Part 7 — Adding a Custom Domain (Optional Future Step)

When you are ready to use a real domain like `umamaheswaradevasthanam.org`:

1. Purchase a domain from any registrar (GoDaddy, Namecheap, Google Domains etc.)
2. Go to Vercel Dashboard → **Settings → Domains**
3. Click **Add Domain** → enter your domain name
4. Vercel gives you DNS records (A record and CNAME)
5. Go to your domain registrar's DNS settings and add those records
6. Wait 10–30 minutes for DNS to propagate
7. Vercel automatically provisions a free SSL certificate (HTTPS)

Your site will then be live at both:
- `https://umamaheswaradevasthanam.org` (custom domain)
- `https://sri-umamaheswara-devasthanam-shival.vercel.app` (Vercel URL — still works)

---

## Part 8 — Common Mistakes & Fixes

### Deployment hangs forever (10+ minutes, no completion)
**Cause**: Vercel is running `npm run dev` instead of `npm run build`.
**Fix**:
1. Cancel the running deployment
2. Go to Settings → General → Build & Development Settings
3. Set Build Command to `npm run build`
4. Go to Deployments → click Redeploy

### Site loads but shows no data (blank sections)
**Cause**: Environment variables not set or wrong values.
**Fix**:
1. Go to Settings → Environment Variables
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present and correct
3. Go to Deployments → Redeploy (env var changes require a redeploy)

### Changes pushed but production site not updating
**Cause**: You pushed to `dev` instead of `master`.
**Fix**: Merge `dev` into `master` via a Pull Request on GitHub.

### New environment variable not taking effect
**Cause**: Vercel caches the previous build. Env var changes need a fresh build.
**Fix**: Go to Deployments → click the three dots on latest → **Redeploy**.

---

## Quick Reference — Commands You Use Most

```bash
# Switch to dev branch for testing
git checkout dev

# Switch back to master
git checkout master

# Push changes to dev (triggers preview deployment)
git add .
git commit -m "your message"
git push origin dev

# Push changes to master (triggers production deployment)
git checkout master
git push origin master
```

---

*This guide documents the actual deployment process used for the Sri Umamaheswara Devasthanam
web portal in June 2026. The production site is live at:*
*https://sri-umamaheswara-devasthanam-shival.vercel.app*
