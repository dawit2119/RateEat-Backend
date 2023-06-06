import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
} from "sequelize-typescript";
import User from "../user/User";

@Table({
  tableName: "incentives",
  timestamps: true,
})
class Incentive extends Model<Incentive> {
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
    allowNull: false
  })
  user_id!: string;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  all_time_total!: number;

  @Column({
    type: DataType.DOUBLE,
    defaultValue: 0,
  })
  current_total!: number;
}

export default Incentive;
