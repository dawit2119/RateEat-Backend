// ItemTag.ts

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import { Item } from "..";

@Table({
  tableName: "item_tags",
  timestamps: true,
})
class ItemTag extends Model<ItemTag> {
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
  name!: string;

  @ForeignKey(() => Item)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  item_id!: string;

  // Relationships
  @BelongsTo(() => Item)
  item!: Item;
}

export default ItemTag;
