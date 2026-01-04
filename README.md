# 📚 Library Manager  
*A modern, production-ready Library Management System built with MERN principles*

---

## 🚀 Overview

**Library Manager** is a full-stack CRUD application designed to manage books efficiently with a clean UI, robust backend, and cloud-ready architecture.  
It demonstrates **real-world API design**, **database integration**, and **deployment practices**, not just UI screens.

Built with scalability, clarity, and maintainability in mind.

---

## ✨ Key Features

- 📖 Complete **CRUD operations** for books  
- 🔍 Search & filter by title, author, category, year  
- 🔐 Business rule enforcement (delete only if copies = 0)  
- 🌐 RESTful APIs tested via Postman  
- 🎨 Clean, responsive, tech-aesthetic UI  
- ☁️ Cloud deployment with MongoDB Atlas  
- ⚡ Optimized for production (env-based config)

---

## 🛠️ Tech Stack

### Frontend
- HTML5  
- CSS3 (custom theme, responsive layout)  
- Vanilla JavaScript  

### Backend
- Node.js  
- Express.js  
- MongoDB  
- Mongoose ODM  

### Tools & Platforms
- MongoDB Atlas  
- Postman (API testing)  
- Git & GitHub  
- Render (deployment)

---

## 🧱 Project Structure

```

library-crud-mern/
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Book.js
│   │   ├── routes/
│   │   │   └── bookRoutes.js
│   │   ├── config/
│   │   │   └── db.js
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
└── README.md

````

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/api/books` | Fetch all books |
| POST | `/api/books` | Add a new book |
| PUT | `/api/books/:id` | Update book details |
| PATCH | `/api/books/:id/copies` | Add copies |
| DELETE | `/api/books/:id` | Delete (copies must be 0) |
| GET | `/api/health` | Health check |

---

## ⚙️ Environment Setup

Create a `.env` file inside `backend/`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/libraryDB
PORT=3000
````

> ⚠️ Never commit `.env` files to GitHub.

---

## ▶️ Running Locally

```bash
# Backend
cd backend
npm install
npm run dev
```

Then open `frontend/index.html` in your browser
(or serve it via Express for a single-service setup).

---

## ☁️ Deployment

* **Backend** deployed on **Render**
* **Database** hosted on **MongoDB Atlas**
* Environment variables configured securely on Render
* Application runs on a single production URL

---

## 🧪 API Testing

All endpoints are tested using **Postman** with proper validation for:

* ObjectId handling
* Numeric fields (`publishedYear`, `availableCopies`)
* Business constraints

---

## 🎯 Why This Project Matters

This project reflects:

* Practical understanding of **full-stack development**
* Clean API architecture
* Error handling & validation
* Deployment readiness
* UI/UX attention with developer empathy

It is built as a **deployable product**, not a demo.

---

## 👩‍💻 Developer

**KIRUTHIGAA K**
Computer Science Engineer
Focused on Full-Stack Development, Systems Thinking & Real-World Engineering

* GitHub: [https://github.com/Krithiikaa](https://github.com/Krithiikaa)
* LinkedIn: [https://www.linkedin.com/in/kiruthigaa-k](https://www.linkedin.com/in/kiruthigaa-k)
* Email: [krithikaarajkumaar@gmail.com](mailto:krithikaarajkumaar@gmail.com)

---

## 📄 License

This project is open for learning and demonstration purposes.
Feel free to explore, fork, and extend.

---

> *Small habits build strong systems. Clean code builds reliable products.*

```



tell me — I’ll tailor it exactly for that purpose.
```
