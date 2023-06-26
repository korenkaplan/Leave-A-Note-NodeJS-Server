import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/report/report.validation'
import ReportService from '@/resources/report/report.service';
import authenticated from '@/middleware/authenticated.middleware';

class ReportController implements IController {
    public path = '/reports';
    public router = Router();
    private ReportService = new ReportService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Define your routes here
        this.router.post(`${this.path}/createReport`,validationMiddleware(validate.reportValidationSchema),this.createReport)
    }
    private createReport = async  (req:Request, res: Response, next: NextFunction): Promise<Response | void> =>{
       try {
        const {imageUrl,damagedCarNumber,hittingCarNumber, isAnonymous,reporter} = req.body;
        const isSaved = await this.ReportService.addReport(damagedCarNumber, hittingCarNumber, isAnonymous,reporter,imageUrl);
        isSaved? res.status(201).json({data: isSaved}):  res.status(200).json({data: 'save unsuccessful'});
       } catch (error: any) {
        throw new HttpException(400, error.message);
    }
    };
}

export default ReportController;
