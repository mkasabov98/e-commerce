import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ButtonModule, Button } from 'primeng/button';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';

@Component({
    selector: 'app-home-page',
    imports: [ NavigationBarComponent],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
    standalone: true,
})
export class HomePage implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit(): void {}
}
