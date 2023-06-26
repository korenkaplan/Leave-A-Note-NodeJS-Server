import Joi from 'joi';
import {IAccident} from './accident.interface';
const accidentSchema = Joi.object<IAccident>({
  hittingDriver: Joi.object({
    name: Joi.string().optional(),
    carNumber: Joi.string().required(),
    phoneNumber: Joi.string().optional(),
  }),
  date: Joi.string().required(),
  imageSource: Joi.string().required(),
  type: Joi.string().valid('report', 'note').required(),
  isAnonymous: Joi.boolean().optional(),
  isIdentify: Joi.boolean().optional(),
  reporter: Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  }).optional(),
});

export default accidentSchema;
