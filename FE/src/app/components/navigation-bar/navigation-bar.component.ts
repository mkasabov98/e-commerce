import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { RegisterComponent } from "../register/register.component";
import { LoginComponent } from "../login/login.component";

@Component({
    selector: 'app-navigation-bar',
    imports: [
    RegisterComponent,
    LoginComponent
],
    providers: [],
    templateUrl: './navigation-bar.component.html',
    styleUrl: './navigation-bar.component.scss',
    standalone: true,
})
export class NavigationBarComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    constructor(private authService: AuthService) {}

    ngOnInit() {}

    ngOnDestroy() {
        this.destroy$.next();
    }
}
