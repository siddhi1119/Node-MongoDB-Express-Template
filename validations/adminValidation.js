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

  postValidationSchema: Joi.object({
    body: Joi.object({
      title: Joi.string().required().messages({
        'string.empty': 'Title is required',
      }),
      image: Joi.string().required().messages({
        'string.empty': 'Image URL is required',
      }),
      description: Joi.string().required().messages({
        'string.empty': 'Description is required',
      }),
      category: Joi.array().items(Joi.string().required()).required().messages({
        'array.base': 'Category must be an array of strings',
        'array.includesRequiredUnknowns': 'Category cannot be empty',
      }),
      likes: Joi.number().integer().min(0).default(0),
      isLiked: Joi.boolean().default(false),
    }).required().unknown(false),
  }),
};

export default schemas;