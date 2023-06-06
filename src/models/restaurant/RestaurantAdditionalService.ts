import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Restaurant from './Restaurant'; 

@Table({
    tableName: "restaurant_additional_services",
    timestamps: true,
})
class RestaurantAdditionalService extends Model<RestaurantAdditionalService> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  additional_service!: string;

  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  restaurant_id!: string;

  // Relationships
  @BelongsTo(() => Restaurant, {
    foreignKey: "restaurant_id",
    as: "restaurant",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  restaurant!: Restaurant;
}

export default RestaurantAdditionalService