import { NextFunction, Request, Response } from "express";
import {
  Restaurant,
  Menu,
  Category,
  Item,
  ItemImage,
  ItemVideo,
} from "../models";
import ErrorResponse from "../utils/error-response.utils";
import asyncAwaitHandler from "../middlewares/async-handler";

interface MenuItem {
  id: string;
  restaurant: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
    item: {
      name: string;
      description: string;
      price: number;
    }[];
  }[];
}

// @desc    Get menu of a restaurant
// @route   GET /restaurant/:restuarantId/menu
const getMenu = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return next(new ErrorResponse("Restaurant not found", 404));
    }
    const menu = await Menu.findOne({
      where: { restaurant_id: restaurantId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "menu_id"],
          include: [
            {
              model: Item,
              as: "item",
              order: [["average_rating", "DSC"]],
              attributes: [
                "id",
                "name",
                "description",
                "number_of_reviews",
                "average_rating",
                "price",
                "fasting",
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
        },
      ],
    });

    if (!menu) {
      return next(new ErrorResponse("Menu not found", 404));
    }

    return res.json({ success: true, menu: menu.dataValues });
  }
);

//@desc     Create menu
//@route    POST /restaurant/:restuarantId/menu
const createMenu = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findByPk(restaurantId, {
      include: ["menu"],
    });

    if (!restaurant) {
      return next(new ErrorResponse("Restaurant not found", 404));
    }
    if (restaurant.menu) {
      return next(
        new ErrorResponse("Menu already exists for this restaurant", 400)
      );
    }

    const menu = await Menu.create({
      restaurant_id: restaurantId,
    });
    return res.status(201).json({ message: "Menu created successfully", menu });
  }
);

// when we want to update the menu's ID
// @desc    update menu ID of a restaurant
// @route   PUT /restaurant/:restuarantId/menu
const updateMenu = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;
    const { newId } = req.body;

    const restaurant = await Restaurant.findByPk(restaurantId, {
      include: ["menu"],
    });

    if (!restaurant) {
      return next(new ErrorResponse("Restaurant not found", 404));
    }

    if (restaurant.menu.length === 0) {
      const newMenu = await restaurant.$create("menu", { id: newId });
      return res.json({ menu: newMenu });
    }

    await restaurant.menu[0].update({ id: newId });

    return res.json({ message: "Menu updated successfully" });
  }
);

// @desc    Delete menu of a restaurant
// @route   DELETE /restaurant/:restuarant_id/menu
const deleteMenu = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findByPk(restaurantId, {
      include: ["menu"],
    });

    if (!restaurant) {
      return next(new ErrorResponse("Restaurant not found", 404));
    }

    if (restaurant.menu.length === 0) {
      return next(new ErrorResponse("Menu not found", 404));
    }

    await restaurant.menu[0].destroy();

    return res.json({ message: "Menu deleted successfully" });
  }
);

export { getMenu, updateMenu, deleteMenu, createMenu };
