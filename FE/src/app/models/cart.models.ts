export interface updateCartProductResponse {
    productId: number;
    quantity: number;
}

export interface cartProduct {
    productId: number;
    quantity: number;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
}

export interface getCartProductsResponse {
    items: cartProduct[];
    totalPrice: number;
}
