"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../middlewares/multer");
const upload_image_1 = require("../middlewares/upload-image");
const updated_menu_images_controller_1 = require("../controllers/updated_menu_images.controller");
const router = express_1.default.Router({ mergeParams: true });
router.post("/", multer_1.filterImage.fields([
    { name: "updatedMenuImages", maxCount: 15 }, // Allow up to 10 menuImages
]), upload_image_1.uploadUpdatedMenuImages, updated_menu_images_controller_1.createUpdatedMenuImage);
router.route("/").get(updated_menu_images_controller_1.getUpdatedMenuImages);
exports.default = router;
