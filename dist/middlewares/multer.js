"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.filterImage = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({}),
    fileFilter: (req, files, cb) => {
        const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG", ".MP4", ".mp4", ".mkv", ".MKV", ".mov", ".MOV", ".flv", ".FLV", ".mpeg", ".MPEG"]);
        const ext = path_1.default.extname(files.originalname);
        if (!allowedExtensions.has(ext)) {
            cb(null, false);
            return;
        }
        cb(null, true);
    },
});
