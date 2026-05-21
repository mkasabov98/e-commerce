import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { CreateAddressComponent } from "../create-address/create-address.component";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { FloatLabel } from "primeng/floatlabel";
import { MessageModule } from "primeng/message";
import { address } from "../../models/address.models";
import { AddressService } from "../../services/address.service";
import { firstValueFrom, take } from "rxjs";
import { FormsModule } from "@angular/forms";
import { CartService } from "../../services/cart.service";
import { Stripe, StripeCardElement } from "@stripe/stripe-js";

@Component({
    selector: "app-process-order",
    imports: [
        FormsModule,
        CreateAddressComponent,
        MessageModule,
        ButtonModule,
        SelectModule,
        FloatLabel,
    ],
    templateUrl: "./process-order.component.html",
    styleUrl: "./process-order.component.scss",
    standalone: true,
})
export class ProcessOrderComponent implements OnInit, OnDestroy {
    @Output() paymentComplete = new EventEmitter<void>();

    private stripe: Stripe | null = null;
    private cardElement: StripeCardElement | null = null;

    public currentStep = 1;
    public addresses: address[] = [];
    public selectedAddress: address | null = null;
    public isProcessing = false;
    public cardComplete = false;
    public cardError: string | null = null;

    constructor(private addressService: AddressService, private cartService: CartService) {}

    ngOnInit(): void {
        this.cartService.getStripe().then((stripe) => {
            this.stripe = stripe;
        });
        this.fetchAddresses();
    }

    ngOnDestroy(): void {
        this.cardElement?.destroy();
    }

    fetchAddresses() {
        this.addressService
            .getAddresses()
            .pipe(take(1))
            .subscribe((res) => {
                this.addresses = res;
            });
    }

    onAddressCreate() {
        this.fetchAddresses();
    }

    onProceedToPayment() {
        this.currentStep = 2;
        setTimeout(() => this.mountCardElement(), 0);
    }

    goBack() {
        this.currentStep = 1;
        this.cardComplete = false;
        this.cardError = null;
        this.cardElement?.destroy();
        this.cardElement = null;
    }

    private mountCardElement() {
        if (!this.stripe || this.cardElement) return;
        const elements = this.stripe.elements();
        this.cardElement = elements.create("card", {
            style: {
                base: {
                    fontSize: "16px",
                    fontFamily: "inherit",
                    color: "#495057",
                    "::placeholder": { color: "#6c757d" },
                },
                invalid: { color: "#dc3545" },
            },
            hidePostalCode: true
        });
        this.cardElement.mount("#card-element");
        this.cardElement.on("change", (event) => {
            this.cardComplete = event.complete;
            this.cardError = event.error?.message ?? null;
        });
    }

    async handlePayment() {
        if (!this.stripe || !this.cardElement || !this.selectedAddress?.id || this.isProcessing) return;

        this.isProcessing = true;
        this.cardError = null;

        try {
            const { clientSecret } = await firstValueFrom(
                this.cartService.initiatePayment(this.selectedAddress.id)
            );

            const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: this.cardElement },
            });

            if (error) {
                this.cardError = error.message ?? "Payment failed";
            } else if (paymentIntent?.status === "succeeded") {
                this.paymentComplete.emit();
            }
        } catch (err: any) {
            const errors: string[] | undefined = err?.error?.errors;
            this.cardError = errors?.length ? errors.join(" ") : (err?.error?.message ?? "An unexpected error occurred");
        } finally {
            this.isProcessing = false;
        }
    }
}
