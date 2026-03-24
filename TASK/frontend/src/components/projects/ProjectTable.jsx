import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Table from '../shared/Table';
import { Button } from '../shared/UIComponents';

const ProjectTable = ({ projects, loading, canUpdate, canDelete, onEdit, onDelete }) => {
    const columns = [
        {
            header: 'Project Details',
            render: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{row.projectName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            row.priority === 'High' ? 'bg-red-100 text-red-600' :
                            row.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                            'bg-blue-100 text-blue-600'
                        }`}>
                            {row.priority}
                        </span>
                    </div>
                    <span className="text-xs text-slate-500">Client: {row.clientName}</span>
                </div>
            )
        },
        {
            header: 'Manager',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {row.projectManager?.name?.[0].toUpperCase() || '?'}
                    </div>
                    <span className="text-sm text-slate-700">{row.projectManager?.name || 'Unassigned'}</span>
                </div>
            )
        },
        {
            header: 'Status',
            render: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    row.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    row.status === 'On Hold' ? 'bg-amber-100 text-amber-700' :
                    'bg-primary-100 text-primary-700'
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Timeline',
            render: (row) => (
                <div className="text-xs text-slate-500">
                    <div>{new Date(row.startDate).toLocaleDateString()}</div>
                    {row.endDate && <div>to {new Date(row.endDate).toLocaleDateString()}</div>}
                </div>
            )
        },
        {
            header: 'Team',
            render: (row) => (
                <div className="flex -space-x-2 overflow-hidden">
                    {row.assignedStaff?.slice(0, 3).map((s, i) => (
                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600" title={s.name}>
                            {s.name[0].toUpperCase()}
                        </div>
                    ))}
                    {(row.assignedStaff?.length > 3) && (
                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                            +{row.assignedStaff.length - 3}
                        </div>
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

    return <Table columns={columns} data={projects} loading={loading} />;
};

export default ProjectTable;
