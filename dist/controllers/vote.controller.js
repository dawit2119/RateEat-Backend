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
exports.downVoteRestaurantReview = exports.upvoteRestaurantReview = exports.downvoteItemReview = exports.upvoteItemReview = void 0;
const models_1 = require("../models");
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
const error_response_utils_1 = __importDefault(require("../utils/error-response.utils"));
const sequelize_1 = require("sequelize");
// @desc    upvote a item review
// @route   POST votes/upvote-item-review
const upvoteItemReview = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, reviewId } = req.body;
    const review = yield models_1.ItemReview.findByPk(reviewId);
    if (!review) {
        return next(new error_response_utils_1.default("Review Not Found", 400));
    }
    const voter = yield models_1.User.findByPk(userId);
    if (!voter) {
        return next(new error_response_utils_1.default("User Not Found", 400));
    }
    const vote = yield models_1.ItemVote.findOne({
        where: {
            item_review_id: reviewId,
            voter_id: userId,
        },
    });
    if (vote) {
        if (vote.flag) {
            yield models_1.ItemReview.update({ up_vote: (0, sequelize_1.literal)("up_vote - 1") }, { where: { id: reviewId } });
            yield models_1.ItemVote.destroy({
                where: {
                    item_review_id: reviewId,
                    voter_id: userId,
                },
            });
            const newReview = yield models_1.ItemReview.findOne({
                where: { id: reviewId },
            });
            return res.status(201).json({
                message: "Vote deleted",
                review: Object.assign(Object.assign({}, newReview.dataValues), { voted: 0 }), // voted: 0 = not voted, 1 = upvoted, -1 = downvoted
            });
        }
        else {
            yield models_1.ItemReview.update({
                up_vote: (0, sequelize_1.literal)("UP_vote + 1"),
                down_vote: (0, sequelize_1.literal)("down_vote - 1"),
            }, { where: { id: reviewId } });
            yield models_1.ItemVote.update({ flag: true }, { where: { item_review_id: reviewId, voter_id: userId } });
            const newReview = yield models_1.ItemReview.findOne({
                where: { id: reviewId },
            });
            return res.status(201).json({
                message: "Vote updated",
                review: Object.assign(Object.assign({}, newReview.dataValues), { voted: 1 }),
            });
        }
    }
    else {
        yield models_1.ItemReview.update({ up_vote: (0, sequelize_1.literal)("up_vote + 1") }, { where: { id: reviewId } });
        const newVote = yield models_1.ItemVote.create({
            item_review_id: reviewId,
            voter_id: userId,
            flag: true,
            value: 1,
        });
        const newReview = yield models_1.ItemReview.findOne({
            where: { id: reviewId },
        });
        return res.status(201).json({
            message: "Vote created",
            review: Object.assign(Object.assign({}, newReview.dataValues), { voted: 1 }),
        });
    }
}));
exports.upvoteItemReview = upvoteItemReview;
// @desc    downvote a item review
// @route   POST votes/downvote-item-review
const downvoteItemReview = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, reviewId } = req.body;
    const review = yield models_1.ItemReview.findByPk(reviewId);
    if (!review) {
        return next(new error_response_utils_1.default("Review Not Found", 400));
    }
    const voter = yield models_1.User.findByPk(userId);
    if (!voter) {
        return next(new error_response_utils_1.default("User Not Found", 400));
    }
    const vote = yield models_1.ItemVote.findOne({
        where: {
            item_review_id: reviewId,
            voter_id: userId,
        },
    });
    if (vote) {
        if (!vote.flag) {
            yield models_1.ItemReview.update({ down_vote: (0, sequelize_1.literal)("down_vote - 1") }, { where: { id: reviewId } });
            yield models_1.ItemVote.destroy({
                where: {
                    item_review_id: reviewId,
                    voter_id: userId,
                },
            });
            const newReview = yield models_1.ItemReview.findByPk(reviewId);
            return res.status(201).json({
                message: "Vote deleted",
                review: Object.assign(Object.assign({}, newReview.dataValues), { voted: -1 }),
            });
        }
        else {
            yield models_1.ItemReview.update({
                down_vote: (0, sequelize_1.literal)("down_vote + 1"),
                up_vote: (0, sequelize_1.literal)("up_vote - 1"),
            }, { where: { id: reviewId } });
            yield models_1.ItemVote.update({ flag: false }, { where: { item_review_id: reviewId, voter_id: userId } });
            const newReview = yield models_1.ItemReview.findByPk(reviewId);
            return res.status(201).json({
                message: "Vote updated",
                review: Object.assign(Object.assign({}, newReview.dataValues), { voted: -1 }),
            });
        }
    }
    else {
        yield models_1.ItemReview.update({ down_vote: (0, sequelize_1.literal)("down_vote + 1") }, { where: { id: reviewId } });
        const newVote = yield models_1.ItemVote.create({
            item_review_id: reviewId,
            voter_id: userId,
            flag: false,
            value: -1,
        });
        const newReview = yield models_1.ItemReview.findByPk(reviewId);
        return res.status(201).json({
            message: "Vote created",
            review: Object.assign(Object.assign({}, newReview.dataValues), { voted: -1 }),
        });
    }
}));
exports.downvoteItemReview = downvoteItemReview;
// @desc    upvote-restaurant-review
// @route   POST votes/upvote-restaurant-review
const upvoteRestaurantReview = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, reviewId } = req.body;
    const review = yield models_1.RestaurantReview.findByPk(reviewId);
    if (!review) {
        return next(new error_response_utils_1.default("Review Not Found", 400));
    }
    const voter = yield models_1.User.findByPk(userId);
    if (!voter) {
        return next(new error_response_utils_1.default("User Not Found", 400));
    }
    const vote = yield models_1.RestaurantVote.findOne({
        where: {
            restaurant_review_id: reviewId,
            voter_id: userId,
        },
    });
    if (vote) {
        if (vote.flag) {
            yield models_1.RestaurantReview.update({ up_vote: (0, sequelize_1.literal)("up_vote - 1") }, { where: { id: reviewId } });
            yield models_1.RestaurantVote.destroy({
                where: {
                    restaurant_review_id: reviewId,
                    voter_id: userId,
                },
            });
            const newReview = yield models_1.RestaurantReview.findOne({
                where: { id: reviewId },
            });
            return res.status(201).json({
                message: "Vote deleted",
                review: Object.assign(Object.assign({}, newReview.dataValues), { voted: 0 }), // voted: 0 = not voted, 1 = upvoted, -1 = downvoted
            });
        }
        else {
            yield models_1.RestaurantReview.update({
                up_vote: (0, sequelize_1.literal)("UP_vote + 1"),
                down_vote: (0, sequelize_1.literal)("down_vote - 1"),
            }, { where: { id: reviewId } });
            yield models_1.RestaurantVote.update({ flag: true }, { where: { restaurant_review_id: reviewId, voter_id: userId } });
            const newReview = yield models_1.RestaurantReview.findOne({
                where: { id: reviewId },
            });
            return res.status(201).json({
                message: "Vote updated",
                review: Object.assign(Object.assign({}, newReview.dataValues), { voted: 1 }),
            });
        }
    }
    else {
        yield models_1.RestaurantReview.update({ up_vote: (0, sequelize_1.literal)("up_vote + 1") }, { where: { id: reviewId } });
        const newVote = yield models_1.RestaurantVote.create({
            restaurant_review_id: reviewId,
            voter_id: userId,
            flag: true,
            value: 1,
        });
        const newReview = yield models_1.RestaurantReview.findOne({
            where: { id: reviewId },
        });
        return res.status(201).json({
            message: "Vote created",
            review: Object.assign(Object.assign({}, newReview.dataValues), { voted: 1 }),
        });
    }
}));
exports.upvoteRestaurantReview = upvoteRestaurantReview;
// @desc    downvote a restaurant review
// @route   POST votes/downvote-restaurant-review
const downVoteRestaurantReview = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, reviewId } = req.body;
    const review = yield models_1.RestaurantReview.findByPk(reviewId);
    if (!review) {
        return next(new error_response_utils_1.default("Review Not Found", 400));
    }
    const voter = yield models_1.User.findByPk(userId);
    if (!voter) {
        return next(new error_response_utils_1.default("User Not Found", 400));
    }
    const vote = yield models_1.RestaurantVote.findOne({
        where: {
            restaurant_review_id: reviewId,
            voter_id: userId,
        },
    });
    if (vote) {
        if (!vote.flag) {
            yield models_1.RestaurantReview.update({ down_vote: (0, sequelize_1.literal)("down_vote - 1") }, { where: { id: reviewId } });
            yield models_1.RestaurantVote.destroy({
                where: {
                    restaurant_review_id: reviewId,
                    voter_id: userId,
                },
            });
            const newReview = yield models_1.RestaurantReview.findByPk(reviewId);
            return res.status(201).json({
                message: "Vote deleted",
                review: Object.assign(Object.assign({}, newReview.dataValues), { voted: -1 }),
            });
        }
        else {
            yield models_1.RestaurantReview.update({
                down_vote: (0, sequelize_1.literal)("down_vote + 1"),
                up_vote: (0, sequelize_1.literal)("up_vote - 1"),
            }, { where: { id: reviewId } });
            yield models_1.RestaurantVote.update({ flag: false }, { where: { restaurant_review_id: reviewId, voter_id: userId } });
            const newReview = yield models_1.RestaurantReview.findByPk(reviewId);
            return res.status(201).json({
                message: "Vote updated",
                review: Object.assign(Object.assign({}, newReview.dataValues), { voted: -1 }),
            });
        }
    }
    else {
        yield models_1.RestaurantReview.update({ down_vote: (0, sequelize_1.literal)("down_vote + 1") }, { where: { id: reviewId } });
        const newVote = yield models_1.RestaurantVote.create({
            restaurant_review_id: reviewId,
            voter_id: userId,
            flag: false,
            value: -1,
        });
        const newReview = yield models_1.RestaurantReview.findByPk(reviewId);
        return res.status(201).json({
            message: "Vote created",
            review: Object.assign(Object.assign({}, newReview.dataValues), { voted: -1 }),
        });
    }
}));
exports.downVoteRestaurantReview = downVoteRestaurantReview;
