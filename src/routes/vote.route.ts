import { Router } from "express";
import {
  downVoteRestaurantReview,
  downvoteItemReview,
  upvoteItemReview,
  upvoteRestaurantReview,
} from "../controllers/vote.controller";

const router = Router({ mergeParams: true });
router.route("/upvote-item-review").post(upvoteItemReview);
router.route("/downvote-item-review").post(downvoteItemReview);
router.route("/upvote-restaurant-review").post(upvoteRestaurantReview);
router.route("/downvote-restaurant-review").post(downVoteRestaurantReview);

export default router;
