import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
    revenue: number;
    orderCount: number;
    avgOrderValue: number;
    profit: number;
    ordersByStatus: {
        pending: number;
        paid: number;
        shipped: number;
        delivered: number;
        cancelled: number;
    };
    topProducts: Array<{
        productId: number;
        name: string;
        category: string;
        unitsSold: number;
        revenue: number;
        profit: number;
    }>;
    lowStock: Array<{
        id: number;
        name: string;
        stock: number;
        category: string;
    }>;
    totalProducts: number;
    totalUsers: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
    constructor(private http: HttpClient) {}

    getDashboardStats(params: {
        timeframe?: string;
        categoryId?: number | null;
        status?: number | null;
    }): Observable<DashboardStats> {
        const query: Record<string, any> = {};
        if (params.timeframe && params.timeframe !== 'all') query['timeframe'] = params.timeframe;
        if (params.categoryId != null) query['categoryId'] = params.categoryId;
        if (params.status != null) query['status'] = params.status;
        return this.http.get<DashboardStats>(`${environment.apiUrl}/admin/dashboard`, { params: query });
    }
}
