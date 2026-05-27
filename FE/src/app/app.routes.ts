import { Routes } from '@angular/router';
import { HomePage } from './components/home-page/home-page.component';
import { CartComponent } from './components/cart/cart.component';
import { userGuard } from './guards/user.guard';
import { adminGuard } from './guards/admin.guard';
import { nonAdminGuard } from './guards/non-admin.guard';
import { LayoutComponent } from './components/layout/layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { cartGuard } from './guards/cart.guard';

export const routes: Routes = [
    {
        path: 'e-com',
        component: LayoutComponent,
        canActivate: [nonAdminGuard],
        children: [
            {
                path: '',
                component: HomePage
            },
            {
                path: 'product/:id',
                component: ProductPageComponent
            },
            {
                path: 'cart',
                component: CartComponent,
                canActivate: [cartGuard]
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [userGuard]
            }
        ],
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
    },
    {
        path: '**',
        redirectTo: 'e-com',
        pathMatch: 'full',
    },
];
