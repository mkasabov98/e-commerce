export interface address {
    country: string;
    city: string;
    address: string;
    id?: number;
    userId?: number;
}

export interface state {
    name: string;
    iso2: string;
}

export interface city {
    id: number;
    name: string;
}
