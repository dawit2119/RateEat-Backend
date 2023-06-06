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
exports.deleteRestaurantReview = exports.updateRestaurantReview = exports.createRestaurantReview = exports.getRestaurantReviews = void 0;
const models_1 = require("../models");
// @desc    GET all reviews of a specific restaurant
// @route   GET restaurants/:restaurantId/reviews
const getRestaurantReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurantId = req.params.restaurantId;
        const { page, limit } = req.query;
        const currPage = parseInt(page, 10) || 1;
        const limitNeeded = parseInt(limit, 10) || 10;
        const startIndex = (currPage - 1) * limitNeeded;
        const endIndex = currPage * limitNeeded;
        // Find restaurant reviews for the specified restaurantId
        const reviews = yield models_1.RestaurantReview.findAndCountAll({
            where: { restaurant_id: restaurantId },
            include: [
                {
                    model: models_1.User,
                    attributes: ['id', 'first_name', 'last_name'],
                },
                {
                    model: models_1.RestaurantReviewImage,
                    attributes: ['url'],
                },
                {
                    model: models_1.RestaurantReviewVideo,
                    attributes: ['url'],
                },
            ],
        });
        const totalReviews = reviews.count;
        // Map the reviews to include user information, images, and videos
        const restaurantReviews = yield Promise.all(reviews.rows.map((review) => __awaiter(void 0, void 0, void 0, function* () {
            const images = yield models_1.RestaurantReviewImage.findAll({
                where: { restaurant_review_id: review.id },
                attributes: ['url'],
            });
            const videos = yield models_1.RestaurantReviewVideo.findAll({
                where: { restaurant_review_id: review.id },
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
            count: restaurantReviews.length,
            pagination,
            totalPages,
            data: restaurantReviews.slice(startIndex, endIndex),
        });
    }
    catch (error) {
        console.error('Error fetching restaurant reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getRestaurantReviews = getRestaurantReviews;
// @desc    Create a new review
// @route   POST restaurants/:restaurantId/reviews
const createRestaurantReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        const { rating, comment, user_id } = req.body;
        const newReview = yield models_1.RestaurantReview.create({
            rating,
            comment,
            restaurant_id: restaurantId,
            user_id,
        });
        //update restaurant rating
        const restaurant = yield models_1.Restaurant.findOne({
            where: { id: restaurantId }
        });
        if (!restaurant) {
            return res.status(404).json({ message: "Restauarant not found" });
        }
        const result = ((restaurant.average_rating * restaurant.number_of_reviews) + parseFloat(rating)) / (restaurant.number_of_reviews + 1);
        restaurant.average_rating = parseFloat(result.toFixed(2));
        restaurant.number_of_reviews += 1;
        yield restaurant.save();
        let money_earned = 0;
        let prevRatingCount = 0;
        const restaurantReviews = yield models_1.RestaurantReview.findAll({
            where: { restaurant_id: restaurantId }
        });
        for (let index = 0; index < restaurantReviews.length; index++) {
            const element = restaurantReviews[index];
            const imageCount = yield models_1.RestaurantReviewImage.count({
                where: { restaurant_review_id: element.id }
            });
            const videoCount = yield models_1.RestaurantReviewVideo.count({
                where: { restaurant_review_id: element.id }
            });
            prevRatingCount += (imageCount + videoCount);
            if (prevRatingCount > 0) {
                break;
            }
        }
        if (req.reviewImages) {
            const reviewImages = req.reviewImages;
            for (let i = 0; i < reviewImages.length; i++) {
                yield models_1.RestaurantReviewImage.create({
                    url: reviewImages[i],
                    restaurant_review_id: newReview.id
                });
                if (prevRatingCount == 0) {
                    money_earned = 15;
                }
            }
        }
        if (req.reviewVideos) {
            const reviewVideos = req.reviewVideos;
            for (let i = 0; i < reviewVideos.length; i++) {
                yield models_1.RestaurantReviewVideo.create({
                    url: reviewVideos[i],
                    restaurant_review_id: newReview.id
                });
                if (prevRatingCount == 0) {
                    money_earned = 30;
                }
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
            .json({ error: `Failed to create item review: ${error.message}` });
    }
});
exports.createRestaurantReview = createRestaurantReview;
// @desk    Update a review - user can update a review in 1 hour after creating it only
// @route   PUT restaurants/:restaurantId/reviews/:reviewId
const updateRestaurantReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId, reviewId } = req.params;
        const { rating, comment } = req.body;
        const review = yield models_1.RestaurantReview.findOne({
            where: {
                id: reviewId,
                restaurant_id: restaurantId,
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
exports.updateRestaurantReview = updateRestaurantReview;
// @desk    Delete a review - user can delete a review in 1 hour after creating it only
// @route   DELETE restaurants/:restaurantId/reviews/:reviewId
const deleteRestaurantReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId, reviewId } = req.params;
        const review = yield models_1.RestaurantReview.findOne({
            where: {
                id: reviewId,
                restaurant_id: restaurantId,
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
exports.deleteRestaurantReview = deleteRestaurantReview;
