import { NextFunction, Request, Response } from "express";
import { Op, literal } from "sequelize";
import {
  Category,
  Item,
  ItemTag,
  Menu,
  Restaurant,
  RestaurantImage,
  RestaurantLocation,
  RestaurantReview,
  RestaurantTag,
  RestaurantVideo,
} from "../models";
import asyncAwaitHandler from "../middlewares/async-handler";
import ErrorResponse from "../utils/error-response.utils";
import { Sequelize } from "sequelize-typescript";

// @desc    Get all restaurants
// @route   GET /restaurants
const getRestaurants = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      searchTerm,
      page,
      limit,
      latitude,
      longitude,
      radius,
      maxPrice,
      minRating,
      tags,
      popularity,
    } = req.query;

    const currPage = parseInt(page as string, 10) || 1;
    const limitNeeded = parseInt(limit as string, 10) || 5;
    const startIndex = (currPage - 1) * limitNeeded;
    const endIndex = currPage * limitNeeded;

    let whereCondition = {};

    if (searchTerm) {
      const searchWords = (searchTerm as string).toLowerCase().split(" ");
      if (searchWords.length > 1) {
        whereCondition = {
          ...whereCondition,
          name: { [Op.iLike]: `%${searchTerm}%` },
        };
      } else {
        // Match at the beginning for single words
        whereCondition = {
          ...whereCondition,
          [Op.or]: searchWords.map((word) => ({
            name: {
              [Op.or]: [
                { [Op.iLike]: `${word}%` }, // Match at the beginning
                { [Op.iLike]: `%${word}%` }, // Match anywhere in the name
              ],
            },
          })),
        };
      }
    }

    let includeOptions: any[] = [
      {
        model: Menu,
        attributes: ["id"],
        include: [
          {
            model: Category,
            attributes: ["id", "name"],
            include: [
              {
                model: Item,
                attributes: ["id", "name", "price", "description"],
                order: [
                  ["average_rating", "DESC"],
                  ["popularity_index", "ASC"],
                ],
                limit: 10,
              },
            ],
          },
        ],
      },
      {
        model: RestaurantTag,
        attributes: ["id", "name"],
        limit: 4,
      },
      {
        model: RestaurantImage,
        attributes: ["id", "url"],
      },
      {
        model: RestaurantVideo,
        attributes: ["id", "url"],
      },
      {
        model: RestaurantLocation,
        attributes: ["id", "latitude", "longitude", "description"],
      },
    ];

    let restaurants: Restaurant[] = [];

    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const long = parseFloat(longitude as string);
      const rad = parseInt(radius as string, 10) || 1000;
      includeOptions.push({
        model: RestaurantLocation,
        attributes: ["id", "latitude", "longitude", "description"],
        where: literal(
          `ST_DWithin(
            geography(ST_MakePoint(${long}, ${lat})),
            geography(ST_MakePoint("restaurant_locations"."longitude", "restaurant_locations"."latitude")),
            ${rad}
          )`
        ),
      });
    }

    if (tags as string) {
      const tagArray = (tags as string).split(",").map((tag) => tag.trim());
      includeOptions.push({
        model: RestaurantTag,
        attributes: ["id", "name"],
        where: {
          name: {
            [Op.or]: tagArray,
          },
        },
      });
    }

    if (maxPrice) {
      const maxPriceValue = parseInt(maxPrice as string, 10);
      whereCondition = {
        ...whereCondition,
        average_price: {
          [Op.lte]: maxPriceValue, // less than or equal to
        },
      };
    }

    if (minRating) {
      const minRatingValue = parseInt(minRating as string, 10);
      whereCondition = {
        ...whereCondition,
        average_rating: {
          [Op.gte]: minRatingValue, // greater than or equal to
        },
      };
    }

    const commonQueryOptions = {
      where: whereCondition,
      include: includeOptions,
    };
    let totalRestaurants = 0;
    if (popularity) {
      const result = await Restaurant.findAndCountAll({
        ...commonQueryOptions,
        order: [["popularity_index", "DESC"]],
        distinct: true,
      });
      restaurants = result.rows;
      totalRestaurants = result.count;
    } else {
      const result = await Restaurant.findAndCountAll({
        ...commonQueryOptions,
        order: [
          ["average_rating", "DESC"],
          ["average_price", "ASC"],
          ["popularity_index", "DESC"],
        ],
        distinct: true,
      });
      restaurants = result.rows;
      totalRestaurants = result.count;
    }

    // increment the popularity index by 1
    restaurants.forEach(async (restaurant) => {
      await restaurant.incrementPopularity();
    });

    // pagination
    const pagination: any = {};
    if (endIndex < totalRestaurants) {
      pagination.next = {
        page: currPage + 1,
        limit: limitNeeded,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: currPage - 1,
        limit: limitNeeded,
      };
    }
    const totalPages = Math.ceil(totalRestaurants / limitNeeded);
    res.status(200).json({
      success: true,
      count: restaurants.length,
      pagination,
      totalPages,
      data: restaurants.slice(startIndex, endIndex),
    });
  }
);

