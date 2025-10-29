# Vercel Deployment Guide

## Option 1: Frontend on Vercel + Backend on Railway/Render (Recommended)

### Step 1: Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional, you can use web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from root directory**:
   ```bash
   vercel
   ```
   Or use the Vercel dashboard:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set **Root Directory** to `frontend`
   - Build settings will auto-detect

3. **Set Environment Variables in Vercel Dashboard**:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
   (Replace with your actual backend URL)

### Step 2: Deploy Backend (Choose one)

#### Option A: Railway
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo, set root directory to `backend`
4. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   GROQ_API_KEY=your_groq_key
   PORT=5000
   ```
5. Update `VITE_API_URL` in Vercel with Railway's deployment URL

#### Option B: Render
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo, set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
4. Add environment variables (same as above)
5. Update `VITE_API_URL` in Vercel

### Step 3: Update Frontend API URL

After backend is deployed:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to your backend URL
3. Redeploy frontend

---

## Option 2: Full-Stack on Vercel (Serverless Functions)

Convert your Express backend to Vercel Serverless Functions.

### Files to Create:

1. **vercel.json** (root):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static beau"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ]
}
```

2. Move backend routes to `api/` folder and convert to serverless functions.

**Note**: This requires significant refactoring. Option 1 is easier.

---

## Quick Start (Recommended)

1. **Deploy Frontend to Vercel**:
   - Push code to GitHub
   - Import project in Vercel
   - Set root directory: `frontend`
   - Add `VITE_API_URL` env var (set after backend is deployed)

2. **Deploy Backend to Railway**:
   - Connect GitHub repo
   - Root: `backend`
   - Add all env vars
   - Copy deployment URL

3. **Update Frontend**:
   - Add `VITE_API_URL` = `https://your-railway-app.railway.app/api` to Vercel
   - Redeploy

4. **Test**: Visit your Vercel URL!

---

## Environment Variables Checklist

### Frontend (Vercel):
- `VITE_API_URL` - Your backend API URL

### Backend (Railway/Render):
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Random secret for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `GROQ_API_KEY` - Groq API key for chat
- `PORT` - Usually 5000 or auto-set by platform

---

## CORS Setup

Your backend already has CORS enabled, but make sure to allow your Vercel domain:
```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:5173']
}));
```

---

## Troubleshooting

- **Build fails**: Check Node version in Vercel settings (use 18.x or 20.x)
- **API calls fail**: Verify `VITE_API_URL` is set correctly
- **CORS errors**: Update backend CORS to include Vercel domain
- **404 on routes**: Ensure rewrites in vercel.json are correct

