import express from "express";
import{
    getCandidateRestaurant,
    getAllCandidateRestaurants,
    createCandidateRestaurant,
    acceptCandidateRestaurant,
    rejectCandidateRestaurant
} from "../controllers/candidate_restaurant.controller";
import { filterImage } from "../middlewares/multer";
import { uploadCandidateRestaurantImages } from "../middlewares/upload-image";

const router = express.Router({mergeParams: true});
router.post("/:userId", filterImage.fields([
    { name: "menuImages", maxCount: 10 }, // Allow up to 10 menuImages
    { name: "licenseImage", maxCount: 1 }, // Allow only 1 licenseImage
  ]), uploadCandidateRestaurantImages, createCandidateRestaurant);
router.route("/:candidateRestaurantId").get(getCandidateRestaurant)
router.route("/:candidateRestaurantId/accept").put(acceptCandidateRestaurant)
router.route("/:candidateRestaurantId/reject").put(rejectCandidateRestaurant)
router.route("/").get(getAllCandidateRestaurants);

export default router;