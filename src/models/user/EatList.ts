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
import Item from "../item/Item";
import User from "./User";

@Table({
  tableName: "eat_lists",
  timestamps: true,
})
class EatList extends Model<EatList> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: Date;

  @ForeignKey(() => Item)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  item_id!: string;

  // Relationships
  @BelongsTo(() => User, {
    onDelete: "CASCADE",
  })
  user!: User;

  @BelongsTo(() => Item, {
    onDelete: "CASCADE",
  })
  item!: Item;
}

export default EatList;
