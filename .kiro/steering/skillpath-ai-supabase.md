# SkillPath AI - Hackathon Project Guidelines (Full Supabase)

## Project Overview

**SkillPath AI** adalah aplikasi pembelajaran adaptif berbasis AI yang menggunakan algoritma Bayesian Knowledge Tracing (BKT) untuk memberikan pengalaman belajar yang dipersonalisasi. Sistem mengukur, menganalisis, dan menyesuaikan pembelajaran untuk setiap siswa secara individual.

**USP**: Dua siswa dengan kemampuan berbeda mendapatkan jalur pembelajaran yang berbeda - bukan sekadar chatbot, tetapi sistem yang secara aktif menyesuaikan pembelajaran.

**Timeline**: 4 minggu MVP development
**Subject**: Matematika SMP (3-5 topik untuk MVP)
**Architecture**: Full Supabase (Backend as a Service)

---

## Tech Stack (MUST FOLLOW)

### Frontend

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (menggunakan `@tailwindcss/vite` plugin, BUKAN PostCSS)
- **State Management**: Zustand or Context API
- **HTTP Client**: Supabase JS Client (`@supabase/supabase-js`)
- **Routing**: React Router v6
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

### Backend (BaaS)

- **Platform**: Supabase (Backend as a Service)
- **Database**: PostgreSQL (Supabase-hosted)
- **Auth**: Supabase Auth with JWT (built-in)
- **Real-time**: Supabase Realtime (optional)
- **Storage**: Supabase Storage (optional untuk learning materials)
- **Edge Functions**: Deno runtime (optional untuk AI proxy)

### Algorithm Engine

- **Location**: Client-side (`/src/lib/algorithms/`)
- **Language**: TypeScript
- **Logic**: BKT calculations, recommendation engine, prerequisite checker
- **Note**: No separate backend service - runs in browser

### AI Service

- **Option A**: Direct API call from frontend (faster untuk MVP, API key di `.env`)
- **Option B**: Supabase Edge Function as proxy (lebih secure, hide API key)
- **Providers**: OpenAI API (GPT-3.5-turbo or GPT-4) or Anthropic Claude API

---

## System Architecture

**Full Supabase Architecture:**

```
┌─────────────────────────────────────────┐
│   React Frontend (Client-Side)          │
│  ┌────────────────────────────────────┐ │
│  │ Components & Pages                 │ │
│  │ - UI/UX Layer                      │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ /src/lib/ (Business Logic)         │ │
│  │ - BKT Algorithm (TypeScript)       │ │
│  │ - Recommendation Engine            │ │
│  │ - Supabase API Services            │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ Supabase JS Client                 │ │
│  │ - Auth, Database, Realtime         │ │
│  └────────────────────────────────────┘ │
└──────────────┬──────────────────────────┘
               ↓ HTTPS (Supabase SDK)
┌──────────────────────────────────────────┐
│        Supabase Platform                 │
│  ┌────────────────────────────────────┐  │
│  │ PostgreSQL Database                │  │
│  │ - users, topics, questions         │  │
│  │ - student_progress (BKT params)    │  │
│  │ - student_answers                  │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ Supabase Auth (JWT)                │  │
│  │ - Email/Password                   │  │
│  │ - Session Management               │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ Edge Functions (Optional)          │  │
│  │ - AI Tutor Proxy                   │  │
│  └────────────────────────────────────┘  │
└──────────────┬───────────────────────────┘
               ↓ HTTPS (from Edge Fn or Frontend)
┌──────────────────────────────────────────┐
│     OpenAI / Claude API                  │
│     (AI Tutor)                           │
└──────────────────────────────────────────┘
```

**Key Points**:

1. **No separate backend** - Supabase handles database, auth, APIs
2. **BKT runs client-side** - TypeScript implementation di `/src/lib`
3. **Direct database access** - Supabase JS Client dengan Row Level Security
4. **JWT built-in** - Supabase Auth automatically handles tokens

---

## Project Structure

### Root Directory

