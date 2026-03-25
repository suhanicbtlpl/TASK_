import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { taskService, projectService, staffService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

import { Card, Button } from '../components/shared/UIComponents';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';

import TaskTable from '../components/tasks/TaskTable';
import TaskModal from '../components/tasks/TaskModal';

const Tasks = () => {
    const { user } = useAuth();
    const { selectedProjectId } = useProject();
    const canCreate = user?.role?.permissions?.includes('Task_CREATE');
    const canUpdate = user?.role?.permissions?.includes('Task_UPDATE');
    const canDelete = user?.role?.permissions?.includes('Task_DELETE');

    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
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
            console.error('Error fetching dropdown data:', error);
        }
    };

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit, search };
            if (selectedProjectId) params.projectId = selectedProjectId;

            const res = await taskService.getTasks(params);
            setTasks(res.data || []);
            setTotalPages(res.pages || 1);
            setTotalRecords(res.total || 0);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, selectedProjectId]);

    useEffect(() => {
        fetchTasks();
        fetchDropdownData();
    }, [fetchTasks]);

    useEffect(() => {
        setPage(1);
    }, [selectedProjectId]);

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
                projectId: selectedProjectId || '',
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tasks</h1>
                    <p className="text-slate-500">Track and manage task progress across projects</p>
                </div>
                <div className="flex gap-3">
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
                
                <TaskTable
                    tasks={tasks}
                    loading={loading}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    getStatusColor={getStatusColor}
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

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingTask={editingTask}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                submitting={submitting}
                projects={projects}
                staff={staff}
                newSubtask={newSubtask}
                setNewSubtask={setNewSubtask}
                addSubtask={addSubtask}
                removeSubtask={removeSubtask}
                toggleSubtask={toggleSubtask}
            />
        </div>
    );
};

export default Tasks;
