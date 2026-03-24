const ProjectService = require('../services/ProjectService');
const ActivityService = require('../services/ActivityService');
const NotificationService = require('../services/NotificationService');
const { SuccessResponse, ErrorResponse } = require('../utils/Response');

// @desc    Get all projects with search and pagination
// @route   GET /api/v1/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        const { page, limit, search } = req.query;
        const result = await ProjectService.getAll({ page, limit, search });
        return SuccessResponse(res, 'Projects retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching projects', error.message);
    }
};

// @desc    Create new project
// @route   POST /api/v1/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { projectName, assignedStaff } = req.body;
        const project = await ProjectService.create({
            projectName,
            assignedStaff,
            totalAssignedStaff: assignedStaff?.length || 0,
            createdBy: req.user._id
        });

        await ActivityService.logActivity(
            req.user._id, 
            'CREATE', 
            'Project', 
            `Created project: ${project.projectName}`, 
            project._id, 
            project.projectName
        );

        // Notify assigned staff
        if (project.assignedStaff && project.assignedStaff.length > 0) {
            const notifications = project.assignedStaff.map(staffId => ({
                recipient: staffId,
                sender: req.user._id,
                type: 'PROJECT_ASSIGNED',
                title: 'New Project Assigned',
                message: `You have been assigned to a new project: ${project.projectName}`,
                link: `/projects`
            }));
            await Promise.all(notifications.map(n => NotificationService.createNotification(n)));
        }

        return SuccessResponse(res, 'Project created successfully', project, 201);
    } catch (error) {
        return ErrorResponse(res, 'Error creating project', error.message, 400);
    }
};

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    try {
        const { projectName, assignedStaff } = req.body;
        const updateData = { projectName, assignedStaff };
        if (assignedStaff) updateData.totalAssignedStaff = assignedStaff.length;

        const project = await ProjectService.update(req.params.id, updateData);
        if (!project) return ErrorResponse(res, 'Project not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'UPDATE', 
            'Project', 
            `Updated project: ${project.projectName}`, 
            project._id, 
            project.projectName
        );

        return SuccessResponse(res, 'Project updated successfully', project);
    } catch (error) {
        return ErrorResponse(res, 'Error updating project', error.message, 400);
    }
};

// @desc    Soft delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await ProjectService.softDelete(req.params.id);
        if (!project) return ErrorResponse(res, 'Project not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'DELETE', 
            'Project', 
            `Soft deleted project: ${project.projectName}`, 
            project._id, 
            project.projectName
        );

        return SuccessResponse(res, 'Project soft deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting project', error.message, 400);
    }
};

// @desc    Get deleted projects
// @route   GET /api/v1/projects/deleted
// @access  Private/Admin
const getDeletedProjects = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const result = await ProjectService.getDeleted({ page, limit });
        return SuccessResponse(res, 'Deleted projects retrieved successfully', result);
    } catch (error) {
        return ErrorResponse(res, 'Error fetching deleted projects', error.message);
    }
};

// @desc    Restore project
// @route   PUT /api/v1/projects/:id/restore
// @access  Private/Admin
const restoreProject = async (req, res) => {
    try {
        const project = await ProjectService.restore(req.params.id);
        if (!project) return ErrorResponse(res, 'Project not found', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'RESTORE', 
            'Project', 
            `Restored project: ${project.projectName}`, 
            project._id, 
            project.projectName
        );

        return SuccessResponse(res, 'Project restored successfully', project);
    } catch (error) {
        return ErrorResponse(res, 'Error restoring project', error.message, 400);
    }
};

// @desc    Permanent delete project
// @route   DELETE /api/v1/projects/:id/permanent
// @access  Private/Admin
const permanentDeleteProject = async (req, res) => {
    try {
        const project = await ProjectService.permanentDelete(req.params.id);
        if (!project) return ErrorResponse(res, 'Project not found or not in Recycle Bin', null, 404);

        await ActivityService.logActivity(
            req.user._id, 
            'PERMANENT_DELETE', 
            'Project', 
            `Permanently deleted project: ${project.projectName}`, 
            project._id, 
            project.projectName
        );

        return SuccessResponse(res, 'Project permanently deleted successfully');
    } catch (error) {
        return ErrorResponse(res, 'Error deleting project permanently', error.message, 400);
    }
};

module.exports = { getProjects, createProject, updateProject, deleteProject, getDeletedProjects, restoreProject, permanentDeleteProject };


