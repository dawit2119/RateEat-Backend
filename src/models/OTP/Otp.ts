import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
} from "sequelize-typescript";
import User from "../user/User";

@Table({
  tableName: "otps",
  timestamps: true,
})
class Otp extends Model<Otp> {
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
  })
  user_id!: string;

  @Column({
    type: DataType.STRING(14),
    allowNull: false,
    unique: true,
  })
  phoneNumber!: string;

  @Column({
    type: DataType.STRING(6),
    allowNull: false,
  })
  otpCode!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: new Date(Date.now() + 3600 * 1000), // expires after 3600 seconds
  })
  expires_at!: Date;
}

export default Otp;
