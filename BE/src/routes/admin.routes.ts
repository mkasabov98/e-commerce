import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { createCategory, createProduct, deleteProduct, getAnalyticsBreakdown, getAnalyticsTimeseries, getDashboardStats, registerAdmin } from "../controllers/admin.controller";

const router = Router();

router.get("/dashboard", authenticate, getDashboardStats);
router.get("/analytics/timeseries", authenticate, getAnalyticsTimeseries);
router.get("/analytics/breakdown", authenticate, getAnalyticsBreakdown);
router.post("/register", authenticate, registerAdmin);
router.post("/products/create", authenticate, createProduct);
router.delete("/products/delete/:productId", authenticate, deleteProduct);
router.post("/category", authenticate, createCategory);

export default router;
