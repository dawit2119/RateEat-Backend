import { Router } from "express";
import {
  getItemTags,
  createItemTag,
} from "../controllers/item_tag.controller";

const router = Router({ mergeParams: true });
router.route("/").get(getItemTags).post(createItemTag);

export default router;
