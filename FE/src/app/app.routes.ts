import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page';
import { CartComponent } from './components/cart/cart.component';
import { userGuard } from './guards/user.guard';

export const routes: Routes = [
    {
        path: 'e-com',
        children: [
            {
                path: '',
                component: HomePage,
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
