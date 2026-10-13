# Debug Guide - Auth Page Not Showing

## Problem
Auth page tidak muncul di localhost setelah `npm run dev`

## Fixed Issues ✅
1. ✅ **Supabase client crash fixed** - Changed from `throw Error` to `console.warn`
2. ✅ **Created .env.local.example** - Template untuk environment variables

## Debugging Steps

### 1. Check Browser Console (IMPORTANT!)
```
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Take screenshot or copy error message
```

**Common errors:**
- "Supabase Config Not Found" → Need to create .env.local
- "Cannot read property of undefined" → Import issue
- "Module not found" → Missing dependency
- "Network error" → Dev server not running

### 2. Check Dev Server Output
```bash
npm run dev
```

Look for:
- ✅ "Local: http://localhost:5173" → Server running OK
- ❌ "Error: ..." → Build/compile error
- ❌ "ELIFECYCLE" → npm error

### 3. Check Network Tab
```
1. Open DevTools → Network tab
2. Reload page (Ctrl+R)
3. Check if:
   - index.html loads (200 status)
   - main.jsx loads (200 status)
   - index.css loads (200 status)
```

### 4. Navigate to Correct URL
Make sure you're visiting:
```
✅ http://localhost:5173/auth
❌ http://localhost:5173/login (will redirect)
❌ http://localhost:5173/register (will redirect)
```

### 5. Check if Tailwind CSS Works
Look at the page - if you see:
- ❌ Unstyled text (black on white, default fonts) → Tailwind not working
- ✅ Styled page with colors → Tailwind OK

### 6. Test with Simple Component
Try navigating to:
```
http://localhost:5173/
```
This should show "Ini landing page biasa aja". If this works, routing is OK.

## Quick Fixes

### Fix 1: Missing Environment Variables
**Symptom:** Console warning "Supabase Config Not Found"

**Solution:**
```bash
# Create .env.local file
cp .env.local.example .env.local

# Edit .env.local and add real values:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Restart dev server
npm run dev
```

### Fix 2: Tailwind Not Loading
**Symptom:** Page shows but no colors/styling

**Solution:**
```bash
# Check if Tailwind is in vite.config.ts
cat vite.config.ts

# Should see: import tailwindcss from "@tailwindcss/vite"
# If missing, reinstall:
npm install @tailwindcss/vite tailwindcss
```

### Fix 3: Lucide Icons Not Showing
**Symptom:** Console error "Cannot resolve lucide-react"

**Solution:**
```bash
npm install lucide-react
```

### Fix 4: White Screen / Blank Page
**Symptom:** Nothing shows, white screen

**Possible causes:**
1. JavaScript error (check console)
2. Import error (check console)
3. CSS not loaded (check Network tab)
4. Wrong route (check URL)

**Solution:**
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

### Fix 5: Port Already in Use
**Symptom:** "Port 5173 is already in use"

**Solution:**
```bash
# Kill existing process
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- --port 3000
```

## Test Checklist

Run these tests in order:

### Test 1: Dev Server Starts
```bash
npm run dev
```
✅ Should see "Local: http://localhost:5173"

### Test 2: Landing Page Loads
Visit: `http://localhost:5173/`
✅ Should see "Ini landing page biasa aja"

### Test 3: Auth Redirect Works
Visit: `http://localhost:5173/login`
✅ Should redirect to `/auth`

### Test 4: Auth Page Shows
Visit: `http://localhost:5173/auth`
✅ Should see auth page with:
- Dark background (mobile)
- Two panels (desktop)
- "SkillPath AI" branding
- Login/Register tabs
- Form inputs

### Test 5: Console Clean
Check browser console
✅ Should only see warning about Supabase (if no .env.local)
❌ Should NOT see any red errors

## What to Report

If still not working, provide:

1. **Browser console screenshot** (F12 → Console tab)
2. **Network tab screenshot** (F12 → Network tab)
3. **Dev server output** (terminal where npm run dev is running)
4. **URL you're visiting** (copy from address bar)
5. **What you see** (white screen? error? partially loaded?)

## Emergency Fallback

If Auth.tsx still doesn't work, temporarily use old Login.tsx:

```tsx
// src/App.tsx
<Route path="/auth" element={<Login />} /> // Use old component
```

This will at least let you test basic auth flow while debugging the new design.

---

**Status:** Supabase client fixed ✅
**Next Step:** Check browser console for errors
**Created:** 2026-10-13
