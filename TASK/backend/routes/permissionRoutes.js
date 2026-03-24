const express = require('express');
const router = express.Router();
const { getPermissions, createPermission, updatePermission, deletePermission, getDeletedPermissions, restorePermission, permanentDeletePermission } = require('../controllers/permissionController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validator');

router.route('/')
    .get(protect, checkPermission('Permission_READ'), getPermissions)
    .post(protect, checkPermission('Permission_CREATE'), validate, createPermission);

router.get('/deleted', protect, checkPermission('Permission_READ'), getDeletedPermissions);

router.route('/:id')
    .put(protect, checkPermission('Permission_UPDATE'), updatePermission)
    .delete(protect, checkPermission('Permission_DELETE'), deletePermission);

router.put('/:id/restore', protect, checkPermission('Permission_DELETE'), restorePermission);
router.delete('/:id/permanent', protect, checkPermission('Permission_DELETE'), permanentDeletePermission);



module.exports = router;
