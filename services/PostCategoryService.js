const models = require('../models');

const create = async ({ postId, categoryId }) => {
  const postCategory = await models.PostCategory.create({ postId, categoryId });

  return postCategory;
};

const deletePostCategory = async ({ postId }) => {
  const postCategory = await models.PostCategory.destroy({ where: { postId } });

  return postCategory;
};

module.exports = {
  create,
  deletePostCategory,
};
