import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product.model";

// GET "/app/products"
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

// GET "/app/products/:productId"
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            throw { status: 400, message: "Item does not exist" };
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

