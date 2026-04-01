
# LLMalpha — Financial Document Intelligence Engine

LLMalpha is a backend system that enables users to upload financial documents (PDF/Excel) and query them using natural language. It implements a Retrieval-Augmented Generation (RAG) pipeline using chunking, embeddings, and semantic similarity search to provide context-aware responses.

---

## 🚀 Features

- Upload and process financial documents (PDF, Excel)
- Extract and clean unstructured text
- Chunk large documents with overlap for context preservation
- Generate embeddings using Gemini Embedding API
- Perform semantic similarity search using cosine similarity
- Retrieve relevant document segments for query answering
- Context-aware responses using LLMs

---

## 🧠 System Architecture

```

Client (Postman / Frontend)
↓
Node.js Backend (Express)
↓
File Upload → Text Extraction → Chunking → Embeddings
↓
PostgreSQL (Neon DB)
↓
Query → Embedding → Similarity Search → LLM → Response

```

---

## ⚙️ Tech Stack

**Backend**
- Node.js
- Express.js

**AI / ML**
- Gemini Embedding API
- LLM API (Gemini / OpenAI)

**Database**
- PostgreSQL (Neon DB)

**Libraries**
- multer (file uploads)
- pdf-parse (PDF text extraction)
- xlsx (Excel parsing)
- compute-cosine-similarity

---

## 🧩 Core Concepts

### 1. Chunking with Overlap
Documents are split into smaller chunks (≈500 characters) with overlapping regions to preserve semantic continuity.

### 2. Embeddings
Each chunk is converted into a high-dimensional vector representing its semantic meaning.

### 3. Semantic Similarity
User queries are embedded and compared against stored chunk embeddings using cosine similarity.

### 4. Retrieval-Augmented Generation (RAG)
Top-K relevant chunks are passed as context to the LLM to generate accurate, context-aware responses.

---

## 🔄 Pipeline

### 📥 Ingestion Pipeline

```

Document → Text Extraction → Cleaning → Chunking → Embeddings → Storage

```

### 🔍 Query Pipeline

```

User Query → Embedding → Similarity Search → Top-K Chunks → LLM → Response

```

---

## 🗄️ Database Schema

### Documents Table
- `id` (UUID)
- `name`
- `uploaded_at`

### Chunks Table
- `id` (UUID)
- `document_id` (FK)
- `content` (TEXT)
- `embedding` (JSON / ARRAY)

### Chats Table (Optional)
- `id`
- `document_id`
- `question`
- `response`
- `created_at`

---

## 📡 API Endpoints

### Upload Document
```

POST /upload

```
- Accepts PDF/Excel file
- Processes and stores chunk embeddings

---

### Query Document
```

POST /query

````
**Body:**
```json
{
  "document_id": "uuid",
  "question": "What are the key risks?"
}
````

---

### Get Chat History (Optional)

```

GET /chat/:document_id

```

---

## 🧠 How Retrieval Works

1. Convert user query into embedding
2. Fetch all chunk embeddings for the document
3. Compute cosine similarity between query and each chunk
4. Rank chunks by similarity score
5. Select top-K relevant chunks
6. Pass chunk text as context to LLM

---

## ⚠️ Limitations

* PDF extraction may produce noisy or unstructured text
* No OCR support for scanned PDFs (future scope)
* Linear similarity search (not optimized for large-scale data)
* No authentication or access control (planned)

---

## 🚀 Future Improvements

* Vector database integration (Pinecone / pgvector)
* Async processing with job queues (BullMQ)
* Streaming LLM responses
* Multi-document querying
* Financial metric extraction and visualization
* Secure handling of sensitive financial data

---

## 🧪 Running Locally

```bash
git clone <repo>
cd llmalpha
npm install
npm run dev
```

---

## 💡 Key Learnings

* Implemented end-to-end RAG pipeline from scratch
* Understood embedding-based semantic search
* Designed backend systems for LLM-powered applications
* Explored trade-offs in chunking, retrieval, and context generation

---

## 📌 Summary

LLMalpha demonstrates how large unstructured financial documents can be transformed into queryable knowledge systems using modern LLM techniques. The project focuses on system design, retrieval logic, and backend architecture rather than relying on high-level abstractions.

---

```
