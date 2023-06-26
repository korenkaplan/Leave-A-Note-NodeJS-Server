"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const createNote = joi_1.default.object({
    damaged_user_id: joi_1.default.string().required(),
    hitting_user_car: joi_1.default.string().required(),
    hitting_user_phone: joi_1.default.string().required(),
    hitting_user_name: joi_1.default.string().required(),
    imageSource: joi_1.default.string().required(),
});
exports.default = { createNote };
