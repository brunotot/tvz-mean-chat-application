const Joi = require('@hapi/joi');
const Role = require('../models/Role');

const registerValidation = (body) => {
    if (body.role) {
        body.role = body.role.toUpperCase();
    }
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
        role: Joi.string().valid(Role.ADMIN, Role.USER)
    });
    return schema.validate(body);
};

const loginValidation = (body) => {
    const schema = Joi.object({
        username: Joi.string().min(5).required(),
        password: Joi.string().min(5).required()
    });
    return schema.validate(body);
};

module.exports = {
    registerValidation: registerValidation,
    loginValidation: loginValidation
}