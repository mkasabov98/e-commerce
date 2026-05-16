import { Component, EventEmitter, inject, OnInit, Output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Button } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { FloatLabel } from "primeng/floatlabel";
import { InputTextModule } from "primeng/inputtext";
import { ToastService } from "../../services/toast.service";
import { SelectModule } from "primeng/select";
import { COUNTRIES } from "../../constants.ts/constants";
import { take } from "rxjs";
import { AddressService } from "../../services/address.service";
import { city, state } from "../../models/address.models";

@Component({
    selector: "app-create-address",
    imports: [Button, DialogModule, ReactiveFormsModule, InputTextModule, FloatLabel, SelectModule],
    providers: [ToastService],
    templateUrl: "./create-address.component.html",
    styleUrl: "./create-address.component.scss",
    standalone: true,
})
export class CreateAddressComponent implements OnInit {
    @Output() onAddressCreate: EventEmitter<any> = new EventEmitter();

    private formBuilder = inject(FormBuilder);

    public addressForm = this.formBuilder.group({
        country: [null],
        state: [{ value: null, disabled: true }],
        city: [{ value: null, disabled: true }],
        address: [{ value: null, disabled: true }],
    });

    public visible = false;
    public countries = COUNTRIES;
    public states: state[] = [];
    public cities: city[] = [];

    constructor(private addressService: AddressService, private toastService: ToastService) {}

    ngOnInit(): void {
        this.formDependencies();
    }

    formDependencies() {
        const countryControl = this.addressForm.get("country");
        const stateControl = this.addressForm.get("state");
        const cityControl = this.addressForm.get("city");
        const addressControl = this.addressForm.get("address");

        countryControl?.valueChanges.subscribe((countryValue) => {
            stateControl?.disable();
            stateControl?.setValue(null);
            cityControl?.disable();
            cityControl?.setValue(null);
            addressControl?.disable();
            addressControl?.setValue(null);
            this.states = [];
            this.cities = [];

            if (countryValue) {
                this.fetchStates(countryValue);
            }
        });

        stateControl?.valueChanges.subscribe((stateValue) => {
            cityControl?.disable();
            cityControl?.setValue(null);
            addressControl?.disable();
            addressControl?.setValue(null);
            this.cities = [];

            if (stateValue) {
                const country = this.addressForm.value.country as unknown as { code: string };
                this.fetchCities(country.code, (stateValue as unknown as state).iso2);
            }
        });

        cityControl?.valueChanges.subscribe((cityValue) => {
            if (cityValue) {
                addressControl?.enable();
                addressControl?.setValue(null);
            } else {
                addressControl?.disable();
                addressControl?.setValue(null);
            }
        });
    }

    fetchStates(country: { code: string; name: string }) {
        this.addressService
            .getStates(country.code)
            .pipe(take(1))
            .subscribe({
                next: (res) => {
                    this.states = res;
                    this.addressForm.controls.state.enable();
                },
                error: (err) => this.toastService.show(err.error?.message ?? "Failed to load states", "warn"),
            });
    }

    fetchCities(countryCode: string, stateCode: string) {
        this.addressService
            .getCities(countryCode, stateCode)
            .pipe(take(1))
            .subscribe({
                next: (res) => {
                    this.cities = res;
                    this.addressForm.controls.city.enable();
                },
                error: (err) => this.toastService.show(err.error?.message ?? "Failed to load cities", "warn"),
            });
    }

    disableButton() {
        const { country, state, city, address } = this.addressForm.controls;
        return !country.value || !state.value || !city.value || !address.value;
    }

    onFormSubmit() {
        const country = this.addressForm.value.country as unknown as { name: string; code: string };
        const city = this.addressForm.value.city as unknown as { name: string; id: number };
        const address = this.addressForm.value.address!;

        this.addressService
            .createAddress({ country: country.name, city: city.name, address })
            .subscribe({
                next: () => {
                    this.toastService.show("Address has been created!", "success");
                    this.onAddressCreate.emit();
                    this.visible = false;
                    this.resetForm();
                },
                error: (err) => this.toastService.show(err.error?.message ?? "Failed to create address", "warn"),
            });
    }

    resetForm() {
        this.addressForm.reset();
        this.states = [];
        this.cities = [];
    }
}
