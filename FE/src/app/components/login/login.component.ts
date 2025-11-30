import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { concatMap, of, take, tap } from 'rxjs';
import { PasswordModule } from 'primeng/password';
import { CartService } from '../../services/cart.service';
import { UserRoles } from '../../models/auth.models';

@Component({
    selector: 'app-login',
    imports: [
        Button,
        DialogModule,
        ReactiveFormsModule,
        FloatLabel,
        InputTextModule,
        PasswordModule,
    ],
    providers: [ToastService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: true,
})
export class LoginComponent {
    private formBuilder = inject(FormBuilder);
    private isAdmin = false;
    public visible = false;

    public registerModalVisible = false;
    public loginForm: FormGroup = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
    });
    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private cartService: CartService
    ) {}

    onHideDialog() {
        this.loginForm.reset();
    }

    onFormSubmit() {
        this.authService
            .login({
                email: this.loginForm.controls['email'].value,
                password: this.loginForm.controls['password'].value,
            })
            .pipe(
                take(1),
                tap((res) => {
                    this.isAdmin = res.role === UserRoles.Admin;
                    this.visible = false;
                    this.toastService.show('Successful login', 'success');
                }),
                concatMap(() => {
                    const localCart = localStorage.getItem('localCart');
                    localStorage.removeItem('localCart');
                    return localCart && this.isAdmin
                        ? this.cartService.updateCart(JSON.parse(localCart))
                        : of(null);
                })
            )
            .subscribe(
                (res) => {
                    if (res) {
                        this.toastService.show(res?.message!, 'info');
                    }
                },
                (error) => {
                    this.toastService.show(
                        error.error.message,
                        error.error.typeOfToast ?? 'error'
                    );
                }
            );
    }
}
