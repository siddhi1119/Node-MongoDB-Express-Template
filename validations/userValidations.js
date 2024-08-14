import Joi from 'joi';

const schemas = {
  profileSchema: Joi.object({
    access: Joi.object({
      userId: Joi.string().required(),
    }).required(),
  }).required(),
};

export default schemas;
