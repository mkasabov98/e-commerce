import { User } from "./user.model";
import { Product } from "./product.model";
import { Order } from "./order.model";
import { OrderProduct } from "./orderProduct.model";
import { Cart } from "./cart.model";
import { CartProduct } from "./cartProduct.model";
import { Address } from "./address.model";
import { Review } from "./review.model";
import { ProductCategory } from "./category.model";

void Product;
void User;
void Cart;
void CartProduct;
void Order;
void OrderProduct;
void Address;
void Review;
void ProductCategory;

CartProduct.belongsTo(Cart, { foreignKey: "cartId", onUpdate: "CASCADE" });
Cart.hasMany(CartProduct, { foreignKey: "cartId", onDelete: "CASCADE" });

CartProduct.belongsTo(Product, { foreignKey: "productId", as: "Product" });
Product.hasMany(CartProduct, { foreignKey: "productId", onDelete: "RESTRICT" });

Cart.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasOne(Cart, { foreignKey: "userId" });

Order.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });

OrderProduct.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderProduct, {
    foreignKey: "productId",
    onDelete: "Restrict",
});

OrderProduct.belongsTo(Order, { foreignKey: "orderId" });
Order.hasMany(OrderProduct, { foreignKey: "orderId", onDelete: "CASCADE" });

Address.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Address, { foreignKey: "userId", onDelete: "CASCADE" });

Review.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });

Review.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Review, { foreignKey: "userId" });

Review.belongsTo(Order, { foreignKey: "orderId" });
Order.hasMany(Review, { foreignKey: "orderId" });

Product.belongsTo(ProductCategory, { foreignKey: "productCategoryId", as: "ProductCategory" });
ProductCategory.hasMany(Product, { foreignKey: "productCategoryId", as: "Products" });