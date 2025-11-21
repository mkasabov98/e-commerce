import { Router } from "express";
import {
    deleteUser,
    login,
    register,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/delete/:userId",authenticate, deleteUser);

export default router;