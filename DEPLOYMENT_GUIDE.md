# 🚀 Deployment Guide - Deploy to Vercel in 10 Minutes

**Goal:** Deploy MaverickAI to production on Vercel

---

## ✅ Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free): https://vercel.com
- [ ] Code pushed to GitHub
- [ ] Supabase project configured
- [ ] OpenAI assistant created
- [ ] All environment variables ready

---

## 📦 Step 1: Push to GitHub (if not already done)

```bash
cd MaverickAI-App

# Initialize git (if new repo)
git init
git add .
git commit -m "Initial commit - MaverickAI production ready"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/maverick-enigma-ai/MaverickAI-App.git

# Push to GitHub
git push -u origin main
```

---

## 🌐 Step 2: Connect Vercel to GitHub (2 min)

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub
3. **Click:** "Add New..." → "Project"
4. **Select:** Your `MaverickAI-App` repository
5. **Click:** "Import"

---

## ⚙️ Step 3: Configure Build Settings (1 min)

**Vercel will auto-detect:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**✅ Keep these defaults!**

---

## 🔐 Step 4: Add Environment Variables (5 min)

**In Vercel project settings:**

1. **Click:** "Environment Variables" tab
2. **Add these variables:**

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI
VITE_OPENAI_API_KEY=sk-your-key-here
VITE_OPENAI_ASSISTANT_ID=asst-your-id-here

# Make.com (optional)
VITE_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/your-webhook

# Stripe (optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
```

3. **Select:** "Production", "Preview", and "Development"
4. **Click:** "Add" for each variable

**Full variable list:** See `ENV_EXAMPLE.txt`

---

## 🚀 Step 5: Deploy (2 min)

1. **Click:** "Deploy" button
2. **Wait** ~2 minutes for build
3. **Success!** You'll see: ✅ "Ready"

**Your app is now live!**
- Production URL: `https://your-app.vercel.app`
- Auto-deployed on every `git push`

---

## ✅ Step 6: Verify Deployment

**Test your live app:**

1. **Visit:** `https://your-app.vercel.app`
2. **Check:**
   - [ ] Landing page loads with premium styling
   - [ ] Navy/cyan gradients visible
   - [ ] Frosted glass effects working
   - [ ] "Get Started" button works
3. **Test sign up:**
   - [ ] Click "Get Started"
   - [ ] Create account
   - [ ] Sign in successful
4. **Test query submission:**
   - [ ] Submit test query
   - [ ] Processing animation works
   - [ ] See debriefing results
   - [ ] Data saves to dashboard

---

## 🔧 Common Issues & Fixes

### **Build Failed - "Module not found"**

**Cause:** Missing dependencies  
**Fix:**
```bash
# Locally
npm install
npm run build  # Test build works
git add package-lock.json
git commit -m "Fix: Update dependencies"
git push
```

---

### **Environment Variables Not Working**

**Symptoms:** Blank screen, Supabase errors, "undefined" in console

**Fix:**
1. Go to Vercel dashboard → Your project
2. Settings → Environment Variables
3. Verify all variables are set
4. Check for typos (especially URLs)
5. Deployments → Redeploy (force new build)

---

### **Supabase CORS Error**

**Symptoms:** "CORS policy" error in console

**Fix:**
1. Go to Supabase dashboard
2. Settings → API
3. Add your Vercel URL to allowed origins:
   - `https://your-app.vercel.app`
   - `https://*.vercel.app` (for preview deployments)

---

### **Tailwind Styles Not Loading**

**Symptoms:** Plain white page, no gradients, no styling

**Fix:**
1. Check `styles/globals.css` is in repo
2. Check `main.tsx` imports: `import './styles/globals.css'`
3. Verify NO `tailwind.config.js` exists (Tailwind v4 doesn't need it)
4. Redeploy

---

### **OpenAI API Errors**

**Symptoms:** Queries fail, "API key invalid" errors

**Fix:**
1. Check environment variable: `VITE_OPENAI_API_KEY`
2. Verify key is valid on https://platform.openai.com/api-keys
3. Check OpenAI account has credits
4. Verify assistant ID is correct

---

## 🔄 Continuous Deployment

**Every time you push to GitHub:**
1. Vercel automatically detects changes
2. Builds new version
3. Deploys to production
4. Takes ~2 minutes

**To deploy:**
```bash
git add .
git commit -m "Your commit message"
git push
```

**Watch deployment:**
- Go to Vercel dashboard
- Click "Deployments" tab
- See real-time build logs

---

## 🌍 Custom Domain (Optional)

**Want custom domain?** (e.g., `maverickenigma.com`)

1. **Buy domain** (GoDaddy, Namecheap, etc.)
2. **In Vercel:**
   - Settings → Domains
   - Add domain
   - Follow DNS instructions
3. **Wait** ~24 hours for DNS propagation
4. **Done!** Auto-HTTPS enabled

---

## 📊 Monitor Deployment

**Check Vercel dashboard for:**
- Build logs (debug errors)
- Function logs (backend errors)
- Analytics (usage stats)
- Performance metrics

---

## 🔐 Security Checklist

Before going live:

- [ ] All `.env` secrets in Vercel (not in code)
- [ ] Supabase RLS policies enabled
- [ ] OpenAI API key is production key
- [ ] Stripe keys are live keys (not test)
- [ ] CORS configured in Supabase
- [ ] HTTPS enabled (Vercel auto)
- [ ] Row Level Security tested

---

## 🎯 Post-Deployment Checklist

- [ ] Production URL works
- [ ] Can sign up new users
- [ ] Can sign in existing users
- [ ] Can submit queries
- [ ] Queries process successfully
- [ ] Dashboard shows data
- [ ] History persists
- [ ] Profile screen works
- [ ] Stripe payment works (if enabled)
- [ ] File upload works (if enabled)
- [ ] Mobile responsive
- [ ] Desktop works

---

## 🚀 Advanced: Deploy Backend

**If using Supabase Edge Functions:**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy edge functions
supabase functions deploy make-server-9398f716
```

**Your server route:**
`https://your-project.supabase.co/functions/v1/make-server-9398f716/`

---

## 📖 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html
- **Supabase Hosting:** https://supabase.com/docs/guides/hosting
- **Tailwind Production:** https://tailwindcss.com/docs/optimizing-for-production

---

## 🆘 Need Help?

**Deployment failing?**
1. Check build logs in Vercel dashboard
2. Look for red error messages
3. Copy exact error
4. See troubleshooting guides in `MQ-MAVERICK LIBRARY/03-TROUBLESHOOTING/`

---

## ✅ Success!

**Your app is now live!** 🎉

**Next steps:**
- Share production URL with testers
- Monitor analytics in Vercel
- Set up custom domain
- Enable Stripe payments
- Test on mobile devices
- Submit to BravoStudio (see `MQ-MAVERICK LIBRARY/06-BRAVO-STUDIO/`)

---

**🚀 Congratulations on deploying MaverickAI!**
