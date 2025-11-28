import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { loggedUser, loginResponse } from '../models/auth.models';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    NO_USER = {email: '', id: -1, role: -1};
    loggedUserSubject = new BehaviorSubject<loggedUser>(this.NO_USER);

    constructor(private http: HttpClient) {}

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
                    this.loggedUserSubject.next(res.loggedUser);
                    return res.loggedUser;
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

    // public products(): Observable<any> {
    //     return this.http.get<any>(`${environment.apiUrl}/products`, {
    //         observe: 'body',
    //         headers: this.headers
    //     });
    // }
}
