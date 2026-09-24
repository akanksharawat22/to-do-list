// API Client with fallback support for offline/demo mode

const API_BASE = '/api';

// Helper for local storage mock DB when backend server is offline
const getLocalTasks = () => {
  const data = localStorage.getItem('taskpulse_tasks');
  if (!data) {
    const initialTasks = [
      {
        _id: 'task_1',
        title: 'Design MERN To-Do Application Architecture',
        description: 'Set up Express REST controllers, Mongoose schemas, and React hooks.',
        status: 'Completed',
        priority: 'High',
        category: 'Work',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
        tags: ['MERN', 'React', 'Node'],
        subtasks: [
          { _id: 'st_1', title: 'Define Mongoose Schemas', completed: true },
          { _id: 'st_2', title: 'Build JWT Authentication Middleware', completed: true },
        ],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        _id: 'task_2',
        title: 'Implement Task Status Workflow (Pending / In-Progress / Completed)',
        description: 'Enable smooth drag-and-drop or status toggle buttons with vibrant badge indicators.',
        status: 'In-Progress',
        priority: 'Urgent',
        category: 'Work',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        tags: ['Workflow', 'UI/UX'],
        subtasks: [
          { _id: 'st_3', title: 'Add progress bar animation', completed: true },
          { _id: 'st_4', title: 'Connect update status handler', completed: false },
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        _id: 'task_3',
        title: 'Grocery Shopping & Meal Prep',
        description: 'Buy organic greens, fresh fruit, almond milk, and protein snacks.',
        status: 'Pending',
        priority: 'Medium',
        category: 'Shopping',
        dueDate: new Date(Date.now() + 172800000).toISOString(),
        tags: ['Personal', 'Health'],
        subtasks: [
          { _id: 'st_5', title: 'Buy almond milk', completed: false },
          { _id: 'st_6', title: 'Buy avocados', completed: false },
        ],
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString(),
      },
      {
        _id: 'task_4',
        title: 'Daily Fitness Workout Session',
        description: '30-minute cardio exercise and core strength training.',
        status: 'Pending',
        priority: 'Low',
        category: 'Health',
        dueDate: new Date(Date.now() + 259200000).toISOString(),
        tags: ['Fitness', 'Wellness'],
        subtasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('taskpulse_tasks', JSON.stringify(initialTasks));
    return initialTasks;
  }
  return JSON.parse(data);
};

const setLocalTasks = (tasks) => {
  localStorage.setItem('taskpulse_tasks', JSON.stringify(tasks));
};

const getLocalUser = () => {
  const user = localStorage.getItem('taskpulse_user');
  if (user) return JSON.parse(user);
  const defaultUser = { _id: 'demo_user_1', name: 'Alex Johnson', email: 'alex@taskpulse.io' };
  localStorage.setItem('taskpulse_user', JSON.stringify(defaultUser));
  return defaultUser;
};

// API Functions
export const api = {
  // Auth endpoints
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (err) {
      console.warn('API Auth server unavailable, operating in smart local fallback mode:', err.message);
      // Offline fallback
      const user = getLocalUser();
      user.email = email;
      user.name = email.split('@')[0].toUpperCase();
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('taskpulse_token', token);
      localStorage.setItem('taskpulse_user', JSON.stringify(user));
      return { success: true, data: { ...user, token } };
    }
  },

  async register(name, email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (err) {
      console.warn('API Auth server unavailable, fallback register:', err.message);
      const user = { _id: 'user_' + Date.now(), name, email };
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('taskpulse_token', token);
      localStorage.setItem('taskpulse_user', JSON.stringify(user));
      return { success: true, data: { ...user, token } };
    }
  },

  async getMe(token) {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      return { success: true, data: getLocalUser() };
    }
  },

  // Task endpoints
  async getTasks(queryParams = {}) {
    const token = localStorage.getItem('taskpulse_token');
    const searchParams = new URLSearchParams(queryParams).toString();

    try {
      const res = await fetch(`${API_BASE}/tasks?${searchParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      // Local fallback sorting, filtering, searching & pagination logic
      let tasks = getLocalTasks();

      // Filtering
      if (queryParams.status) {
        tasks = tasks.filter((t) => t.status === queryParams.status);
      }
      if (queryParams.priority) {
        tasks = tasks.filter((t) => t.priority === queryParams.priority);
      }
      if (queryParams.category) {
        tasks = tasks.filter((t) => t.category === queryParams.category);
      }
      if (queryParams.search) {
        const q = queryParams.search.toLowerCase();
        tasks = tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            (t.description && t.description.toLowerCase().includes(q)) ||
            (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
        );
      }

      // Sorting
      const sortBy = queryParams.sortBy || 'createdAt';
      const sortOrder = queryParams.sortOrder === 'asc' ? 1 : -1;
      tasks.sort((a, b) => {
        let valA = a[sortBy] || '';
        let valB = b[sortBy] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return -1 * sortOrder;
        if (valA > valB) return 1 * sortOrder;
        return 0;
      });

      // Pagination
      const page = parseInt(queryParams.page) || 1;
      const limit = parseInt(queryParams.limit) || 10;
      const totalTasks = tasks.length;
      const totalPages = Math.ceil(totalTasks / limit) || 1;
      const startIdx = (page - 1) * limit;
      const paginatedTasks = tasks.slice(startIdx, startIdx + limit);

      return {
        success: true,
        data: paginatedTasks,
        pagination: {
          totalTasks,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }
  },

  async createTask(taskData) {
    const token = localStorage.getItem('taskpulse_token');
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      const tasks = getLocalTasks();
      const newTask = {
        _id: 'task_' + Date.now(),
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'Pending',
        priority: taskData.priority || 'Medium',
        category: taskData.category || 'Work',
        dueDate: taskData.dueDate || null,
        tags: taskData.tags || [],
        subtasks: taskData.subtasks || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tasks.unshift(newTask);
      setLocalTasks(tasks);
      return { success: true, data: newTask };
    }
  },

  async updateTask(id, taskData) {
    const token = localStorage.getItem('taskpulse_token');
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      const tasks = getLocalTasks();
      const idx = tasks.findIndex((t) => t._id === id);
      if (idx !== -1) {
        tasks[idx] = {
          ...tasks[idx],
          ...taskData,
          updatedAt: new Date().toISOString(),
        };
        setLocalTasks(tasks);
        return { success: true, data: tasks[idx] };
      }
      throw new Error('Task not found');
    }
  },

  async deleteTask(id) {
    const token = localStorage.getItem('taskpulse_token');
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      let tasks = getLocalTasks();
      tasks = tasks.filter((t) => t._id !== id);
      setLocalTasks(tasks);
      return { success: true, data: { id } };
    }
  },

  async getTaskStats() {
    const token = localStorage.getItem('taskpulse_token');
    try {
      const res = await fetch(`${API_BASE}/tasks/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      const tasks = getLocalTasks();
      const pending = tasks.filter((t) => t.status === 'Pending').length;
      const inProgress = tasks.filter((t) => t.status === 'In-Progress').length;
      const completed = tasks.filter((t) => t.status === 'Completed').length;
      return {
        success: true,
        data: {
          pending,
          inProgress,
          completed,
          total: tasks.length,
        },
      };
    }
  },
};
