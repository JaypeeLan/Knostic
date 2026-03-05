# Deployment Guide — Knostic (Render Edition)

This guide outlines how to deploy Knostic using **Render** for both the frontend and backend. 

---

## Option A: Unified Deployment (Simplest)
This runs the entire app in one Render service.

### 1. Create a "Web Service" on Render
1. Connect your GitHub repository.
2. Set **Root Directory**: `server`
3. **Build Command**: `cd ../web && npm install && npm run build && cd ../server && npm install && npm run build`
4. **Start Command**: `npm start`

### 2. Configure Environment Variables
- `PORT` = `3001`
- `DB_PATH` = `/opt/render/project/data/inventory.db`

### 3. Add a Persistent Disk
- **Mount Path**: `/opt/render/project/data`
- **Size**: 1GB

---

## Option B: Separate Deployment (Better Performance)
Frontend as a "Static Site" and Backend as a "Web Service".

### 1. Backend (Web Service)
- Follow the steps in **Option A**, but use only `npm install && npm run build` as the build command in the `server` directory.
- Note your backend URL (e.g., `https://knostic-api.onrender.com`).

### 2. Frontend (Static Site)
1. Create a new **Static Site** on Render.
2. Set **Root Directory**: `web`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`
5. **Rewrites/Redirects** (IMPORTANT):
   - In Render dashboard, go to **Redirects/Rewrites**.
   - **Source**: `/api/*`
   - **Destination**: `https://your-backend-url.onrender.com/api/*`
   - **Type**: `Rewrite`

---

## 3. GitHub Push Tasks
```bash
git add .
git commit -m "update deployment for Render-only setup"
git push origin main
```
