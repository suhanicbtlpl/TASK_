import React, { useState, useEffect, useCallback } from 'react';
import { issueService, projectService, taskService, staffService } from '../services/api';
import Table from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import { AlertCircle, Edit2, Trash2, Plus, MessageSquare } from 'lucide-react';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';
import { useAuth } from '../context/AuthContext';

const Issues = () => {
    const { user } = useAuth();
    const canCreate = user?.role?.permissions?.includes('Issue_CREATE');
    const canUpdate = user?.role?.permissions?.includes('Issue_UPDATE');
    const canDelete = user?.role?.permissions?.includes('Issue_DELETE');

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIssue, setEditingIssue] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [staff, setStaff] = useState([]);

    // Pagination & Search State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Open',
        priority: 'Medium',
        projectId: '',
        taskId: '',
        assignedTo: ''
    });

    const fetchIssues = useCallback(async () => {
        setLoading(true);
        try {
            const res = await issueService.getIssues({ page, limit, search });
            setIssues(res.data || []);
            setTotalPages(res.pages || 1);
            setTotalRecords(res.total || 0);
        } catch (error) {
            console.error('Error fetching issues', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    const fetchDropdownData = async () => {
        try {
            const [pRes, sRes] = await Promise.all([
                projectService.getProjects({ limit: 100 }),
                staffService.getStaff({ limit: 100 })
            ]);
            setProjects(pRes.data || []);
            setStaff(sRes.data || []);
        } catch (error) {
            console.error('Error fetching dropdown data', error);
        }
    };

    useEffect(() => {
        fetchIssues();
        fetchDropdownData();
    }, [fetchIssues]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (formData.projectId) {
                try {
                    const res = await taskService.getTasks({ projectId: formData.projectId, limit: 100 });
                    setTasks(res.data || []);
                } catch (error) {
                    console.error('Error fetching tasks', error);
                }
            } else {
                setTasks([]);
            }
        };
        fetchTasks();
    }, [formData.projectId]);

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setPage(1);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleOpenModal = (issue = null) => {
        if (issue) {
            setEditingIssue(issue);
            setFormData({
                title: issue.title || '',
                description: issue.description || '',
                status: issue.status || 'Open',
                priority: issue.priority || 'Medium',
                projectId: issue.projectId?._id || '',
                taskId: issue.taskId?._id || '',
                assignedTo: issue.assignedTo?._id || ''
            });
        } else {
            setEditingIssue(null);
            setFormData({
                title: '',
                description: '',
                status: 'Open',
                priority: 'Medium',
                projectId: '',
                taskId: '',
                assignedTo: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingIssue) {
                await issueService.updateIssue(editingIssue._id, formData);
            } else {
                await issueService.createIssue(formData);
            }
            setIsModalOpen(false);
            fetchIssues();
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Action failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this issue?')) {
            try {
                await issueService.deleteIssue(id);
                fetchIssues();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'Issue Details',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{row.title}</span>
                    <span className="text-xs text-slate-500 truncate max-w-[200px]">{row.description}</span>
                </div>
            )
        },
        {
            header: 'Related To',
            render: (row) => (
                <div className="flex flex-col text-xs">
                    <span className="font-semibold text-slate-700">P: {row.projectId?.projectName}</span>
                    <span className="text-slate-500">T: {row.taskId?.taskTitle || 'N/A'}</span>
                </div>
            )
        },
        {
            header: 'Status & Priority',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit ${
                        row.status === 'Open' ? 'bg-red-100 text-red-600' :
                        row.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                        row.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-slate-100 text-slate-500'
                    }`}>
                        {row.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit ${
                        row.priority === 'Critical' ? 'bg-red-600 text-white' :
                        row.priority === 'High' ? 'bg-red-100 text-red-600' :
                        row.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                        {row.priority}
                    </span>
                </div>
            )
        },
        {
            header: 'Assigned To',
            render: (row) => (
                <div className="text-xs">
                    <p className="font-semibold text-slate-700">{row.assignedTo?.name || 'Unassigned'}</p>
                    <p className="text-slate-400">By {row.reportedBy?.name}</p>
                </div>
            )
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {canUpdate && (
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>
                            <Edit2 size={16} />
                        </Button>
                    )}
                    {canDelete && (
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(row._id)}>
                            <Trash2 size={16} />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Issue Tracking</h1>
                    <p className="text-slate-500">Track and manage project issues</p>
                </div>
                {canCreate && (
                    <Button onClick={() => handleOpenModal()} className="gap-2">
                        <Plus size={18} />
                        Report Issue
                    </Button>
                )}
            </div>

            <Card className="p-4">
                <div className="mb-4">
                    <SearchInput onSearch={handleSearch} placeholder="Search issues..." />
                </div>
                
                <Table
                    columns={columns}
                    data={issues}
                    loading={loading}
                />

                <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={handleLimitChange}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingIssue ? 'Edit Issue' : 'Report Issue'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (editingIssue ? 'Updating...' : 'Reporting...') : (editingIssue ? 'Update Issue' : 'Report Issue')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Issues;
