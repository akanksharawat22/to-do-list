import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Plus, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react';

export const TaskModal = () => {
  const { isTaskModalOpen, editingTask, addTask, updateTask, closeModal } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setStatus(editingTask.status || 'Pending');
      setPriority(editingTask.priority || 'Medium');
      setCategory(editingTask.category || 'Work');
      setDueDate(
        editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split('T')[0]
          : ''
      );
      setTags(editingTask.tags || []);
      setSubtasks(editingTask.subtasks || []);
    } else {
      // Reset form for create
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setPriority('Medium');
      setCategory('Work');
      setDueDate('');
      setTags([]);
      setSubtasks([]);
    }
    setValidationError('');
  }, [editingTask, isTaskModalOpen]);

  if (!isTaskModalOpen) return null;

  const handleAddTag = (e) => {
    e.preventDefault();
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    const val = subtaskInput.trim();
    if (val) {
      setSubtasks([...subtasks, { title: val, completed: false, _id: 'st_' + Date.now() }]);
      setSubtaskInput('');
    }
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setValidationError('Task title is required.');
      return;
    }

    setSubmitting(true);
    setValidationError('');

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      tags,
      subtasks,
    };

    let success = false;
    if (editingTask) {
      success = await updateTask(editingTask._id, taskPayload);
    } else {
      success = await addTask(taskPayload);
    }

    setSubmitting(false);

    if (success) {
      closeModal();
    } else {
      setValidationError('Failed to save task. Please check details.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
          <button className="btn-close-modal" onClick={closeModal}>
            <X size={20} />
          </button>
        </div>

        {validationError && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Add details or context..."
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Workflow Status, Priority & Category Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Status Workflow</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label>Due Date</label>
            <div className="input-with-icon">
              <Calendar size={18} className="input-icon" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Subtasks Builder */}
          <div className="form-group">
            <label>Subtasks Breakdown</label>
            <div className="subtask-input-row">
              <input
                type="text"
                placeholder="Add subtask step..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <button
                type="button"
                className="btn-add-subtask"
                onClick={handleAddSubtask}
              >
                <Plus size={16} />
              </button>
            </div>
            {subtasks.length > 0 && (
              <ul className="subtasks-builder-list">
                {subtasks.map((st, index) => (
                  <li key={index} className="subtask-builder-item">
                    <span>{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-row">
              <Tag size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Type tag and press Add..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
              />
              <button type="button" className="btn-add-tag" onClick={handleAddTag}>
                Add Tag
              </button>
            </div>
            {tags.length > 0 && (
              <div className="tags-builder-list">
                {tags.map((t, idx) => (
                  <span key={idx} className="tag-builder-pill">
                    #{t}
                    <button type="button" onClick={() => handleRemoveTag(t)}>
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting
                ? 'Saving...'
                : editingTask
                ? 'Update Task'
                : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
