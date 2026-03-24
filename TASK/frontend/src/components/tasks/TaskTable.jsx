import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Table from '../shared/Table';
import { Button } from '../shared/UIComponents';

const TaskTable = ({ tasks, loading, canUpdate, canDelete, onEdit, onDelete, getStatusColor }) => {
    const columns = [
        {
            header: 'Task & Subtasks',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{row.taskTitle}</span>
                    {row.subtasks?.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 max-w-[100px] h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 transition-all" 
                                    style={{ width: `${(row.subtasks.filter(s => s.isCompleted).length / row.subtasks.length) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                                {row.subtasks.filter(s => s.isCompleted).length}/{row.subtasks.length}
                            </span>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Project & Priority',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {row.projectId?.projectName || 'No Project'}
                    </span>
                    <span className={`text-[10px] font-bold mt-0.5 ${
                        row.priority === 'Critical' ? 'text-red-600' :
                        row.priority === 'High' ? 'text-amber-600' :
                        row.priority === 'Medium' ? 'text-blue-600' :
                        'text-slate-500'
                    }`}>
                        {row.priority} Priority
                    </span>
                </div>
            )
        },
        {
            header: 'Assigned To',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-[10px] font-bold border border-primary-100 overflow-hidden">
                        {row.assignedTo?.profilePhoto ? (
                             <img src={`http://localhost:5000${row.assignedTo.profilePhoto}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                            row.assignedTo?.name?.[0].toUpperCase() || '?'
                        )}
                    </div>
                    <span className="text-sm text-slate-700 font-medium">{row.assignedTo?.name || 'Unassigned'}</span>
                </div>
            )
        },
        {
            header: 'Status & Due',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border w-fit ${getStatusColor(row.status)}`}>
                        {row.status}
                    </span>
                    {row.dueDate && (
                        <span className={`text-[10px] ${new Date(row.dueDate) < new Date() && row.status !== 'Completed' ? 'text-red-500 font-bold' : 'text-slate-400 font-medium'}`}>
                            {new Date(row.dueDate).toLocaleDateString()}
                        </span>
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

    return <Table columns={columns} data={tasks} loading={loading} />;
};

export default TaskTable;
