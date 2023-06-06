import { Request, Response, NextFunction } from "express";
import {
  Item,
  ItemReview,
  ItemVote,
  RestaurantReview,
  RestaurantVote,
  Role,
  User,
} from "../models";
import asyncAwaitHandler from "../middlewares/async-handler";
import ErrorResponse from "../utils/error-response.utils";
import { literal } from "sequelize";

// @desc    upvote a item review
// @route   POST votes/upvote-item-review
const upvoteItemReview = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, reviewId } = req.body;

    const review = await ItemReview.findByPk(reviewId);

    if (!review) {
      return next(new ErrorResponse("Review Not Found", 400));
    }

    const voter = await User.findByPk(userId);

    if (!voter) {
      return next(new ErrorResponse("User Not Found", 400));
    }

    const vote = await ItemVote.findOne({
      where: {
        item_review_id: reviewId,
        voter_id: userId,
      },
    });

    if (vote) {
      if (vote.flag) {
        await ItemReview.update(
          { up_vote: literal("up_vote - 1") },
          { where: { id: reviewId } }
        );

        await ItemVote.destroy({
          where: {
            item_review_id: reviewId,
            voter_id: userId,
          },
        });

        const newReview = await ItemReview.findOne({
          where: { id: reviewId },
        });

        return res.status(201).json({
          message: "Vote deleted",
          review: { ...newReview.dataValues, voted: 0 }, // voted: 0 = not voted, 1 = upvoted, -1 = downvoted
        });
      } else {
        await ItemReview.update(
          {
            up_vote: literal("UP_vote + 1"),
            down_vote: literal("down_vote - 1"),
          },
          { where: { id: reviewId } }
        );

        await ItemVote.update(
          { flag: true },
          { where: { item_review_id: reviewId, voter_id: userId } }
        );

        const newReview = await ItemReview.findOne({
          where: { id: reviewId },
        });

        return res.status(201).json({
          message: "Vote updated",
          review: { ...newReview.dataValues, voted: 1 },
        });
      }
    } else {
      await ItemReview.update(
        { up_vote: literal("up_vote + 1") },
        { where: { id: reviewId } }
      );

      const newVote = await ItemVote.create({
        item_review_id: reviewId,
        voter_id: userId,
        flag: true,
        value: 1,
      });

      const newReview = await ItemReview.findOne({
        where: { id: reviewId },
      });

      return res.status(201).json({
        message: "Vote created",
        review: { ...newReview.dataValues, voted: 1 },
      });
    }
  }
);

// @desc    downvote a item review
// @route   POST votes/downvote-item-review
const downvoteItemReview = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, reviewId } = req.body;

    const review = await ItemReview.findByPk(reviewId);

    if (!review) {
      return next(new ErrorResponse("Review Not Found", 400));
    }

    const voter = await User.findByPk(userId);

    if (!voter) {
      return next(new ErrorResponse("User Not Found", 400));
    }

    const vote = await ItemVote.findOne({
      where: {
        item_review_id: reviewId,
        voter_id: userId,
      },
    });

    if (vote) {
      if (!vote.flag) {
        await ItemReview.update(
          { down_vote: literal("down_vote - 1") },
          { where: { id: reviewId } }
        );

        await ItemVote.destroy({
          where: {
            item_review_id: reviewId,
            voter_id: userId,
          },
        });

        const newReview = await ItemReview.findByPk(reviewId);

        return res.status(201).json({
          message: "Vote deleted",
          review: { ...newReview.dataValues, voted: -1 },
        });
      } else {
        await ItemReview.update(
          {
            down_vote: literal("down_vote + 1"),
            up_vote: literal("up_vote - 1"),
          },
          { where: { id: reviewId } }
        );

        await ItemVote.update(
          { flag: false },
          { where: { item_review_id: reviewId, voter_id: userId } }
        );

        const newReview = await ItemReview.findByPk(reviewId);

        return res.status(201).json({
          message: "Vote updated",
          review: { ...newReview.dataValues, voted: -1 },
        });
      }
    } else {
      await ItemReview.update(
        { down_vote: literal("down_vote + 1") },
        { where: { id: reviewId } }
      );

      const newVote = await ItemVote.create({
        item_review_id: reviewId,
        voter_id: userId,
        flag: false,
        value: -1,
      });

      const newReview = await ItemReview.findByPk(reviewId);

      return res.status(201).json({
        message: "Vote created",
        review: { ...newReview.dataValues, voted: -1 },
      });
    }
  }
);

