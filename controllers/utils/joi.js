const validateWithJoi = (schema, object) => {
  const { error } = schema.validate(object);

  if (error && error.details[0].message === '"categoryIds" is not allowed') {
    error.details[0].message = 'Categories cannot be edited';
  }
  
  if (error) throw error;
};

module.exports = {
  validateWithJoi,
};
