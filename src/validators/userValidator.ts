import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  firstName: Joi.string().min(1).max(100).required().messages({
    'string.min': 'First name cannot be empty',
    'string.max': 'First name cannot exceed 100 characters',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().min(1).max(100).required().messages({
    'string.min': 'Last name cannot be empty',
    'string.max': 'Last name cannot exceed 100 characters',
    'any.required': 'Last name is required',
  }),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().min(6).messages({
    'string.min': 'Password must be at least 6 characters long',
  }),
  firstName: Joi.string().min(1).max(100).messages({
    'string.min': 'First name cannot be empty',
    'string.max': 'First name cannot exceed 100 characters',
  }),
  lastName: Joi.string().min(1).max(100).messages({
    'string.min': 'Last name cannot be empty',
    'string.max': 'Last name cannot exceed 100 characters',
  }),
  isActive: Joi.boolean(),
}).min(1);

export const validateCreateUser = (data: any) => {
  return createUserSchema.validate(data, { abortEarly: false });
};

export const validateUpdateUser = (data: any) => {
  return updateUserSchema.validate(data, { abortEarly: false });
};