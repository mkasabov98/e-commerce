import { NextFunction, Request, Response } from "express";
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
import stripe from "../config/stripe";
import Stripe from "stripe";

interface WebhookRequest extends Request {
    rawBody: Buffer;
}

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_LOCAL_WEBHOOK_SECRET;

export const handleStripeWebhook = async (req: WebhookRequest, res, next: NextFunction) => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.log(`❌ Webhook signature verification failed:`, error);
        return res.sendStatus(400);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const transaction = await sequelize.transaction();

        try {
            const order = await Order.findOne({
                where: { stripePaymentIntentId: paymentIntent.id },
                transaction,
            });

            if (!order || order.status !== OrderStatuses.Pending) {
                await transaction.rollback();
                return res.sendStatus(200);
            }

            const orderProducts = await OrderProduct.findAll({ where: { orderId: order.id }, transaction });
            await order.update({ status: OrderStatuses.Paid }, { transaction });

            await Promise.all(
                orderProducts.map(async (x) => {
                    const product = await Product.findByPk(x.productId, { attributes: ["stock"], transaction });
                    if (product) {
                        return Product.update({ stock: product.stock - x.quantity }, { where: { id: x.productId }, transaction });
                    }
                })
            );

            const userId = parseInt(paymentIntent.metadata.userId);
            const userCart = await Cart.findOne({ where: { userId }, transaction });
            if (userCart) {
                await CartProduct.destroy({ where: { cartId: userCart.id }, transaction });
            }

            await transaction.commit();
        } catch (error) {
            console.error("Error during webhook fulfillment:", error);
            await transaction.rollback();
        }
    }

    return res.sendStatus(200);
};

export const createPaymentIntent = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
            const stripeAmount = Math.round(totalAmount * 100);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: stripeAmount,
                currency: "usd",
                metadata: {
                    userId: user.id,
                    cartId: userCart.id,
                },
            });

            const order = await Order.create(
                {
                    userId: user.id,
                    status: OrderStatuses.Pending,
                    totalAmount: totalAmount,
                    shippingCountry: address.country,
                    shippingCity: address.city,
                    shippingAddress: address.country + ", " + address.city + ", " + address.address,
                    stripePaymentIntentId: paymentIntent.id,
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

            await transaction.commit();

            res.status(200).json({
                message: "Payment Intent Created",
                orderId: order.id,
                clientSecret: paymentIntent.client_secret,
            });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    } catch (error) {
        next(error);
    }
};
