import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { RegisterComponent } from "../register/register.component";
import { LoginComponent } from "../login/login.component";
import { loggedUser } from '../../models/auth.models';
import { NO_USER } from '../../constants.ts/constants';
import { Button } from "primeng/button";
import { ToastService } from '../../services/toast.service';
import { RouterLink } from "@angular/router";
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'app-navigation-bar',
    imports: [
    RegisterComponent,
    LoginComponent,
    Button,
    RouterLink,
    BadgeModule,
    OverlayBadgeModule
],
    providers: [],
    templateUrl: './navigation-bar.component.html',
    styleUrl: './navigation-bar.component.scss',
    standalone: true,
})
export class NavigationBarComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    public loggedUser: loggedUser = NO_USER;
    public cartItems: number = 0;
    constructor(private authService: AuthService, private toastService: ToastService, private productsService: ProductsService) {}

    ngOnInit() {
        this.authService.loggedUserSubject.pipe(takeUntil(this.destroy$)).subscribe((res) => {
            this.loggedUser = res;
        })
        this.productsService.cartItemsSubject$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
            this.cartItems = res;
        })
    }

    logOut() {
        this.authService.loggedUserSubject.next(NO_USER);
        localStorage.removeItem('jwt');
        this.toastService.show('You have logged out.')
    }

    ngOnDestroy() {
        this.destroy$.next();
    }
}
