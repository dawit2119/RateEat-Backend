"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurant_additional_service_controller_1 = require("../controllers/restaurant_additional_service.controller");
const router = express_1.default.Router({ mergeParams: true });
router.route('/').get(restaurant_additional_service_controller_1.getRestaurantAdditionalServices).post(restaurant_additional_service_controller_1.createRestaurantAdditionalService);
exports.default = router;
