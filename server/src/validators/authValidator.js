const Joi = require('joi');

const registerSchema = Joi.object({
  role_id: Joi.number().integer().required(),
  media_type_id: Joi.number().integer().required(),
  nombre: Joi.string().max(100).required(),
  apellidos: Joi.string().max(100).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(255).required(),
  password_confirm: Joi.string().valid(Joi.ref('password')).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(255).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema
};