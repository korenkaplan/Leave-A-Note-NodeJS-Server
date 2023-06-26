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
const note_validation_1 = __importDefault(require("@/resources/note/note.validation"));
const note_service_1 = __importDefault(require("@/resources/note/note.service"));
class NoteController {
    constructor() {
        this.path = '/notes';
        this.router = (0, express_1.Router)();
        this.NoteService = new note_service_1.default();
        this.createNote = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { damaged_user_id, hitting_user_car, hitting_user_phone, hitting_user_name, imageSource } = req.body;
                const isSaved = yield this.NoteService.addNote(damaged_user_id, hitting_user_car, hitting_user_phone, hitting_user_name, imageSource);
                isSaved ? res.status(201).json({ data: isSaved }) : res.status(200).json({ data: 'save unsuccessful' });
            }
            catch (error) {
                throw new http_exception_1.default(400, error.message);
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/createNote`, (0, validation_middleware_1.default)(note_validation_1.default.createNote), this.createNote);
    }
}
exports.default = NoteController;
