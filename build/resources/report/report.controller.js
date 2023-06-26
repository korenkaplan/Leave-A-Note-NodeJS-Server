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
const report_validation_1 = __importDefault(require("@/resources/report/report.validation"));
const report_service_1 = __importDefault(require("@/resources/report/report.service"));
class ReportController {
    constructor() {
        this.path = '/reports';
        this.router = (0, express_1.Router)();
        this.ReportService = new report_service_1.default();
        this.createReport = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { imageUrl, damagedCarNumber, hittingCarNumber, isAnonymous, reporter } = req.body;
                const isSaved = yield this.ReportService.addReport(damagedCarNumber, hittingCarNumber, isAnonymous, reporter, imageUrl);
                isSaved ? res.status(201).json({ data: isSaved }) : res.status(200).json({ data: 'save unsuccessful' });
            }
            catch (error) {
                throw new http_exception_1.default(400, error.message);
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Define your routes here
        this.router.post(`${this.path}/createReport`, (0, validation_middleware_1.default)(report_validation_1.default.reportValidationSchema), this.createReport);
    }
}
exports.default = ReportController;
