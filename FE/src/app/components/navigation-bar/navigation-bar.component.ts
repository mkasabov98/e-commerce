import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";
import { RegisterComponent } from "../register/register.component";
import { LoginComponent } from "../login/login.component";
import { loggedUser } from "../../models/auth.models";
import { NO_USER } from "../../constants.ts/constants";
import { Button } from "primeng/button";
import { ToastService } from "../../services/toast.service";
import { Router, RouterLink } from "@angular/router";
import { BadgeModule } from "primeng/badge";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { CartService } from "../../services/cart.service";
import { ToolbarModule } from "primeng/toolbar";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { ProductsService } from "../../services/products.service";
import { UserRoles } from "../../models/auth.models";
import { FormsModule } from "@angular/forms";
@Component({
    selector: "app-navigation-bar",
    imports: [RegisterComponent, LoginComponent, Button, RouterLink, BadgeModule, OverlayBadgeModule, ToolbarModule, IconFieldModule, InputIconModule, InputTextModule, FormsModule],
    providers: [],
    templateUrl: "./navigation-bar.component.html",
    styleUrl: "./navigation-bar.component.scss",
    standalone: true,
})
export class NavigationBarComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private inputSubject = new Subject<string>();
    public searchString = "";

    public UserRoles = UserRoles;
    public loggedUser: loggedUser = NO_USER;
    public cartItems: number = 0;
    constructor(private authService: AuthService, private toastService: ToastService, private cartService: CartService, private productsService: ProductsService, public router: Router) {}

    ngOnInit() {
        this.authService.loggedUserSubject.pipe(takeUntil(this.destroy$)).subscribe((res) => {
            this.loggedUser = res;
        });
        this.cartService.cartItemsSubject$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
            this.cartItems = res;
        });

        this.inputSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((searchString) => {
            this.searchString = searchString;
            this.productsService.filtersSubject.next({ ...this.productsService.filtersSubject.getValue(), searchString: searchString });
        });
    }

    onInputChange(event: Event) {
        const searchString = (event.target as HTMLInputElement).value;
        this.inputSubject.next(searchString);
    }

    clearInput() {
        if (!this.searchString) return;
        this.searchString = "";
        this.productsService.filtersSubject.next({ ...this.productsService.filtersSubject.getValue(), searchString: "" });
    }

    logOut() {
        this.authService.loggedUserSubject.next(NO_USER);
        localStorage.removeItem("jwt");
        this.cartService.cartItemsSubject$.next(0);
        this.toastService.show("You have logged out.");
    }

    ngOnDestroy() {
        this.destroy$.next();
    }
}
