import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './services/toast.service';
import { AuthService } from './services/auth.service';
// import { NavigationBarComponent } from "./components/navigation-bar/navigation-bar.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ToastModule,],
    providers: [ToastService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true,
})
export class AppComponent implements OnInit{
    title = 'FE';

    constructor(private authService: AuthService, private toastService: ToastService){}
    ngOnInit(): void {
        const isTokenExpired = this.authService.tokenExpired();
        // toastService not working from app component
        if (isTokenExpired) {
            this.toastService.show('Your session has expired', 'info')
        }
    }
}
