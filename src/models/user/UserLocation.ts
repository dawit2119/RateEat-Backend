import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import { User } from "..";

@Table({
  tableName: "user_locations",
  timestamps: true,
})
class UserLocation extends Model<UserLocation> {
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
  user_id!: number;

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

  // Relationships
  @BelongsTo(() => User, {
    foreignKey: "user_id",
    as: "user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user!: User;
}

export default UserLocation;
