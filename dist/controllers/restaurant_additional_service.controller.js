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
exports.createRestaurantAdditionalService = exports.getRestaurantAdditionalServices = void 0;
const models_1 = require("../models");
// Get restaurant_additional_services in an restaurant
// route restaurants/:restaurantId/restaurant_additional_services
const getRestaurantAdditionalServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = yield models_1.Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const restaurant_additional_services = restaurant.restaurant_additional_services;
        return res.status(200).json({ restaurant_additional_services });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getRestaurantAdditionalServices = getRestaurantAdditionalServices;
// Create an restaurant_additional_services for an restaurant
// route restaurants/:restaurantId/restaurant_additional_services
const createRestaurantAdditionalService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = yield models_1.Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const { additional_service } = req.body;
        if (!additional_service || typeof additional_service !== "string") {
            return res.status(400).json({ message: "Invalid additional service input" });
        }
        // Create a new restaurant_additional_service with the name and restaurant id
        const restaurant_additional_service = yield models_1.RestaurantAdditionalService.create({
            additional_service: additional_service,
            restaurant_id: restaurantId,
        });
        return res.status(201).json({ restaurant_additional_service });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.createRestaurantAdditionalService = createRestaurantAdditionalService;
