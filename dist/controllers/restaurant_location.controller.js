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
exports.createRestaurantLocation = exports.getRestaurantLocations = void 0;
const models_1 = require("../models");
// Get restaurant_locations in an restaurant
// route restaurants/:restaurantId/restaurant_locations
const getRestaurantLocations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = yield models_1.Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const restaurant_locations = restaurant.restaurant_locations;
        return res.status(200).json({ restaurant_locations });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getRestaurantLocations = getRestaurantLocations;
// Create an restaurant_locations for an restaurant
// route restaurants/:restaurantId/restaurant_locations
const createRestaurantLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = yield models_1.Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const { latitude, longitude, description } = req.body;
        let parsedLatitude = parseFloat(latitude);
        let parsedLongitude = parseFloat(longitude);
        if (isNaN(parsedLatitude) || isNaN(parsedLongitude) || !parsedLatitude || !parsedLongitude || !description || typeof description !== "string") {
            return res.status(400).json({ message: "Invalid location input" });
        }
        // Create a new restaurant_location with the name and restaurant id
        const restaurant_location = yield models_1.RestaurantLocation.create({
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            description: description,
            restaurant_id: restaurantId,
        });
        return res.status(201).json({ restaurant_location });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.createRestaurantLocation = createRestaurantLocation;
