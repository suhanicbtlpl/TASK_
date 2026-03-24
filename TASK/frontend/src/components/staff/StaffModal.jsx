import React from 'react';
import { Modal, Button, Input } from '../shared/UIComponents';

const StaffModal = ({ isOpen, onClose, editingStaff, formData, setFormData, onSubmit, submitting, roles }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        >
            <form onSubmit={onSubmit} className="space-y-4">
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
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? (editingStaff ? 'Updating...' : 'Creating...') : (editingStaff ? 'Update StaffToken' : 'Create StaffMember')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default StaffModal;
