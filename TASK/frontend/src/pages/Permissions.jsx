import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { permissionService } from '../services/api';
import { useAuth } from '../context/AuthContext';

import { Button, Card } from '../components/shared/UIComponents';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';

import PermissionTable from '../components/permissions/PermissionTable';
import PermissionModal from '../components/permissions/PermissionModal';

const Permissions = () => {
    const { user } = useAuth();
    const canCreate = user?.role?.permissions?.includes('Permission_CREATE');
    const canUpdate = user?.role?.permissions?.includes('Permission_UPDATE');
    const canDelete = user?.role?.permissions?.includes('Permission_DELETE');

    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Pagination & Search State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [formData, setFormData] = useState({
        permissionName: ''
    });

    const fetchPermissions = useCallback(async () => {
        try {
            setLoading(true);
            const res = await permissionService.getPermissions({ page, limit, search });
            setPermissions(res.data || []);
            setTotalPages(res.pages || 1);
            setTotalRecords(res.total || 0);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setPage(1);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleOpenModal = (permission = null) => {
        if (permission) {
            setEditingPermission(permission);
            setFormData({ permissionName: permission.permissionName });
        } else {
            setEditingPermission(null);
            setFormData({ permissionName: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingPermission) {
                await permissionService.updatePermission(editingPermission._id, formData);
            } else {
                await permissionService.createPermission(formData);
            }
            setIsModalOpen(false);
            fetchPermissions();
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Error saving permission');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this permission?')) {
            try {
                await permissionService.deletePermission(id);
                fetchPermissions();
            } catch (error) {
                alert('Error deleting permission');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Permissions</h1>
                    <p className="text-slate-500">Manage dynamic system modules</p>
                </div>
                {canCreate && (
                    <Button onClick={() => handleOpenModal()} className="gap-2">
                        <Plus size={18} />
                        Add Permission
                    </Button>
                )}
            </div>

            <Card className="p-4">
                <div className="mb-4">
                    <SearchInput onSearch={handleSearch} placeholder="Search modules..." />
                </div>
                
                <PermissionTable 
                    permissions={permissions} 
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

            <PermissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingPermission={editingPermission}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                submitting={submitting}
            />
        </div>
    );
};

export default Permissions;
