import Joi from 'joi';

const reportValidationSchema = Joi.object({
  imageUrl: Joi.string().required(),
  damagedCarNumber: Joi.string().min(7).max(8).required(),
  hittingCarNumber: Joi.string().min(7).max(8).required(),
  isAnonymous: Joi.boolean().required(),
  reporter: Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().length(10),
  }).required(),
});

export default {reportValidationSchema};
