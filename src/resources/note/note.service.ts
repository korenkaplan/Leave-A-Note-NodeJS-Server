import {IAccident} from '@/resources/accident/accident.interface';
import IUser from '@/resources/user/user.interface';
import UserService from '../user/user.service';
import IHttpResponse from '@/utils/interfaces/httpResponse.interface';
import { type } from 'os';
class NoteService {
    private user = new UserService();

    public async addNote(damaged_user_car_num: string, hitting_user_car: string,hitting_user_phone: string,hitting_user_name: string, imageSource: string ):Promise<[boolean,string]>{
            const user:IUser | null = await this.user.GetUserQuery({"carNumber":damaged_user_car_num});
            if(!user){
                return [false,'user not found'];
            }
           // create the accident object
           const accidentData: IAccident = this.createAccident(hitting_user_car,hitting_user_phone,hitting_user_name, imageSource )
          
            //add the note to the user messages and accidents
          await this.user.addMessageToUser(accidentData,user);
          return [true,"Note Sent Successfully"];
    }

    public formatDate(): string {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = String(currentDate.getFullYear()).slice(-2);
        const formattedDate = `${day}/${month}/${year}`;
        
        return formattedDate;        
    }
    private createAccident( hitting_user_car: string,hitting_user_phone: string,hitting_user_name: string, imageSource: string): IAccident{
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
        }
}    
}
export default NoteService;



