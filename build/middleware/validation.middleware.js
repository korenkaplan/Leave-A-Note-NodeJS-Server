"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function validationMiddleware(schema) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const validationOptions = {
            abortEarly: true,
            allowUnknown: true,
            stripUnknown: true, // will get rid of the unknown values that are not part of the schema.
        };
        try {
            const value = yield schema.validateAsync(req.body, validationOptions); // value is going to be equal to the value passed trough after being compared to the schema and applying validationOptions. 
            req.body = value;
            next();
        }
        catch (e) {
            const errors = [];
            e.details.forEach((error) => {
                errors.push(error.message);
            });
            res.status(400).send({ errors });
        }
    });
}
;
exports.default = validationMiddleware;
