import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import helmet from 'helmet';
import errorMiddleware from '@/middleware/error.middleware';
class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
        
    };


    private initializeMiddleware(): void {
        // Helmet helps secure the Express app by setting various HTTP headers.
        this.express.use(helmet());

        // Enable Cross-Origin Resource Sharing (CORS) to allow requests from different origins.
        this.express.use(cors());

        // Morgan is a logging middleware for HTTP requests. 'dev' format logs requests with colorful output.
        this.express.use(morgan('dev'));

        // Parse incoming JSON data and populate it on the 'req.body' property.
        this.express.use(express.json());

        // Parse incoming URL-encoded data and populate it on the 'req.body' property.
        // The 'extended: false' option parses data using the querystring library.
        this.express.use(express.urlencoded({ extended: false }));

        // Compress the response bodies for better efficiency during data transfer.
        this.express.use(compression());
    }

    private initializeControllers(controller: Controller[]): void {
        controller.forEach((controller) => {
            this.express.use('/api', controller.router)
        });
    };

    private initializeErrorHandling(): void {
        this.express.use(errorMiddleware);
    }

    private initializeDatabaseConnection(): void {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, DB_NAME } = process.env;
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: DB_NAME // Specify the database name here
        };
        mongoose.connect(
            `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, dbOptions
        ).then(() => {
            console.log('Database connection successful');
            // Perform additional operations
        })
            .catch((error) => {
                console.error('Error connecting to the database', error);
            });
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log('App listening on port ' + this.port);
        })
    }
}

export default App;