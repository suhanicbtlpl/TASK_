const express = require('express');
const router = express.Router();
const { getIssues, createIssue, updateIssue, deleteIssue, getDeletedIssues, restoreIssue, permanentDeleteIssue } = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');

router.route('/')
    .get(protect, checkPermission('Issue_READ'), getIssues)
    .post(protect, checkPermission('Issue_CREATE'), createIssue);

router.get('/deleted', protect, checkPermission('Issue_READ'), getDeletedIssues);
router.put('/:id/restore', protect, checkPermission('Issue_DELETE'), restoreIssue);
router.delete('/:id/permanent', protect, checkPermission('Issue_DELETE'), permanentDeleteIssue);

router.route('/:id')
    .put(protect, checkPermission('Issue_UPDATE'), updateIssue)
    .delete(protect, checkPermission('Issue_DELETE'), deleteIssue);

module.exports = router;