// @desc Get all restaurants for live search
// @route GET /restaurants/all/search?searchTerm=searchTerm
const getAllRestaurantsForLiveSearch = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { searchTerm } = req.query;

    let whereCondition = {};

    if (searchTerm) {
      const searchWords = (searchTerm as string).toLowerCase().split(" ");
      whereCondition = {
        [Op.or]: searchWords.map((word) => ({
          name: { [Op.iLike]: `%${word}%` },
        })),
      };
    }

    const restaurants = await Restaurant.findAll({
      where: whereCondition,
      attributes: ["id", "name"],
    });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  }
);

// @desc    Get a restaurant by ID
// @route   GET /restaurant/:restaurantId
const getRestaurantById = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;
    if (!restaurantId) {
      next(new ErrorResponse("Restaurant ID is required", 400));
      return;
    }

    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      next(new ErrorResponse("Restaurant not found", 404));
      return;
    }
    const restaurantImages = await RestaurantImage.findAll({
      where: { restaurant_id: restaurant.id }, // Match by restaurant_id
    });
    const restaurantVideos = await RestaurantVideo.findAll({
      where: { restaurant_id: restaurant.id }, // Match by restaurant_id
    });
    const restaurantLocations = await RestaurantLocation.findAll({
      where: { restaurant_id: restaurant.id },
    });

    // Attach the images to the restaurant object
    const restaurantWithImages = {
      ...restaurant.dataValues,
      restaurant_images: restaurantImages,
      restaurant_videos: restaurantVideos,
      restaurant_locations: restaurantLocations,
    };

    res.status(200).json(restaurantWithImages);
  }
);

// @desc    Get paginated restaurants filtered by given letters range
// @route   GET /range/:letters
const filterRestaurants = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    let { letters } = req.params;
    letters = letters.toUpperCase();
    const startCharCode = letters.charCodeAt(0);
    const endCharCode = letters.charCodeAt(2);

    const whereCondition = {
      [Op.and]: [
        Sequelize.literal(`ASCII(SUBSTRING(name, 1, 1)) >= ${startCharCode}`),
        Sequelize.literal(`ASCII(SUBSTRING(name, 1, 1)) <= ${endCharCode}`),
      ],
    };

    // pagination
    const currPage = parseInt(page as string, 10) || 1;
    const limitNeeded = parseInt(limit as string, 10) || 5;
    const startIndex = (currPage - 1) * limitNeeded;
    const endIndex = currPage * limitNeeded;

    const totalRestaurants = await Restaurant.count({
      where: whereCondition,
    });

    const pagination: any = {};
    if (endIndex < totalRestaurants) {
      pagination.next = {
        page: currPage + 1,
        limit: limitNeeded,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: currPage - 1,
        limit: limitNeeded,
      };
    }

    const totalPages = Math.ceil(totalRestaurants / limitNeeded);
    const restaurants = await Restaurant.findAll({
      where: whereCondition,
      include: [
        {
          model: RestaurantImage,
          attributes: ["id", "url"],
        },
        {
          model: RestaurantVideo,
          attributes: ["id", "url"],
        },
        {
          model: RestaurantLocation,
          attributes: ["id", "latitude", "longitude", "description"],
        },
        {
          model: RestaurantReview,
          attributes: ["id", "rating", "comment"],
        },
      ],
      order: ["name"],
      limit: limitNeeded,
      offset: startIndex,
    });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      pagination,
      totalPages,
      data: restaurants,
    });
  }
);

