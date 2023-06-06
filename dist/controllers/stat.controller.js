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
exports.getAllStat = exports.getRestaurantStat = exports.getItemStat = exports.getUserStat = void 0;
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
const models_1 = require("../models");
const error_response_utils_1 = __importDefault(require("../utils/error-response.utils"));
const sequelize_1 = require("sequelize");
// @desc find the statistic of users
// @route GET /stats/users
const getUserStat = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the count of total users
        const totalUsersCount = yield models_1.User.count();
        // Get the count of telegram users
        const telegramUsersCount = yield models_1.User.count({
            where: {
                telegram_id: {
                    [sequelize_1.Op.not]: null,
                },
            },
        });
        const userCounts = {
            totalUsersCount,
            telegramUsersCount,
        };
        return res.status(200).json(userCounts);
    }
    catch (error) {
        return next(new error_response_utils_1.default(error.message, 500));
    }
}));
exports.getUserStat = getUserStat;
const getItemStat = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Count total items
        const totalItems = yield models_1.Item.count();
        // Count item images
        const itemImagesCount = yield models_1.ItemImage.count();
        // Count item videos
        const itemVideosCount = yield models_1.ItemVideo.count();
        // Count item ratings
        const itemRatingsCount = yield models_1.ItemReview.count({
            where: {
                rating: {
                    [sequelize_1.Op.not]: 0,
                },
            },
        });
        const itemCommentsCount = yield models_1.ItemReview.count({
            where: {
                comment: {
                    [sequelize_1.Op.not]: "",
                },
            },
        });
        return res.status(200).json({
            totalItems,
            itemImagesCount,
            itemVideosCount,
            itemRatingsCount,
            itemCommentsCount
        });
    }
    catch (error) {
        return next(error);
    }
}));
exports.getItemStat = getItemStat;
const getRestaurantStat = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Count total restaurants
        const totalRestaurants = yield models_1.Restaurant.count();
        // Count restaurant images
        const restaurantImagesCount = yield models_1.RestaurantImage.count();
        // Count restaurant videos
        const restaurantVideosCount = yield models_1.RestaurantVideo.count();
        // Count restaurant ratings
        const restaurantRatingsCount = yield models_1.RestaurantReview.count({
            where: {
                rating: {
                    [sequelize_1.Op.not]: 0,
                },
            },
        });
        const restaurantCommentsCount = yield models_1.RestaurantReview.count({
            where: {
                comment: {
                    [sequelize_1.Op.not]: "",
                },
            },
        });
        // Count candidate restaurants with accepted true
        const candidateRestaurantsAccepted = yield models_1.CandidateRestaurant.count({
            where: {
                is_approved: true,
            },
        });
        // Count candidate restaurants with accepted false
        const candidateRestaurantsNotAccepted = yield models_1.CandidateRestaurant.count({
            where: {
                is_approved: false,
            },
        });
        return res.status(200).json({
            totalRestaurants,
            restaurantImagesCount,
            restaurantVideosCount,
            restaurantRatingsCount,
            restaurantCommentsCount,
            candidateRestaurantsAccepted,
            candidateRestaurantsNotAccepted,
        });
    }
    catch (error) {
        return next(error);
    }
}));
exports.getRestaurantStat = getRestaurantStat;
const getAllStat = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the count of total users
        const totalUsersCount = yield models_1.User.count();
        // Get the count of telegram users
        const telegramUsersCount = yield models_1.User.count({
            where: {
                telegram_id: {
                    [sequelize_1.Op.not]: null,
                },
            },
        });
        // Count total items
        const totalItems = yield models_1.Item.count();
        // Count item images
        const itemImagesCount = yield models_1.ItemImage.count();
        // Count item videos
        const itemVideosCount = yield models_1.ItemVideo.count();
        // Count item ratings
        const itemRatingsCount = yield models_1.ItemReview.count({
            where: {
                rating: {
                    [sequelize_1.Op.not]: 0,
                },
            },
        });
        const itemCommentsCount = yield models_1.ItemReview.count({
            where: {
                comment: {
                    [sequelize_1.Op.not]: "",
                },
            },
        });
        // Count total restaurants
        const totalRestaurants = yield models_1.Restaurant.count();
        // Count restaurant images
        const restaurantImagesCount = yield models_1.RestaurantImage.count();
        // Count restaurant videos
        const restaurantVideosCount = yield models_1.RestaurantVideo.count();
        // Count restaurant ratings
        const restaurantRatingsCount = yield models_1.RestaurantReview.count({
            where: {
                rating: {
                    [sequelize_1.Op.not]: 0,
                },
            },
        });
        const restaurantCommentsCount = yield models_1.RestaurantReview.count({
            where: {
                comment: {
                    [sequelize_1.Op.not]: "",
                },
            },
        });
        // Count candidate restaurants with accepted true
        const candidateRestaurantsAccepted = yield models_1.CandidateRestaurant.count({
            where: {
                is_approved: true,
            },
        });
        // Count candidate restaurants with accepted false
        const candidateRestaurantsNotAccepted = yield models_1.CandidateRestaurant.count({
            where: {
                is_approved: false,
            },
        });
        const statCounts = {
            totalUsersCount,
            telegramUsersCount,
            itemRatingsCount,
            itemImagesCount,
            itemCommentsCount,
            itemVideosCount,
            restaurantRatingsCount,
            restaurantImagesCount,
            restaurantCommentsCount,
            restaurantVideosCount,
            candidateRestaurantsNotAccepted,
            totalRestaurants
        };
        return res.status(200).json(statCounts);
    }
    catch (error) {
        return next(new error_response_utils_1.default(error.message, 500));
    }
}));
exports.getAllStat = getAllStat;
