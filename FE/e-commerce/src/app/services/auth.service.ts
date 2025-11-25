import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) {}

    private headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

    public login(body: { email: string; password: string }): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/user/login`, body, {
            observe: 'body',
            headers: this.headers,
        });
    }

    public registerUser(body: {email: string; password: string}) : Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/user/register`, body, {
            headers: this.headers,
            observe: 'body'
        })
    }

    public products(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/products`, {
            observe: 'body',
            headers: this.headers
        });
    }
}
