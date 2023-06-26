import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/note/note.validation'
import NoteService from '@/resources/note/note.service';
class NoteController implements IController {
    public path = '/notes';
    public router = Router();
    private NoteService = new NoteService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
       this.router.post(`${this.path}/createNote`,validationMiddleware(validate.createNote),this.createNote);
    }

    private createNote = async (req:Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {damaged_user_id, hitting_user_car,hitting_user_phone,hitting_user_name, imageSource} = req.body;
            
          const isSaved = await this.NoteService.addNote(damaged_user_id, hitting_user_car,hitting_user_phone,hitting_user_name, imageSource);
          isSaved? res.status(201).json({data: isSaved}):  res.status(200).json({data: 'save unsuccessful'});

        } catch (error: any) {
            throw new HttpException(400, error.message);
        }
    };
       
}

export default NoteController;
