const joi = require("joi");
const { ValidationError } = require("../utils/errors");

const create = joi.object({
  order_id: joi.number().integer().positive().required(),
  user_id: joi.number().integer().positive().required(),
  media_channel_id: joi.number().integer().positive().required(),
  format_id: joi.number().integer().positive().required(),
  status_id: joi.number().integer().positive().required(),

  program_name: joi.string().max(255).allow(null, ""),
  publication_title: joi.string().max(255).allow(null, ""),

  evidence_date: joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "La fecha debe tener el formato YYYY-MM-DD",
    }),

  evidence_time: joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .required()
    .messages({
      "string.pattern.base": "La hora debe tener el formato HH:mm",
    }),

  link: joi.string().uri().allow(null, ""),
  internal_notes: joi.string().max(500).allow(null, "")
})
.custom((value, helpers) => {

  const evidenceDateTime = new Date(
    `${value.evidence_date}T${value.evidence_time}:00`
  );

  if (isNaN(evidenceDateTime.getTime())) {
    return helpers.message("Fecha u hora inválida");
  }

  const now = new Date();

  if (evidenceDateTime > now) {
    return helpers.message("La evidencia no puede registrarse en el futuro");
  }

  const MAX_BACK_MINUTES = 24 * 60;
  const diffMinutes = (now - evidenceDateTime) / 60000;

  if (diffMinutes > MAX_BACK_MINUTES) {
    return helpers.message("La evidencia excede el tiempo máximo permitido");
  }

  return value;
}, "Validación temporal");

module.exports = { create };


const idParamSchema = joi.object({
  id: joi.number().integer().positive().required(),
});

const campaignIdParamSchema = joi.object({
  campaignId: joi.number().integer().positive().required(),
});

const clientIdParamSchema = joi.object({
  clientId: joi.number().integer().positive().required(),
});

const diffusionOrderIdParamSchema = joi.object({
  diffusionOrderId: joi.number().integer().positive().required(),
});

const statusParamSchema = joi.object({
  status: joi
    .alternatives()
    .try(joi.number().integer().positive(), joi.string().min(1).max(100))
    .required(),
});

const userIdParamSchema = joi.object({
  userId: joi.number().integer().positive().required(),
});

const mediaChannelIdParamSchema = joi.object({
  mediaChannelId: joi.number().integer().positive().required(),
});

const mediaTypeIdParamSchema = joi.object({
  mediaTypeId: joi.number().integer().positive().required(),
});

const validateCreate = (data) => {
  const { error, value } = create.validate(data, {
    abortEarly: false,
    convert: false,
  });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    throw new ValidationError(messages.join(", "));
  }
  return value;
};

const validateUpdate = (data) => {
  const { error, value } = update.validate(data, {
    abortEarly: false,
    convert: false,
  });
  if (error) {
    const messages = error.details.map((detail) => detail.message);
    throw new ValidationError(messages.join(", "));
  }
  return value;
};

module.exports = {
  create,
  update,
  validateCreate,
  validateUpdate,
  idParamSchema,
  campaignIdParamSchema,
  clientIdParamSchema,
  diffusionOrderIdParamSchema,
  statusParamSchema,
  userIdParamSchema,
  mediaChannelIdParamSchema,
  mediaTypeIdParamSchema,
};
