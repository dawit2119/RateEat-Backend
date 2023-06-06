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
import { Item, User, ItemReviewImage, ItemReviewVideo } from "..";

@Table({
  tableName: "item_reviews",
  timestamps: true,
})
class ItemReview extends Model<ItemReview> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => Item)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  item_id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id!: string;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  rating!: number;

  @Column({
    type: DataType.STRING(255),
    defaultValue: "",
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
    allowNull: false,
    defaultValue: false,
  })
  visibility!: boolean;

  // Relationships
  @BelongsTo(() => Item)
  item!: Item;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => ItemReviewImage, {
    onDelete: "CASCADE",
  })
  item_review_images!: ItemReviewImage[];

  @HasMany(() => ItemReviewVideo, {
    onDelete: "CASCADE",
  })
  item_review_videos!: ItemReviewVideo[];
}

export default ItemReview;
