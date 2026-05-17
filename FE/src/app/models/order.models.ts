export interface OrderProduct {
    productId: number;
    name: string;
    imageUrl: string;
    priceAtPurchase: number;
    quantity: number;
}

export interface Order {
    id: number;
    status: number;
    totalAmount: number;
    shippingAddress: string;
    createdAt: string;
    products: OrderProduct[];
}
