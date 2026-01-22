const Joi = require('joi');

const create = Joi.object({
  channel_name: Joi.string().max(150).required(),
  social_network: Joi.string().max(50).allow(null, ''),
  frequency: Joi.string().max(20).allow(null, ''),
  contact_name: Joi.string().max(100).allow(null, ''),
  media_type_id: Joi.number().integer().positive().required()
});

const update = Joi.object({
  channel_name: Joi.string().max(150),
  social_network: Joi.string().max(50).allow(null, ''),
  frequency: Joi.string().max(20).allow(null, ''),
  contact_name: Joi.string().max(100).allow(null, ''),
  media_type_id: Joi.number().integer().positive()
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

module.exports = {
  create,
  update,
  idParamSchema
};
