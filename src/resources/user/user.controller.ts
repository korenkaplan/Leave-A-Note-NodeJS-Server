import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import IHttpResponse from '@/utils/interfaces/httpResponse.interface';
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
        this.router.post(`${this.path}/updateDeviceToken`, validationMiddleware(validate.updateDeviceToken), this.updateDeviceToken);
        this.router.post(`${this.path}/passwordUpdate`, authenticated, validationMiddleware(validate.passwordUpdate), this.updateUserPassword);
        this.router.post(`${this.path}/informationUpdate`, authenticated, validationMiddleware(validate.infoUpdate), this.updateUserInformation);
        this.router.post(`${this.path}/deleteMessage`, authenticated, validationMiddleware(validate.deleteMessage), this.deleteMessageById);
        this.router.post(`${this.path}/deleteMessageInbox`, authenticated, validationMiddleware(validate.deleteMessage), this.deleteMessageInbox);
        this.router.post(`${this.path}/getUser`, authenticated, this.getUserQuery);
    }
    // ** Checked
    private register = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const { name, email, password, carNumber, phoneNumber, deviceToken } = req.body;
            const token = await this.UserService.register(name, email, carNumber, phoneNumber, password, 'user', deviceToken);
            const [message, success, status, data] = ['Register Successfully', true, 201, token]
            const resBody: IHttpResponse<string> = { message, success, data }
            res.status(status).json(resBody)

        } catch (error: any) {
            const fieldInUse = this.UserService.translateError(error.message)
            const resBody: IHttpResponse<string> = { message: 'Registration Failed', success: false, error: `This ${fieldInUse} is already in use.` }
            res.status(500).json(resBody)
        }
    };
    // ** Checked
    private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const [isSuccessful, tokenOrError] = await this.UserService.login(email, password);
            const [message, success, status, data, error] = isSuccessful ? ['Successfully Identified', true, 200, { token: tokenOrError }] : ['Invalid credentials', false, 404, , tokenOrError]
            const resBody: IHttpResponse<object> = { message, success, data, error }
            return res.status(status).json(resBody)
        } catch (error: any) {
            res.status(500).json({ message: 'Server Error', success: false, error: error.message } as IHttpResponse<void>)
        }
    };
    // ** Checked
    private getUserQuery = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { query, projection } = req.body;
            const user: IUser | null = await this.UserService.GetUserQuery(query, projection);
            const [message, success, status, data] = user !== null ? ['success', true, 200, user] : ['User Not Found', false, 404]
            const resBody: IHttpResponse<IUser> = { message, success, data }
            res.status(status).json(resBody)
        } catch (error: any) {
            const resBody: IHttpResponse<string> = { message: 'Error fetching information', error: error.message, success: false };
            res.status(500).json(resBody)
        }
    }
    // ** Checked
    private deleteMessageById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { userId, messageId } = req.body;
            const [isSuccessful, resultMessage] = await this.UserService.deleteMessage(userId, messageId);
            const [message, status, error] = isSuccessful ? [resultMessage, 200] : ['Failed to delete message', 404, resultMessage];
            const resBody: IHttpResponse<void> = { success: isSuccessful, message, error }
            res.status(status).json(resBody);
        } catch (error: any) {
            const resBody: IHttpResponse<void> = { message: 'Failed to delete message', error: error.message, success: false }
            res.status(500).json(resBody);
        }
    };
    // ** Checked
    private deleteMessageInbox = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { userId, messageId } = req.body;
            const [isSuccessful, resultMessage] = await this.UserService.deleteMessageInbox(userId, messageId);
            const [message, status, error] = isSuccessful ? [resultMessage, 200] : ['Failed to delete message', 404, resultMessage];
            const resBody: IHttpResponse<void> = { success: isSuccessful, message, error }
            res.status(status).json(resBody);
        } catch (error: any) {
            const resBody: IHttpResponse<void> = { message: 'Failed to delete message', error: error.message, success: false }
            res.status(500).json(resBody);
        }
    };
    // ** Checked
    private updateUserPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { userId, oldPassword, newPassword } = req.body;
            const [success, resultMessage, status] = await this.UserService.updateUserPassword(userId, oldPassword, newPassword);
            const [message, error] = success ? [resultMessage] : ['Failed To Update Password', resultMessage]
            const resBody: IHttpResponse<void> = { success, message, error }
            console.log(error);

            return res.status(status).json(resBody);
        } catch (error: any) {
            const resBody: IHttpResponse<void> = { message: 'Error updating user password', error: error.message, success: false }
            res.status(500).json(resBody)
        }
    };
    // ** Checked
    private updateUserInformation = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { userId, fieldsToUpdate } = req.body;
            const [isSuccessful, resultMessage] = await this.UserService.updateUserInfo(userId, fieldsToUpdate);
            const [success, message, status, error] = isSuccessful ? [true, resultMessage, 200] : [false, 'Failed to update user\'s info', 400, resultMessage];
            const resBody: IHttpResponse<void> = { message, success, error }
            return res.status(status).json(resBody);
        } catch (e: any) {
            const fieldInUse = this.UserService.translateError(e.message);
            const resBody: IHttpResponse<void> = { success: false, message: 'Failed to update user info', error: `This ${fieldInUse} is already in use` }
            res.status(500).json(resBody)
        }
    };
    // ** Checked
    private updateDeviceToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { userId, deviceToken } = req.body;
            const [isSuccessful, resultMessage] = await this.UserService.updateDeviceToken(userId, deviceToken);
            const [success, message, status, error] = isSuccessful ? [true, resultMessage, 200] : [false, 'Failed to update user\'s device token', 400, resultMessage];
            const resBody: IHttpResponse<void> = { message, success, error }
            return res.status(status).json(resBody);
        } catch (e: any) {
            const resBody: IHttpResponse<void> = { success: false, message: 'Failed to update user device token', error: e.message }
            res.status(500).json(resBody)
        }
    };
};
export default UserController;