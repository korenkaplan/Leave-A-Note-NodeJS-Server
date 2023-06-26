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
const user_service_1 = __importDefault(require("../user/user.service"));
class NoteService {
    constructor() {
        this.user = new user_service_1.default();
    }
    addNote(damage_user_id, hitting_user_car, hitting_user_phone, hitting_user_name, imageSource) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //find the damaged user by id
                // const damagedUser: IUser | null = await this.user.findById(new Types.ObjectId('648f447388cf8e6657912c2d'));
                const damagedUser = yield this.user.GetUserQuery({ "_id": damage_user_id });
                console.log(damagedUser);
                if (!damagedUser) {
                    return false;
                }
                // create the accident object
                const accidentData = {
                    hittingDriver: {
                        name: hitting_user_name,
                        carNumber: hitting_user_car,
                        phoneNumber: hitting_user_phone,
                    },
                    date: this.formatDate(),
                    imageSource: imageSource,
                    type: 'note',
                    isAnonymous: false,
                    isIdentify: true,
                    reporter: undefined,
                };
                //add the note to the user messages and accidents
                return yield this.user.addMessageToUser(accidentData, damagedUser);
            }
            catch (error) {
                throw new Error('addNote: ' + error.message);
            }
        });
    }
    formatDate() {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = String(currentDate.getFullYear()).slice(-2);
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }
}
exports.default = NoteService;
