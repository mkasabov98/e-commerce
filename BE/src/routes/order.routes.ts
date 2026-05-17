import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { getUserOrders } from "../controllers/order.controller";

const router = Router();

router.get("/", authenticate, getUserOrders);

export default router;