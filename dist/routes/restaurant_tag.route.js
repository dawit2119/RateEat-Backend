"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurant_tag_controller_1 = require("../controllers/restaurant_tag.controller");
const router = (0, express_1.Router)({ mergeParams: true });
router.route("/").get(restaurant_tag_controller_1.getRestaurantTags).post(restaurant_tag_controller_1.createRestaurantTag);
exports.default = router;
