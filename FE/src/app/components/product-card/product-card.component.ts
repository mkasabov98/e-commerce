import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { cardProduct } from "../../models/products.models";
import { Button } from "primeng/button";
import { AuthService } from "../../services/auth.service";
import { Subject, take, takeUntil } from "rxjs";
import { loggedUser, UserRoles } from "../../models/auth.models";
import { NO_USER } from "../../constants.ts/constants";
import { ToastService } from "../../services/toast.service";
import { CartService } from "../../services/cart.service";

@Component({
    selector: "app-product-card",
    imports: [Button],
    templateUrl: "./product-card.component.html",
    styleUrl: "./product-card.component.scss",
    standalone: true,
})
export class ProductCardComponent implements OnInit, OnDestroy {
    @Input() product!: cardProduct;

    private destroy$ = new Subject<void>();

    public UserRoles = UserRoles;
    public loggedUser: loggedUser = NO_USER;
    public productStars: string[] = [];

    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private cartService: CartService,
    ) {}

    ngOnInit() {
        this.authService.loggedUserSubject
            .pipe(takeUntil(this.destroy$))
            .subscribe((user) => (this.loggedUser = user));

        const filled = this.product.starReview ? Math.round(this.product.starReview) : 0;
        for (let i = 1; i <= 5; i++) {
            this.productStars.push(i <= filled ? `filledStar${i}` : `emptyStar${i}`);
        }
    }

    onImageError(event: Event) {
        (event.target as HTMLImageElement).src =
            "https://placehold.co/400x300?text=No+Image";
    }

    openProduct(event$: Event) {
        console.log("openProduct");
    }

    addToCart(event$: Event) {
        event$.stopPropagation();

        if (this.product.stock === 0) {
            this.toastService.show("This item is out of stock", "warn");
            return;
        }

        if (this.loggedUser.id === NO_USER.id) {
            const cart = localStorage.getItem("localCart");
            const updatedCart: { productId: number; productQuantity: number }[] = !cart
                ? []
                : JSON.parse(cart);
            const indexToUpdate = updatedCart.findIndex((x) => x.productId === this.product.id);

            if (indexToUpdate === -1) {
                updatedCart.push({ productId: this.product.id, productQuantity: 1 });
            } else {
                const currentQty = updatedCart[indexToUpdate].productQuantity;
                if (currentQty >= this.product.stock) {
                    this.toastService.show(
                        `Only ${this.product.stock} unit(s) of this item are available`,
                        "warn"
                    );
                    return;
                }
                updatedCart[indexToUpdate].productQuantity = currentQty + 1;
            }

            localStorage.setItem("localCart", JSON.stringify(updatedCart));
            this.cartService.cartItemsSubject$.next(this.cartService.cartItemsSubject$.value + 1);
            this.toastService.show("Item added to temporary cart. Log in to save your cart.");
        } else {
            this.cartService
                .addProductToCart(this.product.id, 1, true)
                .pipe(take(1))
                .subscribe({
                    next: () => {
                        this.cartService.cartItemsSubject$.next(
                            this.cartService.cartItemsSubject$.value + 1
                        );
                        this.toastService.show("Item has been added to cart", "success");
                    },
                    error: (error) => {
                        this.toastService.show(error.error.message, "warn");
                    },
                });
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
    }
}
