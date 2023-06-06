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
exports.createRestaurantMedia = exports.getRestaurantMedia = void 0;
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
const models_1 = require("../models");
// @desc get all restaurant's media
// @route GET /restaurants/:restaurantId/media
const getRestaurantMedia = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant_id = req.params.restaurantId;
        const restaurantImages = yield models_1.RestaurantImage.findAll({
            where: { restaurant_id: restaurant_id },
            attributes: ['url']
        });
        const restaurantVideos = yield models_1.RestaurantVideo.findAll({
            where: { restaurant_id: restaurant_id },
            attributes: ['url']
        });
        res.status(200).json({
            restaurant_id,
            restaurantImages: restaurantImages,
            restaurantVideos: restaurantVideos
        });
    }
    catch (error) {
        console.log(next(error));
    }
}));
exports.getRestaurantMedia = getRestaurantMedia;
// @desc create a new media for a restaurant
// @route POST /restaurants/:restaurantId/media
const createRestaurantMedia = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurant_id = req.params.restaurantId;
        const restaurant = yield models_1.Restaurant.findOne({
            where: { id: restaurant_id }
        });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        if (req.mediaImages) {
            const restaurantImages = req.mediaImages;
            for (let i = 0; i < restaurantImages.length; i++) {
                yield models_1.RestaurantImage.create({
                    url: restaurantImages[i],
                    restaurant_id: restaurant_id
                });
            }
        }
        if (req.mediaVideos) {
            const restaurantVideos = req.mediaVideos;
            for (let i = 0; i < restaurantVideos.length; i++) {
                yield models_1.RestaurantVideo.create({
                    url: restaurantVideos[i],
                    restaurant_id: restaurant_id
                });
            }
        }
        return res
            .status(201)
            .json({ message: "Medias created successfully" });
    }
    catch (error) {
        return next(error);
    }
}));
exports.createRestaurantMedia = createRestaurantMedia;
