import React, { useState, useEffect, useCallback } from 'react';
import { projectService, staffService } from '../services/api';
import Table from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import { Briefcase, Edit2, Trash2, Plus, Users } from 'lucide-react';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';
import { useAuth } from '../context/AuthContext';
import Timeline from '../components/Timeline';

const Projects = () => {
    const { user } = useAuth();
    const [view, setView] = useState('list'); // 'list' or 'timeline'
    const canCreate = user?.role?.permissions?.includes('Project_CREATE');
    const canUpdate = user?.role?.permissions?.includes('Project_UPDATE');
    const canDelete = user?.role?.permissions?.includes('Project_DELETE');

    const [projects, setProjects] = useState([]);

    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Pagination & Search State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [formData, setFormData] = useState({
        projectName: '',
        clientName: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Active',
        priority: 'Medium',
        projectManager: '',
        assignedStaff: [],
    });

    const fetchStaff = async () => {
        try {
            const res = await staffService.getStaff({ limit: 100 });
            setStaff(res.data || []);
        } catch (error) {
            console.error('Error fetching staff', error);
            setStaff([]);
        }
    };

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const res = await projectService.getProjects({ page, limit, search });
            setProjects(res.data || []);
            setTotalPages(res.pages || 1);
            setTotalRecords(res.total || 0);
        } catch (error) {
            console.error('Error fetching projects', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchProjects();
        fetchStaff();
    }, [fetchProjects]);

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setPage(1);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleOpenModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                projectName: project.projectName || '',
                clientName: project.clientName || '',
                description: project.description || '',
                startDate: project.startDate ? project.startDate.split('T')[0] : '',
                endDate: project.endDate ? project.endDate.split('T')[0] : '',
                status: project.status || 'Active',
                priority: project.priority || 'Medium',
                projectManager: project.projectManager?._id || '',
                assignedStaff: project.assignedStaff?.map(s => s._id) || [],
            });
        } else {
            setEditingProject(null);
            setFormData({
                projectName: '',
                clientName: '',
                description: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                status: 'Active',
                priority: 'Medium',
                projectManager: '',
                assignedStaff: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleStaffToggle = (staffId) => {
        const updatedStaff = formData.assignedStaff.includes(staffId)
            ? formData.assignedStaff.filter(id => id !== staffId)
            : [...formData.assignedStaff, staffId];
        setFormData({ ...formData, assignedStaff: updatedStaff });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingProject) {
                await projectService.updateProject(editingProject._id, formData);
            } else {
                await projectService.createProject(formData);
            }
            setIsModalOpen(false);
            fetchProjects();
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Action failed');
        } finally {
            setSubmitting(false);
        }
    };


    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.deleteProject(id);
                fetchProjects();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'Project Details',
            render: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{row.projectName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            row.priority === 'High' ? 'bg-red-100 text-red-600' :
                            row.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                            'bg-blue-100 text-blue-600'
                        }`}>
                            {row.priority}
                        </span>
                    </div>
                    <span className="text-xs text-slate-500">Client: {row.clientName}</span>
                </div>
            )
        },
        {
            header: 'Manager',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {row.projectManager?.name?.[0].toUpperCase() || '?'}
                    </div>
                    <span className="text-sm text-slate-700">{row.projectManager?.name || 'Unassigned'}</span>
                </div>
            )
        },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    row.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    row.status === 'On Hold' ? 'bg-amber-100 text-amber-700' :
                    'bg-primary-100 text-primary-700'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Timeline',
            render: (row) => (
                <div className="text-xs text-slate-500">
                    <div>{new Date(row.startDate).toLocaleDateString()}</div>
                    {row.endDate && <div>to {new Date(row.endDate).toLocaleDateString()}</div>}
                </div>
            )
        },
        {
            header: 'Team',
            render: (row) => (
                <div className="flex -space-x-2 overflow-hidden">
                    {row.assignedStaff?.slice(0, 3).map((s, i) => (
                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600" title={s.name}>
                            {s.name[0].toUpperCase()}
                        </div>
                    ))}
                    {(row.assignedStaff?.length > 3) && (
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                            +{row.assignedStaff.length - 3}
                        </div>
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
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Project Management</h1>
                    <p className="text-slate-500">Organize projects and assign team members</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                        <button 
                            onClick={() => setView('list')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'list' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            List View
                        </button>
                        <button 
                            onClick={() => setView('timeline')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'timeline' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            Timeline
                        </button>
                    </div>
                    {canCreate && (
                        <Button onClick={() => handleOpenModal()} className="gap-2">
                            <Plus size={18} />
                            New Project
                        </Button>
                    )}
                </div>
            </div>


            {view === 'list' ? (
                <Card className="p-4">
                    <div className="mb-4">
                        <SearchInput onSearch={handleSearch} placeholder="Search projects..." />
                    </div>
                    
                    <Table
                        columns={columns}
                        data={projects}
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
            ) : (
                <Timeline projects={projects} />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProject ? 'Edit Project' : 'Create Project'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
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
                                        onChange={() => handleStaffToggle(s._id)}
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
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (editingProject ? 'Updating...' : 'Creating...') : (editingProject ? 'Update Project' : 'Create Project')}
                        </Button>
                    </div>
                </form>

            </Modal>
        </div>
    );
};

export default Projects;

