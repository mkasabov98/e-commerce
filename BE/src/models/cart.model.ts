import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface CartAttributes {
    id: number;
    userId: number;
}

interface CartCreationAttributes extends Optional<CartAttributes, "id"> {}

export class Cart
    extends Model<CartAttributes, CartCreationAttributes>
    implements CartAttributes
{
    public id!: number;
    public userId!: number;

    public readonly createadAt!: Date;
    public readonly updatedAt!: Date;
}

Cart.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Carts",
        modelName: "Cart",
    }
);