```
JOINTSUGM2026/
├── src/                        # Frontend React app
├── supabase/                   # Supabase config & migrations
├── docs/                       # Documentation
├── .kiro/                      # Kiro steering files
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### Frontend (`src/`)

```
src/
├── components/                 # Reusable UI components
│   ├── diagnostic/
│   │   ├── DiagnosticTest.tsx
│   │   └── QuestionCard.tsx
│   ├── knowledge-map/
│   │   ├── KnowledgeMap.tsx
│   │   ├── TopicCard.tsx
│   │   └── ProgressBar.tsx
│   ├── learning/
│   │   ├── LearningMaterial.tsx
│   │   └── PracticeExercise.tsx
│   ├── ai-tutor/
│   │   ├── ChatInterface.tsx
│   │   └── MessageBubble.tsx
│   └── dashboard/
│       ├── StudentDashboard.tsx
│       └── ProgressChart.tsx
├── pages/                      # Page-level components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── DiagnosticTestPage.tsx
│   ├── LearningPath.tsx
│   └── TopicDetailPage.tsx
├── lib/                        # Backend logic & services
│   ├── supabase.ts            # Supabase client initialization
│   ├── api/                   # API service abstraction
│   │   ├── auth.ts           # Authentication services
│   │   ├── topics.ts         # Topics queries
│   │   ├── questions.ts      # Questions management
│   │   ├── progress.ts       # Student progress tracking
│   │   ├── answers.ts        # Answer submission
│   │   └── aiTutor.ts        # AI Tutor integration
│   ├── algorithms/            # BKT & Recommendation (CLIENT-SIDE)
│   │   ├── bkt.ts            # Bayesian Knowledge Tracing
│   │   ├── recommendation.ts # Topic recommendation engine
│   │   └── prerequisite.ts   # Prerequisite checker
│   └── types.ts              # Shared TypeScript types
├── hooks/                     # Custom React hooks
│   ├── useAuth.ts            # Authentication hook
│   ├── useProgress.ts        # Progress tracking
│   ├── useTopics.ts          # Topics data fetching
│   └── useSupabaseQuery.ts   # Generic Supabase query hook
├── utils/                     # Helper functions
│   ├── constants.ts
│   └── helpers.ts
└── index.css                  # Tailwind CSS entry
```

### Supabase Configuration (`supabase/`)

```
supabase/
├── migrations/                         # Database schema migrations
│   ├── 20261011000000_create_users_table.sql
│   ├── 20261011000001_create_topics_table.sql
│   ├── 20261011000002_create_prerequisites_table.sql
│   ├── 20261011000003_create_questions_table.sql
│   ├── 20261011000004_create_student_progress_table.sql
│   ├── 20261011000005_create_student_answers_table.sql
│   ├── 20261011000006_create_learning_materials_table.sql
│   ├── 20261011000007_create_rls_policies.sql
│   └── 20261011000008_seed_initial_data.sql
├── functions/                          # Edge Functions (optional)
│   └── ai-tutor-proxy/
│       ├── index.ts                   # AI API proxy
│       └── deno.json
└── config.toml                        # Supabase project config
```

---

## Database Schema (PostgreSQL)

### Core Tables

#### 1. users (managed by Supabase Auth)

```sql
-- Supabase Auth handles this automatically
-- Access via: auth.users table
-- Additional profile info in public.user_profiles (optional)
```

#### 2. topics

```sql
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    order_sequence INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. prerequisites

```sql
CREATE TABLE prerequisites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    requires_topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    min_mastery_required DECIMAL(3,2) DEFAULT 0.70,
    UNIQUE(topic_id, requires_topic_id)
);
```

#### 4. questions

```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) CHECK (question_type IN ('multiple_choice', 'true_false')),
    options JSONB,  -- Array of options for multiple choice
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_topic_difficulty ON questions(topic_id, difficulty);
```

#### 5. student_progress (BKT State)

```sql
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    mastery_level DECIMAL(5,2) DEFAULT 0.00,  -- 0-100%
    p_learned DECIMAL(4,3) DEFAULT 0.000,     -- P(L) - Probability learned
    p_guess DECIMAL(4,3) DEFAULT 0.250,       -- P(G) - Probability of guessing
    p_slip DECIMAL(4,3) DEFAULT 0.100,        -- P(S) - Probability of slip
    p_transit DECIMAL(4,3) DEFAULT 0.100,     -- P(T) - Probability of learning
    total_attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    last_practiced TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

CREATE INDEX idx_student_progress_user ON student_progress(user_id, mastery_level);
```

