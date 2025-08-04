import Joi from 'joi';



export const registerUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "string.base": `"name" must be a string`,
        "string.min": `"name" should have a minimum length of 3`,
        "any.required": `"name" is a required field`,
    }),
    
    email: Joi.string().email().required().messages({ "string.email": `"email" must be a valid email`, }),

    password: Joi.string().required().messages({"any.required": `"password" is a required field`,}),
    
});




export const loginUserSchema = Joi.object({
    email: Joi.string().email().required().messages({ "string.email": `"email" must be a valid email`, }),

    password: Joi.string().required().messages({"any.required": `"password" is a required field`,}),
    
});




export const resetEmailSchema = Joi.object({
    email: Joi.string().email().required(),

});



export const resetPasswordSchema = Joi.object({
    password: Joi.string().required(),
    
    token: Joi.string().required(),
  
});