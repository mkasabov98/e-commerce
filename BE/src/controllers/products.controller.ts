import { NextFunction, Request, Response } from "express";
import { Product, ProductCreationAttributes } from "../models/product.model";

// GET "/api/products"
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

// GET "/api/products/:id"
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

// POST "/api/products"
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const body: ProductCreationAttributes = req.body;
    try {
        const newProduct = await Product.create(body);
        res.status(201).json({ newProduct });
    } catch (error) {
        next(error);
    }
};

// DELETE "/api/products/:id"
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    try {
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
