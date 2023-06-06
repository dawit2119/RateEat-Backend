import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  HasMany,
  HasOne,
} from "sequelize-typescript";
import User from "../user/User";
import CandidateRestaurantTag from "./candidate_restaurant_tag";
import CandidateRestaurantLocation from "./candidate_restaurant_location";
import CandidateRestaurantMenuImage from "./candidate_restaurant_menu_image";
import CandidateRestaurantLicenseImage from "./candidate_restaurant_license_image";

@Table({
  tableName: "candidate_restaurants",
  timestamps: true,
})
class CandidateRestaurant extends Model<CandidateRestaurant> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING(128),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TIME,
    defaultValue: "08:00:00",
  })
  opening_hour!: Date;

  @Column({
    type: DataType.TIME,
    defaultValue: "22:00:00",
  })
  closing_hour!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_open!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_approved!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_rejected!: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  user_id!: string;

  @HasMany(() => CandidateRestaurantTag, {
    onDelete: "CASCADE",
  })
  candidate_restaurant_tags!: CandidateRestaurantTag[];

  @HasMany(() => CandidateRestaurantLocation, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  candidate_restaurant_locations!: CandidateRestaurantLocation[];

  @HasMany(() => CandidateRestaurantMenuImage, {
    onDelete: "CASCADE",
  })
  candidate_restaurant_menu_images!: CandidateRestaurantMenuImage[];

  @HasOne(() => CandidateRestaurantLicenseImage, {
    onDelete: "CASCADE",
  })
  candidate_restaurant_license!: CandidateRestaurantLicenseImage[];
}


export default CandidateRestaurant;
