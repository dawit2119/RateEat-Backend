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
  tableName: "restaurant_locations",
  timestamps: true,
})
class RestaurantLocation extends Model<RestaurantLocation> {
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

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  latitude!: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  longitude!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  description?: string;

  // Relationships
  @BelongsTo(() => Restaurant, {
    foreignKey: "restaurant_id",
    as: "restaurant",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  restaurant!: Restaurant;
}

export default RestaurantLocation;
