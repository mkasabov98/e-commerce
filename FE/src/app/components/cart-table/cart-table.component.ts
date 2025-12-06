import { Component, OnDestroy, OnInit } from "@angular/core";
import { TableModule } from "primeng/table";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputNumberInputEvent, InputNumberModule } from "primeng/inputnumber";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ToastService } from "../../services/toast.service";
import { map, Subject, take, takeUntil } from "rxjs";
import { loggedUser } from "../../models/auth.models";
import { NO_USER } from "../../constants.ts/constants";
import { CartService } from "../../services/cart.service";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { cartProduct } from "../../models/cart.models";
import { ProductsService } from "../../services/products.service";
import { TagModule } from "primeng/tag";

@Component({
    selector: "app-cart-table",
    imports: [FormsModule, TableModule, InputGroupModule, InputGroupAddonModule, InputNumberModule, ConfirmDialogModule, ButtonModule, TagModule],
    providers: [ConfirmationService],
    templateUrl: "./cart-table.component.html",
    styleUrl: "./cart-table.component.scss",
    standalone: true,
})
export class CartTableComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public products: cartProduct[] = [];

    private loggedUser: loggedUser = NO_USER;

    get cartTotalPrice() {
        if (!this.products || !this.products.length) return 0;
        return this.products.reduce((acc, curr) => acc + curr.quantity! * curr.price, 0).toFixed(2);
    }
    constructor(private authService: AuthService, private toastService: ToastService, private cartService: CartService, private confirmationService: ConfirmationService, private productsService: ProductsService) {}

    ngOnInit(): void {
        this.authService.loggedUserSubject.pipe(takeUntil(this.destroy$)).subscribe((res) => {
            this.loggedUser = res;
            this.fetchCartProducts();
        });
    }

    fetchCartProducts() {
        if (this.loggedUser.id === -1) {
            const products: { productId: number; productQuantity: number }[] = JSON.parse(localStorage.getItem("localCart") || "[]");
            this.productsService
                .getSpecificProducts(products.map((x) => x.productId))
                .pipe(
                    take(1),
                    map(({ items, totalPrice }) => {
                        return {
                            items: items.map((x) => {
                                return {
                                    ...x,
                                    quantity: products.find((y) => y.productId === x.productId)?.productQuantity,
                                    inventoryStatus: this.getInventoryStatus(x.stock),
                                    severityStatus: this.getSeverity(x.stock),
                                };
                            }),
                            totalPrice,
                        };
                    })
                )
                .subscribe(
                    (res) => {
                        this.products = res.items;
                    },
                    (err) => {
                        this.toastService.show(err.error.message, "warn");
                    }
                );
        } else {
            this.cartService
                .getCartProducts()
                .pipe(
                    take(1),
                    map(({ items, totalPrice }) => {
                        return {
                            items: items.map((x) => {
                                return {
                                    ...x,
                                    inventoryStatus: this.getInventoryStatus(x.stock),
                                    severityStatus: this.getSeverity(x.stock),
                                };
                            }),
                            totalPrice,
                        };
                    })
                )
                .subscribe(
                    (res) => {
                        this.products = res.items;
                    },
                    (err) => {
                        this.toastService.show(err.error.message, "warn");
                    }
                );
        }
    }

    handleAction(productId: number, quantity: number, actionType: "increment" | "decrement") {
        if (actionType === "decrement") {
            if (quantity === 1) this.openConfirmDialog(productId, 0);
            else this.updateProductQuantity(productId, quantity - 1);
        } else {
            this.updateProductQuantity(productId, quantity + 1);
        }
    }

    changeValue(event: InputNumberInputEvent, productId: number) {
        const quantity = event.value;
        const formattedValue = Number(event.formattedValue);
        if (!quantity) this.openConfirmDialog(productId, formattedValue);
        else this.updateProductQuantity(productId, quantity);
    }

    updateProductQuantity(productId: number, quantity: number) {
        if (this.loggedUser.id === -1) {
            this.cartService.updateLocalCart(productId, quantity);
            this.updateCart(productId, quantity);
            this.toastService.show("Temporary cart updated. Your personal cart will be updated once you log in.");
        } else {
            this.cartService
                .addProductToCart(productId, quantity)
                .pipe(take(1))
                .subscribe(
                    (res) => {
                        this.updateCart(productId, quantity);
                        this.toastService.show("Cart has been updated.", "success");
                    },
                    (error) => {
                        this.toastService.show(error.error.message, "warn");
                    }
                );
        }
    }

    // Updated the products array in order to not fetch the updated cart on each action.
    updateCart(productId: number, quantity: number) {
        const productIndex = this.products.findIndex((x) => x.productId === productId);
        if (quantity === 0) {
            this.products.splice(productIndex, 1);
        } else {
            this.products[productIndex].quantity = quantity;
        }

        //update cart badge
        this.cartService.cartItemsSubject$.next(this.products.reduce((acc, curr) => acc + curr.quantity!, 0));
    }

    openConfirmDialog(productId: number, prevQuantity: number) {
        this.confirmationService.confirm({
            message: "Are you sure you want to remove the product from your cart?",
            header: "Remove product",
            closable: true,
            closeOnEscape: true,
            icon: "pi pi-exclamation-triangle",
            rejectButtonProps: {
                label: "don't remove",
                severity: "secondary",
                outlined: true,
            },
            acceptButtonProps: {
                label: "remove",
            },
            accept: () => {
                this.updateProductQuantity(productId, 0);
            },
            reject: () => {
                this.toastService.show("Product has not been removed from cart.");
                this.updateCart(productId, prevQuantity);
            },
        });
    }

    getInventoryStatus(stock: number) {
        if (stock === 0) return "OUTOFSTOCK";
        else if (stock <= 10) return "LOWSTOCK";
        else return "INSTOCK";
    }

    getSeverity(stock: number) {
        if (stock === 0) return "danger";
        else if (stock <= 10) return "warn";
        else return "success";
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
