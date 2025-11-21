import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { Cart } from "../models/cart.model";
import jwt from "jsonwebtoken";

//POST /app/user/register
export const register = async (req: Request, res: Response, next: NextFunction) => {
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
            await Cart.findOrCreate({where: {userId: newUser.id}});
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

//POST /app/user/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
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
        }

        const passwordMatch = await existingUser.checkPassword(body.password);
        if (!passwordMatch) {
            throw {
                status: 400,
                message: "Password does not match to the provided email",
            };
        }

        const token = jwt.sign(
            {
                id: existingUser.id,
                role: existingUser.role,
                email: existingUser.email,
            },
            process.env.JWT_SECRET!,
            { expiresIn: 3600 }
        );
        const { password, ...userData } = existingUser.get();
        res.status(200).json({
            userData: userData,
            token,
        });
    } catch (error) {
        next(error);
    }
};

//POST /app/user/delete/:userId
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const existingUser = await User.findByPk(userId);
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
