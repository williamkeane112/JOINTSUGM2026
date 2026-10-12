# SkillPath AI - Project Planning Document

## Executive Summary

**SkillPath AI** adalah aplikasi pembelajaran adaptif yang menggunakan AI untuk memberikan pengalaman belajar yang dipersonalisasi berdasarkan kemampuan dan kelemahan setiap siswa. Berbeda dengan platform pembelajaran konvensional yang memberikan materi yang sama untuk semua siswa, SkillPath AI menggunakan algoritma Bayesian Knowledge Tracing (BKT) untuk memetakan kemampuan siswa secara real-time dan memberikan rekomendasi materi yang disesuaikan.

### Nilai Jual Utama (USP)
Dua siswa dengan kemampuan berbeda akan mendapatkan jalur pembelajaran yang berbeda - sistem tidak hanya menjawab pertanyaan, tetapi secara aktif mengukur, menganalisis, dan menyesuaikan pembelajaran.

---

## Problem Statement

### Masalah yang Diselesaikan
1. **Siswa tidak tahu kelemahan mereka**: Siswa sering tidak menyadari topik mana yang belum mereka kuasai dengan baik
2. **Pembelajaran one-size-fits-all**: Materi yang sama diberikan ke semua siswa tanpa mempertimbangkan kemampuan individual
3. **Guru kesulitan monitoring**: Guru sulit memantau kebutuhan belajar setiap siswa secara individual di kelas besar
4. **Tidak ada personalisasi**: Platform belajar existing hanya memberikan materi statis tanpa adaptasi

### Target Pengguna
- **Primary**: Siswa SMP/SMA yang ingin meningkatkan pemahaman pada mata pelajaran tertentu
- **Secondary**: Guru yang ingin memantau progres siswa dan mengidentifikasi siswa yang membutuhkan bantuan

---

## MVP Scope & Features

### MVP Focus: Single Subject (Matematika)
Untuk membuktikan konsep, MVP akan fokus pada **1 mata pelajaran** dengan **3-5 topik utama**.

### Core Features (MUST HAVE)

#### 1. Diagnostic Test
**Purpose**: Memetakan kemampuan awal siswa

**Flow**:
- Siswa mengerjakan 10-15 soal pilihan ganda
- Sistem menganalisis jawaban untuk setiap topik
- Output: Skor dan peta kemampuan awal

**Data yang dicatat**:
- Jawaban benar/salah per topik
- Waktu pengerjaan (opsional untuk analisis lanjutan)
- Pola kesalahan

#### 2. Knowledge Map (Peta Kemampuan)
**Purpose**: Visualisasi pemahaman siswa per topik

**Kategori**:
- 🔴 **Not Mastered** (0-40%): Belum dikuasai - prioritas tinggi
- 🟡 **In Progress** (41-70%): Sedang dipelajari - perlu latihan
- 🟢 **Mastered** (71-100%): Sudah dikuasai - maintenance

**Display**:
- Visual progress bar per topik
- Recommended next topic
- Prerequisites yang belum terpenuhi

#### 3. Adaptive Learning Path
**Purpose**: Rekomendasi materi berdasarkan kelemahan

**Logic**:
```
IF topic_mastery < 40% AND prerequisites_met:
    RECOMMEND learning_material + basic_exercises
ELSE IF topic_mastery < 70%:
    RECOMMEND practice_exercises + ai_tutor_support
ELSE IF topic_mastery >= 70%:
    RECOMMEND advanced_challenges (optional)
```

**Features**:
- Urutan pembelajaran berbeda per siswa
- Auto-unlock topik berdasarkan prasyarat
- Adaptive difficulty adjustment

#### 4. AI Tutor (Contextual)
**Purpose**: Menjelaskan konsep dan membahas kesalahan

**Capabilities**:
- Menjawab pertanyaan siswa dengan konteks materi
- Menjelaskan mengapa jawaban salah
- Memberikan hints untuk soal yang sulit
- Penjelasan step-by-step

**Context yang diberikan ke AI**:
- Topik yang sedang dipelajari
- Jawaban siswa (benar/salah)
- Materi pembelajaran yang relevan
- Level kemampuan siswa saat ini

**Constraints**:
- AI hanya dapat menjawab dalam scope materi yang tersedia
- Tidak boleh memberikan jawaban langsung, hanya hints
- Harus mengacu pada kurikulum yang telah ditentukan

#### 5. Progress Dashboard

**Student View**:
- Overall progress percentage
- Topic mastery breakdown
- Recent activities
- Achievements (simple badges)
- Next recommended topic

**Teacher View** (optional untuk MVP):
- Class overview
- Students needing help (sorted by lowest mastery)
- Topic difficulty analysis
- Average progress per topic

### Features untuk Phase 2 (SKIP untuk MVP)
- ❌ Gamifikasi kompleks (XP, leaderboard, rewards)
- ❌ Multiple subjects
- ❌ Video call dengan guru
- ❌ Mobile app (fokus web dulu)
- ❌ Training custom ML model
- ❌ Social features (peer learning, forums)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         React + TypeScript + Vite                    │   │
│  │  - Student Dashboard    - Knowledge Map              │   │
│  │  - Test Interface       - AI Chat Interface          │   │
│  │  - Progress Tracking    - Learning Materials         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Node.js + Express                       │   │
│  │  - Authentication        - Student Management        │   │
│  │  - Test Management       - Progress Tracking         │   │
│  │  - Content Delivery                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    ALGORITHM ENGINE LAYER                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Python + FastAPI                            │  │
│  │  - BKT Algorithm           - Recommendation Engine    │  │
│  │  - Knowledge State Update  - Prerequisite Checker    │  │
│  │  - Difficulty Adjuster                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      AI SERVICE LAYER                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │     AI Tutor Service (OpenAI API / Claude API)        │  │
│  │  - Context Builder         - Response Filter          │  │
│  │  - Explanation Generator   - Hint Provider            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    MySQL Database                      │  │
│  │  - Users & Auth          - Questions & Answers        │  │
│  │  - Topics & Materials    - Student Progress           │  │
│  │  - Knowledge States      - Learning History           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### Frontend (React + TypeScript + Vite)
```
src/
├── components/
│   ├── diagnostic/
│   │   ├── DiagnosticTest.tsx
│   │   └── QuestionCard.tsx
│   ├── knowledge-map/
│   │   ├── KnowledgeMap.tsx
│   │   ├── TopicCard.tsx
│   │   └── ProgressBar.tsx
│   ├── learning/
│   │   ├── LearningMaterial.tsx
│   │   ├── PracticeExercise.tsx
│   │   └── AdaptiveQuiz.tsx
│   ├── ai-tutor/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   └── ExplanationCard.tsx
│   └── dashboard/
│       ├── StudentDashboard.tsx
│       ├── ProgressChart.tsx
│       └── RecommendationPanel.tsx
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── DiagnosticTestPage.tsx
│   ├── LearningPath.tsx
│   └── TopicDetail.tsx
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── test.ts
│   ├── learning.ts
│   └── aiTutor.ts
├── types/
│   ├── user.ts
│   ├── topic.ts
│   ├── question.ts
│   └── progress.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useProgress.ts
│   └── useAdaptiveLearning.ts
└── utils/
    ├── constants.ts
    └── helpers.ts
```

