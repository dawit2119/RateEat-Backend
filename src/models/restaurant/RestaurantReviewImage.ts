// RestaurantReviewImage.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import RestaurantReview from "./RestaurantReview";

@Table({
  tableName: "restaurant_review_images",
  timestamps: true,
})
class RestaurantReviewImage extends Model<RestaurantReviewImage> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  url!: string;

  @ForeignKey(() => RestaurantReview)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  restaurant_review_id!: string;

  // Relationships
  @BelongsTo(() => RestaurantReview, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  restaurant_review!: RestaurantReview;
  
}

export default RestaurantReviewImage;
