import { NextFunction, Response } from "express";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/authenticate.middleware";

//POST /app/user/delete
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    try {
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
