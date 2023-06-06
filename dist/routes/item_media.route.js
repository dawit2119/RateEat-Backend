"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../middlewares/multer");
const item_media_controller_1 = require("../controllers/item_media.controller");
const upload_image_1 = require("../middlewares/upload-image");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/", item_media_controller_1.getItemMedia);
router.post("/", multer_1.filterImage.fields([
    { name: "item_images", maxCount: 10 },
    { name: "item_videos", maxCount: 10 },
]), upload_image_1.uploadMediaFiles, item_media_controller_1.createItemMedia);
exports.default = router;
