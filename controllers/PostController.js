const router = require('express').Router();
const rescue = require('express-rescue');
const Joi = require('joi');
const postService = require('../services/PostService');
const CategoryService = require('../services/CategoryService');
const validateAuthorization = require('./utils/validateAuthorization');
const { validateWithJoi } = require('./utils/joi');

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  categoryIds: Joi.array().required(),
});

router.post('/', rescue(async (req, res) => {
  const { authorization } = req.headers;
  const { title, content, categoryIds } = req.body;
  validateWithJoi(postSchema, { title, content, categoryIds });

  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  const authorized = await validateAuthorization(authorization);

  if (!authorized) return res.status(401).json({ message: 'Expired or invalid token' });

  const categories = await CategoryService.findCategories(categoryIds);

  if (categories.length < categoryIds.length) {
    return res.status(400).json({ message: '"categoryIds" not found' });
  }

  const newPost = await postService.create({ title, content, userId: authorized.id });

  return res.status(201).json(newPost);
}));

module.exports = router;
