import { Router } from "express";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getItemsByName,
  getItemRecommendations,
  getAllItemsForLiveSearch,
} from "../controllers/item.controller";
import itemReviewRouter from "./item_review.route";
import ingredientRouter from "./ingredient.route";
import itemTagRouter from "./item_tag.route";
import { getAllItemTags } from "../controllers/item_tag.controller";
import itemMediaRouter from "./item_media.route";

const router = Router({ mergeParams: true });
router.use("/:itemId/reviews", itemReviewRouter);
router.use("/:itemId/ingredients", ingredientRouter);
router.use("/:itemId/item_tags", itemTagRouter);
router.use("/:itemId/media", itemMediaRouter)
router.get("/item_tags", getAllItemTags);
router.route("/").get(getItems).post(createItem);
router.route("/search").get(getItemsByName);
router.get("/all/search", getAllItemsForLiveSearch);
router.route("/:itemId").get(getItemById).put(updateItem).delete(deleteItem);
router.route("/:itemId/recommendations").get(getItemRecommendations);

export default router;
