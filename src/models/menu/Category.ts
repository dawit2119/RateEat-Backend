import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  HasMany,
  BelongsTo,
} from "sequelize-typescript";
import Menu from "./Menu";
import Item from "../item/Item";

@Table({
  tableName: "categories",
  timestamps: true,
})
class Category extends Model<Category> {
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

  @ForeignKey(() => Menu)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  menu_id!: string;

  @BelongsTo(() => Menu)
  menu!: Menu;

  @HasMany(() => Item, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  item!: Item[];
}

export default Category;