#### Backend (Node.js + Express)
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── testController.js
│   │   ├── learningController.js
│   │   ├── progressController.js
│   │   └── aiTutorController.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── test.routes.js
│   │   ├── learning.routes.js
│   │   ├── progress.routes.js
│   │   └── aiTutor.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Topic.js
│   │   ├── Question.js
│   │   ├── StudentProgress.js
│   │   └── LearningHistory.js
│   ├── services/
│   │   ├── algorithmService.js (calls Python API)
│   │   ├── aiService.js (calls AI API)
│   │   └── contentService.js
│   └── config/
│       ├── database.js
│       └── config.js
```

#### Algorithm Engine (Python + FastAPI)
```
algorithm-engine/
├── app/
│   ├── main.py
│   ├── models/
│   │   ├── bkt_model.py
│   │   ├── recommendation_engine.py
│   │   └── prerequisite_checker.py
│   ├── services/
│   │   ├── knowledge_state_service.py
│   │   ├── adaptive_service.py
│   │   └── difficulty_adjuster.py
│   ├── routes/
│   │   ├── bkt.py
│   │   ├── recommendation.py
│   │   └── evaluation.py
│   └── utils/
│       ├── probability.py
│       └── helpers.py
```

---

## Database Schema

### Entity Relationship Diagram (ERD)

```
┌──────────────────┐         ┌──────────────────┐
│      users       │         │      topics      │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ email            │         │ name             │
│ password_hash    │         │ description      │
│ full_name        │         │ subject          │
│ role             │         │ difficulty_level │
│ created_at       │         │ order_sequence   │
└──────────────────┘         └──────────────────┘
         │                            │
         │                            │
         │                   ┌────────┴────────┐
         │                   │                 │
         │          ┌────────────────┐   ┌─────────────────┐
         │          │ prerequisites  │   │    questions    │
         │          ├────────────────┤   ├─────────────────┤
         │          │ id (PK)        │   │ id (PK)         │
         │          │ topic_id (FK)  │   │ topic_id (FK)   │
         │          │ requires_topic │   │ question_text   │
         │          │    _id (FK)    │   │ question_type   │
         │          └────────────────┘   │ options (JSON)  │
         │                               │ correct_answer  │
         │                               │ explanation     │
         │                               │ difficulty      │
         │                               └─────────────────┘
         │                                        │
         │                                        │
         ├────────────────────────────────────────┤
         │                                        │
┌────────┴───────────┐              ┌────────────┴────────────┐
│ student_progress   │              │   student_answers       │
├────────────────────┤              ├─────────────────────────┤
│ id (PK)            │              │ id (PK)                 │
│ user_id (FK)       │              │ user_id (FK)            │
│ topic_id (FK)      │              │ question_id (FK)        │
│ mastery_level      │              │ student_answer          │
│ p_learned          │              │ is_correct              │
│ p_guess            │              │ time_spent_seconds      │
│ p_slip             │              │ attempt_number          │
│ last_practiced     │              │ answered_at             │
│ updated_at         │              └─────────────────────────┘
└────────────────────┘                          │
         │                                      │
         │              ┌───────────────────────┘
         │              │
┌────────┴──────────────┴─┐
│   learning_materials    │
├─────────────────────────┤
│ id (PK)                 │
│ topic_id (FK)           │
│ title                   │
│ content (TEXT)          │
│ material_type           │
│ order_sequence          │
└─────────────────────────┘
```

### Detailed Table Schemas

#### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);
```

#### Topics Table
```sql
CREATE TABLE topics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL,
    difficulty_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    order_sequence INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_subject (subject)
);
```

#### Prerequisites Table
```sql
CREATE TABLE prerequisites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    requires_topic_id INT NOT NULL,
    min_mastery_required DECIMAL(3,2) DEFAULT 0.70,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    FOREIGN KEY (requires_topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    UNIQUE KEY unique_prerequisite (topic_id, requires_topic_id)
);
```

#### Questions Table
```sql
CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'short_answer') DEFAULT 'multiple_choice',
    options JSON,  -- Array of options for multiple choice
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    INDEX idx_topic_difficulty (topic_id, difficulty)
);
```

#### Student Progress Table (BKT State)
```sql
CREATE TABLE student_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    topic_id INT NOT NULL,
    mastery_level DECIMAL(5,2) DEFAULT 0.00,  -- 0-100%
    p_learned DECIMAL(4,3) DEFAULT 0.000,     -- P(L) - Probability learned
    p_guess DECIMAL(4,3) DEFAULT 0.250,       -- P(G) - Probability of guessing correctly
    p_slip DECIMAL(4,3) DEFAULT 0.100,        -- P(S) - Probability of slip/mistake
    p_transit DECIMAL(4,3) DEFAULT 0.100,     -- P(T) - Probability of learning
    total_attempts INT DEFAULT 0,
    correct_attempts INT DEFAULT 0,
    last_practiced TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_topic (user_id, topic_id),
    INDEX idx_user_mastery (user_id, mastery_level)
);
```

#### Student Answers Table
```sql
CREATE TABLE student_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    student_answer VARCHAR(255),
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INT,
    attempt_number INT DEFAULT 1,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_user_question (user_id, question_id),
    INDEX idx_answered_at (answered_at)
);
```

#### Learning Materials Table
```sql
CREATE TABLE learning_materials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    material_type ENUM('concept', 'example', 'video_link', 'exercise') DEFAULT 'concept',
    order_sequence INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    INDEX idx_topic_order (topic_id, order_sequence)
);
```

#### AI Tutor Conversations (Optional - untuk tracking)
```sql
CREATE TABLE ai_conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    topic_id INT,
    question_id INT,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE SET NULL,
    INDEX idx_user_conversation (user_id, created_at)
);
```

---

## Algorithm Implementation

### Bayesian Knowledge Tracing (BKT)

#### Konsep Dasar
BKT adalah Hidden Markov Model yang melacak probabilitas bahwa siswa telah menguasai suatu skill/topik berdasarkan observasi jawaban mereka.

#### Parameters BKT
- **P(L₀)**: Probabilitas awal bahwa siswa sudah menguasai topik (dari diagnostic test)
- **P(T)**: Probabilitas siswa belajar/menguasai topik dari satu latihan
- **P(G)**: Probabilitas siswa menebak jawaban dengan benar tanpa menguasai
- **P(S)**: Probabilitas siswa membuat kesalahan meskipun sudah menguasai (slip)

#### Update Formula

**Setelah jawaban benar:**
```
P(L|correct) = P(L) * (1 - P(S)) / 
               [P(L) * (1 - P(S)) + (1 - P(L)) * P(G)]
```

**Setelah jawaban salah:**
```
P(L|wrong) = P(L) * P(S) / 
             [P(L) * P(S) + (1 - P(L)) * (1 - P(G))]
```

**Setelah update, hitung probabilitas belajar:**
```
P(L_new) = P(L|answer) + (1 - P(L|answer)) * P(T)
```

#### Implementation (Python)

