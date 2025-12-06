import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { getCartProductsResponse, updateCartProductResponse } from "../models/cart.models";
import { environment } from "../../environments/environment";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class CartService {
    public cartItemsSubject$ = new BehaviorSubject<number>(0);
    constructor(private http: HttpClient) {}

    public updateLocalCart(productId: number, quantity: number) {
        let localCart: { productId: number; productQuantity: number }[] = JSON.parse(localStorage.getItem("localCart") || "");
        if (!localCart) localCart = [];

        const productIndex = localCart.findIndex((x) => x.productId === productId);

        if (quantity === 0 && productIndex !== -1) {
            localCart.splice(productIndex, 1);
        } else if (quantity !== 0 && productIndex !== -1) {
            localCart[productIndex].productQuantity = quantity;
        } else if (quantity !== 0 && productIndex === -1) {
            localCart.push({ productId: productId, productQuantity: quantity });
        }

        localStorage.setItem("localCart", JSON.stringify(localCart));
    }

    public getCartProducts(): Observable<getCartProductsResponse> {
        return this.http.get<getCartProductsResponse>(`${environment.apiUrl}/cart`, {
            observe: "body",
        });
    }

    public addProductToCart(productId: number, quantity: number): Observable<updateCartProductResponse> {
        return this.http.patch<updateCartProductResponse>(
            `${environment.apiUrl}/cart/updateProduct`,
            { productId, quantity },
            {
                observe: "body",
            }
        );
    }

    public updateCart(products: { productId: number; productQuantity: number }[]): Observable<{ message: string }> {
        return this.http.patch<{ message: string }>(`${environment.apiUrl}/cart/updateCart`, products, {
            observe: "body",
        });
    }

    public updateCartBadge() {
        const localCart = localStorage.getItem("localCart");
        if (localCart) {
            const parsedLocalCart: { productId: number; productQuantity: number }[] = JSON.parse(localCart);
            this.cartItemsSubject$.next(
                parsedLocalCart.reduce((acc, curr) => {
                    return acc + curr.productQuantity;
                }, 0)
            );
        } else {
            this.cartItemsSubject$.next(0);
        }
    }
}
