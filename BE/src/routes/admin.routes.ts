import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { createCategory, createProduct, deleteProduct, registerAdmin } from "../controllers/admin.controller";

const router = Router();

router.post("/register", authenticate, registerAdmin);
router.post("/products/create", authenticate, createProduct);
router.delete("/products/delete/:productId", authenticate, deleteProduct);
router.post("/category", authenticate, createCategory);

export default router;