#### 6. student_answers

```sql
CREATE TABLE student_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    student_answer VARCHAR(255),
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INTEGER,
    attempt_number INTEGER DEFAULT 1,
    answered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_student_answers_user ON student_answers(user_id, answered_at);
```

#### 7. learning_materials

```sql
CREATE TABLE learning_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    material_type VARCHAR(20) CHECK (material_type IN ('concept', 'example', 'video_link', 'exercise')),
    order_sequence INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_learning_materials_topic ON learning_materials(topic_id, order_sequence);
```

### Row Level Security (RLS) Policies

**IMPORTANT**: Enable RLS pada semua tables dan buat policies untuk security

```sql
-- Enable RLS
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own progress
CREATE POLICY "Users can view own progress"
ON student_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON student_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Similar policies for student_answers, etc.
```

---

## Core Features (P0 - MUST HAVE)

### 1. Diagnostic Test

- 10-15 multiple choice questions
- Maps to 3-5 topics
- Calculates initial mastery using BKT (client-side)
- Output: Knowledge map with mastery percentages

### 2. Knowledge Map

- Visual representation of topic mastery
- Status colors: 🔴 Not Mastered (0-40%), 🟡 In Progress (41-70%), 🟢 Mastered (71-100%)
- Shows prerequisites and locked topics
- Displays recommended next topic

### 3. Adaptive Learning Path

- Recommends topics based on lowest mastery with met prerequisites
- Provides learning materials per topic
- Adjusts difficulty based on performance

### 4. Adaptive Exercises

- Questions adapt to student mastery level
- Updates BKT parameters after each answer (client-side calculation)
- Shows immediate feedback with explanations
- Updates mastery percentage in real-time

### 5. AI Tutor (Context-Aware)

- Answers questions with context (topic, student level, materials)
- Explains mistakes without giving direct answers
- Provides hints for problem-solving
- Constrained to curriculum scope

### 6. Progress Dashboard

- Overall progress percentage
- Topic breakdown with status
- Recommended next topic
- Recent activities

---

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript strict mode
- Prefer `const` over `let`, avoid `var`
- Use functional components with hooks
- Component names in PascalCase
- File names match component names
- Destructure props in function parameters
- Use async/await over promises
- Handle errors with try-catch
- Use Zod for runtime validation

### React Patterns

- One component per file
- Keep components focused and single-purpose
- Use custom hooks for reusable logic
- Lift state up when needed, otherwise keep local
- Use React.memo() for expensive renders only
- Prefer composition over prop drilling

### Tailwind CSS v4

- Use utility classes directly in JSX
- Use custom classes from `src/index.css` (@layer components)
- Available custom classes: `.btn-primary`, `.btn-secondary`, `.card`, `.card-hover`, `.input`, `.badge-*`
- Color scheme (lihat `docs/DESIGN.md` §3): pink `#FF4F87` (primary), violet `#6D36BD` (secondary/XP), warm emerald `#1E9E6B` (mastered), warm amber `#E8A33D` (in progress), warm coral `#E2544B` (not mastered) — **bukan** `blue-500`/`green-500` Tailwind default
- Avoid custom CSS files; extend `src/index.css` if needed

### Supabase Patterns

- Always use Row Level Security (RLS) policies
- Use Supabase JS Client SDK, not direct PostgreSQL queries
- Handle auth state with `supabase.auth.onAuthStateChange()`
- Use TypeScript types generated from database schema
- Validate data with Zod before Supabase insert/update

### BKT Algorithm (Client-Side)

- Keep BKT class pure (no side effects)
- Document formulas in comments
- Export types for BKT parameters
- Return immutable objects
- Handle edge cases (division by zero, NaN)

---

## BKT Algorithm Implementation (TypeScript)

### File: `/src/lib/algorithms/bkt.ts`

