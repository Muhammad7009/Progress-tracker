# Progress Tracker 🚀

A full-stack web application designed to track and visualize daily goals, habits, or milestones. Built with a React frontend, a Flask REST API backend, and containerized entirely using Docker.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React.js (Vite)
* **State Management:** React Hooks (`useState`, `useEffect`)
* **Styling:** Custom CSS / Component-driven design

### Backend
* **Framework:** Python Flask
* **Authentication:** JWT (JSON Web Tokens) via `Flask-JWT-Extended`
* **CORS Handling:** `Flask-CORS`
* **Containerization:** Docker & Docker Compose

---

## 📂 Project Structure

```text
progress-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/       # ProgressChart, AuthPage, etc.
│   │   ├── DashBoard.jsx     # Main User Dashboard
│   │   ├── App.jsx           # Application Router & Core View
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── muhammad-backend/
│   ├── app.py                # Flask Application Entrypoint
│   ├── requirements.txt      # Python Dependencies
│   └── Dockerfile
├── .gitignore
└── docker-compose.yml        # Multi-container orchestration