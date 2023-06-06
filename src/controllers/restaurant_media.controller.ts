import { Request, Response } from "express";
import asyncAwaitHandler from "../middlewares/async-handler";
import { Restaurant, RestaurantImage, RestaurantVideo } from "../models";
import { FileRequest } from "../middlewares/upload-image";

// @desc get all restaurant's media
// @route GET /restaurants/:restaurantId/media
const getRestaurantMedia = asyncAwaitHandler(
    async (req, res, next) => {
        try {
            const restaurant_id = req.params.restaurantId
            const restaurantImages = await RestaurantImage.findAll({
                where: {restaurant_id: restaurant_id},
                attributes: ['url']
            })
            const restaurantVideos = await RestaurantVideo.findAll({
                where: {restaurant_id:restaurant_id},
                attributes: ['url']
            })
            
            res.status(200).json({
                restaurant_id,
      restaurantImages: restaurantImages,
      restaurantVideos: restaurantVideos
    });
        } catch (error) {
            console.log(next(error))
        }
        
    }
)

// @desc create a new media for a restaurant
// @route POST /restaurants/:restaurantId/media
const createRestaurantMedia = asyncAwaitHandler (
    async (req: FileRequest, res, next) => {
  try {
    const restaurant_id = req.params.restaurantId
    const restaurant = await Restaurant.findOne({
      where: {id: restaurant_id}
    })
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

        if (req.mediaImages) {
      const restaurantImages = req.mediaImages
      for (let i = 0; i < restaurantImages.length; i++) {
      await RestaurantImage.create({
        url: restaurantImages[i],
        restaurant_id: restaurant_id
      })
    }
    }
    if (req.mediaVideos) {
      const restaurantVideos = req.mediaVideos
      for (let i = 0; i < restaurantVideos.length; i++) {
      await RestaurantVideo.create({
        url: restaurantVideos[i],
        restaurant_id: restaurant_id
      })
    }
    }
    return res
      .status(201)
      .json({ message: "Medias created successfully" });

  } catch (error) {
    return next(error);
  }
}
)

export {getRestaurantMedia, createRestaurantMedia}