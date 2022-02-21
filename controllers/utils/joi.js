const validateWithJoi = (schema, object) => {
  const { error } = schema.validate(object);

  if (error) throw error;
};

module.exports = {
  validateWithJoi,
};
