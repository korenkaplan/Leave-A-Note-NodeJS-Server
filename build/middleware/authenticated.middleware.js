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
const token_1 = require("@/utils/token");
const user_model_1 = __importDefault(require("@/resources/user/user.model"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticatedMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bearer = req.headers.authorization;
        if (!bearer || !bearer.startsWith('Bearer ')) {
            return next(new http_exception_1.default(401, 'Unauthorized'));
        }
        const accessToken = bearer.split('Bearer ')[1];
        try {
            const payload = yield (0, token_1.verifyToken)(accessToken);
            if (payload instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return next(new http_exception_1.default(401, 'Unauthorized'));
            }
            const user = yield user_model_1.default.findById(payload.id).select("-password").exec();
            if (!user) {
                return next(new http_exception_1.default(401, 'Unauthorized'));
            }
            req.user = user;
            next();
        }
        catch (e) {
            return next(new http_exception_1.default(401, e.message));
        }
    });
}
;
exports.default = authenticatedMiddleware;
