require("dotenv").config();
import express from "express";
import cors from "cors";
import sequelize from "./config/database";

import { User } from "./models/user.model";
import { Product } from "./models/product.model";
import { Cart } from "./models/cart.model";
import { CartProduct } from "./models/cartProduct.model";
import { Order } from "./models/order.model";
import { OrderProduct } from "./models/orderProduct.model";
import { UserRoles } from "./enums/user-enums.enum";

import "./models/index";

void Product;
void User;
void Cart;
void CartProduct;
void Order;
void OrderProduct

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

function createUser() {
    // let user = null;
    User.create({
        email: "petyr",
        password: "12345678",
        role: UserRoles.User,
    })
        .then((res) => {
            console.log("res", res);
            Cart.create({ userId: res.dataValues.id });
        })
        .catch((err) => console.log(err));

    Product.create({
        name: "product1",
        description: "description1",
        supplyPrice: 50,
        margin: 50,
        stock: 10,
    })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    CartProduct.create({ cartId: 1, productId: 1, quantity: 10 });
}

app.get("/test", (req, res, next) => {
    console.log("in the /test route");
    return next();
    res.json({ testProp: "on test route" });
});

// Test route
app.get("/", (req, res) => {
    createUser();
    console.log("in the / route");
    res.json({ message: "API is running..." });
});

sequelize
    .sync({alter: true})
    .then((res) => {
        console.log(res);
        console.log("DB synced");
    })
    .catch((err) => console.log(err));

export default app;
