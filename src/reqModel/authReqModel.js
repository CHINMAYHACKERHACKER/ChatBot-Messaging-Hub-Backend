import Joi from "joi";

export const signUpReqModel = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    accessLevel: Joi.string().when('role', {
        is: 'user',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    }),
    clientId: Joi.string().when('role', {
        is: 'user',
        then: Joi.string().required(),
        otherwise: Joi.string().optional()
    })
});

export const loginReqModel = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const forgotPasswordReqModel = Joi.object({
    email: Joi.string().email().required()
});