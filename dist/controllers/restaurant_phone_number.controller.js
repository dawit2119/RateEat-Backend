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
exports.createRestaurantPhoneNumber = exports.getRestaurantPhoneNumbers = void 0;
const models_1 = require("../models");
// Get restaurant_phone_numbers in an restaurant
// route restaurants/:restaurantId/restaurant_phone_numbers
const getRestaurantPhoneNumbers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = yield models_1.Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const restaurant_phone_numbers = restaurant.restaurant_phone_numbers;
        return res.status(200).json({ restaurant_phone_numbers });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getRestaurantPhoneNumbers = getRestaurantPhoneNumbers;
// Create an restaurant_phone_numbers for an restaurant
// route restaurants/:restaurantId/restaurant_phone_numbers
const createRestaurantPhoneNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const restaurant = yield models_1.Restaurant.findByPk(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const { phone_number } = req.body;
        if (!phone_number || typeof phone_number !== "string") {
            return res.status(400).json({ message: "Invalid phone number input" });
        }
        // Create a new restaurant_phone_number with the name and restaurant id
        const restaurant_phone_number = yield models_1.RestaurantPhoneNumber.create({
            phone_number: phone_number,
            restaurant_id: restaurantId,
        });
        return res.status(201).json({ restaurant_phone_number });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.createRestaurantPhoneNumber = createRestaurantPhoneNumber;
