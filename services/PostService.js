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

const findOne = async (id) => {
  const post = await models.BlogPost.findOne({
    where: { id },
    include: [{ model: models.User, as: 'user' }, { model: models.Category, as: 'categories' }],
  });

  return post;
};

const update = async ({ id, title, content }) => {
  const editedPost = await models.BlogPost.update({ title, content }, { where: { id } });

  return editedPost;
};

const deletePost = async ({ id }) => {
  const editedPost = await models.BlogPost.destroy({ where: { id } });
  
  return editedPost;
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  deletePost,
};
