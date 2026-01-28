# 📤 Push to GitHub - Step by Step

## Your local Git status: ✅ Ready to Push!

You have 3 commits ready:
- Initial commit - Ready for deployment
- first commit  
- Add GitHub and deployment setup guide

---

## Step 1: Create GitHub Repository

Since the repository doesn't exist yet:

1. **Go to**: https://github.com/new
2. **Repository name**: `matrimonial-app`
3. **Description**: "MatrioMoney - Matrimonial App with Video Calling"
4. **Visibility**: Select **Public** (required for free Railway/Vercel)
5. **DO NOT** initialize with:
   - ❌ README
   - ❌ .gitignore
   - ❌ License
6. Click **Create repository**

---

## Step 2: Push Your Code

After creating the repository on GitHub, run this command:

```powershell
cd C:\Users\ritik\OneDrive\Desktop\projects\matrimonial
git push -u origin main
```

You'll be prompted to authenticate - use your GitHub credentials or personal access token.

---

## ✅ After Push Succeeds

You should see:
```
Enumerating objects: ...
Counting objects: ...
Compressing objects: ...
Writing objects: ...
Total ... (delta ...), reused ...
To https://github.com/YOUR_USERNAME/matrimonial-app.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🚀 Then Deploy Immediately

Once code is on GitHub:

### Railway (5 minutes)
1. https://railway.app → Login with GitHub
2. New Project → Deploy from GitHub repo
3. Select `matrimonial-app` repo
4. Root Directory: `backend`
5. Add environment variables (see DEPLOYMENT_CHECKLIST.md)
6. Deploy!

### Vercel (3 minutes)
1. https://vercel.com → Login with GitHub
2. Import Project → Select `matrimonial-app`
3. Framework: Vite
4. Root Directory: `frontend`
5. Add `VITE_BACKEND_URL` environment variable
6. Deploy!

---

## 🔑 GitHub Authentication Options

If Git asks for credentials:

### Option 1: Personal Access Token (Recommended)
1. Go to: https://github.com/settings/tokens
2. Generate new token → **Classic**
3. Scopes: `repo` (full control of private repositories)
4. Copy token
5. When prompted, use token as password

### Option 2: GitHub CLI
```powershell
winget install gh
gh auth login
# Follow prompts
```

### Option 3: SSH Key
```powershell
ssh-keygen -t ed25519 -C "your@email.com"
# Add public key to GitHub Settings → SSH Keys
```

---

## ⚠️ Common Issues

### "Repository not found"
- ✅ You must create the repo on GitHub.com first
- ✅ Use exact URL: `https://github.com/USERNAME/matrimonial-app.git`

### "Permission denied"
- ✅ Use personal access token, not password
- ✅ Or set up SSH key

### "Authentication failed"
- ✅ Clear cached credentials: `git credential reject https://github.com`
- ✅ Try again

---

## 📋 Quick Checklist

- [ ] Created GitHub repo at github.com/new
- [ ] Repository name: `matrimonial-app`
- [ ] Did NOT initialize with README/gitignore/license
- [ ] Ran: `git push -u origin main`
- [ ] Code uploaded successfully
- [ ] Ready to deploy to Railway + Vercel

---

**Once GitHub push succeeds, you're ready to deploy to production! 🚀**
