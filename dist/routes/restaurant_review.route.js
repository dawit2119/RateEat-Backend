"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurant_review_controller_1 = require("../controllers/restaurant_review.controller");
const upload_image_1 = require("../middlewares/upload-image");
const multer_1 = require("../middlewares/multer");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/", restaurant_review_controller_1.getRestaurantReviews);
router.post("/", multer_1.filterImage.fields([
    { name: "restaurant_review_images", maxCount: 10 },
    { name: "restaurant_review_videos", maxCount: 10 },
]), upload_image_1.uploadReviewFiles, restaurant_review_controller_1.createRestaurantReview);
router.route("/:reviewId").put(restaurant_review_controller_1.updateRestaurantReview).delete(restaurant_review_controller_1.deleteRestaurantReview);
exports.default = router;
