import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { ProductCategory } from "./category.model";

interface ProductAttributes {
    id: number;
    productCategoryId: number;
    name: string;
    description: string;
    supplyPrice: number;
    margin: number; //percent
    finalPrice: number;
    imageUrl: string;
    stock: number; // quantity in stock
    starReview: number;
    reviewsCount: number;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, "id" | "finalPrice" | "imageUrl" | "stock" | "starReview"> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public productCategoryId!: number;
    public name!: string;
    public description!: string;
    public supplyPrice!: number;
    public margin!: number;
    public finalPrice!: number;
    public imageUrl!: string;
    public stock!: number;
    public starReview!: number;
    public reviewsCount!: number;

    public ProductCategory?: ProductCategory;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        productCategoryId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: ProductCategory,
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        supplyPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        margin: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        finalPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "https://s13emagst.akamaized.net/products/92844/92843211/images/res_dbe5508e65ad2167a08d5b3d0dc6b4fd.jpg",
        },
        stock: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        starReview: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: null,
            allowNull: true,
            validate: { min: 1, max: 5 },
        },
        reviewsCount: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "Products",
        modelName: "Product",
    }
);

Product.beforeValidate((product: Product) => {
    product.stock = product.stock || 0;
    product.finalPrice = product.supplyPrice + product.supplyPrice * (product.margin / 100);
});
