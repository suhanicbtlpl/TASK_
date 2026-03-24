import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus } from 'lucide-react';
import { staffService, roleService } from '../services/api';
import { useAuth } from '../context/AuthContext';

import { Card, Button } from '../components/shared/UIComponents';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';

import StaffTable from '../components/staff/StaffTable';
import StaffModal from '../components/staff/StaffModal';

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
    const [submitting, setSubmitting] = useState(false);

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
        } catch (error) {
            console.error('Error fetching roles:', error);
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
            console.error('Error fetching staff:', error);
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
            setFormData({ name: '', email: '', password: '', mobileNumber: '', role: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...formData };
            if (editingStaff && !payload.password) delete payload.password;

            if (editingStaff) {
                await staffService.updateStaff(editingStaff._id, payload);
            } else {
                await staffService.createStaff(payload);
            }

            setIsModalOpen(false);
            fetchStaff();
        } catch (error) {
            alert(error.response?.data?.message || 'Error processing request');
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Staff Management</h1>
                    <p className="text-slate-500">Manage your team members and their roles</p>
                </div>
                {canCreate && (
                    <Button onClick={() => handleOpenModal()} className="gap-2">
                        <UserPlus size={18} />
                        Add Member
                    </Button>
                )}
            </div>

            <Card className="p-4 border-slate-200 shadow-sm">
                <div className="mb-4">
                    <SearchInput onSearch={handleSearch} placeholder="Search staff members..." />
                </div>

                <StaffTable
                    staff={staff}
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

            <StaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingStaff={editingStaff}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                submitting={submitting}
                roles={roles}
            />
        </div>
    );
};

export default Staff;
