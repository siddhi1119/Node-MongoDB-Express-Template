import Joi from 'joi';

const schemas = {

  blockUserSchema: Joi.object({
    params: Joi.object({
      id: Joi.string().required().messages({
        'any.required': 'userId is required',
        'string.empty': 'userId cannot be empty',
      }),
    }),
  }),

};

export default schemas;