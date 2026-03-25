import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { staffService, roleService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

import { Card, Button } from '../components/shared/UIComponents';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';

import StaffTable from '../components/staff/StaffTable';
import StaffModal from '../components/staff/StaffModal';

const Staff = () => {
    const { user } = useAuth();
    const { selectedProjectId } = useProject();

    const canCreate = user?.role?.permissions?.includes('Staff_CREATE');
    const canUpdate = user?.role?.permissions?.includes('Staff_UPDATE');
    const canDelete = user?.role?.permissions?.includes('Staff_DELETE');

    const [staff, setStaff] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
        role: ''
    });

    // 👉 Fetch staff
    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await staffService.getStaff({
                page,
                limit,
                search,
                project: selectedProjectId
            });

            setStaff(res.data || []);
            setTotalPages(res.pages || 1);
            setTotalRecords(res.total || 0);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    // 👉 Fetch roles
    const fetchRoles = async () => {
        try {
            const res = await roleService.getRoles();
            setRoles(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [page, limit, search, selectedProjectId]);

    useEffect(() => {
        fetchRoles();
    }, []);

    // 👉 Reset page when project changes
    useEffect(() => {
        setPage(1);
    }, [selectedProjectId]);

    // 👉 Search
    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    // 👉 Change limit
    const handleLimitChange = (value) => {
        setLimit(value);
        setPage(1);
    };

    // 👉 Open modal
    const handleOpenModal = (staff = null) => {
        setEditingStaff(staff);

        if (staff) {
            setFormData({
                name: staff.name,
                email: staff.email,
                password: '',
                mobileNumber: staff.mobileNumber,
                role: staff.role?._id || ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                mobileNumber: '',
                role: ''
            });
        }

        setIsModalOpen(true);
    };

    // 👉 Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = { ...formData };

            // remove empty password on update
            if (editingStaff && !data.password) {
                delete data.password;
            }

            if (editingStaff) {
                await staffService.updateStaff(editingStaff._id, data);
            } else {
                await staffService.createStaff(data);
            }

            setIsModalOpen(false);
            fetchStaff();
        } catch (err) {
            alert("Error");
        }
    };

    // 👉 Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this staff?")) return;

        await staffService.deleteStaff(id);
        fetchStaff();
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Staff</h1>
                    <p className="text-gray-500">Manage staff members</p>
                </div>

                {canCreate && (
                    <Button onClick={() => handleOpenModal()}>
                        <UserPlus size={16} /> Add
                    </Button>
                )}
            </div>

            {/* Table */}
            <Card className="p-4">

                <SearchInput onSearch={handleSearch} />

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

            {/* Modal */}
            <StaffModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingStaff={editingStaff}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                roles={roles}
            />
        </div>
    );
};

export default Staff;