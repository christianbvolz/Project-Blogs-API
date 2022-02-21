const router = require('express').Router();
const rescue = require('express-rescue');
const Joi = require('joi');
const userService = require('../services/UserService');
const { validateWithJoi } = require('./utils/joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().length(6).required(),
});

router.post('/', rescue(async (req, res) => {
  const { email, password } = req.body;
  validateWithJoi(loginSchema, { email, password });
  const user = await userService.validateLogin({ email, password });

  if (!user) return res.status(400).json({ message: 'Invalid fields' });

  return res.status(200).json({ token: user.token });
}));

module.exports = router;
