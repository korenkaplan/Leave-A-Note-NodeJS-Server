"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReportSchema = new mongoose_1.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    damagedCarNumber: {
        type: String,
        required: true,
    },
    hittingCarNumber: {
        type: String,
        required: true,
    },
    isAnonymous: {
        type: Boolean,
        required: true,
    },
    reporter: {
        name: {
            type: String,
            required: true,
        },
        carNumber: {
            type: String,
            required: true,
        },
    },
});
exports.default = (0, mongoose_1.model)('Report', ReportSchema);
