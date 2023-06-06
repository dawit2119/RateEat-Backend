import { Request, Response } from "express";
import { RestaurantPhoneNumber, Restaurant } from "../models";

// Get restaurant_phone_numbers in an restaurant
// route restaurants/:restaurantId/restaurant_phone_numbers
const getRestaurantPhoneNumbers = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const restaurant_phone_numbers = restaurant.restaurant_phone_numbers;

    return res.status(200).json({ restaurant_phone_numbers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create an restaurant_phone_numbers for an restaurant
// route restaurants/:restaurantId/restaurant_phone_numbers
const createRestaurantPhoneNumber = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const { phone_number } = req.body;

    if (!phone_number || typeof phone_number !== "string") {
      return res.status(400).json({ message: "Invalid phone number input" });
    }

    // Create a new restaurant_phone_number with the name and restaurant id
    const restaurant_phone_number = await RestaurantPhoneNumber.create({
      phone_number: phone_number,
      restaurant_id: restaurantId,
    });

    return res.status(201).json({ restaurant_phone_number });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getRestaurantPhoneNumbers, createRestaurantPhoneNumber };
