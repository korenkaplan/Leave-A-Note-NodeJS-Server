import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middleware/authenticated.middleware';
import IUser from './user.interface';
class UserController implements IController {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.post(`${this.path}/register`, validationMiddleware(validate.register), this.register);
        this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login);
        this.router.post(`${this.path}/passwordUpdate`, this.updateUserPassword);
        this.router.post(`${this.path}/informationUpdate`, this.updateUserInformation);
        this.router.post(`${this.path}/deleteMessage`, validationMiddleware(validate.deleteMessage), this.deleteMessageById);
        this.router.get(`${this.path}/getUser`, authenticated, this.getUserQuery);
    }
    private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { name, email, password, carNumber, phoneNumber } = req.body;
            const token = await this.UserService.register(name, email, carNumber, phoneNumber, password, 'user');
            res.status(200).json({ token })

        } catch (error: any) {
            next(new HttpException(400, 'Register function:' + error.message))
        }
    };
    private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { email, password } = req.body;

            const token = await this.UserService.login(email, password);
            return res.status(200).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    };
    private getUserQuery = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { query, projection } = req.body;
            const user: IUser | null = await this.UserService.GetUserQuery(query, projection);
            res.status(200).json({ user })
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
    private deleteMessageById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { userId, messageId } = req.body;
            const result: boolean = await this.UserService.deleteMessage(userId, messageId);
            return res.status(200).json({ result });
        } catch (error: any) {
            res.status(400).status(error.message)
        }
    };

    private updateUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
          const {userId, oldPassword, newPassword} = req.body; 
          const result: boolean = await this.UserService.updateUserPassword(userId, oldPassword, newPassword);
          return res.status(200).json({ result });
        } catch (error: any) {
            res.status(400).status(error.message)
        }
    };
    private deleteReadMessage = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    };
    private updateUserInformation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {userId, update} = req.body;
            const user = await this.UserService.updateUserInfo(userId,update);
            return res.status(200).json({user});
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    };
  
};
export default UserController;