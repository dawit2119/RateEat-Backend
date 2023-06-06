import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  HasMany,
} from "sequelize-typescript";
import { Role } from "..";
import jwt from "jsonwebtoken";
import Incentive from "../incentive/incentive";

@Table({
  tableName: "users",
  timestamps: true,
})
class User extends Model<User> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING(50),
  })
  telegram_id!: string;

  @Column({
    type: DataType.STRING(50),
  })
  facebook_id!: string;

  @Column({
    type: DataType.STRING(50),
  })
  first_name!: string;

  @Column({
    type: DataType.STRING(50),
  })
  last_name!: string;

  @Column({
    type: DataType.DATE,
    defaultValue: "1970-01-01",
  })
  date_of_birth!: Date;

  @Column({
    type: DataType.STRING(50),
    unique: true,
  })
  email!: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  role_id!: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  phone_number!: string;

  @Column({
    type: DataType.STRING(255),
  })
  image!: string;

  @HasMany(() => Incentive, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })

  // Instance method to sign JWT and return
  getSignedJwtToken() {
    return jwt.sign(
      { id: this.id },
      process.env.JWT_SECRET || "this is the secret",
      {
        expiresIn: process.env.JWT_EXPIRE || "30d",
      }
    );
  }
}

export default User;
