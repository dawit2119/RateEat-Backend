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
exports.removeItemFromFavorites = exports.getUserFavorites = exports.addItemToFavorites = void 0;
const error_response_utils_1 = __importDefault(require("../utils/error-response.utils"));
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
const models_1 = require("../models");
// @desc    GET all user favourites
// @route   GET users/:userId/favorites
const getUserFavorites = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.params.userId;
    const user = yield models_1.User.findByPk(user_id);
    if (!user) {
        return next(new error_response_utils_1.default("User does not exist", 400));
    }
    const favourites = yield models_1.EatList.findAll({
        where: { user_id: user_id },
        include: [
            {
                model: models_1.Item,
                attributes: [
                    "id",
                    "name",
                    "average_rating",
                    "price",
                    "description",
                    "number_of_reviews",
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
    });
    return res.status(200).json({ favourites });
}));
exports.getUserFavorites = getUserFavorites;
// @desc    Add item to user favourites
// @route   POST users/:userId/favorites
const addItemToFavorites = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { itemId } = req.body;
    const user = yield models_1.User.findOne({ where: { id: userId } });
    if (!user) {
        return next(new error_response_utils_1.default("User does not exist", 400));
    }
    const item = yield models_1.Item.findByPk(itemId);
    if (!item) {
        return next(new error_response_utils_1.default("Item does not exist", 400));
    }
    // check if the item is already in the user's favourites
    const favourite = yield models_1.EatList.findOne({
        where: { user_id: userId, item_id: itemId },
    });
    if (favourite) {
        return next(new error_response_utils_1.default("Item already in favourites", 400));
    }
    // add item to user's favourites
    yield models_1.EatList.create({
        user_id: userId,
        item_id: itemId,
        date: new Date(),
    });
    return res.status(200).json({ message: "Item added to favourites" });
}));
exports.addItemToFavorites = addItemToFavorites;
// @desc    Remove item from user favourites
// @route   DELETE /users/:userId/favorites/:itemId
const removeItemFromFavorites = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, userId } = req.params;
    const user = yield models_1.User.findOne({ where: { id: userId } });
    if (!user) {
        return next(new error_response_utils_1.default("User does not exist", 400));
    }
    const item = yield models_1.Item.findByPk(itemId);
    if (!item) {
        return next(new error_response_utils_1.default("Item does not exist", 400));
    }
    // check if the item is already in the user's favourites
    const favourite = yield models_1.EatList.findOne({
        where: { user_id: userId, item_id: itemId },
    });
    if (!favourite) {
        return next(new error_response_utils_1.default("Item not in favourites", 400));
    }
    // remove item from user's favourites
    yield models_1.EatList.destroy({
        where: { user_id: userId, item_id: itemId },
    });
    return res.status(200).json({ message: "Item removed from favourites" });
}));
exports.removeItemFromFavorites = removeItemFromFavorites;
