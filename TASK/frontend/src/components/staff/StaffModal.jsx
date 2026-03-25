import React from 'react';
import { Modal, Button, Input } from '../shared/UIComponents';

const StaffModal = ({
    isOpen,
    onClose,
    editingStaff,
    formData,
    setFormData,
    onSubmit,
    submitting,
    roles
}) => {

    // 👉 common change handler
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingStaff ? 'Edit Staff' : 'Add Staff'}
        >
            <form onSubmit={onSubmit} className="space-y-4">

                {/* Name */}
                <Input
                    label="Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                />

                {/* Email */}
                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                />

                {/* Mobile + Role */}
                <div className="grid grid-cols-2 gap-4">

                    <Input
                        label="Mobile"
                        value={formData.mobileNumber}
                        onChange={(e) => handleChange('mobileNumber', e.target.value)}
                        required
                    />

                    <select
                        value={formData.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    >
                        <option value="">Select Role</option>
                        {roles?.map(r => (
                            <option key={r._id} value={r._id}>
                                {r.roleName}
                            </option>
                        ))}
                    </select>

                </div>

                {/* Password (only when creating) */}
                {!editingStaff && (
                    <Input
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
                    />
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>

                    <Button type="submit" disabled={submitting}>
                        {editingStaff ? 'Update' : 'Create'}
                    </Button>
                </div>

            </form>
        </Modal>
    );
};

export default StaffModal;  