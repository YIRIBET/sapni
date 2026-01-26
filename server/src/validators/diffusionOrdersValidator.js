const joi = require('joi');

const create = joi.object({
    total_spots_ordered: joi.number().integer().positive().required(),
    contract_amount: joi.string().max(100).required(),
    campaign_id: joi.number().integer().positive().required(),
    media_channel_id: joi.number().integer().positive().required()
});

const update = joi
    .object({
        total_spots_ordered: joi.number().integer().positive(),
        contract_amount: joi.string().max(100),
        campaign_id: joi.number().integer().positive(),
        media_channel_id: joi.number().integer().positive()
    })
    .min(1);

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

const idParamSchema = joi.object({
    id: joi.number().integer().positive().required(),
});

module.exports = {
    create,
    update,
    idParamSchema,
    validateCreate,
    validateUpdate
};