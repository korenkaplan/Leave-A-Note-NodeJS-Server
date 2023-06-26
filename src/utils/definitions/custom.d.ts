import User from "@/resources/user/user.interface";
declare global{
      /**
     * Adds the user object to the Request interface inside Express,it will resolve the error "User not exist in type Request" 
     * So we ca n use for example: req.user = user;
     */
    namespace Express{
        export interface Request{
            user: User;
        }
    }
}