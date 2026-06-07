import Joi from 'joi';

// Define a schema for recruiter registration data
export const RecruiterSignUpSchema = Joi.object({
    privateEmail: Joi.string().email().required().messages({
        'string.email': 'Invalid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    phoneNumber: Joi.string().required().messages({
        'any.required': 'Phone number is required'
    }),
    orgTaxNumber: Joi.string().required().messages({
        'any.required': 'Organization tax number is required'
    }),
    orgName: Joi.string().required().messages({
        'any.required': 'Organization name is required'
    }),
    orgField: Joi.string().required().messages({
        'any.required': 'Organization field is required'
    }),
    orgScale: Joi.string().required().messages({
        'any.required': 'Organization scale is required'
    }),
    orgAddress: Joi.string().required().messages({
        'any.required': 'Organization address is required'
    })
});
// Define a schema for recruiter login data
export const RecruiterLoginSchema = Joi.object({
    privateEmail: Joi.string().email().required().messages({
        'string.email': 'Invalid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    })
});
