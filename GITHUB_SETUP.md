# 🚀 GitHub & Deployment Setup

## ✅ Git Initialized!

Your project is now a Git repository with all files committed.

---

## 📤 Push to GitHub (Required for Railway/Vercel)

### Step 1: Create GitHub Repository

1. **Go to**: https://github.com/new
2. **Repository name**: `matrimonial-app` (or your choice)
3. **Visibility**: Public or Private
4. **DO NOT** initialize with README, .gitignore, or license
5. Click **Create repository**

### Step 2: Connect & Push

Run these commands in your terminal:

```powershell
cd C:\Users\ritik\OneDrive\Desktop\projects\matrimonial

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/matrimonial-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🚀 Deploy Now!

### Option 1: Railway (Backend) - Takes 5 minutes

1. **Go to**: https://railway.app
2. **Login** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select** your `matrimonial-app` repository
5. **Root Directory**: Select `backend` folder
6. **Add Environment Variables**:
   ```
   MONGO_URI=your_mongodb_connection_string
   FRONTEND_URL=https://your-app.vercel.app
   PORT=5000
   JWT_SECRET=your-super-secret-key-at-least-32-chars
   ```
7. **Deploy** → Copy the URL: `https://your-app.up.railway.app`

### Option 2: Vercel (Frontend) - Takes 3 minutes

**Method A: Vercel Dashboard**
1. Go to: https://vercel.com
2. **Import Project** → Select from GitHub
3. **Framework**: Vite
4. **Root Directory**: `frontend`
5. **Add Environment Variable**:
   ```
   VITE_BACKEND_URL=https://your-backend.up.railway.app
   ```
6. **Deploy**

**Method B: Vercel CLI** (Faster)
```powershell
npm install -g vercel

cd C:\Users\ritik\OneDrive\Desktop\projects\matrimonial\frontend
vercel login
vercel --prod
```

When prompted, add environment variable:
```
VITE_BACKEND_URL=https://your-backend.up.railway.app
```

---

## 🔄 Update After Both Deployed

1. **Go to Railway** → Your project → Variables
2. **Update `FRONTEND_URL`** to your Vercel URL
3. Railway auto-redeploys

---

## 🧪 Test Your Deployed App

1. Open your Vercel URL in **2 different browsers**
2. Register 2 different users
3. Create profiles for both
4. Send interest from User A to User B
5. User B accepts interest
6. Both now in Chat → Test calling!

---

## 📋 Quick Command Reference

```powershell
# Check Git status
git status

# Add new changes
git add .
git commit -m "Your message"
git push

# View remote
git remote -v

# Pull latest
git pull origin main
```

---

## 💡 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Vercel: Add domain in settings
   - Railway: Add custom domain

2. **MongoDB Production**
   - Get connection string from MongoDB Atlas
   - Use in Railway environment variables

3. **Enable Analytics**
   - Vercel: Built-in analytics
   - Railway: Monitor in dashboard

4. **Add TURN Servers** (Optional for better calls)
   - See STUN_TURN_GUIDE.md
   - Twilio free tier recommended

---

## 🎉 You're Ready!

**What's been done:**
- ✅ Git repository initialized
- ✅ All files committed
- ✅ .gitignore configured
- ✅ Ready to push to GitHub

**Next:**
1. Create GitHub repo
2. Push code
3. Deploy to Railway + Vercel
4. Total time: ~15 minutes

**Need help?** Check:
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Detailed steps
- [README_DEPLOY.md](README_DEPLOY.md) - Quick guide

---

Start with creating GitHub repo now! 👆
