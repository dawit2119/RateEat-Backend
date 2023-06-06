import { Router } from "express";
import { filterImage } from "../middlewares/multer";
import { createItemMedia, getItemMedia } from "../controllers/item_media.controller";
import { uploadMediaFiles } from "../middlewares/upload-image";

const router = Router({ mergeParams: true });
router.get("/", getItemMedia)
router.post("/", filterImage.fields([
    { name: "item_images", maxCount: 10 }, 
    { name: "item_videos", maxCount: 10 }, 
  ]), uploadMediaFiles, createItemMedia);

export default router;
