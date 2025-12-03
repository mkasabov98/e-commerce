import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page.component';
import { CartComponent } from './components/cart/cart.component';
import { userGuard } from './guards/user.guard';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
    {
        path: 'e-com',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomePage
            },
            {
                path: 'cart',
                component: CartComponent,
                canActivate: [userGuard]
            }
        ],
    },
    {
        path: '**',
        redirectTo: 'e-com',
        pathMatch: 'full',
    },
];
