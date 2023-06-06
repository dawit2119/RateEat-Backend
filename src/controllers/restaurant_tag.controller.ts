import { Request, Response } from "express";
import { RestaurantTag, Restaurant } from "../models";

// Get restaurant_tags in an restaurant
// route restaurants/:restaurantId/restaurant_tags
const getRestaurantTags = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const restaurant_tags = restaurant.restaurant_tags;

    return res.status(200).json({ restaurant_tags });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create an restaurant_tags for an restaurant
// route restaurants/:restaurantId/restaurant_tags
const createRestaurantTag = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const name = req.body.name;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Invalid tag input" });
    }

    // Create a new restaurant_tag with the name and restaurant id
    const restaurant_tag = await RestaurantTag.create({
      name: name,
      restaurant_id: restaurantId,
    });

    return res.status(201).json({ restaurant_tag });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {getRestaurantTags, createRestaurantTag };