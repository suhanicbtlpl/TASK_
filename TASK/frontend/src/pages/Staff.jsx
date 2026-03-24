import React, { useState, useEffect, useCallback } from 'react';
import { staffService, roleService } from '../services/api';
import Table from '../components/shared/Table';
import { Card, Button, Input, Modal } from '../components/shared/UIComponents';
import { Plus, Edit2, Trash2, UserPlus } from 'lucide-react';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';
import { useAuth } from '../context/AuthContext';


const Staff = () => {
    const { user } = useAuth();
    const canCreate = user?.role?.permissions?.includes('Staff_CREATE');
    const canUpdate = user?.role?.permissions?.includes('Staff_UPDATE');
    const canDelete = user?.role?.permissions?.includes('Staff_DELETE');

    const [staff, setStaff] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);



    // Pagination & Search State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
        role: '',
    });

    const fetchRoles = async () => {
        try {
            const res = await roleService.getRoles({ limit: 100 });
            setRoles(res.data || []);
            // setRoles(Array.isArray(res.data) ? res.data : []);
            // setRoles(res.data?.data || []);
        } catch (error) {
            console.error('Error fetching roles', error);
            setRoles([]);
        }
    };

    const fetchStaff = useCallback(async () => {
        setLoading(true);
        try {
            const res = await staffService.getStaff({ page, limit, search });
            setStaff(res.data || []);
            setTotalPages(res.pages || 1);
            setTotalRecords(res.total || 0);
        } catch (error) {
            console.error('Error fetching staff', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchStaff();
        fetchRoles();
    }, [fetchStaff]);

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setPage(1);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleOpenModal = (staffMember = null) => {
        if (staffMember) {
            setEditingStaff(staffMember);
            setFormData({
                name: staffMember.name,
                email: staffMember.email,
                password: '',
                mobileNumber: staffMember.mobileNumber,
                role: staffMember.role?._id || '',
            });
        } else {
            setEditingStaff(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                mobileNumber: '',
                role: '',
            });
        }
        setIsModalOpen(true);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         if (editingStaff) {
    //             await staffService.updateStaff(editingStaff._id, formData);
    //         } else {
    //             await staffService.createStaff(formData);
    //         }
    //         setIsModalOpen(false);
    //         fetchStaff();
    //     } catch (error) {
    //         alert(error.response?.data?.message || 'Action failed');
    //     }
    // };

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.role || (!editingStaff && !formData.password)) {
            alert("All required fields must be filled");
            return;
        }

        const payload = {
            name: formData.name,
            email: formData.email,
            mobileNumber: formData.mobileNumber,
            role: formData.role,
        };

        if (formData.password) {
            payload.password = formData.password;
        }

        setSubmitting(true);
        try {
            if (editingStaff) {
                await staffService.updateStaff(editingStaff._id, payload);
            } else {
                await staffService.createStaff(payload);
            }

            setIsModalOpen(false);
            fetchStaff();
        } catch (error) {
            console.error("FULL ERROR:", error);
            alert(error.response?.data?.message || 'Action failed');
        } finally {
            setSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await staffService.deleteStaff(id);
                fetchStaff();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const columns = [
        {
            header: 'Staff Member',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {/* {row.name[0].toUpperCase()} */}
                        {row.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.email}</p>
                    </div>
                </div>
            )
        },
        { header: 'Mobile', accessor: 'mobileNumber' },
        {
            header: 'Role',
            render: (row) => (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                    {row.role?.roleName || 'No Role'}
                </span>
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
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Staff Management</h1>
                    <p className="text-slate-500">Manage your team members and their roles</p>
                </div>
                {canCreate && (
                    <Button onClick={() => handleOpenModal()} className="gap-2">
                        <UserPlus size={18} />
                        Add Staff Member
                    </Button>
                )}
            </div>


            <Card className="p-4">
                <div className="mb-4">
                    <SearchInput onSearch={handleSearch} placeholder="Search staff by name or email..." />
                </div>

                <Table
                    columns={columns}
                    data={staff}
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
                title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email Address"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        type="email"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Mobile Number"
                            placeholder="+1 234 567 890"
                            value={formData.mobileNumber}
                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                            required
                        />
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Role</label>
                            <select
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                required
                            >
                                <option value="">Select Role</option>
                                {/* {roles.map(role => ( */}
                                {Array.isArray(roles) && roles.map(role => (
                                    <option key={role._id} value={role._id}>{role.roleName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {!editingStaff && (
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    )}
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (editingStaff ? 'Updating...' : 'Creating...') : (editingStaff ? 'Update Staff' : 'Create Staff')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Staff;

