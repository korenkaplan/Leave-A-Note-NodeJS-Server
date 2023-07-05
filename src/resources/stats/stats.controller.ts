import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import StatsService from './stats.service';
import authenticated from '@/middleware/authenticated.middleware'
import validate from '@/resources/stats/stats.validation'
import IHttpResponse from '@/utils/interfaces/httpResponse.interface';
import {DistributionOfReports, RegisteredUsersPerMonthAmount } from './stats.interface';
class StatsController implements IController {
    public path = '/stats';
    public router = Router();
    statsService = new StatsService();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Define your routes here
        this.router.post(`${this.path}/registeredUsersData`,authenticated,validationMiddleware(validate.registeredUsersPerMonth),this.getRegisteredUsersData)
        this.router.post(`${this.path}/reportsDistribution`,authenticated,validationMiddleware(validate.getReportsDistribution),this.getReportsDistribution)
    }

    public getRegisteredUsersData = async(req: Request, res: Response,):Promise<Response | void> =>{
        try {
            const {year} = req.body;
            const [isSuccessful,result] =  await this.statsService.RegisteredUsersPerMonth(year)
            const resBody: IHttpResponse<RegisteredUsersPerMonthAmount[]> ={success:isSuccessful,message:'Graph data',data:result}
            return res.status(200).json(resBody);
        } catch (error:any) {
            const resBody: IHttpResponse<void> = {success:false,message:'Failed to Get User Per month Data',error:error.message};
            return res.status(500).json(resBody);
        }
    };
    public getReportsDistribution = async(req: Request, res: Response,):Promise<Response | void> =>{
      try {
          const result = await this.statsService.reportsAndNotesDistribution();
          const resBody: IHttpResponse<DistributionOfReports[]> = {success:true,message:'Graph data',data:result}
          res.status(200).json(resBody);
      } catch (error:any) {
        const resBody: IHttpResponse<void> = {success:false,message:'Failed to Get Pie data',error:error.message};
        return res.status(500).json(resBody);
    }
    };
}

export default StatsController;
