import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authenticate.middleware";
import { UserRoles } from "../enums/user-enums.enum";
import { Cart } from "../models/cart.model";
import { CartProduct } from "../models/cartProduct.model";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
import { OrderStatuses } from "../enums/order-enums.enum";
import sequelize from "../config/database";
import { OrderProduct } from "../models/orderProduct.model";
import { Address } from "../models/address.model";

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const addressId = req.body.addressId;

    try {
        if (req.user?.role !== UserRoles.User) throw { status: 401, message: "Unauthorized" };
        const userCart = await Cart.findOne({ where: { userId: user.id } });
        if (!userCart) throw { status: 400, message: "No cart found." };

        const address = await Address.findByPk(addressId);
        if (!address) throw { status: 400, message: "No matching address" };

        const productsInCart = await CartProduct.findAll({
            where: { cartId: userCart.id },
            include: [
                {
                    model: Product,
                    as: "Product",
                    attributes: ["stock", "finalPrice", "name"],
                },
            ],
        });

        if (productsInCart.length === 0) throw { status: 400, message: "Cart is empty" };

        const totalAmount = productsInCart.reduce((acc, x) => acc + x.quantity * x.Product.finalPrice, 0);

        const errors: string[] = [];
        productsInCart.forEach((x) => {
            if (x.quantity > x.Product.stock) {
                errors.push(
                    `Currently we do not have ${x.quantity} units of ${x.Product.name} in stock. We have ${x.Product.stock} units in stock of that item.`
                );
            }
        });
        if (errors.length) {
            return res.status(400).json({ errors });
        }

        const transaction = await sequelize.transaction();
        try {
            const order = await Order.create(
                {
                    userId: user.id,
                    status: OrderStatuses.Paid,
                    totalAmount: totalAmount,
                    shippingCountry: address.country,
                    shippingCity: address.city,
                    shippingAddress: address.address,
                },
                { transaction }
            );
            const orderProducts = productsInCart.map((x) => ({
                orderId: order.id,
                productId: x.productId,
                priceAtPurchase: x.Product.finalPrice,
                quantity: x.quantity,
            }));

            await OrderProduct.bulkCreate(orderProducts, { transaction });

            await Promise.all(
                productsInCart.map((x) => {
                    return Product.update({ stock: x.Product.stock - x.quantity }, { where: { id: x.productId }, transaction });
                })
            );

            await CartProduct.destroy({ where: { cartId: userCart.id }, transaction });

            await transaction.commit();

            res.status(200).json({
                message: "Order completed",
                totalAmount,
                orderId: order.id,
                shippingCountry: order.shippingCountry,
                shippingCity: order.shippingCity,
                shippingAddress: order.shippingAddress
            });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    } catch (error) {
        next(error);
    }
};
