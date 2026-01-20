const Joi = require('joi');

const createUserSchema = Joi.object({
  role_id: Joi.number().integer().required(),
  media_type_id: Joi.number().integer().required(),
  nombre: Joi.string().max(100).required(),
  apellidos: Joi.string().max(100).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(255).required()
});

const updateUserSchema = Joi.object({
  role_id: Joi.number().integer(),
  media_type_id: Joi.number().integer(),
  nombre: Joi.string().max(100),
  apellidos: Joi.string().max(100),
  email: Joi.string().email().max(100),
  password: Joi.string().min(6).max(255)
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  idParamSchema
};
