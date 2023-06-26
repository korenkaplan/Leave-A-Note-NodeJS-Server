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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const validation_middleware_1 = __importDefault(require("@/middleware/validation.middleware"));
const user_validation_1 = __importDefault(require("@/resources/user/user.validation"));
const user_service_1 = __importDefault(require("@/resources/user/user.service"));
const authenticated_middleware_1 = __importDefault(require("@/middleware/authenticated.middleware"));
class UserController {
    constructor() {
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.UserService = new user_service_1.default();
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, carNumber, phoneNumber } = req.body;
                const token = yield this.UserService.register(name, email, carNumber, phoneNumber, password, 'user');
                res.status(200).json({ token });
            }
            catch (error) {
                next(new http_exception_1.default(400, 'Register function:' + error.message));
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const token = yield this.UserService.login(email, password);
                return res.status(200).json({ token });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.getUserQuery = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, projection } = req.body;
                const user = yield this.UserService.GetUserQuery(query, projection);
                res.status(200).json({ user });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.deleteMessageById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, messageId } = req.body;
                const result = yield this.UserService.deleteMessage(userId, messageId);
                return res.status(200).json({ result });
            }
            catch (error) {
                res.status(400).status(error.message);
            }
        });
        this.updateUserPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, oldPassword, newPassword } = req.body;
                const result = yield this.UserService.updateUserPassword(userId, oldPassword, newPassword);
                return res.status(200).json({ result });
            }
            catch (error) {
                res.status(400).status(error.message);
            }
        });
        this.deleteReadMessage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        });
        this.updateUserInformation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, update } = req.body;
                const user = yield this.UserService.updateUserInfo(userId, update);
                return res.status(200).json({ user });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/register`, (0, validation_middleware_1.default)(user_validation_1.default.register), this.register);
        this.router.post(`${this.path}/login`, (0, validation_middleware_1.default)(user_validation_1.default.login), this.login);
        this.router.post(`${this.path}/passwordUpdate`, this.updateUserPassword);
        this.router.post(`${this.path}/informationUpdate`, this.updateUserInformation);
        this.router.post(`${this.path}/deleteMessage`, (0, validation_middleware_1.default)(user_validation_1.default.deleteMessage), this.deleteMessageById);
        this.router.get(`${this.path}/getUser`, authenticated_middleware_1.default, this.getUserQuery);
    }
}
;
exports.default = UserController;
