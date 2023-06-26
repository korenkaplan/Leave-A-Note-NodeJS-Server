"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const register = joi_1.default.object({
    name: joi_1.default.string().required().max(30),
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().min(6).max(12),
    carNumber: joi_1.default.string().min(7).max(8),
    phoneNumber: joi_1.default.string().length(10)
});
const carSearch = joi_1.default.object({
    carNumber: joi_1.default.string().min(7).max(8),
});
const login = joi_1.default.object({
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().required()
});
const deleteMessage = joi_1.default.object({
    userId: joi_1.default.string().required(),
    messageId: joi_1.default.string().required(),
});
const passwordUpdate = joi_1.default.object({});
exports.default = { login, register, carSearch, deleteMessage, passwordUpdate };
