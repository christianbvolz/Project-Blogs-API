const models = require('../models');

const findCategory = async ({ name }) => {
  const [category] = await models.Category.findAll({ where: { name } });

  return category;
};

const create = async ({ name }) => {
  const category = await models.Category.create({ name });

  return category;
};

const getAll = async () => {
  const categories = await models.Category.findAll();
  
  return categories;
};

module.exports = {
  findCategory,
  create,
  getAll,
};
