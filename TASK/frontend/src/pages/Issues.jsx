import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { issueService, projectService, taskService, staffService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

import { Card, Button } from '../components/shared/UIComponents';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';

import IssueTable from '../components/issues/IssueTable';
import IssueModal from '../components/issues/IssueModal';

const Issues = () => {
    const { user } = useAuth();
    const { selectedProjectId } = useProject();
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
            const params = { page, limit, search };
            if (selectedProjectId) params.projectId = selectedProjectId;
            const res = await issueService.getIssues(params);
            setIssues(res.data || []);
            setTotalPages(res.pages || 1);
            setTotalRecords(res.total || 0);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, selectedProjectId]);

    const fetchDropdownData = async () => {
        try {
            const [pRes, sRes] = await Promise.all([
                projectService.getProjects({ limit: 100 }),
                staffService.getStaff({ limit: 100 })
            ]);
            setProjects(pRes.data || []);
            setStaff(sRes.data || []);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    useEffect(() => {
        fetchIssues();
        fetchDropdownData();
    }, [fetchIssues]);

    useEffect(() => {
        setPage(1);
    }, [selectedProjectId]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (formData.projectId) {
                try {
                    const res = await taskService.getTasks({ projectId: formData.projectId, limit: 100 });
                    setTasks(res.data || []);
                } catch (error) {
                    console.error('Error fetching tasks:', error);
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
                projectId: selectedProjectId || '',
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Issues</h1>
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
                
                <IssueTable
                    issues={issues}
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

            <IssueModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingIssue={editingIssue}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                submitting={submitting}
                projects={projects}
                tasks={tasks}
                staff={staff}
            />
        </div>
    );
};

export default Issues;
