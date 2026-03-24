import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Table from '../shared/Table';
import { Button } from '../shared/UIComponents';

const StaffTable = ({ staff, loading, canUpdate, canDelete, onEdit, onDelete }) => {
    const columns = [
        {
            header: 'Staff Member',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
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
                        <Button variant="ghost" size="sm" onClick={() => onEdit(row)}>
                            <Edit2 size={16} />
                        </Button>
                    )}
                    {canDelete && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:bg-red-50" 
                            onClick={() => onDelete(row._id)}
                        >
                            <Trash2 size={16} />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return <Table columns={columns} data={staff} loading={loading} />;
};

export default StaffTable;
