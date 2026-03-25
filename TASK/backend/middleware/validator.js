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

// Company registration validation rules
const registerCompany = [
    body('companyName', 'Company name is required').notEmpty(),
    body('address', 'Address is required').notEmpty(),
    body('phone', 'Phone is required').notEmpty(),
    body('ownerName', 'Owner name is required').notEmpty(),
    body('ownerEmail', 'Valid email is required').isEmail(),
    body('ownerPassword', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('ownerMobile', 'Owner mobile number is required').notEmpty()
];

// Staff validation rules
const staffRules = [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Valid email is required').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('mobileNumber', 'Mobile number is required').notEmpty(),
    body('role', 'Role is required').notEmpty()
];

// Project validation rules
const projectRules = [
    body('projectName', 'Project name is required').notEmpty(),
    body('clientName', 'Client name is required').notEmpty(),
    body('startDate', 'Start date is required').notEmpty(),
    body('projectManager', 'Project manager is required').notEmpty()
];

// Task validation rules
const taskRules = [
    body('taskTitle', 'Task title is required').notEmpty(),
    body('projectId', 'Project ID is required').notEmpty(),
    body('assignedTo', 'Assigned staff is required').notEmpty()
];

// Document validation rules
const documentRules = [
    body('title', 'Document title is required').notEmpty()
];

module.exports = {
    validate,
    authRules,
    registerCompany,
    staffRules,
    projectRules,
    taskRules,
    documentRules
};