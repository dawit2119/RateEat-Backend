import { Request, Response, NextFunction } from "express";
import {
  User,
  Role,
  RestaurantReview,
  ItemReview,
  Item,
  Restaurant,
  RestaurantReviewImage,
  RestaurantReviewVideo,
  ItemReviewImage,
  ItemReviewVideo,
  RestaurantImage,
  RestaurantVideo,
  ItemImage,
  ItemVideo,
  ItemVote,
  RestaurantVote,
} from "../models";
import asyncAwaitHandler from "../middlewares/async-handler";
import ErrorResponse from "../utils/error-response.utils";
import { FileRequest } from "../middlewares/upload-image";

const createUser = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { telegram_id, first_name, last_name, phone_number, role_name } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { phone_number } });
    if (existingUser) {
      return next(new ErrorResponse("User already exists", 400));
    }

    // Get role id from role name
    const role = await Role.findOne({ where: { name: role_name } });
    if (!role) {
      return next(new ErrorResponse("Role does not exist", 400));
    }

    // Create new user
    const newUser = await User.create({
      telegram_id,
      first_name,
      last_name,
      phone_number,
      role_id: role.id,
      ...req.body,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  }
);

// @desc    Check if user exists
// @route   POST /users/check
const checkUserExists = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone_number, telegram_id } = req.body;
    if (!phone_number && !telegram_id) {
      return next(
        new ErrorResponse("Phone number or telegram id required", 400)
      );
    }

    if (phone_number) {
      const existingUserWithPhone = await User.findOne({
        where: { phone_number },
      });
      if (existingUserWithPhone) {
        return res
          .status(200)
          .json({ message: "User exists", existingUserWithPhone });
      }
    }

    if (telegram_id) {
      const existingUserWithTelegram = await User.findOne({
        where: { telegram_id },
      });
      if (existingUserWithTelegram) {
        return res
          .status(200)
          .json({ message: "User exists", existingUserWithTelegram });
      }
    }
    return next(new ErrorResponse("User does not exist", 400));
  }
);

// @desc    Get all users
// @route   GET /users
const getUsers = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll();
    return res.status(200).json({ users });
  }
);

// @desc    Get user by id
// @route   GET /users/:id
const getUserById = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    return res.status(200).json({ user });
  }
);

// @desc    Get user by id
// @route   GET /users/telegram/:telegramId
const getUserByTelegramId = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { telegramId } = req.params;
    const user = await User.findOne({
      where: {
        telegram_id: telegramId,
      },
    });
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    return res.status(200).json({ user });
  }
);

// @desc    Update user by id
// @route   PUT /users/:id
const updateUser = asyncAwaitHandler(
  async (req: FileRequest, res: Response, next: NextFunction) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    if (req.googleStoragePublicUrl) {
      req.body.image = req.googleStoragePublicUrl;
    }
    await user.update(req.body);
    return res.status(200).json({ message: "User updated successfully" });
  }
);

// @desc    Delete user by id
// @route   DELETE /users/:id
const deleteUser = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    await user.destroy();
    return res.status(200).json({ message: "User deleted successfully" });
  }
);

