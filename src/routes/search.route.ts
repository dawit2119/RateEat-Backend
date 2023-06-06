import { Router } from "express";
import { generalSearch } from "../controllers/restaurant.controller";

const router = Router();
router.get("/", generalSearch);

export default router;
