# Deployment Guide — Knostic (Render Free Tier)

This guide is optimised for **Render's Free Tier**, which does not support persistent disks. 

> [!NOTE]
> On the Free Tier, your data is **ephemeral**. This means any changes you make (adding products/stores) will be reset whenever the server restarts (at least once a day or on every redeploy). The server will automatically re-seed the default data on every restart.

---

## Option A: Unified Deployment (Simplest)
*Runs the entire app in one Render service.*

### 1. Create a "Web Service" on Render
- **Language**: `Node`
- **Root Directory**: `server`
- **Build Command**: `cd ../web && npm install && npm run build && cd ../server && npm install && npm run build`
- **Start Command**: `npm start`

### 2. Configure Environment Variables
- `PORT`: `3001`
- `DB_PATH`: `:memory:` (or leave blank to use an ephemeral file)

### 3. Verification
The app will automatically seed the database on the first request. No extra steps needed!

---

## Option B: Separate Deployment (Free Frontend)
*Frontend as a "Static Site" and Backend as a "Web Service".*

### 1. Backend (Web Service)
- **Language**: `Node`
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: Add `PORT=3001` and `DB_PATH=:memory:`.

### 2. Frontend (Static Site)
- **Language**: `Static Site`
- **Root Directory**: `web`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Rewrites/Redirects**:
  1. Go to **Redirects/Rewrites** in the Render dashboard.
  2. Add: **Source**: `/api/*` | **Destination**: `https://your-backend-url.onrender.com/api/*` | **Type**: `Rewrite`.

---

## Technical Note: In-Memory DB
We use `DB_PATH=:memory:` for the fastest performance on the free tier. Since storage is wiped on restart anyway, this is the cleanest way to test.

---

## GitHub Push
```bash
git add .
git commit -m "update deployment for Render-only setup"
git push origin main
```
