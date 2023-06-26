import {IAccident} from '@/resources/accident/accident.interface';
import IUser from '@/resources/user/user.interface';
import UserService from '../user/user.service';
class NoteService {
    private user = new UserService();

    public async addNote(damage_user_id: string, hitting_user_car: string,hitting_user_phone: string,hitting_user_name: string, imageSource: string ):Promise<boolean | Error>{
        try {
            //find the damaged user by id
           // const damagedUser: IUser | null = await this.user.findById(new Types.ObjectId('648f447388cf8e6657912c2d'));
            const damagedUser: IUser | null = await this.user.GetUserQuery({"_id":damage_user_id});
            console.log(damagedUser);
            
            if(!damagedUser){return false;}
  
           // create the accident object
           const accidentData: IAccident = {
            hittingDriver: {
                name: hitting_user_name,
                carNumber: hitting_user_car,
                phoneNumber: hitting_user_phone,
            },
            date:this.formatDate(),
            imageSource: imageSource,
            type: 'note',
            isAnonymous: false,
            isIdentify: true,
            reporter: undefined,
        };
            //add the note to the user messages and accidents
          return await this.user.addMessageToUser(accidentData,damagedUser);
        } catch (error: any) {
            throw new Error('addNote: ' + error.message);
        }
    }
    public formatDate(): string {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = String(currentDate.getFullYear()).slice(-2);
        const formattedDate = `${day}/${month}/${year}`;
        
        return formattedDate;        
    }
    
}    
export default NoteService;



