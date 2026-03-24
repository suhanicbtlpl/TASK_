const { body, validationResult } = require('express-validator');
const { ErrorResponse } = require('../utils/Response');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMsg = errors.array().map(err => err.msg).join(', ');
        return ErrorResponse(res, errorMsg, errors.array(), 400);
    }
    next();
};

const authRules = {
    login: [
        body('email').isEmail().withMessage('Enter a valid email address'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    updateProfile: [
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('mobileNumber').optional().isMobilePhone().withMessage('Enter a valid mobile number')
    ],
    changePassword: [
        body('oldPassword').notEmpty().withMessage('Old password is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
    ],
    forgotPassword: [
        body('email').isEmail().withMessage('Enter a valid email address')
    ],
    resetPassword: [
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ]
};

const staffRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('role').notEmpty().withMessage('Role ID is required'),
    body('mobileNumber').isMobilePhone().withMessage('Enter a valid mobile number')
];

const projectRules = [
    body('projectName').notEmpty().withMessage('Project Name is required'),
    body('clientName').notEmpty().withMessage('Client Name is required'),
    body('startDate').isISO8601().toDate().withMessage('Enter a valid start date')
];

const taskRules = [
    body('taskTitle').notEmpty().withMessage('Task Title is required'),
    body('projectId').notEmpty().withMessage('Project ID is required'),
    body('assignedTo').notEmpty().withMessage('Assigned To User ID is required')
];

const documentRules = [
    body('title').notEmpty().withMessage('Document Title is required')
];

module.exports = {
    validate,
    authRules,
    staffRules,
    projectRules,
    taskRules,
    documentRules
};
