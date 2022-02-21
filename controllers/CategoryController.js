const router = require('express').Router();
const rescue = require('express-rescue');
const Joi = require('joi');
const categoryService = require('../services/CategoryService');
const validateAuthorization = require('./utils/validateAuthorization');
const { validateWithJoi } = require('./utils/joi');

const categorySchema = Joi.object({ name: Joi.string().required() });

router.post('/', rescue(async (req, res) => {
  const { authorization } = req.headers;
  const { name } = req.body;
  
  validateWithJoi(categorySchema, { name });

  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  const authorized = await validateAuthorization(authorization);

  if (!authorized) return res.status(401).json({ message: 'Expired or invalid token' });

  const category = await categoryService.findCategory({ name });

  if (category) return res.status(409).json({ message: 'Category already registered' });

  const newCategory = await categoryService.create({ name });

  return res.status(201).json(newCategory);
}));

module.exports = router;