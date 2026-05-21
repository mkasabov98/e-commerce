export type InventoryStatus = "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";
export type InventorySeverity = "success" | "warn" | "danger";

export function getInventoryStatus(stock: number): InventoryStatus {
    if (stock === 0) return "OUTOFSTOCK";
    if (stock <= 5) return "LOWSTOCK";
    return "INSTOCK";
}

export function getInventorySeverity(stock: number): InventorySeverity {
    if (stock === 0) return "danger";
    if (stock <= 5) return "warn";
    return "success";
}
