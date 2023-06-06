import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  HasMany,
  HasOne,
} from "sequelize-typescript";
import User from "../user/User";
import Menu from "../menu/Menu";
import RestaurantReview from "./RestaurantReview";
import RestaurantLocation from "./RestaurantLocation";
import RestaurantImage from "./RestaurantImage";
import RestaurantVideo from "./RestaurantVideo";
import RestaurantPhoneNumber from "./RestaurantPhoneNumber";
import RestaurantAdditionalService from "./RestaurantAdditionalService";
import RestaurantTag from "./RestaurantTag";

@Table({
  tableName: "restaurants",
  timestamps: true,
})
class Restaurant extends Model<Restaurant> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING(128),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TIME,
    defaultValue: "10:00:00",
  })
  opening_hour!: Date;

  @Column({
    type: DataType.TIME,
    defaultValue: "22:00:00",
  })
  closing_hour!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_open!: boolean;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  average_price!: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  average_rating!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  number_of_reviews!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  popularity_index: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  user_id!: string;

  @HasOne(() => Menu, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  menu!: Menu[];

  @HasMany(() => RestaurantReview, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  restaurant_reviews!: RestaurantReview[];

  @HasMany(() => RestaurantImage, {
    onDelete: "CASCADE",
  })
  restaurant_images!: RestaurantImage[];

  @HasMany(() => RestaurantVideo, {
    onDelete: "CASCADE",
  })
  restaurant_videos!: RestaurantVideo[];

  @HasMany(() => RestaurantTag, {
    onDelete: "CASCADE",
  })
  restaurant_tags!: RestaurantTag[];

  @HasMany(() => RestaurantLocation, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  restaurant_locations!: RestaurantLocation[];

  @HasMany(() => RestaurantPhoneNumber, {
    onDelete: "CASCADE",
  })
  restaurant_phone_numbers!: RestaurantPhoneNumber[];

  @HasMany(() => RestaurantAdditionalService, {
    onDelete: "CASCADE",
  })
  restaurant_additional_services!: RestaurantAdditionalService[];

  async incrementPopularity() {
    this.popularity_index++;
    await this.save();
  }
}

export default Restaurant;
