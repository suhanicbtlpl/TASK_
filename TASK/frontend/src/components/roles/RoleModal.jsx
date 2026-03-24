import React from 'react';
import { Modal, Button, Input } from '../shared/UIComponents';

const RoleModal = ({
    isOpen,
    onClose,
    editingRole,
    formData,
    setFormData,
    onSubmit,
    submitting,
    availablePermissions,
    isActionChecked,
    onActionToggle
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingRole ? 'Edit Role Permissions' : 'Create Role & Permissions'}
            maxWidth="max-w-2xl"
        >
            <form onSubmit={onSubmit} className="space-y-6">
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
                                    <th className="px-2 py-2 text-center font-semibold text-slate-600 text-[10px]">CREATE</th>
                                    <th className="px-2 py-2 text-center font-semibold text-slate-600 text-[10px]">READ</th>
                                    <th className="px-2 py-2 text-center font-semibold text-slate-600 text-[10px]">UPDATE</th>
                                    <th className="px-2 py-2 text-center font-semibold text-slate-600 text-[10px]">DELETE</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white text-xs">
                                {availablePermissions.length > 0 ? availablePermissions.map(perm => (
                                    <tr key={perm._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-2.5 font-medium text-slate-700">{perm.permissionName}</td>
                                        {['create', 'read', 'update', 'delete'].map(action => (
                                            <td key={action} className="px-2 py-2.5 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isActionChecked(perm._id, action)}
                                                    onChange={() => onActionToggle(perm._id, action)}
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
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? (editingRole ? 'Updating...' : 'Creating...') : (editingRole ? 'Update Role' : 'Create Role')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default RoleModal;
