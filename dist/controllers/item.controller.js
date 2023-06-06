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
exports.getAllItemsForLiveSearch = exports.getItemRecommendations = exports.getItemsByName = exports.updateItem = exports.deleteItem = exports.createItem = exports.getItemById = exports.getItems = void 0;
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
const error_response_utils_1 = __importDefault(require("../utils/error-response.utils"));
// @desc    Get all items with optional search term
// @route   GET /items
// @route   GET /restaurants/:restaurantId/items
// @route   GET /restaurants/:restaurantId/menu/categories/:categoryId/items
const getItems = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId, categoryId } = req.params;
    const { searchTerm, page, limit, maxPrice, minRating, fasting, sortedBy } = req.query;
    const { userId } = req.body;
    const currPage = parseInt(page, 10) || 1;
    const limitNeeded = parseInt(limit, 10) || 5;
    const startIndex = (currPage - 1) * limitNeeded;
    const endIndex = currPage * limitNeeded;
    let whereCondition = {};
    if (restaurantId) {
        if (categoryId) {
            whereCondition = { category_id: categoryId };
        }
        else {
            const categories = yield models_1.Category.findAll({
                include: [
                    {
                        model: models_1.Menu,
                        where: { restaurant_id: restaurantId },
                    },
                ],
            });
            whereCondition = {
                category_id: { [sequelize_1.Op.in]: categories.map((c) => c.id) },
            };
        }
    }
    else if (categoryId) {
        whereCondition = { category_id: categoryId };
    }
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
    if (maxPrice) {
        const maxPriceValue = parseInt(maxPrice, 10);
        whereCondition = Object.assign(Object.assign({}, whereCondition), { price: {
                [sequelize_1.Op.lte]: maxPriceValue, // less than or equal to
            } });
    }
    if (minRating) {
        const minRatingValue = parseInt(minRating, 10);
        whereCondition = Object.assign(Object.assign({}, whereCondition), { average_rating: {
                [sequelize_1.Op.gte]: minRatingValue, // greater than or equal to
            } });
    }
    if (fasting) {
        const fastingValue = fasting === "true";
        whereCondition = Object.assign(Object.assign({}, whereCondition), { fasting: fastingValue });
    }
    let orderOptions = [];
    if (sortedBy) {
        const sortedByArray = sortedBy
            .split(",")
            .map((so) => so.trim());
        orderOptions = sortedByArray
            .map((sortOption) => {
            switch (sortOption) {
                case "popularity":
                    return ["popularity_index", "DESC"];
                case "price":
                    return ["price", "ASC"];
                default:
                    return ["average_rating", "DESC"];
            }
        })
            .filter(Boolean);
    }
    const items = yield models_1.Item.findAll({
        where: whereCondition,
        order: orderOptions,
        include: [
            {
                model: models_1.Ingredient,
                as: "ingredients",
                required: false,
                attributes: ["id", "name"],
            },
            {
                model: models_1.Category,
                as: "categories",
                attributes: ["id", "name"],
                where: { name: { [sequelize_1.Op.ne]: "Extras" } },
                include: [
                    {
                        model: models_1.Menu,
                        as: "menu",
                        include: [
                            {
                                model: models_1.Restaurant,
                                as: "restaurant",
                                attributes: ["id", "name"],
                            },
                        ],
                    },
                ],
            },
            {
                model: models_1.ItemTag,
                as: "item_tags",
                attributes: ["id", "name"],
            },
        ],
    });
    // increment popularity index by 1
    items.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
        yield item.incrementPopularity();
    }));
    // pagination
    const totalItems = yield models_1.Item.count({ where: whereCondition });
    const pagination = {};
    if (endIndex < totalItems) {
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
    const totalPages = Math.ceil(totalItems / limitNeeded);
    const itemWithFavStatus = items.map((item) => {
        return Object.assign(Object.assign({}, item.toJSON()), { isFavorite: false });
    });
    // check the item whether it is in the user's favorites or not
    if (!userId) {
        return res.status(200).json({
            success: true,
            count: items.length,
            pagination,
            totalPages,
            data: itemWithFavStatus,
        });
    }
    const userFavorites = yield models_1.EatList.findAll({
        where: { user_id: userId },
        attributes: ["item_id"],
    });
    const itemIds = userFavorites.map((item) => item.get("item_id"));
    const itemsWithFavorites = items.map((item) => {
        if (itemIds.includes(item.id)) {
            return Object.assign(Object.assign({}, item.toJSON()), { isFavorite: true });
        }
        return Object.assign(Object.assign({}, item.toJSON()), { isFavorite: false });
    });
    return res.status(200).json({
        success: true,
        count: items.length,
        pagination,
        totalPages,
        data: itemsWithFavorites.slice(startIndex, endIndex),
    });
}));
exports.getItems = getItems;
// @desc Get all items for live search
// @route GET /items/all/search?searchTerm=searchTerm
const getAllItemsForLiveSearch = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.query;
    let whereCondition = {};
    if (searchTerm) {
        const searchWords = searchTerm.toLowerCase().split(" ");
        const regexSearch = searchWords.map((word) => `\\m${word}`).join("|");
        whereCondition = {
            [sequelize_1.Op.or]: [
                (0, sequelize_1.literal)(`LOWER("name") ~ '${regexSearch}'`),
                ...searchWords.map((word) => ({
                    name: { [sequelize_1.Op.iLike]: `%${word}%` },
                })),
            ],
        };
    }
    const result = yield models_1.Item.findAndCountAll({
        where: whereCondition,
        attributes: ["id", "name"],
    });
    res.status(200).json({
        success: true,
        count: result.count,
        data: result.rows,
    });
}));
exports.getAllItemsForLiveSearch = getAllItemsForLiveSearch;
// @desc    Get all items with search term
// @route   GET api/v1/items
// @route   GET /items/
const getItemsByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm, page } = req.query;
        const limit = 5;
        const offset = Number(page) * limit;
        let whereCondition = {};
        let items = [];
        if (searchTerm) {
            const searchTermLowerCase = searchTerm.toLowerCase();
            const searchWords = searchTermLowerCase.split(" ");
            whereCondition = Object.assign(Object.assign({}, whereCondition), { [sequelize_1.Op.or]: searchWords.map((word) => ({
                    name: {
                        [sequelize_1.Op.iLike]: `%${word}%`,
                    },
                })) });
        }
        const result = yield models_1.Item.findAndCountAll({
            where: whereCondition,
            order: [["average_rating", "DESC"]],
            include: [
                {
                    model: models_1.Ingredient,
                    as: "ingredients",
                    attributes: ["id", "name"],
                },
                {
                    model: models_1.Category,
                    as: "categories",
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: models_1.Menu,
                            as: "menu",
                            include: [
                                {
                                    model: models_1.Restaurant,
                                    as: "restaurant",
                                },
                            ],
                        },
                    ],
                },
            ],
            limit: limit,
            offset: offset,
        });
        items = result.rows;
        const totalItems = result.count;
        const totalPages = Math.ceil(totalItems / limit);
        return res.status(200).json({ items, currentPage: page, totalPages });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getItemsByName = getItemsByName;
