import {
    HttpErrorResponse,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const router = inject(Router);
    const url = req.url;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const unprotectedRoutes = [
        `${environment.apiUrl}/auth`,
        `${environment.apiUrl}/products`,
    ];

    if (unprotectedRoutes.some((x) => url.includes(x))) {
        next(
            req.clone({
                setHeaders: headers,
            })
        );
    }
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp < now) {
            localStorage.removeItem('jwt');
            router.navigate(['/e-com']);
            return throwError(
                () =>
                    new HttpErrorResponse({
                        error: { message: 'Session expired', typeOfToast: 'info' },
                        status: 401,
                        statusText: 'Unauthorized',
                    })
            );
        }
    }

    headers['Authorization'] = `Bearer ${jwt}`;
    const clonedReq = req.clone({
        setHeaders: headers,
    });

    return next(clonedReq);
};
