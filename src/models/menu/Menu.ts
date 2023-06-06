import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  PrimaryKey,
  BelongsTo,
} from "sequelize-typescript";

import { Restaurant, Item, Category } from "..";

@Table({
  tableName: "menus",
  timestamps: true,
})
class Menu extends Model<Menu> {
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

  // Relationships
  @BelongsTo(() => Restaurant)
  restaurant!: Restaurant;
  
  @HasMany(() => Category, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  category!: Category[];
}

export default Menu;
