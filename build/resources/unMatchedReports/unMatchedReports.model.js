"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UnMatchedReportsSchema = new mongoose_1.Schema({
    accident: { type: Object, required: true },
    damagedCarNumber: { type: String, required: true },
}, { collection: 'unMatchedReports' });
exports.default = (0, mongoose_1.model)('UnMatchedReports', UnMatchedReportsSchema);
