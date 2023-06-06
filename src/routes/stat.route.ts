import { Router } from "express";
import { getAllStat, getItemStat, getRestaurantStat, getUserStat } from "../controllers/stat.controller";

const router = Router({ mergeParams: true });
router.get("/users", getUserStat);
router.get("/restaurants", getRestaurantStat);
router.get("/items", getItemStat);
router.get("/", getAllStat)

export default router;
