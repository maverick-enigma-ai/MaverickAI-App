# 🗄️ Supabase Setup Guide

**Goal:** Configure Supabase database for MaverickAI

---

## ✅ Step 1: Create Supabase Project (2 min)

1. Go to: https://supabase.com
2. Sign in / Create account
3. Click "New Project"
4. Fill in:
   - Name: `MaverickAI`
   - Database Password: (save this!)
   - Region: Choose closest to you
5. Wait ~2 minutes for project creation

---

## 🔐 Step 2: Get API Credentials (1 min)

1. Go to: Settings → API
2. Copy these values:
   - **Project URL:** `https://your-project.supabase.co`
   - **anon/public key:** `eyJhbG...` (long string)
3. Add to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## 📊 Step 3: Run Database Migrations (5 min)

**Download SQL migrations from:**
`MQ-MAVERICK LIBRARY/02-DATABASE-MIGRATIONS/supabase_migration.sql`

**Then:**

1. In Supabase dashboard: SQL Editor
2. Click "New Query"
3. Paste contents of `supabase_migration.sql`
4. Click "Run"
5. Wait for success message

**This creates:**
- ✅ `analyses` table (stores query results)
- ✅ `submissions` table (tracks processing)
- ✅ User authentication setup
- ✅ Row Level Security (RLS) policies
- ✅ Storage buckets

---

## 🔒 Step 4: Verify RLS Policies (2 min)

1. Go to: Authentication → Policies
2. Verify policies exist for:
   - `analyses` table
   - `submissions` table
3. Each table should have:
   - SELECT policy (users see own data)
   - INSERT policy (users create own data)
   - UPDATE policy (users update own data)

**If missing:** Re-run migration SQL

---

## 📁 Step 5: Set Up Storage (Optional, 2 min)

**For file uploads:**

1. Go to: Storage → Create bucket
2. Name: `make-9398f716-attachments`
3. Public: NO (keep private)
4. Click "Create bucket"

**Then set up RLS policies:**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'make-9398f716-attachments');

-- Allow users to read own files
CREATE POLICY "Allow users to read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (owner_id = auth.uid());
```

---

## ✅ Step 6: Test Connection (2 min)

**In your local app:**

```bash
npm run dev
```

**Try to:**
1. Sign up new user
2. Sign in
3. Submit test query
4. Check if data appears in Supabase:
   - Table Editor → `analyses`
   - Should see new row

**If no data:** Check browser console for errors

---

## 🔧 Troubleshooting

### **"relation does not exist" error**
- Migration didn't run successfully
- Re-run `supabase_migration.sql`
- Check SQL Editor for error messages

### **"RLS policy violation" error**
- RLS policies not set up
- Check Authentication → Policies
- Verify policies exist for both tables

### **"Failed to fetch" error**
- Check `VITE_SUPABASE_URL` is correct
- Check `VITE_SUPABASE_ANON_KEY` is correct
- Verify project is not paused (free tier)

---

## 📖 Additional Migrations

**For advanced features:**

In `MQ-MAVERICK LIBRARY/02-DATABASE-MIGRATIONS/`:
- `add_psychological_profile_field.sql` - Gold Nugget #1
- `supabase_add_stripe_fields.sql` - Payment integration
- `supabase_sovereignty_tables.sql` - Advanced features

**Run these only if needed!**

---

## 🎯 Success Checklist

- [ ] Supabase project created
- [ ] API credentials copied to `.env`
- [ ] Main migration SQL executed
- [ ] RLS policies verified
- [ ] Storage bucket created (if using files)
- [ ] Test user can sign up
- [ ] Test user can sign in
- [ ] Test data saves to database

---

**✅ Supabase is ready!**

**Next:** See `OPENAI_SETUP.md` to configure AI assistant
