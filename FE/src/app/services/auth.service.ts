import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { loggedUser } from '../models/auth.models';
import { NO_USER } from '../constants.ts/constants';
import { ToastService } from './toast.service';
// import jwt from ''

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public loggedUserSubject = new BehaviorSubject<loggedUser>(NO_USER);

    constructor(private http: HttpClient) {}

    private toastService = inject(ToastService)
    private headers: HttpHeaders = new HttpHeaders().set(
        'Content-Type',
        'application/json'
    );

    public login(body: { email: string; password: string }): Observable<any> {
        return this.http
            .post<any>(`${environment.apiUrl}/auth/login`, body, {
                observe: 'body',
                headers: this.headers,
            })
            .pipe(
                map((res) => {
                    localStorage.setItem('jwt', JSON.stringify(res.token));
                    this.loggedUserSubject.next(res.userData);
                    return res.userData;
                })
            );
    }

    public registerUser(body: {
        email: string;
        password: string;
    }): Observable<any> {
        return this.http.post<any>(
            `${environment.apiUrl}/auth/register`,
            body,
            {
                headers: this.headers,
                observe: 'body',
            }
        );
    }

    public checkJWT (): [isJwt: boolean, expired: boolean] {
        const jwt = localStorage.getItem('jwt');

        if (jwt) {
            const payload = JSON.parse(atob(jwt.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);

            if (payload.exp < now) {
                localStorage.removeItem('jwt');
                this.loggedUserSubject.next(NO_USER);
                this.toastService.show('Your session has expired');
                return [true, true];
            } else {
                this.loggedUserSubject.next({
                    id: payload.id,
                    email: payload.email,
                    role: payload.role,
                });
                return [true, false];
            }
        }
        return [false, false];
    }
}
