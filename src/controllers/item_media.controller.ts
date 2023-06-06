import { Request, Response } from "express";
import asyncAwaitHandler from "../middlewares/async-handler";
import { Item, ItemImage, ItemVideo } from "../models";
import { FileRequest } from "../middlewares/upload-image";

// desc get all item's media
// route GET /items/:itemId/media
const getItemMedia = asyncAwaitHandler(
    async (req, res, next) => {
        try {
            const item_id = req.params.itemId
            const itemImages = await ItemImage.findAll({
                where: {item_id: item_id},
                attributes: ['url']
            })
            const itemVideos = await ItemVideo.findAll({
                where: {item_id:item_id},
                attributes: ['url']
            })
            
            res.status(200).json({
                item_id,
      itemImages: itemImages,
      itemVideos: itemVideos
    });
        } catch (error) {
            console.log(next(error))
        }
        
    }
)

// desc create a new media for an item
// route POST /items/:itemId/media
const createItemMedia = asyncAwaitHandler (
    async (req: FileRequest, res, next) => {
  try {
    const item_id = req.params.itemId
    const item = await Item.findOne({
      where: {id: item_id}
    })
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

        if (req.mediaImages) {
      const itemImages = req.mediaImages
      for (let i = 0; i < itemImages.length; i++) {
      await ItemImage.create({
        url: itemImages[i],
        item_id: item_id
      })
    }
    }
    if (req.mediaVideos) {
      const itemVideos = req.mediaVideos
      for (let i = 0; i < itemVideos.length; i++) {
      await ItemVideo.create({
        url: itemVideos[i],
        item_id: item_id
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

export {createItemMedia, getItemMedia}