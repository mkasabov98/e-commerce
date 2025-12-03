import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface productCategoryAttributes {
    id: number;
    categoryName: string;
}

interface ProductCategoryCreationAttributes extends Optional<productCategoryAttributes, "id"> {}

export class ProductCategory extends Model<productCategoryAttributes, ProductCategoryCreationAttributes> implements productCategoryAttributes {
    public id!: number;
    public categoryName!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProductCategory.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: "ProductCategories",
        modelName: "ProductCategory",
    }
);
