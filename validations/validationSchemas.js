const Joi = require('joi');

const signupSchema = Joi.object({
    firstname: Joi.string().min(1).required()
        .messages({
            'string.empty': 'First name cannot be empty',
            'any.required': 'First name is required'
        }),
    lastname: Joi.string().min(1).required()
        .messages({
            'string.empty': 'Last name cannot be empty',
            'any.required': 'Last name is required'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email cannot be empty',
            'any.required': 'Email is required'
        }),
    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'Password must be at least {#limit} characters long',
            'string.empty': 'Password cannot be empty',
            'any.required': 'Password is required'
        })
});

const verifySchema = Joi.object({
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email cannot be empty',
            'any.required': 'Email is required'
        }),
    OTP: Joi.string().length(6).required()
        .messages({
            'string.length': 'OTP must be exactly {#limit} characters long',
            'string.empty': 'OTP cannot be empty',
            'any.required': 'OTP is required'
        })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email cannot be empty',
            'any.required': 'Email is required'
        }),
    password: Joi.string().min(6).required()
        .messages({
            'string.min': 'Password must be at least {#limit} characters long',
            'string.empty': 'Password cannot be empty',
            'any.required': 'Password is required'
        })
});

const resendOTPSchema = Joi.object({
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email cannot be empty',
            'any.required': 'Email is required'
        })
});

module.exports = {
    signupSchema,
    verifySchema,
    loginSchema,
    resendOTPSchema
};
