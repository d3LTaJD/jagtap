const Task = require('../models/Task');
const { createNotification } = require('../services/notificationService');

// @desc    Create a new task
// @route   POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, dueTime, priority, assignedTo, linkedEnquiry, linkedQuotation, status } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      dueTime,
      priority,
      status: status || 'To Do',
      assignedTo: assignedTo || req.user._id,
      linkedEnquiry: linkedEnquiry || null,
      linkedQuotation: linkedQuotation || null,
      createdBy: req.user._id,
    });

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name department')
      .populate('createdBy', 'name');

    // Notify the assigned user (if different from creator)
    const targetUser = assignedTo || req.user._id;
    if (targetUser && targetUser.toString() !== req.user._id.toString()) {
      await createNotification({
        user_id: targetUser,
        type: 'TASK_ASSIGNED',
        title: 'New Task Assigned',
        message: `Task "${title}" has been assigned to you. Due: ${dueDate ? new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'No date'}.`,
        related_id: task._id
      });
    }

    res.status(201).json({ status: 'success', data: { task: populated } });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all tasks (with optional filters)
// @route   GET /api/tasks
exports.getTasks = async (req, res) => {
  try {
    const { status, assignedTo, priority, search, page = 1, limit = 50, sortBy = 'dueDate', sortOrder = 'asc' } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (priority) filter.priority = priority;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name department')
      .populate('createdBy', 'name')
      .populate('linkedEnquiry', 'enquiryId')
      .populate('linkedQuotation', 'quotationId')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

    res.status(200).json({ 
      status: 'success', 
      results: tasks.length,
      total,
      data: { tasks } 
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name department')
      .populate('createdBy', 'name')
      .populate('linkedEnquiry', 'enquiryId')
      .populate('linkedQuotation', 'quotationId');

    if (!task) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }

    res.status(200).json({ status: 'success', data: { task } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update a task
// @route   PATCH /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const updates = { ...req.body };
    const originalTask = await Task.findById(req.params.id);
    if (!originalTask) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }

    // If status changes to 'Done', record completedAt
    if (updates.status === 'Done') {
      updates.completedAt = new Date();
    } else if (updates.status && updates.status !== 'Done') {
      updates.completedAt = null;
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('assignedTo', 'name department')
      .populate('createdBy', 'name')
      .populate('linkedEnquiry', 'enquiryId')
      .populate('linkedQuotation', 'quotationId');

    // Notify if task is reassigned to a different user
    if (updates.assignedTo && updates.assignedTo.toString() !== originalTask.assignedTo?.toString()) {
      await createNotification({
        user_id: updates.assignedTo,
        type: 'TASK_ASSIGNED',
        title: 'Task Reassigned to You',
        message: `Task "${task.title}" has been reassigned to you.`,
        related_id: task._id
      });
    }

    // Notify creator when task is marked Done (if different from the person who completed it)
    if (updates.status === 'Done' && originalTask.status !== 'Done') {
      if (originalTask.createdBy && originalTask.createdBy.toString() !== req.user._id.toString()) {
        await createNotification({
          user_id: originalTask.createdBy,
          type: 'TASK_COMPLETED',
          title: 'Task Completed',
          message: `Task "${task.title}" has been marked as done.`,
          related_id: task._id
        });
      }
    }

    res.status(200).json({ status: 'success', data: { task } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }
    res.status(200).json({ status: 'success', message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
