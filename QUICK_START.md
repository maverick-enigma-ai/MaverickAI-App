# 🚀 Quick Start - Run MaverickAI Locally in 10 Minutes

**Goal:** Get MaverickAI running on `localhost:5173` in 10 minutes

---

## ✅ Prerequisites (2 min)

**Check you have:**
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Git installed
- [ ] Text editor (VS Code recommended)

**Don't have Node.js?** Download from: https://nodejs.org

---

## 📥 Step 1: Clone & Install (3 min)

```bash
# Navigate to your projects folder
cd ~/Projects  # or C:\Users\YourName\Projects on Windows

# Clone repository (if not already cloned)
git clone https://github.com/maverick-enigma-ai/MaverickAI-App.git
cd MaverickAI-App

# Install dependencies
npm install
```

**Wait ~2 minutes** for packages to install.

---

## 🔐 Step 2: Environment Variables (3 min)

### **Option A: Quick Test (No Backend)**

Create `.env` file in root folder:

```env
# Minimal config for frontend testing
VITE_SUPABASE_URL=https://demo.supabase.co
VITE_SUPABASE_ANON_KEY=demo-key
VITE_OPENAI_API_KEY=sk-demo
VITE_OPENAI_ASSISTANT_ID=asst_demo
```

**This allows you to:**
- ✅ See the UI and navigation
- ✅ Test screens and interactions
- ❌ Cannot save data or run queries yet

---

### **Option B: Full Setup (With Backend)**

**You'll need:**
1. Supabase account (free): https://supabase.com
2. OpenAI API key (paid): https://platform.openai.com

**Then:**

1. **Copy template:**
   ```bash
   cp ENV_EXAMPLE.txt .env
   ```

2. **Fill in your keys:**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_OPENAI_API_KEY=sk-your-openai-key-here
   VITE_OPENAI_ASSISTANT_ID=asst-your-assistant-id-here
   ```

3. **Set up database:**
   - See `SUPABASE_SETUP.md` for SQL migrations
   - See `OPENAI_SETUP.md` for assistant configuration

**Full setup guide:** See `SUPABASE_SETUP.md` and `OPENAI_SETUP.md`

---

## 🚀 Step 3: Start Dev Server (1 min)

```bash
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## ✅ Step 4: Open in Browser (1 min)

**Open:** http://localhost:5173

**You should see:**
- ✅ MaverickAI landing page with premium navy/cyan gradients
- ✅ Frosted glass cards
- ✅ "Get Started" button

**Click "Get Started"** → Auth screen

---

## 🧪 Step 5: Test the App (Optional)

### **With Option A (Demo Keys):**
- ✅ Navigate between screens
- ✅ See UI and design
- ❌ Cannot sign in or save data

### **With Option B (Real Keys):**

**Test Authentication:**
1. Click "Get Started"
2. Click "Sign Up"
3. Enter email & password
4. Create account
5. Sign in

**Test Query Submission:**
1. Go to Home screen
2. Enter test query: "Analyze a situation where someone is being passive-aggressive at work"
3. Click "Run Radar"
4. Watch processing animation
5. See debriefing results

**Test Dashboard:**
1. Click Dashboard tab (bottom navigation)
2. See history of analyses
3. Click analysis card
4. See detailed breakdown with charts

---

## 🆘 Troubleshooting

### **"Cannot find module" error**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **"Port 5173 is already in use"**
```bash
# Kill process using port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### **White screen / blank page**
1. Check browser console (F12)
2. Look for errors
3. Verify `.env` file exists
4. Restart dev server

### **"Supabase connection failed"**
- Check `VITE_SUPABASE_URL` is correct
- Check `VITE_SUPABASE_ANON_KEY` is correct
- Make sure you ran database migrations (see `SUPABASE_SETUP.md`)

### **"OpenAI API error"**
- Check `VITE_OPENAI_API_KEY` is valid
- Check you have credits on OpenAI account
- Make sure assistant ID is correct

---

## 📂 Project Structure

```
MaverickAI-App/
├── components/          # React components
│   ├── HomeScreen.tsx      # Main query input
│   ├── DashboardScreen.tsx # Analysis history
│   ├── ProfileScreen.tsx   # User profile
│   ├── AuthScreen.tsx      # Login/signup
│   └── ui/                 # ShadCN components
├── services/           # API integrations
│   ├── openai-direct-service.ts
│   └── stripe-service.ts
├── utils/              # Helper functions
├── styles/             # CSS (Tailwind v4)
│   └── globals.css        # All design tokens here
├── .env                # Your environment variables
└── package.json        # Dependencies
```

---

## 🎯 Next Steps

**After local dev works:**

1. **Set up full backend** (if using Option A demo keys)
   - See `SUPABASE_SETUP.md`
   - See `OPENAI_SETUP.md`

2. **Deploy to production**
   - See `DEPLOYMENT_GUIDE.md`
   - Deploy to Vercel in 10 minutes

3. **Customize design**
   - Edit `styles/globals.css` for colors
   - Modify components for layout changes
   - See Tailwind v4 docs

4. **Add features**
   - See `MQ-MAVERICK LIBRARY/01-GOLD-NUGGETS/` for feature guides
   - Gold Nugget #1 (Psychological Profiling) is already implemented

---

## 🔥 Hot Module Replacement

**Vite supports HMR** - your changes appear instantly:

1. Edit any `.tsx` file
2. Save (Ctrl+S / Cmd+S)
3. Browser updates automatically
4. No need to refresh!

---

## 🎨 Tailwind CSS v4

**This project uses Tailwind v4:**
- ✅ All design tokens in `styles/globals.css`
- ✅ No `tailwind.config.js` needed
- ✅ Uses `@theme inline` directive
- ✅ Simpler than v3, fewer configuration issues

**To customize colors:**
1. Open `styles/globals.css`
2. Find `--color-navy`, `--color-cyan`, etc.
3. Change hex values
4. Save - changes appear instantly!

---

## 📖 More Documentation

**In this repo:**
- `README.md` - Project overview
- `DEPLOYMENT_GUIDE.md` - Deploy to Vercel
- `SUPABASE_SETUP.md` - Database setup
- `OPENAI_SETUP.md` - AI assistant setup
- `ENV_EXAMPLE.txt` - All environment variables

**Complete library:**
- Download `MQ-MAVERICK LIBRARY/` for:
  - Troubleshooting guides
  - Feature development docs
  - Database migrations
  - Gold Nugget guides

---

## ✅ Success Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] `npm install` completed
- [ ] `.env` file created
- [ ] `npm run dev` running
- [ ] Browser shows MaverickAI app on localhost:5173
- [ ] Can navigate between screens
- [ ] (Optional) Can sign in and submit queries

---

**🎉 You're ready to develop!**

**Next:** See `DEPLOYMENT_GUIDE.md` to deploy to production.