// @desc    upvote-restaurant-review
// @route   POST votes/upvote-restaurant-review
const upvoteRestaurantReview = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, reviewId } = req.body;

    const review = await RestaurantReview.findByPk(reviewId);

    if (!review) {
      return next(new ErrorResponse("Review Not Found", 400));
    }

    const voter = await User.findByPk(userId);

    if (!voter) {
      return next(new ErrorResponse("User Not Found", 400));
    }

    const vote = await RestaurantVote.findOne({
      where: {
        restaurant_review_id: reviewId,
        voter_id: userId,
      },
    });

    if (vote) {
      if (vote.flag) {
        await RestaurantReview.update(
          { up_vote: literal("up_vote - 1") },
          { where: { id: reviewId } }
        );

        await RestaurantVote.destroy({
          where: {
            restaurant_review_id: reviewId,
            voter_id: userId,
          },
        });

        const newReview = await RestaurantReview.findOne({
          where: { id: reviewId },
        });

        return res.status(201).json({
          message: "Vote deleted",
          review: { ...newReview.dataValues, voted: 0 }, // voted: 0 = not voted, 1 = upvoted, -1 = downvoted
        });
      } else {
        await RestaurantReview.update(
          {
            up_vote: literal("UP_vote + 1"),
            down_vote: literal("down_vote - 1"),
          },
          { where: { id: reviewId } }
        );

        await RestaurantVote.update(
          { flag: true },
          { where: { restaurant_review_id: reviewId, voter_id: userId } }
        );

        const newReview = await RestaurantReview.findOne({
          where: { id: reviewId },
        });

        return res.status(201).json({
          message: "Vote updated",
          review: { ...newReview.dataValues, voted: 1 },
        });
      }
    } else {
      await RestaurantReview.update(
        { up_vote: literal("up_vote + 1") },
        { where: { id: reviewId } }
      );

      const newVote = await RestaurantVote.create({
        restaurant_review_id: reviewId,
        voter_id: userId,
        flag: true,
        value: 1,
      });

      const newReview = await RestaurantReview.findOne({
        where: { id: reviewId },
      });

      return res.status(201).json({
        message: "Vote created",
        review: { ...newReview.dataValues, voted: 1 },
      });
    }
  }
);

// @desc    downvote a restaurant review
// @route   POST votes/downvote-restaurant-review
const downVoteRestaurantReview = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, reviewId } = req.body;

    const review = await RestaurantReview.findByPk(reviewId);

    if (!review) {
      return next(new ErrorResponse("Review Not Found", 400));
    }

    const voter = await User.findByPk(userId);

    if (!voter) {
      return next(new ErrorResponse("User Not Found", 400));
    }

    const vote = await RestaurantVote.findOne({
      where: {
        restaurant_review_id: reviewId,
        voter_id: userId,
      },
    });

    if (vote) {
      if (!vote.flag) {
        await RestaurantReview.update(
          { down_vote: literal("down_vote - 1") },
          { where: { id: reviewId } }
        );

        await RestaurantVote.destroy({
          where: {
            restaurant_review_id: reviewId,
            voter_id: userId,
          },
        });

        const newReview = await RestaurantReview.findByPk(reviewId);

        return res.status(201).json({
          message: "Vote deleted",
          review: { ...newReview.dataValues, voted: -1 },
        });
      } else {
        await RestaurantReview.update(
          {
            down_vote: literal("down_vote + 1"),
            up_vote: literal("up_vote - 1"),
          },
          { where: { id: reviewId } }
        );

        await RestaurantVote.update(
          { flag: false },
          { where: { restaurant_review_id: reviewId, voter_id: userId } }
        );

        const newReview = await RestaurantReview.findByPk(reviewId);

        return res.status(201).json({
          message: "Vote updated",
          review: { ...newReview.dataValues, voted: -1 },
        });
      }
    } else {
      await RestaurantReview.update(
        { down_vote: literal("down_vote + 1") },
        { where: { id: reviewId } }
      );

      const newVote = await RestaurantVote.create({
        restaurant_review_id: reviewId,
        voter_id: userId,
        flag: false,
        value: -1,
      });

      const newReview = await RestaurantReview.findByPk(reviewId);

      return res.status(201).json({
        message: "Vote created",
        review: { ...newReview.dataValues, voted: -1 },
      });
    }
  }
);
export {
  upvoteItemReview,
  downvoteItemReview,
  upvoteRestaurantReview,
  downVoteRestaurantReview,
};
