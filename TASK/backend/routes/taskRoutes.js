const express = require('express');
const router = express.Router();
const { getTasks, getTasksByProject, createTask, updateTask, deleteTask, getDeletedTasks, restoreTask, permanentDeleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');
const { validate, taskRules } = require('../middleware/validator');

router.route('/')
    .get(protect, checkPermission('Task_READ'), getTasks)
    .post(protect, checkPermission('Task_CREATE'), taskRules, validate, createTask);

router.get('/project/:projectId', protect, getTasksByProject);
router.get('/deleted', protect, checkPermission('Task_READ'), getDeletedTasks);

router.route('/:id')
    .put(protect, checkPermission('Task_UPDATE'), updateTask)
    .delete(protect, checkPermission('Task_DELETE'), deleteTask);

router.put('/:id/restore', protect, checkPermission('Task_DELETE'), restoreTask);
router.delete('/:id/permanent', protect, checkPermission('Task_DELETE'), permanentDeleteTask);



module.exports = router;
