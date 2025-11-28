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
import { take } from 'rxjs';
import { PasswordModule } from 'primeng/password';

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
    providers: [AuthService, ToastService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: true,
})
export class LoginComponent {
    private formBuilder = inject(FormBuilder);
    public visible = false;

    public registerModalVisible = false;
    public loginForm: FormGroup = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
    });
    constructor(
        private authService: AuthService,
        private toastService: ToastService
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
            .pipe(take(1))
            .subscribe(
                (res) => {
                    this.visible = false;
                    this.toastService.show('Successful login', 'success');
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
