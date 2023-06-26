"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const reportValidationSchema = joi_1.default.object({
    imageUrl: joi_1.default.string().required(),
    damagedCarNumber: joi_1.default.string().min(7).max(8).required(),
    hittingCarNumber: joi_1.default.string().min(7).max(8).required(),
    isAnonymous: joi_1.default.boolean().required(),
    reporter: joi_1.default.object({
        name: joi_1.default.string().required(),
        phoneNumber: joi_1.default.string().length(10),
    }).required(),
});
exports.default = { reportValidationSchema };
