"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AccidentSchema = new mongoose_1.Schema({
    hittingDriver: {
        name: { type: String },
        carNumber: { type: String, required: true },
        phoneNumber: { type: String },
    },
    date: { type: String, required: true },
    imageSource: { type: String, required: true },
    type: { type: String, enum: ['report', 'note'], required: true },
    isAnonymous: { type: Boolean },
    isIdentify: { type: Boolean },
    reporter: {
        name: { type: String },
        phoneNumber: { type: String },
    },
}, { collection: 'accidents' } // Merge options into a single object
);
exports.default = (0, mongoose_1.model)('Accident', AccidentSchema);
