# 📊 Mini CRM — Client Lead Management System

A simple yet powerful CRM (Customer Relationship Management) system built to help businesses manage leads coming from website contact forms. Track, update, and convert leads into real clients — all from a secure admin dashboard.

---

## 🌐 Live Demo

🔗 [View Live Demo](https://mini-crm-bice.vercel.app/)

> Login with: **admin** / **admin123**

---

## 📸 Screenshots

### Login Page
<img width="1857" height="900" alt="image" src="https://github.com/user-attachments/assets/9a6601c9-8439-44b4-a761-71343d255a8a" />


---

## ✨ Features

- 🔐 **Secure Admin Login** — Only authorized users can access the dashboard
- 👥 **Lead Management** — View all leads in a clean, organized table
- 🔄 **Status Tracking** — Update lead status: `New → Contacted → Converted`
- 📝 **Follow-up Notes** — Add notes to each lead for better follow-up
- 🔍 **Search & Filter** — Quickly find leads by name, email or status
- 📊 **Dashboard Stats** — See total, new, contacted and converted counts
- ➕ **Add New Leads** — Manually add leads with name, email, phone and source

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)


## ⚙️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Git](https://git-scm.com/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sowmya24057/FUTURE_FS_02.git
cd FUTURE_FS_02
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create `.env` file inside `backend` folder:

```env
MONGO_URI=mongodb://localhost:27017/minicrm
JWT_SECRET=myRandomSuperSecretKey$2026!CRM
```

Start the backend:

```bash
node server.js
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

### 3️⃣ Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

App opens at **http://localhost:3000** 🎉

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/leads` | Get all leads |
| POST | `/api/leads` | Add new lead |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete a lead |

---

## 📊 Lead Status Flow

```
🆕 New  →  📞 Contacted  →  ✅ Converted
```

---

## 🚀 Deployment

| Service | Purpose | URL |
|---------|---------|-----|
| [Vercel](https://vercel.com) | Frontend | https://future-fs-02.vercel.app |
| [Render](https://render.com) | Backend | https://future-fs-02-wt3r.onrender.com |
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Database | Cloud |

---

## 👩‍💻 Author

**Sowmya Sri**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sowmya24057)


