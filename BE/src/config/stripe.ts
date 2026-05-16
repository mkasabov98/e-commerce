import Stripe from "stripe";
import * as dotenv from "dotenv";

dotenv.config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined in environment variables.");
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2025-11-17.clover",
});

export default stripe;
