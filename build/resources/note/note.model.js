"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NoteSchema = new mongoose_1.Schema({
    damaged_user_id: {
        type: String,
        required: true,
    },
    hitting_user_car: {
        type: String,
        required: true,
    },
    hitting_user_phone: {
        type: String,
        required: true,
    },
    hitting_user_name: {
        type: String,
        required: true,
    },
    imageSource: {
        type: String,
        required: true,
    },
}, { collection: 'users' });
exports.default = (0, mongoose_1.model)('Note', NoteSchema);
