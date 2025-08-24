# 🎓 Learning Management System (LMS)

A powerful and intuitive **web-based LMS** designed to connect students, instructors, and administrators in one seamless platform. It simplifies course delivery, progress tracking, and overall learning management with modern tools.

---

## ✨ Key Highlights

- 🔐 **Secure Authentication** – Role-based login for Students, Instructors, and Admins.  
- 📚 **Course Handling** – Add, edit, or remove courses with ease.  
- 🧑‍🎓 **Student Panel** – Access enrolled courses, monitor progress, and download resources.  
- 👨‍🏫 **Instructor Panel** – Manage courses, upload study materials, and track student performance.  
- 💬 **Engaged Learning** – Assignments, discussions, and resource sharing for better collaboration.  
- 📱 **Mobile-Friendly UI** – Clean, modern, and responsive design.  

---

## 🛠️ Technology Stack

- **Frontend:** React.js + Tailwind CSS  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **Auth:** JSON Web Tokens (JWT)  

---

## 📁 Project Layout

LMS/
├── client/ # React frontend
│ ├── src/ # Components, pages, and context
│ ├── public/ # Static assets
│ └── package.json # Frontend dependencies
│
├── server/ # Express backend
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API endpoints
│ ├── controllers/ # Business logic
│ └── server.js # Entry file
│
├── .gitignore
├── README.md
└── package.json


---

## ⚙️ Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/anjali-rayy/LMS-LEARN.git
cd LMS-LEARN

2️⃣ Install Dependencies
# Frontend
cd client
npm install

# Backend
cd ../server
npm install

3️⃣ Configure Environment

Create a .env file inside the server/ folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4️⃣ Run the Project

Open two terminals:

# Start backend
cd server
npm start

# Start frontend
cd client
npm run dev

👩‍💻 Author

Crafted with ❤️ by Anjali Ray