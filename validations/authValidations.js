import Joi from 'joi';
import { allowedHobbies } from '../utils/constant.js';



const schemas = {
  loginSchema: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .required('please enter your password')
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'password')
        .message('Must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 special Character'),
    }).required().unknown(false), // Enforce no additional properties
  }),

  logoutSchema: Joi.object({
    body: Joi.object({
      refreshToken: Joi.string().required(),
    }).required().unknown(false),
  }),

  refreshTokenSchema: Joi.object({
    body: Joi.object({
      refreshToken: Joi.string().required(),
    }).required().unknown(false),
  }),

  registerAdminSchema: Joi.object({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .required('please enter your password')
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'password')
        .message('Must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 special Character'),
      role: Joi.string().valid('admin').default('admin').messages({
          'string.valid': 'Role must be admin',
        }),
        isBlock: Joi.boolean().default(false),
        isAdminApproved: Joi.boolean().default(false),
        isDeleted: Joi.boolean().default(false),
    }).required().unknown(false), // Enforce no additional properties
  }), 

  registerSchema: Joi.object({
    body: Joi.object({
      firstName: Joi.string().min(1).max(255).required().messages({
        'string.empty': 'First name is required',
        'string.min': 'First name should have at least 1 character',
        'string.max': 'First name should have at most 255 characters',
      }),
      lastName: Joi.string().min(1).max(255).required().messages({
        'string.empty': 'Last name is required',
        'string.min': 'Last name should have at least 1 character',
        'string.max': 'Last name should have at most 255 characters',
      }),
      gender: Joi.string().valid('male', 'female').required().messages({
        'string.empty': 'Gender is required',
        'any.only': 'Gender must be one of male or female',
      }),
      hobby: Joi.array().items(Joi.string().valid(...allowedHobbies)).min(1).required().messages({
        'array.base': 'Hobbies must be an array of strings',
        'array.min': 'At least one hobby is required',
        'string.valid': `Each hobby must be one of the following: ${allowedHobbies.join(', ')}`,
      }),
      email: Joi.string().email().required(),
      password: Joi.string()
        .required('please enter your password')
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'password')
        .message('Must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 special Character'),
      role: Joi.string().valid('user', 'admin').default('user').messages({
          'string.valid': 'Role must be either user or admin',
        }),
      loginCount: Joi.number().integer().min(0).default(0).messages({
          'number.base': 'Login count must be a number',
          'number.integer': 'Login count must be an integer',
          'number.min': 'Login count cannot be negative',
        }),
      isBlock: Joi.boolean().default(false).required(),
      isAdminApproved: Joi.boolean().default(false).required(),
      isDeleted: Joi.boolean().default(false).required(),
    }).required().unknown(false), // Enforce no additional properties
  }),

  resetPasswordSchema: Joi.object({
    body: Joi.object({
      password: Joi.string().min(3).max(128).required(),
      newPassword: Joi.string()
        .required('please enter your password')
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'password')
        .message('Must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 special Character'),

      newPasswordConfirm: Joi.string()
        .required()
        .valid(Joi.ref('newPassword'))
        .messages({'any.only': 'Passwords must match'}),
    }).required().unknown(false), // Enforce no additional properties
  }),

  googleUserSchema: Joi.object({
    body: Joi.object({
      token: Joi.string().required(),
    }).required().unknown(false),
  }),
};

export default schemas;
