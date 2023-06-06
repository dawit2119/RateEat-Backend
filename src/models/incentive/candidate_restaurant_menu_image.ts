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
  tableName: "candidate_restaurant_menu_images",
  timestamps: true,
})
class CandidateRestaurantMenuImage extends Model<CandidateRestaurantMenuImage> {
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

export default CandidateRestaurantMenuImage;
