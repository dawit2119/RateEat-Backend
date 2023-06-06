"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_response_utils_1 = __importDefault(require("../utils/error-response.utils"));
const sequelize_1 = require("sequelize");
const errorHandler = (err, req, res, next) => {
    let error;
    if (err instanceof error_response_utils_1.default) {
        error = err;
    }
    else {
        error = new error_response_utils_1.default((err === null || err === void 0 ? void 0 : err.message) || "An unexpected error occurred. Please try again later", 500);
        console.error(err);
    }
    if (err instanceof sequelize_1.UniqueConstraintError) {
        error = new error_response_utils_1.default(err.errors[0].message, 400);
    }
    else if (err instanceof sequelize_1.ValidationError) {
        error = new error_response_utils_1.default(err.message, 400);
    }
    else if (err instanceof sequelize_1.ConnectionError) {
        error = new error_response_utils_1.default("Failed to connect to database. Please try again later.", 500);
        console.error(`Database Connection Error:`, err);
    }
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });
};
exports.errorHandler = errorHandler;
