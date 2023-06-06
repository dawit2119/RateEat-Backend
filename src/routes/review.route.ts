import express from "express";
import {
  getAllItemReviews,
  getAllRestaurantReviews,
} from "../controllers/reviews.controller";

const router = express.Router();

router.route("/item_reviews").get(getAllItemReviews);
router.route("/restaurant_reviews").get(getAllRestaurantReviews);

export default router;
