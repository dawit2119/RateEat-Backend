import { Request, Response } from "express";
import { Restaurant, Menu, Category, Item } from "../models";

// @desc    Get categories of a menu
// @route   GET restaurants/:restaurantId/menu/categories
const getCategories = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const menu = await Menu.findOne({
      where: { restaurant_id: restaurantId },
      include: ["category"],
    });

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    return res.status(200).json({ categories: menu.category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Create a category
// @route   POST restaurants/:restaurantId/menu/categories
const createCategory = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { name } = req.body;

    const restaurant = await Restaurant.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const menu = await Menu.findOne({
      where: { restaurant_id: restaurantId },
    });

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    const category = await Category.create({
      menu_id: menu.id,
      name: name,
    });

    return res.status(201).json({ category });;
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal server error ${error.message}` });
  }
};

export { createCategory, getCategories };
