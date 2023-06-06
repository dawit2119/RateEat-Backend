import express from "express";
import {
  createRestaurant,
  filterRestaurants,
  getRestaurants,
  getRestaurantById,
  findRestaurantsWithinRadius,
  findNearbyRestaurantsCount,
  getAllRestaurantsForLiveSearch,
} from "../controllers/restaurant.controller";

import restaurantReviewRouter from "./restaurant_review.route";
import restaurantLocationRouter from "./restaurant_location.route";
import restaurantPhoneNumberRouter from "./restaurant_phone_number.route";
import restaurantAdditionalServiceRouter from "./restaurant_additional_service.route";
import restaurantTagRouter from "./restaurant_tag.route";
import updatedMenuImagesRouter from "./update_menu.route"
import menuRouter from "./menu.route";
import itemRouter from "./item.route";
import categoryRouter from "./category.route";
import restaurantMediaRouter from "./restaurant_media.route"

const router = express.Router();

router.use("/:restaurantId/reviews", restaurantReviewRouter);
router.use("/:restaurantId/media", restaurantMediaRouter)
router.use("/:restaurantId/menu", menuRouter);
router.use("/:restaurantId/menu/categories", categoryRouter);
router.use("/:restaurantId/menu/categories/:categoryId/items", itemRouter);
router.use("/:restaurantId/restaurant_locations", restaurantLocationRouter);
router.use(
  "/:restaurantId/restaurant_phone_numbers",
  restaurantPhoneNumberRouter
);
router.use("/:restaurantId/restaurant_tags", restaurantTagRouter);
router.use(
  "/:restaurantId/restaurant_additional_services",
  restaurantAdditionalServiceRouter
);
router.use(
  "/:restaurantId/updated_menu_images",
  updatedMenuImagesRouter
);
router.use("/:restaurantId/items", itemRouter);

router.route("/").get(getRestaurants).post(createRestaurant);
router.get("/:restaurantId", getRestaurantById);
router.get("/all/search", getAllRestaurantsForLiveSearch);
router.get("/range/:letters", filterRestaurants);
router.get("/location/nearby", findRestaurantsWithinRadius);
router.get("/location/count", findNearbyRestaurantsCount);

export default router;
