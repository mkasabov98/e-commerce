import { HttpClient, HttpHandler, HttpRequest } from "@angular/common/http";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandler) {
    const jwt = JSON.parse(localStorage.getItem('loggedUser') || '');

    const clonedReq = req.clone();

    
} 