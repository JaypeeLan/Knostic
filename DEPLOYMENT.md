# Deployment Guide — Knostic

This guide outlines how to deploy the Knostic Inventory system using **Vercel** for the frontend and **Render** for the backend (with SQLite persistence).

---

## 1. Backend: Render (Node.js Web Service)

**Render** is ideal for the backend because it supports **Persistent Disks**, which is required for our SQLite database (`inventory.db`).

### Steps
1. **Create a New Web Service**:
   - Connect your GitHub repository.
   - Set the runtime to **Node**.
   - Set the **Build Command**: `cd server && npm install && npm run build` (Note: Ensure your `build` script in `server/package.json` compiles TypeScript).
   - Set the **Start Command**: `cd server && npm start` (Note: This should run the compiled Javascript from `dist`).

2. **Configure Environment Variables**:
   - Add `PORT` = `3001` (or whatever Render assigns).
   - Add `DB_PATH` = `/opt/render/project/data/inventory.db`.

3. **Add a Persistent Disk**:
   - In the service settings, add a **Disk**.
   - **Mount Path**: `/opt/render/project/data`.
   - **Size**: 1GB (plenty for SQLite).
   - This ensures your SQLite data persists between restarts.

---

## 2. Frontend: Vercel (React/Vite)

### Steps
1. **Import Project**:
   - Connect your GitHub repo.
   - Vercel should auto-detect the Vite project.
2. **Framework Preset**: Vite.
3. **Root Directory**: `web`.
4. **Build Settings**:
   - **Build Command**: `npm install && npm run build`.
   - **Output Directory**: `dist`.
5. **Environment Variables**:
   - Vercel doesn't use the `vite.config` proxy in production.
   - You need to update `client.ts` to use a real URL if they aren't on the same domain, **OR** (recommended) use **Vercel Rewrites**.

### Vercel Rewrites (`vercel.json` in `web/` root)
Create this file to mirror your local proxy:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-render-app-url.onrender.com/api/:path*"
    }
  ]
}
```

---

## 3. GitHub Push Tasks

Before deploying:
1. Ensure both `.gitignore` files exist (one in each folder or one in root).
2. Push all code to your GitHub repository:
   ```bash
   git add .
   git commit -m "UI cleanup and deployment prep"
   git push origin main
   ```

---

## 4. Post-Deployment Checklist
- [ ] Run `npm run seed` on the Render shell (one-time) to populate the database.
- [ ] Verify frontend loads and fetches stores correctly.
- [ ] Add a test product to verify SQLite write/persistence.
