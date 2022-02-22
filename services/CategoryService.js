const models = require('../models');

const findByName = async ({ name }) => {
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

const findById = async (categoryIds) => {
  const category = await models.Category.findAll({ where: { id: categoryIds } });

  return category;
};

module.exports = {
  findByName,
  create,
  getAll,
  findById,
};
