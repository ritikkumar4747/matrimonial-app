# Deployment Guide

## Overview
This app has:
- **Frontend**: React app (deploy to Vercel)
- **Backend**: Node.js + Socket.IO server (deploy to Railway/Render)
- **Database**: MongoDB (use MongoDB Atlas)

## Step 1: Backend Deployment (Railway)

1. **Create Railway account**: https://railway.app
2. **Create new project** → Select "Deploy from GitHub"
3. **Connect your repository**
4. **Add environment variables**:
   ```
   MONGO_URI=your_mongodb_connection_string
   FRONTEND_URL=https://your-app.vercel.app
   PORT=5000
   ```
5. **Deploy** - Railway will automatically start your server
6. **Copy the deployment URL**: `https://your-backend.railway.app`

## Step 2: Frontend Deployment (Vercel)

1. **Install Vercel CLI**: `npm i -g vercel`
2. **In frontend directory**:
   ```bash
   cd frontend
   vercel
   ```
3. **During deployment, add environment variable**:
   ```
   VITE_BACKEND_URL=https://your-backend.railway.app
   ```
4. **Vercel automatically deploys** on git push

## Step 3: Database (MongoDB Atlas)

1. **Create account**: https://mongodb.com/cloud/atlas
2. **Create cluster** (free tier available)
3. **Get connection string**: 
   - Click "Connect" → "Drivers"
   - Copy the URI
4. **Set as `MONGO_URI`** in both backend environments

## Step 4: Update Socket.IO Connection

The app now automatically:
- Uses `http://localhost:5000` for development
- Uses `VITE_BACKEND_URL` from `.env.local` for production

**In frontend/.env.local**:
```
VITE_BACKEND_URL=http://localhost:5000
```

**In Vercel environment** (add via dashboard):
```
VITE_BACKEND_URL=https://your-backend.railway.app
```

## Testing Video Calls in Production

1. **Open frontend URL** in two different browsers
2. **Login as different users**
3. **Open chat**
4. **Click Call or Video button**
5. **Receiver should see incoming call modal**

## Troubleshooting

### "CORS not allowed" error
- Check `FRONTEND_URL` in backend is correct
- Ensure frontend URL matches exactly in backend environment

### "Socket connection failed"
- Check `VITE_BACKEND_URL` in frontend
- Verify backend is running on Railway
- Check backend logs in Railway dashboard

### Video calls not working
- Ensure using HTTPS (Vercel provides this automatically)
- Check browser console for WebRTC errors
- Verify microphone/camera permissions

### Connection timeout
- Increase reconnection attempts in Socket.js
- Check if backend service is running
- Verify firewall/network settings

## Local Development

```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Then:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Socket automatically connects to localhost:5000

## Environment Variables Summary

**Backend (.env)**:
```
MONGO_URI=mongodb+srv://...
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

**Frontend (.env.local)**:
```
VITE_BACKEND_URL=http://localhost:5000
```

**Frontend (Vercel via dashboard)**:
```
VITE_BACKEND_URL=https://your-backend.railway.app
```

**Frontend (.env.production)**:
```
VITE_BACKEND_URL=https://your-backend.railway.app
```
