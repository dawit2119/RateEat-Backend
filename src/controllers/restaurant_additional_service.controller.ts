import { Request, Response } from "express";
import { RestaurantAdditionalService, Restaurant } from "../models";

// Get restaurant_additional_services in an restaurant
// route restaurants/:restaurantId/restaurant_additional_services
const getRestaurantAdditionalServices = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const restaurant_additional_services = restaurant.restaurant_additional_services;

    return res.status(200).json({ restaurant_additional_services });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create an restaurant_additional_services for an restaurant
// route restaurants/:restaurantId/restaurant_additional_services
const createRestaurantAdditionalService = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const { additional_service } = req.body;

    if (!additional_service || typeof additional_service !== "string") {
      return res.status(400).json({ message: "Invalid additional service input" });
    }

    // Create a new restaurant_additional_service with the name and restaurant id
    const restaurant_additional_service = await RestaurantAdditionalService.create({
      additional_service: additional_service,
      restaurant_id: restaurantId,
    });

    return res.status(201).json({ restaurant_additional_service });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getRestaurantAdditionalServices, createRestaurantAdditionalService };
