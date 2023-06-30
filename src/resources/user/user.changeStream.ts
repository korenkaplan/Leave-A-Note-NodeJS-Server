import { log } from "console";
import userModel from "./user.model";

interface Accident {

}
class UserChangeStream{
    constructor(){
        console.log('start listening for user changes');

        const userChangeStream = userModel.watch();

        userChangeStream.on('change',(change)=>{
                console.log(change);
                console.log(change.documentKey._id.toString());
                console.log(change.updateDescription.updatedFields);
                
                
            })
        
    }
    
}
export default UserChangeStream;