// @desc    Get a specific item by id
// @route   GET /items
// @route   GET /items/:itemId
// @route   GET /restaurants/:restaurantId/items/:itemId
// @route   GET /restaurants/:restaurantId/menu/categories/:categoryId/items/:itemId
// @route   GET /categories/:categoryId/items/:itemId
const getItemById = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const userId = req.body.userId;
    const item = yield models_1.Item.findOne({
        where: { id: itemId },
        include: [
            {
                model: models_1.Ingredient,
                as: "ingredients",
                attributes: ["id", "name"],
            },
            {
                model: models_1.Category,
                as: "categories",
                attributes: ["id", "name"],
                include: [
                    {
                        model: models_1.Menu,
                        as: "menu",
                        attributes: ["id"],
                        include: [
                            {
                                model: models_1.Restaurant,
                                as: "restaurant",
                                attributes: ["id", "name"],
                            },
                        ],
                    },
                ],
            },
        ],
        order: [["average_rating", "DESC"]],
    });
    if (!item) {
        return next(new error_response_utils_1.default("Item not found", 404));
    }
    if (!userId) {
        return res.status(200).json(Object.assign(Object.assign({}, item.toJSON()), { isFavorite: false }));
    }
    const inFavorite = yield models_1.EatList.findOne({
        where: { user_id: userId, item_id: itemId },
    });
    if (inFavorite) {
        return res.status(200).json(Object.assign(Object.assign({}, item.toJSON()), { isFavorite: true }));
    }
}));
exports.getItemById = getItemById;
// @desc    create item for specific category
// @route   POST /restaurants/:restaurantId/menu/categories/:categoryId/items
// @route   POST /categories/:categoryId/items
// @route   POST /items
const createItem = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const { name, price } = req.body;
        const item = yield models_1.Item.create(Object.assign({ name,
            price, category_id: categoryId }, req.body));
        // obtain restaurant from item
        const category = yield models_1.Category.findOne({
            where: { id: categoryId },
            attributes: ["menu_id"],
        });
        const menu = yield models_1.Menu.findOne({
            where: { id: category.menu_id },
            attributes: ["restaurant_id"],
        });
        const restaurant = yield models_1.Restaurant.findOne({
            where: { id: menu.restaurant_id },
        });
        // find the total number of items in a restaurant
        const categories = yield models_1.Category.findAll({
            where: { menu_id: menu.id },
        });
        let totalItemsCount = 0;
        for (let index = 0; index < categories.length; index++) {
            const element = categories[index];
            const itemsCount = yield models_1.Item.count({ where: { category_id: element.id } });
            totalItemsCount += itemsCount;
        }
        // calculate new average price and save in database
        const prevAveragePrice = restaurant.average_price;
        const newPrice = ((prevAveragePrice * totalItemsCount) + parseFloat(price)) / (totalItemsCount + 1);
        restaurant.average_price = parseFloat(newPrice.toFixed(2));
        yield restaurant.save();
        return res.status(201).json({ item });
    }
    catch (error) {
        return next(error);
    }
}));
exports.createItem = createItem;
// @desc    Update item
// @route   PUT /items/:itemId
// @route   PUT /restaurants/:restaurantId/menu/categories/:categoryId/items/:itemId
// @route   PUT /categories/:categoryId/items/:itemId
const updateItem = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const { name, description, price } = req.body;
    const item = yield models_1.Item.findByPk(itemId);
    if (!item) {
        return next(new error_response_utils_1.default("Item not found", 404));
    }
    item.name = name;
    item.description = description;
    item.price = price;
    yield item.save();
    return res.status(200).json({ item });
}));
exports.updateItem = updateItem;
// @desc    Delete item
// @route   DELETE /items/:itemId
// @route   DELETE /restaurants/:restaurantId/menu/categories/:categoryId/items/:itemId
// @route   DELETE /categories/:categoryId/items/:itemId
const deleteItem = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const item = yield models_1.Item.findByPk(itemId);
    if (!item) {
        return next(new error_response_utils_1.default("Item not found", 404));
    }
    yield item.destroy();
    return res.status(200).json({ message: "Item deleted successfully" });
}));
exports.deleteItem = deleteItem;
// @desc    Get recommended items for a specific item
// @route   GET /items/:itemId/recommendations
const getItemRecommendations = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const { page = 1, limit = 4 } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const limitNeeded = parseInt(limit, 10) || 4;
    const offset = (currentPage - 1) * limitNeeded;
    const selectedItem = yield models_1.Item.findByPk(itemId, {
        include: [
            {
                model: models_1.Category,
                include: [
                    {
                        model: models_1.Menu,
                        include: [models_1.Restaurant],
                    },
                ],
            },
            {
                model: models_1.ItemTag,
                attributes: ["name"],
            },
        ],
    });
    if (!selectedItem) {
        return next(new error_response_utils_1.default("Item not found", 404));
    }
    const categoryId = selectedItem.category_id;
    const categoryRecommendations = yield models_1.Item.findAndCountAll({
        where: { category_id: categoryId },
        include: [
            {
                model: models_1.Ingredient,
                attributes: ["id", "name"],
            },
            {
                model: models_1.ItemTag,
                attributes: ["id", "name"],
            },
            {
                model: models_1.Category,
                attributes: ["id", "name"],
                include: [
                    {
                        model: models_1.Menu,
                        attributes: ["id"],
                        include: [
                            {
                                model: models_1.Restaurant,
                                attributes: ["id", "name"],
                            },
                        ],
                    },
                ],
            },
        ],
        order: [
            ["popularity_index", "DESC"],
            ["average_rating", "DESC"],
        ],
        limit: limitNeeded,
        offset,
    });
    const tagNames = selectedItem.item_tags.map((tag) => tag.name);
    const tagRecommendations = yield models_1.Item.findAndCountAll({
        where: {
            id: {
                [sequelize_1.Op.ne]: itemId,
            },
            [sequelize_1.Op.and]: (0, sequelize_1.literal)(`EXISTS (
          SELECT 1
          FROM "item_tags"
          WHERE "item_tags"."item_id" = "Item"."id"
          AND "item_tags"."name" IN (${tagNames
                .map((name) => `'${name}'`)
                .join(",")})
        )`),
        },
        include: [
            {
                model: models_1.Ingredient,
                attributes: ["id", "name"],
            },
            {
                model: models_1.ItemTag,
                attributes: ["id", "name"],
            },
            {
                model: models_1.ItemTag,
                attributes: ["name"],
            },
            {
                model: models_1.Category,
                attributes: ["id", "name"],
                include: [
                    {
                        model: models_1.Menu,
                        attributes: ["id"],
                        include: [
                            {
                                model: models_1.Restaurant,
                                attributes: ["id", "name"],
                            },
                        ],
                    },
                ],
            },
        ],
        order: [
            ["popularity_index", "DESC"],
            ["average_rating", "DESC"],
        ],
        limit: limitNeeded,
        offset,
    });
    const recommendations = [
        ...categoryRecommendations.rows,
        ...tagRecommendations.rows,
    ].filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
    res.status(200).json({
        success: true,
        totalItems: recommendations.length,
        recommendations: recommendations.slice(0, +limitNeeded),
    });
}));
exports.getItemRecommendations = getItemRecommendations;
