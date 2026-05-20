# APM Connect — ATS Resume Parser

An AI-powered Applicant Tracking System that scores and ranks resumes against a Job Description using Claude AI.

---

## Features

- Upload a Job Description (PDF, DOCX, or TXT)
- Upload up to 50 candidate resumes (PDF)
- Drag & drop or click-to-browse upload
- AI scoring via Claude Haiku (40% keyword match + 60% AI evaluation)
- Candidates categorized into Strong / Moderate / Weak match
- Search and filter results
- Download individual resume PDFs
- Light and dark mode
- Fully responsive (table on desktop, cards on mobile)

---

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Vite, plain CSS               |
| Backend  | Python 3.11+, FastAPI, Uvicorn          |
| AI       | Anthropic Claude Haiku (claude-haiku-4-5-20251001) |
| Parsing  | pdfplumber, python-docx                 |

---

## Project Structure

```
ats-application/
├── backend/
│   ├── app/
│   │   ├── config/         # Environment settings
│   │   ├── models/         # Pydantic schemas
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Parser, scorer, Claude service
│   │   ├── utils/          # File text extraction helpers
│   │   └── main.py         # FastAPI app entry point
│   ├── uploads/            # Temporary resume storage
│   ├── .env                # Backend environment variables
│   ├── requirements.txt
│   └── start.bat           # Windows quick-start script
│
└── frontend/
    ├── src/
    │   ├── api/            # Axios client
    │   ├── components/     # Navbar, DropZone, Table, Cards, Loader…
    │   ├── constants/      # Shared constants
    │   ├── hooks/          # useFileUpload
    │   ├── pages/          # Home page
    │   ├── services/       # atsService (API calls, download)
    │   ├── styles/         # global.css (dark + light theme)
    │   └── utils/          # Validation, formatting helpers
    ├── .env                # Frontend environment variables
    ├── package.json
    └── start.bat           # Windows quick-start script
```

---

## Prerequisites

- **Python 3.11+** — [python.org/downloads](https://www.python.org/downloads/)  
  During install, check **"Add Python to PATH"**
- **Node.js 18+** — [nodejs.org](https://nodejs.org/)
- **Anthropic API Key** — [console.anthropic.com](https://console.anthropic.com/)

---

## Setup

### 1. Clone / download the project

```bash
cd ats-application
```

### 2. Configure backend environment

Open `backend/.env` and set your API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
MAX_RESUMES=50
MAX_FILE_SIZE_MB=10
UPLOAD_DIR=uploads
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Start the backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Or just double-click **`backend/start.bat`**.

Backend runs at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Or just double-click **`frontend/start.bat`**.

Frontend runs at: `http://localhost:5173`

---

## API Reference

### `POST /api/v1/parse-resumes`

Accepts a Job Description and multiple resumes, returns categorized results.

**Request** — `multipart/form-data`

| Field      | Type           | Description                        |
|------------|----------------|------------------------------------|
| `jd_file`  | File           | Job Description (PDF / DOCX / TXT) |
| `resumes`  | File[]         | Resume PDFs (max 50)               |

**Response**

```json
{
  "above_80":       [{ "candidate_name": "...", "email": "...", "phone": "...", "score": 87.5, "file_name": "...", "original_file_name": "..." }],
  "between_50_79":  [],
  "below_50":       [],
  "total_processed": 3,
  "total_failed":    0
}
```

---

### `GET /api/v1/download/{file_name}`

Returns the stored resume PDF as a file download.

---

### `GET /api/v1/health`

Returns `{ "status": "healthy" }`.

---

## Scoring Logic

Each resume receives a combined score:

```
Final Score = (Keyword Match Score × 40%) + (Claude AI Score × 60%)
```

| Range   | Category       |
|---------|----------------|
| 80–100  | Strong Match   |
| 50–79   | Moderate Match |
| 0–49    | Weak Match     |

Prompt caching is enabled on the Job Description text to reduce API costs when processing large batches.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Default                              | Description                    |
|-------------------|--------------------------------------|--------------------------------|
| `ANTHROPIC_API_KEY` | —                                  | Required. Your Anthropic key   |
| `MAX_RESUMES`     | `50`                                 | Max resumes per request        |
| `MAX_FILE_SIZE_MB`| `10`                                 | Max upload size per file       |
| `UPLOAD_DIR`      | `uploads`                            | Directory for stored PDFs      |
| `ALLOWED_ORIGINS` | `http://localhost:5173,...`          | CORS allowed origins           |

### Frontend (`frontend/.env`)

| Variable           | Default                          | Description          |
|--------------------|----------------------------------|----------------------|
| `VITE_API_BASE_URL`| `http://localhost:8000/api/v1`   | Backend API base URL |

---

## Deployment

| Service  | Platform suggestion |
|----------|---------------------|
| Frontend | Vercel              |
| Backend  | Render / Railway    |

For production, update `ALLOWED_ORIGINS` in `backend/.env` to your frontend domain and set `VITE_API_BASE_URL` in `frontend/.env` to your backend URL.
