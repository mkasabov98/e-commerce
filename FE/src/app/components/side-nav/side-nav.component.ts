import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { ProductsService } from "../../services/products.service";
import { filter, Subject, take, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { ListboxModule } from "primeng/listbox";
import { productCategory, sortByOptions } from "../../models/products.models";
import { FormsModule } from "@angular/forms";
import { PanelModule } from "primeng/panel";
import { RadioButtonModule } from "primeng/radiobutton";
import { Button } from "primeng/button";

@Component({
    selector: "app-side-nav",
    imports: [CommonModule, ListboxModule, FormsModule, RadioButtonModule, PanelModule, Button],
    templateUrl: "./side-nav.component.html",
    styleUrl: "./side-nav.component.scss",
    standalone: true,
})
export class SideNavComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public productCategories = signal<productCategory[]>([]);
    public selectedCategories = signal<number[]>([]);
    public sortByEnum = sortByOptions;
    public sortBy: sortByOptions | undefined = undefined;

    constructor(private productsService: ProductsService) {}

    ngOnInit() {
        this.fetchCategories();
    }

    fetchCategories() {
        this.productsService
            .getCategories()
            .pipe(take(1))
            .subscribe((res) => {
                this.productCategories.set(res);
                this.productsService.filtersSubject.pipe(takeUntil(this.destroy$)).subscribe((filters) => {
                    this.selectedCategories.set([...filters.categories]);
                    this.sortBy = filters.sortBy;
                });
            });
    }

    onSortBy() {
        const currentFilters = this.productsService.filtersSubject.getValue();
        this.productsService.filtersSubject.next({ ...currentFilters, sortBy: this.sortBy });
    }

    onSelectionChange() {
        const currentFilters = this.productsService.filtersSubject.getValue();
        console.log(this.productsService.filtersSubject.getValue())
        this.productsService.filtersSubject.next({ ...currentFilters, categories: [...this.selectedCategories()] });
    }

    clearFilters() {
        const currentFilters = this.productsService.filtersSubject.getValue();
        this.productsService.filtersSubject.next({...currentFilters, categories: [], sortBy: undefined});
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }
}
