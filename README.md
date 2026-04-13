# DocuMind — Intelligent Document Analysis Platform

DocuMind is a full-stack application that lets users upload PDF documents and query them using natural language. It implements a Retrieval-Augmented Generation (RAG) pipeline — chunking documents, generating embeddings, performing semantic search, and streaming AI-powered answers in real time.

---

## 🚀 Features

- **PDF Upload & Processing** — Drop in any PDF and DocuMind extracts, chunks, and indexes the content automatically.
- **Semantic Search** — Questions are embedded and matched against document chunks using cosine similarity.
- **Streamed AI Responses** — Answers stream token-by-token using Gemini, providing a real-time chat experience.
- **Document History** — All Q&A pairs and active documents are persisted. Swap between past uploaded documents without re-uploading.
- **JWT Authentication** — Fast, self-contained custom authentication system using `bcryptjs` and `jsonwebtoken`.
- **Per-User Rate Limiting & Waitlist** — 2 LLM queries per hour to protect API key usage, gracefully triggering an "Upgrade to Pro" redirect and a waitlist sign-up feature.
- **Deploy-Ready** — Configured for Vercel (frontend) + Render (backend) with environment-based configuration and fully handled CORS policies.

---

## 🧠 System Architecture

```text
Frontend (React + Vite)  →   Custom JWT Auth   →  Backend (Express.js)
                                                      ↓
                                            PDF Upload → Text Extraction → Chunking → Embeddings
                                                      ↓
                                              PostgreSQL (Neon DB)
                                                      ↓
                                    Query → Embedding → Similarity Search → Gemini LLM → Streamed Response
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Auth** | Custom JWT Token Authentication with Bcrypt hash |
| **AI / ML** | Gemini API (Embeddings + Generation) |
| **Database** | PostgreSQL (Neon DB) via Drizzle ORM |
| **File Processing** | Multer (memory storage), pdf-parse |
| **Security** | Helmet, CORS, express-rate-limit |

---

## 🗄️ Database Schema

### Users
| Column | Type |
|--------|------|
| `id` | UUID |
| `email` | TEXT |
| `name` | TEXT |
| `password` | TEXT |
| `created_at` | TIMESTAMP |

### Documents
| Column | Type |
|--------|------|
| `id` | UUID |
| `name` | TEXT |
| `user_id` | UUID (FK → Users) |
| `uploaded_at` | TIMESTAMP |

### Chunks
| Column | Type |
|--------|------|
| `id` | UUID |
| `document_id` | UUID (FK → Documents) |
| `content` | TEXT |
| `embedding` | JSON |

### Chats
| Column | Type |
|--------|------|
| `id` | UUID |
| `document_id` | UUID (FK → Documents) |
| `question` | TEXT |
| `response` | TEXT |
| `created_at` | TIMESTAMP |

### Waitlist Users
| Column | Type |
|--------|------|
| `id` | UUID |
| `email` | TEXT |
| `created_at` | TIMESTAMP |

---

## 📡 API Endpoints

Protected routes require a `Authorization: Bearer <token>` JWT header.

| Method | Route | Auth Needed | Description |
|--------|-------|-------------|-------------|
| `POST` | `/api/register`| ❌ No | Register a new user |
| `POST` | `/api/login`   | ❌ No | Login and receive a JWT |
| `POST` | `/api/waitlist`| ❌ No | Join the Pro Waitlist |
| `GET`  | `/api/history` | ✅ Yes | Fetch user's document history and current chats |
| `POST` | `/api/upload`  | ✅ Yes | Upload a PDF — extracts, chunks, embeds, and stores |
| `POST` | `/api/query`   | ✅ Yes | Ask a question — streams the LLM response in real time |

---

## 🔄 Pipeline

### Ingestion
```text
PDF Upload → Text Extraction → Chunking (400 chars, 100 overlap) → Embedding (Gemini) → PostgreSQL
```

### Retrieval
```text
User Query → Embed Query → Cosine Similarity vs Stored Chunks → Top 3 Chunks → Gemini LLM → Streamed Response
```

---

## 🧪 Running Locally

### Prerequisites
- Node.js 18+
- A Neon PostgreSQL database
- A Gemini API key

### Backend
```bash
cd backend
npm install
# Create .env with: DATABASE_URL, GEMINI_API_KEY, JWT_SECRET, FRONTEND_URL
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env with: VITE_API_URL
npm run dev
```

---

## 🌐 Deployment

| Component | Platform | Start Command |
|-----------|----------|---------------|
| Frontend | Vercel | Auto-detected (Vite) |
| Backend | Render | `npm start` → `node index.js` |

### Environment Variables

**Render (Backend):** `DATABASE_URL`, `GEMINI_API_KEY`, `JWT_SECRET`, `FRONTEND_URL`

**Vercel (Frontend):** `VITE_API_URL`

---

## ⚠️ Limitations

- PDF extraction may produce noisy text from complex layouts
- No OCR support for scanned/image-based PDFs
- Linear similarity search (not optimized for millions of chunks)

---

## 🚀 Future Tasks (Upcoming Implementations)

- Vector database integration (pgvector / Pinecone) for faster retrieval at scale
- Multi-document querying across an entire knowledge base
- Production-grade async batch processing and task queues for stable, large document uploads
- OCR support for scanned documents
- Markdown rendering for AI responses

---

## 💡 Key Learnings

- Built an end-to-end RAG pipeline from scratch without high-level abstractions
- Handled CORS configuration across strictly decoupled frontend/backend instances
- Engineered streaming LLM responses via chunked transfer encoding (TextDecoder)
- Designed an autonomous custom JWT-powered Authentication System from scratch
- Developed a robust rate-limiting architecture combined with responsive UX degradation.
