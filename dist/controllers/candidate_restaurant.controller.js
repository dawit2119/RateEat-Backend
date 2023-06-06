"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectCandidateRestaurant = exports.acceptCandidateRestaurant = exports.getAllCandidateRestaurants = exports.getCandidateRestaurant = exports.createCandidateRestaurant = void 0;
const candidate_restaurant_1 = __importDefault(require("../models/incentive/candidate_restaurant"));
const candidate_restaurant_menu_image_1 = __importDefault(require("../models/incentive/candidate_restaurant_menu_image"));
const candidate_restaurant_tag_1 = __importDefault(require("../models/incentive/candidate_restaurant_tag"));
const candidate_restaurant_location_1 = __importDefault(require("../models/incentive/candidate_restaurant_location"));
const candidate_restaurant_license_image_1 = __importDefault(require("../models/incentive/candidate_restaurant_license_image"));
const models_1 = require("../models");
// @desc Create a candidate restaurant
// @route POST /candidateRestaurants
const createCandidateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, opening_hour, closing_hour, is_open, absolute_location, relative_location, tags, } = req.body;
        // Validate the name input
        if (!name || typeof name !== "string") {
            return res.status(400).json({ message: "Invalid name input" });
        }
        const user_id = req.params.userId;
        const candidateRestaurant = yield candidate_restaurant_1.default.create(Object.assign({ name,
            user_id }, req.body));
        const candidateRestaurantId = candidateRestaurant.id;
        const menuImages = req.menuImages;
        const licenseImage = req.licenseImage[0];
        //create tags
        if (tags) {
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                yield candidate_restaurant_tag_1.default.create({
                    candidate_restaurant_id: candidateRestaurantId,
                    name: tag,
                });
            }
        }
        //create locations
        if (absolute_location && relative_location) {
            const [latitude, longitude] = absolute_location.split(",");
            yield candidate_restaurant_location_1.default.create({
                candidate_restaurant_id: candidateRestaurantId,
                latitude,
                longitude,
                description: relative_location,
            });
        }
        //create menu images
        if (menuImages) {
            for (let i = 0; i < menuImages.length; i++) {
                const image_url = menuImages[i];
                yield candidate_restaurant_menu_image_1.default.create({
                    candidate_restaurant_id: candidateRestaurantId,
                    url: image_url,
                });
            }
        }
        //create license images
        if (licenseImage) {
            yield candidate_restaurant_license_image_1.default.create({
                candidate_restaurant_id: candidateRestaurantId,
                url: licenseImage,
            });
        }
        const money_earned = 40;
        //give incentive for creation
        if (money_earned) {
            const incentive = yield models_1.Incentive.findOne({
                where: { user_id: user_id },
            });
            if (!incentive) {
                return res.status(404).json({ message: "Incentive not found" });
            }
            // Update the current total and all time total by adding the money earned
            incentive.current_total += money_earned;
            incentive.all_time_total += money_earned;
            // Save the updated incentive
            yield incentive.save();
        }
        // Return a 201 response with the created candidate restaurant
        return res.status(201).json({ candidateRestaurant });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.createCandidateRestaurant = createCandidateRestaurant;
// @desc Get a candidate restaurant by id
// @route GET /candidateRestaurants/:candidateRestaurantId
const getCandidateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the id from the request parameters
        const id = req.params.candidateRestaurantId;
        const candidateRestaurant = yield candidate_restaurant_1.default.findByPk(id);
        if (!candidateRestaurant) {
            return res
                .status(404)
                .json({ message: "Candidate restaurant not found" });
        }
        // Find the images associated with the candidate restaurant
        const images = yield candidate_restaurant_menu_image_1.default.findAll({
            where: { candidate_restaurant_id: id },
        });
        const candidate_restaurant_menu_images = images.map((image) => image.url);
        const license = yield candidate_restaurant_license_image_1.default.findAll({
            where: { candidate_restaurant_id: candidateRestaurant.id },
        });
        const candidate_restaurant_license_image = license.map((image) => image.url);
        const location = yield candidate_restaurant_location_1.default.findAll({
            where: { candidate_restaurant_id: candidateRestaurant.id },
        });
        const candidate_restaurant_tags = yield candidate_restaurant_tag_1.default.findAll({
            where: { candidate_restaurant_id: candidateRestaurant.id },
        });
        const tags = candidate_restaurant_tags.map((tag) => tag.name);
        // Return a 200 response with the candidate restaurant
        return res
            .status(200)
            .json({
            candidateRestaurant,
            candidate_restaurant_menu_images,
            candidate_restaurant_license_image,
            location,
            tags,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getCandidateRestaurant = getCandidateRestaurant;
// @desc Get a candidate restaurant
// @route GET /candidateRestaurants
const getAllCandidateRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidateRestaurants = yield candidate_restaurant_1.default.findAll();
        const result = yield Promise.all(candidateRestaurants.map((candidateRestaurant) => __awaiter(void 0, void 0, void 0, function* () {
            const images = yield candidate_restaurant_menu_image_1.default.findAll({
                where: { candidate_restaurant_id: candidateRestaurant.id },
            });
            // Map the images array to an array of urls
            const candidate_restaurant_menu_images = images.map((image) => image.url);
            // Return an object with the candidate restaurant and the images array
            return { candidateRestaurant, candidate_restaurant_menu_images };
        })));
        return res.status(200).json({ result });
    }
    catch (error) {
        // If there is any error, return a 500 response with the error message
        return res.status(500).json({ message: error.message });
    }
});
exports.getAllCandidateRestaurants = getAllCandidateRestaurants;
// @desc Accept a candidate restaurant
// @route PUT /candidateRestaurants/:candidateRestaurantId/accept
const acceptCandidateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant_id = req.params.candidateRestaurantId;
        const updatedRows = yield candidate_restaurant_1.default.update({ is_approved: true }, { where: { id: restaurant_id } });
        if (updatedRows[0] === 0) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const candidateRestaurant = yield candidate_restaurant_1.default.findOne({
            where: { id: restaurant_id },
        });
        // Return a 200 response with the updated candidate restaurant
        return res.status(200).json({ candidateRestaurant });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.acceptCandidateRestaurant = acceptCandidateRestaurant;
// @desc Reject a candidate restaurant
// @route PUT /candidateRestaurants/:candidateRestaurantId/reject
const rejectCandidateRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant_id = req.params.candidateRestaurantId;
        const updatedRows = yield candidate_restaurant_1.default.update({ is_rejected: true }, { where: { id: restaurant_id } });
        if (updatedRows[0] === 0) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const candidateRestaurant = yield candidate_restaurant_1.default.findOne({
            where: { id: restaurant_id },
        });
        // Return a 200 response with the updated candidate restaurant
        return res.status(200).json({ candidateRestaurant });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.rejectCandidateRestaurant = rejectCandidateRestaurant;
