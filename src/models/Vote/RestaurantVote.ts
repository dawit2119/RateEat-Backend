import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "../user/User";
import RestaurantReview from "../restaurant/RestaurantReview";

@Table({
  tableName: "restaurant_votes",
  timestamps: true,
})
class RestaurantVote extends Model<RestaurantVote> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  flag!: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  value!: number;

  @ForeignKey(() => User)
  voter_id!: string;

  @ForeignKey(() => RestaurantReview)
  restaurant_review_id!: string;

  @BelongsTo(() => User)
  voter!: User;

  @BelongsTo(() => RestaurantReview)
  restaurantReview!: RestaurantReview;
}

export default RestaurantVote;
