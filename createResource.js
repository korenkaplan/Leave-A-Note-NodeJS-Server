const fs = require('fs');
const path = require('path');

function createFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Created folder: ${folderPath}`);
    } else {
        console.log(
            `Folder "${folderPath}" already exists. Skipping folder creation.`
        );
    }
}

function createFile(folderPath, fileName, fileContent) {
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, fileContent);
    console.log(`Created file: ${filePath}`);
}

const folderPath =
    'C:\\Users\\Koren Kaplan\\Desktop\\Projects\\React native\\Leave-A-Note\\NodeServer\\src\\resources';

const args = process.argv.slice(2);

if (args.length < 1) {
    console.error('Please provide the folder name');
    process.exit(1);
}

const folderName = args[0];
const folderNameCapitalized =
    folderName.charAt(0).toUpperCase() + folderName.slice(1);
const absoluteFolderPath = path.join(folderPath, folderName);

createFolder(absoluteFolderPath);

const filesToCreate = [
    `${folderName}.controller.ts`,
    `${folderName}.interface.ts`,
    `${folderName}.model.ts`,
    `${folderName}.service.ts`,
    `${folderName}.validation.ts`,
];

filesToCreate.forEach((fileName) => {
    let fileContent = `// ${fileName} content`;

    if (fileName === `${folderName}.interface.ts`) {
        fileContent = `import { Document } from 'mongoose';

export default interface I${folderNameCapitalized} extends Document {

};
`;
    } else if (fileName === `${folderName}.controller.ts`) {
        fileContent = `import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';

class ${folderNameCapitalized}Controller implements IController {
    public path = '/${folderName}s';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Define your routes here
    }
}

export default ${folderNameCapitalized}Controller;
`;
    } else if (fileName === `${folderName}.model.ts`) {
        fileContent = `import { Schema, model } from 'mongoose';
import I${folderNameCapitalized} from '@/resources/${folderName}/${folderName}.interface';

const ${folderNameCapitalized}Schema = new Schema(
  {
    // Enter fields here
  },
  {  collection: '${folderName}s' } // Merge options into a single object
);

export default model<I${folderNameCapitalized}>('${folderNameCapitalized}', ${folderNameCapitalized}Schema);
`;
    } else if (fileName === `${folderName}.service.ts`) {
        fileContent = `import ${folderNameCapitalized}Model from '@/resources/${folderName}/${folderName}.model';

class ${folderNameCapitalized}Service {
    private ${folderName} = ${folderNameCapitalized}Model;
}

export default ${folderNameCapitalized}Service;
`;
    } else if (fileName === `${folderName}.validation.ts`) {
        fileContent = `import Joi from 'joi';

export default {
  // Add validation functions here
};
`;
    }

    createFile(absoluteFolderPath, fileName, fileContent);
});
