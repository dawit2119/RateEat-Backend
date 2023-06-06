import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/error-response.utils";
import asyncAwaitHandler from "../middlewares/async-handler";
import { User, EatList, Item, ItemImage, ItemVideo } from "../models";

// @desc    GET all user favourites
// @route   GET users/:userId/favorites
const getUserFavorites = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.userId;

    const user = await User.findByPk(user_id);
    if (!user) {
      return next(new ErrorResponse("User does not exist", 400));
    }

    const favourites = await EatList.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: Item,
          attributes: [
            "id",
            "name",
            "average_rating",
            "price",
            "description",
            "number_of_reviews",
          ],
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
      ],
    });

    return res.status(200).json({ favourites });
  }
);

// @desc    Add item to user favourites
// @route   POST users/:userId/favorites
const addItemToFavorites = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { itemId } = req.body;

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(new ErrorResponse("User does not exist", 400));
    }

    const item = await Item.findByPk(itemId);
    if (!item) {
      return next(new ErrorResponse("Item does not exist", 400));
    }

    // check if the item is already in the user's favourites
    const favourite = await EatList.findOne({
      where: { user_id: userId, item_id: itemId },
    });

    if (favourite) {
      return next(new ErrorResponse("Item already in favourites", 400));
    }

    // add item to user's favourites
    await EatList.create({
      user_id: userId,
      item_id: itemId,
      date: new Date(),
    });

    return res.status(200).json({ message: "Item added to favourites" });
  }
);

// @desc    Remove item from user favourites
// @route   DELETE /users/:userId/favorites/:itemId
const removeItemFromFavorites = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemId, userId } = req.params;

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return next(new ErrorResponse("User does not exist", 400));
    }

    const item = await Item.findByPk(itemId);
    if (!item) {
      return next(new ErrorResponse("Item does not exist", 400));
    }

    // check if the item is already in the user's favourites
    const favourite = await EatList.findOne({
      where: { user_id: userId, item_id: itemId },
    });

    if (!favourite) {
      return next(new ErrorResponse("Item not in favourites", 400));
    }

    // remove item from user's favourites
    await EatList.destroy({
      where: { user_id: userId, item_id: itemId },
    });

    return res.status(200).json({ message: "Item removed from favourites" });
  }
);

export { addItemToFavorites, getUserFavorites, removeItemFromFavorites };
