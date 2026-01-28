# 🚀 Pre-Deployment Checklist

## ✅ Fixed & Ready

### Backend
- ✅ CORS configured for production
- ✅ Socket.IO CORS configured
- ✅ Environment variables support
- ✅ `.gitignore` created
- ✅ `.env.example` provided
- ✅ `Procfile` for Heroku/Railway
- ✅ `railway.json` for Railway
- ✅ All routes properly configured
- ✅ Multiple STUN servers configured
- ✅ Detailed logging for debugging

### Frontend
- ✅ Dynamic API URL (dev + prod)
- ✅ Socket.IO dynamic connection
- ✅ `.env.example` provided
- ✅ `.env.local` for development
- ✅ `.env.production` template
- ✅ `vercel.json` for Vercel
- ✅ Build script ready
- ✅ Tailwind CSS warning fixed
- ✅ WebRTC with 7 STUN servers
- ✅ Video call fallback to audio

### Features Working
- ✅ Love Guru chatbot (15+ categories)
- ✅ Audio/Video calling with WebRTC
- ✅ Ring tones (incoming/outgoing)
- ✅ Call status tracking
- ✅ Call history persistence
- ✅ Socket.IO real-time messaging
- ✅ Interest system
- ✅ Profile management
- ✅ Daily matches
- ✅ Badges & success stories

---

## 📋 Deployment Steps

### Step 1: Prepare MongoDB (5 minutes)

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (M0 Sandbox)
3. **Create database user**:
   - Username: `matrimonial_user`
   - Password: (generate strong password)
4. **Whitelist IP**: `0.0.0.0/0` (allow all - for development)
5. **Get connection string**:
   ```
   mongodb+srv://matrimonial_user:<password>@cluster0.xxxxx.mongodb.net/matrimonial?retryWrites=true&w=majority
   ```
6. **Save this** - you'll need it for backend deployment

---

### Step 2: Deploy Backend to Railway (10 minutes)

1. **Create account**: https://railway.app (login with GitHub)

2. **Create new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `backend` folder (or root if monorepo)

3. **Add environment variables** in Railway dashboard:
   ```
   MONGO_URI=mongodb+srv://matrimonial_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/matrimonial
   FRONTEND_URL=https://your-app.vercel.app
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   ```

4. **Deploy**: Railway auto-deploys on push

5. **Get backend URL**: 
   - Go to Settings → Generate Domain
   - Copy URL: `https://your-backend.up.railway.app`

---

### Step 3: Deploy Frontend to Vercel (5 minutes)

#### Option A: Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

During setup:
- Project name: `matrimonial-app` (or your choice)
- Build command: `npm run build`
- Output directory: `dist`

#### Option B: Vercel Dashboard

1. **Go to**: https://vercel.com
2. **Import project** from GitHub
3. **Select `frontend` folder**
4. **Framework**: Vite
5. **Root directory**: `frontend` (if monorepo)

**Add environment variable**:
```
VITE_BACKEND_URL=https://your-backend.up.railway.app
```

6. **Deploy**: Click "Deploy"

7. **Get frontend URL**: `https://your-app.vercel.app`

---

### Step 4: Update Backend with Frontend URL

1. **Go to Railway dashboard**
2. **Update `FRONTEND_URL`**:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. **Redeploy** (automatic)

---

### Step 5: Test Production Deployment

1. **Open frontend**: `https://your-app.vercel.app`
2. **Check browser console**: Should see `[Socket] Connected`
3. **Register new account**
4. **Create profile**
5. **Test features**:
   - ✅ Login/Register
   - ✅ Profile creation
   - ✅ Browse profiles
   - ✅ Send interest
   - ✅ Chat (after mutual interest)
   - ✅ Love Guru chatbot
   - ✅ Audio call
   - ✅ Video call

---

## 🔧 After Deployment

### Update .env.production

In `frontend/.env.production`:
```
VITE_BACKEND_URL=https://your-backend.up.railway.app
```

### Test Calling

1. **Open in 2 browsers**:
   - Chrome: User A
   - Firefox: User B

2. **Both accept interests**

3. **User A clicks Call/Video**

4. **User B should**:
   - Hear ring tone
   - See incoming call modal
   - Click Accept

5. **Both should connect** and see video/audio

---

## 🐛 Troubleshooting

### "CORS error" in console
- ✅ Check `FRONTEND_URL` in Railway matches Vercel URL exactly
- ✅ Include `https://` in URL
- ✅ Redeploy backend after changing env vars

### "Failed to connect to Socket.IO"
- ✅ Check `VITE_BACKEND_URL` in Vercel
- ✅ Verify backend is running on Railway
- ✅ Check Railway logs for errors

### Video calls not working
- ✅ Ensure both URLs use HTTPS (Vercel/Railway provide this)
- ✅ Grant camera/microphone permissions
- ✅ Check browser console for WebRTC errors
- ✅ Verify STUN servers are accessible

### Database connection failed
- ✅ Check `MONGO_URI` is correct
- ✅ Password special characters need URL encoding
- ✅ Whitelist IP `0.0.0.0/0` in MongoDB Atlas
- ✅ Database name is included in URI

### Build failed on Vercel
- ✅ Check Node version compatibility
- ✅ Verify all dependencies in package.json
- ✅ Check build logs in Vercel dashboard

---

## 📊 Environment Variables Summary

### Backend (Railway)
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/matrimonial
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key-min-32-characters
```

### Frontend (Vercel)
```env
VITE_BACKEND_URL=https://your-backend.up.railway.app
```

---

## 🎯 Custom Domain (Optional)

### For Frontend (Vercel)
1. Go to Vercel project settings
2. Add custom domain: `matrimonial.yourdomain.com`
3. Update DNS records as instructed
4. SSL auto-configured

### For Backend (Railway)
1. Go to Railway project settings
2. Add custom domain: `api.yourdomain.com`
3. Update DNS CNAME record
4. Update `FRONTEND_URL` in frontend

---

## 💰 Cost Estimate

### Free Tier (Good for 1000+ users)
- MongoDB Atlas: **FREE** (512MB)
- Railway: **FREE** ($5 credit/month)
- Vercel: **FREE** (100GB bandwidth)
- **Total: $0/month**

### Paid Tier (Scale to 10k+ users)
- MongoDB Atlas: **$9/month** (2GB)
- Railway: **$20/month** (8GB RAM)
- Vercel Pro: **$20/month** (1TB bandwidth)
- **Total: ~$50/month**

---

## ✨ Post-Deployment Optimization

### Performance
- Enable Vercel Analytics (free)
- Add Railway monitoring
- Set up error tracking (Sentry)

### Security
- Add rate limiting (express-rate-limit)
- Enable MongoDB IP whitelist for production
- Rotate JWT secret periodically

### Features
- Add TURN servers for better call reliability
- Enable real-time notifications
- Add image CDN (Cloudinary)

---

## 🎉 You're Ready!

Your app is **production-ready** with:
- ✅ Scalable backend (Railway)
- ✅ Fast frontend (Vercel CDN)
- ✅ Managed database (MongoDB Atlas)
- ✅ WebRTC calling working globally
- ✅ Socket.IO real-time features
- ✅ Love Guru chatbot ready

**Next**: Follow Step 1-5 above to deploy! 🚀
