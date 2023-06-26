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
const report_model_1 = __importDefault(require("@/resources/report/report.model"));
const user_service_1 = __importDefault(require("@/resources/user/user.service"));
const note_service_1 = __importDefault(require("@/resources/note/note.service"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const unMatchedReports_service_1 = __importDefault(require("@/resources/unMatchedReports/unMatchedReports.service"));
const mongoose_1 = require("mongoose");
class ReportService {
    constructor() {
        this.ReportModel = report_model_1.default;
        this.NoteService = new note_service_1.default();
        this.UserService = new user_service_1.default();
        this.UnMatchedReportsService = new unMatchedReports_service_1.default();
    }
    addReport(damagedCarNumber, hittingCarNumber, isAnonymous, reporter, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hittingUser = yield this.UserService.GetUserQuery({ carNumber: hittingCarNumber });
                const damagedUser = yield this.UserService.GetUserQuery({ carNumber: damagedCarNumber });
                let result = false;
                if (hittingUser && damagedUser) {
                    result = yield this.handleBothDriversFound(hittingUser, damagedUser, isAnonymous, reporter, imageUrl);
                }
                else if (!hittingUser && damagedUser) {
                    result = yield this.handleHittingDriverNotFound(damagedUser, hittingCarNumber, isAnonymous, reporter, imageUrl);
                }
                else if (hittingUser && !damagedUser) {
                    result = yield this.handleDamagedDriverNotFound(hittingUser, damagedCarNumber, isAnonymous, reporter, imageUrl);
                }
                else {
                    result = yield this.handleBothDriversNotFound(damagedCarNumber, hittingCarNumber, isAnonymous, reporter, imageUrl);
                }
                return result;
            }
            catch (error) {
                throw new http_exception_1.default(400, error.message);
            }
        });
    }
    addToUnmatchedReportsCollection(accident, damagedCarNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            //save the accident and the car number every sign up compare the car number to the reports on the list.
            try {
                yield this.UnMatchedReportsService.addUnmatchedReport(accident, damagedCarNumber);
                return true;
            }
            catch (error) {
                throw new http_exception_1.default(400, error.message);
            }
        });
    }
    ;
    handleBothDriversFound(hittingUser, damagedUser, isAnonymous, reporter, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const accidentData = {
                _id: new mongoose_1.Types.ObjectId(),
                hittingDriver: {
                    name: hittingUser.name,
                    carNumber: hittingUser.carNumber,
                    phoneNumber: hittingUser.phoneNumber,
                },
                date: this.NoteService.formatDate(),
                imageSource: imageUrl,
                type: 'report',
                isAnonymous: isAnonymous,
                isIdentify: true,
                reporter: {
                    name: reporter.name,
                    phoneNumber: reporter.phoneNumber,
                },
            };
            return yield this.UserService.addMessageToUser(accidentData, damagedUser);
        });
    }
    handleHittingDriverNotFound(damagedUser, hittingCarNumber, isAnonymous, reporter, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const accidentData = {
                hittingDriver: {
                    carNumber: hittingCarNumber,
                },
                date: this.NoteService.formatDate(),
                imageSource: imageUrl,
                type: 'report',
                isAnonymous: isAnonymous,
                isIdentify: false,
                reporter: {
                    name: reporter.name,
                    phoneNumber: reporter.phoneNumber,
                },
            };
            return yield this.UserService.addMessageToUser(accidentData, damagedUser);
        });
    }
    handleDamagedDriverNotFound(hittingUser, damagedCarNumber, isAnonymous, reporter, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const accidentData = {
                hittingDriver: {
                    name: hittingUser.name,
                    carNumber: hittingUser.carNumber,
                    phoneNumber: hittingUser.phoneNumber,
                },
                date: this.NoteService.formatDate(),
                imageSource: imageUrl,
                type: 'report',
                isAnonymous: isAnonymous,
                isIdentify: true,
                reporter: {
                    name: reporter.name,
                    phoneNumber: reporter.phoneNumber,
                },
            };
            return yield this.addToUnmatchedReportsCollection(accidentData, damagedCarNumber);
        });
    }
    handleBothDriversNotFound(damagedCarNumber, hittingCarNumber, isAnonymous, reporter, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const accidentData = {
                hittingDriver: {
                    carNumber: hittingCarNumber,
                },
                date: this.NoteService.formatDate(),
                imageSource: imageUrl,
                type: 'report',
                isAnonymous: isAnonymous,
                isIdentify: false,
                reporter: {
                    name: reporter.name,
                    phoneNumber: reporter.phoneNumber,
                },
            };
            return yield this.addToUnmatchedReportsCollection(accidentData, damagedCarNumber);
        });
    }
}
exports.default = ReportService;
