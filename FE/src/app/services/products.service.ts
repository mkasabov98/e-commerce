import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {
    public cartItemsSubject$ = new BehaviorSubject<number>(0);

    constructor(private http: HttpClient) {}

}
