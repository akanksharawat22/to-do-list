const Task = require('../models/Task');

// @desc    Get all tasks with pagination, filtering & sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      status,
      priority,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    // Build Query Filter
    const filter = { user: userId };

    if (status && ['Pending', 'In-Progress', 'Completed'].includes(status)) {
      filter.status = status;
    }

    if (priority && ['Low', 'Medium', 'High', 'Urgent'].includes(priority)) {
      filter.priority = priority;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Build Sorting
    const sort = {};
    const order = sortOrder === 'asc' ? 1 : -1;
    sort[sortBy] = order;

    // Pagination setup
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limitNum) || 1;

    res.json({
      success: true,
      data: tasks,
      pagination: {
        totalTasks,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access unauthorized',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, dueDate, tags, subtasks } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description: description || '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      category: category || 'Work',
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: Array.isArray(tags) ? tags : [],
      subtasks: Array.isArray(subtasks) ? subtasks : [],
      completedAt: status === 'Completed' ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task (including status workflow)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access unauthorized',
      });
    }

    const updates = { ...req.body };

    // Update completedAt field if status changes to/from Completed
    if (updates.status && updates.status === 'Completed' && task.status !== 'Completed') {
      updates.completedAt = new Date();
    } else if (updates.status && updates.status !== 'Completed') {
      updates.completedAt = null;
    }

    task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access unauthorized',
      });
    }

    res.json({
      success: true,
      message: 'Task removed successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregate stats of tasks for user dashboard
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const stats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      pending: 0,
      inProgress: 0,
      completed: 0,
      total: 0,
    };

    stats.forEach((item) => {
      if (item._id === 'Pending') formattedStats.pending = item.count;
      if (item._id === 'In-Progress') formattedStats.inProgress = item.count;
      if (item._id === 'Completed') formattedStats.completed = item.count;
    });

    formattedStats.total = formattedStats.pending + formattedStats.inProgress + formattedStats.completed;

    res.json({
      success: true,
      data: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