// @desc    Create a restaurant
// @route   POST /restaurants
const createRestaurant = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, openingHour, closingHour, isOpen } = req.body;

    const existingRestaurant = await Restaurant.findOne({ where: { name } });
    if (existingRestaurant) {
      return next(new ErrorResponse("Restaurant already exists", 400));
    }

    const restaurant = await Restaurant.create({
      name,
      opening_hour: openingHour,
      closing_hour: closingHour,
      is_open: isOpen,
    });
    return res.status(201).json({
      message: "Restaurant created successfully",
      restaurant,
    });
  }
);

// @desc    find nearby restaurants
// @route   GET /restaurants/radius/nearby?lat=lat&long=long&radius=radius
const findRestaurantsWithinRadius = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { lat, long, radius } = req.query;

    if (!lat || !long || !radius) {
      return next(
        new ErrorResponse("Latitude, longitude, and radius are required", 400)
      );
    }

    const restaurants = await Restaurant.findAll({
      include: [
        {
          model: RestaurantLocation,
          attributes: ["latitude", "longitude", "description"],
          where: literal(
            `ST_DWithin(
              geography(ST_MakePoint(${parseFloat(
                long.toString()
              )}, ${parseFloat(lat.toString())})),
              geography(ST_MakePoint(restaurant_locations.longitude, restaurant_locations.latitude)),
              ${parseInt(radius.toString(), 10)}
            )`
          ),
        },
      ],
    });

    res.status(200).json({ success: true, restaurants });
  }
);

// @desc    Find the count of nearby restaurants
// @route   GET /restaurants/radius/count?lat=lat&long=long&radius=radius
const findNearbyRestaurantsCount = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { lat, long, radius } = req.query;

    if (!lat || !long || !radius) {
      return next(
        new ErrorResponse("Latitude, longitude, and radius are required", 400)
      );
    }
    const count = await Restaurant.count({
      include: [
        {
          model: RestaurantLocation,
          attributes: ["latitude", "longitude", "description"],
          where: literal(
            `ST_DWithin(
              geography(ST_MakePoint(${parseFloat(
                long.toString()
              )}, ${parseFloat(lat.toString())})),
              geography(ST_MakePoint(restaurant_locations.longitude, restaurant_locations.latitude)),
              ${parseInt(radius.toString(), 10)}
            )`
          ),
        },
      ],
    });
    res.status(200).json({
      success: true,
      count,
    });
  }
);

// @desc    Get all restaurants and items with fuzzy search based on item_tags and restaurant_tags
// @route   GET restaurants/general-search?searchTerm=searchTerm
const generalSearch = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { searchTerm, page, limit } = req.query;

    let whereConditionRestaurants = {};
    let whereConditionItems = {};

    if (searchTerm) {
      const searchWords = (searchTerm as string).toLowerCase().split(" ");
      whereConditionRestaurants = {
        [Op.or]: searchWords.map((word) => ({
          "$restaurant_tags.name$": {
            [Op.iLike]: `%${word}%`,
          },
        })),
      };

      whereConditionItems = {
        [Op.or]: searchWords.map((word) => ({
          "$item_tags.name$": {
            [Op.iLike]: `%${word}%`,
          },
        })),
      };
    }

    const restaurants = await Restaurant.findAll({
      where: whereConditionRestaurants,
      include: [
        {
          model: RestaurantTag,
          attributes: ["id", "name"],
        },
      ],
    });

    const items = await Item.findAll({
      where: whereConditionItems,
      include: [
        {
          model: ItemTag,
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      restaurants: restaurants,
      items: items,
    });
  }
);

export {
  getRestaurants,
  createRestaurant,
  filterRestaurants,
  getRestaurantById,
  findRestaurantsWithinRadius,
  findNearbyRestaurantsCount,
  generalSearch,
  getAllRestaurantsForLiveSearch,
};
