import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { ProductCardComponent } from "../product-card/product-card.component";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { SideNavComponent } from "../side-nav/side-nav.component";
import { ProductsService } from "../../services/products.service";
import { Subject, take, takeUntil } from "rxjs";
import { cardProduct, getProductsParams, sortByOptions } from "../../models/products.models";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { PaginatorModule, PaginatorState } from "primeng/paginator";

@Component({
    selector: "app-home-page",
    imports: [ProductCardComponent, ScrollPanelModule, SideNavComponent, ProgressSpinnerModule, PaginatorModule],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.scss",
    standalone: true,
})
export class HomePage implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    private defaultProductParams: getProductsParams = {
        pageNumber: 0,
        itemsPerPage: 20,
        categories: [],
        sortBy: sortByOptions.ASC,
        searchString: "",
    };
    private defaultPaginatorParams = {
        first: 0,
        rows: 20,
        totalRecords: 0,
    };

    private fetchProductsParams: getProductsParams = { ...this.defaultProductParams };
    public products: cardProduct[] = [];
    public loading = true;
    public paginationParams = { ...this.defaultPaginatorParams };

    constructor(private authService: AuthService, private productsService: ProductsService) {}

    ngOnInit(): void {
        this.productsService.filtersSubject.pipe(takeUntil(this.destroy$)).subscribe((res) => {
            this.paginationParams.first = 0;
            this.fetchProductsParams = { ...this.fetchProductsParams, categories: res.categories, sortBy: res.sortBy, searchString: res.searchString, pageNumber: 0, itemsPerPage: this.paginationParams.rows };
            this.fetchProducts(this.fetchProductsParams);
        });
    }

    fetchProducts(params: getProductsParams) {
        this.loading = true;
        this.productsService
            .getProducts(params)
            .pipe(take(1))
            .subscribe((res) => {
                this.products = res.data;
                this.paginationParams.totalRecords = res.meta.totalItems;
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
                this.loading = false;
            });
    }

    onPageChange(event: PaginatorState) {
        this.fetchProductsParams.pageNumber = event.page;
        this.fetchProductsParams.itemsPerPage = event.rows;
        this.fetchProducts(this.fetchProductsParams);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.productsService.filtersSubject.next({ categories: [], sortBy: undefined, searchString: "" });
    }
}
