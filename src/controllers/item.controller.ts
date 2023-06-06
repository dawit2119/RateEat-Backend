import { NextFunction, Request, Response } from "express";
import {
  Category,
  Item,
  Menu,
  Ingredient,
  Restaurant,
  ItemTag,
  EatList,
} from "../models";
import { Op, literal } from "sequelize";
import asyncAwaitHandler from "../middlewares/async-handler";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Get all items with optional search term
// @route   GET /items
// @route   GET /restaurants/:restaurantId/items
// @route   GET /restaurants/:restaurantId/menu/categories/:categoryId/items
const getItems = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId, categoryId } = req.params;
    const { searchTerm, page, limit, maxPrice, minRating, fasting, sortedBy } =
      req.query;
    const { userId } = req.body;

    const currPage = parseInt(page as string, 10) || 1;
    const limitNeeded = parseInt(limit as string, 10) || 5;
    const startIndex = (currPage - 1) * limitNeeded;
    const endIndex = currPage * limitNeeded;

    let whereCondition = {};

    if (restaurantId) {
      if (categoryId) {
        whereCondition = { category_id: categoryId };
      } else {
        const categories = await Category.findAll({
          include: [
            {
              model: Menu,
              where: { restaurant_id: restaurantId },
            },
          ],
        });

        whereCondition = {
          category_id: { [Op.in]: categories.map((c) => c.id) },
        };
      }
    } else if (categoryId) {
      whereCondition = { category_id: categoryId };
    }

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

    if (maxPrice) {
      const maxPriceValue = parseInt(maxPrice as string, 10);
      whereCondition = {
        ...whereCondition,
        price: {
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

    if (fasting) {
      const fastingValue = fasting === "true";
      whereCondition = {
        ...whereCondition,
        fasting: fastingValue,
      };
    }

    let orderOptions = [];
    if (sortedBy as string) {
      const sortedByArray = (sortedBy as string)
        .split(",")
        .map((so) => so.trim());
      orderOptions = sortedByArray
        .map((sortOption) => {
          switch (sortOption) {
            case "popularity":
              return ["popularity_index", "DESC"];
            case "price":
              return ["price", "ASC"];
            default:
              return ["average_rating", "DESC"];
          }
        })
        .filter(Boolean);
    }
    const items = await Item.findAll({
      where: whereCondition,
      order: orderOptions,
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          required: false,
          attributes: ["id", "name"],
        },
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name"],
          where: { name: { [Op.ne]: "Extras" } },
          include: [
            {
              model: Menu,
              as: "menu",
              include: [
                {
                  model: Restaurant,
                  as: "restaurant",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
        {
          model: ItemTag,
          as: "item_tags",
          attributes: ["id", "name"],
        },
      ],
    });

    // increment popularity index by 1
    items.forEach(async (item) => {
      await item.incrementPopularity();
    });

    // pagination
    const totalItems = await Item.count({ where: whereCondition });
    const pagination: any = {};
    if (endIndex < totalItems) {
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
    const totalPages = Math.ceil(totalItems / limitNeeded);
    const itemWithFavStatus = items.map((item) => {
      return { ...item.toJSON(), isFavorite: false };
    });
    // check the item whether it is in the user's favorites or not
    if (!userId) {
      return res.status(200).json({
        success: true,
        count: items.length,
        pagination,
        totalPages,
        data: itemWithFavStatus,
      });
    }

    const userFavorites: EatList[] = await EatList.findAll({
      where: { user_id: userId },
      attributes: ["item_id"],
    });

    const itemIds = userFavorites.map((item) => item.get("item_id"));
    const itemsWithFavorites = items.map((item) => {
      if (itemIds.includes(item.id)) {
        return { ...item.toJSON(), isFavorite: true };
      }
      return { ...item.toJSON(), isFavorite: false };
    });

    return res.status(200).json({
      success: true,
      count: items.length,
      pagination,
      totalPages,
      data: itemsWithFavorites.slice(startIndex, endIndex),
    });
  }
);

// @desc Get all items for live search
// @route GET /items/all/search?searchTerm=searchTerm
const getAllItemsForLiveSearch = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { searchTerm } = req.query;

    let whereCondition = {};

    if (searchTerm) {
      const searchWords = (searchTerm as string).toLowerCase().split(" ");
      const regexSearch = searchWords.map((word) => `\\m${word}`).join("|");
      whereCondition = {
        [Op.or]: [
          literal(`LOWER("name") ~ '${regexSearch}'`),
          ...searchWords.map((word) => ({
            name: { [Op.iLike]: `%${word}%` },
          })),
        ],
      };
    }

    const result = await Item.findAndCountAll({
      where: whereCondition,
      attributes: ["id", "name"],
    });

    res.status(200).json({
      success: true,
      count: result.count,
      data: result.rows,
    });
  }
);

// @desc    Get all items with search term
// @route   GET api/v1/items
// @route   GET /items/
const getItemsByName = async (req: Request, res: Response) => {
  try {
    const { searchTerm, page } = req.query;
    const limit = 5;
    const offset = Number(page) * limit;

    let whereCondition = {};
    let items: Item[] = [];

    if (searchTerm) {
      const searchTermLowerCase = (searchTerm as string).toLowerCase();
      const searchWords = searchTermLowerCase.split(" ");

      whereCondition = {
        ...whereCondition,
        [Op.or]: searchWords.map((word) => ({
          name: {
            [Op.iLike]: `%${word}%`,
          },
        })),
      };
    }

    const result = await Item.findAndCountAll({
      where: whereCondition,
      order: [["average_rating", "DESC"]],
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
        },
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name"],
          include: [
            {
              model: Menu,
              as: "menu",
              include: [
                {
                  model: Restaurant,
                  as: "restaurant",
                },
              ],
            },
          ],
        },
      ],
      limit: limit,
      offset: offset,
    });
    items = result.rows;
    const totalItems = result.count;
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({ items, currentPage: page, totalPages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get a specific item by id
// @route   GET /items
// @route   GET /items/:itemId
// @route   GET /restaurants/:restaurantId/items/:itemId
// @route   GET /restaurants/:restaurantId/menu/categories/:categoryId/items/:itemId
// @route   GET /categories/:categoryId/items/:itemId
const getItemById = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemId } = req.params;
    const userId = req.body.userId;
    const item = await Item.findOne({
      where: { id: itemId },
      include: [
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
        },
        {
          model: Category,
          as: "categories",
          attributes: ["id", "name"],
          include: [
            {
              model: Menu,
              as: "menu",
              attributes: ["id"],
              include: [
                {
                  model: Restaurant,
                  as: "restaurant",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
      order: [["average_rating", "DESC"]],
    });

    if (!item) {
      return next(new ErrorResponse("Item not found", 404));
    }

    if (!userId) {
      return res.status(200).json({ ...item.toJSON(), isFavorite: false });
    }

    const inFavorite = await EatList.findOne({
      where: { user_id: userId, item_id: itemId },
    });

    if (inFavorite) {
      return res.status(200).json({ ...item.toJSON(), isFavorite: true });
    }
  }
);

// @desc    create item for specific category
// @route   POST /restaurants/:restaurantId/menu/categories/:categoryId/items
// @route   POST /categories/:categoryId/items
// @route   POST /items
const createItem = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId } = req.params;
      const { name, price } = req.body;
  
      const item = await Item.create({
        name,
        price,
        category_id: categoryId,
        ...req.body,
      });

      // obtain restaurant from item
      const category = await Category.findOne({
        where: { id: categoryId },
        attributes: ["menu_id"],
      });
      const menu = await Menu.findOne({
        where: { id: category.menu_id },
        attributes: ["restaurant_id"],
      });
      const restaurant = await Restaurant.findOne({
        where: { id: menu.restaurant_id },
      });

      // find the total number of items in a restaurant
      const categories = await Category.findAll({
        where: { menu_id: menu.id },
      });
      let totalItemsCount = 0;
      for (let index = 0; index < categories.length; index++) {
        const element = categories[index];
        const itemsCount = await Item.count({where: {category_id: element.id}})
        totalItemsCount += itemsCount
      }

      // calculate new average price and save in database
      const prevAveragePrice = restaurant.average_price
      const newPrice = ((prevAveragePrice * totalItemsCount) + parseFloat(price)) / (totalItemsCount + 1)
      restaurant.average_price = parseFloat(newPrice.toFixed(2));
      await restaurant.save()

      return res.status(201).json({ item });
    } catch (error) {
      return next(error)
    }
  }
);

// @desc    Update item
// @route   PUT /items/:itemId
// @route   PUT /restaurants/:restaurantId/menu/categories/:categoryId/items/:itemId
// @route   PUT /categories/:categoryId/items/:itemId
const updateItem = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemId } = req.params;
    const { name, description, price } = req.body;
    const item = await Item.findByPk(itemId);

    if (!item) {
      return next(new ErrorResponse("Item not found", 404));
    }

    item.name = name;
    item.description = description;
    item.price = price;
    await item.save();

    return res.status(200).json({ item });
  }
);

