import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Order } from "./order.model";
import { Product } from "./product.model";

interface OrderProductAttributes {
    id: number;
    orderId: number;
    productId: number;
    purchasePrice: number;
    quantity: number;
}

interface OrderProductCreationAttributes
    extends Optional<OrderProductAttributes, "id"> {}

export class OrderProduct
    extends Model<OrderProductAttributes, OrderProductCreationAttributes>
    implements OrderProductAttributes
{
    public id!: number;
    public orderId!: number;
    public productId!: number;
    public purchasePrice!: number;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

OrderProduct.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        orderId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        purchasePrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        sequelize,
        tableName: "OrderProducts",
        modelName: "OrderProduct",
        indexes: [
            {
                unique: true,
                fields: ["orderId", "productId"],
            },
        ],
    }
);
