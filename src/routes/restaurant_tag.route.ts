import { Router } from "express";
import {
  getRestaurantTags,
  createRestaurantTag,
} from "../controllers/restaurant_tag.controller";

const router = Router({ mergeParams: true });
router.route("/").get(getRestaurantTags).post(createRestaurantTag);

export default router;
