"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const accidentSchema = joi_1.default.object({
    hittingDriver: joi_1.default.object({
        name: joi_1.default.string().optional(),
        carNumber: joi_1.default.string().required(),
        phoneNumber: joi_1.default.string().optional(),
    }),
    date: joi_1.default.string().required(),
    imageSource: joi_1.default.string().required(),
    type: joi_1.default.string().valid('report', 'note').required(),
    isAnonymous: joi_1.default.boolean().optional(),
    isIdentify: joi_1.default.boolean().optional(),
    reporter: joi_1.default.object({
        name: joi_1.default.string().required(),
        phoneNumber: joi_1.default.string().required(),
    }).optional(),
});
exports.default = accidentSchema;
