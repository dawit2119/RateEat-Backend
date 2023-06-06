import { Router } from "express";
import { filterImage } from "../middlewares/multer";
import { createRestaurantMedia, getRestaurantMedia } from "../controllers/restaurant_media.controller";
import { uploadMediaFiles } from "../middlewares/upload-image";

const router = Router({ mergeParams: true });
router.get("/", getRestaurantMedia)
router.post("/", filterImage.fields([
    { name: "restaurant_images", maxCount: 10 }, 
    { name: "restaurant_videos", maxCount: 10 }, 
  ]), uploadMediaFiles, createRestaurantMedia);

export default router;
