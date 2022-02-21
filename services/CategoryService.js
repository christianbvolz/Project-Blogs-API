const models = require('../models');

const findCategory = async ({ name }) => {
  const [category] = await models.Category.findAll({ where: { name } });

  return category;
};

const create = async ({ name }) => {
  const category = await models.Category.create({ name });

  return category;
};

module.exports = {
  findCategory,
  create,
};
