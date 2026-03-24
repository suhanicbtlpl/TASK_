import React from 'react';
import { Button, Input, Modal } from '../shared/UIComponents';

const PermissionModal = ({
    isOpen,
    onClose,
    editingPermission,
    formData,
    setFormData,
    onSubmit,
    submitting
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingPermission ? 'Edit Permission' : 'Add New Permission'}
        >
            <form onSubmit={onSubmit} className="space-y-4">
                <Input
                    label="Permission Name"
                    placeholder="e.g. Staff or Project"
                    value={formData.permissionName}
                    onChange={(e) => setFormData({ ...formData, permissionName: e.target.value })}
                    required
                />
                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? (editingPermission ? 'Updating...' : 'Creating...') : (editingPermission ? 'Update' : 'Create') + ' Permission'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default PermissionModal;
