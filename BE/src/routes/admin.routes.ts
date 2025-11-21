import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { createProduct, deleteProduct } from "../controllers/admin.controller";

const router = Router();

router.post("/products/create", authenticate, createProduct);
router.delete("/products/delete/:productId", authenticate, deleteProduct);

export default router;