```typescript
/**
 * Bayesian Knowledge Tracing (BKT) Model
 *
 * Tracks probability that student has mastered a skill/topic
 * based on their answer history.
 */

export interface BKTParameters {
  p_learned: number; // P(L) - Current mastery probability (0-1)
  p_transit: number; // P(T) - Learning rate (~0.1)
  p_guess: number; // P(G) - Guessing probability (~0.25)
  p_slip: number; // P(S) - Slip/mistake probability (~0.1)
}

export class BKTModel {
  private p_learned: number;
  private readonly p_transit: number;
  private readonly p_guess: number;
  private readonly p_slip: number;

  constructor(params: Partial<BKTParameters> = {}) {
    this.p_learned = params.p_learned ?? 0.0;
    this.p_transit = params.p_transit ?? 0.1;
    this.p_guess = params.p_guess ?? 0.25;
    this.p_slip = params.p_slip ?? 0.1;
  }

  /**
   * Update P(L) based on student answer
   *
   * Formula for correct answer:
   * P(L|correct) = P(L) * (1 - P(S)) / [P(L) * (1 - P(S)) + (1 - P(L)) * P(G)]
   *
   * Formula for wrong answer:
   * P(L|wrong) = P(L) * P(S) / [P(L) * P(S) + (1 - P(L)) * (1 - P(G))]
   *
   * Then apply learning:
   * P(L_new) = P(L|answer) + (1 - P(L|answer)) * P(T)
   */
  update(isCorrect: boolean): number {
    let numerator: number;
    let denominator: number;

    if (isCorrect) {
      // P(L | correct answer)
      numerator = this.p_learned * (1 - this.p_slip);
      denominator = numerator + (1 - this.p_learned) * this.p_guess;
    } else {
      // P(L | wrong answer)
      numerator = this.p_learned * this.p_slip;
      denominator = numerator + (1 - this.p_learned) * (1 - this.p_guess);
    }

    // Update P(L) with evidence
    const p_learned_given_answer =
      denominator > 0 ? numerator / denominator : 0;

    // Apply learning transition
    this.p_learned =
      p_learned_given_answer + (1 - p_learned_given_answer) * this.p_transit;

    // Clamp between 0 and 1
    this.p_learned = Math.max(0, Math.min(1, this.p_learned));

    return this.p_learned;
  }

  /**
   * Get current mastery as percentage (0-100)
   */
  getMasteryPercentage(): number {
    return this.p_learned * 100;
  }

  /**
   * Check if topic is considered mastered
   */
  isMastered(threshold: number = 0.95): boolean {
    return this.p_learned >= threshold;
  }

  /**
   * Get current BKT parameters
   */
  getParameters(): BKTParameters {
    return {
      p_learned: this.p_learned,
      p_transit: this.p_transit,
      p_guess: this.p_guess,
      p_slip: this.p_slip,
    };
  }

  /**
   * Get mastery status based on thresholds
   */
  getStatus(): "not_mastered" | "in_progress" | "mastered" {
    if (this.p_learned < 0.4) return "not_mastered";
    if (this.p_learned < 0.7) return "in_progress";
    return "mastered";
  }
}
```

---

## Supabase Client Setup

### File: `/src/lib/supabase.ts`

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types"; // Generated types

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

---

## API Service Layer Examples

### File: `/src/lib/api/progress.ts`

```typescript
import { supabase } from "../supabase";
import { BKTModel } from "../algorithms/bkt";
import type { BKTParameters } from "../algorithms/bkt";

export async function getStudentProgress(userId: string, topicId: string) {
  const { data, error } = await supabase
    .from("student_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProgressWithBKT(
  userId: string,
  topicId: string,
  isCorrect: boolean,
) {
  // 1. Get current progress
  const progress = await getStudentProgress(userId, topicId);

  // 2. Initialize BKT model with current parameters
  const bkt = new BKTModel({
    p_learned: progress.p_learned,
    p_transit: progress.p_transit,
    p_guess: progress.p_guess,
    p_slip: progress.p_slip,
  });

  // 3. Update based on answer
  const newPLearned = bkt.update(isCorrect);
  const newMastery = bkt.getMasteryPercentage();

  // 4. Update database
  const { data, error } = await supabase
    .from("student_progress")
    .update({
      p_learned: newPLearned,
      mastery_level: newMastery,
      total_attempts: progress.total_attempts + 1,
      correct_attempts: progress.correct_attempts + (isCorrect ? 1 : 0),
      last_practiced: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

## Environment Variables

### File: `.env.local`

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# AI Service (Option A: Direct from frontend)
VITE_OPENAI_API_KEY=sk-your-openai-key
# OR
VITE_ANTHROPIC_API_KEY=sk-ant-your-claude-key

# App Configuration
VITE_APP_NAME=SkillPath AI
VITE_API_BASE_URL=https://your-project.supabase.co
```

