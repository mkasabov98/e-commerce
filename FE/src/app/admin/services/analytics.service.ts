import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnalyticsTimeseriesResponse, AnalyticsBreakdown } from '../models/analytics.models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    constructor(private http: HttpClient) {}

    getTimeseries(params: { startDate: string; endDate: string; groupBy: string }): Observable<AnalyticsTimeseriesResponse> {
        return this.http.get<AnalyticsTimeseriesResponse>(`${environment.apiUrl}/admin/analytics/timeseries`, { params });
    }

    getBreakdown(params: { startDate: string; endDate: string }): Observable<AnalyticsBreakdown> {
        return this.http.get<AnalyticsBreakdown>(`${environment.apiUrl}/admin/analytics/breakdown`, { params });
    }
}
