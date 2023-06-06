"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const candidate_restaurant_controller_1 = require("../controllers/candidate_restaurant.controller");
const multer_1 = require("../middlewares/multer");
const upload_image_1 = require("../middlewares/upload-image");
const router = express_1.default.Router({ mergeParams: true });
router.post("/:userId", multer_1.filterImage.fields([
    { name: "menuImages", maxCount: 10 },
    { name: "licenseImage", maxCount: 1 }, // Allow only 1 licenseImage
]), upload_image_1.uploadCandidateRestaurantImages, candidate_restaurant_controller_1.createCandidateRestaurant);
router.route("/:candidateRestaurantId").get(candidate_restaurant_controller_1.getCandidateRestaurant);
router.route("/:candidateRestaurantId/accept").put(candidate_restaurant_controller_1.acceptCandidateRestaurant);
router.route("/:candidateRestaurantId/reject").put(candidate_restaurant_controller_1.rejectCandidateRestaurant);
router.route("/").get(candidate_restaurant_controller_1.getAllCandidateRestaurants);
exports.default = router;
