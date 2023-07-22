import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/utils/interfaces/controller.interface';
import IHttpResponse from '@/utils/interfaces/httpResponse.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/note/note.validation'
import NoteService from '@/resources/note/note.service';
import authenticated from '@/middleware/authenticated.middleware';
class NoteController implements IController {
  public path = '/notes';
  public router = Router();
  private NoteService = new NoteService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/createNote`, authenticated, validationMiddleware(validate.createNote), this.createNote);
  }
  //** check 
  private createNote = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { damaged_user_car_num, hitting_user_car, hitting_user_phone, hitting_user_name, imageSource } = req.body;
      console.log(damaged_user_car_num);
      const [success, message] = await this.NoteService.addNote(damaged_user_car_num, hitting_user_car, hitting_user_phone, hitting_user_name, imageSource);
      const status = success ? 201 : 404;
      const data: IHttpResponse<void> = { success, message, }
      res.status(status).json(data);
    } catch (error: any) {
      res.status(500).json({ "success": false, "error": error.message });
    }
  };

}

export default NoteController;
