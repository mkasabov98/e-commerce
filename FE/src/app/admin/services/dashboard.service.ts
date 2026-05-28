import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { DashboardStats } from "../models/dashboard.models";

@Injectable({ providedIn: "root" })
export class DashboardService {
    constructor(private http: HttpClient) {}

    getStats(params: { timeframe?: string; categoryId?: number | null; status?: number | null }): Observable<DashboardStats> {
        const query: Record<string, any> = {};
        if (params.timeframe && params.timeframe !== "all") query["timeframe"] = params.timeframe;
        if (params.categoryId != null) query["categoryId"] = params.categoryId;
        if (params.status != null) query["status"] = params.status;
        return this.http.get<DashboardStats>(`${environment.apiUrl}/admin/dashboard`, { params: query });
    }
}
