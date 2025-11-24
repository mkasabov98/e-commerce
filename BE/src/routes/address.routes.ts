import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { createAddress, getAddresses, deleteAddress, updateAddress } from "../controllers/address.controller";

const router = Router();

router.post("/", authenticate, createAddress);
router.get("/", authenticate, getAddresses);
router.delete("/:addressId", authenticate, deleteAddress);
router.patch("/:addressId", authenticate, updateAddress);

export default router;