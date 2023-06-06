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
exports.createRestaurantTag = exports.getRestaurantTags = void 0;
const models_1 = require("../models");
// Get restaurant_tags in an restaurant
// route restaurants/:restaurantId/restaurant_tags
const getRestaurantTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = yield models_1.Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const restaurant_tags = restaurant.restaurant_tags;
        return res.status(200).json({ restaurant_tags });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getRestaurantTags = getRestaurantTags;
// Create an restaurant_tags for an restaurant
// route restaurants/:restaurantId/restaurant_tags
const createRestaurantTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = yield models_1.Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const name = req.body.name;
        if (!name || typeof name !== "string") {
            return res.status(400).json({ message: "Invalid tag input" });
        }
        // Create a new restaurant_tag with the name and restaurant id
        const restaurant_tag = yield models_1.RestaurantTag.create({
            name: name,
            restaurant_id: restaurantId,
        });
        return res.status(201).json({ restaurant_tag });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.createRestaurantTag = createRestaurantTag;
