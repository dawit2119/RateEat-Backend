import {
  Table,
  Model,
  DataType,
  Column,
  PrimaryKey,
} from "sequelize-typescript";

@Table({
  tableName: "roles",
  timestamps: true,
})
class Role extends Model<Role> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name!: string;
}

export default Role;
