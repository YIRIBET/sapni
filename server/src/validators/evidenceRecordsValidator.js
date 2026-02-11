const joi = require("joi");
const { ValidationError } = require("../utils/errors")

const create = joi.object({
    order_id: joi.number().integer().positive().required(),
    user_id: joi.number().integer().positive().required(),
    format_id: joi.number().integer().positive().required(),
    status_id: joi.number().integer().positive().required(),
    program_name: joi.string().max(255),
    publication_title: joi.string().max(255),
    evidence_date: joi.date().iso().required(),
    evidence_time: joi.string().pattern(/^\d{2}:\d{2}(:\d{2})?$/).required(),
    link: joi.string().uri().allow(null, ''),
    internal_notes: joi.string().max(500).allow(null, ''),
    attachment_path: joi.string().max(255).allow(null, ''),
});

const update = joi.object({
    order_id: joi.number().integer().positive(),
    user_id: joi.number().integer().positive(),
    format_id: joi.number().integer().positive(),
    status_id: joi.number().integer().positive(),
    program_name: joi.string().max(255),
    publication_title: joi.string().max(255),
    evidence_date: joi.date().iso(),
    evidence_time: joi.string().pattern(/^\d{2}:\d{2}(:\d{2})?$/),
    link: joi.string().uri().allow(null, ''),
    internal_notes: joi.string().max(500).allow(null, ''),
    attachment_path: joi.string().max(255).allow(null, ''),
});

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
    status: joi.alternatives().try(
        joi.number().integer().positive(),
        joi.string().min(1).max(100)
    ).required(),
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
    mediaTypeIdParamSchema
};