import Joi from 'joi';

  // Add validation functions here
const registeredUsersPerMonth  = Joi.object({
  role: Joi.string().valid('admin').required(),
  year: Joi.string().required(),
})
const getReportsDistribution  = Joi.object({
  role: Joi.string().valid('admin').required(),
})
export default {registeredUsersPerMonth,getReportsDistribution}
