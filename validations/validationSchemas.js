const Joi = require('joi');

const signupSchema = Joi.object({
    firstname: Joi.string().required().messages({
        'string.empty': 'First name cannot be empty',
        'any.required': 'First name is required'
    }),
    lastname: Joi.string().required().messages({
        'string.empty': 'Last name cannot be empty',
        'any.required': 'Last name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email cannot be empty',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least {#limit} characters long',
        'string.empty': 'Password cannot be empty',
        'any.required': 'Password is required'
    })
});

const verifySchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email cannot be empty',
        'any.required': 'Email is required'
    }),
    OTP: Joi.string().length(6).required().messages({
        'string.length': 'OTP must be {#limit} characters long',
        'string.empty': 'OTP cannot be empty',
        'any.required': 'OTP is required'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email cannot be empty',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password cannot be empty',
        'any.required': 'Password is required'
    })
});

const resendOTPSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email cannot be empty',
        'any.required': 'Email is required'
    })
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email cannot be empty',
        'any.required': 'Email is required'
    })
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        'string.empty': 'Token cannot be empty',
        'any.required': 'Token is required'
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.min': 'New password must be at least {#limit} characters long',
        'string.empty': 'New password cannot be empty',
        'any.required': 'New password is required'
    })
})

const incomeSchema = Joi.object({
    amount: Joi.number().required().messages({
        'number.base': 'Amount must be a number',
        'number.empty': 'Amount cannot be empty',
        'any.required': 'Amount is required'
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Description cannot be empty',
        'any.required': 'Description is required'
    }),
    category: Joi.string().required().messages({
        'string.empty': 'Category cannot be empty',
        'any.required': 'Category is required'
    })
}).options({ allowUnknown: true });

const expenseSchema = Joi.object({
    amount: Joi.number().required().messages({
        'number.base': 'Amount must be a number',
        'number.empty': 'Amount cannot be empty',
        'any.required': 'Amount is required'
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Description cannot be empty',
        'any.required': 'Description is required'
    }),
    category: Joi.string().optional().messages({
        'string.empty': 'Category cannot be empty',
        'any.required': 'Category is required'
    })
}).options({ allowUnknown: true });

const categorySchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name cannot be empty',
        'any.required': 'Name is required'
    }),
    type: Joi.string().valid('income', 'expense').required().messages({
        'string.empty': 'Type cannot be empty',
        'any.required': 'Type is required',
        'any.only': 'Type must be either "income" or "expense"'
    })
}).options({ allowUnknown: true });

module.exports = {
    signupSchema,
    verifySchema,
    loginSchema,
    resendOTPSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    incomeSchema,
    expenseSchema,
    categorySchema
};
