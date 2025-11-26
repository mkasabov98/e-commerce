import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home-page',
    imports: [],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
    standalone: true
})
export class HomePage implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService
            .login({ email: 'user1123@ab.com', password: 'user1123@abv.com' })
            .pipe()
            .subscribe((res) =>{
                //save token in localStorage
                
            });

        this.authService
            .products()
            .pipe()
            .subscribe((res) => console.log(res));

        this.authService
            .registerUser({ email: 'user2@abv.com', password: 'user2@abv.com' })
            .pipe()
            .subscribe((res) => console.log(res));
    }
}
