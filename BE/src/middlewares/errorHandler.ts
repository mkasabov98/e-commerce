import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err.status || 500;

    res.status(status).json({
        message: err.message || "Internal server error",
        details: process.env.NODE_ENV === "dev" ? err : undefined,
    });
};
