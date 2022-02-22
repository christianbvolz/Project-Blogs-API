const models = require('../models');

const create = async ({ title, content, userId }) => {
  const newPost = await models.BlogPost.create({ title, content, userId });

  return newPost;
};

const findAll = async () => {
  const allPosts = await models.BlogPost.findAll({
    include: [{ model: models.User, as: 'user' }, { model: models.Category, as: 'categories' }],
  });

  return allPosts;
};

module.exports = {
  create,
  findAll,
};