```python
# algorithm-engine/app/models/bkt_model.py

class BKTModel:
    def __init__(self, p_init=0.0, p_transit=0.1, p_guess=0.25, p_slip=0.1):
        """
        Initialize BKT parameters
        
        Args:
            p_init: Initial probability of mastery P(L0)
            p_transit: Probability of learning P(T)
            p_guess: Probability of guessing correctly P(G)
            p_slip: Probability of slip/mistake P(S)
        """
        self.p_learned = p_init
        self.p_transit = p_transit
        self.p_guess = p_guess
        self.p_slip = p_slip
    
    def update(self, is_correct: bool) -> float:
        """
        Update P(L) based on student answer
        
        Args:
            is_correct: Whether student answered correctly
            
        Returns:
            Updated probability of mastery
        """
        if is_correct:
            # P(L | correct answer)
            numerator = self.p_learned * (1 - self.p_slip)
            denominator = (self.p_learned * (1 - self.p_slip) + 
                          (1 - self.p_learned) * self.p_guess)
        else:
            # P(L | wrong answer)
            numerator = self.p_learned * self.p_slip
            denominator = (self.p_learned * self.p_slip + 
                          (1 - self.p_learned) * (1 - self.p_guess))
        
        # Update P(L) with evidence
        p_learned_given_answer = numerator / denominator if denominator > 0 else 0
        
        # Apply learning transition
        self.p_learned = (p_learned_given_answer + 
                         (1 - p_learned_given_answer) * self.p_transit)
        
        return self.p_learned
    
    def get_mastery_percentage(self) -> float:
        """Convert P(L) to percentage"""
        return self.p_learned * 100
    
    def is_mastered(self, threshold=0.95) -> bool:
        """Check if topic is considered mastered"""
        return self.p_learned >= threshold
```

### Recommendation Engine

#### Logic Flow
```python
# algorithm-engine/app/models/recommendation_engine.py

class RecommendationEngine:
    MASTERY_THRESHOLD = {
        'not_mastered': 0.40,
        'in_progress': 0.70,
        'mastered': 0.95
    }
    
    def get_next_topic(self, user_id: int, available_topics: list) -> dict:
        """
        Determine next recommended topic for student
        
        Returns:
            {
                'topic_id': int,
                'reason': str,
                'mastery_level': float,
                'prerequisites_met': bool
            }
        """
        # Get student progress for all topics
        progress = self._get_student_progress(user_id)
        
        # Filter topics by prerequisites
        eligible_topics = []
        for topic in available_topics:
            if self._check_prerequisites(user_id, topic['id'], progress):
                eligible_topics.append({
                    'topic': topic,
                    'mastery': progress.get(topic['id'], {}).get('p_learned', 0)
                })
        
        if not eligible_topics:
            return None
        
        # Sort by priority:
        # 1. Topics not mastered (lowest mastery first)
        # 2. Topics in progress
        # 3. Topics mastered (for review)
        
        not_mastered = [t for t in eligible_topics 
                       if t['mastery'] < self.MASTERY_THRESHOLD['not_mastered']]
        in_progress = [t for t in eligible_topics 
                      if self.MASTERY_THRESHOLD['not_mastered'] <= t['mastery'] < self.MASTERY_THRESHOLD['in_progress']]
        
        # Prioritize lowest mastery in not_mastered
        if not_mastered:
            not_mastered.sort(key=lambda x: x['mastery'])
            recommended = not_mastered[0]
            reason = "Topik ini perlu diperkuat terlebih dahulu"
        elif in_progress:
            in_progress.sort(key=lambda x: x['mastery'])
            recommended = in_progress[0]
            reason = "Lanjutkan pembelajaran topik ini"
        else:
            # All mastered, suggest review or advanced
            eligible_topics.sort(key=lambda x: x['mastery'])
            recommended = eligible_topics[0]
            reason = "Review topik atau coba tantangan lanjutan"
        
        return {
            'topic_id': recommended['topic']['id'],
            'topic_name': recommended['topic']['name'],
            'reason': reason,
            'mastery_level': recommended['mastery'] * 100,
            'prerequisites_met': True
        }
    
    def _check_prerequisites(self, user_id: int, topic_id: int, progress: dict) -> bool:
        """
        Check if student meets prerequisites for a topic
        """
        prerequisites = self._get_prerequisites(topic_id)
        
        if not prerequisites:
            return True
        
        for prereq in prerequisites:
            prereq_id = prereq['requires_topic_id']
            min_mastery = prereq['min_mastery_required']
            
            student_mastery = progress.get(prereq_id, {}).get('p_learned', 0)
            
            if student_mastery < min_mastery:
                return False
        
        return True
    
    def get_adaptive_questions(self, user_id: int, topic_id: int, count: int = 5) -> list:
        """
        Get adaptive questions based on student performance
        """
        progress = self._get_topic_progress(user_id, topic_id)
        mastery = progress.get('p_learned', 0)
        
        # Determine difficulty based on mastery
        if mastery < 0.3:
            difficulty = 'easy'
        elif mastery < 0.7:
            difficulty = 'medium'
        else:
            difficulty = 'hard'
        
        # Get questions with appropriate difficulty
        questions = self._get_questions_by_difficulty(topic_id, difficulty, count)
        
        return questions
```

---

## API Design

### Base URL
```
Development: http://localhost:3000/api/v1
Production: https://skillpath-ai.com/api/v1
```

### Authentication
All endpoints (except auth endpoints) require JWT token in header:
```
Authorization: Bearer <jwt_token>
```

### API Endpoints

#### Authentication

