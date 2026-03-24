import React from 'react';
import { Modal, Button, Input } from '../shared/UIComponents';
import { Users } from 'lucide-react';

const ProjectModal = ({
    isOpen,
    onClose,
    editingProject,
    formData,
    setFormData,
    onSubmit,
    submitting,
    staff,
    onStaffToggle
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingProject ? 'Edit Project' : 'Create Project'}
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Project Name"
                        placeholder="e.g., E-commerce Redesign"
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        required
                    />
                    <Input
                        label="Client Name"
                        placeholder="e.g., Acme Corp"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                    />
                    <Input
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-700">Status</label>
                        <select 
                            className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
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
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Project Manager</label>
                    <select 
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                        value={formData.projectManager}
                        onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
                        required
                    >
                        <option value="">Select Manager</option>
                        {staff.map(s => (
                            <option key={s._id} value={s._id}>{s.name} ({s.role?.roleName})</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm min-h-[80px]"
                        placeholder="Brief project overview..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Users size={16} />
                        Team Members
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-100">
                        {staff.map(s => (
                            <label key={s._id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.assignedStaff.includes(s._id)}
                                    onChange={() => onStaffToggle(s._id)}
                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                                />
                                <div className="overflow-hidden">
                                    <p className="text-xs font-medium text-slate-700 truncate">{s.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{s.role?.roleName}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? (editingProject ? 'Updating...' : 'Creating...') : (editingProject ? 'Update Project' : 'Create Project')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ProjectModal;
