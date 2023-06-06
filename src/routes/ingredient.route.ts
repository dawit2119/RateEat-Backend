import express from "express";
import { getIngredients, createIngredient } from "../controllers/ingredient.controller";

const router = express.Router({ mergeParams: true });
router.route("/").get(getIngredients).post(createIngredient);
export default router;
