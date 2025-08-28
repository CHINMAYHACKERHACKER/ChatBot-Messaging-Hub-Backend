import Joi from "joi";

export const telgramConnectReqModel = Joi.object({
    botToken: Joi.string().required(),
    clientId: Joi.string().required(),
    createdBy: Joi.number().required(),
    webhookUrl: Joi.string().allow('', null).required()
});

export const getTelegramConnectionReqlModel = Joi.object({
    clientId: Joi.string().required()
});

export const createTelegramBotReqModel = Joi.object({
    prompt: Joi.string().required(),
    createdBy: Joi.number().required(),
    clientId: Joi.string().required()
});

export const publishTelegramBotReqModel = Joi.object({
    clientId: Joi.string().required(),
    botId: Joi.number().required(),
    customBotName: Joi.string().required(),
    botDescription: Joi.string().required(),
    botUserName: Joi.string().required(),
    botCreatedBy: Joi.number().required(),
    isPublished: Joi.boolean().default(false),
    telegramBotFlowJson: Joi.alternatives().try(Joi.any()).required()
});