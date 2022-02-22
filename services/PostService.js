const models = require('../models');

const create = async ({ title, content, userId }) => {
  const newPost = await models.BlogPost.create({ title, content, userId });

  return newPost;
};

module.exports = {
  create,
};
