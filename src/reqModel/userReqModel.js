import Joi from "joi";

export const getUserByClientIdReqModel = Joi.object({
    clientId: Joi.string().required()
});