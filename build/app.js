"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const error_middleware_1 = __importDefault(require("@/middleware/error.middleware"));
class App {
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    ;
    initializeMiddleware() {
        this.express.use((0, helmet_1.default)());
        this.express.use((0, cors_1.default)());
        this.express.use((0, morgan_1.default)('dev'));
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use((0, compression_1.default)());
    }
    ;
    initializeControllers(controller) {
        controller.forEach((controller) => {
            this.express.use('/api', controller.router);
        });
    }
    ;
    initializeErrorHandling() {
        this.express.use(error_middleware_1.default);
    }
    initializeDatabaseConnection() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, DB_NAME } = process.env;
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: DB_NAME // Specify the database name here
        };
        mongoose_1.default.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, dbOptions).then(() => {
            console.log('Database connection successful');
            // Perform additional operations
        })
            .catch((error) => {
            console.error('Error connecting to the database', error);
        });
    }
    listen() {
        this.express.listen(this.port, () => {
            console.log('App listening on port ' + this.port);
        });
    }
}
exports.default = App;
