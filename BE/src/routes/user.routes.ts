import { Router } from "express";
import {
    deleteUser,
    login,
    registerUser,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);
router.delete("/delete/:userId",authenticate, deleteUser);

export default router;