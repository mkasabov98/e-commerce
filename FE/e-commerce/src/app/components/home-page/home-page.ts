import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home-page',
    imports: [],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService
            .login({ email: 'normalUser123@test.com', password: '1221an,as' })
            .pipe()
            .subscribe((res) => console.log(res));

        this.authService
            .products()
            .pipe()
            .subscribe((res) => console.log(res));

        this.authService
            .registerUser({ email: 'user123@ab.com', password: 'user123@abv.com' })
            .pipe()
            .subscribe((res) => console.log(res));
    }
}
