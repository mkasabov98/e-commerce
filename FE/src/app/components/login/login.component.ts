import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Button } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { ToastService } from "../../services/toast.service";
import { AuthService } from "../../services/auth.service";
import { FloatLabel } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { concatMap, map, of, take, tap } from "rxjs";
import { PasswordModule } from "primeng/password";
import { CartService } from "../../services/cart.service";
import { UserRoles } from "../../models/auth.models";

@Component({
    selector: "app-login",
    imports: [Button, DialogModule, ReactiveFormsModule, FloatLabel, InputTextModule, PasswordModule],
    providers: [ToastService],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
    standalone: true,
})
export class LoginComponent {
    private formBuilder = inject(FormBuilder);
    // private isUser = false;
    public visible = false;

    public registerModalVisible = false;
    public loginForm: FormGroup = this.formBuilder.group({
        email: ["", Validators.required],
        password: ["", Validators.required],
    });
    constructor(private authService: AuthService, private toastService: ToastService, private cartService: CartService) {}

    onHideDialog() {
        this.loginForm.reset();
    }

    onFormSubmit() {
        this.authService
            .login({
                email: this.loginForm.controls["email"].value,
                password: this.loginForm.controls["password"].value,
            })
            .pipe(
                take(1),
                tap((res) => {
                    this.visible = false;
                    this.toastService.show("Successful login", "success");
                }),
                concatMap((res) => {
                    const localCart = localStorage.getItem("localCart");
                    localStorage.removeItem("localCart");
                    const isUser = res.role === UserRoles.User;

                    if (localCart && isUser) {
                        return this.cartService.updateCart(JSON.parse(localCart)).pipe(map((updateCartRes) => ({ isUser, updated: true, updateCartRes })));
                    }

                    if (!localCart && isUser) {
                        return of({ isUser, updated: false, updateCartRes: null });
                    }

                    return of({ isUser: false, updated: false, updateCartRes: null });
                }),
                concatMap((res) => {
                    if (res.isUser) {
                        if (res.updated) this.toastService.show(res.updateCartRes?.message!, "info");
                        return this.cartService.getCartProducts();
                    }
                    return of(null);
                })
            )
            .subscribe(
                (res) => {
                    if (res) {
                        this.cartService.cartItemsSubject$.next(res.items.reduce((acc, curr) => {
                        return acc + curr.quantity!;
                    },0))
                    }
                },
                (error) => {
                    this.toastService.show(error.error.message, error.error.typeOfToast ?? "error");
                }
            );
    }
}
