import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface AddressAttributes {
    id: number;
    userId: number;
    country: string;
    city: string;
    address: string;
}

interface AddressCreationAttributes extends Optional<AddressAttributes, "id"> {}

export class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
    public id!: number;
    public userId!: number;
    public country!: string;
    public city!: string;
    public address!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Address.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Addresses",
        modelName: "Address",
    }
);
