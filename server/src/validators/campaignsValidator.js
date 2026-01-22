const joi = require("joi");
const { ValidationError } = require("../utils/errors");

const create = joi.object({
  campaign_name: joi.string().max(150).required(),
  start_date: joi.date().iso().required(),
  end_date: joi.date().iso().required(),
  client_id: joi.number().integer().positive().required(),
});

const update = joi
  .object({
    campaign_name: joi.string().max(150),
    start_date: joi.date().iso(),
    end_date: joi.date().iso(),
    client_id: joi.number().integer().positive(),
  })
  .min(1);

const idParamSchema = joi.object({
  id: joi.number().integer().positive().required(),
});

// Funciones para validar y lanzar errores
const validateCreate = (data) => {
  const { error, value } = create.validate(data, { abortEarly: false, convert: false });
  if (error) {
    const messages = error.details.map(detail => detail.message);
    throw new ValidationError(messages.join(", "));
  }
  return value;
};

const validateUpdate = (data) => {
  const { error, value } = update.validate(data, { abortEarly: false, convert: false });
  if (error) {
    const messages = error.details.map(detail => detail.message);
    throw new ValidationError(messages.join(", "));
  }
  return value;
};

const validateId = (id) => {
  const { error, value } = idParamSchema.validate({ id }, { abortEarly: false, convert: false });
  if (error) {
    const messages = error.details.map(detail => detail.message);
    throw new ValidationError(messages.join(", "));
  }
  return value;
};

module.exports = {
  create,
  update,
  idParamSchema,
  validateCreate,
  validateUpdate,
  validateId,
};