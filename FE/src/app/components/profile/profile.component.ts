import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccordionModule } from "primeng/accordion";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { SkeletonModule } from "primeng/skeleton";
import { Order } from "../../models/order.models";
import { OrderService } from "../../services/order.service";
import { take } from "rxjs";

@Component({
    selector: "app-profile",
    imports: [CommonModule, AccordionModule, TableModule, TagModule, SkeletonModule],
    templateUrl: "./profile.component.html",
    styleUrl: "./profile.component.scss",
    standalone: true,
})
export class ProfileComponent implements OnInit {
    public orders: Order[] = [];
    public isLoading = true;

    constructor(private orderService: OrderService) {}

    ngOnInit(): void {
        this.orderService
            .getOrders()
            .pipe(take(1))
            .subscribe({
                next: (orders) => {
                    this.orders = orders;
                    this.isLoading = false;
                },
                error: () => {
                    this.isLoading = false;
                },
            });
    }

    getStatusLabel(status: number): string {
        return ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"][status] ?? "Unknown";
    }

    getStatusSeverity(status: number): "warn" | "info" | "secondary" | "success" | "danger" {
        return (["warn", "info", "secondary", "success", "danger"] as const)[status] ?? "secondary";
    }
}
