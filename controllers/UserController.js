const router = require('express').Router();
const rescue = require('express-rescue');
const Joi = require('joi');
const userService = require('../services/UserService');
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
  const user = await userService.findByEmail(email);

  if (user) return res.status(409).json({ message: 'User already registered' });

  const { token } = await userService.create({ displayName, email, password, image });

  return res.status(201).json({ token });
}));

router.get('/', rescue(async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Token not found' });

  const authorized = await userService.validateAuthorization(authorization);

  if (!authorized) return res.status(401).json({ message: 'Expired or invalid token' });

  const users = await userService.listAll();

  return res.status(200).json(users);
}));

module.exports = router;
