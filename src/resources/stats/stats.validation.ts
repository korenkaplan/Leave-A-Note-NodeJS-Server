import Joi from 'joi';

  // Add validation functions here
const registeredUsersPerMonth  = Joi.object({
  role: Joi.string().valid('admin').required(),
  year: Joi.string().required(),
})

export default {registeredUsersPerMonth}
