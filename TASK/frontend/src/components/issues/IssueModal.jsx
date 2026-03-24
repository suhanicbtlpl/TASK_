import React from 'react';
import { Modal, Button, Input } from '../shared/UIComponents';

const IssueModal = ({
    isOpen,
    onClose,
    editingIssue,
    formData,
    setFormData,
    onSubmit,
    submitting,
    projects,
    tasks,
    staff
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingIssue ? 'Edit Issue' : 'Report Issue'}
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <Input
                    label="Issue Title"
                    placeholder="e.g., Login button not working"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Project</label>
                        <select 
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
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
                        <label className="text-sm font-semibold text-slate-700">Task (Optional)</label>
                        <select 
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                            value={formData.taskId}
                            onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                            disabled={!formData.projectId}
                        >
                            <option value="">Select Task</option>
                            {tasks.map(t => (
                                <option key={t._id} value={t._id}>{t.taskTitle}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Status</label>
                        <select 
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Priority</label>
                        <select 
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
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

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Assigned To</label>
                    <select 
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    >
                        <option value="">Unassigned</option>
                        {staff.map(s => (
                            <option key={s._id} value={s._id}>{s.name} ({s.role?.roleName})</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm min-h-[100px]"
                        placeholder="Detailed description of the issue..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? (editingIssue ? 'Updating...' : 'Reporting...') : (editingIssue ? 'Update Issue' : 'Report Issue')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default IssueModal;
