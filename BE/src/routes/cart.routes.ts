import { Router } from "express";
import { deleteProductFromCart, getAllProductsInCart, updateCartProduct } from "../controllers/cart.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.patch("/updateProduct", authenticate, updateCartProduct);
router.delete("/deleteProduct/:productId", authenticate, deleteProductFromCart);
router.get("/", authenticate, getAllProductsInCart);

export default router;