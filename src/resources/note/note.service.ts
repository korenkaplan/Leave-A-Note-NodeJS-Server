import { IAccident } from '@/resources/accident/accident.interface';
import IUser from '@/resources/user/user.interface';
import UserService from '../user/user.service';
import IHttpResponse from '@/utils/interfaces/httpResponse.interface';
import { type } from 'os';
class NoteService {
    private user = new UserService();

    public async addNote(damaged_user_car_num: string, hitting_user_car: string, hitting_user_phone: string, hitting_user_name: string, imageSource: string): Promise<[boolean, string]> {
        const user: IUser | null = await this.user.GetUserQuery({ "carNumber": damaged_user_car_num },{accidents:1,unreadMessages:1});
        if (!user) {
            return [false, 'user not found'];
        }
        // create the accident object
        const accidentData: IAccident = this.createAccident(hitting_user_car, hitting_user_phone, hitting_user_name, imageSource)
        
        //add the note to the user messages and accidents
        await this.user.addMessageToUser(accidentData, user);
        return [true, "Note Sent Successfully"];
    }


    public formatDate = (): string => {
        const date = new Date();
        date.setHours(date.getHours() + 3); // Add 3 hours to the current time
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const formattedDate = date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
        return `${formattedTime} ${formattedDate}`;
    }
    private createAccident(hitting_user_car: string, hitting_user_phone: string, hitting_user_name: string, imageSource: string): IAccident {
        const currantDataAndTime = this.formatDate();
        return {
            hittingDriver: {
                name: hitting_user_name,
                carNumber: hitting_user_car,
                phoneNumber: hitting_user_phone,
            },
            // date:currentDate,
            imageSource: imageSource,
            type: 'note',
            isAnonymous: false,
            isIdentify: true,
            reporter: undefined,
            isDeleted: false,
            date: currantDataAndTime
        }
    }
}
export default NoteService;



