const models = require('../models');

const create = async ({ postId, categoryId }) => {
  const postCategory = await models.PostCategory.create({ postId, categoryId });

  return postCategory;
};

module.exports = {
  create,
};
