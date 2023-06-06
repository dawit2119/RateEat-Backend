import { Request, Response } from "express";
import { Incentive, Item, ItemReview, ItemReviewImage, ItemReviewVideo, RestaurantReviewImage, User } from "../models";
import { FileRequest } from "../middlewares/upload-image";

// @desc    GET all reviews of a specific item
// @route   GET items/:itemId/reviews
const getItemReviews = async (req: Request, res: Response) => {
try {
    const itemId = req.params.itemId; 

    const { page, limit} = req.query;
    const currPage = parseInt(page as string, 10) || 1;
    const limitNeeded = parseInt(limit as string, 10) || 5;
    const startIndex = (currPage - 1) * limitNeeded;
    const endIndex = currPage * limitNeeded;

    // Find item reviews for the specified itemId
    const reviews = await ItemReview.findAndCountAll({
      where: { item_id: itemId },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name'],
        },
        {
          model: ItemReviewImage,
          attributes: ['url'],
        },
        {
          model: ItemReviewVideo,
          attributes: ['url'],
        },
      ],
    });
    const totalReviews = reviews.count

    // Map the reviews to include user information, images, and videos
    const itemReviews = await Promise.all(
      reviews.rows.map(async (review) => {
        const images = await ItemReviewImage.findAll({
          where: { item_review_id: review.id },
          attributes: ['url'],
        });
        const videos = await ItemReviewVideo.findAll({
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
      count: itemReviews.length,
      pagination,
      totalPages,
      data: itemReviews.slice(startIndex, endIndex),
    });
  } catch (error) {
    console.error('Error fetching item reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Create a new review
// @route   POST items/:itemId/reviews
const createItemReview = async (req: FileRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    const { rating, comment, user_id} = req.body;

    const newReview = await ItemReview.create({
      rating,
      comment,
      item_id: itemId,
      user_id,
    });

    // update item rating
    const item = await Item.findOne({
      where: {id: itemId}
    })
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    let prev_rating = item.average_rating
    let result = ((prev_rating * item.number_of_reviews) + parseFloat(rating)) / (item.number_of_reviews + 1)
    item.average_rating = parseFloat(result.toFixed(2));
    item.number_of_reviews += 1

    await item.save()

    let money_earned = 0
    let prevRatingCount = 0
    const itemReviews = await ItemReview.findAll({
      where: {item_id: itemId}
    })
    for (let index = 0; index < itemReviews.length; index++) {
      const element = itemReviews[index];
      const imageCount = await ItemReviewImage.count({
        where: {item_review_id: element.id}
      })
      const videoCount = await ItemReviewVideo.count({
        where: {item_review_id: element.id}
      })
      prevRatingCount += (imageCount + videoCount)
      if (prevRatingCount > 0){
        break
      }
    }




    
    if (req.reviewImages) {
      const reviewImages = req.reviewImages
      for (let i = 0; i < reviewImages.length; i++) {
      await ItemReviewImage.create({
        url: reviewImages[i],
        item_review_id: newReview.id
      })
      if (prevRatingCount == 0){
      money_earned = 15
      }
    }
    }
    if (req.reviewVideos) {
      const reviewVideos = req.reviewVideos
      for (let i = 0; i < reviewVideos.length; i++) {
      await ItemReviewVideo.create({
        url: reviewVideos[i],
        item_review_id: newReview.id
      })
      
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
      .json({ error: `Failed to create review: ${error.message}` });
  }
};
// @desk    Update a review - user can update a review in 1 hour after creating it only
// @route   PUT items/:itemId/reviews/:reviewId
const updateItemReview = async (req: Request, res: Response) => {
  try {
    const { itemId, reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await ItemReview.findOne({
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
// @route   DELETE items/:itemId/reviews/:reviewId
const deleteItemReview = async (req: Request, res: Response) => {
  try {
    const { itemId, reviewId } = req.params;

    const review = await ItemReview.findOne({
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

    await review.destroy();

    return res.json({ message: "Review deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Failed to delete review: ${error.message}` });
  }
};

export { getItemReviews, createItemReview, updateItemReview, deleteItemReview };
