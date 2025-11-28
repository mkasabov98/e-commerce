import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule} from 'primeng/toast'
import { ToastService } from './services/toast.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ToastModule],
    providers: [ToastService, MessageService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true
})
export class AppComponent {
  title = 'FE';
}
