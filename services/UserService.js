const jwt = require('jsonwebtoken');

const models = require('../models');

const SECRET = require('../config/secret');

const create = async ({ displayName, email, password, image }) => {
  const user = await models.User.create({ displayName, email, password, image });
  
  const token = jwt.sign(user.dataValues, SECRET, {
    algorithm: 'HS256',
    expiresIn: '1d',
  });

  return { token, user };
};

const findByEmail = async (email) => {
  const [user] = await models.User.findAll({ where: { email } });
  
  if (!user) return false;

  return true;
};

const validateLogin = async ({ email, password }) => {
  const [user] = await models.User.findAll({ where: { email, password } });
  
  if (user) {
    const token = jwt.sign(user.dataValues, SECRET, {
      algorithm: 'HS256',
      expiresIn: '1d',
    });
  
    return { token, user };
  }

  return false;
};

const listAll = async () => {
  const users = await models.User.findAll();

  return users;
};

const findById = async (id) => {
  const [user] = await models.User.findAll({ where: { id } });

  return user;
};

const deleteUser = async ({ id }) => {
  const result = await models.User.destroy({ where: { id } });

  return result;
};

module.exports = {
  create,
  findByEmail,
  validateLogin,
  listAll,
  findById,
  deleteUser,
};
