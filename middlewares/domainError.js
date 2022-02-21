const errorMap = {
  NotFound: 404,
};

module.exports = (err, req, res, next) => {
  if (!err.code || !errorMap[err.code]) return next(err);

  return res.status(errorMap[err.code]).json({
    code: err.code,
    message: err.message,
  });
};
