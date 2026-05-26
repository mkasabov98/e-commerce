import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface DiscountCodeAttributes {
    id: number;
    code: string;
    userId: number;
    discountPercentage: number;
    expirationDate: Date;
    used: boolean;
    orderId: number | null;
}

interface DiscountCodeCreationAttributes extends Optional<DiscountCodeAttributes, "id" | "used" | "orderId"> {}

export class DiscountCode extends Model<DiscountCodeAttributes, DiscountCodeCreationAttributes> implements DiscountCodeAttributes {
    public id!: number;
    public code!: string;
    public userId!: number;
    public discountPercentage!: number;
    public expirationDate!: Date;
    public used!: boolean;
    public orderId!: number | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

DiscountCode.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        discountPercentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        expirationDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        used: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        orderId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        sequelize,
        tableName: "DiscountCodes",
        modelName: "DiscountCode",
    }
);
