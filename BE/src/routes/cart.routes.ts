import { Router } from "express";
import { bulkUpdateCart, deleteProductFromCart, getAllProductsInCart, updateCartProduct } from "../controllers/cart.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { createPaymentIntent } from "../controllers/order.controller";

const router = Router();

router.post("/create-payment-intent", authenticate, createPaymentIntent);
router.patch("/updateProduct", authenticate, updateCartProduct);
router.patch("/updateCart", authenticate, bulkUpdateCart);
router.delete("/deleteProduct/:productId", authenticate, deleteProductFromCart);
router.get("/", authenticate, getAllProductsInCart);

export default router;
