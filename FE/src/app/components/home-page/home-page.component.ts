import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { ProductCardComponent } from "../product-card/product-card.component";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { SideNavComponent } from "../side-nav/side-nav.component";
import { ProductsService } from "../../services/products.service";
import { Subject, take, takeUntil, timeout } from "rxjs";
import { cardProduct, getProductsParams, sortByOptions } from "../../models/products.models";
import { ProgressSpinnerModule } from "primeng/progressspinner";

@Component({
    selector: "app-home-page",
    imports: [ProductCardComponent, ScrollPanelModule, SideNavComponent, ProgressSpinnerModule],
    templateUrl: "./home-page.component.html",
    styleUrl: "./home-page.component.scss",
    standalone: true,
})
export class HomePage implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    private defaultProductParams: getProductsParams = {
        pageNumber: 1,
        itemsPerPage: 50,
        categories: [],
        sortBy: sortByOptions.ASC,
        searchString: "",
    };
    private fetchProductsParams: getProductsParams = { ...this.defaultProductParams };
    public products: cardProduct[] = [];
    public loading = true;

    constructor(private authService: AuthService, private productsService: ProductsService) {}

    ngOnInit(): void {
        this.productsService.filtersSubject.pipe(takeUntil(this.destroy$)).subscribe((res) => {
            console.log(res);
            this.fetchProductsParams = { ...this.fetchProductsParams, categories: res.categories, sortBy: res.sortBy, searchString: res.searchString };
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
                    this.loading = false;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
