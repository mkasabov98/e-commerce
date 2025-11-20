require("dotenv").config();
import express from "express";
import cors from "cors";
import sequelize from "./config/database";

import "./models/index";
//Routes
import productRoutes from "./routes/products.route";
import userRoutes from "./routes/user.route";
//Middlewares
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/app/products", productRoutes);
app.use("/app/user", userRoutes);

app.use(errorHandler)

sequelize
    .sync({ alter: true })
    .then((res) => {
        console.log(res);
        console.log("DB synced");
    })
    .catch((err) => console.log(err));

export default app;
