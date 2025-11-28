import { Router } from "express";
import { deleteUser } from "../controllers/user.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();
router.delete("/delete/:userId", authenticate, deleteUser);

export default router;
