import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface CartProductAttributes {
    id: number;
    cartId: number;
    productId: number;
    quantity: number;
}

interface CartProductCreationAttributes
    extends Optional<CartProductAttributes, "id"> {}

export class CartProduct
    extends Model<CartProductAttributes, CartProductCreationAttributes>
    implements CartProductAttributes
{
    public id!: number;
    public cartId!: number;
    public productId!: number;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

CartProduct.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        cartId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1

            }
        },
    },
    {
        sequelize,
        tableName: "CartProducts",
        modelName: "CartProduct",
        indexes: [
            {
                unique: true,
                fields: ["cartId", "productId"]
            }
        ]
    }
);
