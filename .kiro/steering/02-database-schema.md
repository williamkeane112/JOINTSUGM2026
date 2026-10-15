# Database Schema (PostgreSQL / Supabase)

> **⚠️ IMPORTANT**: Gunakan PostgreSQL syntax, bukan MySQL. Supabase Auth manages `users` table.
>
> **⚠️ USANG (2026-10-15)**: dokumen ini adalah rancangan awal. DB yang dipakai tim adalah `.kiro/steering/supabase-db-model.md` (+ `supabase/migrations/20261013035717_fullSql.sql`): `topics.id` bigint, tidak ada `student_progress`/`student_answers`/`learning_materials`; mastery per `skill_key` di `student_mastery`. Bagian BKT/RLS di bawah hanya referensi konsep.

---

## ERD (Entity Relationship Diagram)

```
auth.users (Supabase Auth)
    ↓
student_progress → topics ← prerequisites
    ↓                 ↓
student_answers   questions
                     ↓
              learning_materials
```

---

## Core Tables

### 1. users (Managed by Supabase Auth)
```sql
-- Auto-managed by Supabase Auth
-- Access via: auth.users
-- Fields: id (UUID), email, created_at, etc.
```

### 2. topics
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

### 3. prerequisites
```sql
CREATE TABLE prerequisites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    requires_topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    min_mastery_required DECIMAL(3,2) DEFAULT 0.70,
    UNIQUE(topic_id, requires_topic_id)
);
```

### 4. questions
```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(20) CHECK (question_type IN ('multiple_choice', 'true_false')),
    options JSONB,  -- Array of options
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    source VARCHAR(10) DEFAULT 'manual' CHECK (source IN ('manual', 'ai')),  -- 'ai' = digenerate SEKALI per topik, dicek manual, di-cache di sini
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_topic_difficulty ON questions(topic_id, difficulty);
```

> **Catatan 2026-10-14**: `topics` = katalog seeded (bukan dibuat AI). Level di dalam topik (Journey) **belum punya tabel** — asumsi sementara tiap level = skill dengan P(L) sendiri → butuh tabel level atau `topics.parent_id`. Putuskan sebelum membangun Journey; tidak memblok Dashboard (pakai mock). `topic_requests` ("Ajukan topik baru") = post-MVP.

### 5. student_progress (BKT State)
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

### 6. student_answers
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

### 7. learning_materials
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

---

## Row Level Security (RLS)

**CRITICAL**: Enable RLS pada semua user-specific tables.

```sql
-- Enable RLS
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own progress"
ON student_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON student_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
ON student_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Similar for student_answers
CREATE POLICY "Users can view own answers"
ON student_answers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
ON student_answers FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

## Migration Files Location

```
supabase/migrations/
├── 20261011000000_create_users_table.sql       (if needed)
├── 20261011000001_create_topics_table.sql
├── 20261011000002_create_prerequisites_table.sql
├── 20261011000003_create_questions_table.sql
├── 20261011000004_create_student_progress_table.sql
├── 20261011000005_create_student_answers_table.sql
├── 20261011000006_create_learning_materials_table.sql
├── 20261011000007_create_rls_policies.sql
└── 20261011000008_seed_initial_data.sql
```

---

## Sample Seed Data (3 Topics)

```sql
INSERT INTO topics (name, description, subject, difficulty_level, order_sequence) VALUES
('Operasi Dasar', 'Penjumlahan, pengurangan, perkalian, pembagian', 'Matematika', 'beginner', 1),
('Pecahan', 'Memahami dan operasi pecahan', 'Matematika', 'beginner', 2),
('Persamaan Linear', 'Menyelesaikan persamaan linear sederhana', 'Matematika', 'intermediate', 3);

-- Prerequisites
INSERT INTO prerequisites (topic_id, requires_topic_id, min_mastery_required)
SELECT 
    t1.id as topic_id,
    t2.id as requires_topic_id,
    0.70 as min_mastery_required
FROM topics t1, topics t2
WHERE t1.name = 'Pecahan' AND t2.name = 'Operasi Dasar';
```

---

*Ref: Full migration SQL di `supabase/migrations/`*
