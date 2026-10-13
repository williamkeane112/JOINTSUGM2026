# SkillPath AI - Agent Instructions

This is a **hackathon project** for an adaptive learning platform using Bayesian Knowledge Tracing (BKT). Timeline: **4 weeks MVP**.

---

## Project Identity

**Name**: SkillPath AI  
**Type**: Adaptive Learning Web Application  
**Core Innovation**: Bayesian Knowledge Tracing (BKT) algorithm for personalized learning paths  
**Target**: Hackathon MVP (4 weeks)  
**Subject**: Matematika SMP (3-5 topics only)

---

## Architecture Overview

### Full Supabase Stack (NO separate backend!)
- **Frontend**: React 18+ + TypeScript + Vite + Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Algorithm**: Client-side TypeScript (BKT runs in browser)
- **AI Service**: OpenAI/Claude API (direct or via Edge Function)

### Critical: NO Node.js Express, NO Python FastAPI
All business logic lives in `/src/lib/`:
- `lib/supabase.ts` - Supabase client
- `lib/api/` - Service layer (auth, topics, progress, etc.)
- `lib/algorithms/` - BKT, recommendation engine
- `lib/types.ts` - TypeScript types

---

## Core Features (P0 - MUST HAVE)

1. **Diagnostic Test** (10-15 questions) → Initial mastery calculation
2. **Knowledge Map** - Visual representation with 🔴🟡🟢 status
3. **Adaptive Learning Path** - Recommends topics based on mastery + prerequisites
4. **Adaptive Exercises** - Questions adjust to student level, BKT updates in real-time
5. **AI Tutor** - Context-aware explanations, hints (no direct answers)
6. **Progress Dashboard** - Overall progress, topic breakdown, recommendations

---

## Database Schema (PostgreSQL)

### 7 Core Tables (ALL use UUID primary keys!)
1. `users` - Managed by Supabase Auth (auth.users)
2. `topics` - Subject topics (Operasi Dasar, Pecahan, Persamaan Linear)
3. `prerequisites` - Topic dependencies
4. `questions` - Test & exercise questions (JSONB options)
5. `student_progress` - BKT state (p_learned, p_guess, p_slip, mastery_level)
6. `student_answers` - Answer history
7. `learning_materials` - Content per topic

### IMPORTANT: Row Level Security (RLS)
ALL tables MUST have RLS policies:
```sql
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
ON student_progress FOR SELECT
USING (auth.uid() = user_id);
```

---

## BKT Algorithm (Client-Side TypeScript)

### Location: `/src/lib/algorithms/bkt.ts`

### Core Parameters
- **P(L)**: Probability of mastery (0-1)
- **P(T)**: Learning rate (~0.1)
- **P(G)**: Guess probability (~0.25)
- **P(S)**: Slip probability (~0.1)

### Update Formulas
```typescript
// After CORRECT answer:
P(L|correct) = P(L) * (1 - P(S)) / [P(L) * (1 - P(S)) + (1 - P(L)) * P(G)]

// After WRONG answer:
P(L|wrong) = P(L) * P(S) / [P(L) * P(S) + (1 - P(L)) * (1 - P(G))]

// Apply learning:
P(L_new) = P(L|answer) + (1 - P(L|answer)) * P(T)
```

### Mastery Thresholds
- 🔴 Not Mastered: < 40%
- 🟡 In Progress: 40-70%
- 🟢 Mastered: > 70%

---

## Coding Standards

### TypeScript/React
- Use TypeScript **strict mode**
- Functional components with hooks only
- PascalCase for components, camelCase for files
- Destructure props, use async/await
- One component per file, focused and single-purpose

### Tailwind CSS v4 (CRITICAL!)
- Uses `@tailwindcss/vite` plugin, NOT PostCSS
- Custom classes in `src/index.css` (@layer components):
  - `.btn-primary`, `.btn-secondary`, `.btn-success`
  - `.card`, `.card-hover`
  - `.input`
  - `.badge-mastered`, `.badge-progress`, `.badge-not-mastered`, `.badge-locked`
- Color scheme (lihat `docs/DESIGN.md` §3): pink `#FF4F87` (primary), violet `#6D36BD` (secondary/XP), warm emerald `#1E9E6B` (mastered), warm amber `#E8A33D` (in progress), warm coral `#E2544B` (not mastered) — **bukan** `blue-500`/`green-500` Tailwind default

### Supabase Patterns
- Always use Supabase JS Client, not raw SQL
- Handle auth with `supabase.auth.onAuthStateChange()`
- Use RLS policies for security
- Validate data with Zod before insert/update

---

## What NOT to Build (Skip for MVP)

❌ Multiple subjects (Matematika only!)  
❌ Teacher dashboard  
❌ Complex gamification (XP, leaderboard)  
❌ Video call features  
❌ Mobile app (web only)  
❌ Separate Node.js/Python backend  
❌ Custom auth (use Supabase Auth)  

---

## File Organization Rules

