import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  BelongsToMany,
  ForeignKey,
} from "sequelize-typescript";
import Item from "./Item";

@Table({
  tableName: "ingredients",
  timestamps: true,
})
class Ingredient extends Model<Ingredient> {
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
 
}

export default Ingredient;
