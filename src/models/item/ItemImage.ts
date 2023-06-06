import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import { Item, User } from "..";

@Table({
  tableName: "item_images",
  timestamps: true,
})
class ItemImage extends Model<ItemImage> {
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

  @ForeignKey(() => Item)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  item_id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  user_id?: string;

  // Relationships
  @BelongsTo(() => Item)
  item!: Item;

  @BelongsTo(() => User)
  user?: User;
}

export default ItemImage;
