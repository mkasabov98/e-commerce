export interface updateCartProductResponse {
    productId: number;
    quantity: number;
}

export interface cartProduct {
    productId: number;
    quantity?: number;
    name: string;
    starReview: number;
    description: string;
    category: string;
    stock: number;
    price: number;
    imageUrl: string;
}

export interface getCartProductsResponse {
    items: cartProduct[];
    totalPrice?: number;
}
