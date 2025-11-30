import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProductCardComponent } from "../product-card/product-card.component";
import { ScrollPanelModule} from 'primeng/scrollpanel'

@Component({
    selector: 'app-home-page',
    imports: [ ProductCardComponent, ScrollPanelModule],
    templateUrl: './home-page.html',
    styleUrl: './home-page.scss',
    standalone: true,
})
export class HomePage implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit(): void {}
}
