import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authenticate.middleware";
import { UserRoles } from "../enums/user-enums.enum";
import { OrderProduct } from "../models/orderProduct.model";
import { Order } from "../models/order.model";
import { OrderStatuses } from "../enums/order-enums.enum";
import { Review } from "../models/review.model";
import { Product } from "../models/product.model";
import { literal } from "sequelize";

// POST app/review
export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const body: { productId: number; starReview: number; review: string | null } = req.body;

    try {
        if (user?.role !== UserRoles.User) {
            throw { status: 401, message: "Unauthorized" };
        }

        const existingReview = await Review.findOne({
            where: {
                userId: user.id,
                productId: body.productId,
            },
        });

        if (existingReview) {
            throw { status: 400, message: "You have already left a review for this product." };
        }

        const lastOrder = await Order.findOne({
            where: {
                userId: user.id,
                status: OrderStatuses.Delivered,
            },
            include: [
                {
                    model: OrderProduct,
                    required: true,
                    where: {
                        productId: body.productId,
                    },
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        if (!lastOrder) {
            throw {
                status: 400,
                message: "You can leave a review only after you purchased this product and it was delivered.",
            };
        }

        const newReview = await Review.create({
            userId: user.id,
            productId: body.productId,
            orderId: lastOrder.id,
            starReview: body.starReview,
            review: body.review,
        });

        const productReviews = await Review.findAll({
            where: {
                productId: body.productId,
            },
        });

        const productReviewEstimate =
            productReviews.reduce((acc, x) => {
                return acc + x.starReview;
            }, 0) / productReviews.length;

        await Product.update(
            {
                starReview: productReviewEstimate,
                reviewsCount: literal("reviewsCount + 1"),
            },
            { where: { id: body.productId } }
        );

        return res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
};
