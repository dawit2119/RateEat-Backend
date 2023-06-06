import express from "express";
import {
  removeItemFromFavorites,
  addItemToFavorites,
  getUserFavorites,
} from "../controllers/eat_list.controller";

const router = express.Router({ mergeParams: true });
router.route("/").get(getUserFavorites).post(addItemToFavorites);
router.route("/:itemId").delete(removeItemFromFavorites);
export default router;
