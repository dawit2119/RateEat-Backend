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
import ItemReview from "../item/ItemReview";

@Table({
  tableName: "item_votes",
  timestamps: true,
})
class ItemVote extends Model<ItemVote> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  // Flag: true = upvote, false = downvote
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  flag!: boolean;

  // Value: 1 = upvote, -1 = downvote
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  value!: number;

  @ForeignKey(() => User)
  voter_id!: string;

  @ForeignKey(() => ItemReview)
  item_review_id!: string;

  @BelongsTo(() => User)
  voter!: User;

  @BelongsTo(() => ItemReview)
  itemReview!: ItemReview;
}

export default ItemVote;
