# Deployment Guide — Knostic (Render Edition)

This guide outlines how to deploy Knostic using **Render**.

---

## Option A: Unified Deployment (Simplest)
*Runs both frontend and backend in a single Render Web Service.*

### 1. Create a "Web Service" on Render
- **Language**: `Node`
- **Root Directory**: `server`
- **Build Command**: `cd ../web && npm install && npm run build && cd ../server && npm install && npm run build`
- **Start Command**: `npm start`

### 2. Configure Environment Variables
- `PORT` = `3001`
- `DB_PATH` = `/opt/render/project/data/inventory.db`

### 3. Add a Persistent Disk
- **Mount Path**: `/opt/render/project/data`
- **Size**: 1GB (This ensures your SQLite data persists).

---

## Option B: Separate Deployment (Free Frontend)
*Frontend as a "Static Site" and Backend as a "Web Service".*

### 1. Backend (Web Service)
- **Language**: `Node`
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: Add `DB_PATH` and `PORT` as in Option A.
- **Disk**: Add a Persistent Disk as in Option A.

### 2. Frontend (Static Site)
- **Language**: `Static Site` (Render auto-detects)
- **Root Directory**: `web`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Rewrites/Redirects**:
  1. Go to **Redirects/Rewrites** in the Render dashboard.
  2. Add: **Source**: `/api/*` | **Destination**: `https://your-backend-url.onrender.com/api/*` | **Type**: `Rewrite`.

---

## POST-DEPLOYMENT: Seeding the Database
Once the backend is live, open the Render **Shell** and run:
```bash
cd server && npm run seed
```
This will populate your remote database with initial data.

---

## 3. GitHub Push Tasks
```bash
git add .
git commit -m "update deployment for Render-only setup"
git push origin main
```
