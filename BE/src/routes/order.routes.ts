import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { createOrder } from "../controllers/order.controller";

const router = Router();

router.post('/create', authenticate, createOrder);

export default router;