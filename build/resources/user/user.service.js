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
const user_model_1 = __importDefault(require("@/resources/user/user.model"));
const token_1 = __importDefault(require("@/utils/token"));
const mongoose_1 = require("mongoose");
const unMatchedReports_model_1 = __importDefault(require("@/resources/unMatchedReports/unMatchedReports.model"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
class UserService {
    constructor() {
        this.user = user_model_1.default;
        this.unMatchedReportsModel = unMatchedReports_model_1.default;
    }
    /**
     * Register a new user
     */
    register(name, email, carNumber, phoneNumber, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.create({ name, email, password, phoneNumber, carNumber, role, accidents: [], unreadMessages: [] });
                const unMatchedReports = yield this.SearchUnmatchedReports(user);
                if (unMatchedReports) {
                    yield this.AddUnmatchedReportsToUser(user, unMatchedReports);
                    console.log('successfully Added unMatchedReports');
                }
                const accessToken = token_1.default.createToken(user);
                return accessToken;
            }
            catch (error) {
                throw new Error('register service: ' + error.message);
            }
        });
    }
    ;
    /**
    * Attempt to login a user
    */
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //search for a user with this email in the database
                const user = yield this.user.findOne({ email });
                if (!user) { //if not found
                    throw new Error('User not found with email: ' + email);
                }
                //if found validate the password , else throw and error that the credentials are incorrect
                if (yield user.isValidPassword(password)) {
                    return token_1.default.createToken(user);
                }
                else {
                    throw new Error('Wrong credentials were provided');
                }
            }
            catch (error) {
                throw new Error('Unable to login: ' + error.message);
            }
        });
    }
    ;
    /**
     * Add new message to user's unread messages and accidents.
     */
    addMessageToUser(accident, damagedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                accident._id = new mongoose_1.Types.ObjectId();
                //add to user messages
                damagedUser.accidents.push(accident);
                damagedUser.unreadMessages.push(accident);
                yield damagedUser.save();
                console.log('saved successfully');
                return true;
            }
            catch (error) {
                throw new Error('addNoteToUserMessages: ' + error.message);
            }
        });
    }
    ;
    /**
   * Find user by any query
   */
    GetUserQuery(query = {}, projection = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.findOne(query, projection);
                return user;
            }
            catch (error) {
                throw new Error('getUserByCarNumber service: ' + error.message);
            }
        });
    }
    /**
   * Search for reports in the the unmatched collection for the new registered user car number
   */
    SearchUnmatchedReports(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carNumber = user.carNumber;
                const matchedReports = yield this.unMatchedReportsModel.find({ "damagedCarNumber": carNumber });
                yield this.unMatchedReportsModel.deleteMany({ "damagedCarNumber": carNumber });
                return matchedReports;
            }
            catch (error) {
                throw new Error('SearchUnmatchedReports: ' + error.message);
            }
        });
    }
    ;
    /**
     * Add all the reports found in the unmatched collection for the new registered user car number
     */
    AddUnmatchedReportsToUser(user, reports) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                reports.forEach((report) => __awaiter(this, void 0, void 0, function* () {
                    const accident = report.accident;
                    accident._id = new mongoose_1.Types.ObjectId();
                    user.accidents.push(accident);
                    user.unreadMessages.push(accident);
                    console.log(accident);
                }));
                yield user.save();
            }
            catch (error) {
                throw new Error('addNoteToUserMessages: ' + error.message);
            }
        });
    }
    /**
     *  delete a message from the users accidents array
     */
    deleteMessage(userId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.user.findById(userId);
                if (!user) {
                    throw new http_exception_1.default(404, 'User not found');
                }
                const index = user.accidents.findIndex(accident => { var _a; return (_a = accident._id) === null || _a === void 0 ? void 0 : _a.equals(new mongoose_1.Types.ObjectId(messageId)); });
                if (index === -1) {
                    throw new http_exception_1.default(404, 'Accident not found');
                }
                user.accidents.splice(index, 1);
                yield user.save();
                return true;
            }
            catch (error) {
                throw new http_exception_1.default(400, error.message);
            }
        });
    }
    /**
     * Update the user's password in the database
     */
    updateUserPassword(userId, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connectedUser = yield this.user.findById(userId);
                console.log(connectedUser === null || connectedUser === void 0 ? void 0 : connectedUser.password);
                // check if user exits
                if (!connectedUser)
                    throw new http_exception_1.default(404, 'User not found');
                //check if the oldPassword match the password in the db
                if (!(yield connectedUser.isValidPassword(oldPassword))) {
                    throw new http_exception_1.default(400, 'Currant password is incorrect');
                }
                // update the user's password (The hashing is in the User Model Pre functions)
                connectedUser.password = newPassword;
                yield connectedUser.save();
                return true;
            }
            catch (error) {
                throw new http_exception_1.default(500, error.message);
            }
        });
    }
    /**
     * Update the user's information in the database
     */
    updateUserInfo(userId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.user.findOneAndUpdate({ '_id': userId }, update, { new: true });
                console.log(updatedUser);
                return updatedUser;
            }
            catch (error) {
                throw new http_exception_1.default(500, error.message);
            }
        });
    }
}
;
exports.default = UserService;
