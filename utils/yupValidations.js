const validate = (schema) => async (req, res, next) => {
  try {
    // Validate each part of the request using Joi
    await schema.validateAsync({
      body: req.body,
      // query: req.query,
      // params: req.params,
    }, { abortEarly: false }); // abortEarly: false to collect all errors

    // Proceed to the next middleware if validation is successful
    next();
  } catch (err) {
    // Joi validation errors are accessible in err.details
    const errors = err.details.map(detail => detail.message);

    // Send a response with a 400 status code and a descriptive error message
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors,
    });
  }
};

export default validate;
