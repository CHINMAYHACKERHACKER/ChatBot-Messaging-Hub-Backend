import Joi from "joi";

/**
 * Middleware for validating request body against Joi schema
 * @param {Joi.Schema} schema
 * @returns {Function}
 */
function validateBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
}

export { validateBody };