# Smart Interview Tracker App

A production-ready MERN stack app to manage and track candidate interviews.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)

---

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

Backend runs on: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 📁 Project Structure

```
Interview Tracker App/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── interviewController.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Interview.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── interviews.js
│   ├── .env
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── InterviewCard.jsx
        │   ├── InterviewModal.jsx
        │   ├── ProtectedRoute.jsx
        │   └── StatusBadge.jsx
        ├── context/AuthContext.jsx
        ├── hooks/useInterviews.js
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Login.jsx
        │   └── Register.jsx
        └── services/api.js
```

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `{name, email, password}` | Register user |
| POST | `/api/auth/login` | `{email, password}` | Login user |

### Interviews (Protected — requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/interviews` | Get all interviews (supports `?name=&status=&position=&sort=`) |
| POST | `/api/interviews` | Create interview |
| PUT | `/api/interviews/:id` | Update interview |
| DELETE | `/api/interviews/:id` | Delete interview |

---

## 🧪 Postman Examples

### Register
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secret123"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "secret123"
}
```

### Create Interview
```
POST http://localhost:5000/api/interviews
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "candidate_name": "John Doe",
  "position": "Frontend Developer",
  "email": "john@example.com",
  "status": "scheduled",
  "date": "2025-02-15",
  "notes": "Strong React skills"
}
```

### Get Interviews with Filters
```
GET http://localhost:5000/api/interviews?status=pending&sort=asc
Authorization: Bearer <your_token>
```

### Update Interview
```
PUT http://localhost:5000/api/interviews/<id>
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "status": "completed",
  "notes": "Passed all rounds"
}
```

### Delete Interview
```
DELETE http://localhost:5000/api/interviews/<id>
Authorization: Bearer <your_token>
```
