import { Request, Response } from "express";
import { Ingredient, Item }from "../models";

// @desc GET ingredients in an item
// @route GET /items/:itemId/ingredients
const getIngredients = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId;

    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const ingredients = item.ingredients;

    return res.status(200).json({ ingredients });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc POST an ingredient for an item
// @route POST /items/:itemId/ingredients
const createIngredient = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const name = req.body.name;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Invalid ingredient input" });
    }

    // Create a new ingredient with the name and item id
    const ingredient = await Ingredient.create({
      name: name,
      item_id: itemId,
    });

    return res.status(201).json({ ingredient });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {getIngredients, createIngredient };