import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { projectService, staffService } from '../services/api';
import { useAuth } from '../context/AuthContext';

import { Card, Button } from '../components/shared/UIComponents';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';
import Timeline from '../components/Timeline';

import ProjectTable from '../components/projects/ProjectTable';
import ProjectModal from '../components/projects/ProjectModal';

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
            console.error('Error fetching staff:', error);
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
            console.error('Error fetching projects:', error);
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Projects</h1>
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
                    
                    <ProjectTable
                        projects={projects}
                        loading={loading}
                        canUpdate={canUpdate}
                        canDelete={canDelete}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
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

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingProject={editingProject}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                submitting={submitting}
                staff={staff}
                onStaffToggle={handleStaffToggle}
            />
        </div>
    );
};

export default Projects;

