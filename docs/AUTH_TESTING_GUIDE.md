# Auth Page - Quick Testing Guide

## 🚀 Quick Start

```bash
# 1. Ensure dependencies installed
npm install

# 2. Check environment variables
# Make sure .env.local has:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_PUBLISHABLE_KEY=...

# 3. Run dev server
npm run dev

# 4. Open browser
# http://localhost:5173/auth
```

## ✅ Quick Visual Check

### Desktop View (> 1024px)

- [ ] Two panels visible (dark left, cream right)
- [ ] Spark orbit animation on left
- [ ] Auth form on right
- [ ] Background blobs visible with subtle animation
- [ ] Decorative rings present

### Mobile View (< 768px)

- [ ] Single column layout
- [ ] Dark background with blobs
- [ ] White/gradient auth card
- [ ] Mobile brand header visible
- [ ] All form elements accessible

## ⚡ Fast Functional Test

### 1. Tab Switching (10 seconds)

- Click "Daftar" → Form shows name field
- Click "Masuk" → Name field disappears
- Pink underline animates

### 2. Form Interaction (20 seconds)

**Register Mode:**

1. Fill name: "Test User"
2. Fill email: "test@example.com"
3. Fill password: "test123"
4. Click password eye icon → text visible
5. Click eye again → hidden
6. Check terms checkbox
7. Submit → should show loading state

**Login Mode:**

1. Fill email: "test@example.com"
2. Fill password: "test123"
3. Check "Ingat saya"
4. Submit → should show loading state

### 3. Responsive Test (30 seconds)

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Try these widths:
   - 375px (Mobile)
   - 768px (Tablet)
   - 1024px (Laptop)
   - 1440px (Desktop)
4. Check layout doesn't break

## 🐛 Common Issues & Solutions

### Issue: "Supabase Config Not Found"

**Solution:** Create `.env.local` with Supabase credentials

### Issue: Merge conflict in package.json

**Solution:** Already fixed! Run `npm install` again

### Issue: TypeScript errors

**Solution:** Run `npx tsc --noEmit` to check specific errors

### Issue: Tailwind styles not working

**Solution:** Check `vite.config.ts` has `@tailwindcss/vite` plugin

### Issue: Icons not showing

**Solution:** Check `lucide-react` is installed (`npm list lucide-react`)

### Issue: Form doesn't submit

**Solution:** Check browser console for Supabase connection errors

### Issue: Redirect doesn't work after login

**Solution:** Check `react-router-dom` version and `/dashboard` route exists

## 📱 Device Testing Priority

1. **Desktop Chrome** (1920x1080) - Primary
2. **iPhone 12/13** (390x844) - Mobile
3. **iPad** (768x1024) - Tablet
4. **Small Android** (360x640) - Edge case

## 🎨 Visual Regression Checklist

- [ ] Pink brand color `#ff4f87` consistent
- [ ] Button hover changes to `#e62f72`
- [ ] Input focus shows pink ring
- [ ] Tab underline is 3px height
- [ ] Spark orbit has rounded square shape
- [ ] Background blobs have shadow/blur
- [ ] Text is readable (good contrast)
- [ ] Icons are 16px size
- [ ] Spacing looks balanced

## 🔐 Auth Flow Test (with real Supabase)

### Prerequisites:

- Supabase project created
- Email Auth enabled in Supabase dashboard
- Email templates configured

### Test Register:

1. Go to `/auth`
2. Click "Daftar" tab
3. Fill form with NEW email
4. Submit
5. **Expected:**
   - Success message "Akun dibuat. Cek email untuk konfirmasi."
   - Email received (check inbox/spam)
   - Click confirm link in email
   - Can login after confirmation

### Test Login:

1. Go to `/auth`
2. Click "Masuk" tab (default)
3. Fill email + password
4. Submit
5. **Expected:**
   - Success message "Berhasil masuk. Selamat belajar."
   - Redirects to `/dashboard` after 500ms
   - Session stored in localStorage
   - Can access protected routes

### Test Error Handling:

1. Try login with wrong password
   - **Expected:** Error message shows
2. Try register with existing email
   - **Expected:** Error message shows
3. Try submit with empty fields
   - **Expected:** HTML5 validation prevents submit
4. Try very long email (> 100 chars)
   - **Expected:** Input handles gracefully

## 🏁 Definition of Done

- [x] TypeScript compiles with no errors
- [x] All imports resolved correctly
- [x] Component renders without crash
- [x] Routing works (`/auth`, `/login`, `/register`)
- [ ] Login flow completes successfully
- [ ] Register flow completes successfully
- [ ] Mobile responsive works
- [ ] Desktop responsive works
- [ ] Animations work (or disabled on reduce-motion)
- [ ] Accessibility keyboard navigation works
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Redirects to dashboard after auth

## 📊 Performance Check

```bash
# Check bundle size
npm run build

# Expected sizes:
# - index.html: < 1KB
# - main.js: < 500KB (with React)
# - main.css: < 10KB (Tailwind purged)
```

## 🔍 Debug Mode

Add to Auth.tsx for debugging:

```tsx
console.log("Mode:", mode);
console.log("Loading:", isLoading);
console.log("Message:", message);
```

Check browser console for:

- Auth error details
- Supabase response
- Network requests (DevTools > Network tab)

## ⏱️ Total Testing Time Estimate

- Quick visual check: **2 minutes**
- Functional test: **3 minutes**
- Responsive test: **2 minutes**
- Auth flow test (with Supabase): **5 minutes**

**Total: ~12 minutes for complete verification**

---

**Status:** ✅ Ready for testing
**Last Updated:** 2026-10-13