// @desc    Delete item
// @route   DELETE /items/:itemId
// @route   DELETE /restaurants/:restaurantId/menu/categories/:categoryId/items/:itemId
// @route   DELETE /categories/:categoryId/items/:itemId
const deleteItem = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemId } = req.params;
    const item = await Item.findByPk(itemId);

    if (!item) {
      return next(new ErrorResponse("Item not found", 404));
    }
    await item.destroy();
    return res.status(200).json({ message: "Item deleted successfully" });
  }
);

// @desc    Get recommended items for a specific item
// @route   GET /items/:itemId/recommendations
const getItemRecommendations = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemId } = req.params;
    const { page = 1, limit = 4 } = req.query;

    const currentPage = parseInt(page as string, 10) || 1;
    const limitNeeded = parseInt(limit as string, 10) || 4;
    const offset = (currentPage - 1) * limitNeeded;

    const selectedItem = await Item.findByPk(itemId, {
      include: [
        {
          model: Category,
          include: [
            {
              model: Menu,
              include: [Restaurant],
            },
          ],
        },
        {
          model: ItemTag,
          attributes: ["name"],
        },
      ],
    });

    if (!selectedItem) {
      return next(new ErrorResponse("Item not found", 404));
    }

    const categoryId = selectedItem.category_id;

    const categoryRecommendations = await Item.findAndCountAll({
      where: { category_id: categoryId },
      include: [
        {
          model: Ingredient,
          attributes: ["id", "name"],
        },
        {
          model: ItemTag,
          attributes: ["id", "name"],
        },
        {
          model: Category,
          attributes: ["id", "name"],
          include: [
            {
              model: Menu,
              attributes: ["id"],
              include: [
                {
                  model: Restaurant,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
      order: [
        ["popularity_index", "DESC"],
        ["average_rating", "DESC"],
      ],
      limit: limitNeeded,
      offset,
    });

    const tagNames = selectedItem.item_tags.map((tag) => tag.name);

    const tagRecommendations = await Item.findAndCountAll({
      where: {
        id: {
          [Op.ne]: itemId,
        },
        [Op.and]: literal(`EXISTS (
          SELECT 1
          FROM "item_tags"
          WHERE "item_tags"."item_id" = "Item"."id"
          AND "item_tags"."name" IN (${tagNames
            .map((name) => `'${name}'`)
            .join(",")})
        )`),
      },
      include: [
        {
          model: Ingredient,
          attributes: ["id", "name"],
        },
        {
          model: ItemTag,
          attributes: ["id", "name"],
        },
        {
          model: ItemTag,
          attributes: ["name"],
        },
        {
          model: Category,
          attributes: ["id", "name"],
          include: [
            {
              model: Menu,
              attributes: ["id"],
              include: [
                {
                  model: Restaurant,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
      order: [
        ["popularity_index", "DESC"],
        ["average_rating", "DESC"],
      ],
      limit: limitNeeded,
      offset,
    });

    const recommendations = [
      ...categoryRecommendations.rows,
      ...tagRecommendations.rows,
    ].filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

    res.status(200).json({
      success: true,
      totalItems: recommendations.length,
      recommendations: recommendations.slice(0, +limitNeeded),
    });
  }
);

export {
  getItems,
  getItemById,
  createItem,
  deleteItem,
  updateItem,
  getItemsByName,
  getItemRecommendations,
  getAllItemsForLiveSearch,
};
