import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from "sequelize-typescript";
import Restaurant from "./Restaurant";

@Table({
  tableName: "restaurant_phone_numbers",
  timestamps: true,
})
class RestaurantPhoneNumber extends Model<RestaurantPhoneNumber> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.STRING(24),
    allowNull: false,
  })
  restaurant_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone_number!: string;

  // Relationships
  @BelongsTo(() => Restaurant, {
    foreignKey: "restaurant_id",
    as: "restaurant",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  restaurant!: Restaurant;

}

export default RestaurantPhoneNumber;
