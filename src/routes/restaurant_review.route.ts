import { Router } from "express";
import {
  getRestaurantReviews,
  createRestaurantReview,
  updateRestaurantReview,
  deleteRestaurantReview,
} from "../controllers/restaurant_review.controller";
import { uploadReviewFiles } from "../middlewares/upload-image";
import { filterImage } from "../middlewares/multer";

const router = Router({ mergeParams: true });
router.get("/", getRestaurantReviews)
router.post("/", filterImage.fields([
    { name: "restaurant_review_images", maxCount: 10 }, 
    { name: "restaurant_review_videos", maxCount: 10 }, 
  ]), uploadReviewFiles, createRestaurantReview);
router.route("/:reviewId").put(updateRestaurantReview).delete(deleteRestaurantReview);

export default router;
