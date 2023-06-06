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
exports.getRestaurantReviewsByUser = exports.getItemReviewsByUser = exports.getAllReviewsByUser = exports.getUserByTelegramId = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.checkUserExists = exports.createUser = void 0;
const models_1 = require("../models");
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
const error_response_utils_1 = __importDefault(require("../utils/error-response.utils"));
const createUser = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { telegram_id, first_name, last_name, phone_number, role_name } = req.body;
    // Check if user already exists
    const existingUser = yield models_1.User.findOne({ where: { phone_number } });
    if (existingUser) {
        return next(new error_response_utils_1.default("User already exists", 400));
    }
    // Get role id from role name
    const role = yield models_1.Role.findOne({ where: { name: role_name } });
    if (!role) {
        return next(new error_response_utils_1.default("Role does not exist", 400));
    }
    // Create new user
    const newUser = yield models_1.User.create(Object.assign({ telegram_id,
        first_name,
        last_name,
        phone_number, role_id: role.id }, req.body));
    return res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
}));
exports.createUser = createUser;
// @desc    Check if user exists
// @route   POST /users/check
const checkUserExists = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone_number, telegram_id } = req.body;
    if (!phone_number && !telegram_id) {
        return next(new error_response_utils_1.default("Phone number or telegram id required", 400));
    }
    if (phone_number) {
        const existingUserWithPhone = yield models_1.User.findOne({
            where: { phone_number },
        });
        if (existingUserWithPhone) {
            return res
                .status(200)
                .json({ message: "User exists", existingUserWithPhone });
        }
    }
    if (telegram_id) {
        const existingUserWithTelegram = yield models_1.User.findOne({
            where: { telegram_id },
        });
        if (existingUserWithTelegram) {
            return res
                .status(200)
                .json({ message: "User exists", existingUserWithTelegram });
        }
    }
    return next(new error_response_utils_1.default("User does not exist", 400));
}));
exports.checkUserExists = checkUserExists;
// @desc    Get all users
// @route   GET /users
const getUsers = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield models_1.User.findAll();
    return res.status(200).json({ users });
}));
exports.getUsers = getUsers;
// @desc    Get user by id
// @route   GET /users/:id
const getUserById = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.User.findByPk(req.params.id);
    if (!user) {
        return next(new error_response_utils_1.default("User not found", 404));
    }
    return res.status(200).json({ user });
}));
exports.getUserById = getUserById;
// @desc    Get user by id
// @route   GET /users/telegram/:telegramId
const getUserByTelegramId = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { telegramId } = req.params;
    const user = yield models_1.User.findOne({
        where: {
            telegram_id: telegramId,
        },
    });
    if (!user) {
        return next(new error_response_utils_1.default("User not found", 404));
    }
    return res.status(200).json({ user });
}));
exports.getUserByTelegramId = getUserByTelegramId;
// @desc    Update user by id
// @route   PUT /users/:id
const updateUser = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.User.findByPk(req.params.id);
    if (!user) {
        return next(new error_response_utils_1.default("User not found", 404));
    }
    if (req.googleStoragePublicUrl) {
        req.body.image = req.googleStoragePublicUrl;
    }
    yield user.update(req.body);
    return res.status(200).json({ message: "User updated successfully" });
}));
exports.updateUser = updateUser;
// @desc    Delete user by id
// @route   DELETE /users/:id
const deleteUser = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.User.findByPk(req.params.id);
    if (!user) {
        return next(new error_response_utils_1.default("User not found", 404));
    }
    yield user.destroy();
    return res.status(200).json({ message: "User deleted successfully" });
}));
exports.deleteUser = deleteUser;
// @desc    find all reviews by a user
// @route   GET /users/:userId/reviews
const getAllReviewsByUser = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const perPage = parseInt(limit, 10);
    const currentPage = parseInt(page, 10);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = currentPage * perPage;
    if (!userId) {
        return res.status(400).json({ message: "User id required" });
    }
    const [restaurantReviewCountUser, itemReviewCountUser] = yield Promise.all([
        models_1.RestaurantReview.count({ where: { user_id: req.params.userId } }),
        models_1.ItemReview.count({ where: { user_id: req.params.userId } }),
    ]);
    const totalReviewCountUser = restaurantReviewCountUser + itemReviewCountUser;
    const totalPages = Math.ceil(totalReviewCountUser / perPage);
    const pagination = {};
    if (endIndex < totalReviewCountUser) {
        pagination.next = { page: currentPage + 1, limit: perPage };
    }
    if (startIndex > 0) {
        pagination.prev = { page: currentPage - 1, limit: perPage };
    }
    const [restaurantReviewsUser, itemReviewsUser] = yield Promise.all([
        models_1.RestaurantReview.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: models_1.Restaurant,
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: models_1.RestaurantImage,
                            attributes: ["id", "url"],
                        },
                        {
                            model: models_1.RestaurantVideo,
                            attributes: ["id", "url"],
                        },
                    ],
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
        }),
        models_1.ItemReview.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: models_1.Item,
                    attributes: ["id", "name"],
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
                {
                    model: models_1.ItemReviewImage,
                    attributes: ["id", "url"],
                },
                {
                    model: models_1.ItemReviewVideo,
                    attributes: ["id", "url"],
                },
            ],
        }),
    ]);
    const [itemVotes, restauarntVotes] = yield Promise.all([
        models_1.ItemVote.findAll({
            where: { voter_id: userId },
        }),
        models_1.RestaurantVote.findAll({
            where: { voter_id: userId },
        }),
    ]);
    const votedItemReviews = itemVotes.map((itemVote) => {
        return { item_review_id: itemVote.item_review_id, flag: itemVote.flag }; // flag: true = upvote, false = downvote
    });
    const votedRestaurantReviews = restauarntVotes.map((restaurantVote) => {
        return {
            restaurant_review_id: restaurantVote.restaurant_review_id,
            flag: restaurantVote.flag,
        };
    });
    const itemReviews = itemReviewsUser.map((itemReview) => {
        const itemReviewId = itemReview.id;
        const itemReviewVote = votedItemReviews.find((itemVote) => itemVote.item_review_id === itemReviewId);
        if (itemReviewVote) {
            return Object.assign(Object.assign({}, itemReview.dataValues), { voted: itemReviewVote.flag ? 1 : -1 });
        }
        else {
            return Object.assign(Object.assign({}, itemReview.dataValues), { voted: 0 });
        }
    });
    const restaurantReviews = restaurantReviewsUser.map((restaurantReview) => {
        const restaurantReviewId = restaurantReview.id;
        const restaurantReviewVote = votedRestaurantReviews.find((restaurantVote) => restaurantVote.restaurant_review_id === restaurantReviewId);
        if (restaurantReviewVote) {
            return Object.assign(Object.assign({}, restaurantReview.dataValues), { voted: restaurantReviewVote.flag ? 1 : -1 });
        }
        else {
            return Object.assign(Object.assign({}, restaurantReview.dataValues), { voted: 0 });
        }
    });
    return res.status(200).json({
        totalPages,
        pagination,
        data: {
            itemReviews: itemReviews,
            restaurantReviews: restaurantReviews,
        },
    });
}));
exports.getAllReviewsByUser = getAllReviewsByUser;
// @desc    find all restaurant reviews by a user
// @route   GET /users/:userId/restaurant_reviews
const getRestaurantReviewsByUser = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const { limit = 10, page = 1 } = req.query;
    const perPage = parseInt(limit, 10);
    const currentPage = parseInt(page, 10);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = currentPage * perPage;
    if (!userId) {
        return res.status(400).json({ message: "User id required" });
    }
    const restaurantReviewCountUser = yield models_1.RestaurantReview.count({
        where: { user_id: req.params.userId },
    });
    const totalReviewCountUser = restaurantReviewCountUser;
    const totalPages = Math.ceil(totalReviewCountUser / perPage);
    const pagination = {};
    if (endIndex < totalReviewCountUser) {
        pagination.next = { page: currentPage + 1, limit: perPage };
    }
    if (startIndex > 0) {
        pagination.prev = { page: currentPage - 1, limit: perPage };
    }
    const restaurantReviewsUser = yield models_1.RestaurantReview.findAll({
        where: { user_id: userId },
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
    const restaurantVotes = yield models_1.RestaurantVote.findAll({
        where: { voter_id: userId },
    });
    const votedRestaurantReviews = restaurantVotes.map((restaurantVote) => {
        return {
            restaurant_review_id: restaurantVote.restaurant_review_id,
            flag: restaurantVote.flag,
        };
    });
    const restaurantReviews = restaurantReviewsUser.map((restaurantReview) => {
        const restaurantReviewId = restaurantReview.id;
        const restaurantReviewVote = votedRestaurantReviews.find((restaurantVote) => restaurantVote.restaurant_review_id === restaurantReviewId);
        if (restaurantReviewVote) {
            return Object.assign(Object.assign({}, restaurantReview.dataValues), { voted: restaurantReviewVote.flag ? 1 : -1 });
        }
        else {
            return Object.assign(Object.assign({}, restaurantReview.dataValues), { voted: 0 });
        }
    });
    return res
        .status(200)
        .json({ totalPages, pagination, data: { restaurantReviews } });
}));
exports.getRestaurantReviewsByUser = getRestaurantReviewsByUser;
// @desc    find all item reviews by a user
// @route   GET /users/:userId/item_reviews
const getItemReviewsByUser = (0, async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const { limit = 10, page = 1 } = req.query;
    const perPage = parseInt(limit, 10);
    const currentPage = parseInt(page, 10);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = currentPage * perPage;
    if (!userId) {
        return res.status(400).json({ message: "User id required" });
    }
    const itemReviewCountUser = yield models_1.ItemReview.count({
        where: { user_id: req.params.userId },
    });
    const totalReviewCountUser = itemReviewCountUser;
    const totalPages = Math.ceil(totalReviewCountUser / perPage);
    const pagination = {};
    if (endIndex < totalReviewCountUser) {
        pagination.next = { page: currentPage + 1, limit: perPage };
    }
    if (startIndex > 0) {
        pagination.prev = { page: currentPage - 1, limit: perPage };
    }
    const itemReviewsUser = yield models_1.ItemReview.findAll({
        where: { user_id: userId },
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
    const itemVotes = yield models_1.ItemVote.findAll({
        where: { voter_id: userId },
    });
    const votedItemReviews = itemVotes.map((itemVote) => {
        return { item_review_id: itemVote.item_review_id, flag: itemVote.flag }; // flag: true = upvote, false = downvote
    });
    const itemReviews = itemReviewsUser.map((itemReview) => {
        const itemReviewId = itemReview.id;
        const itemReviewVote = votedItemReviews.find((itemVote) => itemVote.item_review_id === itemReviewId);
        if (itemReviewVote) {
            return Object.assign(Object.assign({}, itemReview.dataValues), { voted: itemReviewVote.flag ? 1 : -1 });
        }
        else {
            return Object.assign(Object.assign({}, itemReview.dataValues), { voted: 0 });
        }
    });
    return res
        .status(200)
        .json({ totalPages, pagination, data: { itemReviews } });
}));
exports.getItemReviewsByUser = getItemReviewsByUser;
