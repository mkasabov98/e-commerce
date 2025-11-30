export interface cardProduct {
    id: number;
    name: string;
    description: string; //percent
    finalPrice: number;
    imageUrl: string;
    stock: number; // quantity in stock
    starReview: number | null;
    reviewsCount: number;
}

export interface updateCartProductResponse {
    productId: number;
    quantity: number;
}
