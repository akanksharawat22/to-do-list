# TaskPulse - Advanced MERN To-Do List Application

An **Advanced MERN Architecture Task Management & To-Do Application** with real-time task status workflows, JWT authentication, pagination, multi-criteria filtering, sorting, subtask breakdowns, and interactive productivity analytics.

---

## 🌟 Key Features

### 1. **Advanced MERN Architecture**
- **Frontend**: React.js SPA (Vite) with modern hooks (`useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`) and modular context state management (`AuthContext`, `TaskContext`).
- **Backend**: Node.js & Express.js REST API with clean separation of:
  - `routes/`: Auth and Task REST endpoints
  - `controllers/`: Request handling logic, MongoDB queries & response formatting
  - `models/`: Mongoose schemas with validation rules & database indexes
  - `middleware/`: JWT verification, parameter validation, and global error handling
- **Database**: MongoDB (Mongoose schemas for `User` & `Task` with indexed search parameters).

### 2. **Task Status Workflow & Views**
- **3-Stage Workflow**: Seamless transitions between `Pending`, `In-Progress`, and `Completed`.
- **Kanban Board View**: Interactive drag-and-drop or one-click status transitions across 3 workflow columns.
- **List View**: Grid view with quick metadata badges.
- **Analytics Dashboard**: Real-time completion ratio, priority distribution charts, and overdue warnings.

### 3. **Search, Filtering, Sorting & Pagination**
- **Search**: Dynamic text search across title, description, and tags.
- **Filtering**: Filter by Status (`Pending`, `In-Progress`, `Completed`), Priority (`Low`, `Medium`, `High`, `Urgent`), and Category (`Work`, `Personal`, `Shopping`, `Health`, `Education`, `Finance`, `Other`).
- **Sorting**: Order tasks by Created Date, Due Date, Priority, or Alphabetical title.
- **Pagination**: Paginated navigation with total item counts and page selectors.

### 4. **JWT Authentication & Security**
- User registration and login with encrypted password hashing (`bcryptjs`).
- Secure Bearer JWT authorization headers.

### 5. **Rich Aesthetic UI / UX**
- Dark Mode & Light Mode theme toggle.
- Glassmorphism design system with glowing status badges and smooth animations.
- Confetti celebration animation upon completing tasks.

---

## 📁 Directory Structure

```
TO DO LIST/
├── server/                    # Node.js + Express + MongoDB Backend REST API
│   ├── config/                # Database connection (db.js)
│   ├── controllers/           # authController.js, taskController.js
│   ├── middleware/            # authMiddleware.js, errorHandler.js
│   ├── models/                # User.js, Task.js
│   ├── routes/                # authRoutes.js, taskRoutes.js
│   ├── .env                   # Environment variables (PORT, MONGODB_URI, JWT_SECRET)
│   ├── server.js              # Express app entry point
│   └── package.json           # Backend dependencies
├── client/                    # React.js SPA (Vite + React)
│   ├── src/
│   │   ├── components/        # Navbar, TaskCard, TaskBoard, TaskList, StatsOverview, FilterBar, AnalyticsView, TaskModal, AuthModal, Pagination
│   │   ├── context/           # AuthContext.jsx, TaskContext.jsx
│   │   ├── services/          # api.js (REST API client with offline fallback)
│   │   ├── styles/            # App.css (Design system & tokens)
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Entry point
│   ├── index.html             # Google fonts & layout
│   ├── vite.config.js         # Vite config with backend proxy
│   └── package.json           # Frontend dependencies
└── README.md
```

---

## 🚀 How to Run the Application

### Option A: Run Full MERN Stack (With Node.js + Express Backend)

1. **Start MongoDB**: Make sure MongoDB service is running locally (`mongodb://127.0.0.1:27017/todo_app`).
2. **Start Backend Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   *Express REST API will start on `http://localhost:5000`.*

3. **Start React Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *Vite development server will launch on `http://localhost:3000`.*

### Option B: Run Standalone React Frontend (Smart Fallback Mode)
If Node/MongoDB is not currently running, the app automatically switches to **smart offline fallback mode**, preserving full functionality and persistence in `localStorage`.

---

## 🛠 REST API Documentation

### Auth Endpoints
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate user & retrieve JWT token
- `GET /api/auth/me` - Get current user profile (Protected)

### Task Endpoints (Protected)
- `GET /api/tasks` - Get tasks with pagination (`page`, `limit`), filtering (`status`, `priority`, `category`, `search`), and sorting (`sortBy`, `sortOrder`).
- `GET /api/tasks/stats` - Get aggregate counts (Pending, In-Progress, Completed, Total).
- `POST /api/tasks` - Create new task.
- `GET /api/tasks/:id` - Fetch single task.
- `PUT /api/tasks/:id` - Update task details & workflow status.
- `DELETE /api/tasks/:id` - Remove task.
