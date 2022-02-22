const router = require('express').Router();
const rescue = require('express-rescue');
const Joi = require('joi');
const UserService = require('../services/UserService');
const PostService = require('../services/PostService');
const PostCategoryService = require('../services/PostCategoryService');
const validateAuthorization = require('./utils/validateAuthorization');
const { validateWithJoi } = require('./utils/joi');

const userSchema = Joi.object({
  displayName: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
  image: Joi.string().required(),
});

router.post('/', rescue(async (req, res) => {
  const { displayName, email, password, image } = req.body;
  validateWithJoi(userSchema, { displayName, email, password, image });
  const user = await UserService.findByEmail(email);

  if (user) return res.status(409).json({ message: 'User already registered' });

  const { token } = await UserService.create({ displayName, email, password, image });

  return res.status(201).json({ token });
}));

router.get('/', rescue(async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  const authorized = await validateAuthorization(authorization);

  if (!authorized) return res.status(401).json({ message: 'Expired or invalid token' });

  const users = await UserService.listAll();

  return res.status(200).json(users);
}));

router.get('/:id', rescue(async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;
  
  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  const authorized = await validateAuthorization(authorization);

  if (!authorized) return res.status(401).json({ message: 'Expired or invalid token' });

  const user = await UserService.findById(id);

  if (!user) return res.status(404).json({ message: 'User does not exist' });

  return res.status(200).json(user);
}));

router.delete('/me', rescue(async (req, res) => {
  const { authorization } = req.headers;
  
  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  const authorized = await validateAuthorization(authorization);

  if (!authorized) return res.status(401).json({ message: 'Expired or invalid token' });

  const allPosts = await PostService.findAll();

  const postIds = allPosts.filter((post) => post.userId === authorized.id).map((post) => post.id);

  await PostCategoryService.deletePostCategory({ postId: postIds });

  await PostService.deletePostByUser({ userId: authorized.id });

  await UserService.deleteUser({ id: authorized.id });

  return res.status(204).end();
}));

module.exports = router;
