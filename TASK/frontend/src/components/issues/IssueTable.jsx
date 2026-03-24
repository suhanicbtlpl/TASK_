import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Table from '../shared/Table';
import { Button } from '../shared/UIComponents';

const IssueTable = ({ issues, loading, canUpdate, canDelete, onEdit, onDelete }) => {
    const columns = [
        {
            header: 'Issue Details',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{row.title}</span>
                    <span className="text-xs text-slate-500 truncate max-w-[200px]">{row.description}</span>
                </div>
            )
        },
        {
            header: 'Related To',
            render: (row) => (
                <div className="flex flex-col text-xs">
                    <span className="font-semibold text-slate-700">P: {row.projectId?.projectName}</span>
                    <span className="text-slate-500">T: {row.taskId?.taskTitle || 'N/A'}</span>
                </div>
            )
        },
        {
            header: 'Status & Priority',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit ${
                        row.status === 'Open' ? 'bg-red-100 text-red-600' :
                        row.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                        row.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-slate-100 text-slate-500'
                    }`}>
                        {row.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit ${
                        row.priority === 'Critical' ? 'bg-red-600 text-white' :
                        row.priority === 'High' ? 'bg-red-100 text-red-600' :
                        row.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                        {row.priority}
                    </span>
                </div>
            )
        },
        {
            header: 'Assigned To',
            render: (row) => (
                <div className="text-xs">
                    <p className="font-semibold text-slate-700">{row.assignedTo?.name || 'Unassigned'}</p>
                    <p className="text-slate-400">By {row.reportedBy?.name}</p>
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

    return <Table columns={columns} data={issues} loading={loading} />;
};

export default IssueTable;
