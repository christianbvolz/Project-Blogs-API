const jwt = require('jsonwebtoken');
const SECRET = require('../../config/secret');

module.exports = async (authorization) => {
  try {
    const result = jwt.verify(authorization, SECRET);
    return result;
  } catch (_error) {
    return false;
  }
};