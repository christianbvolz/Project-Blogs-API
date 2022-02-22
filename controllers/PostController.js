const router = require('express').Router();
const rescue = require('express-rescue');
const Joi = require('joi');
const PostService = require('../services/PostService');
const CategoryService = require('../services/CategoryService');
const PostCategoryService = require('../services/PostCategoryService');

const validateAuthorization = require('./utils/validateAuthorization');
const { validateWithJoi } = require('./utils/joi');

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  categoryIds: Joi.array().required(),
});

const postUpdateSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  categoryIds: Joi.any().forbidden(),
});

router.post('/', rescue(async (req, res) => {
  const { authorization } = req.headers;
  const { title, content, categoryIds } = req.body;
  validateWithJoi(postSchema, { title, content, categoryIds });

  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  const authorized = await validateAuthorization(authorization);

  if (!authorized) return res.status(401).json({ message: 'Expired or invalid token' });

  const categories = await CategoryService.findById(categoryIds);

  if (categories.length < categoryIds.length) {
    return res.status(400).json({ message: '"categoryIds" not found' });
  }

  const newPost = await PostService.create({ title, content, userId: authorized.id });

  categoryIds.forEach(async (categoryId) => {
    await PostCategoryService.create({ postId: newPost.id, categoryId });
  });

  return res.status(201).json(newPost);
}));

router.get('/', rescue(async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  const authorized = await validateAuthorization(authorization);

  if (!authorized) return res.status(401).json({ message: 'Expired or invalid token' });

  const allPosts = await PostService.findAll();

  return res.status(200).json(allPosts);
}));

router.get('/:id', rescue(async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;

  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  const authorized = await validateAuthorization(authorization);

  if (!authorized) return res.status(401).json({ message: 'Expired or invalid token' });

  const post = await PostService.findOne(id);

  if (!post) return res.status(404).json({ message: 'Post does not exist' });

  return res.status(200).json(post);
}));

router.put('/:id', rescue(async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;
  const { title, content, categoryIds } = req.body;
  
  validateWithJoi(postUpdateSchema, { title, content, categoryIds });

  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  const authorized = await validateAuthorization(authorization);
  
  if (!authorized) return res.status(401).json({ message: 'Expired or invalid token' });

  const post = await PostService.findOne(id);

  if (!post) return res.status(404).json({ message: 'Post does not exist' });

  if (authorized.id !== post.userId) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }

  await PostService.update({ id, title, content });
  
  return res.status(200).json({ title, content, userId: post.userId, categories: post.categories });
}));

module.exports = router;