### Frontend Structure
```
src/
├── components/        # UI components (diagnostic, knowledge-map, learning, ai-tutor, dashboard)
├── pages/            # Page-level components
├── lib/              # ⚠️ ALL business logic here!
│   ├── supabase.ts          # Client init
│   ├── api/                 # Service layer
│   │   ├── auth.ts
│   │   ├── topics.ts
│   │   ├── progress.ts
│   │   ├── questions.ts
│   │   └── aiTutor.ts
│   ├── algorithms/          # BKT & recommendation
│   │   ├── bkt.ts
│   │   ├── recommendation.ts
│   │   └── prerequisite.ts
│   └── types.ts             # TypeScript types
├── hooks/            # Custom React hooks
└── utils/            # Helper functions
```

### Supabase Structure
```
supabase/
├── migrations/       # Database schema (numbered SQL files)
└── functions/        # Edge Functions (optional)
```

### ⚠️ DO NOT CREATE:
- ❌ `/backend/` folder
- ❌ `/api/` folder at root
- ❌ `/server/` folder
- ❌ `/algorithm-engine/` folder

---

## Development Workflow

### Initial Setup Commands
```bash
# Install Supabase client
npm install @supabase/supabase-js

# Install other dependencies
npm install react-router-dom zustand react-hook-form zod recharts

# Setup Supabase project (after creating on supabase.com)
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

### Environment Variables (.env.local)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-your-key  # or VITE_ANTHROPIC_API_KEY
```

---

## When Generating Code

### Always Check:
1. ✅ Using Supabase client, not fetch/axios
2. ✅ UUID for primary keys, not INT
3. ✅ RLS policies enabled
4. ✅ TypeScript strict mode
5. ✅ Tailwind v4 syntax (`@import "tailwindcss";`)
6. ✅ Code in `/src/lib/` not `/backend/`
7. ✅ BKT calculations client-side

### Never Do:
1. ❌ Create Express server
2. ❌ Create Python FastAPI service
3. ❌ Use MySQL (PostgreSQL only)
4. ❌ Use Axios (use Supabase client)
5. ❌ Custom JWT implementation
6. ❌ INT AUTO_INCREMENT (use UUID)

---

## Testing Checklist

### Before Committing
- [ ] Frontend starts: `npm run dev`
- [ ] Supabase connection works
- [ ] Auth flow: register/login/logout
- [ ] BKT calculations correct with sample data
- [ ] Tailwind classes render
- [ ] RLS policies work (can't access other users' data)

### For Demo Day
- [ ] 2 students show different diagnostic results
- [ ] Different learning paths based on mastery
- [ ] Mastery increases after correct answers
- [ ] AI Tutor gives context-aware responses
- [ ] Prerequisites lock/unlock correctly

---

## Success Criteria (Demo Day)

1. **Algorithm Works** - BKT correctly calculates mastery
2. **Personalization Visible** - Different students → different paths
3. **AI Tutor Quality** - Context-aware, helpful, no direct answers
4. **UX Smooth** - Clear flow: diagnostic → learning → progress
5. **Technical Solid** - No crashes, proper errors, responsive
6. **Security** - RLS prevents unauthorized access

---

## Priority Order

1. **Algorithm Accuracy** > Feature Completeness > UI Polish
2. **Core P0 Features** > Nice-to-haves
3. **Working Demo** > Perfect Code
4. **Supabase Integration** > Custom Backend

---

## Reference Documents

- **Planning**: `docs/PROJECT_PLAN.md` (2050 lines) - Complete technical specs
- **Guidelines**: `.kiro/steering/skillpath-ai-supabase.md` (749 lines) - Architecture & patterns
- **Progress**: `.kiro/steering/session-progress.md` - What's been done
- **Navigation**: `.kiro/steering/00-NAVIGATION.md` - Where to find what
- **MVP Scope**: `.kiro/steering/01-mvp-scope.md` - Core features quick ref
- **Database**: `.kiro/steering/02-database-schema.md` - PostgreSQL schema
- **Algorithm**: `.kiro/steering/03-bkt-algorithm.md` - BKT implementation

> **💡 TIP**: Baca `00-NAVIGATION.md` untuk tahu file mana yang berisi info apa.

---

## Quick Reminders

- **Timeline**: 4 weeks MVP (currently Week 1)
- **Architecture**: Full Supabase (no separate backend)
- **Database**: PostgreSQL with UUID
- **Algorithm**: Client-side TypeScript (not Python)
- **Tailwind**: v4 with Vite plugin
- **Scope**: 1 subject, 3-5 topics only
- **Goal**: Prove BKT-based personalization works

---

## Communication Style

When helping with this project:
- Be direct and concise
- Focus on MVP scope (skip nice-to-haves)
- Reference steering files for details
- Verify Supabase patterns (no backend folder!)
- Always use TypeScript strict mode
- Keep BKT algorithm client-side
- Use Tailwind v4 syntax

---

**Last Updated**: 2026-10-12  
**Status**: Planning & Setup Phase (Week 1)
