const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject, getDeletedProjects, restoreProject, permanentDeleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/roleMiddleware');
const { validate, projectRules } = require('../middleware/validator');

router.route('/')
    .get(protect, checkPermission('Project_READ'), getProjects)
    .post(protect, checkPermission('Project_CREATE'), projectRules, validate, createProject);

router.get('/deleted', protect, checkPermission('Project_READ'), getDeletedProjects);

router.route('/:id')
    .put(protect, checkPermission('Project_UPDATE'), updateProject)
    .delete(protect, checkPermission('Project_DELETE'), deleteProject);

router.put('/:id/restore', protect, checkPermission('Project_DELETE'), restoreProject);
router.delete('/:id/permanent', protect, checkPermission('Project_DELETE'), permanentDeleteProject);



module.exports = router;
