import { error } from 'console';
import {Request, Response, NextFunction, RequestHandler} from 'express';
import Joi,{ValidationError } from 'joi';

function validationMiddleware(schema: Joi.Schema): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const validationOptions = {
            abortEarly: true, // (false) ->if there is an error in the request , it will not return the first error it encountered, instead it will go through all the request and return all the errors.
            allowUnknown: true, // allow values that are not part of the schema. will stop from crushing when getting something not in the schema.
            stripUnknown: true, // will get rid of the unknown values that are not part of the schema.
        };

        try {
            const value = await schema.validateAsync(req.body, validationOptions); // value is going to be equal to the value passed trough after being compared to the schema and applying validationOptions. 
            req.body = value;
            next();
        } catch (e: any) {
            const errors: string[] = [];
            e.details.forEach((error: Joi.ValidationErrorItem)=>{
                errors.push(error.message);
            });
            res.status(400).send({errors});
        }
    };
};
export default validationMiddleware;