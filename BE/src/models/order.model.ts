import { DataTypes, Model, Optional } from "sequelize";
import { OrderStatuses } from "../enums/order-enums.enum";
import sequelize from "../config/database";

interface OrderAttributes {
    id: number;
    userId: number;
    shippingCountry: string;
    shippingCity: string;
    shippingAddress: string; //address snapshot
    totalAmount: number;
    status: OrderStatuses;
    stripePaymentIntentId: string;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public userId!: number;
    public shippingCountry!: string;
    public shippingCity!: string;
    public shippingAddress!: string;
    public totalAmount!: number;
    public status!: OrderStatuses;
    public stripePaymentIntentId!: string;

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
        shippingCountry: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shippingCity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shippingAddress: {
            type: DataTypes.STRING,
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
        stripePaymentIntentId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Orders",
        modelName: "Order",
    }
);
