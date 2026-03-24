import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Table from '../shared/Table';
import { Button } from '../shared/UIComponents';

const PermissionTable = ({ permissions, loading, canUpdate, canDelete, onEdit, onDelete }) => {
    const columns = [
        { header: 'Permission Name', accessor: 'permissionName' },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    {canUpdate && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                            <Edit2 size={16} />
                        </Button>
                    )}
                    {canDelete && (
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => onDelete(row._id)}>
                            <Trash2 size={16} />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return <Table columns={columns} data={permissions} loading={loading} />;
};

export default PermissionTable;
