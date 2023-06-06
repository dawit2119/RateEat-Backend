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
import Category from "../menu/Category";
import ItemReview from "./ItemReview";
import ItemImage from "./ItemImage";
import ItemVideo from "./ItemVideo";
import Ingredient from "./Ingredient";
import ItemTag from "./ItemTag";
import EatList from "../user/EatList";

@Table({
  tableName: "items",
  timestamps: true,
})
class Item extends Model<Item> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING(50),
    defaultValue: "",
  })
  name!: string;

  @Column({
    type: DataType.STRING(255),
    defaultValue: "",
  })
  description!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  number_of_reviews!: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  average_rating!: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  price!: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
  })
  category_id!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  fasting!: boolean;

  // Relationships
  @BelongsTo(() => Category, {
    onDelete: "CASCADE", 
  })
  categories!: Category;

  @HasMany(() => ItemReview, {
    onDelete: "CASCADE",
  })
  item_reviews!: ItemReview[];

  @HasMany(() => ItemImage, {
    onDelete: "CASCADE",
  })
  item_images!: ItemImage[];

  @HasMany(() => ItemVideo, {
    onDelete: "CASCADE",
  })
  item_videos!: ItemVideo[];

  @HasMany(() => ItemTag, {
    onDelete: "CASCADE",
  })
  item_tags!: ItemTag[];

  @HasMany(() => Ingredient, {
    onDelete: "CASCADE",
  })
  ingredients!: Ingredient[];

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  popularity_index!: number;

  // method to increment item popularity number by 1
  async incrementPopularity() {
    this.popularity_index += 1;
    await this.save();
  }

}

export default Item;
