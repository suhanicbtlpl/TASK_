import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import { roleService, permissionService } from '../services/api';
import { useAuth } from '../context/AuthContext';

import { Card, Button } from '../components/shared/UIComponents';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';

import RoleTable from '../components/roles/RoleTable';
import RoleModal from '../components/roles/RoleModal';

const Roles = () => {
    const { user } = useAuth();
    
    // Admin fallback
    const isAdmin = user?.role?.roleName === 'Admin';
    const permissions = user?.role?.permissions || [];
    
    const canCreate = isAdmin || permissions.includes('Role_CREATE') || permissions.includes('Roles_CREATE');
    const canUpdate = isAdmin || permissions.includes('Role_UPDATE') || permissions.includes('Roles_UPDATE');
    const canDelete = isAdmin || permissions.includes('Role_DELETE') || permissions.includes('Roles_DELETE');

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    
    // Pagination & Search State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [formData, setFormData] = useState({
        roleName: '',
        status: 'active',
        permissions: [],
    });

    const fetchPermissions = async () => {
        try {
            const res = await permissionService.getPermissions({ limit: 100 });
            setAvailablePermissions(res.data || []);
        } catch (error) {
            console.error('Error fetching permissions:', error);
            setAvailablePermissions([]);
        }
    };

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        try {
            const res = await roleService.getRoles({ page, limit, search });
            setRoles(res.data || []);
            setTotalPages(res.pages || 1);
            setTotalRecords(res.total || 0);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, [fetchRoles]);

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setPage(1);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleOpenModal = (role = null) => {
        if (role) {
            setEditingRole(role);
            const mappedPermissions = role.permissions.map(p => ({
                permission: p.permission?._id || p.permission,
                actions: p.actions || { create: false, read: false, update: false, delete: false }
            }));
            setFormData({
                roleName: role.roleName,
                status: role.status,
                permissions: mappedPermissions,
            });
        } else {
            setEditingRole(null);
            setFormData({
                roleName: '',
                status: 'active',
                permissions: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleActionToggle = (permId, action) => {
        const existingIndex = formData.permissions.findIndex(p => p.permission === permId);
        let newPermissions = [...formData.permissions];

        if (existingIndex > -1) {
            const updatedAction = !newPermissions[existingIndex].actions[action];
            newPermissions[existingIndex] = {
                ...newPermissions[existingIndex],
                actions: { ...newPermissions[existingIndex].actions, [action]: updatedAction }
            };
        } else {
            newPermissions.push({
                permission: permId,
                actions: {
                    create: action === 'create',
                    read: action === 'read',
                    update: action === 'update',
                    delete: action === 'delete'
                }
            });
        }
        setFormData({ ...formData, permissions: newPermissions });
    };

    const isActionChecked = (permId, action) => {
        const perm = formData.permissions.find(p => p.permission === permId);
        return perm ? perm.actions[action] : false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingRole) {
                await roleService.updateRole(editingRole._id, formData);
            } else {
                await roleService.createRole(formData);
            }
            setIsModalOpen(false);
            fetchRoles();
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Action failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteRole = async (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            try {
                await roleService.deleteRole(id);
                fetchRoles();
            } catch (error) {
                alert('Error deleting role');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Roles</h1>
                    <p className="text-slate-500">Define action-based access levels per module</p>
                </div>
                {canCreate && (
                    <Button onClick={() => handleOpenModal()} className="gap-2">
                        <ShieldCheck size={18} />
                        New Role
                    </Button>
                )}
            </div>

            <Card className="p-4">
                <div className="mb-4">
                    <SearchInput onSearch={handleSearch} placeholder="Search roles..." />
                </div>
                
                <RoleTable
                    roles={roles}
                    loading={loading}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteRole}
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

            <RoleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingRole={editingRole}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                submitting={submitting}
                availablePermissions={availablePermissions}
                isActionChecked={isActionChecked}
                onActionToggle={handleActionToggle}
            />
        </div>
    );
};

export default Roles;

