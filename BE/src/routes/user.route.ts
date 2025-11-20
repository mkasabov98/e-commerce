import { Router } from "express";
import {
    createUser,
    deleteUser,
    signInUser,
} from "../controllers/user.controller";

const router = Router();

router.post("/create", createUser);
router.post("/signIn", signInUser);
router.delete("/delete/:id", deleteUser);

export default router;