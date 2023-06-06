import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    PrimaryKey,
  } from "sequelize-typescript";
  import Restaurant from "../restaurant/Restaurant";
import User from "../user/User";
  
  @Table({
    tableName: "updated_menu_images",
    timestamps: true,
  })
  class UpdatedMenuImage extends Model<UpdatedMenuImage> {
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

    @ForeignKey(() => User)
    @Column({
      type: DataType.INTEGER,
      allowNull: false
    })
    user_id!: string;
  
    @ForeignKey(() => Restaurant)
    @Column({
      type: DataType.INTEGER,
      allowNull: false
    })
    restaurant_id!: string;
  }
  
  export default UpdatedMenuImage;
  