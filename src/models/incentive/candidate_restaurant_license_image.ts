import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
} from "sequelize-typescript";
import CandidateRestaurant from "./candidate_restaurant";

@Table({
  tableName: "candidate_restaurant_license_images",
  timestamps: true,
})
class CandidateRestaurantLicenseImage extends Model<CandidateRestaurantLicenseImage> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url!: string;

  @ForeignKey(() => CandidateRestaurant)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  candidate_restaurant_id!: string;
}

export default CandidateRestaurantLicenseImage;
