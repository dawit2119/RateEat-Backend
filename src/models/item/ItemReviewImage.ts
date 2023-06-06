import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import { ItemReview } from "..";

@Table({
  tableName: "item_review_images",
  timestamps: true,
})
class ItemReviewImage extends Model<ItemReviewImage> {
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

  @ForeignKey(() => ItemReview)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  item_review_id!: string;

  // Relationships
  @BelongsTo(() => ItemReview)
  item_review!: ItemReview;
}

export default ItemReviewImage;
