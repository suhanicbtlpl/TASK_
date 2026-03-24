import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, FileText, Download, Upload, Calendar, Edit2 } from 'lucide-react';
import { documentService, projectService } from '../services/api';

import Table from '../components/shared/Table';
import { Button, Input, Modal, Card } from '../components/shared/UIComponents';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';
import { useAuth } from '../context/AuthContext';


const Documents = () => {
    const { user } = useAuth();
    const canCreate = user?.role?.permissions?.includes('Document_CREATE');
    const canUpdate = user?.role?.permissions?.includes('Document_UPDATE');
    const canDelete = user?.role?.permissions?.includes('Document_DELETE');

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingDocument, setEditingDocument] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isUpdateVersionModalOpen, setIsUpdateVersionModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [projects, setProjects] = useState([]);
    
    // Pagination & Search State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        projectId: '',
        category: 'General',
        tags: '',
        file: null
    });

    const fetchDropdownData = async () => {
        try {
            const res = await projectService.getProjects({ limit: 100 });
            setProjects(res.data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        }
    };

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);
            const res = await documentService.getDocuments({ page, limit, search });
            setDocuments(res.data || []);
            setTotalPages(res.pages || 1);
            setTotalRecords(res.total || 0);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search]);

    useEffect(() => {
        fetchDocuments();
        fetchDropdownData();
    }, [fetchDocuments]);

    const handleSearch = (searchValue) => {
        setSearch(searchValue);
        setPage(1);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            if (editingDocument) {
                await documentService.updateDocument(editingDocument._id, {
                    title: formData.title,
                    description: formData.description,
                    projectId: formData.projectId || null,
                    category: formData.category,
                    tags: formData.tags
                });
            } else {
                if (!formData.file) {
                    setSubmitting(false);
                    return alert('Please select a file');
                }
                const uploadData = new FormData();
                uploadData.append('title', formData.title);
                uploadData.append('description', formData.description);
                uploadData.append('projectId', formData.projectId);
                uploadData.append('category', formData.category);
                uploadData.append('tags', formData.tags);
                uploadData.append('file', formData.file);
                await documentService.uploadDocument(uploadData);
            }
            
            setIsModalOpen(false);
            setEditingDocument(null);
            setFormData({ title: '', description: '', projectId: '', category: 'General', tags: '', file: null });
            fetchDocuments();
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Error saving document');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (doc) => {
        setEditingDocument(doc);
        setFormData({
            title: doc.title,
            description: doc.description || '',
            projectId: doc.projectId?._id || '',
            category: doc.category || 'General',
            tags: doc.tags?.join(', ') || '',
            file: null
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await documentService.deleteDocument(id);
                fetchDocuments();
            } catch (error) {
                alert('Error deleting document');
            }
        }
    };

    const handleVersionUpload = async (e) => {
        e.preventDefault();
        if (!formData.file || !selectedDocument) return;

        setSubmitting(true);
        try {
            const uploadData = new FormData();
            uploadData.append('file', formData.file);
            await documentService.addVersion(selectedDocument._id, uploadData);
            
            setIsUpdateVersionModalOpen(false);
            setFormData({ ...formData, file: null });
            fetchDocuments();
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Error uploading version');
        } finally {
            setSubmitting(false);
        }
    };

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
                        onClick={() => {
                            setSelectedDocument(row);
                            setIsVersionModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Version History"
                    >
                        <Calendar size={14} />
                    </button>
                    {canUpdate && (
                        <button 
                            onClick={() => {
                                setSelectedDocument(row);
                                setIsUpdateVersionModalOpen(true);
                            }}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                            title="Upload New Version"
                        >
                            <Upload size={14} />
                        </button>
                    )}
                    {canUpdate && (
                        <Button variant="secondary" size="sm" onClick={() => handleEdit(row)}>
                            <Edit2 size={14} />
                        </Button>
                    )}
                    {canDelete && (
                        <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>
                            <Trash2 size={14} />
                        </Button>
                    )}
                </div>
            )
        }

    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
                    <p className="text-slate-500">Manage company documents and files</p>
                </div>
                {canCreate && (
                    <Button onClick={() => {
                        setEditingDocument(null);
                        setFormData({ 
                            title: '', 
                            description: '', 
                            projectId: '', 
                            category: 'General', 
                            tags: '', 
                            file: null 
                        });
                        setIsModalOpen(true);
                    }}>
                        <Upload size={18} className="mr-2" />
                        Upload Document
                    </Button>
                )}
            </div>


            <Card className="p-4">
                <div className="mb-4">
                    <SearchInput onSearch={handleSearch} placeholder="Search documents..." />
                </div>
                
                <Table 
                    columns={columns} 
                    data={documents} 
                    loading={loading} 
                />

                <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={handleLimitChange}
                />
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDocument ? 'Edit Document Details' : 'Upload New Document'}
            >

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Document Title"
                        placeholder="e.g. Project Specs Q1"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Project</label>
                            <select
                                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                                value={formData.projectId}
                                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                            >
                                <option value="">General (No Project)</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id}>{p.projectName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Category</label>
                            <select
                                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="General">General</option>
                                <option value="Invoices">Invoices</option>
                                <option value="Requirements">Requirements</option>
                                <option value="Reports">Reports</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Tags (Comma separated)"
                        placeholder="e.g. urgent, final, v1"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />

                    <textarea
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm min-h-[80px]"
                        rows="2"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Optional description..."
                    />

                    {!editingDocument && (
                        <div className="p-4 bg-primary-50 rounded-xl border border-dashed border-primary-200">
                            <label className="block text-sm font-semibold text-primary-700 mb-2">
                                Select File
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer"
                                required
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? (editingDocument ? 'Updating...' : 'Uploading...') : (editingDocument ? 'Update' : 'Upload') + ' Document'}
                        </Button>
                    </div>
                </form>

            </Modal>
            {/* Version History Modal */}
            <Modal
                isOpen={isVersionModalOpen}
                onClose={() => setIsVersionModalOpen(false)}
                title={`Version History - ${selectedDocument?.title}`}
            >
                <div className="space-y-4">
                    {selectedDocument?.versions?.slice().reverse().map((v, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg text-slate-400">
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Version {selectedDocument.versions.length - i}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{new Date(v.createdAt).toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">By {v.uploadedBy?.name || 'Unknown'}</p>
                                </div>
                            </div>
                            <a 
                                href={`http://localhost:5000${v.fileUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            >
                                <Download size={16} />
                            </a>
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Upload New Version Modal */}
            <Modal
                isOpen={isUpdateVersionModalOpen}
                onClose={() => setIsUpdateVersionModalOpen(false)}
                title={`Upload New Version - ${selectedDocument?.title}`}
            >
                <form onSubmit={handleVersionUpload} className="space-y-4">
                    <div className="p-6 bg-primary-50 rounded-2xl border-2 border-dashed border-primary-200 text-center">
                        <Upload size={32} className="mx-auto text-primary-400 mb-2" />
                        <label className="block text-sm font-bold text-primary-700 mb-2">
                            Select New File Version
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary-600 file:text-white hover:file:bg-primary-700 cursor-pointer"
                            required
                        />
                        <p className="text-[10px] text-slate-400 mt-4 italic">
                            Uploading a new version will update the main file across the system.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setIsUpdateVersionModalOpen(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Uploading...' : 'Upload Version'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Documents;
