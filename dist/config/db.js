"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.join(__dirname, "../../.env"),
});
console.log(process.env.NODE_ENV);
const env = process.env.NODE_ENV || "development";
const config_1 = __importDefault(require("./config"));
const configFile = config_1.default[env];
const models_1 = require("../models");
const sequelize = new sequelize_typescript_1.Sequelize({
    database: configFile.database,
    dialect: "postgres",
    username: configFile.username,
    password: configFile.password,
    host: configFile.host,
    models: [
        models_1.User,
        models_1.Restaurant,
        models_1.RestaurantPhoneNumber,
        models_1.Role,
        models_1.Category,
        models_1.Item,
        models_1.ItemReview,
        models_1.ItemImage,
        models_1.ItemVideo,
        models_1.UserLocation,
        models_1.RestaurantLocation,
        models_1.ItemReviewImage,
        models_1.ItemReviewVideo,
        models_1.RestaurantReview,
        models_1.RestaurantReviewImage,
        models_1.RestaurantReviewVideo,
        models_1.Menu,
        models_1.ItemTag,
        models_1.RestaurantImage,
        models_1.RestaurantVideo,
        models_1.RestaurantTag,
        models_1.EatList,
        models_1.Ingredient,
        models_1.Otp,
        models_1.RestaurantAdditionalService,
        models_1.Incentive,
        models_1.CandidateRestaurant,
        models_1.CandidateRestaurantMenuImage,
        models_1.CandidateRestaurantLicenseImage,
        models_1.CandidateRestaurantTag,
        models_1.CandidateRestaurantLocation,
        models_1.ItemVote,
        models_1.RestaurantVote,
        models_1.UpdatedMenuImage
    ],
    logging: false,
});
exports.default = sequelize;
