import Joi from 'joi';

  const createNote = Joi.object({
    damaged_user_id: Joi.string().required(),
    hitting_user_car: Joi.string().required(),
    hitting_user_phone: Joi.string().required(),
    hitting_user_name: Joi.string().required(),
    imageSource: Joi.string().required(),
  });

  export default {createNote};