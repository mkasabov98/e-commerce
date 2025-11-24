import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authenticate.middleware";
import { UserRoles } from "../enums/user-enums.enum";
import { Address } from "../models/address.model";

export const createAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const body: { country: string; city: string; address: string } = req.body;

    try {
        if (req.user?.role !== UserRoles.User) throw { status: 401, message: "Unauthorized" };

        const address = await Address.create({ userId: user.id, ...body });

        res.status(201).json(address);
    } catch (error) {
        next(error);
    }
};

export const getAddresses = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    try {
        if (user?.role !== UserRoles.User) throw { status: 401, message: "Unauthorized" };
        const addresses = await Address.findAll({ where: { userId: user.id } });
        res.status(200).json(addresses);
    } catch (error) {
        next(error);
    }
};


//Currently cannot delete an address that has been used for an order as Order has FK pointing to the address
//Should work on this in future
export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const addressId = req.params.addressId;

    try {
        if (user?.role !== UserRoles.User) throw { status: 401, message: "Unauthorized" };

        const address = await Address.findByPk(addressId);
        if (!address) throw { status: 400, message: "There is no address with that Id" };
        if (address.userId !== user.id) throw { status: 401, message: "Unauthorized" };
        await address.destroy();
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const updateAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const body = req.body;

    try {
        if (user?.role !== UserRoles.User) throw { status: 401, message: "Unauthorized" };

        let address = await Address.findByPk(body.id);
        if (address.userId !== user.id) throw { status: 401, message: "Unauthorized" };

        await address.update({
            country: body.country,
            city: body.city,
            address: body.address,
        });

        await address.reload();

        res.status(200).json(address);
    } catch (error) {
        next(error);
    }
};
