import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
} from "sequelize-typescript";
import Restaurant from "./Restaurant";
import User from "../user/User";
import RestaurantReviewImage from "./RestaurantReviewImage";
import RestaurantReviewVideo from "./RestaurantReviewVideo";

@Table({
  tableName: "restaurant_reviews",
  timestamps: true,
})
class RestaurantReview extends Model<RestaurantReview> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  restaurant_id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  user_id!: string;


  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  rating!: number;

  @Column({
    type: DataType.STRING(255),
  })
  comment?: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  up_vote!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  down_vote!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  visibility!: boolean;

  // Relationships
  @BelongsTo(() => Restaurant, {
    foreignKey: "restaurant_id",
    as: "restaurant",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  restaurant!: Restaurant;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => RestaurantReviewImage, {
    onDelete: "CASCADE",
  })
  restaurant_review_images!: RestaurantReviewImage[];

  @HasMany(() => RestaurantReviewVideo, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  restaurant_review_videos!: RestaurantReviewVideo[];
}

export default RestaurantReview;
