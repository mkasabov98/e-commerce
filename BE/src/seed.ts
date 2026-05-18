require("dotenv").config();
import sequelize from "./config/database";
import "./models/index";
import { ProductCategory } from "./models/category.model";
import { Product } from "./models/product.model";
import { User } from "./models/user.model";
import { Order } from "./models/order.model";
import { OrderProduct } from "./models/orderProduct.model";
import { Review } from "./models/review.model";
import { Cart } from "./models/cart.model";
import { CartProduct } from "./models/cartProduct.model";
import { UserRoles } from "./enums/user-enums.enum";
import { OrderStatuses } from "./enums/order-enums.enum";

const fp = (supplyPrice: number, margin: number) =>
    supplyPrice + supplyPrice * (margin / 100);

async function seed() {
    await sequelize.sync({ force: true });
    console.log("Database synced.");

    // ── Users ──────────────────────────────────────────────────────────────
    const users = await User.bulkCreate([
        { email: "admin@shop.com", password: "Admin1234!", role: UserRoles.Admin },
        { email: "user@shop.com",  password: "User1234!",  role: UserRoles.User  },
        { email: "alice@shop.com", password: "Alice1234!", role: UserRoles.User  },
        { email: "bob@shop.com",   password: "Bob1234!",   role: UserRoles.User  },
        { email: "carol@shop.com", password: "Carol1234!", role: UserRoles.User  },
    ], { individualHooks: true });
    const [, userUser, alice, bob, carol] = users;
    console.log("Users seeded.");

    // ── Categories ─────────────────────────────────────────────────────────
    const [electronics, clothing, footwear, homeAndKitchen, sports] =
        await ProductCategory.bulkCreate([
            { categoryName: "Electronics"     },
            { categoryName: "Clothing"        },
            { categoryName: "Footwear"        },
            { categoryName: "Home & Kitchen"  },
            { categoryName: "Sports"          },
        ]);
    console.log("Categories seeded.");

    // ── Products ───────────────────────────────────────────────────────────
    const products = await Product.bulkCreate([
        // ── Electronics ──
        {
            name: "Wireless Noise-Cancelling Headphones",
            description: "Over-ear Bluetooth headphones with active noise cancellation and 30-hour battery life.",
            supplyPrice: 80, margin: 50, finalPrice: fp(80, 50),
            productCategoryId: electronics.id, stock: 40, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        },
        {
            name: "Smart Watch",
            description: "Fitness tracker with heart rate monitor, GPS, sleep tracking and 7-day battery.",
            supplyPrice: 120, margin: 45, finalPrice: fp(120, 45),
            productCategoryId: electronics.id, stock: 25, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        },
        {
            name: "Mechanical Keyboard",
            description: "TKL mechanical keyboard with Cherry MX switches, RGB backlight and USB-C.",
            supplyPrice: 60, margin: 55, finalPrice: fp(60, 55),
            productCategoryId: electronics.id, stock: 30, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
        },
        {
            name: "4K Webcam",
            description: "Ultra HD webcam with autofocus, built-in microphone and plug-and-play USB.",
            supplyPrice: 50, margin: 60, finalPrice: fp(50, 60),
            productCategoryId: electronics.id, stock: 50, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1625948515301-c28dff808cff?w=400",
        },
        {
            name: "Portable Bluetooth Speaker",
            description: "Waterproof wireless speaker with 360° sound, 20-hour battery and built-in power bank.",
            supplyPrice: 45, margin: 55, finalPrice: fp(45, 55),
            productCategoryId: electronics.id, stock: 60, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        },
        {
            name: "USB-C Hub 7-in-1",
            description: "Slim aluminium hub with 4K HDMI, 100W PD, 2× USB-A, SD and microSD card slots.",
            supplyPrice: 30, margin: 80, finalPrice: fp(30, 80),
            productCategoryId: electronics.id, stock: 45, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400",
        },
        // ── Clothing ──
        {
            name: "Classic Crewneck Sweatshirt",
            description: "100% cotton heavyweight crewneck sweatshirt available in multiple colours.",
            supplyPrice: 18, margin: 120, finalPrice: fp(18, 120),
            productCategoryId: clothing.id, stock: 100, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400",
        },
        {
            name: "Slim-Fit Chinos",
            description: "Stretch-cotton slim-fit chino trousers with a tapered leg and flat front.",
            supplyPrice: 22, margin: 100, finalPrice: fp(22, 100),
            productCategoryId: clothing.id, stock: 80, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
        },
        {
            name: "Linen Button-Down Shirt",
            description: "Breathable linen shirt with a relaxed fit, perfect for warm weather.",
            supplyPrice: 20, margin: 110, finalPrice: fp(20, 110),
            productCategoryId: clothing.id, stock: 60, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400",
        },
        {
            name: "Denim Jacket",
            description: "Classic washed denim jacket with a relaxed fit and chest patch pockets.",
            supplyPrice: 35, margin: 95, finalPrice: fp(35, 95),
            productCategoryId: clothing.id, stock: 55, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
        },
        {
            name: "Merino Wool Turtleneck",
            description: "Fine-knit 100% merino wool turtleneck, temperature-regulating and itch-free.",
            supplyPrice: 40, margin: 90, finalPrice: fp(40, 90),
            productCategoryId: clothing.id, stock: 40, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
        },
        // ── Footwear ──
        {
            name: "Running Sneakers",
            description: "Lightweight foam-sole running shoes with breathable mesh upper and cushioned insole.",
            supplyPrice: 45, margin: 80, finalPrice: fp(45, 80),
            productCategoryId: footwear.id, stock: 70, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        },
        {
            name: "Leather Chelsea Boots",
            description: "Full-grain leather Chelsea boots with elastic side panels and stacked heel.",
            supplyPrice: 70, margin: 70, finalPrice: fp(70, 70),
            productCategoryId: footwear.id, stock: 35, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400",
        },
        {
            name: "Canvas Slip-Ons",
            description: "Classic canvas slip-on shoes with a rubber sole, great for everyday casual wear.",
            supplyPrice: 15, margin: 130, finalPrice: fp(15, 130),
            productCategoryId: footwear.id, stock: 90, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
        },
        // ── Home & Kitchen ──
        {
            name: "Pour-Over Coffee Maker",
            description: "Borosilicate glass pour-over with a stainless steel reusable filter.",
            supplyPrice: 20, margin: 90, finalPrice: fp(20, 90),
            productCategoryId: homeAndKitchen.id, stock: 45, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
        },
        {
            name: "Cast Iron Skillet 10\"",
            description: "Pre-seasoned cast iron skillet suitable for all hob types including induction.",
            supplyPrice: 30, margin: 65, finalPrice: fp(30, 65),
            productCategoryId: homeAndKitchen.id, stock: 55, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1620756236308-65c3ef5d25f3?w=400",
        },
        {
            name: "Bamboo Cutting Board Set",
            description: "Set of 3 organic bamboo cutting boards in small, medium and large sizes.",
            supplyPrice: 14, margin: 100, finalPrice: fp(14, 100),
            productCategoryId: homeAndKitchen.id, stock: 75, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400",
        },
        {
            name: "Electric Kettle 1.7L",
            description: "Stainless steel kettle with 5 temperature presets, keep-warm function and LED display.",
            supplyPrice: 28, margin: 75, finalPrice: fp(28, 75),
            productCategoryId: homeAndKitchen.id, stock: 50, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        },
        {
            name: "Airtight Food Containers Set",
            description: "Set of 8 BPA-free airtight containers in assorted sizes with click-lock lids.",
            supplyPrice: 18, margin: 110, finalPrice: fp(18, 110),
            productCategoryId: homeAndKitchen.id, stock: 65, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1603198388954-5e00cdde2db1?w=400",
        },
        // ── Sports ──
        {
            name: "Adjustable Dumbbell Set",
            description: "Pair of adjustable dumbbells from 2–24 kg with quick-change weight selector.",
            supplyPrice: 110, margin: 40, finalPrice: fp(110, 40),
            productCategoryId: sports.id, stock: 20, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
        },
        {
            name: "Yoga Mat",
            description: "6mm thick non-slip TPE yoga mat with alignment lines and carry strap.",
            supplyPrice: 16, margin: 125, finalPrice: fp(16, 125),
            productCategoryId: sports.id, stock: 85, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1601925228054-6f73ed3fc60b?w=400",
        },
        {
            name: "Resistance Bands Pack",
            description: "Set of 5 latex resistance bands with varying tension levels and a carry bag.",
            supplyPrice: 10, margin: 150, finalPrice: fp(10, 150),
            productCategoryId: sports.id, stock: 120, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        },
        {
            name: "Speed Jump Rope",
            description: "Ball-bearing speed rope with adjustable cable length and foam-grip handles.",
            supplyPrice: 8, margin: 175, finalPrice: fp(8, 175),
            productCategoryId: sports.id, stock: 100, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400",
        },
        {
            name: "Foam Roller",
            description: "High-density EVA foam roller for deep-tissue muscle recovery and myofascial release.",
            supplyPrice: 15, margin: 120, finalPrice: fp(15, 120),
            productCategoryId: sports.id, stock: 75, reviewsCount: 0,
            imageUrl: "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=400",
        },
    ], { individualHooks: true });
    console.log("Products seeded.");

    // Index aliases for readability
    const [
        headphones, smartWatch, keyboard, webcam, speaker, usbHub,   // 0-5 electronics
        sweatshirt, chinos, linenShirt, denimJacket, merino,          // 6-10 clothing
        sneakers, chelseaBoots, slipOns,                              // 11-13 footwear
        coffeeMaker, skillet, cuttingBoard, kettle, containers,       // 14-18 home
        dumbbells, yogaMat, resistanceBands, jumpRope, foamRoller,    // 19-23 sports
    ] = products;

    // ── Orders ─────────────────────────────────────────────────────────────
    const [order1, order2, order3, order4, order5, order6] =
        await Order.bulkCreate([
            {
                userId: alice.id,
                shippingCountry: "United Kingdom", shippingCity: "London",
                shippingAddress: "12 Baker Street", totalAmount: 0,
                status: OrderStatuses.Delivered, stripePaymentIntentId: "pi_seed_001",
            },
            {
                userId: bob.id,
                shippingCountry: "Germany", shippingCity: "Berlin",
                shippingAddress: "Unter den Linden 77", totalAmount: 0,
                status: OrderStatuses.Delivered, stripePaymentIntentId: "pi_seed_002",
            },
            {
                userId: carol.id,
                shippingCountry: "France", shippingCity: "Paris",
                shippingAddress: "14 Rue de Rivoli", totalAmount: 0,
                status: OrderStatuses.Delivered, stripePaymentIntentId: "pi_seed_003",
            },
            {
                userId: userUser.id,
                shippingCountry: "Spain", shippingCity: "Madrid",
                shippingAddress: "Gran Vía 32", totalAmount: 0,
                status: OrderStatuses.Delivered, stripePaymentIntentId: "pi_seed_004",
            },
            {
                userId: alice.id,
                shippingCountry: "United Kingdom", shippingCity: "Manchester",
                shippingAddress: "5 Deansgate", totalAmount: 0,
                status: OrderStatuses.Delivered, stripePaymentIntentId: "pi_seed_005",
            },
            {
                userId: bob.id,
                shippingCountry: "Germany", shippingCity: "Munich",
                shippingAddress: "Marienplatz 1", totalAmount: 0,
                status: OrderStatuses.Delivered, stripePaymentIntentId: "pi_seed_006",
            },
        ]);
    console.log("Orders seeded.");

    // ── Order Products ─────────────────────────────────────────────────────
    await OrderProduct.bulkCreate([
        // Order 1 – alice: headphones, smart watch, yoga mat
        { orderId: order1.id, productId: headphones.id,     priceAtPurchase: headphones.finalPrice,     quantity: 1 },
        { orderId: order1.id, productId: smartWatch.id,     priceAtPurchase: smartWatch.finalPrice,     quantity: 1 },
        { orderId: order1.id, productId: yogaMat.id,        priceAtPurchase: yogaMat.finalPrice,        quantity: 1 },
        // Order 2 – bob: keyboard, sneakers, dumbbells
        { orderId: order2.id, productId: keyboard.id,       priceAtPurchase: keyboard.finalPrice,       quantity: 1 },
        { orderId: order2.id, productId: sneakers.id,       priceAtPurchase: sneakers.finalPrice,       quantity: 1 },
        { orderId: order2.id, productId: dumbbells.id,      priceAtPurchase: dumbbells.finalPrice,      quantity: 1 },
        // Order 3 – carol: sweatshirt, chelsea boots, coffee maker
        { orderId: order3.id, productId: sweatshirt.id,     priceAtPurchase: sweatshirt.finalPrice,     quantity: 1 },
        { orderId: order3.id, productId: chelseaBoots.id,   priceAtPurchase: chelseaBoots.finalPrice,   quantity: 1 },
        { orderId: order3.id, productId: coffeeMaker.id,    priceAtPurchase: coffeeMaker.finalPrice,    quantity: 1 },
        // Order 4 – user: webcam, cutting board, resistance bands
        { orderId: order4.id, productId: webcam.id,         priceAtPurchase: webcam.finalPrice,         quantity: 1 },
        { orderId: order4.id, productId: cuttingBoard.id,   priceAtPurchase: cuttingBoard.finalPrice,   quantity: 1 },
        { orderId: order4.id, productId: resistanceBands.id,priceAtPurchase: resistanceBands.finalPrice,quantity: 1 },
        // Order 5 – alice: bluetooth speaker, denim jacket, jump rope
        { orderId: order5.id, productId: speaker.id,        priceAtPurchase: speaker.finalPrice,        quantity: 1 },
        { orderId: order5.id, productId: denimJacket.id,    priceAtPurchase: denimJacket.finalPrice,    quantity: 1 },
        { orderId: order5.id, productId: jumpRope.id,       priceAtPurchase: jumpRope.finalPrice,       quantity: 1 },
        // Order 6 – bob: usb hub, electric kettle, foam roller
        { orderId: order6.id, productId: usbHub.id,         priceAtPurchase: usbHub.finalPrice,         quantity: 1 },
        { orderId: order6.id, productId: kettle.id,         priceAtPurchase: kettle.finalPrice,         quantity: 1 },
        { orderId: order6.id, productId: foamRoller.id,     priceAtPurchase: foamRoller.finalPrice,     quantity: 1 },
    ]);
    console.log("Order products seeded.");

    // ── Reviews ────────────────────────────────────────────────────────────
    await Review.bulkCreate([
        // Order 1 – alice
        { userId: alice.id, orderId: order1.id, productId: headphones.id,    starReview: 5, review: "Incredible noise cancellation and comfort — perfect for long listening sessions." },
        { userId: alice.id, orderId: order1.id, productId: smartWatch.id,    starReview: 4, review: "Great fitness tracking features, but the GPS is a bit slow to lock on." },
        { userId: alice.id, orderId: order1.id, productId: yogaMat.id,       starReview: 5, review: "Perfect thickness and grip — doesn't slip even in hot yoga." },
        // Order 2 – bob
        { userId: bob.id,   orderId: order2.id, productId: keyboard.id,      starReview: 5, review: "Typing on this is an absolute joy. The RGB lighting is stunning." },
        { userId: bob.id,   orderId: order2.id, productId: sneakers.id,      starReview: 4, review: "Very lightweight and breathable, true to size. Great for daily runs." },
        { userId: bob.id,   orderId: order2.id, productId: dumbbells.id,     starReview: 5, review: "Incredible value — the weight selector mechanism is smooth and fast." },
        // Order 3 – carol
        { userId: carol.id, orderId: order3.id, productId: sweatshirt.id,    starReview: 4, review: "Really cosy, washes well and keeps its shape perfectly." },
        { userId: carol.id, orderId: order3.id, productId: chelseaBoots.id,  starReview: 3, review: "Good quality leather but they took a while to break in." },
        { userId: carol.id, orderId: order3.id, productId: coffeeMaker.id,   starReview: 5, review: "Makes the cleanest pour-over I have ever had at home. Beautifully designed." },
        // Order 4 – user
        { userId: userUser.id, orderId: order4.id, productId: webcam.id,         starReview: 4, review: "Sharp 4K image, plug and play with no driver issues whatsoever." },
        { userId: userUser.id, orderId: order4.id, productId: cuttingBoard.id,   starReview: 5, review: "Beautiful boards, easy to clean and very sturdy. The set of three is ideal." },
        { userId: userUser.id, orderId: order4.id, productId: resistanceBands.id,starReview: 4, review: "Good variety of tensions and the carry bag is a nice bonus." },
        // Order 5 – alice
        { userId: alice.id, orderId: order5.id, productId: speaker.id,       starReview: 5, review: "Rich, room-filling sound in such a compact package. Battery life is excellent." },
        { userId: alice.id, orderId: order5.id, productId: denimJacket.id,   starReview: 4, review: "Great fit and solid construction, feels like it will last for years." },
        { userId: alice.id, orderId: order5.id, productId: jumpRope.id,      starReview: 5, review: "Spins so smoothly — a huge upgrade from my old rope. Great for HIIT." },
        // Order 6 – bob
        { userId: bob.id,   orderId: order6.id, productId: usbHub.id,        starReview: 4, review: "Does exactly what it says — all ports worked immediately on both Mac and Windows." },
        { userId: bob.id,   orderId: order6.id, productId: kettle.id,        starReview: 5, review: "Heats up incredibly fast and the temperature display is really handy." },
        { userId: bob.id,   orderId: order6.id, productId: foamRoller.id,    starReview: 4, review: "Good density for muscle recovery. Noticeably eases DOMS after leg day." },
    ]);
    console.log("Reviews seeded.");

    // ── Update product star ratings & review counts ────────────────────────
    const reviewedProducts: Array<{ product: Product; starReview: number; reviewsCount: number }> = [
        { product: headphones,    starReview: 5,   reviewsCount: 1 },
        { product: smartWatch,    starReview: 4,   reviewsCount: 1 },
        { product: keyboard,      starReview: 5,   reviewsCount: 1 },
        { product: webcam,        starReview: 4,   reviewsCount: 1 },
        { product: speaker,       starReview: 5,   reviewsCount: 1 },
        { product: usbHub,        starReview: 4,   reviewsCount: 1 },
        { product: sweatshirt,    starReview: 4,   reviewsCount: 1 },
        { product: denimJacket,   starReview: 4,   reviewsCount: 1 },
        { product: sneakers,      starReview: 4,   reviewsCount: 1 },
        { product: chelseaBoots,  starReview: 3,   reviewsCount: 1 },
        { product: coffeeMaker,   starReview: 5,   reviewsCount: 1 },
        { product: cuttingBoard,  starReview: 5,   reviewsCount: 1 },
        { product: kettle,        starReview: 5,   reviewsCount: 1 },
        { product: dumbbells,     starReview: 5,   reviewsCount: 1 },
        { product: yogaMat,       starReview: 5,   reviewsCount: 1 },
        { product: resistanceBands, starReview: 4, reviewsCount: 1 },
        { product: jumpRope,      starReview: 5,   reviewsCount: 1 },
        { product: foamRoller,    starReview: 4,   reviewsCount: 1 },
    ];

    await Promise.all(
        reviewedProducts.map(({ product, starReview, reviewsCount }) =>
            Product.update({ starReview, reviewsCount }, { where: { id: product.id } })
        )
    );
    console.log("Product ratings updated.");

    // ── Carts ──────────────────────────────────────────────────────────────
    const [cartUser, cartAlice, cartBob, cartCarol] = await Cart.bulkCreate([
        { userId: userUser.id },
        { userId: alice.id   },
        { userId: bob.id     },
        { userId: carol.id   },
    ]);

    await CartProduct.bulkCreate([
        // user's cart: smart watch + linen shirt
        { cartId: cartUser.id,  productId: smartWatch.id,     quantity: 1 },
        { cartId: cartUser.id,  productId: linenShirt.id,     quantity: 2 },
        // alice's cart: keyboard + yoga mat
        { cartId: cartAlice.id, productId: keyboard.id,       quantity: 1 },
        { cartId: cartAlice.id, productId: yogaMat.id,        quantity: 1 },
        // bob's cart: speaker + jump rope + foam roller
        { cartId: cartBob.id,   productId: speaker.id,        quantity: 1 },
        { cartId: cartBob.id,   productId: jumpRope.id,       quantity: 1 },
        { cartId: cartBob.id,   productId: foamRoller.id,     quantity: 2 },
        // carol's cart: kettle + cutting board
        { cartId: cartCarol.id, productId: kettle.id,         quantity: 1 },
        { cartId: cartCarol.id, productId: cuttingBoard.id,   quantity: 1 },
    ]);
    console.log("Carts seeded.");

    console.log("\nDone! Seeded accounts:");
    console.log("  Admin → admin@shop.com  / Admin1234!");
    console.log("  User  → user@shop.com   / User1234!");
    console.log("  User  → alice@shop.com  / Alice1234!");
    console.log("  User  → bob@shop.com    / Bob1234!");
    console.log("  User  → carol@shop.com  / Carol1234!");

    await sequelize.close();
}

seed().catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
});
