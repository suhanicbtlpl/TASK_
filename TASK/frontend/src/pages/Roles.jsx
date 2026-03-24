import React, { useState, useEffect, useCallback } from 'react';
import { roleService, permissionService } from '../services/api';
import Table from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import { ShieldCheck, Edit2, Trash2, Plus } from 'lucide-react';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';
import { useAuth } from '../context/AuthContext';


const Roles = () => {
    const { user } = useAuth();
    
    // Robust permission checks with Admin fallback
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
        permissions: [], // Array of { permission: id, actions: { create, read, update, delete } }
    });

    const fetchPermissions = async () => {
        try {
            const res = await permissionService.getPermissions({ limit: 100 });
            setAvailablePermissions(res.data || []);
        } catch (error) {
            console.error('Error fetching permissions', error);
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
            console.error('Error fetching roles', error);
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
            // Map the populated backend response to the format needed for the form
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
                actions: {
                    ...newPermissions[existingIndex].actions,
                    [action]: updatedAction
                }
            };
            
            // If all actions are unchecked, we could keep it or remove it. 
            // Let's keep it to allow specifically unchecking everything.
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

    const columns = [
        { header: 'Role Name', accessor: 'roleName' },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${row.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
            )
        },
        {
            header: 'Permissions Mapping',
            render: (row) => (
                <div className="flex flex-wrap gap-1 max-w-sm">
                    {row.permissions.slice(0, 3).map((p, idx) => (
                        <div key={idx} className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 text-[10px] rounded text-slate-600 border border-slate-200">
                            <span className="font-bold">{p.permission?.permissionName}:</span>
                            <span className="text-slate-400">
                                {[
                                    p.actions.create && 'C',
                                    p.actions.read && 'R',
                                    p.actions.update && 'U',
                                    p.actions.delete && 'D'
                                ].filter(Boolean).join(',')}
                            </span>
                        </div>
                    ))}
                    {row.permissions.length > 3 && (
                        <span className="text-[10px] text-slate-400 mt-1">+{row.permissions.length - 3} more</span>
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
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteRole(row._id)}>
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
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Roles & Permissions</h1>
                    <p className="text-slate-500">Define action-based access levels per module</p>
                </div>
                {canCreate && (
                    <Button onClick={() => handleOpenModal()} className="gap-2">
                        <ShieldCheck size={18} />
                        Create New Role
                    </Button>
                )}
            </div>


            <Card className="p-4">
                <div className="mb-4">
                    <SearchInput onSearch={handleSearch} placeholder="Search roles..." />
                </div>
                
                <Table
                    columns={columns}
                    data={roles}
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
                title={editingRole ? 'Edit Role Permissions' : 'Create Role & Permissions'}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Role Name"
                        placeholder="e.g., Project Manager"
                        value={formData.roleName}
                        onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                        required
                    />

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700">Permissions Matrix</label>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Module</th>
                                        <th className="px-2 py-2 text-center font-semibold text-slate-600">CREATE</th>
                                        <th className="px-2 py-2 text-center font-semibold text-slate-600">READ</th>
                                        <th className="px-2 py-2 text-center font-semibold text-slate-600">UPDATE</th>
                                        <th className="px-2 py-2 text-center font-semibold text-slate-600">DELETE</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {availablePermissions.length > 0 ? availablePermissions.map(perm => (
                                        <tr key={perm._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-700">{perm.permissionName}</td>
                                            {['create', 'read', 'update', 'delete'].map(action => (
                                                <td key={action} className="px-2 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isActionChecked(perm._id, action)}
                                                        onChange={() => handleActionToggle(perm._id, action)}
                                                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-slate-400 italic">
                                                No modules found. Add them in the Permission module.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <label className="text-sm font-semibold text-slate-700">Role Status</label>
                        <div className="flex gap-4">
                            {['active', 'inactive'].map(s => (
                                <label key={s} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={s}
                                        checked={formData.status === s}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-slate-600 capitalize">{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-8">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (editingRole ? 'Updating...' : 'Creating...') : (editingRole ? 'Update Role' : 'Create Role')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};


export default Roles;