**POST /auth/register**
```json
Request:
{
  "email": "student@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "role": "student"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "student@example.com",
      "fullName": "John Doe",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**POST /auth/login**
```json
Request:
{
  "email": "student@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "student@example.com",
      "fullName": "John Doe",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Diagnostic Test

**GET /diagnostic/test**
Get diagnostic test questions
```json
Response: 200 OK
{
  "success": true,
  "data": {
    "testId": 1,
    "subject": "Matematika",
    "totalQuestions": 15,
    "questions": [
      {
        "id": 1,
        "topicId": 1,
        "questionText": "Berapakah hasil dari 15 + 23?",
        "type": "multiple_choice",
        "options": ["35", "38", "40", "42"],
        "difficulty": "easy"
      },
      // ... more questions
    ]
  }
}
```

**POST /diagnostic/submit**
Submit diagnostic test answers
```json
Request:
{
  "answers": [
    {
      "questionId": 1,
      "answer": "38",
      "timeSpent": 12
    },
    // ... more answers
  ]
}

Response: 200 OK
{
  "success": true,
  "data": {
    "overallScore": 73.33,
    "topicBreakdown": [
      {
        "topicId": 1,
        "topicName": "Operasi Dasar",
        "mastery": 90.0,
        "status": "mastered"
      },
      {
        "topicId": 2,
        "topicName": "Pecahan",
        "mastery": 45.0,
        "status": "not_mastered"
      },
      {
        "topicId": 3,
        "topicName": "Persamaan Linear",
        "mastery": 20.0,
        "status": "not_mastered"
      }
    ],
    "recommendedTopic": {
      "topicId": 2,
      "topicName": "Pecahan",
      "reason": "Topik ini perlu diperkuat terlebih dahulu"
    }
  }
}
```

#### Learning Path

**GET /learning/progress**
Get student's overall progress
```json
Response: 200 OK
{
  "success": true,
  "data": {
    "userId": 1,
    "overallProgress": 58.33,
    "topics": [
      {
        "topicId": 1,
        "topicName": "Operasi Dasar",
        "masteryLevel": 90.0,
        "status": "mastered",
        "lastPracticed": "2026-10-10T14:30:00Z"
      },
      {
        "topicId": 2,
        "topicName": "Pecahan",
        "masteryLevel": 45.0,
        "status": "in_progress",
        "lastPracticed": "2026-10-11T10:15:00Z"
      },
      {
        "topicId": 3,
        "topicName": "Persamaan Linear",
        "masteryLevel": 20.0,
        "status": "locked",
        "prerequisitesMet": false
      }
    ]
  }
}
```

**GET /learning/recommendation**
Get recommended next topic
```json
Response: 200 OK
{
  "success": true,
  "data": {
    "topicId": 2,
    "topicName": "Pecahan",
    "masteryLevel": 45.0,
    "reason": "Topik ini perlu diperkuat terlebih dahulu",
    "prerequisitesMet": true,
    "estimatedTime": "30 minutes"
  }
}
```

**GET /learning/topic/:topicId**
Get learning materials for a topic
```json
Response: 200 OK
{
  "success": true,
  "data": {
    "topic": {
      "id": 2,
      "name": "Pecahan",
      "description": "Memahami konsep pecahan, operasi pecahan, dan penerapannya",
      "difficultyLevel": "beginner"
    },
    "userMastery": 45.0,
    "materials": [
      {
        "id": 5,
        "title": "Pengenalan Pecahan",
        "type": "concept",
        "content": "Pecahan adalah bilangan yang mewakili bagian dari keseluruhan...",
        "order": 1
      },
      {
        "id": 6,
        "title": "Contoh Soal Pecahan",
        "type": "example",
        "content": "Contoh 1: 1/2 + 1/4 = ?...",
        "order": 2
      }
    ],
    "nextExercise": {
      "available": true,
      "difficulty": "medium"
    }
  }
}
```

#### Adaptive Exercises

**GET /exercises/topic/:topicId**
Get adaptive exercises for a topic
```json
Response: 200 OK
{
  "success": true,
  "data": {
    "topicId": 2,
    "topicName": "Pecahan",
    "difficulty": "medium",
    "questions": [
      {
        "id": 15,
        "questionText": "Hitunglah 2/3 + 1/6",
        "type": "multiple_choice",
        "options": ["1/2", "3/6", "5/6", "4/9"]
      },
      // ... more questions
    ]
  }
}
```

**POST /exercises/submit**
Submit exercise answers and get BKT update
```json
Request:
{
  "topicId": 2,
  "answers": [
    {
      "questionId": 15,
      "answer": "5/6",
      "timeSpent": 25
    },
    // ... more answers
  ]
}

Response: 200 OK
{
  "success": true,
  "data": {
    "results": [
      {
        "questionId": 15,
        "isCorrect": true,
        "correctAnswer": "5/6",
        "explanation": "2/3 dapat diubah menjadi 4/6, sehingga 4/6 + 1/6 = 5/6"
      }
    ],
    "updatedMastery": {
      "topicId": 2,
      "previousMastery": 45.0,
      "currentMastery": 52.3,
      "improvement": 7.3,
      "status": "in_progress"
    },
    "recommendation": {
      "continue": true,
      "message": "Bagus! Lanjutkan latihan untuk meningkatkan pemahaman"
    }
  }
}
```

#### AI Tutor

**POST /ai-tutor/ask**
Ask AI tutor a question
```json
Request:
{
  "topicId": 2,
  "questionId": 15,
  "studentQuestion": "Mengapa 2/3 harus diubah menjadi 4/6?",
  "context": {
    "studentAnswer": "1/2",
    "correctAnswer": "5/6",
    "wasCorrect": false
  }
}

Response: 200 OK
{
  "success": true,
  "data": {
    "response": "Kita mengubah 2/3 menjadi 4/6 agar penyebutnya sama dengan pecahan 1/6. Ketika penyebut sama, kita bisa menjumlahkan pembilangnya dengan mudah. Ini disebut menyamakan penyebut. Coba pikirkan: 2/3 = (2×2)/(3×2) = 4/6. Sekarang kamu bisa menjumlahkan 4/6 + 1/6 = 5/6.",
    "hints": [
      "Penyebut harus sama sebelum menjumlahkan pecahan",
      "Kalikan pembilang dan penyebut dengan angka yang sama"
    ],
    "relatedMaterial": {
      "materialId": 7,
      "title": "Operasi Penjumlahan Pecahan"
    }
  }
}
```

**POST /ai-tutor/explain**
Get explanation for a concept
```json
Request:
{
  "topicId": 2,
  "concept": "penyamaan penyebut"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "explanation": "Penyamaan penyebut adalah proses mengubah pecahan-pecahan yang berbeda penyebutnya menjadi pecahan dengan penyebut yang sama. Ini penting karena kita hanya bisa menjumlahkan atau mengurangkan pecahan jika penyebutnya sama.",
    "examples": [
      "1/2 + 1/4 → 2/4 + 1/4 = 3/4",
      "2/3 + 1/6 → 4/6 + 1/6 = 5/6"
    ],
    "visualAid": null
  }
}
```

#### Dashboard (Teacher View - Optional for MVP)

**GET /teacher/class-overview**
```json
Response: 200 OK
{
  "success": true,
  "data": {
    "totalStudents": 25,
    "averageProgress": 62.5,
    "studentsNeedingHelp": [
      {
        "studentId": 5,
        "studentName": "Alice Johnson",
        "overallProgress": 35.0,
        "weakTopics": ["Pecahan", "Persamaan Linear"]
      }
    ],
    "topicDifficulty": [
      {
        "topicId": 2,
        "topicName": "Pecahan",
        "averageMastery": 48.5,
        "studentsStruggling": 12
      }
    ]
  }
}
```

---

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand or Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Charts**: Recharts or Chart.js
- **Forms**: React Hook Form + Zod validation

### Backend (Node.js)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database ORM**: Sequelize or Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Joi or Zod
- **CORS**: cors middleware
- **Environment**: dotenv

### Algorithm Engine (Python)
- **Framework**: FastAPI
- **HTTP Client**: httpx (for API calls)
- **Math/Stats**: NumPy, SciPy
- **Data Validation**: Pydantic
- **ASGI Server**: Uvicorn

### Database
- **Primary DB**: MySQL 8.0+
- **Connection Pool**: mysql2 (Node.js)

### AI Service
- **Provider Options**:
  - OpenAI API (GPT-4 or GPT-3.5-turbo)
  - Anthropic Claude API
  - Local LLM (optional for cost reduction)

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm (frontend/backend), pip (Python)
- **API Testing**: Postman or Thunder Client
- **Code Quality**: ESLint, Prettier
- **Database Client**: MySQL Workbench or DBeaver

### Deployment (Production - Optional)
- **Frontend Hosting**: Vercel or Netlify
- **Backend Hosting**: Railway, Render, or AWS EC2
- **Database**: PlanetScale, Railway, or AWS RDS
- **Python Service**: Railway or AWS Lambda

---

## User Stories

### Student User Stories

#### Epic 1: Onboarding & Assessment
- **US-1.1**: As a student, I want to register with my email so I can create an account
- **US-1.2**: As a student, I want to take a diagnostic test so the system can understand my current level
- **US-1.3**: As a student, I want to see my diagnostic test results with a breakdown per topic so I know my strengths and weaknesses

#### Epic 2: Personalized Learning
- **US-2.1**: As a student, I want to see a knowledge map showing my mastery level for each topic
- **US-2.2**: As a student, I want to receive recommendations on which topic to study next based on my weaknesses
- **US-2.3**: As a student, I want topics with unmet prerequisites to be locked so I learn in the correct order
- **US-2.4**: As a student, I want to access learning materials for recommended topics so I can study the concepts

#### Epic 3: Adaptive Practice
- **US-3.1**: As a student, I want to get practice questions that match my current skill level
- **US-3.2**: As a student, I want the difficulty to adjust based on my answers so I'm appropriately challenged
- **US-3.3**: As a student, I want to see immediate feedback on my answers with explanations
- **US-3.4**: As a student, I want to see my mastery level update after each practice session

#### Epic 4: AI Tutor Support
- **US-4.1**: As a student, I want to ask the AI tutor questions about concepts I don't understand
- **US-4.2**: As a student, I want the AI to explain why my answer was wrong when I make a mistake
- **US-4.3**: As a student, I want to receive hints instead of direct answers so I can learn to solve problems myself
- **US-4.4**: As a student, I want the AI tutor to use the learning materials as context so explanations are consistent

#### Epic 5: Progress Tracking
- **US-5.1**: As a student, I want to see my overall progress percentage on my dashboard
- **US-5.2**: As a student, I want to view my learning history and see which topics I've practiced
- **US-5.3**: As a student, I want to see a visual representation of my improvement over time

### Teacher User Stories (Phase 2)

#### Epic 6: Class Monitoring
- **US-6.1**: As a teacher, I want to see an overview of all my students' progress
- **US-6.2**: As a teacher, I want to identify students who are struggling with specific topics
- **US-6.3**: As a teacher, I want to see which topics are most challenging for the class
- **US-6.4**: As a teacher, I want to view individual student progress details

---

## UI/UX Design & User Flow

### Design Principles
1. **Clarity First**: Learning interface harus clean dan tidak overwhelming
2. **Immediate Feedback**: Setiap action harus memberikan feedback langsung
3. **Progress Visibility**: Siswa harus selalu tahu posisi mereka dalam learning journey
4. **Motivational**: Design harus encouraging, bukan intimidating
5. **Mobile-Friendly**: Responsive design (MVP fokus web, tapi siap untuk mobile)

### Color Scheme
```
Primary Colors:
- Main: #3B82F6 (Blue) - Trust, learning, professionalism
- Success: #10B981 (Green) - Mastered, correct answers
- Warning: #F59E0B (Orange) - In progress
- Danger: #EF4444 (Red) - Not mastered, incorrect answers

Neutral Colors:
- Background: #F9FAFB
- Card: #FFFFFF
- Text Primary: #111827
- Text Secondary: #6B7280
- Border: #E5E7EB

Status Colors:
- Mastered: #10B981 (Green)
- In Progress: #F59E0B (Orange)
- Not Mastered: #EF4444 (Red)
- Locked: #9CA3AF (Gray)
```

### Key Pages & User Flow

#### 1. Landing Page
```
┌─────────────────────────────────────────┐
│  [Logo] SkillPath AI           [Login] │
├─────────────────────────────────────────┤
│                                         │
│     Belajar Adaptif dengan AI          │
│     Sesuaikan pembelajaran dengan       │
│     kemampuan Anda                      │
│                                         │
│     [Mulai Sekarang - Gratis]          │
│                                         │
│  ✓ Tes Diagnostik                      │
│  ✓ Pembelajaran Adaptif                │
│  ✓ AI Tutor 24/7                       │
│  ✓ Tracking Progress Real-time         │
│                                         │
└─────────────────────────────────────────┘
```

#### 2. Registration/Login Flow
```
Register → Email Verification (optional) → Diagnostic Test Intro
                                                 ↓
                                          Diagnostic Test
                                                 ↓
                                          Results & Knowledge Map
                                                 ↓
                                          Dashboard
```

#### 3. Diagnostic Test Page
```
┌─────────────────────────────────────────────────┐
│  ← Tes Diagnostik Matematika                    │
│  Progress: ████████░░░░░░░░ 8/15               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Soal 8                                         │
│                                                 │
│  Berapakah hasil dari 2/3 + 1/6?              │
│                                                 │
│  ○ A. 1/2                                      │
│  ○ B. 3/6                                      │
│  ○ C. 5/6                                      │
│  ○ D. 4/9                                      │
│                                                 │
│                                                 │
│            [Lewati]    [Lanjut →]              │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 4. Diagnostic Test Results
```
┌─────────────────────────────────────────────────┐
│  Hasil Tes Diagnostik                           │
├─────────────────────────────────────────────────┤
│                                                 │
│  Skor Keseluruhan: 73/100                      │
│                                                 │
│  Peta Kemampuan:                               │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │ Operasi Dasar              90% 🟢   │       │
│  │ ████████████████████        │       │
│  │ Sudah dikuasai              │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │ Pecahan                    45% 🟡   │       │
│  │ █████████░░░░░░░░░░░        │       │
│  │ Perlu diperkuat              │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │ Persamaan Linear           20% 🔴   │       │
│  │ ████░░░░░░░░░░░░░░░░        │       │
│  │ Belum dikuasai              │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  Rekomendasi: Mulai dari Pecahan               │
│                                                 │
│            [Mulai Belajar →]                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 5. Student Dashboard
```
┌─────────────────────────────────────────────────────────┐
│  ☰ SkillPath AI            [John Doe ▼]  [🔔]          │
├─────────────────────────────────────────────────────────┤
│  Dashboard  │  Belajar  │  Latihan  │  Progress         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Progress Keseluruhan                                  │
│  ████████████░░░░░░░░░░░░░░ 58%                       │
│                                                         │
│  ┌──────────────────────────┐ ┌───────────────────┐  │
│  │ Rekomendasi Berikutnya   │ │ Statistik Minggu  │  │
│  │                          │ │ Ini                │  │
│  │ 📚 Pecahan               │ │                    │  │
│  │                          │ │ 3 Topik dipelajari │  │
│  │ Tingkatkan pemahaman     │ │ 45 Soal dijawab   │  │
│  │ pada topik ini           │ │ 12 Jam belajar    │  │
│  │                          │ │                    │  │
│  │ Mastery: 45% 🟡          │ │ [Lihat Detail]    │  │
│  │                          │ │                    │  │
│  │ [Mulai Belajar →]        │ │                    │  │
│  └──────────────────────────┘ └───────────────────┘  │
│                                                         │
│  Topik Pembelajaran                                    │
│                                                         │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────┐│
│  │ Operasi Dasar  │ │ Pecahan        │ │ Persamaan  ││
│  │                │ │                │ │ Linear     ││
│  │ 90% 🟢         │ │ 45% 🟡         │ │ 🔒 Locked  ││
│  │                │ │                │ │            ││
│  │ [Review]       │ │ [Lanjutkan →]  │ │ Selesaikan ││
│  │                │ │                │ │ prasyarat  ││
│  └────────────────┘ └────────────────┘ └────────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 6. Learning Material Page
```
┌─────────────────────────────────────────────────────────┐
│  ← Kembali                                  [AI Tutor] │
├─────────────────────────────────────────────────────────┤
│  Pecahan                                    Mastery: 45%│
│  ████████░░░░░░░░░░░░                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📖 Pengenalan Pecahan                                 │
│                                                         │
│  Pecahan adalah bilangan yang mewakili bagian dari     │
│  keseluruhan. Pecahan ditulis dalam bentuk a/b,        │
│  dimana:                                               │
│                                                         │
│  • a = pembilang (jumlah bagian yang diambil)         │
│  • b = penyebut (total bagian keseluruhan)            │
│                                                         │
│  Contoh:                                               │
│  1/2 artinya 1 bagian dari 2 bagian total             │
│                                                         │
│  [Ilustrasi visual pecahan]                            │
│                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                         │
│  📝 Contoh Soal                                        │
│                                                         │
│  Ibu memotong kue menjadi 8 bagian. Adik makan 3       │
│  bagian. Berapa bagian yang dimakan adik dalam         │
│  bentuk pecahan?                                       │
│                                                         │
│  Jawab: 3/8                                            │
│                                                         │
│                                                         │
│           [Materi Sebelumnya]  [Mulai Latihan →]      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 7. Adaptive Exercise Page
```
┌─────────────────────────────────────────────────────────┐
│  ← Latihan: Pecahan                    [AI Tutor 💬]   │
│  Progress: ███░░░░░ 3/10                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Soal 3                                  Difficulty: ⭐⭐│
│                                                         │
│  Hitunglah hasil dari:                                 │
│                                                         │
│           2/3 + 1/6 = ?                                │
│                                                         │
│  Pilih jawaban:                                        │
│                                                         │
│  ┌─────────┐ ┌─────────┐                             │
│  │   1/2   │ │   3/6   │                             │
│  └─────────┘ └─────────┘                             │
│                                                         │
│  ┌─────────┐ ┌─────────┐                             │
│  │   5/6   │ │   4/9   │                             │
│  └─────────┘ └─────────┘                             │
│                                                         │
│                                                         │
│  💡 Butuh bantuan? [Minta Hint]                        │
│                                                         │
│                                                         │
│            [Lewati]         [Cek Jawaban]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 8. Answer Feedback
```
┌─────────────────────────────────────────────────────────┐
│  ✓ Jawaban Benar!                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Jawaban kamu: 5/6 ✓                                   │
│                                                         │
│  Pembahasan:                                           │
│  Untuk menjumlahkan pecahan dengan penyebut berbeda,   │
│  kita perlu menyamakan penyebutnya terlebih dahulu:    │
│                                                         │
│  2/3 = 4/6  (kalikan pembilang dan penyebut dengan 2)  │
│                                                         │
│  Kemudian:                                             │
│  4/6 + 1/6 = 5/6                                       │
│                                                         │
│  ┌─────────────────────────────────────────────┐      │
│  │ Kemajuan Topik Pecahan                       │      │
│  │ 45% → 52% (+7%)  🎉                          │      │
│  │ ███████████░░░░░░░░░░                        │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│               [Lanjut ke Soal Berikutnya →]            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 9. AI Tutor Chat Interface
```
┌─────────────────────────────────────────────────────────┐
│  AI Tutor - Pecahan                           [✕ Close] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🤖 AI: Halo! Saya siap membantu kamu memahami         │
│      konsep Pecahan. Ada yang ingin kamu tanyakan?    │
│                                                         │
│  👤 Kamu: Mengapa 2/3 harus diubah menjadi 4/6?       │
│                                                         │
│  🤖 AI: Pertanyaan bagus! Kita mengubah 2/3 menjadi   │
│      4/6 agar penyebutnya sama dengan 1/6. Ketika     │
│      penyebut sama, kita bisa menjumlahkan            │
│      pembilangnya dengan mudah.                       │
│                                                         │
│      Bayangkan kamu punya pizza:                      │
│      • Pizza A dipotong jadi 3 bagian                 │
│      • Pizza B dipotong jadi 6 bagian                 │
│                                                         │
│      Kita tidak bisa langsung menjumlahkan bagian     │
│      yang berbeda ukuran, jadi kita ubah dulu Pizza   │
│      A menjadi potongan yang sama dengan Pizza B.     │
│                                                         │
│      2/3 = (2×2)/(3×2) = 4/6                         │
│                                                         │
│      Apakah sudah lebih jelas?                        │
│                                                         │
│  👤 Kamu: Ya, terima kasih!                           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Ketik pertanyaan...                          [Kirim] │
└─────────────────────────────────────────────────────────┘
```

#### 10. Progress/Analytics Page
```
┌─────────────────────────────────────────────────────────┐
│  ☰ SkillPath AI - Progress                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Progress Belajar Saya                                 │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │ Progress Chart                             │        │
│  │                                            │        │
│  │ 100% ┤                              ╱─    │        │
│  │  80% ┤                         ╱────      │        │
│  │  60% ┤                    ╱────           │        │
│  │  40% ┤              ╱─────                │        │
│  │  20% ┤         ╱────                      │        │
│  │   0% └────────────────────────────────    │        │
│  │      Week1 Week2 Week3 Week4             │        │
│  └───────────────────────────────────────────┘        │
│                                                         │
│  Breakdown per Topik                                   │
│                                                         │
│  ┌─────────────────────────────────────────────┐      │
│  │ Operasi Dasar              90% ████████████ │      │
│  │ Status: Mastered 🟢                         │      │
│  │ Latihan: 50 soal | Benar: 45 (90%)         │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│  ┌─────────────────────────────────────────────┐      │
│  │ Pecahan                    52% ██████░░░░░░ │      │
│  │ Status: In Progress 🟡                      │      │
│  │ Latihan: 30 soal | Benar: 18 (60%)         │      │
│  │ [Lanjutkan Belajar →]                       │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│  ┌─────────────────────────────────────────────┐      │
│  │ Persamaan Linear           20% ███░░░░░░░░░ │      │
│  │ Status: Not Started 🔒                      │      │
│  │ Selesaikan prasyarat: Pecahan (min 70%)    │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Navigation Flow Diagram
```
         [Landing Page]
                ↓
         [Register/Login]
                ↓
    [Diagnostic Test Intro]
                ↓
       [Diagnostic Test]
                ↓
      [Test Results + Knowledge Map]
                ↓
    ┌──── [Student Dashboard] ────┐
    │             ↓                │
    │    [Learning Material]       │
    │             ↓                │
    │    [Adaptive Exercise]       │
    │             ↓                │
    │    [Answer Feedback]         │
    │             ↓                │
    │    [Updated Knowledge Map]   │
    │             ↓                │
    └─────→ [AI Tutor] ←──────────┘
                ↓
         [Progress Page]
```

---

## Implementation Roadmap

### 4-Week MVP Development Plan

#### Week 1: Foundation & Setup (Days 1-7)

**Backend Setup (Days 1-3)**
- [ ] Initialize project structure (Node.js + Express)
- [ ] Setup MySQL database and create initial tables
- [ ] Implement user authentication (register, login with JWT)
- [ ] Create database seeders for:
  - 3 topics (Operasi Dasar, Pecahan, Persamaan Linear)
  - Prerequisites relationships
  - 15 diagnostic test questions
  - 30-40 practice questions per topic
  - Learning materials per topic

**Frontend Setup (Days 1-3)**
- [ ] Setup React + TypeScript + Vite project
- [ ] Configure Tailwind CSS and install UI components
- [ ] Setup routing (React Router)
- [ ] Create authentication pages (Login, Register)
- [ ] Setup API service layer with Axios
- [ ] Implement protected routes

**Python Algorithm Engine Setup (Days 4-5)**
- [ ] Initialize FastAPI project
- [ ] Implement BKT model class
- [ ] Create basic API endpoints for BKT calculations
- [ ] Test BKT algorithm with sample data

**Integration (Days 6-7)**
- [ ] Connect frontend to backend API
- [ ] Connect backend to Python algorithm engine
- [ ] Test authentication flow end-to-end
- [ ] Setup environment variables and configs

**Deliverable**: Working authentication system + project structure

---

#### Week 2: Core Algorithm & Diagnostic Test (Days 8-14)

**Algorithm Development (Days 8-10)**
- [ ] Implement full BKT update logic
- [ ] Create recommendation engine
- [ ] Implement prerequisite checker
- [ ] Create API endpoints:
  - POST /api/algorithm/bkt/update
  - POST /api/algorithm/recommend
  - GET /api/algorithm/prerequisites/:topicId

**Diagnostic Test (Days 8-11)**
- [ ] Backend: Test management API
  - GET /api/diagnostic/test
  - POST /api/diagnostic/submit
- [ ] Frontend: Diagnostic test interface
  - Question card component
  - Progress indicator
  - Answer submission
- [ ] Backend: Process diagnostic test results
  - Calculate initial mastery per topic using BKT
  - Store in student_progress table
- [ ] Frontend: Results page
  - Display overall score
  - Show topic breakdown with mastery %
  - Visualize knowledge map
  - Show recommendation

**Knowledge Map Component (Days 12-13)**
- [ ] Create TopicCard component with mastery visualization
- [ ] Implement color-coded status (red/yellow/green)
- [ ] Show locked topics with prerequisites
- [ ] Display recommended next topic

**Testing & Bug Fixes (Day 14)**
- [ ] Test diagnostic flow end-to-end
- [ ] Verify BKT calculations are correct
- [ ] Test with multiple student scenarios
- [ ] Fix any critical bugs

**Deliverable**: Working diagnostic test with BKT-based knowledge map

---

#### Week 3: Adaptive Learning & AI Tutor (Days 15-21)

**Learning Materials (Days 15-16)**
- [ ] Backend: Learning content API
  - GET /api/learning/topic/:topicId
  - GET /api/learning/progress
  - GET /api/learning/recommendation
- [ ] Frontend: Learning material page
  - Display content based on topic
  - Show current mastery
  - Navigation between materials

**Adaptive Exercise System (Days 17-19)**
- [ ] Backend: Exercise API
  - GET /api/exercises/topic/:topicId (adaptive questions)
  - POST /api/exercises/submit
- [ ] Implement adaptive difficulty selection based on mastery
- [ ] Frontend: Exercise interface
  - Question display with options
  - Timer (optional)
  - Hint button
- [ ] Frontend: Answer feedback
  - Show correct/wrong with explanation
  - Display mastery improvement
  - Celebrate success

**BKT Update Flow (Days 18-19)**
- [ ] After each answer, call algorithm engine to update P(L)
- [ ] Update student_progress table
- [ ] Recalculate mastery percentage
- [ ] Update recommendation if needed

**AI Tutor Integration (Days 20-21)**
- [ ] Setup AI API integration (OpenAI or Claude)
- [ ] Backend: AI Tutor service
  - Build context from topic + student state + question
  - Filter responses to stay in scope
- [ ] Backend: AI Tutor API endpoints
  - POST /api/ai-tutor/ask
  - POST /api/ai-tutor/explain
- [ ] Frontend: Chat interface
  - Message bubbles
  - Context-aware conversations
  - Quick actions (explain, hint)

**Deliverable**: Full adaptive learning flow with AI tutor

---

#### Week 4: Dashboard, Polish & Testing (Days 22-28)

**Student Dashboard (Days 22-23)**
- [ ] Overall progress summary
- [ ] Recommended next topic card
- [ ] Quick stats (topics studied, questions answered)
- [ ] Topic grid with status indicators
- [ ] Recent activities

**Progress Tracking Page (Day 24)**
- [ ] Progress chart (mastery over time)
- [ ] Detailed breakdown per topic
- [ ] Learning history
- [ ] Achievements/milestones (optional simple badges)

**Polish & UX Improvements (Days 25-26)**
- [ ] Improve loading states
- [ ] Add animations and transitions
- [ ] Improve error handling and user feedback
- [ ] Mobile responsive adjustments
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

**Testing & Bug Fixes (Day 27)**
- [ ] End-to-end user flow testing
- [ ] Test edge cases:
  - All topics mastered
  - All topics locked
  - Wrong API responses
- [ ] Performance testing
- [ ] Fix bugs

**Demo Preparation (Day 28)**
- [ ] Prepare demo script
- [ ] Create sample student accounts with different progress levels
- [ ] Prepare presentation materials
- [ ] Record demo video (optional)
- [ ] Write README and documentation

**Deliverable**: Production-ready MVP with demo

---

### Priority Matrix

| Feature                  | Priority | Complexity | Impact |
|-------------------------|----------|------------|--------|
| BKT Algorithm           | P0       | High       | High   |
| Diagnostic Test         | P0       | Medium     | High   |
| Knowledge Map           | P0       | Medium     | High   |
| Adaptive Exercises      | P0       | High       | High   |
| Learning Materials      | P0       | Low        | High   |
| AI Tutor                | P1       | Medium     | High   |
| Progress Dashboard      | P1       | Medium     | Medium |
| Recommendation Engine   | P0       | Medium     | High   |
| Prerequisite System     | P1       | Medium     | Medium |
| Teacher Dashboard       | P2       | Medium     | Low    |
| Gamification            | P3       | Medium     | Low    |

**Legend:**
- P0: Must have for MVP
- P1: Should have for good demo
- P2: Nice to have
- P3: Future feature

---

## Testing Strategy

### Unit Testing

**Backend (Node.js)**
- Use Jest or Mocha
- Test controllers, services, and models
- Mock database calls
- Test authentication middleware

**Python Algorithm Engine**
- Use pytest
- Test BKT model calculations
- Test recommendation logic
- Test edge cases (P(L) = 0, P(L) = 1, etc.)

**Frontend**
- Use Vitest (comes with Vite)
- Test utility functions
- Test custom hooks
- Test critical components (optional for hackathon)

### Integration Testing
- Test API endpoints with real database (test DB)
- Test algorithm engine responses
- Test AI API integration (with mocked responses)

### End-to-End Testing
- Manual testing of complete user flows:
  1. Register → Diagnostic Test → Dashboard
  2. Learning Material → Exercise → Feedback → Progress Update
  3. AI Tutor conversation flow
  4. Knowledge map updates
- Test with different user scenarios:
  - High-performing student
  - Struggling student
  - Student with mixed performance

### Performance Testing
- Load test with multiple concurrent users (optional)
- Database query optimization
- API response time monitoring

---

## Success Metrics

### Demo Day Metrics

**What to Measure:**
1. **Algorithm Accuracy**
   - Does recommendation match weakest topic?
   - Does mastery increase after correct answers?
   - Are prerequisites enforced correctly?

2. **Personalization Evidence**
   - Show 2-3 students with different paths
   - Demonstrate different recommendations based on performance
   - Show adaptive difficulty adjustment

3. **AI Tutor Quality**
   - Context-aware responses
   - Helpful explanations
   - Stays within curriculum scope

4. **User Experience**
   - Smooth flow from start to finish
   - Clear visualizations
   - Immediate feedback

**Demo Script Example:**
```
1. Student A starts diagnostic test
   → Shows weak in Pecahan (45%)
   → Recommendation: Start with Pecahan
   
2. Student A studies Pecahan materials
   → Attempts exercises
   → Gets medium difficulty questions
   
3. Student A answers correctly
   → Mastery increases to 52%
   → Gets slightly harder questions
   
4. Student A makes mistake
   → AI Tutor explains the concept
   → Provides hints
   → Mastery update reflects understanding
   
5. After multiple sessions
   → Pecahan reaches 75% (mastered)
   → Persamaan Linear unlocks
   → New recommendation appears
```

### Post-MVP Metrics (if deployed)
- User retention rate
- Average time to master a topic
- Correlation between initial diagnostic and improvement
- AI Tutor engagement rate
- Questions per session

---

## Risk Assessment & Mitigation

### Technical Risks

#### Risk 1: BKT Algorithm Complexity
**Probability**: Medium  
**Impact**: High  
**Mitigation**:
- Start with simplified BKT implementation
- Use fixed parameters initially (tune later with data)
- Have fallback to simpler scoring system
- Test thoroughly with sample data before integration

#### Risk 2: AI API Costs
**Probability**: Medium  
**Impact**: Medium  
**Mitigation**:
- Set rate limits per user
- Cache common explanations
- Use cheaper model (GPT-3.5) for MVP
- Implement token usage monitoring
- Consider local LLM alternatives

#### Risk 3: Content Creation Bottleneck
**Probability**: High  
**Impact**: Medium  
**Mitigation**:
- Focus on 3-5 topics only for MVP
- Use AI to help generate questions and materials
- Reuse existing educational content (with proper attribution)
- Prioritize quality over quantity

#### Risk 4: Integration Complexity (3 services)
**Probability**: Medium  
**Impact**: High  
**Mitigation**:
- Use Docker for local development
- Clear API contracts between services
- Implement proper error handling
- Have fallback mechanisms (e.g., if Python service down, use simple calculation)

### Project Management Risks

#### Risk 5: Time Constraint (4 weeks)
**Probability**: High  
**Impact**: High  
**Mitigation**:
- Strict scope management (no feature creep)
- Focus on core P0 features
- Skip nice-to-haves if behind schedule
- Have a "minimum demo" version ready by Week 3

#### Risk 6: Team Availability
**Probability**: Medium  
**Impact**: Medium  
**Mitigation**:
- Clear task assignments from Day 1
- Daily standups (async if needed)
- Parallel work streams (frontend/backend/algorithm)
- Document everything for handoffs

---

## Future Enhancements (Post-MVP)

### Phase 2 Features
- Multiple subjects (Fisika, Kimia, Bahasa Inggris)
- Teacher dashboard with class analytics
- Parent portal for monitoring
- Mobile app (React Native)
- Offline mode

### Phase 3 Features
- Spaced repetition algorithm
- Peer learning features
- Live tutoring sessions
- Video explanations
- Advanced gamification (XP, levels, badges)

### Phase 4 Features
- Custom curriculum builder for teachers
- School/institution accounts
- Advanced analytics and insights
- Integration with Learning Management Systems (LMS)
- API for third-party integrations

---

## Appendix

### A. Sample Topic Structure (Matematika SMP)

**Subject**: Matematika SMP  
**Total Topics**: 3 (for MVP)

#### Topic 1: Operasi Dasar
- **Description**: Penjumlahan, pengurangan, perkalian, pembagian bilangan bulat
- **Difficulty**: Beginner
- **Prerequisites**: None
- **Questions**: 15 diagnostic + 40 practice
- **Materials**: 5 concept pages, 3 example sets

#### Topic 2: Pecahan
- **Description**: Pengertian pecahan, operasi pecahan, pecahan desimal
- **Difficulty**: Beginner to Intermediate
- **Prerequisites**: Operasi Dasar (min 70% mastery)
- **Questions**: 15 diagnostic + 40 practice
- **Materials**: 6 concept pages, 4 example sets

#### Topic 3: Persamaan Linear
- **Description**: Persamaan linear satu variabel dan aplikasinya
- **Difficulty**: Intermediate
- **Prerequisites**: Operasi Dasar (70%), Pecahan (70%)
- **Questions**: 15 diagnostic + 40 practice
- **Materials**: 7 concept pages, 5 example sets

### B. Sample BKT Parameters (Initial Estimates)

| Parameter | Easy Topic | Medium Topic | Hard Topic |
|-----------|-----------|--------------|------------|
| P(L₀)     | 0.10      | 0.05         | 0.02       |
| P(T)      | 0.15      | 0.10         | 0.08       |
| P(G)      | 0.25      | 0.25         | 0.20       |
| P(S)      | 0.10      | 0.15         | 0.20       |

*Note: These will be refined with real student data*

### C. Environment Variables Template

```bash
# Backend (.env)
NODE_ENV=development
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/skillpath_ai
JWT_SECRET=your-secret-key-here-min-32-chars
JWT_EXPIRES_IN=7d

ALGORITHM_ENGINE_URL=http://localhost:8000
AI_API_KEY=your-openai-api-key
AI_MODEL=gpt-3.5-turbo

CORS_ORIGIN=http://localhost:5173

# Python Algorithm Engine (.env)
PORT=8000
LOG_LEVEL=info

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### D. Tech Stack Version Requirements

```json
{
  "frontend": {
    "node": ">=18.0.0",
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0"
  },
  "backend": {
    "node": ">=18.0.0",
    "express": "^4.18.0",
    "mysql2": "^3.6.0",
    "sequelize": "^6.35.0",
    "jsonwebtoken": "^9.0.0"
  },
  "algorithm": {
    "python": ">=3.9",
    "fastapi": "^0.104.0",
    "uvicorn": "^0.24.0",
    "numpy": "^1.26.0"
  }
}
```

---

## Kesimpulan

**SkillPath AI** adalah aplikasi pembelajaran adaptif yang berfokus pada personalisasi pembelajaran menggunakan algoritma Bayesian Knowledge Tracing dan AI Tutor. MVP akan dibangun dalam 4 minggu dengan fokus pada 1 mata pelajaran (Matematika) dan 3-5 topik utama.

**Keunggulan utama**:
1. ✅ Pembelajaran benar-benar adaptif (bukan sekadar chatbot)
2. ✅ Pengukuran kemampuan yang akurat dengan BKT
3. ✅ Rekomendasi personalized berdasarkan kelemahan siswa
4. ✅ AI Tutor yang context-aware
5. ✅ Real-time progress tracking

**Nilai jual untuk demo**:
> "Dua siswa dengan kemampuan berbeda akan mendapatkan pembelajaran yang berbeda - sistem tidak hanya menjawab pertanyaan, tetapi secara aktif mengukur, menganalisis, dan menyesuaikan pembelajaran untuk setiap individu."

---

**Document Version**: 1.0  
**Last Updated**: 2026-10-11  
**Status**: Ready for Implementation

