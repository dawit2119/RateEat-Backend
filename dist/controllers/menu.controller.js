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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMenu = exports.deleteMenu = exports.updateMenu = exports.getMenu = void 0;
const models_1 = require("../models");
const error_response_utils_1 = __importDefault(require("../utils/error-response.utils"));
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
// @desc    Get menu of a restaurant
// @route   GET /restaurant/:restuarantId/menu
const getMenu = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    const restaurant = yield models_1.Restaurant.findByPk(restaurantId);
    if (!restaurant) {
        return next(new error_response_utils_1.default("Restaurant not found", 404));
    }
    const menu = yield models_1.Menu.findOne({
        where: { restaurant_id: restaurantId },
        include: [
            {
                model: models_1.Category,
                as: "category",
                attributes: ["id", "name", "menu_id"],
                include: [
                    {
                        model: models_1.Item,
                        as: "item",
                        order: [["average_rating", "DSC"]],
                        attributes: [
                            "id",
                            "name",
                            "description",
                            "number_of_reviews",
                            "average_rating",
                            "price",
                            "fasting",
                        ],
                        include: [
                            {
                                model: models_1.ItemImage,
                                attributes: ["id", "url"],
                            },
                            {
                                model: models_1.ItemVideo,
                                attributes: ["id", "url"],
                            },
                        ],
                    },
                ],
            },
        ],
    });
    if (!menu) {
        return next(new error_response_utils_1.default("Menu not found", 404));
    }
    return res.json({ success: true, menu: menu.dataValues });
}));
exports.getMenu = getMenu;
//@desc     Create menu
//@route    POST /restaurant/:restuarantId/menu
const createMenu = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    const restaurant = yield models_1.Restaurant.findByPk(restaurantId, {
        include: ["menu"],
    });
    if (!restaurant) {
        return next(new error_response_utils_1.default("Restaurant not found", 404));
    }
    if (restaurant.menu) {
        return next(new error_response_utils_1.default("Menu already exists for this restaurant", 400));
    }
    const menu = yield models_1.Menu.create({
        restaurant_id: restaurantId,
    });
    return res.status(201).json({ message: "Menu created successfully", menu });
}));
exports.createMenu = createMenu;
// when we want to update the menu's ID
// @desc    update menu ID of a restaurant
// @route   PUT /restaurant/:restuarantId/menu
const updateMenu = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    const { newId } = req.body;
    const restaurant = yield models_1.Restaurant.findByPk(restaurantId, {
        include: ["menu"],
    });
    if (!restaurant) {
        return next(new error_response_utils_1.default("Restaurant not found", 404));
    }
    if (restaurant.menu.length === 0) {
        const newMenu = yield restaurant.$create("menu", { id: newId });
        return res.json({ menu: newMenu });
    }
    yield restaurant.menu[0].update({ id: newId });
    return res.json({ message: "Menu updated successfully" });
}));
exports.updateMenu = updateMenu;
// @desc    Delete menu of a restaurant
// @route   DELETE /restaurant/:restuarant_id/menu
const deleteMenu = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    const restaurant = yield models_1.Restaurant.findByPk(restaurantId, {
        include: ["menu"],
    });
    if (!restaurant) {
        return next(new error_response_utils_1.default("Restaurant not found", 404));
    }
    if (restaurant.menu.length === 0) {
        return next(new error_response_utils_1.default("Menu not found", 404));
    }
    yield restaurant.menu[0].destroy();
    return res.json({ message: "Menu deleted successfully" });
}));
exports.deleteMenu = deleteMenu;
