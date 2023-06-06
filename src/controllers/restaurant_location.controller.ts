import { Request, Response } from "express";
import { RestaurantLocation, Restaurant } from "../models";

// Get restaurant_locations in an restaurant
// route restaurants/:restaurantId/restaurant_locations
const getRestaurantLocations = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const restaurant_locations = restaurant.restaurant_locations;

    return res.status(200).json({ restaurant_locations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create an restaurant_locations for an restaurant
// route restaurants/:restaurantId/restaurant_locations
const createRestaurantLocation = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const { latitude, longitude, description } = req.body;

    let parsedLatitude = parseFloat(latitude);
    let parsedLongitude = parseFloat(longitude);

    if (isNaN(parsedLatitude) || isNaN(parsedLongitude) || !parsedLatitude || !parsedLongitude || !description || typeof description !== "string") {
      return res.status(400).json({ message: "Invalid location input" });
    }

    // Create a new restaurant_location with the name and restaurant id
    const restaurant_location = await RestaurantLocation.create({
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      description: description,
      restaurant_id: restaurantId,
    });

    return res.status(201).json({ restaurant_location });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {getRestaurantLocations, createRestaurantLocation };