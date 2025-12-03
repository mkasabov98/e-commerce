import { Router } from "express";
import { getAllCategories, getAllProducts, getProductById } from "../controllers/products.controller";

const router = Router();

router.get("/categories", getAllCategories);
router.get("/:productId", getProductById);
router.get("/", getAllProducts);

export default router;
