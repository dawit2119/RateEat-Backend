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
exports.getCategories = exports.createCategory = void 0;
const models_1 = require("../models");
// @desc    Get categories of a menu
// @route   GET restaurants/:restaurantId/menu/categories
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        const menu = yield models_1.Menu.findOne({
            where: { restaurant_id: restaurantId },
            include: ["category"],
        });
        if (!menu) {
            return res.status(404).json({ error: "Menu not found" });
        }
        return res.status(200).json({ categories: menu.category });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getCategories = getCategories;
// @desc    Create a category
// @route   POST restaurants/:restaurantId/menu/categories
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        const { name } = req.body;
        const restaurant = yield models_1.Restaurant.findOne({
            where: { id: restaurantId },
        });
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }
        const menu = yield models_1.Menu.findOne({
            where: { restaurant_id: restaurantId },
        });
        if (!menu) {
            return res.status(404).json({ error: "Menu not found" });
        }
        const category = yield models_1.Category.create({
            menu_id: menu.id,
            name: name,
        });
        return res.status(201).json({ category });
        ;
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: `Internal server error ${error.message}` });
    }
});
exports.createCategory = createCategory;
