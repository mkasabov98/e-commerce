import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { Cart } from "../models/cart.model";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    try {
        const existingUser = await User.findOne({
            where: {
                email: body.email,
            },
        });
        if (!existingUser) {
            const newUser = await User.create(body);
            console.log(newUser);
            const { password, ...userData } = newUser.get();
            await Cart.create({
                userId: newUser.id,
            });
            return res.status(201).json(userData);
        }
        throw {
            status: 400,
            message: "There is a user with that email",
        };
    } catch (error) {
        next(error);
    }
};

export const signInUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const existingUser = await User.findOne({
            where: {
                email: body.email,
            },
        });
        if (!existingUser) {
            throw {
                status: 400,
                message: "There is no registered user with that email",
            };
        } else {
            const passwordMatch = await existingUser.checkPassword(body.password);
            if (!passwordMatch) {
                throw {
                    status: 400,
                    message: "Password does not match to the provided email",
                };
            }
            const { password, ...userData } = existingUser.get();
            res.status(200).json(userData);
        }
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        console.log(userId)
        const existingUser = await User.findByPk(userId);
        console.log(existingUser)
        if (!existingUser) {
            throw {
                status: 400,
                message: "No user found with that userId",
            };
        }
        await existingUser.destroy();
        res.status(200).json({
            message: "User deleted",
        });
    } catch (error) {
        next(error);
    }
};
