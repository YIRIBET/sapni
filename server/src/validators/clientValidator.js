const Joi = require('joi');

const createClientSchema = Joi.object({
  company_name: Joi.string().max(150).required(),
  tax_id: Joi.string().max(50).required(),
  contact_person: Joi.string().max(100).required()
});

const updateClientSchema = Joi.object({
  company_name: Joi.string().max(150),
  tax_id: Joi.string().max(50),
  contact_person: Joi.string().max(100)
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.number().integer().required()
});

module.exports = {
  createClientSchema,
  updateClientSchema,
  idParamSchema
};