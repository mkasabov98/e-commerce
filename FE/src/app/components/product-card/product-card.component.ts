import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { CardModule } from "primeng/card";
import { cardProduct } from "../../models/products.models";
import { Button } from "primeng/button";
import { AuthService } from "../../services/auth.service";
import { Subject, take, takeUntil } from "rxjs";
import { loggedUser } from "../../models/auth.models";
import { NO_USER } from "../../constants.ts/constants";
import { ToastService } from "../../services/toast.service";
import { CartService } from "../../services/cart.service";

@Component({
    selector: "app-product-card",
    imports: [CardModule, Button],
    templateUrl: "./product-card.component.html",
    styleUrl: "./product-card.component.scss",
    standalone: true,
})
export class ProductCardComponent implements OnInit, OnDestroy {
    @Input() product!: cardProduct;

    private loggedUser: loggedUser = NO_USER;
    private destroy$ = new Subject<void>();

    public productStars: string[] = [];

    constructor(private authService: AuthService, private toastService: ToastService, private cartService: CartService) {}

    ngOnInit() {
        this.authService.loggedUserSubject.pipe(takeUntil(this.destroy$)).subscribe((user) => (this.loggedUser = user));

        const filled = Math.round(this.product.starReview!);

        for (let i = 1; i < 6; i++) {
            if (i <= filled) this.productStars.push(`filledStar${i}`);
            else this.productStars.push(`emptyStar${i}`);
        }
    }

    openProduct(event$: Event) {
        console.log("openProduct");
    }

    addToCart(event$: Event) {
        event$.stopPropagation();
        if (this.loggedUser.id === NO_USER.id) {
            const cart = localStorage.getItem("localCart");
            const updatedCart: {
                productId: number;
                productQuantity: number;
            }[] = !cart ? [] : JSON.parse(cart);

            const indexToUpdate = updatedCart.findIndex((x) => x.productId === this.product.id);

            if (indexToUpdate === -1) {
                updatedCart.push({
                    productId: this.product.id,
                    productQuantity: 1,
                });
            } else {
                updatedCart[indexToUpdate] = {
                    productId: this.product.id,
                    productQuantity: updatedCart[indexToUpdate].productQuantity + 1,
                };
            }

            localStorage.setItem("localCart", JSON.stringify(updatedCart));
            this.toastService.show("The item has been added to your cart, once you log in your account, your personal cart will be updated.");
            this.cartService.cartItemsSubject$.next(this.cartService.cartItemsSubject$.value + 1);
        } else {
            this.cartService
                .addProductToCart(this.product.id, 1)
                .pipe(take(1))
                .subscribe(
                    (res) => {
                        this.cartService.cartItemsSubject$.next(this.cartService.cartItemsSubject$.value + 1);
                        this.toastService.show("Item has been added to cart", 'success')
                    },
                    (error) => {
                        this.toastService.show(error.error.message, "warn");
                    }
                );
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
    }
}
