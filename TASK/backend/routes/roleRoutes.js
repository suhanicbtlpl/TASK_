const express = require('express');
const router = express.Router();
const { createRole, getRoles, updateRole, deleteRole, getDeletedRoles, restoreRole, permanentDeleteRole } = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validator');

router.route('/')
    .get(protect, checkPermission('Role_READ'), getRoles)
    .post(protect, checkPermission('Role_CREATE'), validate, createRole);

router.get('/deleted', protect, checkPermission('Role_READ'), getDeletedRoles);

router.route('/:id')
    .put(protect, checkPermission('Role_UPDATE'), updateRole)
    .delete(protect, checkPermission('Role_DELETE'), deleteRole);

router.put('/:id/restore', protect, checkPermission('Role_DELETE'), restoreRole);
router.delete('/:id/permanent', protect, checkPermission('Role_DELETE'), permanentDeleteRole);



module.exports = router;
