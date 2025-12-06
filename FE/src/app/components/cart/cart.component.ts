import { Component } from "@angular/core";
import { CartTableComponent } from "../cart-table/cart-table.component";

@Component({
    selector: "app-cart",
    imports: [CartTableComponent],
    templateUrl: "./cart.component.html",
    styleUrl: "./cart.component.scss",
    standalone: true,
})
export class CartComponent {}
