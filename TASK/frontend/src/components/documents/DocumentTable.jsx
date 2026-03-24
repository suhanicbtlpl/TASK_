import React from 'react';
import { FileText, Download, Calendar, Upload, Edit2, Trash2 } from 'lucide-react';
import Table from '../shared/Table';
import { Button } from '../shared/UIComponents';

const DocumentTable = ({ 
    documents, 
    loading, 
    canUpdate, 
    canDelete, 
    onEdit, 
    onDelete, 
    onViewVersions, 
    onUploadNewVersion 
}) => {
    
    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const columns = [
        { 
            header: 'Document Name', 
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                        <FileText size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 leading-tight">{row.title}</p>
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                                V{row.versions?.length || 1}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{row.fileType?.split('/')?.[1] || 'FILE'}</span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400 font-medium">{formatFileSize(row.fileSize)}</span>
                        </div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Project & Category', 
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-600">
                        {row.projectId?.projectName || 'General'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit ${
                        row.category === 'Invoices' ? 'bg-emerald-100 text-emerald-600' :
                        row.category === 'Requirements' ? 'bg-blue-100 text-blue-600' :
                        row.category === 'Reports' ? 'bg-purple-100 text-purple-600' :
                        'bg-slate-100 text-slate-500'
                    }`}>
                        {row.category}
                    </span>
                </div>
            )
        },
        { 
            header: 'Uploader', 
            render: (row) => (
                <div className="text-xs">
                    <p className="font-semibold text-slate-700">{row.uploadedBy?.name}</p>
                    <p className="text-slate-400">{new Date(row.createdAt).toLocaleDateString()}</p>
                </div>
            )
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex gap-2 text-sm">
                    <a 
                        href={`http://localhost:5000${row.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                        title="View/Download"
                    >
                        <Download size={14} />
                    </a>
                    <button 
                        onClick={() => onViewVersions(row)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Version History"
                    >
                        <Calendar size={14} />
                    </button>
                    {canUpdate && (
                        <button 
                            onClick={() => onUploadNewVersion(row)}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                            title="Upload New Version"
                        >
                            <Upload size={14} />
                        </button>
                    )}
                    {canUpdate && (
                        <Button variant="secondary" size="sm" onClick={() => onEdit(row)}>
                            <Edit2 size={14} />
                        </Button>
                    )}
                    {canDelete && (
                        <Button variant="danger" size="sm" onClick={() => onDelete(row._id)}>
                            <Trash2 size={14} />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return <Table columns={columns} data={documents} loading={loading} />;
};

export default DocumentTable;
