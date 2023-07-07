import userModel from "./user.model";
import IUser from "./user.interface";
import UserService from "./user.service";
interface Accident {
  _id: string;
  hittingDriver: {
    name?: string;
    carNumber: string;
    phoneNumber?: string;
  };
  date: string;
  imageSource: string;
  type: 'report' | 'note';
  isAnonymous?: boolean;
  isIdentify?: boolean;
  reporter?: {
    name: string;
    phoneNumber: string;
  };
}

class UserChangeStream {
   userService = new UserService();
  constructor() {
    this.initWatch();
  }
  private initWatch(): void{
    userModel.watch().on("change",async (data)=> {
        //check if not update finish
        if (data.operationType !== 'update') { return;}
        const updatedFields = data.updateDescription.updatedFields;
        const fieldKeys = Object.keys(updatedFields);
        //check if not a new message then finish
        if(!this.isNewMessage(fieldKeys)){return;}

        //get the user
        const uid = data.documentKey._id.toString();
        const modifiedUser: IUser | null = await this.userService.GetUserQuery({ '_id': uid });
        if (!modifiedUser) return;
        
        console.log(modifiedUser.accidents[modifiedUser.accidents.length - 1]);
        
        })
  }
  private isNewMessage(fieldKeys: string[]): boolean{
    const hasAccidents = fieldKeys.some(key => key.includes('accidents'));
    const hasUnreadMessages = fieldKeys.some(key => key.includes('unreadMessages'));
    return hasAccidents && hasUnreadMessages;
  }
  private SendNotification (deviceToken:string,accident: Accident): void {
   
  }

}

export default UserChangeStream;
