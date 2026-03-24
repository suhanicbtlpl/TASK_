import React, { useState, useEffect, useCallback } from 'react';
import { taskService, projectService, staffService } from '../services/api';
import Table from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import { CheckSquare, Edit2, Trash2, Plus, Filter } from 'lucide-react';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';
import { useAuth } from '../context/AuthContext';


const Tasks = () => {
    const { user } = useAuth();
    const canCreate = user?.role?.permissions?.includes('Task_CREATE');
    const canUpdate = user?.role?.permissions?.includes('Task_UPDATE');
    const canDelete = user?.role?.permissions?.includes('Task_DELETE');

    const [tasks, setTasks] = useState([]);

    const [projects, setProjects] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filterProject, setFilterProject] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    // Pagination & Search State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [formData, setFormData] = useState({
        taskTitle: '',
        description: '',
        projectId: '',
        assignedTo: '',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '',
        subtasks: []
    });

    const [newSubtask, setNewSubtask] = useState('');

    const fetchDropdownData = async () => {
        try {
            const [projectsRes, staffRes] = await Promise.all([
                projectService.getProjects({ limit: 100 }),
                staffService.getStaff({ limit: 100 })
            ]);
            setProjects(projectsRes.data || []);
            setStaff(staffRes.data || []);
        } catch (error) {
            console.error('Error fetching dropdown data', error);
        }
    };

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit, search };
            if (filterProject) params.projectId = filterProject;

            const res = await taskService.getTasks(params);
            setTasks(res.data || []);
            setTotalPages(res.pages || 1);
            setTotalRecords(res.total || 0);
        } catch (error) {
            console.error('Error fetching tasks', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, filterProject]);

    useEffect(() => {
        fetchTasks();
        fetchDropdownData();
    }, [fetchTasks]);

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setPage(1);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleOpenModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setFormData({
                taskTitle: task.taskTitle || '',
                description: task.description || '',
                projectId: task.projectId?._id || '',
                assignedTo: task.assignedTo?._id || '',
                status: task.status || 'To Do',
                priority: task.priority || 'Medium',
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                subtasks: task.subtasks || []
            });
        } else {
            setEditingTask(null);
            setFormData({
                taskTitle: '',
                description: '',
                projectId: filterProject || '',
                assignedTo: '',
                status: 'To Do',
                priority: 'Medium',
                dueDate: '',
                subtasks: []
            });
        }
        setIsModalOpen(true);
    };

    const addSubtask = () => {
        if (!newSubtask.trim()) return;
        setFormData({
            ...formData,
            subtasks: [...formData.subtasks, { title: newSubtask, isCompleted: false }]
        });
        setNewSubtask('');
    };

    const removeSubtask = (index) => {
        setFormData({
            ...formData,
            subtasks: formData.subtasks.filter((_, i) => i !== index)
        });
    };

    const toggleSubtask = (index) => {
        const updated = [...formData.subtasks];
        updated[index].isCompleted = !updated[index].isCompleted;
        setFormData({ ...formData, subtasks: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingTask) {
                await taskService.updateTask(editingTask._id, formData);
            } else {
                await taskService.createTask(formData);
            }
            setIsModalOpen(false);
            fetchTasks();
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Action failed');
        } finally {
            setSubmitting(false);
        }
    };


    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'To Do': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Review': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const columns = [
        {
            header: 'Task & Subtasks',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{row.taskTitle}</span>
                    {row.subtasks?.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 max-w-[100px] h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 transition-all" 
                                    style={{ width: `${(row.subtasks.filter(s => s.isCompleted).length / row.subtasks.length) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                                {row.subtasks.filter(s => s.isCompleted).length}/{row.subtasks.length}
                            </span>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Project & Priority',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {row.projectId?.projectName || 'No Project'}
                    </span>
                    <span className={`text-[10px] font-bold mt-0.5 ${
                        row.priority === 'Critical' ? 'text-red-600' :
                        row.priority === 'High' ? 'text-amber-600' :
                        row.priority === 'Medium' ? 'text-blue-600' :
                        'text-slate-500'
                    }`}>
                        {row.priority} Priority
                    </span>
                </div>
            )
        },
        {
            header: 'Assigned To',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-[10px] font-bold border border-primary-100 overflow-hidden">
                        {row.assignedTo?.profilePhoto ? (
                             <img src={`http://localhost:5000${row.assignedTo.profilePhoto}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                            row.assignedTo?.name?.[0].toUpperCase() || '?'
                        )}
                    </div>
                    <span className="text-sm text-slate-700 font-medium">{row.assignedTo?.name || 'Unassigned'}</span>
                </div>
            )
        },
        {
            header: 'Status & Due',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border w-fit ${getStatusColor(row.status)}`}>
                        {row.status}
                    </span>
                    {row.dueDate && (
                        <span className={`text-[10px] ${new Date(row.dueDate) < new Date() && row.status !== 'Completed' ? 'text-red-500 font-bold' : 'text-slate-400 font-medium'}`}>
                            {new Date(row.dueDate).toLocaleDateString()}
                        </span>
                    )}
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
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Task Management</h1>
                    <p className="text-slate-500">Track and manage task progress across projects</p>
                </div>
                <div className="flex gap-3">
                    <select
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary-500 text-sm"
                        value={filterProject}
                        onChange={(e) => {
                            setFilterProject(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">All Projects</option>
                        {projects.map(p => (
                            <option key={p._id} value={p._id}>{p.projectName}</option>
                        ))}
                    </select>
                    {canCreate && (
                        <Button onClick={() => handleOpenModal()} className="gap-2">
                            <Plus size={18} />
                            Add Task
                        </Button>
                    )}
                </div>
            </div>


            <Card className="p-4">
                <div className="mb-4">
                    <SearchInput onSearch={handleSearch} placeholder="Search tasks..." />
                </div>
                
                <Table
                    columns={columns}
                    data={tasks}
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
                title={editingTask ? 'Edit Task' : 'Create Task'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Task Title"
                        placeholder="e.g., Design UI Mockups"
                        value={formData.taskTitle}
                        onChange={(e) => setFormData({ ...formData, taskTitle: e.target.value })}
                        required
                    />

                    <textarea 
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm min-h-[80px]"
                        placeholder="Task description..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

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
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (editingTask ? 'Updating...' : 'Creating...') : (editingTask ? 'Update Task' : 'Create Task')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Tasks;
