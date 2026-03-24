import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Table from '../shared/Table';
import { Button } from '../shared/UIComponents';

const RoleTable = ({ roles, loading, canUpdate, canDelete, onEdit, onDelete }) => {
    const columns = [
        { header: 'Role Name', accessor: 'roleName' },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    row.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
            )
        },
        {
            header: 'Module Permissions',
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

    return <Table columns={columns} data={roles} loading={loading} />;
};

export default RoleTable;
