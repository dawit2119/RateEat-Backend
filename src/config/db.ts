import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(__dirname, "../../.env"),
});
console.log(process.env.NODE_ENV);
const env = process.env.NODE_ENV || "development";
import configs from "./config";
const configFile = configs[env];

import {
  User,
  Restaurant,
  RestaurantPhoneNumber,
  Role,
  Category,
  Item,
  ItemReview,
  ItemImage,
  ItemVideo,
  UserLocation,
  RestaurantLocation,
  ItemReviewImage,
  ItemReviewVideo,
  RestaurantReview,
  RestaurantReviewImage,
  RestaurantReviewVideo,
  Menu,
  ItemTag,
  RestaurantImage,
  RestaurantVideo,
  RestaurantTag,
  EatList,
  Ingredient,
  Otp,
  RestaurantAdditionalService,
  Incentive,
  CandidateRestaurant,
  CandidateRestaurantMenuImage,
  CandidateRestaurantLicenseImage,
  CandidateRestaurantTag,
  CandidateRestaurantLocation,
  ItemVote,
  RestaurantVote,
  UpdatedMenuImage,
} from "../models";

const sequelize: Sequelize = new Sequelize({
  database: configFile.database,
  dialect: "postgres",
  username: configFile.username,
  password: configFile.password,
  host: configFile.host,
  models: [
    User,
    Restaurant,
    RestaurantPhoneNumber,
    Role,
    Category,
    Item,
    ItemReview,
    ItemImage,
    ItemVideo,
    UserLocation,
    RestaurantLocation,
    ItemReviewImage,
    ItemReviewVideo,
    RestaurantReview,
    RestaurantReviewImage,
    RestaurantReviewVideo,
    Menu,
    ItemTag,
    RestaurantImage,
    RestaurantVideo,
    RestaurantTag,
    EatList,
    Ingredient,
    Otp,
    RestaurantAdditionalService,
    Incentive,
    CandidateRestaurant,
    CandidateRestaurantMenuImage,
    CandidateRestaurantLicenseImage,
    CandidateRestaurantTag,
    CandidateRestaurantLocation,
    ItemVote,
    RestaurantVote,
    UpdatedMenuImage
  ],
  logging: false,
});

export default sequelize;
