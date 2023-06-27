import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/report/report.validation'
import ReportService from '@/resources/report/report.service';
import authenticated from '@/middleware/authenticated.middleware';
import IHttpResponse from '@/utils/interfaces/httpResponse.interface';

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
    //** Checked 
    private createReport = async  (req:Request, res: Response, next: NextFunction): Promise<Response | void> =>{
       try {
        const {imageUrl,damagedCarNumber,hittingCarNumber, isAnonymous,reporter} = req.body;
        const message = await this.ReportService.addReport(damagedCarNumber, hittingCarNumber, isAnonymous,reporter,imageUrl);
        const resBody: IHttpResponse<void> = {message,success:true}
       res.status(201).json(resBody);
       } catch (error: any) {
        const resBody: IHttpResponse<void> = {message:'Error saving report',success:false, error:error.message}
        res.status(500).json(resBody);
    }
    };
}

export default ReportController;
