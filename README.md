# Learn with Jiji - AI Learning Companion Backend

Backend service powering Jiji's search & respond flow for VeidaLabs.

## 🚀 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

---

## 📋 Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account

---

## ⚙️ Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/chandan-chaudhary/vedialabs-jiji.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Server Configuration
PORT=3000
```

**Get these values from:**
- Supabase Dashboard → Project Settings → API

### 4. Database Setup
1. Go to **SQL Editor** in Supabase Dashboard
2. Run sql to create tables and RLS policies

### 5. Storage Setup

1. Go to **Storage** in Supabase Dashboard
2. Create bucket: `vedialabs-resources` (Public)
3. Upload sample files:
   - `bitcoin-introduction.pptx`
   - `bitcoin-video.mp4`

### 6. Enable Authentication

1. Go to **Authentication → Providers**
2. Enable **Email** provider
3. Disable **Confirm email** (for testing)

---

## 🏃 How to Run

### Development Mode

```bash
npm run dev
```

Server runs on: `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

---

### **Authentication Endpoints**

#### 1. Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt-token",
  }
}
```

---

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt-token",
  }
}
```

---

### **Main API Endpoint**

#### 3. Ask Jiji (Protected)
```http
POST /api/ask-jiji
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "question": "Explain Bitcoin"
}
```

**Response:**
```json
{
  "answer": "Based on your question about .......",
  "resources": [
    {
      "id": "uuid-1",
      "title": "Introduction to Bitcoin",
      "description": "Comprehensive guide to Bitcoin",
      "type": "PPT",
      "file_url": "https://project.supabase.co/storage/v1/object/public/vedialabs-resources/bitcoin-introduction.pptx",
      "tags": ["Bitcoin", "AI", "LLM"],
      "created_at": "2025-02-09T10:00:00Z"
    },
    {
      "id": "uuid-2",
      "title": "Bitcoin Demo Video",
      "description": "Video walkthrough of Bitcoin architecture",
      "type": "VIDEO",
      "file_url": "https://project.supabase.co/storage/v1/object/public/vedialabs-resources/bitcoin-demo.mp4",
      "tags": ["Bitcoin", "Tutorial"],
      "created_at": "2025-02-09T10:00:00Z"
    }
  ]
}
```

---

## 🔐 How Authentication & RLS Work

### **Authentication Flow**

1. **User Signup:**
   - User submits email + password
   - Supabase Auth creates user in `auth.users` table
   - Backend creates corresponding profile in `profiles` table
   - Returns JWT access token

2. **User Login:**
   - User submits credentials
   - Supabase Auth validates and returns JWT
   - JWT contains user ID and expiry

3. **Protected Routes:**
   - Client sends JWT in `Authorization: Bearer <token>` header
   - Middleware validates token using `supabase.auth.getUser(token)`
   - Extracts `userId` and attaches to request
   - Proceeds to route handler

---

### **Row Level Security (RLS)**

Row level security (RLS) provides extra security to the each row in the table. It ensures that users can only access data they are authorized to see, even if there are bugs in the application code. By implementing this policy, it also secure data from attackers.

#### **Profiles Table**

```sql
-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

**How it works:**
- `auth.uid()` returns the authenticated user's ID from JWT
- Policy compares it with the `id` column
- Database automatically filters rows

---

#### **Queries Table**

```sql
-- Users can only view their own queries
CREATE POLICY "Users can view own queries"
  ON queries FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

-- Users can only insert queries for themselves
CREATE POLICY "Users can insert own queries"
  ON queries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);
```

**How it works:**
- Policy checks if `profile_id` matches authenticated user
- Prevents users from seeing/creating other users' queries

---

#### **Resources Table**

```sql
-- All authenticated users can view resources (shared learning content)
CREATE POLICY "Anyone authenticated can view resources"
  ON resources FOR SELECT
  TO authenticated
  USING (true);
```

**How it works:**
- Learning resources are public to all authenticated users to read.


---

## 🎯 Key Features Implemented

 **Supabase Integration**
- PostgreSQL database with RLS policies
- Supabase Auth for user management
- Supabase Storage for file hosting

**RESTful API**
- Clean request/response contracts
- Proper error handling
- Input validation

**Security**
- JWT-based authentication
- Row Level Security (RLS) policies
- Environment variables for secrets
- Password hashing via Supabase Auth

**Data Management**
- Profiles, queries, and resources tables
- Sample PPT and video in storage
- Tag-based resource matching

---

## 🚀 One Improvement with More Time

**Current Limitation:**
- Keyword-based search may miss relevant resources due to synonyms, phrasing differences, or lack of exact matches.

**Proposed Solution:**
- Use a pre-trained language model (e.g., OpenAI's text-embedding-3-small) to generate vector embeddings for both user queries and resource metadata (title, description, tags).

**Benefits:**
- Understands semantic meaning, not just keywords
- Scales to thousands of resources
- More accurate, relevant results
- Better user experience
---



## 📄 License

This project is part of a hiring assignment for VeidaLabs.

---

**Built for VeidaLabs**