import React from 'react';
import { Upload, FileText, Download } from 'lucide-react';
import { Modal, Button, Input } from '../shared/UIComponents';

/**
 * Modal for creating or editing a document's core details.
 */
export const DocumentFormModal = ({ 
    isOpen, 
    onClose, 
    editingDocument, 
    formData, 
    setFormData, 
    onSubmit, 
    submitting, 
    projects 
}) => {
    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingDocument ? 'Edit Document Details' : 'Upload New Document'}
        >
            <form onSubmit={onSubmit} className="space-y-4">
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
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? (editingDocument ? 'Updating...' : 'Uploading...') : (editingDocument ? 'Update' : 'Upload') + ' Document'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

/**
 * Modal for viewing the list of older versions of a document.
 */
export const VersionHistoryModal = ({ isOpen, onClose, selectedDocument }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
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
    );
};

/**
 * Modal specifically for uploading a new version of an existing document.
 */
export const UploadVersionModal = ({ isOpen, onClose, selectedDocument, handleFileChange, onUpload, submitting }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Upload New Version - ${selectedDocument?.title}`}
        >
            <form onSubmit={onUpload} className="space-y-4">
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
                    <Button variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? 'Uploading...' : 'Upload Version'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
