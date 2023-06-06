"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurant_phone_number_controller_1 = require("../controllers/restaurant_phone_number.controller");
const router = express_1.default.Router({ mergeParams: true });
router.route('/').get(restaurant_phone_number_controller_1.getRestaurantPhoneNumbers).post(restaurant_phone_number_controller_1.createRestaurantPhoneNumber);
exports.default = router;
