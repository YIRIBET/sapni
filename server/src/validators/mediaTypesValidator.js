const Joi = require('joi');

// Definimos el campo una sola vez
const typeNameField = Joi.string().trim().min(3).max(50).messages({
  'string.empty': 'type_name no puede estar vacío',
  'string.min': 'type_name debe tener al menos 3 caracteres',
  'string.max': 'type_name no puede tener más de 50 caracteres',
  'any.required': 'type_name es requerido'
});

const createMediaTypeSchema = Joi.object({
  type_name: typeNameField.required()
});

const updateMediaTypeSchema = Joi.object({
  type_name: typeNameField.required() 
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'El id debe ser numérico',
    'number.positive': 'El id debe ser positivo',
    'any.required': 'El id es requerido'
  })
});

module.exports = { createMediaTypeSchema, updateMediaTypeSchema, idParamSchema };