// @desc    find all reviews by a user
// @route   GET /users/:userId/reviews
const getAllReviewsByUser = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const perPage = parseInt(limit as string, 10);
    const currentPage = parseInt(page as string, 10);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = currentPage * perPage;

    if (!userId) {
      return res.status(400).json({ message: "User id required" });
    }

    const [restaurantReviewCountUser, itemReviewCountUser] = await Promise.all([
      RestaurantReview.count({ where: { user_id: req.params.userId } }),
      ItemReview.count({ where: { user_id: req.params.userId } }),
    ]);

    const totalReviewCountUser =
      restaurantReviewCountUser + itemReviewCountUser;
    const totalPages = Math.ceil(totalReviewCountUser / perPage);

    const pagination: any = {};
    if (endIndex < totalReviewCountUser) {
      pagination.next = { page: currentPage + 1, limit: perPage };
    }

    if (startIndex > 0) {
      pagination.prev = { page: currentPage - 1, limit: perPage };
    }

    const [restaurantReviewsUser, itemReviewsUser] = await Promise.all([
      RestaurantReview.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Restaurant,
            attributes: ["id", "name"],
            include: [
              {
                model: RestaurantImage,
                attributes: ["id", "url"],
              },
              {
                model: RestaurantVideo,
                attributes: ["id", "url"],
              },
            ],
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
      }),
      ItemReview.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Item,
            attributes: ["id", "name"],
            include: [
              {
                model: ItemImage,
                attributes: ["id", "url"],
              },
              {
                model: ItemVideo,
                attributes: ["id", "url"],
              },
            ],
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
      }),
    ]);

    const [itemVotes, restauarntVotes] = await Promise.all([
      ItemVote.findAll({
        where: { voter_id: userId },
      }),
      RestaurantVote.findAll({
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
      const itemReviewVote = votedItemReviews.find(
        (itemVote) => itemVote.item_review_id === itemReviewId
      );
      if (itemReviewVote) {
        return {
          ...itemReview.dataValues,
          voted: itemReviewVote.flag ? 1 : -1,
        };
      } else {
        return { ...itemReview.dataValues, voted: 0 };
      }
    });

    const restaurantReviews = restaurantReviewsUser.map((restaurantReview) => {
      const restaurantReviewId = restaurantReview.id;
      const restaurantReviewVote = votedRestaurantReviews.find(
        (restaurantVote) =>
          restaurantVote.restaurant_review_id === restaurantReviewId
      );
      if (restaurantReviewVote) {
        return {
          ...restaurantReview.dataValues,
          voted: restaurantReviewVote.flag ? 1 : -1,
        };
      } else {
        return { ...restaurantReview.dataValues, voted: 0 };
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
  }
);

// @desc    find all restaurant reviews by a user
// @route   GET /users/:userId/restaurant_reviews
const getRestaurantReviewsByUser = asyncAwaitHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { limit = 10, page = 1 } = req.query;
    const perPage = parseInt(limit as string, 10);
    const currentPage = parseInt(page as string, 10);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = currentPage * perPage;

    if (!userId) {
      return res.status(400).json({ message: "User id required" });
    }

    const restaurantReviewCountUser = await RestaurantReview.count({
      where: { user_id: req.params.userId },
    });

    const totalReviewCountUser = restaurantReviewCountUser;
    const totalPages = Math.ceil(totalReviewCountUser / perPage);

    const pagination: any = {};
    if (endIndex < totalReviewCountUser) {
      pagination.next = { page: currentPage + 1, limit: perPage };
    }

    if (startIndex > 0) {
      pagination.prev = { page: currentPage - 1, limit: perPage };
    }

    const restaurantReviewsUser = await RestaurantReview.findAll({
      where: { user_id: userId },
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

    const restaurantVotes = await RestaurantVote.findAll({
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
      const restaurantReviewVote = votedRestaurantReviews.find(
        (restaurantVote) =>
          restaurantVote.restaurant_review_id === restaurantReviewId
      );
      if (restaurantReviewVote) {
        return {
          ...restaurantReview.dataValues,
          voted: restaurantReviewVote.flag ? 1 : -1,
        };
      } else {
        return { ...restaurantReview.dataValues, voted: 0 };
      }
    });

    return res
      .status(200)
      .json({ totalPages, pagination, data: { restaurantReviews } });
  }
);

// @desc    find all item reviews by a user
// @route   GET /users/:userId/item_reviews
const getItemReviewsByUser = asyncAwaitHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { limit = 10, page = 1 } = req.query;
    const perPage = parseInt(limit as string, 10);
    const currentPage = parseInt(page as string, 10);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = currentPage * perPage;
    if (!userId) {
      return res.status(400).json({ message: "User id required" });
    }

    const itemReviewCountUser = await ItemReview.count({
      where: { user_id: req.params.userId },
    });

    const totalReviewCountUser = itemReviewCountUser;
    const totalPages = Math.ceil(totalReviewCountUser / perPage);

    const pagination: any = {};
    if (endIndex < totalReviewCountUser) {
      pagination.next = { page: currentPage + 1, limit: perPage };
    }

    if (startIndex > 0) {
      pagination.prev = { page: currentPage - 1, limit: perPage };
    }

    const itemReviewsUser = await ItemReview.findAll({
      where: { user_id: userId },
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

    const itemVotes = await ItemVote.findAll({
      where: { voter_id: userId },
    });

    const votedItemReviews = itemVotes.map((itemVote) => {
      return { item_review_id: itemVote.item_review_id, flag: itemVote.flag }; // flag: true = upvote, false = downvote
    });

    const itemReviews = itemReviewsUser.map((itemReview) => {
      const itemReviewId = itemReview.id;
      const itemReviewVote = votedItemReviews.find(
        (itemVote) => itemVote.item_review_id === itemReviewId
      );
      if (itemReviewVote) {
        return {
          ...itemReview.dataValues,
          voted: itemReviewVote.flag ? 1 : -1,
        };
      } else {
        return { ...itemReview.dataValues, voted: 0 };
      }
    });

    return res
      .status(200)
      .json({ totalPages, pagination, data: { itemReviews } });
  }
);

export {
  createUser,
  checkUserExists,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByTelegramId,
  getAllReviewsByUser,
  getItemReviewsByUser,
  getRestaurantReviewsByUser,
};
