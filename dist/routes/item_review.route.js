"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_review_controller_1 = require("../controllers/item_review.controller");
const multer_1 = require("../middlewares/multer");
const upload_image_1 = require("../middlewares/upload-image");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/", item_review_controller_1.getItemReviews);
router.post("/", multer_1.filterImage.fields([
    { name: "item_review_images", maxCount: 10 },
    { name: "item_review_videos", maxCount: 10 },
]), upload_image_1.uploadReviewFiles, item_review_controller_1.createItemReview);
router.route("/:reviewId").put(item_review_controller_1.updateItemReview).delete(item_review_controller_1.deleteItemReview);
exports.default = router;
