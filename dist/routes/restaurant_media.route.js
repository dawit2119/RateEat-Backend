"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../middlewares/multer");
const restaurant_media_controller_1 = require("../controllers/restaurant_media.controller");
const upload_image_1 = require("../middlewares/upload-image");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/", restaurant_media_controller_1.getRestaurantMedia);
router.post("/", multer_1.filterImage.fields([
    { name: "restaurant_images", maxCount: 10 },
    { name: "restaurant_videos", maxCount: 10 },
]), upload_image_1.uploadMediaFiles, restaurant_media_controller_1.createRestaurantMedia);
exports.default = router;
