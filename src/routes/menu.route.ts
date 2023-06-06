import express from "express";
import { createMenu, getMenu, updateMenu } from "../controllers/menu.controller";

const router = express.Router({ mergeParams: true });
router.route("/").get(getMenu).post(createMenu).put(updateMenu);

export default router;