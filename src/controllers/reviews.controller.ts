import { Request, Response, NextFunction } from "express";
import asyncAwaitHandler from "../middlewares/async-handler";
import {
  Item,
  ItemReview,
  ItemReviewImage,
  ItemReviewVideo,
  Restaurant,
  RestaurantReview,
  RestaurantReviewImage,
  RestaurantReviewVideo,
} from "../models";

// @desc    find all total item reviews
// @route   GET /reviews/item_reviews
const getAllItemReviews = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 10, page = 1 } = req.query;
    const perPage = parseInt(limit as string, 10);
    const currentPage = parseInt(page as string, 10);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = currentPage * perPage;

    const itemReviewCount = await ItemReview.count();

    const totalReviewCount = itemReviewCount;
    const totalPages = Math.ceil(totalReviewCount / perPage);

    const pagination: any = {};
    if (endIndex < totalReviewCount) {
      pagination.next = { page: currentPage + 1, limit: perPage };
    }

    if (startIndex > 0) {
      pagination.prev = { page: currentPage - 1, limit: perPage };
    }

    const itemReviews = await ItemReview.findAll({
      include: [
        {
          model: Item,
          attributes: ["id", "name"],
        },
        {
          model: ItemReviewImage,
          attributes: ["id", "url"],
        },
        {
          model: ItemReviewVideo,
          attributes: ["id", "url"],
        },
      ],
    });

    return res
      .status(200)
      .json({ totalPages, pagination, data: { itemReviews } });
  }
);

// @desc    find all total restaurant reviews
// @route   GET /reviews/restaurant_reviews
const getAllRestaurantReviews = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 10, page = 1 } = req.query;
    const perPage = parseInt(limit as string, 10);
    const currentPage = parseInt(page as string, 10);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = currentPage * perPage;

    const restaurantReviewCount = await RestaurantReview.count();

    const totalReviewCount = restaurantReviewCount;
    const totalPages = Math.ceil(totalReviewCount / perPage);

    const pagination: any = {};
    if (endIndex < totalReviewCount) {
      pagination.next = { page: currentPage + 1, limit: perPage };
    }

    if (startIndex > 0) {
      pagination.prev = { page: currentPage - 1, limit: perPage };
    }

    const restaurantReviews = await RestaurantReview.findAll({
      include: [
        {
          model: Restaurant,
          attributes: ["id", "name"],
        },
        {
          model: RestaurantReviewImage,
          attributes: ["id", "url"],
        },
        {
          model: RestaurantReviewVideo,
          attributes: ["id", "url"],
        },
      ],
    });

    return res
      .status(200)
      .json({ totalPages, pagination, data: { restaurantReviews } });
  }
);

export { getAllItemReviews, getAllRestaurantReviews };
