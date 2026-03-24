const DocumentService = require('../services/DocumentService');
const ActivityService = require('../services/ActivityService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`); // Clean filename
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('file');

// @desc    Get all documents with search and pagination
// @route   GET /api/v1/documents
// @access  Private
const getDocuments = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const result = await DocumentService.getAll({ page, limit, search });
        return SuccessResponse(res, 'Documents retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching documents', error.message);
    }
};

// @desc    Upload new document
// @route   POST /api/v1/documents
// @access  Private
const uploadDocument = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return ErrorResponse(res, err.message, null, 400);
        }

        if (!req.file) {
            return ErrorResponse(res, 'Please upload a file', null, 400);
        }

        const { title, description, projectId, category, tags } = req.body;

        try {
            const documentData = {
                title,
                description,
                projectId: projectId || null,
                category: category || 'General',
                tags: tags ? tags.split(',').map(t => t.trim()) : [],
                fileUrl: `/uploads/${req.file.filename}`,
                fileName: req.file.originalname,
                fileSize: req.file.size,
                uploadedBy: req.user._id,
                versions: [{
                    fileUrl: `/uploads/${req.file.filename}`,
                    fileName: req.file.originalname,
                    fileSize: req.file.size,
                    uploadedBy: req.user._id
                }]
            };

            const document = await DocumentService.create(documentData);

            await ActivityService.logActivity(
                req.user._id, 
                'UPLOAD', 
                'Document', 
                `Uploaded document: ${document.title}`, 
                document._id, 
                document.title
            );

            return SuccessResponse(res, 'Document uploaded successfully', document, 201);

        } catch (error) {
            return ErrorResponse(res, 'Error saving document', error.message, 400);
        }
    });
};

// @desc    Add new version to existing document
// @route   POST /api/v1/documents/:id/version
// @access  Private
const addDocumentVersion = (req, res) => {
    upload(req, res, async (err) => {
        if (err) return ErrorResponse(res, err.message, null, 400);
        if (!req.file) return ErrorResponse(res, 'Please upload a file', null, 400);

        try {
            const document = await DocumentService.getById(req.params.id);
            if (!document) return ErrorResponse(res, 'Document not found', null, 404);

            const newVersion = {
                fileUrl: `/uploads/${req.file.filename}`,
                fileName: req.file.originalname,
                fileSize: req.file.size,
                uploadedBy: req.user._id
            };

            // Update main document fields to the latest version
            document.fileUrl = newVersion.fileUrl;
            document.fileName = newVersion.fileName;
            document.fileSize = newVersion.fileSize;
            document.versions.push(newVersion);

            await document.save();

            await ActivityService.logActivity(
                req.user._id, 
                'VERSION_UPLOAD', 
                'Document', 
                `Uploaded new version for document: ${document.title}`, 
                document._id, 
                document.title
            );

            return SuccessResponse(res, 'New version uploaded successfully', document);

        } catch (error) {
            return ErrorResponse(res, 'Error adding version', error.message, 400);
        }
    });
};

// @desc    Update document metadata
// @route   PUT /api/v1/documents/:id
// @access  Private
const updateDocument = async (req, res) => {
    try {
        const document = await DocumentService.update(req.params.id, req.body);
        if (!document) return ErrorResponse(res, 'Document not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'UPDATE', 
            'Document', 
            `Updated document: ${document.title}`, 
            document._id, 
            document.title
        );

        return SuccessResponse(res, 'Document updated successfully', document);
    } catch (error) {
        return ErrorResponse(res, 'Error updating document', error.message, 400);
    }
};

// @desc    Soft delete document
// @route   DELETE /api/v1/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
    try {
        const document = await DocumentService.softDelete(req.params.id);
        if (!document) return ErrorResponse(res, 'Document not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'DELETE', 
            'Document', 
            `Soft deleted document: ${document.title}`, 
            document._id, 
            document.title
        );

        return SuccessResponse(res, 'Document soft deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting document', error.message, 400);
    }
};

// @desc    Get deleted documents
// @route   GET /api/v1/documents/deleted
// @access  Private/Admin
const getDeletedDocuments = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await DocumentService.getDeleted({ page, limit });
        return SuccessResponse(res, 'Deleted documents retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching deleted documents', error.message);
    }
};

// @desc    Restore document
// @route   PUT /api/v1/documents/:id/restore
// @access  Private/Admin
const restoreDocument = async (req, res) => {
    try {
        const document = await DocumentService.restore(req.params.id);
        if (!document) return ErrorResponse(res, 'Document not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'RESTORE', 
            'Document', 
            `Restored document: ${document.title}`, 
            document._id, 
            document.title
        );

        return SuccessResponse(res, 'Document restored successfully', document);
    } catch (error) {
        return ErrorResponse(res, 'Error restoring document', error.message, 400);
    }
};

// @desc    Permanent delete document
// @route   DELETE /api/v1/documents/:id/permanent
// @access  Private/Admin
const permanentDeleteDocument = async (req, res) => {
    try {
        const document = await DocumentService.getById(req.params.id, [], true); // Special find including deleted
        // Wait, BaseService permanentDelete uses findOneAndDelete({ isDeleted: true })
        const deletedDoc = await DocumentService.permanentDelete(req.params.id);
        if (!deletedDoc) return ErrorResponse(res, 'Document not found or not in Recycle Bin', null, 404);

        // Delete physical files
        if (deletedDoc.versions && deletedDoc.versions.length > 0) {
            deletedDoc.versions.forEach(version => {
                const filePath = path.join(__dirname, '..', version.fileUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }

        await ActivityService.logActivity(
            req.user._id, 
            'PERMANENT_DELETE', 
            'Document', 
            `Permanently deleted document: ${deletedDoc.title}`, 
            deletedDoc._id, 
            deletedDoc.title
        );

        return SuccessResponse(res, 'Document permanently deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting document permanently', error.message, 400);
    }
};

module.exports = { 
    getDocuments, 
    uploadDocument, 
    deleteDocument, 
    updateDocument, 
    getDeletedDocuments, 
    restoreDocument,
    permanentDeleteDocument,
    addDocumentVersion
};