**Security Note**:

- Jangan commit `.env.local` ke git
- Untuk production, pertimbangkan Edge Function untuk hide API keys
- Supabase keys (anon key) aman di frontend karena RLS policies

---

## Development Workflow

### Initial Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Supabase CLI
npm install -g supabase

# 3. Login to Supabase
supabase login

# 4. Initialize Supabase locally (optional)
supabase init

# 5. Link to your Supabase project
supabase link --project-ref your-project-ref

# 6. Run migrations
supabase db push

# 7. Start dev server
npm run dev
```

### Database Migrations

```bash
# Create new migration
supabase migration new create_new_table

# Apply migrations
supabase db push

# Reset database (careful!)
supabase db reset
```

### Type Generation

```bash
# Generate TypeScript types from database schema
supabase gen types typescript --local > src/lib/types.ts
```

---

## Testing & Verification

### Before Committing

- ✅ Run `npm run dev` - Frontend starts without errors
- ✅ Test Supabase connection works
- ✅ Verify authentication flow (register/login/logout)
- ✅ Test BKT calculations with sample data
- ✅ Verify Tailwind classes render correctly
- ✅ Check RLS policies work (can't access other users' data)

### Demo Requirements

- ✅ Show 2 students with different diagnostic results
- ✅ Demonstrate different learning paths based on mastery
- ✅ Show mastery increasing after correct answers
- ✅ Demonstrate AI Tutor context awareness
- ✅ Show prerequisite locking/unlocking

---

## What NOT to Build (Skip for MVP)

❌ Multiple subjects (stick to Matematika only)
❌ Complex gamification (XP, leaderboard, badges)
❌ Teacher dashboard (focus on student view)
❌ Video call features
❌ Mobile app (web only)
❌ Separate backend service (Supabase handles everything)
❌ Custom authentication (use Supabase Auth)
❌ Real-time multiplayer features

---

## File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `DiagnosticTest.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useAuth.ts`)
- Services: `camelCase.ts` (e.g., `api.ts`, `aiTutor.ts`)
- Types: `camelCase.ts` or `PascalCase.ts` (e.g., `types.ts`, `Database.ts`)
- Utils: `camelCase.ts` (e.g., `helpers.ts`)
- Migrations: `timestamp_description.sql` (e.g., `20261011000000_create_users_table.sql`)

---

## Success Criteria for Demo

1. **Algorithm Works**: BKT correctly updates mastery based on answers (client-side)
2. **Personalization Visible**: Different students see different recommendations
3. **AI Tutor Quality**: Context-aware, helpful, stays in scope
4. **UX Smooth**: Clear flow from diagnostic → learning → progress
5. **Technical Solid**: No crashes, proper error handling, responsive design
6. **Security**: RLS policies prevent unauthorized access
7. **Performance**: Fast loading with Supabase Realtime (optional)

---

## Quick Reference

**Project Goal**: Adaptive learning platform that proves personalization works

**Key Differentiator**: BKT-based adaptive algorithm running client-side with Supabase backend

**Target Demo**: Show 2-3 students with different learning paths

**Deadline**: 4 weeks from project start

**Priority**:

1. Algorithm accuracy (BKT works correctly)
2. Supabase integration (auth + database)
3. Feature completeness (core P0 features)
4. UI polish (Tailwind v4 styling)

**Critical Path**:

- Week 1: Supabase setup + Auth + Database schema
- Week 2: BKT algorithm + Diagnostic test
- Week 3: Adaptive exercises + AI Tutor
- Week 4: Dashboard + Polish + Demo prep
