"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurant_controller_1 = require("../controllers/restaurant.controller");
const router = (0, express_1.Router)();
router.get("/", restaurant_controller_1.generalSearch);
exports.default = router;
