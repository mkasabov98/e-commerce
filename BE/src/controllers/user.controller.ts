import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";

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
