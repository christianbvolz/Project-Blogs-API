module.exports = (err, req, res, next) => {
  if (!err.isJoi) return next(err);
  
  const error = { message: err.details[0].message };

  return res.status(400).json(error);
};
