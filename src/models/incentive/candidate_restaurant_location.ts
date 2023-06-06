import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from "sequelize-typescript";
import CandidateRestaurant from "./candidate_restaurant"; // Import the CandidateRestaurant model

@Table({
  tableName: "candidate_restaurant_locations",
  timestamps: true,
})
class CandidateRestaurantLocation extends Model<CandidateRestaurantLocation> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.FLOAT, 
    allowNull: false,
  })
  latitude!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  longitude!: number;

  @Column({
    type: DataType.STRING, 
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => CandidateRestaurant)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  candidate_restaurant_id!: string;

  @BelongsTo(() => CandidateRestaurant,{
    foreignKey: "candidate_restaurant_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  candidateRestaurant!: CandidateRestaurant; 

}

export default CandidateRestaurantLocation;
