const express = require('express');
const router = express.Router();
const { 
    getDocuments, 
    uploadDocument, 
    deleteDocument, 
    updateDocument, 
    getDeletedDocuments, 
    restoreDocument,
    permanentDeleteDocument,
    addDocumentVersion
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');
const { validate, documentRules } = require('../middleware/validator');

router.route('/')
    .get(protect, checkPermission('Document_READ'), getDocuments)
    .post(protect, checkPermission('Document_CREATE'), documentRules, validate, uploadDocument);

router.post('/:id/version', protect, checkPermission('Document_UPDATE'), addDocumentVersion);

router.get('/deleted', protect, checkPermission('Document_READ'), getDeletedDocuments);

router.route('/:id')
    .put(protect, checkPermission('Document_UPDATE'), updateDocument)
    .delete(protect, checkPermission('Document_DELETE'), deleteDocument);

router.put('/:id/restore', protect, checkPermission('Document_DELETE'), restoreDocument);
router.delete('/:id/permanent', protect, checkPermission('Document_DELETE'), permanentDeleteDocument);


module.exports = router;
