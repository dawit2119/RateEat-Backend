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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpdatedMenuImages = exports.createUpdatedMenuImage = void 0;
const models_1 = require("../models");
// @desc Create updated menu images
// @route POST /restaurant/:restaurant_id/updatedMenu
const createUpdatedMenuImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, } = req.body;
        const restaurant_id = req.params.restaurantId;
        const updatedMenuImages = req.updatedMenuImages;
        //create menu images
        if (updatedMenuImages) {
            for (let i = 0; i < updatedMenuImages.length; i++) {
                const url = updatedMenuImages[i];
                yield models_1.UpdatedMenuImage.create({
                    user_id,
                    restaurant_id,
                    url
                });
            }
        }
        // Return a 201 response with the created candidate restaurant
        return res.status(201).json({ message: "Updated menu created successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.createUpdatedMenuImage = createUpdatedMenuImage;
// @desc Get menu images of a restaurant by id
// @route GET /restaurant/:restaurant_id/updatedMenu
const getUpdatedMenuImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the id from the request parameters
        const restaurant_id = req.params.RestaurantId;
        const restaurant = yield models_1.Restaurant.findByPk(restaurant_id);
        if (!restaurant) {
            return res
                .status(404)
                .json({ message: "Restaurant not found" });
        }
        // Find the images associated with the candidate restaurant
        const images = yield models_1.UpdatedMenuImage.findAll({
            where: { restaurant_id },
        });
        const restaurant_updated_menu_images = images.map((image) => image.url);
        // Return a 200 response with the candidate restaurant
        return res.status(200).json({
            restaurant_updated_menu_images,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getUpdatedMenuImages = getUpdatedMenuImages;
