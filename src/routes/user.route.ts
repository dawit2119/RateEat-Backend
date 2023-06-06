import express from "express";
import {
  createUser,
  checkUserExists,
  getUsers,
  getUserById,
  getUserByTelegramId,
  updateUser,
  deleteUser,
  getAllReviewsByUser,
  getRestaurantReviewsByUser,
  getItemReviewsByUser,
} from "../controllers/user.controller";
import incentiveRouter from "./incentive.route";
import eatListRouter from "./eat_list.route";
import { filterImage } from "../middlewares/multer";
import { uploadProfileImages } from "../middlewares/upload-image";

const router = express.Router();
router.use("/:userId", incentiveRouter);
router.use("/:userId/favorites", eatListRouter);
router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUserById).delete(deleteUser);
router.put("/:id", filterImage.single("file"), uploadProfileImages, updateUser);
router.route("/telegram/:telegramId").get(getUserByTelegramId);
router.post("/check", checkUserExists);
router.get("/:userId/reviews", getAllReviewsByUser);
router.get("/:userId/restaurant_reviews", getRestaurantReviewsByUser);
router.get("/:userId/item_reviews", getItemReviewsByUser);

export default router;
