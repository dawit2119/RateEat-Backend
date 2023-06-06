"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ingredient_controller_1 = require("../controllers/ingredient.controller");
const router = express_1.default.Router({ mergeParams: true });
router.route("/").get(ingredient_controller_1.getIngredients).post(ingredient_controller_1.createIngredient);
exports.default = router;
