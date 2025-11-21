import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authenticate.middleware";
import { Product, ProductCreationAttributes } from "../models/product.model";
import { UserRoles } from "../enums/user-enums.enum";

const isAdmin = (user: { role: UserRoles }) => {
    return user.role === UserRoles.Admin;
};

// POST "/app/admin/products/create"
export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const body: ProductCreationAttributes = req.body;
    try {
        if (!isAdmin(req.user)) {
            throw { status: 401, message: "Unauthorized" };
        }
        const newProduct = await Product.create(body);
        res.status(201).json({ newProduct });
    } catch (error) {
        next(error);
    }
};

// DELETE "/app/admin/products/delete/:productId"
export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    try {
        if (!isAdmin(req.user)) {
            throw { status: 401, message: "Unauthorized" };
        }
        const product = await Product.findByPk(productId);
        if (!product) {
            throw { status: 404, message: "Product not found" };
        }
        await product.destroy();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        next(error);
    }
};
