import { User } from "./user.model";
import { Product } from "./product.model";
import { Order } from "./order.model";
import { OrderProduct } from "./orderProduct.model";
import { Cart } from "./cart.model";
import { CartProduct } from "./cartProduct.model";

CartProduct.belongsTo(Cart, { foreignKey: "cartId", onUpdate: "CASCADE" });
Cart.hasMany(CartProduct, { foreignKey: "cartId", onDelete: "CASCADE" });

CartProduct.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(CartProduct, { foreignKey: "productId", onDelete: "RESTRICT" });

Cart.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Cart, { foreignKey: "userId" });

Order.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Order, { foreignKey: "userId" });

OrderProduct.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderProduct, {
    foreignKey: "productId",
    onDelete: "Restrict",
});

OrderProduct.belongsTo(Order, { foreignKey: "orderId" });
Order.hasMany(OrderProduct, { foreignKey: "orderId", onDelete: "CASCADE" });
