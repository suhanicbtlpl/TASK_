const express = require('express');
const router = express.Router();
const { getStaff, createStaff, updateStaff, deleteStaff, getDeletedStaff, restoreStaff, permanentDeleteStaff } = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');
const { validate, staffRules } = require('../middleware/validator');

router.route('/')
    .get(protect, checkPermission('Staff_READ'), getStaff)
    .post(protect, checkPermission('Staff_CREATE'), staffRules, validate, createStaff);

router.get('/deleted', protect, checkPermission('Staff_READ'), getDeletedStaff);

router.route('/:id')
    .put(protect, checkPermission('Staff_UPDATE'), updateStaff)
    .delete(protect, checkPermission('Staff_DELETE'), deleteStaff);

router.put('/:id/restore', protect, checkPermission('Staff_DELETE'), restoreStaff);
router.delete('/:id/permanent', protect, checkPermission('Staff_DELETE'), permanentDeleteStaff);



module.exports = router;
