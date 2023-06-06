import { NextFunction, Request, Response } from "express";
import asyncAwaitHandler from "../middlewares/async-handler";
import { CandidateRestaurant, Item, ItemImage, ItemReview, ItemVideo, Restaurant, RestaurantImage, RestaurantReview, RestaurantVideo, User } from "../models";
import ErrorResponse from "../utils/error-response.utils";
import { Sequelize, Op } from 'sequelize';

// @desc find the statistic of users
// @route GET /stats/users
const getUserStat = asyncAwaitHandler(
  async (req, res, next) => {
    try {
      // Get the count of total users
      const totalUsersCount = await User.count();

      // Get the count of telegram users
      const telegramUsersCount = await User.count({
        where: {
          telegram_id: {
            [Op.not]: null,
          },
        },
      });

      const userCounts = {
        totalUsersCount,
        telegramUsersCount,
      };

      return res.status(200).json(userCounts);
    } catch (error) {
      return next(new ErrorResponse(error.message, 500));
    }
  }
);

const getItemStat = asyncAwaitHandler(
    async (req, res, next) => {
  try {
    // Count total items
    const totalItems = await Item.count();

    // Count item images
    const itemImagesCount = await ItemImage.count();

    // Count item videos
    const itemVideosCount = await ItemVideo.count();

    // Count item ratings
    const itemRatingsCount = await ItemReview.count({
      where: {
        rating: {
          [Op.not]: 0,
        },
      },
    });

    const itemCommentsCount = await ItemReview.count({
      where: {
        comment: {
          [Op.not]: "",
        },
      },
    });

    return res.status(200).json({
      totalItems,
      itemImagesCount,
      itemVideosCount,
      itemRatingsCount,
      itemCommentsCount
    });
  } catch (error) {
    return next(error);
  }
}
);

const getRestaurantStat = asyncAwaitHandler( 
    async (req, res, next) => {
  try {
    // Count total restaurants
    const totalRestaurants = await Restaurant.count();

    // Count restaurant images
    const restaurantImagesCount = await RestaurantImage.count();

    // Count restaurant videos
    const restaurantVideosCount = await RestaurantVideo.count();

    // Count restaurant ratings
    const restaurantRatingsCount = await RestaurantReview.count({
      where: {
        rating: {
          [Op.not]: 0,
        },
      },
    });
    const restaurantCommentsCount = await RestaurantReview.count({
      where: {
        comment: {
          [Op.not]: "",
        },
      },
    });

    // Count candidate restaurants with accepted true
    const candidateRestaurantsAccepted = await CandidateRestaurant.count({
      where: {
        is_approved: true,
      },
    });

    // Count candidate restaurants with accepted false
    const candidateRestaurantsNotAccepted = await CandidateRestaurant.count({
      where: {
        is_approved: false,
      },
    });

    return res.status(200).json({
      totalRestaurants,
      restaurantImagesCount,
      restaurantVideosCount,
      restaurantRatingsCount,
      restaurantCommentsCount,
      candidateRestaurantsAccepted,
      candidateRestaurantsNotAccepted,
    });
  } catch (error) {
    return next(error);
  }
}
);
const getAllStat = asyncAwaitHandler(
  async (req, res, next) => {
    try {
      // Get the count of total users
      const totalUsersCount = await User.count();

      // Get the count of telegram users
      const telegramUsersCount = await User.count({
        where: {
          telegram_id: {
            [Op.not]: null,
          },
        },
      });
// Count total items
    const totalItems = await Item.count();

    // Count item images
    const itemImagesCount = await ItemImage.count();

    // Count item videos
    const itemVideosCount = await ItemVideo.count();

    // Count item ratings
    const itemRatingsCount = await ItemReview.count({
      where: {
        rating: {
          [Op.not]: 0,
        },
      },
    });

    const itemCommentsCount = await ItemReview.count({
      where: {
        comment: {
          [Op.not]: "",
        },
      },
    });
      // Count total restaurants
    const totalRestaurants = await Restaurant.count();

    // Count restaurant images
    const restaurantImagesCount = await RestaurantImage.count();

    // Count restaurant videos
    const restaurantVideosCount = await RestaurantVideo.count();

    // Count restaurant ratings
    const restaurantRatingsCount = await RestaurantReview.count({
      where: {
        rating: {
          [Op.not]: 0,
        },
      },
    });
    const restaurantCommentsCount = await RestaurantReview.count({
      where: {
        comment: {
          [Op.not]: "",
        },
      },
    });

    // Count candidate restaurants with accepted true
    const candidateRestaurantsAccepted = await CandidateRestaurant.count({
      where: {
        is_approved: true,
      },
    });

    // Count candidate restaurants with accepted false
    const candidateRestaurantsNotAccepted = await CandidateRestaurant.count({
      where: {
        is_approved: false,
      },
    });

      const statCounts = {
        totalUsersCount,
        telegramUsersCount,
        itemRatingsCount,
        itemImagesCount,
        itemCommentsCount,
        itemVideosCount,
        restaurantRatingsCount,
        restaurantImagesCount,
        restaurantCommentsCount,
        restaurantVideosCount,
        candidateRestaurantsNotAccepted,
        totalRestaurants
      };

      return res.status(200).json(statCounts);
    } catch (error) {
      return next(new ErrorResponse(error.message, 500));
    }
  }
);

export {getUserStat, getItemStat, getRestaurantStat, getAllStat}