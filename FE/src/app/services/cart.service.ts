import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { updateCartProductResponse } from '../models/products.models';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    constructor(private http: HttpClient) {}

    public addProductToCart(
        productId: number,
        productQuantity: number
    ): Observable<updateCartProductResponse> {
        return this.http.patch<updateCartProductResponse>(
            `${environment.apiUrl}/cart/updateProduct`,
            { productId, productQuantity },
            {
                observe: 'body',
            }
        );
    }

    public updateCart(products: {productId: number, productQuantity: number}[]): Observable<{message:string}> {
        return this.http.patch<{message:string}>(`${environment.apiUrl}/cart/updateCart`, products, {
            observe: 'body'
        })
    }
}
