import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: number; role: number; email: string };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            throw { status: 401, message: "No token provided" };
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; role: number; email: string };

        req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
        next();
    } catch (error) {
        next(error);
    }
};
