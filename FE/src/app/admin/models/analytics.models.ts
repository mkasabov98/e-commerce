export interface AnalyticsTimeseriesResponse {
    timeseries: Array<{ period: string; revenue: number; profit: number; orderCount: number; discountAmount: number }>;
    users: Array<{ period: string; newUsers: number }>;
}

export interface AnalyticsBreakdown {
    ordersByStatus: { pending: number; paid: number; shipped: number; delivered: number; cancelled: number };
    revByCategory: Array<{ category: string; revenue: number }>;
    topProducts: Array<{ productId: number; name: string; category: string; unitsSold: number; revenue: number; profit: number }>;
    revByCountry: Array<{ country: string; revenue: number; orderCount: number }>;
    marginByCategory: Array<{ category: string; marginPct: number; profit: number; revenue: number }>;
    discountStatus: { used: number; activeUnused: number; expiredUnused: number };
}
