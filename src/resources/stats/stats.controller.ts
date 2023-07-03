import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';

class StatsController implements IController {
    public path = '/stats';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Define your routes here
    }

    
}

export default StatsController;
