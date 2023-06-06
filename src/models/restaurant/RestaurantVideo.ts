import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import Restaurant from "./Restaurant";

@Table({
  tableName: "restaurant_videos",
  timestamps: true,
})
class RestaurantVideo extends Model<RestaurantVideo> {
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

  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  restaurant_id!: string;

  // Relationships
  @BelongsTo(() => Restaurant, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  restaurant!: Restaurant;
}

export default RestaurantVideo;
