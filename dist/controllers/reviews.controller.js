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
exports.getAllRestaurantReviews = exports.getAllItemReviews = void 0;
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
const models_1 = require("../models");
// @desc    find all total item reviews
// @route   GET /reviews/item_reviews
const getAllItemReviews = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, page = 1 } = req.query;
    const perPage = parseInt(limit, 10);
    const currentPage = parseInt(page, 10);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = currentPage * perPage;
    const itemReviewCount = yield models_1.ItemReview.count();
    const totalReviewCount = itemReviewCount;
    const totalPages = Math.ceil(totalReviewCount / perPage);
    const pagination = {};
    if (endIndex < totalReviewCount) {
        pagination.next = { page: currentPage + 1, limit: perPage };
    }
    if (startIndex > 0) {
        pagination.prev = { page: currentPage - 1, limit: perPage };
    }
    const itemReviews = yield models_1.ItemReview.findAll({
        include: [
            {
                model: models_1.Item,
                attributes: ["id", "name"],
            },
            {
                model: models_1.ItemReviewImage,
                attributes: ["id", "url"],
            },
            {
                model: models_1.ItemReviewVideo,
                attributes: ["id", "url"],
            },
        ],
    });
    return res
        .status(200)
        .json({ totalPages, pagination, data: { itemReviews } });
}));
exports.getAllItemReviews = getAllItemReviews;
// @desc    find all total restaurant reviews
// @route   GET /reviews/restaurant_reviews
const getAllRestaurantReviews = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, page = 1 } = req.query;
    const perPage = parseInt(limit, 10);
    const currentPage = parseInt(page, 10);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = currentPage * perPage;
    const restaurantReviewCount = yield models_1.RestaurantReview.count();
    const totalReviewCount = restaurantReviewCount;
    const totalPages = Math.ceil(totalReviewCount / perPage);
    const pagination = {};
    if (endIndex < totalReviewCount) {
        pagination.next = { page: currentPage + 1, limit: perPage };
    }
    if (startIndex > 0) {
        pagination.prev = { page: currentPage - 1, limit: perPage };
    }
    const restaurantReviews = yield models_1.RestaurantReview.findAll({
        include: [
            {
                model: models_1.Restaurant,
                attributes: ["id", "name"],
            },
            {
                model: models_1.RestaurantReviewImage,
                attributes: ["id", "url"],
            },
            {
                model: models_1.RestaurantReviewVideo,
                attributes: ["id", "url"],
            },
        ],
    });
    return res
        .status(200)
        .json({ totalPages, pagination, data: { restaurantReviews } });
}));
exports.getAllRestaurantReviews = getAllRestaurantReviews;
