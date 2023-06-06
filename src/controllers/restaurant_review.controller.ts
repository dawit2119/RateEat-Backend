import { Request, Response } from "express";
import { Incentive, Restaurant, RestaurantReview, RestaurantReviewImage, RestaurantReviewVideo, User } from "../models";
import { FileRequest } from "../middlewares/upload-image";

// @desc    GET all reviews of a specific restaurant
// @route   GET restaurants/:restaurantId/reviews
const getRestaurantReviews = async (req: Request, res: Response) => {
try {
    const restaurantId = req.params.restaurantId; 

    const { page, limit} = req.query;
    const currPage = parseInt(page as string, 10) || 1;
    const limitNeeded = parseInt(limit as string, 10) || 10;
    const startIndex = (currPage - 1) * limitNeeded;
    const endIndex = currPage * limitNeeded;

    // Find restaurant reviews for the specified restaurantId
    const reviews = await RestaurantReview.findAndCountAll({
      where: { restaurant_id: restaurantId },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: RestaurantReviewImage,
          attributes: ['url'],
        },
        {
          model: RestaurantReviewVideo,
          attributes: ['url'],
        },
      ],
    });
    const totalReviews = reviews.count

    // Map the reviews to include user information, images, and videos
    const restaurantReviews = await Promise.all(
      reviews.rows.map(async (review) => {
        const images = await RestaurantReviewImage.findAll({
          where: { restaurant_review_id: review.id },
          attributes: ['url'],
        });
        const videos = await RestaurantReviewVideo.findAll({
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
      })
    );
    // pagination
    const pagination: any = {};
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
  } catch (error) {
    console.error('Error fetching restaurant reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Create a new review
// @route   POST restaurants/:restaurantId/reviews
const createRestaurantReview = async (req: FileRequest, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { rating, comment, user_id } = req.body;
    
    const newReview = await RestaurantReview.create({
      rating,
      comment,
      restaurant_id: restaurantId,
      user_id,
    });

    //update restaurant rating
    const restaurant = await Restaurant.findOne({
      where: {id: restaurantId}
    })
    if (!restaurant) {
      return res.status(404).json({ message: "Restauarant not found" });
    }
    const result = ((restaurant.average_rating * restaurant.number_of_reviews) + parseFloat(rating)) / (restaurant.number_of_reviews + 1)
    restaurant.average_rating = parseFloat(result.toFixed(2));
    restaurant.number_of_reviews += 1
    await restaurant.save()

    let money_earned = 0
    let prevRatingCount = 0
    const restaurantReviews = await RestaurantReview.findAll({
      where: {restaurant_id: restaurantId}
    })
    for (let index = 0; index < restaurantReviews.length; index++) {
      const element = restaurantReviews[index];
      const imageCount = await RestaurantReviewImage.count({
        where: {restaurant_review_id: element.id}
      })
      const videoCount = await RestaurantReviewVideo.count({
        where: {restaurant_review_id: element.id}
      })
      prevRatingCount += (imageCount + videoCount)
      if (prevRatingCount > 0){
        break
      }
    }

    
    if (req.reviewImages) {
      const reviewImages = req.reviewImages
      for (let i = 0; i < reviewImages.length; i++) {
      await RestaurantReviewImage.create({
        url: reviewImages[i],
        restaurant_review_id: newReview.id
      })
      if (prevRatingCount == 0){
      money_earned = 15
      }
    }
    }
    if (req.reviewVideos) {
      const reviewVideos = req.reviewVideos
      for (let i = 0; i < reviewVideos.length; i++) {
      await RestaurantReviewVideo.create({
        url: reviewVideos[i],
        restaurant_review_id: newReview.id
      })
      if (prevRatingCount == 0){
      money_earned = 30
      }
    }
    }

    //give incentive if media added
    if (money_earned){
      let incentive = await Incentive.findOne({
      where: { user_id: user_id },
    });
    if (!incentive) {
      incentive = new Incentive({
        user_id: user_id
      })
    }

    // Update the current total and all time total by adding the money earned
    incentive.current_total += money_earned;
    incentive.all_time_total += money_earned;

    // Save the updated incentive
    await incentive.save();
    }

    return res
      .status(201)
      .json({ message: "Review created successfully", review: newReview });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Failed to create item review: ${error.message}` });
  }
};

// @desk    Update a review - user can update a review in 1 hour after creating it only
// @route   PUT restaurants/:restaurantId/reviews/:reviewId
const updateRestaurantReview = async (req: Request, res: Response) => {
  try {
    const { restaurantId, reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await RestaurantReview.findOne({
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

    await review.update({
      rating,
      comment,
    });

    return res.json({ message: "Review updated successfully", review });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Failed to update review: ${error.message}` });
  }
};

// @desk    Delete a review - user can delete a review in 1 hour after creating it only
// @route   DELETE restaurants/:restaurantId/reviews/:reviewId
const deleteRestaurantReview = async (req: Request, res: Response) => {
  try {
    const { restaurantId, reviewId } = req.params;

    const review = await RestaurantReview.findOne({
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

    await review.destroy();

    return res.json({ message: "Review deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Failed to delete review: ${error.message}` });
  }
};

export { getRestaurantReviews, createRestaurantReview, updateRestaurantReview, deleteRestaurantReview };
