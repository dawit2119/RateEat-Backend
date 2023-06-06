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
exports.getAllRestaurantsForLiveSearch = exports.generalSearch = exports.findNearbyRestaurantsCount = exports.findRestaurantsWithinRadius = exports.getRestaurantById = exports.filterRestaurants = exports.createRestaurant = exports.getRestaurants = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
const error_response_utils_1 = __importDefault(require("../utils/error-response.utils"));
const sequelize_typescript_1 = require("sequelize-typescript");
// @desc    Get all restaurants
// @route   GET /restaurants
const getRestaurants = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit, latitude, longitude, radius, maxPrice, minRating, tags, popularity, } = req.query;
    const currPage = parseInt(page, 10) || 1;
    const limitNeeded = parseInt(limit, 10) || 5;
    const startIndex = (currPage - 1) * limitNeeded;
    const endIndex = currPage * limitNeeded;
    let whereCondition = {};
    if (searchTerm) {
        const searchWords = searchTerm.toLowerCase().split(" ");
        if (searchWords.length > 1) {
            whereCondition = Object.assign(Object.assign({}, whereCondition), { name: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } });
        }
        else {
            // Match at the beginning for single words
            whereCondition = Object.assign(Object.assign({}, whereCondition), { [sequelize_1.Op.or]: searchWords.map((word) => ({
                    name: {
                        [sequelize_1.Op.or]: [
                            { [sequelize_1.Op.iLike]: `${word}%` },
                            { [sequelize_1.Op.iLike]: `%${word}%` }, // Match anywhere in the name
                        ],
                    },
                })) });
        }
    }
    let includeOptions = [
        {
            model: models_1.Menu,
            attributes: ["id"],
            include: [
                {
                    model: models_1.Category,
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: models_1.Item,
                            attributes: ["id", "name", "price", "description"],
                            order: [
                                ["average_rating", "DESC"],
                                ["popularity_index", "ASC"],
                            ],
                            limit: 10,
                        },
                    ],
                },
            ],
        },
        {
            model: models_1.RestaurantTag,
            attributes: ["id", "name"],
            limit: 4,
        },
        {
            model: models_1.RestaurantImage,
            attributes: ["id", "url"],
        },
        {
            model: models_1.RestaurantVideo,
            attributes: ["id", "url"],
        },
        {
            model: models_1.RestaurantLocation,
            attributes: ["id", "latitude", "longitude", "description"],
        },
    ];
    let restaurants = [];
    if (latitude && longitude) {
        const lat = parseFloat(latitude);
        const long = parseFloat(longitude);
        const rad = parseInt(radius, 10) || 1000;
        includeOptions.push({
            model: models_1.RestaurantLocation,
            attributes: ["id", "latitude", "longitude", "description"],
            where: (0, sequelize_1.literal)(`ST_DWithin(
            geography(ST_MakePoint(${long}, ${lat})),
            geography(ST_MakePoint("restaurant_locations"."longitude", "restaurant_locations"."latitude")),
            ${rad}
          )`),
        });
    }
    if (tags) {
        const tagArray = tags.split(",").map((tag) => tag.trim());
        includeOptions.push({
            model: models_1.RestaurantTag,
            attributes: ["id", "name"],
            where: {
                name: {
                    [sequelize_1.Op.or]: tagArray,
                },
            },
        });
    }
    if (maxPrice) {
        const maxPriceValue = parseInt(maxPrice, 10);
        whereCondition = Object.assign(Object.assign({}, whereCondition), { average_price: {
                [sequelize_1.Op.lte]: maxPriceValue, // less than or equal to
            } });
    }
    if (minRating) {
        const minRatingValue = parseInt(minRating, 10);
        whereCondition = Object.assign(Object.assign({}, whereCondition), { average_rating: {
                [sequelize_1.Op.gte]: minRatingValue, // greater than or equal to
            } });
    }
    const commonQueryOptions = {
        where: whereCondition,
        include: includeOptions,
    };
    let totalRestaurants = 0;
    if (popularity) {
        const result = yield models_1.Restaurant.findAndCountAll(Object.assign(Object.assign({}, commonQueryOptions), { order: [["popularity_index", "DESC"]], distinct: true }));
        restaurants = result.rows;
        totalRestaurants = result.count;
    }
    else {
        const result = yield models_1.Restaurant.findAndCountAll(Object.assign(Object.assign({}, commonQueryOptions), { order: [
                ["average_rating", "DESC"],
                ["average_price", "ASC"],
                ["popularity_index", "DESC"],
            ], distinct: true }));
        restaurants = result.rows;
        totalRestaurants = result.count;
    }
    // increment the popularity index by 1
    restaurants.forEach((restaurant) => __awaiter(void 0, void 0, void 0, function* () {
        yield restaurant.incrementPopularity();
    }));
    // pagination
    const pagination = {};
    if (endIndex < totalRestaurants) {
        pagination.next = {
            page: currPage + 1,
            limit: limitNeeded,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: currPage - 1,
            limit: limitNeeded,
        };
    }
    const totalPages = Math.ceil(totalRestaurants / limitNeeded);
    res.status(200).json({
        success: true,
        count: restaurants.length,
        pagination,
        totalPages,
        data: restaurants.slice(startIndex, endIndex),
    });
}));
exports.getRestaurants = getRestaurants;
// @desc Get all restaurants for live search
// @route GET /restaurants/all/search?searchTerm=searchTerm
const getAllRestaurantsForLiveSearch = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.query;
    let whereCondition = {};
    if (searchTerm) {
        const searchWords = searchTerm.toLowerCase().split(" ");
        whereCondition = {
            [sequelize_1.Op.or]: searchWords.map((word) => ({
                name: { [sequelize_1.Op.iLike]: `%${word}%` },
            })),
        };
    }
    const restaurants = yield models_1.Restaurant.findAll({
        where: whereCondition,
        attributes: ["id", "name"],
    });
    res.status(200).json({
        success: true,
        count: restaurants.length,
        data: restaurants,
    });
}));
exports.getAllRestaurantsForLiveSearch = getAllRestaurantsForLiveSearch;
// @desc    Get a restaurant by ID
// @route   GET /restaurant/:restaurantId
const getRestaurantById = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId } = req.params;
    if (!restaurantId) {
        next(new error_response_utils_1.default("Restaurant ID is required", 400));
        return;
    }
    const restaurant = yield models_1.Restaurant.findByPk(restaurantId);
    if (!restaurant) {
        next(new error_response_utils_1.default("Restaurant not found", 404));
        return;
    }
    const restaurantImages = yield models_1.RestaurantImage.findAll({
        where: { restaurant_id: restaurant.id }, // Match by restaurant_id
    });
    const restaurantVideos = yield models_1.RestaurantVideo.findAll({
        where: { restaurant_id: restaurant.id }, // Match by restaurant_id
    });
    const restaurantLocations = yield models_1.RestaurantLocation.findAll({
        where: { restaurant_id: restaurant.id },
    });
    // Attach the images to the restaurant object
    const restaurantWithImages = Object.assign(Object.assign({}, restaurant.dataValues), { restaurant_images: restaurantImages, restaurant_videos: restaurantVideos, restaurant_locations: restaurantLocations });
    res.status(200).json(restaurantWithImages);
}));
exports.getRestaurantById = getRestaurantById;
// @desc    Get paginated restaurants filtered by given letters range
// @route   GET /range/:letters
const filterRestaurants = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    let { letters } = req.params;
    letters = letters.toUpperCase();
    const startCharCode = letters.charCodeAt(0);
    const endCharCode = letters.charCodeAt(2);
    const whereCondition = {
        [sequelize_1.Op.and]: [
            sequelize_typescript_1.Sequelize.literal(`ASCII(SUBSTRING(name, 1, 1)) >= ${startCharCode}`),
            sequelize_typescript_1.Sequelize.literal(`ASCII(SUBSTRING(name, 1, 1)) <= ${endCharCode}`),
        ],
    };
    // pagination
    const currPage = parseInt(page, 10) || 1;
    const limitNeeded = parseInt(limit, 10) || 5;
    const startIndex = (currPage - 1) * limitNeeded;
    const endIndex = currPage * limitNeeded;
    const totalRestaurants = yield models_1.Restaurant.count({
        where: whereCondition,
    });
    const pagination = {};
    if (endIndex < totalRestaurants) {
        pagination.next = {
            page: currPage + 1,
            limit: limitNeeded,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: currPage - 1,
            limit: limitNeeded,
        };
    }
    const totalPages = Math.ceil(totalRestaurants / limitNeeded);
    const restaurants = yield models_1.Restaurant.findAll({
        where: whereCondition,
        include: [
            {
                model: models_1.RestaurantImage,
                attributes: ["id", "url"],
            },
            {
                model: models_1.RestaurantVideo,
                attributes: ["id", "url"],
            },
            {
                model: models_1.RestaurantLocation,
                attributes: ["id", "latitude", "longitude", "description"],
            },
            {
                model: models_1.RestaurantReview,
                attributes: ["id", "rating", "comment"],
            },
        ],
        order: ["name"],
        limit: limitNeeded,
        offset: startIndex,
    });
    res.status(200).json({
        success: true,
        count: restaurants.length,
        pagination,
        totalPages,
        data: restaurants,
    });
}));
exports.filterRestaurants = filterRestaurants;
// @desc    Create a restaurant
// @route   POST /restaurants
const createRestaurant = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, openingHour, closingHour, isOpen } = req.body;
    const existingRestaurant = yield models_1.Restaurant.findOne({ where: { name } });
    if (existingRestaurant) {
        return next(new error_response_utils_1.default("Restaurant already exists", 400));
    }
    const restaurant = yield models_1.Restaurant.create({
        name,
        opening_hour: openingHour,
        closing_hour: closingHour,
        is_open: isOpen,
    });
    return res.status(201).json({
        message: "Restaurant created successfully",
        restaurant,
    });
}));
exports.createRestaurant = createRestaurant;
// @desc    find nearby restaurants
// @route   GET /restaurants/radius/nearby?lat=lat&long=long&radius=radius
const findRestaurantsWithinRadius = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { lat, long, radius } = req.query;
    if (!lat || !long || !radius) {
        return next(new error_response_utils_1.default("Latitude, longitude, and radius are required", 400));
    }
    const restaurants = yield models_1.Restaurant.findAll({
        include: [
            {
                model: models_1.RestaurantLocation,
                attributes: ["latitude", "longitude", "description"],
                where: (0, sequelize_1.literal)(`ST_DWithin(
              geography(ST_MakePoint(${parseFloat(long.toString())}, ${parseFloat(lat.toString())})),
              geography(ST_MakePoint(restaurant_locations.longitude, restaurant_locations.latitude)),
              ${parseInt(radius.toString(), 10)}
            )`),
            },
        ],
    });
    res.status(200).json({ success: true, restaurants });
}));
exports.findRestaurantsWithinRadius = findRestaurantsWithinRadius;
// @desc    Find the count of nearby restaurants
// @route   GET /restaurants/radius/count?lat=lat&long=long&radius=radius
const findNearbyRestaurantsCount = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { lat, long, radius } = req.query;
    if (!lat || !long || !radius) {
        return next(new error_response_utils_1.default("Latitude, longitude, and radius are required", 400));
    }
    const count = yield models_1.Restaurant.count({
        include: [
            {
                model: models_1.RestaurantLocation,
                attributes: ["latitude", "longitude", "description"],
                where: (0, sequelize_1.literal)(`ST_DWithin(
              geography(ST_MakePoint(${parseFloat(long.toString())}, ${parseFloat(lat.toString())})),
              geography(ST_MakePoint(restaurant_locations.longitude, restaurant_locations.latitude)),
              ${parseInt(radius.toString(), 10)}
            )`),
            },
        ],
    });
    res.status(200).json({
        success: true,
        count,
    });
}));
exports.findNearbyRestaurantsCount = findNearbyRestaurantsCount;
// @desc    Get all restaurants and items with fuzzy search based on item_tags and restaurant_tags
// @route   GET restaurants/general-search?searchTerm=searchTerm
const generalSearch = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, page, limit } = req.query;
    let whereConditionRestaurants = {};
    let whereConditionItems = {};
    if (searchTerm) {
        const searchWords = searchTerm.toLowerCase().split(" ");
        whereConditionRestaurants = {
            [sequelize_1.Op.or]: searchWords.map((word) => ({
                "$restaurant_tags.name$": {
                    [sequelize_1.Op.iLike]: `%${word}%`,
                },
            })),
        };
        whereConditionItems = {
            [sequelize_1.Op.or]: searchWords.map((word) => ({
                "$item_tags.name$": {
                    [sequelize_1.Op.iLike]: `%${word}%`,
                },
            })),
        };
    }
    const restaurants = yield models_1.Restaurant.findAll({
        where: whereConditionRestaurants,
        include: [
            {
                model: models_1.RestaurantTag,
                attributes: ["id", "name"],
            },
        ],
    });
    const items = yield models_1.Item.findAll({
        where: whereConditionItems,
        include: [
            {
                model: models_1.ItemTag,
                attributes: ["id", "name"],
            },
        ],
    });
    res.status(200).json({
        success: true,
        restaurants: restaurants,
        items: items,
    });
}));
exports.generalSearch = generalSearch;
