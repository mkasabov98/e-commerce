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
    topProducts: {
        productId: number;
        name: string;
        category: string;
        unitsSold: number;
        revenue: number;
        profit: number;
    }[];
    lowStock: {
        id: number;
        name: string;
        stock: number;
        category: string;
    }[];
    totalProducts: number;
    totalUsers: number;
}
