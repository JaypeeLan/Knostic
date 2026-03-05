# Deployment Guide — Knostic (Render Free Tier)

This guide is optimised for **Render's Free Tier**, which does not support persistent disks. 

> [!NOTE]
> On the Free Tier, your data is **ephemeral**. This means any changes you make (adding products/stores) will be reset whenever the server restarts (at least once a day or on every redeploy). The server will automatically re-seed the default data on every restart.

---

## Deployment Steps

### 1. Backend (Web Service)
- **Language**: `Node`
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: 
  - `PORT`: `3001`
  - `DB_PATH`: `:memory:` (or leave blank for an ephemeral file)

### 2. Frontend (Static Site)
- **Language**: `Static Site`
- **Root Directory**: `web`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Rewrites/Redirects**:
  1. Go to **Redirects/Rewrites** in the Render dashboard.
  2. **API Access**: 
     - **Source**: `/api/*`
     - **Destination**: `https://knostic-58io.onrender.com/api/*`
     - **Type**: `Rewrite`
  3. **SPA Routing (Catch-all)**: 
     - **Source**: `/*` 
     - **Destination**: `/index.html` 
     - **Type**: `Rewrite`
     *(This ensures page refreshes don't return 404).*

---

## Technical Note: In-Memory DB
We use `DB_PATH=:memory:` for the fastest performance on the free tier. Since storage is wiped on restart anyway, this is the cleanest way to test.

---

## GitHub Push
```bash
git add .
git commit -m "final deployment polish: separate services + swagger"
git push origin main
```

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
