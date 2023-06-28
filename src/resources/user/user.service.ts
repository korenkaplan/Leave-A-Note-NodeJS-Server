import UserModel from "@/resources/user/user.model";
import token from "@/utils/token";
import { IAccident } from "@/resources/accident/accident.interface";
import IUser from '@/resources/user/user.interface'
import { FilterQuery, ProjectionFields, Types,UpdateQuery } from "mongoose";
import UnMatchedReportsModel from "@/resources/unMatchedReports/unMatchedReports.model";
import IUnMatchedReports from "../unMatchedReports/unMatchedReports.interface";
import HttpException from "@/utils/exceptions/http.exception";
import IHttpResponse from "@/utils/interfaces/httpResponse.interface";
import bcrypt from 'bcrypt';

class UserService {
    private user = UserModel;
    private unMatchedReportsModel = UnMatchedReportsModel;
    /**
     * Register a new user
     */
    public async register(name: string, email: string, carNumber: string, phoneNumber: string, password: string, role: string): Promise<string> {

            const user: IUser = await this.user.create({ name, email, password, phoneNumber, carNumber, role, accidents: [], unreadMessages: [] });
            const unMatchedReports = await this.SearchUnmatchedReports(carNumber);
            if (unMatchedReports) {
                await this.AddUnmatchedReportsToUser(user, unMatchedReports)
            }
            return token.createToken(user);
    };
    /**
    * Attempt to login a user
    */
    public async login(email: string, password: string): Promise<[boolean,string]> {
            //search for a user with this email in the database
            const user = await this.user.findOne({ email });
            return user !== null && await user.isValidPassword(password)?[true,token.createToken(user)]: [false,'No user found with those credentials']
    };
    /**
     * Add new message to user's unread messages and accidents.
     */
    public async addMessageToUser(accident: IAccident, damagedUser: IUser): Promise<void> {
            accident._id = new Types.ObjectId();
            //add to user messages
            damagedUser.accidents.push(accident);
            damagedUser.unreadMessages.push(accident);
            await damagedUser.save();
    };
    /**
   * Find user by any query
   */
    public async GetUserQuery(query: FilterQuery<IUser> = {}, projection: ProjectionFields<IUser> = {}): Promise<IUser | null> {
        try {
            const user: IUser | null = await this.user.findOne(query, projection);
            return user;
        } catch (error: any) {
            throw new Error('getUserByCarNumber service: ' + error.message);
        }
    }
    /**
   * Search for reports in the the unmatched collection for the new registered user car number
   */
    private async SearchUnmatchedReports(carNumber: string): Promise<IUnMatchedReports[] | null> {
        try {
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
    public async deleteMessage(userId: string, messageId: string): Promise<[boolean, string]> {
            const user = await this.user.findById(userId);
            if (!user) 
                return [false, 'User not found'];

            const index = user.accidents.findIndex(accident => accident._id?.equals(new Types.ObjectId(messageId)));

            if (index < 0)
                return [false,'Accident not found'];


            user.accidents.splice(index, 1);
            await user.save();

            return [true, 'Accident deleted successfully'];
    }
    /**
     * Update the user's password in the database
     */
    public async updateUserPassword(userId: string, oldPassword: string,newPassword: string): Promise<[boolean,string,number]> {
            const connectedUser = await this.user.findById(userId);
            // check if user exits
            if (!connectedUser) 
            return [false,'User not found',404]
            //check if the oldPassword match the password in the db
            if(! await connectedUser.isValidPassword(oldPassword)) 
            {
                return [false,'Currant password is incorrect',400]
            }
           // update the user's password (The hashing is in the User Model Pre functions)
            connectedUser.password = newPassword;
            await connectedUser.save();
            return [true,'Successfully updated password',200]

    }
    /**
     * Update the user's information in the database
     */
    public async updateUserInfo(userId: string, update: UpdateQuery<IUser>): Promise<[boolean, string]> {
        const user = await this.user.findOne({
          $or: [
            { "carNumber": update.carNumber },
            { "email": update.email },
            { "phoneNumber": update.phoneNumber },
          ],
        });
      
        if (user) {
          // Check which field(s) have a duplicate value
          if (user.carNumber === update.carNumber) {
            return [false, 'This Car number is already in use.'];
          }
          if (user.email === update.email) {
            return [false, 'This email is already in use.'];
          }
          if (user.phoneNumber === update.phoneNumber) {
            return [false, 'This phone number is already in use.'];
          }
        }
      
        const updatedUser = await this.user.findOneAndUpdate<IUser | null>({ '_id': userId }, update, { new: true });
        if (updatedUser) {
          return [true, 'User information updated successfully.'];
        }
      
        return [false, 'User with this id not found in the system.'];
      }
      
};
export default UserService;