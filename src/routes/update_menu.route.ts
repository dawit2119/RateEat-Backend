import express from "express";
import { filterImage } from "../middlewares/multer";
import { uploadUpdatedMenuImages } from "../middlewares/upload-image";
import { createUpdatedMenuImage, getUpdatedMenuImages } from "../controllers/updated_menu_images.controller";

const router = express.Router({mergeParams: true});
router.post("/", filterImage.fields([
    { name: "updatedMenuImages", maxCount: 15 }, // Allow up to 10 menuImages
  ]), uploadUpdatedMenuImages, createUpdatedMenuImage);
router.route("/").get(getUpdatedMenuImages)

export default router;