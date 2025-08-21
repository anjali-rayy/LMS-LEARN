# 📚 LMS - Learning Management System  

A modern web-based Learning Management System that allows students and instructors to connect, manage courses, and enhance the learning experience.  

---

## 🚀 Features  

- 🔑 **User Authentication** – Secure login & registration with role-based access (Student / Instructor / Admin).  
- 📘 **Course Management** – Create, update, and delete courses.  
- 🎓 **Student Dashboard** – View enrolled courses, progress, and course materials.  
- 👩‍🏫 **Instructor Dashboard** – Manage created courses, upload content, and monitor students.  
- 💬 **Interactive Learning** – Course content, assignments, and communication tools.  
- ⚡ **Responsive UI** – Built with a clean and user-friendly design.  

---

## 🛠️ Tech Stack  

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Tokens)  

---

## 📂 Project Structure  

```bash
LMS/
├── client/              # Frontend React code
│   ├── src/             # Components, Pages, Context
│   ├── public/          # Static files (favicon, logo)
│   └── package.json     # Frontend dependencies
│
├── server/              # Backend Express code
│   ├── models/          # MongoDB Schemas
│   ├── routes/          # API Routes
│   ├── controllers/     # Request Handlers
│   └── server.js        # Entry point
│
├── .gitignore
├── README.md
└── package.json

⚙️ Installation & Setup

Follow these steps to run the project locally:

Clone the repository

git clone https://github.com/anjali-rayy/LMS-LEARN.git
cd LMS-LEARN


Install dependencies for client and server

cd client
npm install
cd ../server
npm install


Setup environment variables
Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run the development servers
Open two terminals:

Start backend (server):

cd server
npm start


Start frontend (client):

cd client
npm run dev


👩‍💻 Author

✨ Developed with ❤️ by Anjali Ray
