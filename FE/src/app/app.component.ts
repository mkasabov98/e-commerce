import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { ToastService } from "./services/toast.service";
import { AuthService } from "./services/auth.service";
import { CartService } from "./services/cart.service";
import { take } from "rxjs";
// import { NavigationBarComponent } from "./components/navigation-bar/navigation-bar.component";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, ToastModule],
    providers: [ToastService],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
    standalone: true,
})
export class AppComponent implements OnInit {
    title = "FE";

    constructor(private authService: AuthService, private toastService: ToastService, private cartService: CartService) {}
    ngOnInit(): void {
        const checkJWT = this.authService.checkJWT();
        // toastService not working from app component
        if (checkJWT[0] && !checkJWT[1]) {
            this.cartService
                .getCartProducts()
                .pipe(take(1))
                .subscribe((res) => {
                    this.cartService.cartItemsSubject$.next(res.items.reduce((acc, curr) => {
                        return acc + curr.quantity;
                    },0));
                });
        } else {
            this.cartService.updateCartBadge()
        }
    }
}
