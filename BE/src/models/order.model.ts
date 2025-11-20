import { DataTypes, Model, Optional } from "sequelize";
import { OrderStatuses } from "../enums/order-enums.enum";
import sequelize from "../config/database";

interface OrderAttributes {
    id: number;
    userId: number;
    totalAmount: number;
    status: OrderStatuses;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

export class Order
    extends Model<OrderAttributes, OrderCreationAttributes>
    implements OrderAttributes
{
    public id!: number;
    public userId!: number;
    public totalAmount!: number;
    public status!: OrderStatuses;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: "Orders",
        modelName: "Order",
    }
);
