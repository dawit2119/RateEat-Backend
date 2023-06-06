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
exports.createIngredient = exports.getIngredients = void 0;
const models_1 = require("../models");
// @desc GET ingredients in an item
// @route GET /items/:itemId/ingredients
const getIngredients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId;
        const item = yield models_1.Item.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        const ingredients = item.ingredients;
        return res.status(200).json({ ingredients });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getIngredients = getIngredients;
// @desc POST an ingredient for an item
// @route POST /items/:itemId/ingredients
const createIngredient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const item = yield models_1.Item.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        const name = req.body.name;
        if (!name || typeof name !== "string") {
            return res.status(400).json({ message: "Invalid ingredient input" });
        }
        // Create a new ingredient with the name and item id
        const ingredient = yield models_1.Ingredient.create({
            name: name,
            item_id: itemId,
        });
        return res.status(201).json({ ingredient });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.createIngredient = createIngredient;
