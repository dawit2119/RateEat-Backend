import { Request, Response } from "express";
import { FileRequest } from "../middlewares/upload-image";
import { Restaurant, UpdatedMenuImage } from "../models";

// @desc Create updated menu images
// @route POST /restaurant/:restaurant_id/updatedMenu
const createUpdatedMenuImage = async (req: FileRequest, res: Response) => {
  try {
    const {
      user_id,
    } = req.body;

    const restaurant_id = req.params.restaurantId;
    const updatedMenuImages = req.updatedMenuImages;


    //create menu images
    if (updatedMenuImages) {
      for (let i = 0; i < updatedMenuImages.length; i++) {
        const url = updatedMenuImages[i];
        await UpdatedMenuImage.create({
          user_id,
          restaurant_id,
          url
        });
      }
    }


    // Return a 201 response with the created candidate restaurant
    return res.status(201).json({ message: "Updated menu created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc Get menu images of a restaurant by id
// @route GET /restaurant/:restaurant_id/updatedMenu
const getUpdatedMenuImages = async (req: Request, res: Response) => {
  try {
    // Get the id from the request parameters
    const restaurant_id = req.params.RestaurantId;

    const restaurant = await Restaurant.findByPk(restaurant_id);

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant not found" });
    }

    // Find the images associated with the candidate restaurant
    const images = await UpdatedMenuImage.findAll({
      where: { restaurant_id },
    });
    const restaurant_updated_menu_images = images.map((image) => image.url);


    // Return a 200 response with the candidate restaurant
    return res.status(200).json({
      restaurant_updated_menu_images,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  createUpdatedMenuImage,
  getUpdatedMenuImages,
};
