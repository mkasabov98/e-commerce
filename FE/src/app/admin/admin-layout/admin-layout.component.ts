import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NO_USER } from '../../constants/constants';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
    userEmail = '';
    private destroy$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.authService.loggedUserSubject
            .pipe(takeUntil(this.destroy$))
            .subscribe((user) => (this.userEmail = user?.email ?? ''));
    }

    logout() {
        this.authService.loggedUserSubject.next(NO_USER);
        localStorage.removeItem('jwt');
        this.router.navigate(['/e-com']);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
