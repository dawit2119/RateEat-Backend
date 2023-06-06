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
exports.deleteItemReview = exports.updateItemReview = exports.createItemReview = exports.getItemReviews = void 0;
const models_1 = require("../models");
// @desc    GET all reviews of a specific item
// @route   GET items/:itemId/reviews
const getItemReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId;
        const { page, limit } = req.query;
        const currPage = parseInt(page, 10) || 1;
        const limitNeeded = parseInt(limit, 10) || 5;
        const startIndex = (currPage - 1) * limitNeeded;
        const endIndex = currPage * limitNeeded;
        // Find item reviews for the specified itemId
        const reviews = yield models_1.ItemReview.findAndCountAll({
            where: { item_id: itemId },
            include: [
                {
                    model: models_1.User,
                    attributes: ['id', 'first_name', 'last_name'],
                },
                {
                    model: models_1.ItemReviewImage,
                    attributes: ['url'],
                },
                {
                    model: models_1.ItemReviewVideo,
                    attributes: ['url'],
                },
            ],
        });
        const totalReviews = reviews.count;
        // Map the reviews to include user information, images, and videos
        const itemReviews = yield Promise.all(reviews.rows.map((review) => __awaiter(void 0, void 0, void 0, function* () {
            const images = yield models_1.ItemReviewImage.findAll({
                where: { item_review_id: review.id },
                attributes: ['url'],
            });
            const videos = yield models_1.ItemReviewVideo.findAll({
                where: { item_review_id: review.id },
                attributes: ['url'],
            });
            return {
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                upVote: review.up_vote,
                downVote: review.down_vote,
                visibility: review.visibility,
                user: {
                    id: review.user.id,
                    firstName: review.user.first_name,
                    lastName: review.user.last_name,
                },
                images: images.map((image) => ({
                    url: image.url,
                })),
                videos: videos.map((video) => ({
                    url: video.url,
                })),
            };
        })));
        // pagination
        const pagination = {};
        if (endIndex < totalReviews) {
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
        const totalPages = Math.ceil(totalReviews / limitNeeded);
        res.status(200).json({
            success: true,
            count: itemReviews.length,
            pagination,
            totalPages,
            data: itemReviews.slice(startIndex, endIndex),
        });
    }
    catch (error) {
        console.error('Error fetching item reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getItemReviews = getItemReviews;
// @desc    Create a new review
// @route   POST items/:itemId/reviews
const createItemReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const { rating, comment, user_id } = req.body;
        const newReview = yield models_1.ItemReview.create({
            rating,
            comment,
            item_id: itemId,
            user_id,
        });
        // update item rating
        const item = yield models_1.Item.findOne({
            where: { id: itemId }
        });
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        let prev_rating = item.average_rating;
        let result = ((prev_rating * item.number_of_reviews) + parseFloat(rating)) / (item.number_of_reviews + 1);
        item.average_rating = parseFloat(result.toFixed(2));
        item.number_of_reviews += 1;
        yield item.save();
        let money_earned = 0;
        let prevRatingCount = 0;
        const itemReviews = yield models_1.ItemReview.findAll({
            where: { item_id: itemId }
        });
        for (let index = 0; index < itemReviews.length; index++) {
            const element = itemReviews[index];
            const imageCount = yield models_1.ItemReviewImage.count({
                where: { item_review_id: element.id }
            });
            const videoCount = yield models_1.ItemReviewVideo.count({
                where: { item_review_id: element.id }
            });
            prevRatingCount += (imageCount + videoCount);
            if (prevRatingCount > 0) {
                break;
            }
        }
        if (req.reviewImages) {
            const reviewImages = req.reviewImages;
            for (let i = 0; i < reviewImages.length; i++) {
                yield models_1.ItemReviewImage.create({
                    url: reviewImages[i],
                    item_review_id: newReview.id
                });
                if (prevRatingCount == 0) {
                    money_earned = 15;
                }
            }
        }
        if (req.reviewVideos) {
            const reviewVideos = req.reviewVideos;
            for (let i = 0; i < reviewVideos.length; i++) {
                yield models_1.ItemReviewVideo.create({
                    url: reviewVideos[i],
                    item_review_id: newReview.id
                });
            }
        }
        //give incentive if media added
        if (money_earned) {
            let incentive = yield models_1.Incentive.findOne({
                where: { user_id: user_id },
            });
            if (!incentive) {
                incentive = new models_1.Incentive({
                    user_id: user_id
                });
            }
            // Update the current total and all time total by adding the money earned
            incentive.current_total += money_earned;
            incentive.all_time_total += money_earned;
            // Save the updated incentive
            yield incentive.save();
        }
        return res
            .status(201)
            .json({ message: "Review created successfully", review: newReview });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: `Failed to create review: ${error.message}` });
    }
});
exports.createItemReview = createItemReview;
// @desk    Update a review - user can update a review in 1 hour after creating it only
// @route   PUT items/:itemId/reviews/:reviewId
const updateItemReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId, reviewId } = req.params;
        const { rating, comment } = req.body;
        const review = yield models_1.ItemReview.findOne({
            where: {
                id: reviewId,
                item_id: itemId,
            },
        });
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
        if (review.createdAt < oneHourAgo) {
            return res
                .status(400)
                .json({ message: "Review update time has expired" });
        }
        yield review.update({
            rating,
            comment,
        });
        return res.json({ message: "Review updated successfully", review });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: `Failed to update review: ${error.message}` });
    }
});
exports.updateItemReview = updateItemReview;
// @desk    Delete a review - user can delete a review in 1 hour after creating it only
// @route   DELETE items/:itemId/reviews/:reviewId
const deleteItemReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId, reviewId } = req.params;
        const review = yield models_1.ItemReview.findOne({
            where: {
                id: reviewId,
                item_id: itemId,
            },
        });
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
        if (review.createdAt < oneHourAgo) {
            return res
                .status(400)
                .json({ message: "Review delete time has expired" });
        }
        yield review.destroy();
        return res.json({ message: "Review deleted successfully" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: `Failed to delete review: ${error.message}` });
    }
});
exports.deleteItemReview = deleteItemReview;
