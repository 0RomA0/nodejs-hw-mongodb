import Joi from 'joi';

export const createContactsSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "string.base": `"name" must be a string`,
        "string.min": `"name" should have a minimum length of 3`,
        "any.required": `"name" is a required field`,
    }),
    phoneNumber: Joi.string().min(13).pattern(/^\+380\d{9}$/).required().messages({
        "string.pattern.base": `"phoneNumber" must be in the format +380XXXXXXXXX`,
        "any.required": `"phoneNumber" is a required field`,
    }),
    email: Joi.string().email().messages({ "string.email": `"email" must be a valid email`, }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid("work", "home", "personal").required(),

});

export const updateContactsSchema = Joi.object({
    name: Joi.string().min(3).max(30).messages({
        "string.base": `"name" must be a string`,
        "string.min": `"name" should have a minimum length of 3`,
    }),
    phoneNumber: Joi.string().min(13).pattern(/^\+380\d{9}$/).messages({
        "string.pattern.base": `"phoneNumber" must be in the format +380XXXXXXXXX`,
    }),
    email: Joi.string().email().messages({ "string.email": `"email" must be a valid email`, }),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid("work", "home", "personal"),

});



