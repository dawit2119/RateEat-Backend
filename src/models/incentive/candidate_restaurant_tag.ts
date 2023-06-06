import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import CandidateRestaurant from "./candidate_restaurant"; // Import the CandidateRestaurant model

@Table({
  tableName: "candidate_restaurant_tags",
  timestamps: true,
})
class CandidateRestaurantTag extends Model<CandidateRestaurantTag> {
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

  @ForeignKey(() => CandidateRestaurant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  candidate_restaurant_id!: string;

  // Relationships
  @BelongsTo(() => CandidateRestaurant, {
    foreignKey: "candidate_restaurant_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  candidateRestaurant!: CandidateRestaurant;
}

export default CandidateRestaurantTag;
