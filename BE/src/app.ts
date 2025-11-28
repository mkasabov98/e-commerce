require("dotenv").config();
import express from "express";
import cors from "cors";
import sequelize from "./config/database";

import "./models/index";
//Routes
import productRoutes from "./routes/products.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import addressRoutes from "./routes/address.routes"
import authRoutes from "./routes/auth.routes"
//Middlewares
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/app/products", productRoutes);
app.use("/app/user", userRoutes);
app.use("/app/admin", adminRoutes);
app.use("/app/cart", cartRoutes);
app.use("/app/order", orderRoutes);
app.use("/app/address", addressRoutes);
app.use("/app/auth", authRoutes);

app.use(errorHandler);

sequelize
    .sync({alter: true})
    .then((res) => {})
    .catch((err) => {});

export default app;
