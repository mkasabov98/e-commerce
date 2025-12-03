import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, ObservableLike } from "rxjs";
import { filtersSubject, getProductsParams, getProductsResponse, productCategory } from "../models/products.models";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: "root",
})
export class ProductsService {
    private initialFilters: filtersSubject = {
        categories: [],
        sortBy: undefined,
        searchString: "",
    };
    public filtersSubject = new BehaviorSubject<filtersSubject>(this.initialFilters);
    constructor(private http: HttpClient) {}

    public getProducts(params: getProductsParams): Observable<getProductsResponse> {
        return this.http.get<getProductsResponse>(`${environment.apiUrl}/products`, {
            observe: "body",
            params: { ...params },
        });
    }

    public getCategories(): Observable<productCategory[]> {
        return this.http.get<productCategory[]>(`${environment.apiUrl}/products/categories`, {
            observe: "body",
        });
    }
}
