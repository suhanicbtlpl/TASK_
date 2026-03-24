import React from 'react';
import { Modal, Button, Input } from '../shared/UIComponents';
import { Trash2 } from 'lucide-react';

const TaskModal = ({ 
    isOpen, 
    onClose, 
    editingTask, 
    formData, 
    setFormData, 
    onSubmit, 
    submitting, 
    projects, 
    staff,
    newSubtask,
    setNewSubtask,
    addSubtask,
    removeSubtask,
    toggleSubtask
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingTask ? 'Edit Task' : 'Create Task'}
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <Input
                    label="Task Title"
                    placeholder="e.g., Design UI Mockups"
                    value={formData.taskTitle}
                    onChange={(e) => setFormData({ ...formData, taskTitle: e.target.value })}
                    required
                />

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm min-h-[80px]"
                        placeholder="Task description..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Project</label>
                        <select
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                            value={formData.projectId}
                            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                            required
                        >
                            <option value="">Select Project</option>
                            {projects.map(p => (
                                <option key={p._id} value={p._id}>{p.projectName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Assign To</label>
                        <select
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                            value={formData.assignedTo}
                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                            required
                        >
                            <option value="">Select Staff</option>
                            {staff.map(s => (
                                <option key={s._id} value={s._id}>{s.name} ({s.role?.roleName})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Status</label>
                        <select
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            required
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Priority</label>
                        <select
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                </div>

                <Input
                    label="Due Date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Subtasks</label>
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                            placeholder="Add a subtask..."
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                        />
                        <Button type="button" size="sm" onClick={addSubtask}>Add</Button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto p-1">
                        {formData.subtasks.map((st, idx) => (
                            <div key={idx} className="flex items-center gap-2 group p-2 bg-slate-50 rounded-lg hover:bg-white transition-all border border-transparent hover:border-slate-100">
                                <input 
                                    type="checkbox" 
                                    checked={st.isCompleted} 
                                    onChange={() => toggleSubtask(idx)}
                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className={`text-sm flex-1 ${st.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{st.title}</span>
                                <button type="button" onClick={() => removeSubtask(idx)} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? (editingTask ? 'Updating...' : 'Creating...') : (editingTask ? 'Update Task' : 'Create Task')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TaskModal;
