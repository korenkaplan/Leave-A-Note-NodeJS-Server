import UserModel from "@/resources/user/user.model";
import token from "@/utils/token";
import { IAccident } from "@/resources/accident/accident.interface";
import IUser from '@/resources/user/user.interface'
import { FilterQuery, ProjectionFields, Types,UpdateQuery } from "mongoose";
import UnMatchedReportsModel from "@/resources/unMatchedReports/unMatchedReports.model";
import IUnMatchedReports from "../unMatchedReports/unMatchedReports.interface";
import HttpException from "@/utils/exceptions/http.exception";
import bcrypt from 'bcrypt';

class UserService {
    private user = UserModel;
    private unMatchedReportsModel = UnMatchedReportsModel;
    /**
     * Register a new user
     */
    public async register(name: string, email: string, carNumber: string, phoneNumber: string, password: string, role: string): Promise<string | Error> {
        try {
            const user: IUser = await this.user.create({ name, email, password, phoneNumber, carNumber, role, accidents: [], unreadMessages: [] });
            const unMatchedReports = await this.SearchUnmatchedReports(user);
            if (unMatchedReports) {
                await this.AddUnmatchedReportsToUser(user, unMatchedReports)
                console.log('successfully Added unMatchedReports');
            }
            const accessToken = token.createToken(user);
            return accessToken;
        } catch (error: any) {
            throw new Error('register service: ' + error.message);
        }
    };
    /**
    * Attempt to login a user
    */
    public async login(email: string, password: string): Promise<string | null> {
        try {

            //search for a user with this email in the database
            const user = await this.user.findOne({ email });
            if (user !== null && await user.isValidPassword(password)) { //if not found
                return token.createToken(user);
            }
             else {
              return null;
            }
        } catch (error: any) {
            throw new Error('Unable to login: ' + error.message);
        }
    };
    /**
     * Add new message to user's unread messages and accidents.
     */
    public async addMessageToUser(accident: IAccident, damagedUser: IUser): Promise<boolean | Error> {
        try {
            accident._id = new Types.ObjectId();
            //add to user messages
            damagedUser.accidents.push(accident);
            damagedUser.unreadMessages.push(accident);
            await damagedUser.save();
            console.log('saved successfully');
            return true;
        } catch (error: any) {
            throw new Error('addNoteToUserMessages: ' + error.message);
        }
    };
    /**
   * Find user by any query
   */
    public async GetUserQuery(query: FilterQuery<IUser> = {}, projection: ProjectionFields<IUser> = {}): Promise<IUser | null> {
        try {
            const user = await this.user.findOne(query, projection);
            return user;
        } catch (error: any) {
            throw new Error('getUserByCarNumber service: ' + error.message);
        }
    }
    /**
   * Search for reports in the the unmatched collection for the new registered user car number
   */
    private async SearchUnmatchedReports(user: IUser): Promise<IUnMatchedReports[] | null> {
        try {
            const carNumber: string = user.carNumber;
            const matchedReports = await this.unMatchedReportsModel.find({ "damagedCarNumber": carNumber })
            await this.unMatchedReportsModel.deleteMany({ "damagedCarNumber": carNumber })
            return matchedReports;
        } catch (error: any) {
            throw new Error('SearchUnmatchedReports: ' + error.message);
        }
    };
    /**
     * Add all the reports found in the unmatched collection for the new registered user car number
     */
    private async AddUnmatchedReportsToUser(user: IUser, reports: IUnMatchedReports[]): Promise<void> {
        try {
            reports.forEach(async (report: IUnMatchedReports) => {
                const accident: IAccident = report.accident;
                accident._id = new Types.ObjectId();
                user.accidents.push(accident);
                user.unreadMessages.push(accident);
                console.log(accident)

            });
            await user.save();
        } catch (error: any) {
            throw new Error('addNoteToUserMessages: ' + error.message);
        }
    }
    /**
     *  delete a message from the users accidents array
     */
    public async deleteMessage(userId: string, messageId: string): Promise<boolean> {
        try {
            const user = await this.user.findById(userId);

            if (!user) {
                throw new HttpException(404, 'User not found');
            }

            const index = user.accidents.findIndex(accident => accident._id?.equals(new Types.ObjectId(messageId)));

            if (index === -1) {
                throw new HttpException(404, 'Accident not found');
            }

            user.accidents.splice(index, 1);
            await user.save();

            return true;
        } catch (error: any) {
            throw new HttpException(400, error.message);
        }
    }
    /**
     * Update the user's password in the database
     */
    public async updateUserPassword(userId: string, oldPassword: string,newPassword: string): Promise<boolean> {
        try {
            const connectedUser = await this.user.findById(userId);
            console.log(connectedUser?.password);

            // check if user exits
            if (!connectedUser) 
                throw new HttpException(404, 'User not found');
            //check if the oldPassword match the password in the db
            if(! await connectedUser.isValidPassword(oldPassword)) 
            {
                throw new HttpException(400, 'Currant password is incorrect');
            }
           // update the user's password (The hashing is in the User Model Pre functions)
            connectedUser.password = newPassword;
            await connectedUser.save();
            return true;
        } catch (error: any) {
            throw new HttpException(500, error.message);
        }
    }
    /**
     * Update the user's information in the database
     */
    public async updateUserInfo(userId: string, update:UpdateQuery<IUser>): Promise<IUser | null> {
       try {
        const updatedUser = await this.user.findOneAndUpdate<IUser | null>({'_id': userId}, update,{new: true});
        console.log(updatedUser);
        return updatedUser;

       } catch  (error: any) {
        throw new HttpException(500, error.message);
    }
        
    }
};
export default UserService;