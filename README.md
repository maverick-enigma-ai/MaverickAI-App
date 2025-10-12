# 🧠 MaverickAI Enigma Radar™

**Premium psychological intelligence platform for decoding power dynamics.**

---

## 🎯 Overview

MaverickAI Enigma Radar™ is a sophisticated strategy app that helps users decode psychological power dynamics through AI-powered analysis. Built with React, TypeScript, Tailwind CSS v4, and powered by OpenAI's GPT-4 with psychological profiling capabilities.

### **Key Features:**

✅ **Psychological Inference Engine** - Deep profiling beyond surface analysis  
✅ **Power Dynamics Decoding** - Understand hidden motivations and leverage points  
✅ **Multi-Modal Analysis** - Text + file upload support (PDFs, images)  
✅ **Real-time Processing** - Direct OpenAI integration with streaming responses  
✅ **Comprehensive Dashboard** - Visualize insights with interactive charts  
✅ **Secure Authentication** - Supabase Auth with social login support  
✅ **Premium Design System** - Award-winning UI with frosted glass effects  

---

## 🚀 Quick Start

### **Prerequisites:**
- Node.js 18+ 
- Supabase account
- OpenAI API key
- Make.com account (optional, for file processing)

### **Installation:**

```bash
# Clone repository
git clone https://github.com/maverick-enigma-ai/MaverickAI-App.git
cd MaverickAI-App

# Install dependencies
npm install

# Set up environment variables
cp ENV_EXAMPLE.txt .env

# Start development server
npm run dev
```

**Then:** Open browser to `http://localhost:5173`

**Full setup guide:** See `QUICK_START.md`

---

## 📦 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 (pure CSS approach)
- **UI Components:** ShadCN UI + Lucide Icons
- **Backend:** Supabase (Auth + Database + Storage)
- **AI:** OpenAI GPT-4 with Assistant API
- **File Processing:** Make.com webhook integration
- **Deployment:** Vercel
- **Charts:** Recharts

---

## 🎨 Design System

MaverickAI uses **Tailwind CSS v4** with a custom design system:

- **Colors:** Navy (#14123F), Deep Blue (#342FA5), Cyan (#00d4ff), Purple (#8b5cf6)
- **Glass Effects:** Frosted glass with backdrop blur throughout
- **Typography:** Clean, professional, touch-friendly (48px+ targets)
- **Animations:** Smooth micro-interactions (no spinning loaders)

All design tokens are defined in `styles/globals.css` using Tailwind v4's `@theme inline` directive.

---

## 📂 Project Structure

```
MaverickAI-App/
├── components/          # React components (screens, UI elements)
│   ├── ui/             # ShadCN UI components
│   ├── figma/          # Figma import utilities
│   └── icons/          # Custom icons & branding
├── services/           # Business logic & API integrations
├── utils/              # Helper functions & adapters
├── types/              # TypeScript type definitions
├── supabase/           # Backend edge functions
├── styles/             # Global CSS (Tailwind v4)
├── public/             # Static assets (icons, manifest)
└── guidelines/         # Development guidelines
```

---

## 🔐 Environment Variables

Create `.env` file with these variables:

```env
# Supabase
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI
VITE_OPENAI_API_KEY=your-openai-key
VITE_OPENAI_ASSISTANT_ID=your-assistant-id

# Make.com (optional)
VITE_MAKE_WEBHOOK_URL=your-webhook-url
```

**Full guide:** See `ENV_EXAMPLE.txt` and setup docs.

---

## 🗄️ Database Setup

**Required:** Supabase project with PostgreSQL database

**Setup steps:**
1. Create Supabase project
2. Run SQL migrations (see `SUPABASE_SETUP.md`)
3. Configure Row Level Security (RLS)
4. Set up storage buckets

**Migration files available in:** `MQ-MAVERICK LIBRARY/02-DATABASE-MIGRATIONS/`

---

## 🤖 OpenAI Assistant Setup

**Required:** OpenAI API key + Custom Assistant

**Setup steps:**
1. Create OpenAI Assistant in playground
2. Upload custom instructions (see `OPENAI_SETUP.md`)
3. Configure structured outputs for psychological profiling
4. Add assistant ID to environment variables

**Full guide:** See `OPENAI_SETUP.md`

---

## 🚀 Deployment

### **Deploy to Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Deploy production
vercel --prod
```

**Full guide:** See `DEPLOYMENT_GUIDE.md`

---

## 🧪 Testing

```bash
# Run local development
npm run dev

# Test authentication
# Test query submission
# Test file upload
# Test dashboard visualization
```

**Testing checklist:** See deployment guide for comprehensive test scenarios.

---

## 📖 Documentation

**In this repo:**
- `QUICK_START.md` - Run locally in 10 minutes
- `DEPLOYMENT_GUIDE.md` - Deploy to Vercel
- `SUPABASE_SETUP.md` - Database configuration
- `OPENAI_SETUP.md` - AI assistant setup
- `ENV_EXAMPLE.txt` - Environment variables

**Complete library:**
- Download `MQ-MAVERICK LIBRARY/` folder for:
  - Gold Nugget feature guides
  - Database migrations (30+ .sql files)
  - Troubleshooting guides
  - Feature documentation
  - Development history

---

## 🎯 Gold Nugget #1: Psychological Inference Engine

**Status:** ✅ Complete and deployed

**Features:**
- Deep psychological profiling beyond surface analysis
- Hidden motivations and leverage point detection
- Power dynamics visualization
- Cognitive bias identification
- Strategic recommendations based on psychological patterns

**See:** `MQ-MAVERICK LIBRARY/01-GOLD-NUGGETS/GOLD_NUGGET_1_COMPLETE.md`

---

## 🏆 Awards & Recognition

MaverickAI features award-winning design:
- Premium frosted glass UI
- BravoStudio-compliant (mobile-ready)
- Touch-friendly (48px+ touch targets)
- Accessible (WCAG compliant)
- Smooth micro-interactions

---

## 📜 License

Proprietary - All rights reserved © 2024 MaverickAI Enigma Radar™

---

## 🤝 Support

For support, documentation, or questions:
- **Documentation:** See `MQ-MAVERICK LIBRARY/` folder
- **Issues:** Create GitHub issue
- **Email:** [Your support email]

---

## 🎉 Credits

**Built with:**
- React + TypeScript
- Tailwind CSS v4
- ShadCN UI
- OpenAI GPT-4
- Supabase
- Vercel

---

**🚀 Ready to decode psychological power dynamics!**
