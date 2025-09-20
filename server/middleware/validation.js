const { validationResult, check } = require('express-validator');

// Validation chains
const authValidations = {
    register: [
        check('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
        
        check('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please enter a valid email')
            .normalizeEmail(),
        
        check('password')
            .trim()
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
            .matches(/\d/).withMessage('Password must contain at least one number')
            .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
        
        check('role')
            .optional()
            .isIn(['admin', 'coordinator', 'evaluator', 'participant'])
            .withMessage('Invalid role specified')
    ],

    login: [
        check('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please enter a valid email')
            .normalizeEmail(),
        
        check('password')
            .trim()
            .notEmpty().withMessage('Password is required')
    ]
};

const hackathonValidations = {
    create: [
        check('title')
            .trim()
            .notEmpty().withMessage('Title is required')
            .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
        
        check('description')
            .trim()
            .notEmpty().withMessage('Description is required')
            .isLength({ min: 20 }).withMessage('Description must be at least 20 characters long'),
        
        check('startDate')
            .notEmpty().withMessage('Start date is required')
            .isISO8601().withMessage('Invalid start date format'),
        
        check('endDate')
            .notEmpty().withMessage('End date is required')
            .isISO8601().withMessage('Invalid end date format')
            .custom((endDate, { req }) => {
                if (new Date(endDate) <= new Date(req.body.startDate)) {
                    throw new Error('End date must be after start date');
                }
                return true;
            }),
        
        check('maxTeamSize')
            .optional()
            .isInt({ min: 1 }).withMessage('Maximum team size must be at least 1')
    ]
};

// Validation middleware
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    };
};

module.exports = {
    validate,
    authValidations,
    hackathonValidations
};