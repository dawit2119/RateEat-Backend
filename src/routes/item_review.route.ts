import { Router } from "express";
import {
  getItemReviews,
  createItemReview,
  updateItemReview,
  deleteItemReview,
} from "../controllers/item_review.controller";
import { filterImage } from "../middlewares/multer";
import { uploadReviewFiles } from "../middlewares/upload-image";

const router = Router({ mergeParams: true });
router.get("/", getItemReviews)
router.post("/", filterImage.fields([
    { name: "item_review_images", maxCount: 10 }, 
    { name: "item_review_videos", maxCount: 10 }, 
  ]), uploadReviewFiles, createItemReview);
router.route("/:reviewId").put(updateItemReview).delete(deleteItemReview);

export default router;
