import { Request, Response } from "express";
import CandidateRestaurant from "../models/incentive/candidate_restaurant";
import CandidateRestaurantMenuImage from "../models/incentive/candidate_restaurant_menu_image";
import { FileRequest } from "../middlewares/upload-image";
import CandidateRestaurantTag from "../models/incentive/candidate_restaurant_tag";
import CandidateRestaurantLocation from "../models/incentive/candidate_restaurant_location";
import CandidateRestaurantLicenseImage from "../models/incentive/candidate_restaurant_license_image";
import { Incentive } from "../models";

// @desc Create a candidate restaurant
// @route POST /candidateRestaurants
const createCandidateRestaurant = async (req: FileRequest, res: Response) => {
  try {
    const {
      name,
      opening_hour,
      closing_hour,
      is_open,
      absolute_location,
      relative_location,
      tags,
    } = req.body;
    // Validate the name input
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Invalid name input" });
    }

    const user_id = req.params.userId;
    const candidateRestaurant = await CandidateRestaurant.create({
      name,
      user_id,
      ...req.body,
    });
    const candidateRestaurantId = candidateRestaurant.id;
    const menuImages = req.menuImages;
    const licenseImage = req.licenseImage[0];

    //create tags
    if (tags) {
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        await CandidateRestaurantTag.create({
          candidate_restaurant_id: candidateRestaurantId,
          name: tag,
        });
      }
    }

    //create locations
    if (absolute_location && relative_location) {
      const [latitude, longitude] = absolute_location.split(",");
      await CandidateRestaurantLocation.create({
        candidate_restaurant_id: candidateRestaurantId,
        latitude,
        longitude,
        description: relative_location,
      });
    }

    //create menu images
    if (menuImages) {
      for (let i = 0; i < menuImages.length; i++) {
        const image_url = menuImages[i];
        await CandidateRestaurantMenuImage.create({
          candidate_restaurant_id: candidateRestaurantId,
          url: image_url,
        });
      }
    }

    //create license images
    if (licenseImage) {
      await CandidateRestaurantLicenseImage.create({
        candidate_restaurant_id: candidateRestaurantId,
        url: licenseImage,
      });
    }

    const money_earned = 40;
    //give incentive for creation
    if (money_earned){
      const incentive = await Incentive.findOne({
      where: { user_id: user_id },
    });
    if (!incentive) {
      return res.status(404).json({ message: "Incentive not found" });
    }

    // Update the current total and all time total by adding the money earned
    incentive.current_total += money_earned;
    incentive.all_time_total += money_earned;

    // Save the updated incentive
    await incentive.save();
    }

    // Return a 201 response with the created candidate restaurant
    return res.status(201).json({ candidateRestaurant });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc Get a candidate restaurant by id
// @route GET /candidateRestaurants/:candidateRestaurantId
const getCandidateRestaurant = async (req: Request, res: Response) => {
  try {
    // Get the id from the request parameters
    const id = req.params.candidateRestaurantId;

    const candidateRestaurant = await CandidateRestaurant.findByPk(id);

    if (!candidateRestaurant) {
      return res
        .status(404)
        .json({ message: "Candidate restaurant not found" });
    }

    // Find the images associated with the candidate restaurant
    const images = await CandidateRestaurantMenuImage.findAll({
      where: { candidate_restaurant_id: id },
    });
    const candidate_restaurant_menu_images = images.map((image) => image.url);

    const license = await CandidateRestaurantLicenseImage.findAll({
      where: { candidate_restaurant_id: candidateRestaurant.id },
    });

    const candidate_restaurant_license_image = license.map(
      (image) => image.url
    );

    const location = await CandidateRestaurantLocation.findAll({
      where: { candidate_restaurant_id: candidateRestaurant.id },
    });

    const candidate_restaurant_tags = await CandidateRestaurantTag.findAll({
      where: { candidate_restaurant_id: candidateRestaurant.id },
    });

    const tags = candidate_restaurant_tags.map((tag) => tag.name);

    // Return a 200 response with the candidate restaurant
    return res
      .status(200)
      .json({
        candidateRestaurant,
        candidate_restaurant_menu_images,
        candidate_restaurant_license_image,
        location,
        tags,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc Get a candidate restaurant
// @route GET /candidateRestaurants
const getAllCandidateRestaurants = async (req: Request, res: Response) => {
  try {
    const candidateRestaurants = await CandidateRestaurant.findAll();
    const result = await Promise.all(
      candidateRestaurants.map(async (candidateRestaurant) => {
        const images = await CandidateRestaurantMenuImage.findAll({
          where: { candidate_restaurant_id: candidateRestaurant.id },
        });

        // Map the images array to an array of urls
        const candidate_restaurant_menu_images = images.map(
          (image) => image.url
        );

        // Return an object with the candidate restaurant and the images array
        return { candidateRestaurant, candidate_restaurant_menu_images };
      })
    );

    return res.status(200).json({ result });
  } catch (error) {
    // If there is any error, return a 500 response with the error message
    return res.status(500).json({ message: error.message });
  }
};

// @desc Accept a candidate restaurant
// @route PUT /candidateRestaurants/:candidateRestaurantId/accept
const acceptCandidateRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant_id = req.params.candidateRestaurantId;

    const updatedRows = await CandidateRestaurant.update(
      { is_approved: true },
      { where: { id: restaurant_id } }
    );

    if (updatedRows[0] === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const candidateRestaurant = await CandidateRestaurant.findOne({
      where: { id: restaurant_id },
    });

    // Return a 200 response with the updated candidate restaurant
    return res.status(200).json({ candidateRestaurant });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc Reject a candidate restaurant
// @route PUT /candidateRestaurants/:candidateRestaurantId/reject
const rejectCandidateRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant_id = req.params.candidateRestaurantId;

    const updatedRows = await CandidateRestaurant.update(
      { is_rejected: true },
      { where: { id: restaurant_id } }
    );

    if (updatedRows[0] === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const candidateRestaurant = await CandidateRestaurant.findOne({
      where: { id: restaurant_id },
    });

    // Return a 200 response with the updated candidate restaurant
    return res.status(200).json({ candidateRestaurant });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  createCandidateRestaurant,
  getCandidateRestaurant,
  getAllCandidateRestaurants,
  acceptCandidateRestaurant,
  rejectCandidateRestaurant,
};
