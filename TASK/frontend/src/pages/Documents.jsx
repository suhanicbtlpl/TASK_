import React, { useState, useEffect, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { documentService, projectService } from '../services/api';

import { Button, Card } from '../components/shared/UIComponents';
import SearchInput from '../components/shared/SearchInput';
import Pagination from '../components/shared/Pagination';
import { useAuth } from '../context/AuthContext';

import DocumentTable from '../components/documents/DocumentTable';
import { DocumentFormModal, VersionHistoryModal, UploadVersionModal } from '../components/documents/DocumentModals';

const Documents = () => {
    const { user } = useAuth();
    const canCreate = user?.role?.permissions?.includes('Document_CREATE');
    const canUpdate = user?.role?.permissions?.includes('Document_UPDATE');
    const canDelete = user?.role?.permissions?.includes('Document_DELETE');

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingDocument, setEditingDocument] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
    const [isUploadVersionModalOpen, setIsUploadVersionModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
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
            
            setIsFormModalOpen(false);
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
        setIsFormModalOpen(true);
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
            
            setIsUploadVersionModalOpen(false);
            setFormData({ ...formData, file: null });
            fetchDocuments();
        } catch (error) {
            alert(error.response?.data?.message || error.message || 'Error uploading version');
        } finally {
            setSubmitting(false);
        }
    };

    const openUploadModal = () => {
        setEditingDocument(null);
        setFormData({ 
            title: '', 
            description: '', 
            projectId: '', 
            category: 'General', 
            tags: '', 
            file: null 
        });
        setIsFormModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
                    <p className="text-slate-500">Manage company documents and files</p>
                </div>
                {canCreate && (
                    <Button onClick={openUploadModal}>
                        <Upload size={18} className="mr-2" />
                        Upload Document
                    </Button>
                )}
            </div>

            <Card className="p-4">
                <div className="mb-4">
                    <SearchInput onSearch={handleSearch} placeholder="Search documents..." />
                </div>
                
                <DocumentTable 
                    documents={documents} 
                    loading={loading}
                    canUpdate={canUpdate}
                    canDelete={canDelete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewVersions={(doc) => { setSelectedDocument(doc); setIsVersionModalOpen(true); }}
                    onUploadNewVersion={(doc) => { setSelectedDocument(doc); setIsUploadVersionModalOpen(true); }}
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

            <DocumentFormModal 
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                editingDocument={editingDocument}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                submitting={submitting}
                projects={projects}
            />

            <VersionHistoryModal 
                isOpen={isVersionModalOpen}
                onClose={() => setIsVersionModalOpen(false)}
                selectedDocument={selectedDocument}
            />

            <UploadVersionModal 
                isOpen={isUploadVersionModalOpen}
                onClose={() => setIsUploadVersionModalOpen(false)}
                selectedDocument={selectedDocument}
                handleFileChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                onUpload={handleVersionUpload}
                submitting={submitting}
            />
        </div>
    );
};

export default Documents;

